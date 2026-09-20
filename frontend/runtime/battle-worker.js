import {Kl} from '../core/rules.js';

/** @type {DedicatedWorkerGlobalScope} */
const workerScope = /** @type {any} */ (globalThis);
/** @param {MessageEvent<import('../contracts/game.js').WorkerRequest>} event */
workerScope.onmessage = ({data}) => {
  try { workerScope.postMessage({id: data.id, result: Kl(data.input)}); }
  catch (error) { workerScope.postMessage({id: data.id, error: error instanceof Error ? error.message : 'Battle simulation failed.'}); }
};
workerScope.postMessage({type: 'ready', build: 15});
