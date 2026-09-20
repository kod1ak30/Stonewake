// @ts-nocheck
import {SWDeploymentTarget, vu, yu} from '../../frontend/legacy/presentation.js';
import {SWSeaLanding14} from './naval.js';
import {createBattleRuntime} from '../../frontend/runtime/battle-runtime.js';
import {SWCreateDeploymentGesture17} from '../build17/combat.js';

const SWGestureBridge14 = {surface: null, points: new Map(), installed: false, controller: null,
  get session() { return this.controller?.session || null; }};
function SWInstallPointers14() {
  if (SWGestureBridge14.installed) return;
  SWGestureBridge14.installed = true;
  const controller = SWCreateDeploymentGesture17({getSurface: () => SWGestureBridge14.surface,
    now: () => performance.now(), schedule: (fn, delay) => setTimeout(fn, delay), unschedule: id => clearTimeout(id), points: SWGestureBridge14.points});
  SWGestureBridge14.controller = controller;
  window.addEventListener('pointerdown', event => controller.pointerDown(event), true);
  window.addEventListener('pointermove', event => controller.pointerMove(event), true);
  window.addEventListener('pointerup', event => controller.pointerUp(event), true);
  window.addEventListener('pointercancel', event => controller.pointerUp(event, true), true);
  window.addEventListener('lostpointercapture', event => controller.lostCapture(event), true);
  window.addEventListener('blur', () => controller.reset());
  document.addEventListener('visibilitychange', () => { if (document.hidden) controller.reset(); });
}
function SWFirePointer14(session) { return SWGestureBridge14.controller?.fire(session) || false; }
function SWBeginPointer14(event, kind, origin = 'map') {
  SWInstallPointers14(); return SWGestureBridge14.controller.begin(event, kind, origin);
}
function SWStartTrayDrag14(event, kind, onSelect) { onSelect(kind); SWBeginPointer14(event, kind, 'tray'); }
function SWDeploymentTarget14(input, defense, world, scale) {
  if (input?.campaignType !== 'sea') return SWDeploymentTarget(defense, world, scale);
  const tile = yu(world.x, world.y), y = Math.round(tile.y), target = {x: -1, y};
  if (!SWSeaLanding14(input.defense, -1, y)) return null;
  const point = vu(-1, y);
  return Math.hypot(point.x - world.x, point.y - world.y) * scale < 46 ? target : null;
}
function SWBattleWorker() { return createBattleRuntime(); }
export {SWGestureBridge14, SWInstallPointers14, SWFirePointer14, SWBeginPointer14, SWStartTrayDrag14, SWDeploymentTarget14, SWBattleWorker};
