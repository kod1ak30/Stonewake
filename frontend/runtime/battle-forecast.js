import {createBattleRuntime} from './battle-runtime.js';

/** @typedef {import('../contracts/game.js').BattleInput} BattleInput */
/** @typedef {import('../contracts/game.js').BattleResult} BattleResult */
/** @typedef {{result: BattleResult | null, pending: boolean, error: string}} ForecastState */

/** Own a battle forecast independently of React renders. A failed or cancelled
 * forecast can never be settled, and retry always uses the latest saved orders.
 * Historical versions keep their original synchronous simulation semantics.
 * @param {{simulateLegacy: (input: BattleInput) => BattleResult, onChange: (state: ForecastState) => void, openRuntime?: typeof createBattleRuntime}} options
 */
export function createBattleForecast({simulateLegacy, onChange, openRuntime = createBattleRuntime}) {
  /** @type {ReturnType<typeof createBattleRuntime> | null} */ let runtime = null;
  /** @type {BattleInput | null} */ let latest = null;
  /** @type {ForecastState} */ let state = {result: null, pending: false, error: ''};
  let epoch = 0, closed = false;
  /** @param {ForecastState} next */
  function publish(next) { state = next; onChange(next); }
  /** @param {string} error @param {number} generation */
  function fail(error, generation) {
    if (closed || generation !== epoch) return;
    epoch++;
    runtime?.close();
    runtime = null;
    publish({result: null, pending: false, error});
  }
  /** @param {BattleInput} input @param {{reset?: boolean}=} options */
  function request(input, {reset = false} = {}) {
    if (closed) return;
    if (reset) { epoch++; runtime?.cancel(); }
    const generation = epoch;
    latest = input;
    if (input.rulesVersion !== 4) {
      epoch++;
      runtime?.cancel();
      publish({result: simulateLegacy(input), pending: false, error: ''});
      return;
    }
    publish({result: reset || state.error ? null : state.result, pending: true, error: ''});
    runtime ||= openRuntime();
    runtime.request(input, (result, meta) => {
      if (closed || generation !== epoch) return;
      publish({result, pending: !!meta.pending, error: ''});
    }, error => fail(error, generation));
  }
  return {
    request,
    retry() { if (latest) request(latest, {reset: true}); },
    cancel() {
      epoch++;
      latest = null;
      runtime?.cancel();
      publish({result: null, pending: false, error: ''});
    },
    close() { closed = true; epoch++; runtime?.close(); runtime = null; latest = null; },
    get state() { return state; }
  };
}
