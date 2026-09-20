/** Passive, temporary input diagnostics. Never activates a control or changes
 * event propagation. Only numeric aggregates leave transient in-memory state.
 * @typedef {{isConnected: boolean, disabled?: boolean}} Control
 * @typedef {{pointerId?: number, button?: number, clientX?: number, clientY?: number, timeStamp?: number, isTrusted?: boolean, defaultPrevented?: boolean, detail?: number}} Input
 * @typedef {{control: Control, x: number, y: number, moved: boolean}} Press
 * @typedef {{control: Control, expires: number}} Release
 * @typedef {Record<string, number>} Metrics
 */

/** @param {{now: () => number, sample: (metrics: Metrics) => void}} options */
export function createInputProbe({now, sample}) {
  /** @type {Map<number, Press>} */ const pressed = new Map();
  /** @type {Release[]} */ let released = [];
  /** @type {number[]} */ let delays = [];
  let started = now(), priorTick = started;
  const empty = () => ({tapDowns: 0, tapReleases: 0, tapClicks: 0, tapCancelled: 0,
    tapMissingClicks: 0, tapDetached: 0, tapMoved: 0, tapRepeated: 0,
    tapReleaseHitMismatch: 0, tapDisabledRelease: 0, tapPreventedRelease: 0,
    tapUnmatchedClicks: 0, tapActivatedTouch: 0, tapRejected: 0,
    inputDelayMaxMs: 0, mainLagMaxMs: 0});
  let metrics = empty();
  /** @param {Input} event */
  function delay(event) {
    const value = now() - (event.timeStamp ?? now());
    // Ignore clocks with a different origin; do not publish misleading latency.
    if (value < 0 || value > 60000) return;
    delays.push(value); if (delays.length > 64) delays.shift();
    metrics.inputDelayMaxMs = Math.max(metrics.inputDelayMaxMs, value);
  }
  return {
    /** @param {Input} event @param {Control | null} control */
    down(event, control) {
      if (!control || event.isTrusted === false || (event.button ?? 0) !== 0 || pressed.size >= 8) return;
      delay(event); metrics.tapDowns++;
      if (released.some(value => value.control === control)) metrics.tapRepeated++;
      pressed.set(event.pointerId ?? 0, {control, x: event.clientX ?? 0, y: event.clientY ?? 0, moved: false});
    },
    /** @param {Input} event */
    move(event) {
      const press = pressed.get(event.pointerId ?? 0);
      if (press && Math.hypot((event.clientX ?? 0) - press.x, (event.clientY ?? 0) - press.y) > 12) press.moved = true;
    },
    /** @param {Input} event @param {{hitControl?:Control|null,disabled?:boolean}=} context */
    up(event, context = {}) {
      const press = pressed.get(event.pointerId ?? 0); if (!press) return;
      pressed.delete(event.pointerId ?? 0); delay(event);
      if (Math.hypot((event.clientX ?? 0) - press.x, (event.clientY ?? 0) - press.y) > 12) press.moved = true;
      if (!press.control.isConnected) { metrics.tapDetached++; return; }
      if (press.moved) { metrics.tapMoved++; return; }
      if (context.disabled || press.control.disabled) { metrics.tapDisabledRelease++; return; }
      if ('hitControl' in context && context.hitControl !== press.control) { metrics.tapReleaseHitMismatch++; return; }
      if (event.defaultPrevented) { metrics.tapPreventedRelease++; return; }
      metrics.tapReleases++;
      released.push({control: press.control, expires: now() + 550});
      if (released.length > 24) released.shift();
    },
    /** @param {Input} event */
    cancel(event) {
      if (pressed.delete(event.pointerId ?? 0)) metrics.tapCancelled++;
    },
    /** @param {Input} event @param {Control | null} control */
    click(event, control) {
      if (!control || event.isTrusted === false) return;
      const index = released.findIndex(value => value.control === control);
      if (index < 0) {
        // Keyboard/assistive activations do not need a preceding pointer press.
        if (event.detail !== 0) metrics.tapUnmatchedClicks++;
        return;
      }
      delay(event);
      if (now() > released[index].expires) metrics.tapMissingClicks++;
      else metrics.tapClicks++;
      released.splice(index, 1);
    },
    /** A validated native touch dispatch uses the normal command callback, but
     * is deliberately not reported as a browser-synthesized trusted click.
     * @param {Control} control @param {boolean=} rejected */
    touchResult(control, rejected = false) {
      const index = released.findLastIndex(value => value.control === control);
      if (index < 0) return;
      released.splice(index, 1);
      if (rejected) metrics.tapRejected++;
      else metrics.tapActivatedTouch++;
    },
    tick() {
      const time = now();
      metrics.mainLagMaxMs = Math.max(metrics.mainLagMaxMs, time - priorTick - 250);
      priorTick = time;
      released = released.filter(value => {
        if (!value.control.isConnected) { metrics.tapDetached++; return false; }
        if (time < value.expires) return true;
        metrics.tapMissingClicks++; return false;
      });
    },
    flush() {
      const ordered = delays.slice().sort((a, b) => a - b);
      sample({...metrics, inputDelayP95Ms: ordered.length ? ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * .95))] : 0,
        sampleSeconds: Math.max(0, (now() - started) / 1000)});
      metrics = empty(); delays = []; started = now();
    },
    reset() { pressed.clear(); released = []; priorTick = now(); }
  };
}

