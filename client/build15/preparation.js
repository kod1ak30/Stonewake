// Pure preparation helpers. Drafts never alter owned troops, ships or saves.
import {J} from '../../frontend/core/rules.js';
import {SWShipCapacity14, SWTroopWeight14} from '../build14/naval.js';

export function SWPreparationIdentity16(scout) {
  return JSON.stringify([scout.kind, scout.campaignIndex, scout.missionId,
    scout.trialId, scout.provinceId, scout.rivalId, scout.id, scout.practiceKind]);
}

export function SWCargoArmy16(fleet) {
  return Object.fromEntries(Object.keys(J).map(kind => [kind,
    fleet.reduce((total, ship) => total + (ship.cargo[kind] || 0), 0)]));
}

/** Transfer one soldier, preserving the total army and every ship's capacity. */
export function SWMoveCargo16(fleet, kind, fromId, toId) {
  if (!Object.hasOwn(J, kind) || fromId === toId) return null;
  const from = fleet.find(ship => ship.id === fromId);
  const to = fleet.find(ship => ship.id === toId);
  if (!from || !to || !Number.isInteger(from.cargo[kind]) || from.cargo[kind] < 1) return null;
  const weight = Object.entries(to.cargo).reduce((sum, [type, count]) => sum + SWTroopWeight14(type) * count, 0);
  if (weight + SWTroopWeight14(kind) > SWShipCapacity14(to)) return null;
  return fleet.map(ship => ship.id === fromId
    ? {...ship, cargo: {...ship.cargo, [kind]: ship.cargo[kind] - 1}}
    : ship.id === toId ? {...ship, cargo: {...ship.cargo, [kind]: (ship.cargo[kind] || 0) + 1}} : ship);
}

export function SWShipReadiness16(ship, now = Date.now()) {
  if (ship.wrecked) return 'Needs repair';
  if (ship.repairReadyAt) return 'Repairing';
  if (ship.readyAt || !ship.level) return 'Under construction';
  if (ship.combatBattleId) return 'In battle';
  if (ship.voyage) return ship.voyage.readyAt <= now ? 'Unload cargo in Harbor' : 'On a trading voyage';
  return 'Ready';
}

function SWValidCargoManifest16(fleet) {
  if (!Array.isArray(fleet) || !fleet.length) return false;
  const ids = new Set();
  return fleet.every(ship => {
    if (!ship || typeof ship.id !== 'string' || !ship.id || ids.has(ship.id)
      || !Number.isInteger(ship.level) || ship.level < 1 || ship.level > 10
      || !ship.cargo || typeof ship.cargo !== 'object' || Array.isArray(ship.cargo)) return false;
    ids.add(ship.id);
    const capacity = SWShipCapacity14(ship), cargo = Object.entries(ship.cargo);
    return capacity > 0 && cargo.every(([kind, count]) => Object.hasOwn(J, kind)
      && Number.isInteger(count) && count >= 0 && count <= 80)
      && cargo.reduce((sum, [kind, count]) => sum + SWTroopWeight14(kind) * count, 0) <= capacity;
  });
}

/** An explicit, equal-space exchange. The caller shows both moves before confirmation. */
export function SWSwapCargo16(fleet, kind, fromId, toId, returnKind) {
  if (!SWValidCargoManifest16(fleet) || fromId === toId || kind === returnKind
    || !Object.hasOwn(J, kind) || !Object.hasOwn(J, returnKind)
    || SWTroopWeight14(kind) !== SWTroopWeight14(returnKind)) return null;
  const from = fleet.find(ship => ship.id === fromId), to = fleet.find(ship => ship.id === toId);
  if (!from || !to || !(from.cargo[kind] > 0) || !(to.cargo[returnKind] > 0)
    || (from.cargo[returnKind] || 0) >= 80 || (to.cargo[kind] || 0) >= 80) return null;
  const next = fleet.map(ship => ship.id === fromId
    ? {...ship, cargo: {...ship.cargo, [kind]: ship.cargo[kind] - 1, [returnKind]: (ship.cargo[returnKind] || 0) + 1}}
    : ship.id === toId
      ? {...ship, cargo: {...ship.cargo, [kind]: (ship.cargo[kind] || 0) + 1, [returnKind]: ship.cargo[returnKind] - 1}}
      : ship);
  return {
    fleet: next, mode: 'swap',
    moved: {kind, fromId, toId},
    returned: {kind: returnKind, fromId: toId, toId: fromId}
  };
}

/** List visible choices; never silently pick which soldier returns to the donor. */
export function SWCargoSwapOptions16(fleet, kind, toId) {
  if (!SWValidCargoManifest16(fleet) || !Object.hasOwn(J, kind)) return [];
  const to = fleet.find(ship => ship.id === toId);
  if (!to || (to.cargo[kind] || 0) >= 80) return [];
  const options = [];
  for (const from of fleet) {
    if (from.id === toId || !(from.cargo[kind] > 0)) continue;
    for (const returnKind of Object.keys(J)) {
      if (returnKind !== kind && to.cargo[returnKind] > 0
        && SWTroopWeight14(returnKind) === SWTroopWeight14(kind)
        && (from.cargo[returnKind] || 0) < 80) {
        options.push({kind, fromId: from.id, toId, returnKind});
      }
    }
  }
  return options;
}
