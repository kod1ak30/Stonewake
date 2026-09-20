/** @typedef {import('../contracts/game.js').BattleInput} BattleInput */
/** @typedef {import('../contracts/game.js').BattleResult} BattleResult */
/** @typedef {Pick<Worker, 'postMessage' | 'terminate' | 'onmessage' | 'onerror'>} WorkerPort */
/** @typedef {{worker: WorkerPort, dispose?: () => void}} WorkerHandle */
/** @typedef {{id: number, input: BattleInput, callback: (result: BattleResult, meta: {pending: boolean}) => void, onError?: (error: string) => void}} Job */

/** Load an independently bundled entry. WKWebView custom schemes need a Blob
 * transport because WebKit cannot construct a Worker directly from that scheme.
 * Its contents are the compiled worker asset, never serialized function bodies.
 * @returns {Promise<WorkerHandle>}
 */
export async function openBattleWorker() {
  const url = new URL('./battle-worker.js', import.meta.url);
  if (typeof __STONEWAKE_WORKER_VERSION__ === 'string') url.searchParams.set('v', __STONEWAKE_WORKER_VERSION__);
  if (globalThis.location?.protocol !== 'stonewake:') {
    return {worker: new Worker(url, {name: 'Stonewake combat'})};
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('The battle engine could not be loaded.');
  const source = await response.blob();
  const objectURL = URL.createObjectURL(new Blob([source], {type: 'text/javascript'}));
  try {
    return {worker: new Worker(objectURL, {name: 'Stonewake combat'}), dispose: () => URL.revokeObjectURL(objectURL)};
  } catch (error) {
    URL.revokeObjectURL(objectURL);
    throw error;
  }
}

/** @param {'worker' | 'failed'} engine @param {string=} reason */
function reportRuntime(engine, reason) {
  const detail = {engine, ...(reason ? {reason} : {})};
  globalThis.dispatchEvent?.(new CustomEvent('stonewake-runtime-status', {detail}));
  const host = /** @type {typeof globalThis & {webkit?: {messageHandlers?: {stonewake?: {postMessage: (value: unknown) => void}}}}} */ (globalThis);
  host.webkit?.messageHandlers?.stonewake?.postMessage({kind: 'runtimeStatus', ...detail});
}

/** Coalesce forecasts, publish completed prefixes, and keep simulation off the
 * render thread. A worker failure is explicit and cannot silently freeze touch.
 * @param {{open?: () => Promise<WorkerHandle>, report?: typeof reportRuntime, timeoutMs?: number}=} options
 */
export function createBattleRuntime({open = openBattleWorker, report = reportRuntime, timeoutMs = 10000} = {}) {
  /** @type {WorkerHandle | null} */ let handle = null;
  /** @type {Job | null} */ let pending = null;
  /** @type {Job | null} */ let current = null;
  let sequence = 0, cancelledBefore = 0, lastPublished = 0;
  let ready = false, busy = false, closed = false, failed = '';
  const bootTimeout = setTimeout(() => fail('The battle engine did not start. Reopen the battle to retry.'), timeoutMs);

  function run() {
    if (!ready || busy || !pending || closed || failed) return;
    current = pending;
    pending = null;
    busy = true;
    try { handle?.worker.postMessage({id: current.id, input: current.input}); }
    catch { fail('The battle engine stopped. Reopen the battle to retry.'); }
  }
  /** @param {string} message */
  function fail(message) {
    if (closed || failed) return;
    failed = message;
    clearTimeout(bootTimeout);
    handle?.worker.terminate();
    handle?.dispose?.();
    handle = null;
    busy = false;
    report('failed', message);
    for (const job of [current, pending]) if (job && job.id > cancelledBefore) job.onError?.(message);
    current = pending = null;
  }
  void open().then(value => {
    if (closed || failed) { value.worker.terminate(); value.dispose?.(); return; }
    handle = value;
    value.worker.onmessage = ({data}) => {
      if (closed || failed) return;
      if (data?.type === 'ready') {
        clearTimeout(bootTimeout);
        ready = true;
        report('worker');
        run();
        return;
      }
      if (!current || data?.id !== current.id) return;
      busy = false;
      const job = current;
      current = null;
      if (job.id > lastPublished && job.id > cancelledBefore) {
        if (data.error) job.onError?.(String(data.error));
        else { lastPublished = job.id; job.callback(data.result, {pending: !!pending}); }
      }
      run();
    };
    value.worker.onerror = event => { event?.preventDefault?.(); fail('The battle engine stopped. Reopen the battle to retry.'); };
  }).catch(() => fail('The battle engine could not load. Reopen the battle to retry.'));

  return {
    /** @param {BattleInput} input @param {Job['callback']} callback @param {Job['onError']=} onError */
    request(input, callback, onError) {
      if (closed) return;
      if (failed) { onError?.(failed); return; }
      pending = {id: ++sequence, input, callback, onError};
      run();
    },
    cancel() { cancelledBefore = ++sequence; pending = null; },
    close() {
      closed = true;
      pending = current = null;
      clearTimeout(bootTimeout);
      handle?.worker.terminate();
      handle?.dispose?.();
      handle = null;
    },
    get threaded() { return !!handle && !failed && !closed; },
    get status() { return closed ? 'closed' : failed ? 'failed' : ready ? 'ready' : 'starting'; }
  };
}