/** Explicitly started for two minutes. Closing settings does not stop the check;
 * disabling diagnostics, hiding the page, or its time limit does.
 * @param {{sample: (metrics: Metrics) => void, enabled: () => boolean, stopped: () => void,
 * document?: Document, now?: () => number}} options
 */
export function startInputDiagnostics({sample, enabled, stopped, document: doc = document, now = () => performance.now()}) {
  let active = true, lastSample = now();
  const began = lastSample, probe = createInputProbe({now, sample});
  /** @param {EventTarget|null} target @returns {Element | null} */
  function controlAt(target) {
    if (!(target instanceof Element)) return null;
    const value = target.closest('button,[role="button"],a[href],summary,[role="tab"],input[type="checkbox"],input[type="radio"]');
    // These are gesture surfaces, not click-driven controls.
    if (!value || value.matches('[data-troop],[data-pointer-control]')) return null;
    return value;
  }
  /** @param {Element|null} control */
  const disabled = control => !!control?.matches(':disabled,[aria-disabled="true"]');
  /** @param {Event} event */
  const down = event => { const control = controlAt(event.target); if (enabled() && !disabled(control)) probe.down(/** @type {PointerEvent} */ (event), control); };
  /** @param {Event} event */
  const move = event => probe.move(/** @type {PointerEvent} */ (event));
  /** @param {Event} event */
  const up = event => {
    const input = /** @type {PointerEvent} */ (event);
    const hit = typeof doc.elementFromPoint === 'function' ? controlAt(doc.elementFromPoint(input.clientX, input.clientY)) : undefined;
    probe.up(input, {disabled: disabled(controlAt(event.target)), ...(hit === undefined ? {} : {hitControl: hit})});
  };
  /** @param {Event} event */
  const cancel = event => probe.cancel(/** @type {PointerEvent} */ (event));
  /** @param {Event} event */
  const click = event => probe.click(/** @type {MouseEvent} */ (event), controlAt(event.target));
  /** @param {Event} event */
  const activated = event => { const control = /** @type {CustomEvent<{control?:Control}>} */ (event).detail?.control; if (control) probe.touchResult(control); };
  /** @param {Event} event */
  const rejected = event => { const control = /** @type {CustomEvent<{control?:Control}>} */ (event).detail?.control; if (control) probe.touchResult(control, true); };
  /** @type {[string, (event: Event) => void][]} */
  const listeners = [['pointerdown', down], ['pointermove', move], ['pointerup', up], ['pointercancel', cancel], ['click', click], ['stonewake-touch-activated', activated], ['stonewake-touch-rejected', rejected]];
  for (const [name, handler] of listeners) doc.addEventListener(name, handler, {capture: true, passive: true});
  const hidden = () => { if (doc.hidden) stop(); };
  doc.addEventListener('visibilitychange', hidden);
  const interval = setInterval(() => {
    if (!enabled()) { stop(false); return; }
    probe.tick();
    if (now() - began >= 120000) { stop(); return; }
    if (now() - lastSample >= 30000) { probe.flush(); lastSample = now(); }
  }, 250);
  /** @param {boolean=} keep */
  function stop(keep = true) {
    if (!active) return; active = false;
    clearInterval(interval);
    for (const [name, handler] of listeners) doc.removeEventListener(name, handler, true);
    doc.removeEventListener('visibilitychange', hidden);
    if (keep && enabled()) { probe.tick(); probe.flush(); }
    probe.reset(); stopped();
  }
  return stop;
}
