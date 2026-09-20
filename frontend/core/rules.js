// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.
import { $c, Y, ol } from "../../client/build14/rules.js";
import { gl } from "../../client/build14/simulation.js";
import { SWCampaignProgress17, SWCollectionQuote17 } from "../../client/build17/gameplay.js";
import { SWCampaignFort17 } from "../../client/build17/campaign.js";
var bc = (e, t = 0, n = 0, r = 0) => ({ gold: e, wood: t, stone: n, food: r });
var xc = {
    spearman: {
      name: `Spearmen`,
      description: `Long reach. Double damage against cavalry and knights.`,
      cost: bc(18, 8, 0, 22),
      hp: 125,
      damage: 15,
      range: 1.3,
      speed: 1,
      cooldown: 1.2,
      unlock: 1,
      icon: `spear`,
    },
    shieldbearer: {
      name: `Shieldbearers`,
      description: `Heavy shields absorb 35% of incoming damage.`,
      cost: bc(32, 0, 8, 30),
      hp: 220,
      damage: 9,
      range: 0.85,
      speed: 0.72,
      cooldown: 1.2,
      unlock: 2,
      icon: `shield`,
    },
    scout: {
      name: `Scouts`,
      description: `Fast raiders who prioritize exposed resource buildings.`,
      cost: bc(24, 0, 0, 28),
      hp: 80,
      damage: 16,
      range: 0.85,
      speed: 1.85,
      cooldown: 0.85,
      unlock: 2,
      icon: `scout`,
    },
    crossbow: {
      name: `Crossbowmen`,
      description: `Armor-piercing bolts from beyond the front line.`,
      cost: bc(30, 14, 0, 28),
      hp: 78,
      damage: 26,
      range: 3,
      speed: 0.9,
      cooldown: 1.7,
      unlock: 3,
      icon: `bow`,
    },
    ram: {
      name: `Battering rams`,
      description: `Seek barriers. Deal four times damage to walls and gates.`,
      cost: bc(65, 70, 10, 35),
      hp: 320,
      damage: 22,
      range: 0.9,
      speed: 0.58,
      cooldown: 1.8,
      unlock: 3,
      icon: `ram`,
    },
    trebuchet: {
      name: `Trebuchets`,
      description: `Long-range siege engines. Heavy stones crush structures and damage nearby defenders.`,
      cost: bc(110, 85, 55, 65),
      hp: 115, damage: 46, range: 5.2, speed: 0.38, cooldown: 4.8,
      unlock: 5, maxLevel: 10, icon: `cannon`,
    },
    healer: {
      name: `Field medics`,
      description: `Follow wounded allies and restore health. Cannot attack.`,
      cost: bc(42, 10, 0, 40),
      hp: 82,
      damage: 0,
      heal: 20,
      range: 2.7,
      speed: 1.05,
      cooldown: 1.5,
      unlock: 4,
      icon: `heart`,
    },
    grenadier: {
      name: `Grenadiers`,
      description: `Explosive splash punishes tightly packed defenders.`,
      cost: bc(55, 0, 18, 35),
      hp: 100,
      damage: 24,
      range: 2.4,
      speed: 0.95,
      cooldown: 1.8,
      unlock: 5,
      icon: `bomb`,
    },
    knight: {
      name: `Royal knights`,
      description: `Armored cavalry that prioritizes defensive weapons.`,
      cost: bc(80, 0, 22, 65),
      hp: 270,
      damage: 30,
      range: 0.95,
      speed: 1.5,
      cooldown: 1.15,
      unlock: 6,
      icon: `horse`,
    },
  };
var Sc = {
    mortar: {
      name: `Mortar`,
      description: `Long-range shells hit clustered attackers. Vulnerable at close range.`,
      cost: bc(190, 82, 160, 55),
      time: 100,
      unlock: 2,
      max: 10,
      sprite: 18,
      benefit: `Splash damage · 5-tile range`,
    },
    bombtower: {
      name: `Bomb tower`,
      description: `Throws explosives into groups at medium range.`,
      cost: bc(230, 98, 180, 65),
      time: 120,
      unlock: 3,
      max: 10,
      sprite: 19,
      benefit: `Area damage · 3.5-tile range`,
    },
    flame: {
      name: `Flame turret`,
      description: `Scorches nearby attackers with rapid area damage.`,
      cost: bc(320, 90, 260, 60),
      time: 150,
      unlock: 4,
      max: 10,
      sprite: 20,
      benefit: `Close-range crowd control`,
    },
    bastion: {
      name: `Bastion`,
      description: `A heavily armored defensive strongpoint with powerful crossbows.`,
      cost: bc(480, 150, 400, 100),
      time: 210,
      unlock: 5,
      max: 10,
      sprite: 21,
      benefit: `Heavy armor · 4-tile range`,
    },
  };
var Cc = [`tower`, `mortar`, `bombtower`, `flame`, `bastion`];
var wc = {
    cutter: {
      name: `Fishing cutter`,
      description: `Reliable coastal voyages bring food and timber.`,
      unlock: 1,
      cost: bc(140, 160, 25),
      time: 90,
      power: 12,
      sprite: 0,
    },
    cog: {
      name: `Merchant cog`,
      description: `Large cargo holds earn gold on trading voyages.`,
      unlock: 2,
      cost: bc(260, 280, 80),
      time: 150,
      power: 25,
      sprite: 1,
    },
    galley: {
      name: `War galley`,
      description: `Escort merchants and clear pirate waters.`,
      unlock: 3,
      cost: bc(440, 350, 160),
      time: 210,
      power: 48,
      sprite: 2,
    },
    bombard: {
      name: `Bombard ship`,
      description: `Heavy guns open the most dangerous sea routes.`,
      unlock: 5,
      cost: bc(760, 520, 340),
      time: 300,
      power: 90,
      sprite: 3,
    },
  };
var Tc = {
    clear: {
      name: `Clear land`,
      description: `Remove a tree or rock; recover materials once.`,
      cost: bc(6),
    },
    road: {
      name: `Lay road`,
      description: `Connect your buildings with stone paths.`,
      cost: bc(0, 0, 3),
    },
    tree: {
      name: `Plant trees`,
      description: `Place a tree on an empty plot.`,
      cost: bc(12, 8),
    },
    rock: {
      name: `Place rock`,
      description: `Shape your landscape with stone.`,
      cost: bc(8, 0, 10),
    },
    garden: {
      name: `Plant garden`,
      description: `Create a green square between buildings.`,
      cost: bc(20, 10),
    },
  };
var Ec = [
    {
      id: `coast`,
      name: `Coastal fisheries`,
      duration: 180,
      power: 0,
      unlock: 1,
      reward: bc(25, 110, 0, 65),
    },
    {
      id: `trade`,
      name: `Amber trade route`,
      duration: 480,
      power: 25,
      unlock: 2,
      reward: bc(220, 70, 40, 35),
    },
    {
      id: `pirates`,
      name: `Breakwater pirates`,
      duration: 720,
      power: 65,
      unlock: 3,
      reward: bc(330, 150, 150, 90),
    },
    {
      id: `crown`,
      name: `Crown sea passage`,
      duration: 1200,
      power: 170,
      unlock: 5,
      reward: bc(700, 280, 300, 180),
    },
  ];
var Oc = {
    captain: {
      name: `Mara Ironward`,
      title: `Shield captain`,
      ability: `Shieldwall`,
      description: `Protects nearby allies for six seconds and restores part of their health.`,
      unlock: 1,
      hp: 300,
      damage: 21,
      range: 1,
      speed: 1.05,
      sprite: 0,
    },
    engineer: {
      name: `Bram Flint`,
      title: `Siege engineer`,
      ability: `Breach charge`,
      description: `Blasts the nearest wall, gate, or tower, opening a path for your army.`,
      unlock: 2,
      hp: 210,
      damage: 23,
      range: 2.2,
      speed: 1,
      sprite: 1,
    },
    ranger: {
      name: `Elowen Vale`,
      title: `Ranger captain`,
      ability: `Marked volley`,
      description: `Strikes three nearby enemies, prioritizing defensive towers.`,
      unlock: 1,
      hp: 195,
      damage: 20,
      range: 3.25,
      speed: 1.25,
      sprite: 2,
    },
  };
var kc = {
    blade: {
      name: `Tempered weapon`,
      description: `+15% commander damage`,
      cost: { gold: 100, wood: 0, stone: 40, food: 0 },
    },
    armor: {
      name: `Reinforced armor`,
      description: `+25% commander health`,
      cost: { gold: 100, wood: 0, stone: 50, food: 0 },
    },
    manual: {
      name: `Field manual`,
      description: `Stronger commander ability`,
      cost: { gold: 120, wood: 30, stone: 0, food: 0 },
    },
  };
var Ac = [
    {
      id: `whisperwood`,
      name: `Whisperwood`,
      terrain: `Forest province`,
      description: `Secure the timber camps and open the western valley.`,
      resource: `wood`,
      income: 12,
      level: 1,
      campaign: 0,
      requires: [],
      anchor: { x: 0, y: 11 },
      tiles: [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 0, y: 11 },
        { x: 1, y: 11 },
        { x: 2, y: 11 },

        { x: -1, y: 2 },
        { x: -1, y: 3 },
        { x: -1, y: 4 },
        { x: -1, y: 5 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ],
      reward: { gold: 100, wood: 130, stone: 40, food: 60 },
    },
    {
      id: `sunmeadow`,
      name: `Sunmeadow`,
      terrain: `Farmland province`,
      description: `Take the southern fields to feed a larger army.`,
      resource: `food`,
      income: 14,
      level: 1,
      campaign: 0,
      requires: [],
      anchor: { x: 3, y: 11 },
      tiles: [
        { x: 3, y: 10 },
        { x: 4, y: 10 },
        { x: 5, y: 10 },
        { x: 3, y: 11 },
        { x: 4, y: 11 },
        { x: 5, y: 11 },

        { x: 0, y: 7 },
        { x: 0, y: 8 },
        { x: 1, y: 8 },
        { x: 2, y: 8 },
        { x: 3, y: 8 },
        { x: 4, y: 8 },
        { x: 5, y: 8 },
      ],
      reward: { gold: 110, wood: 60, stone: 40, food: 160 },
    },
    {
      id: `ironpass`,
      name: `Ironpass`,
      terrain: `Mountain province`,
      description: `Claim the eastern quarries and strengthen your siege attacks.`,
      resource: `stone`,
      income: 10,
      level: 1,
      campaign: 1,
      requires: [`whisperwood`, `sunmeadow`],
      anchor: { x: 11, y: 0 },
      tiles: [
        { x: 10, y: 0 },
        { x: 10, y: 1 },
        { x: 10, y: 2 },
        { x: 10, y: 3 },
        { x: 10, y: 4 },
        { x: 11, y: 0 },
        { x: 11, y: 1 },
        { x: 11, y: 2 },
        { x: 11, y: 3 },
        { x: 11, y: 4 },

        { x: 7, y: 0 },
        { x: 8, y: 0 },
        { x: 8, y: 1 },
        { x: 8, y: 2 },
        { x: 8, y: 3 },
        { x: 8, y: 4 },
        { x: 8, y: 5 },
      ],
      reward: { gold: 180, wood: 100, stone: 180, food: 90 },
    },
    {
      id: `tidewatch`,
      name: `Tidewatch`,
      terrain: `Coastal province`,
      description: `Open the sea road and earn gold from coastal trade.`,
      resource: `gold`,
      income: 16,
      level: 2,
      campaign: 2,
      requires: [`ironpass`],
      anchor: { x: 6, y: 11 },
      tiles: [
        { x: 6, y: 10 },
        { x: 6, y: 11 },
        { x: 7, y: 10 },
        { x: 7, y: 11 },
        { x: 8, y: 10 },
        { x: 8, y: 11 },
        { x: 9, y: 10 },
        { x: 9, y: 11 },

        { x: 6, y: 7 },
        { x: 6, y: 8 },
        { x: 7, y: 6 },
        { x: 7, y: 7 },
        { x: 7, y: 8 },
        { x: 8, y: 6 },
        { x: 8, y: 7 },
      ],
      reward: { gold: 280, wood: 160, stone: 150, food: 130 },
    },
    {
      id: `highmarch`,
      name: `Highmarch`,
      terrain: `Highland province`,
      description: `Hold the frontier heights. Adds four army spaces at every outpost level.`,
      resource: `gold`,
      income: 12,
      level: 3,
      campaign: 3,
      requires: [`tidewatch`],
      anchor: { x: 11, y: 8 },
      tiles: [
        { x: 10, y: 5 },
        { x: 10, y: 6 },
        { x: 10, y: 7 },
        { x: 10, y: 8 },
        { x: 10, y: 9 },
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 11, y: 5 },
        { x: 11, y: 6 },
        { x: 11, y: 7 },
        { x: 11, y: 8 },
        { x: 11, y: 9 },
        { x: 11, y: 10 },
        { x: 11, y: 11 },

        { x: 9, y: 2 },
        { x: 9, y: 3 },
        { x: 9, y: 4 },
        { x: 9, y: 5 },
        { x: 9, y: 6 },
        { x: 6, y: 9 },
        { x: 7, y: 9 },
        { x: 8, y: 9 },
      ],
      reward: { gold: 400, wood: 220, stone: 250, food: 200 },
    },
  ];
var jc = [
    {
      id: `azure`,
      name: `Azure league banner`,
      points: 75,
      description: `Violet and silver standards for your keep and outposts.`,
    },
    {
      id: `crimson`,
      name: `Crimson guard livery`,
      points: 150,
      description: `Crimson standards for your military buildings.`,
    },
    {
      id: `monument`,
      name: `Victor’s standard`,
      points: 250,
      description: `An exclusive monument you can place in your capital.`,
    },
  ];
var Mc = Date.UTC(2026, 0, 5);
var Nc = 7 * 864e5;
function Pc(e = Date.now()) {
  let t = Math.floor((e - Mc) / Nc);
  return {
    id: `week-${t}`,
    number: t + 1,
    start: Mc + t * Nc,
    end: Mc + (t + 1) * Nc,
  };
}
function Ic(e) {
  return Math.min(
    4,
    1 + e.buildings.filter((e) => e.kind === `builder` && e.level > 0).length,
  );
}
function Lc(e) {
  return [
    ...new Set(
      e.buildings.filter((e) => e.readyAt).map((e) => e.projectId || e.id),
    ),
  ].length+Object.values(e.city?.projects||{}).filter(p=>p.readyAt).length;
}
function Rc(e) {
  return Math.max(0, Ic(e) - Lc(e));
}
function zc(e) {
  return e.kind === `wall` || e.kind === `gate`;
}
function Bc(e, t) {
  return Number.isInteger(e) && Number.isInteger(t) && e >= 0 && t >= 0 && e < 16 && t < 16;
}
function Vc(e, t, n) {
  return (
    Bc(t, n) ||
    !!e.provinces?.some((e) =>
      Ac.find((t) => t.id === e.id)?.tiles.some((e) => e.x === t && e.y === n),
    )
  );
}
function Uc(e) {
  return { gold: 150 * e, wood: 90 * e, stone: 80 * e, food: 0 };
}
function Wc(e, t) {
  return (
    e.commanders?.[t] ||
    (t === `captain` ? { xp: 0, gear: `armor`, owned: [`armor`] } : void 0)
  );
}
function Gc(e) {
  let t = e.commander || `captain`,
    n = Wc(e, t) || Wc(e, `captain`);
  return {
    id: t,
    level: Math.min(10, 1 + Math.floor(n.xp / 160)),
    gear: n.gear,
  };
}
function Kc(e, t, n) {
  let r = Wc(e, t);
  r &&
    (e.commanders = {
      ...e.commanders,
      [t]: { ...r, xp: Math.min(1440, r.xp + n) },
    });
}
function qc(e) {
  let t = Math.max(1, e.level);
  return e.specialty === `ballista`
    ? { damage: 26 * (1 + 0.25 * (t - 1)), range: 4.6, cooldown: 2.1 }
    : e.specialty === `volley`
      ? { damage: 9 * (1 + 0.25 * (t - 1)), range: 2.8, cooldown: 0.65 }
      : { damage: 12 * (1 + 0.25 * (t - 1)), range: 3.25, cooldown: 1.25 };
}
function Jc(e) {
  let t = Ac.find((t) => t.id === e);
  if (!t) throw Error(`Unknown province.`);
  return cl(Math.max(0, t.campaign), t.name, t.level);
}
function Zc(e, t, n = 1) {
  let r =
    1 +
    Math.min(
      0.6,
      e.buildings
        .filter((e) => e.kind === `builder`)
        .reduce((e, t) => e + Math.max(0, t.level - 1) * 0.025, 0),
    );
  return Math.ceil(Math.min(14400, Sl[t].time * 1.7 ** (n - 1)) / r * (1-SWCivicBonuses(e).buildSpeed));
}
function el(e, t) {
  return Math.max(1, Math.min(10, e.unitLevels?.[t] || 1));
}
function tl(e, t) {
  let n = 1.6 ** (el(e, t) - 1);
  return {
    gold: Math.round(120 * n),
    wood: Math.round(60 * n),
    stone: Math.round(45 * n),
    food: Math.round(90 * n),
  };
}
function nl(e, t = 1) {
  let n = wc[e].cost,
    r = 1.5 ** (t - 1);
  return Object.fromEntries(xl.map((e) => [e, Math.round(n[e] * r)]));
}
function rl(e) {
  return Math.max(
    0,
    ...e.buildings.filter((e) => e.kind === `harbor`).map((e) => e.level),
  );
}
function il(e, t, n) {
  return e.terrain?.find((e) => e.x === t && e.y === n);
}
function al(e, t, n) {
  return [`tree`, `rock`].includes(il(e, t, n)?.kind || ``);
}
function SWLegacyFleet13(e, t, n) {
  if (t.type === `landscape`) {
    if (!Vc(e, t.x, t.y)) throw Error(`Choose a plot inside your territory.`);
    if (e.buildings.some((e) => e.x === t.x && e.y === t.y))
      throw Error(`Move the building before changing this plot.`);
    if((e.premium?.ornaments||[]).some(o=>o.x===t.x&&o.y===t.y))throw Error(`Return the decoration to your wardrobe before changing this plot.`);
    if (!Object.hasOwn(Tc, t.kind || ``))
      throw Error(`Choose a landscape tool.`);
    let n = t.kind,
      r = il(e, t.x, t.y),
      i = n === `clear` ? `grass` : n;
    if (r?.kind === i || n==='clear'&&!r) return true;
    return (
      Q(e, Tc[n].cost),
      n === `clear` &&
        r &&
        !r.harvested &&
        (r.kind === `tree` && Ll(e, { gold: 0, wood: 20, stone: 0, food: 0 }),
        r.kind === `rock` && Ll(e, { gold: 0, wood: 0, stone: 15, food: 0 })),
      (e.terrain = [
        ...(e.terrain || []).filter((e) => e.x !== t.x || e.y !== t.y),
        { x: t.x, y: t.y, kind: i, harvested: !0 },
      ]),
      !0
    );
  }
  if (t.type === `researchUnit`) {
    let r = t.kind;
    if (!Object.hasOwn(J, r)) throw Error(`Choose a troop.`);
    if (e.trainingResearch)
      throw Error(`A troop upgrade is already in progress.`);
    let i = el(e, r);
    if (i >= 10) throw Error(`Maximum troop level reached.`);
    if (i >= Ml(e))
      throw Error(`Upgrade your keep to unlock the next troop level.`);
    if (!e.buildings.some((e) => e.kind === `barracks` && e.level > 0))
      throw Error(`Complete a barracks first.`);
    if (Ml(e) < J[r].unlock) throw Error(`Unlock this troop first.`);
    return (
      Q(e, tl(e, r)),
      (e.trainingResearch = {
        kind: r,
        level: i + 1,
        readyAt: n + Math.ceil(120 * 1.7 ** (i - 1)) * 1e3,
      }),
      !0
    );
  }
  if (t.type === `buildShip`) {
    let r = t.kind;
    if (!Object.hasOwn(wc, r)) throw Error(`Choose a ship.`);
    let i = rl(e);
    if (i < wc[r].unlock) throw Error(`Requires a level ${wc[r].unlock} port.`);
    if ((e.fleet?.length || 0) >= Math.min(8, i + 1))
      throw Error(`Upgrade the port for another berth.`);
    if (e.fleet?.some((e) => e.readyAt || e.repairReadyAt))
      throw Error(`Your shipwright is working on another vessel.`);
    return (
      Q(e, nl(r)),
      (e.fleet = [
        ...(e.fleet || []),
        {
          id: `ship-${n}-${e.revision}`,
          kind: r,
          level: 0,
          targetLevel: 1,
          readyAt: n + wc[r].time * 1e3,
        },
      ]),
      !0
    );
  }
  if (t.type === `upgradeShip`) {
    let r = e.fleet?.find((e) => e.id === t.id);
    if (!r || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt)
      throw Error(`Choose an idle, completed ship.`);
    if (r.level >= 10) throw Error(`Maximum ship level reached.`);
    if (r.level >= rl(e)) throw Error(`Upgrade the port first.`);
    if (e.fleet?.some((e) => e.readyAt || e.repairReadyAt))
      throw Error(`Your shipwright is busy.`);
    return (
      Q(e, nl(r.kind, r.level + 1)),
      (r.targetLevel = r.level + 1),
      (r.readyAt = n + Math.ceil(wc[r.kind].time * 1.5 ** r.level) * 1e3),
      !0
    );
  }
  if (t.type === `voyage`) {
    let r = e.fleet?.find((e) => e.id === t.id),
      i = Ec.find((e) => e.id === t.kind);
    if (!r || !r.level || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt || !i)
      throw Error(`Choose a ready ship and sea route.`);
    if (
      rl(e) < i.unlock ||
      wc[r.kind].power * (1 + 0.22 * (r.level - 1)) < i.power
    )
      throw Error(`This ship needs more strength for that route.`);
    let a = 1 + 0.15 * (r.level - 1);
    return (
      (r.voyage = {
        route: i.id,
        startedAt: n,
        readyAt: n + Math.ceil(i.duration*(1-SWCivicBonuses(e).voyageSpeed)) * 1e3,
        reward: Object.fromEntries(
          xl.map((e) => [e, Math.round(i.reward[e] * a)]),
        ),
      }),
      !0
    );
  }
  if (t.type === `collectVoyage`) {
    let r = e.fleet?.find((e) => e.id === t.id);
    if (!r?.voyage || r.voyage.readyAt > n)
      throw Error(`This ship has not returned yet.`);
    SWRequireRoom(e,r.voyage.reward);
    return (Ll(e, r.voyage.reward), delete r.voyage, !0);
  }
  return !1;
}
function sl(e) {
  let t = Math.max(1, e.level),
    n = 1 + 0.22 * (t - 1),
    r =
      e.kind === `mortar`
        ? { damage: 32, range: 5, cooldown: 3.2, splash: 1.15, minRange: 1.6 }
        : e.kind === `bombtower`
          ? { damage: 23, range: 3.5, cooldown: 2.1, splash: 1.05, minRange: 0 }
          : e.kind === `flame`
            ? {
                damage: 9,
                range: 2.15,
                cooldown: 0.45,
                splash: 0.65,
                minRange: 0,
              }
            : e.kind === `bastion`
              ? { damage: 32, range: 4, cooldown: 1.35, splash: 0, minRange: 0 }
              : e.specialty === `ballista`
                ? {
                    damage: 28,
                    range: 4.6,
                    cooldown: 2,
                    splash: 0,
                    minRange: 0,
                  }
                : e.specialty === `volley`
                  ? {
                      damage: 10,
                      range: 2.8,
                      cooldown: 0.65,
                      splash: 0,
                      minRange: 0,
                    }
                  : {
                      damage: 20,
                      range: 3.25,
                      cooldown: 1.25,
                      splash: 0,
                      minRange: 0,
                    };
  return {
    ...r,
    damage: r.damage * n,
    hp: (e.kind === `bastion` ? 620 : 320) * (1 + 0.35 * (t - 1)),
  };
}
function cl(stage, name, level, options = {}) {
  return SWCampaignFort17(stage,name,level,options);
}
var ll = (e) => e.kind === `wall` || e.kind === `gate`;
var ul = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
var dl = (e, t) => `${Math.round(e)},${Math.round(t)}`;
function fl(e) {
  let t = e.buildings;
  return {
    minX: Math.min(...t.map((e) => e.x)) - 2,
    maxX: Math.max(...t.map((e) => e.x)) + 2,
    minY: Math.min(...t.map((e) => e.y)) - 2,
    maxY: Math.max(...t.map((e) => e.y)) + 2,
  };
}
function pl(e, t, n) {
  if (!Number.isInteger(t) || !Number.isInteger(n)) return !1;
  let r = fl(e);
  return (
    t >= r.minX &&
    t <= r.maxX &&
    n >= r.minY &&
    n <= r.maxY &&
    (t <= r.minX + 1 ||
      t >= r.maxX - 1 ||
      n <= r.minY + 1 ||
      n >= r.maxY - 1) &&
    !e.buildings.some((e) => Math.abs(e.x - t) < 0.8 && Math.abs(e.y - n) < 0.8)
  );
}
function ml(e, t) {
  if (!Array.isArray(t) || t.length > 80)
    throw Error(`Invalid deployment orders.`);
  let n = {},
    r = [],
    i = 0;
  for (let a of t) {
    if (!a || typeof a != `object`) throw Error(`Invalid deployment order.`);
    let t = a;
    if (
      !(t.kind === `hero` ? e.commander : Object.hasOwn(J, t.kind)) ||
      !pl(e.defense, t.x, t.y) ||
      !Number.isFinite(t.time) ||
      t.time < i ||
      t.time < 0 ||
      t.time > 119.5
    )
      throw Error(`Deploy along the perimeter outside the walls at a valid time.`);
    if (
      ((n[t.kind] = (n[t.kind] || 0) + 1),
      n[t.kind] > (t.kind === `hero` ? 1 : e.army[t.kind] || 0))
    )
      throw Error(`No troops of this type remain in reserve.`);
    ((i = t.time),
      r.push({
        kind: t.kind,
        x: t.x,
        y: t.y,
        time: Math.round(t.time * 2) / 2,
      }));
  }
  return r;
}
function hl(e) {
  let t = { ...wl(), ...e.army, hero: +!!e.commander };
  for (let n of e.orders || []) t[n.kind] = Math.max(0, t[n.kind] - 1);
  return t;
}
function SWMedicTarget(healer, units, assignments, time) {
  const allies=units.filter(u=>u.side===healer.side&&!u.building&&!u.naval&&u.hp>0&&u.id!==healer.id);
  if(!allies.length)return null;
  const fighters=allies.filter(u=>u.kind!=='healer');
  const candidates=fighters.length?allies.filter(u=>u.kind!=='healer'||u.hp/u.maxHp<.45):allies;
  const enemies=units.filter(u=>u.side!==healer.side&&u.hp>0&&u.damage>0);
  const living=new Map(units.filter(u=>u.hp>0).map(u=>[u.id,u]));
  const heal=20*(1+.14*((healer.level||1)-1));
  const previous=assignments.get(healer.id);
  const frontline=new Set(['infantry','shieldbearer','spearman','cavalry','knight','ram','hero']);
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  let winner=null,best=Infinity;
  for(const ally of candidates){
    const missing=ally.maxHp-ally.hp,ratio=missing/ally.maxHp;
    const local=candidates.filter(u=>distance(u,ally)<2.4);
    const groupNeed=local.reduce((sum,u)=>sum+(u.maxHp-u.hp),0);
    let incoming=0,coverage=0;
    for(const [medicId,assignment] of assignments){
      if(medicId===healer.id)continue;
      const medic=living.get(medicId),target=living.get(assignment.targetId);
      if(!medic||!target||medic.side!==healer.side)continue;
      const separation=distance(target,ally);
      if(separation<2.4)coverage+=(1-separation/3.2);
      if(target.id===ally.id&&distance(medic,ally)<=medic.range+1&&medic.nextAttack<=time+1)
        incoming+=20*(1+.14*((medic.level||1)-1));
    }
    const uncovered=Math.max(0,missing-incoming);
    const threatened=enemies.some(enemy=>distance(enemy,ally)<=Math.max(1,enemy.range||0)+.8);
    const priority=uncovered>1?(uncovered/ally.maxHp)*8+Math.min(2,uncovered/heal)*2:0;
    const coveragePenalty=coverage*9/Math.max(1,groupNeed/(heal*2.5));
    const incomingPenalty=incoming&&missing<=incoming?7:0;
    const overheal=missing>0&&missing<heal*.55?2.8:0;
    const sticky=previous?.targetId===ally.id?(time<previous.until?5:2.2):0;
    const score=distance(healer,ally)*.75+coveragePenalty+incomingPenalty+overheal-priority-
      (frontline.has(ally.kind)?1.5:0)-(threatened?2:0)-sticky;
    if(score<best-1e-9||(Math.abs(score-best)<1e-9&&String(ally.id)<String(winner?.id))){best=score;winner=ally;}
  }
  return winner;
}
function SWNavalShips(state) {
  return (state.fleet||[]).filter(ship=>['galley','bombard'].includes(ship.kind)&&ship.level>0&&!ship.readyAt&&!ship.voyage&&!ship.combatBattleId&&!ship.wrecked&&!ship.repairReadyAt);
}
function SWNavalStrike(input,units,time) {
  if(input.navalVersion!==1||!input.navalSupport||!['galley','bombard'].includes(input.navalSupport.kind)||
    !Number.isFinite(input.navalAt)||input.navalAt<0||input.navalAt>119.5||time<input.navalAt)return null;
  const shore={x:-3,y:3},weapons=new Set(['tower','mortar','bombtower','flame','bastion']);
  const targets=units.filter(u=>u.side==='defend'&&u.building&&u.hp>0&&(weapons.has(u.kind)||u.kind==='keep'));
  targets.sort((a,b)=>(weapons.has(a.kind)?0:1)-(weapons.has(b.kind)?0:1)||
    Math.hypot(a.x-shore.x,a.y-shore.y)-Math.hypot(b.x-shore.x,b.y-shore.y)||(String(a.id)<String(b.id)?-1:String(a.id)>String(b.id)?1:0));
  const target=targets[0];if(!target)return null;
  const level=Math.max(1,Math.min(10,Math.trunc(input.navalSupport.level)||1));
  const damage=input.navalSupport.kind==='bombard'?260+45*level:140+30*level;
  const hits=units.filter(u=>u.side==='defend'&&u.hp>0&&Math.hypot(u.x-target.x,u.y-target.y)<=1.25)
    .map(unit=>({unit,damage:damage*(1-Math.min(.5,Math.hypot(unit.x-target.x,unit.y-target.y)*.4))}));
  return {target,hits,shot:{x:shore.x,y:shore.y,tx:target.x,ty:target.y,side:'attack',kind:'naval'}};
}
const SWAbilityData = Object.freeze({
  infantry:[[3,'Shield drill','10% less incoming damage.'],[6,'Cleave','Strikes one nearby enemy for 35% damage.'],[9,'Veteran guard','25% less incoming damage.']],
  archer:[[3,'Longbow','Adds 0.35 attack range.'],[6,'Quick draw','Attack cooldown is 20% shorter.'],[9,'Split volley','Hits a second nearby enemy for 60% damage.']],
  cavalry:[[3,'Spurred charge','Moves 12% faster.'],[6,'Impact charge','First attack deals 75% extra damage.'],[9,'Tower riders','Deals 25% extra damage to defensive weapons.']],
  cannon:[[3,'Long barrel','Adds 0.5 attack range.'],[6,'Blast shell','Nearby enemies take 45% blast damage.'],[9,'Siege ammunition','Deals 35% extra damage to structures.']],
  spearman:[[3,'Long pikes','Adds 0.3 attack range.'],[6,'Cavalry counter','Deals triple damage to cavalry and knights.'],[9,'Braced formation','25% less incoming damage.']],
  shieldbearer:[[3,'Reinforced shield','Adds 15% maximum health.'],[6,'Shield cover','Nearby allies take 12% less damage.'],[9,'Bulwark','Shield protection reduces incoming damage by a further 30%.']],
  scout:[[3,'Fleet foot','Moves 15% faster.'],[6,'Supply raider','Deals 65% extra damage to production buildings.'],[9,'Relentless raids','Attack cooldown is 30% shorter.']],
  crossbow:[[3,'Heavy bow','Adds 0.4 attack range.'],[6,'Armor piercing','Deals 40% extra damage to armored defenders.'],[9,'Precision volley','Every third attack deals 75% extra damage.']],
  ram:[[3,'Heavy frame','Adds 20% maximum health.'],[6,'Gate breaker','Deals sixfold damage to walls and gates.'],[9,'Breach shock','Nearby enemies take 50% impact damage.']],
  healer:[[3,'Field reach','Adds 0.4 healing range.'],[6,'Shared care','A nearby wounded ally receives a 50% follow-up heal.'],[9,'Emergency care','Heals 40% more when a patient is below 35% health.']],
  grenadier:[[3,'Long throw','Adds 0.35 attack range.'],[6,'Shrapnel','Wider blasts deal 90% damage to nearby enemies.'],[9,'Rapid bombardment','Attack cooldown is 25% shorter.']],
  knight:[[3,'Plate armor','Adds 15% maximum health.'],[6,'Fortress assault','Deals 50% extra damage to defensive weapons.'],[9,'Iron resolve','Takes 25% less damage.']],
  trebuchet:[[3,'Long counterweight','Adds 0.75 attack range.'],[6,'Shattering boulder','Wide impacts deal 65% damage to nearby enemies.'],[9,'Veteran crew','Attack cooldown is 25% shorter.']],
});
function SWTroopAbilities(kind) {
  return (SWAbilityData[kind]||[]).map(([level,name,description])=>({level,name,description}));
}
function SWApplyTroopStats(unit) {
  const level=Math.min(10,unit.level||1),kind=unit.kind;
  unit.abilitiesVersion=1;unit.attackCount=0;
  if(level>=3){
    if(['shieldbearer','knight'].includes(kind))unit.hp=unit.maxHp*=1.15;
    if(kind==='ram')unit.hp=unit.maxHp*=1.2;
    const range={archer:.35,cannon:.5,spearman:.3,crossbow:.4,healer:.4,grenadier:.35,trebuchet:.75}[kind]||0;
    unit.range+=range;
    if(kind==='cavalry')unit.speed*=1.12;
    if(kind==='scout')unit.speed*=1.15;
  }
  if(level>=6&&kind==='archer')unit.cooldown*=.8;
  if(level>=9&&kind==='scout')unit.cooldown*=.7;
  if(level>=9&&['grenadier','trebuchet'].includes(kind))unit.cooldown*=.75;
  return unit;
}
function SWTroopDamageFactor(attacker,target) {
  if(attacker.abilitiesVersion!==1)return 1;
  const kind=attacker.kind,level=attacker.level||1,weapons=['tower','mortar','bombtower','flame','bastion'];let factor=1;
  if(kind==='trebuchet'&&target.building)factor*=2.4;
  if(level>=6){
    if(kind==='cavalry'&&attacker.attackCount===0)factor*=1.75;
    if(kind==='spearman'&&['cavalry','knight'].includes(target.kind))factor*=1.5;
    if(kind==='scout'&&['farm','lumber','quarry','market'].includes(target.kind))factor*=1.65;
    if(kind==='crossbow'&&['keep','tower','bastion','shieldbearer','knight'].includes(target.kind))factor*=1.4;
    if(kind==='ram'&&['wall','gate'].includes(target.kind))factor*=1.5;
    if(kind==='knight'&&weapons.includes(target.kind))factor*=1.5;
  }
  if(level>=9){
    if(kind==='cavalry'&&weapons.includes(target.kind))factor*=1.25;
    if(kind==='cannon'&&target.building)factor*=1.35;
    if(kind==='crossbow'&&(attacker.attackCount+1)%3===0)factor*=1.75;
  }
  return factor;
}
function SWTroopIncomingFactor(unit,units) {
  let factor=1;
  if(unit.abilitiesVersion===1){
    if(unit.kind==='infantry'&&unit.level>=3)factor*=unit.level>=9?.75:.9;
    if(unit.level>=9&&['spearman','knight'].includes(unit.kind))factor*=.75;
    if(unit.kind==='shieldbearer')factor*=unit.level>=9?.65*.7:.65;
  }
  if(!unit.naval&&units.some(ally=>ally.id!==unit.id&&ally.hp>0&&ally.side===unit.side&&ally.kind==='shieldbearer'&&ally.abilitiesVersion===1&&ally.level>=6&&Math.hypot(ally.x-unit.x,ally.y-unit.y)<=1.8))factor*=.88;
  return factor;
}
function SWTroopSplash(attacker,target,units) {
  if(attacker.abilitiesVersion!==1)return [];
  const kind=attacker.kind,level=attacker.level||1;let radius=0,fraction=0,limit=Infinity;
  if(kind==='grenadier'){radius=level>=6?1:.7;fraction=level>=6?.9:.4;}
  if(kind==='trebuchet'){radius=level>=6?1.5:.8;fraction=level>=6?.65:.3;}
  if(level>=6&&kind==='infantry'){radius=.9;fraction=.35;limit=1;}
  if(level>=6&&kind==='cannon'){radius=.9;fraction=.45;}
  if(level>=9&&kind==='archer'){radius=1;fraction=.6;limit=1;}
  if(level>=9&&kind==='ram'){radius=1.05;fraction=.5;}
  return units.filter(u=>u.id!==target.id&&u.side!==attacker.side&&u.hp>0&&!u.naval&&Math.hypot(u.x-target.x,u.y-target.y)<=radius)
    .sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)||(String(a.id)<String(b.id)?-1:1)).slice(0,limit).map(unit=>({unit,fraction}));
}
function SWMedicHeals(medic,target,units) {
  let amount=20*(1+.14*((medic.level||1)-1));
  if(medic.abilitiesVersion===1&&medic.level>=9&&target.hp/target.maxHp<.35)amount*=1.4;
  const heals=[{unit:target,amount}];
  if(medic.abilitiesVersion===1&&medic.level>=6){
    const next=units.filter(u=>u.id!==target.id&&u.id!==medic.id&&u.side===medic.side&&!u.building&&!u.naval&&u.hp>0&&u.hp<u.maxHp&&Math.hypot(u.x-target.x,u.y-target.y)<=1.8)
      .sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp||(String(a.id)<String(b.id)?-1:1))[0];
    if(next)heals.push({unit:next,amount:amount*.5});
  }
  return heals;
}
function SWNavalUnit(input) {
  const ship=input.navalSupport;
  if(input.navalVersion===3)return SWCreateNavalUnit(ship,'attack');
  if(input.navalVersion!==2||!ship||!['galley','bombard'].includes(ship.kind))return null;
  const level=Math.max(1,Math.min(10,Math.trunc(ship.level)||1)),bombard=ship.kind==='bombard';
  const hp=bombard?520+65*level:380+50*level;
  return {id:'naval-'+ship.id,shipId:ship.id,side:'attack',kind:ship.kind,naval:true,building:false,x:-3,y:3,hp,maxHp:hp,level,damage:bombard?90+18*level:55+12*level,range:16,speed:0,cooldown:bombard?7:5,nextAttack:1};
}
function SWNavalTarget(ship,units) {
  return units.filter(u=>u.side!==ship.side&&u.building&&u.hp>0&&!['wall','gate'].includes(u.kind)&&Math.hypot(u.x-ship.x,u.y-ship.y)<=ship.range)
    .sort((a,b)=>(['tower','mortar','bombtower','flame','bastion'].includes(a.kind)?0:1)-(['tower','mortar','bombtower','flame','bastion'].includes(b.kind)?0:1)||Math.hypot(a.x-ship.x,a.y-ship.y)-Math.hypot(b.x-ship.x,b.y-ship.y)||(String(a.id)<String(b.id)?-1:1))[0]||null;
}
function SWEnemyNavy(defense) {
  if(!defense)return [];
  const level=Math.max(1,Math.min(10,Math.trunc(defense.level)||1));
  return [{id:'coastal-patrol',kind:level>=7?'bombard':'galley',level:Math.ceil(level/2)}];
}
function SWCreateNavalUnit(ship,side,index=0) {
  if(!ship||!['galley','bombard'].includes(ship.kind))return null;
  const level=Math.max(1,Math.min(10,Math.trunc(ship.level)||1)),bombard=ship.kind==='bombard',friendly=side==='attack';
  const hp=friendly?(bombard?800+100*level:620+80*level):(bombard?340+65*level:250+55*level);
  return {id:(friendly?'naval-':'enemy-naval-')+ship.id,shipId:ship.id,side,kind:ship.kind,naval:true,navalVersion:3,building:false,x:-5-index*.65,y:friendly?3:-index*1.3,hp,maxHp:hp,level,damage:friendly?(bombard?90+18*level:55+12*level):(bombard?26+6*level:18+4*level),range:friendly?16:5.2,navalRange:2.3,speed:bombard?.34:.44,cooldown:friendly?(bombard?7:5):(bombard?7:5.5),nextAttack:1+index*.5,heading:friendly?-Math.PI/2:Math.PI/2,vx:0,vy:0};
}
function SWEnemyNavalUnits(input) {
  return input.navalVersion===3&&Array.isArray(input.enemyNavy)?input.enemyNavy.slice(0,2).map((ship,index)=>SWCreateNavalUnit(ship,'defend',index)).filter(Boolean):[];
}
function SWLegacyNavalStep13(ship,units,time,step=.25) {
  ship.vx=0;ship.vy=0;
  if(ship.hp<=0)return null;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),opponents=units.filter(u=>u.naval&&u.side!==ship.side&&u.hp>0);
  opponents.sort((a,b)=>distance(ship,a)-distance(ship,b)||(String(a.id)<String(b.id)?-1:1));
  const rival=opponents[0],station=ship.side==='attack'?{x:-3,y:3}:{x:-3.2,y:.8};
  const destination=rival||station,desired=rival?ship.navalRange*.92:.06,gap=distance(ship,destination);
  let dx=0,dy=0;
  if(gap>desired){
    const stride=Math.min(ship.speed*step,gap-desired);dx=(destination.x-ship.x)/gap*stride;dy=(destination.y-ship.y)/gap*stride;
  }else if(rival&&gap>.1){
    // Broadside maneuvers keep both hulls sailing while their guns track the opposing vessel.
    const stride=ship.speed*step*.3;dx=-(rival.y-ship.y)/gap*stride;dy=(rival.x-ship.x)/gap*stride;
  }
  if(dx||dy){const x=Math.max(-6.5,Math.min(rival?-4.9:-3,ship.x+dx)),y=Math.max(-1.5,Math.min(5.5,ship.y+dy));ship.vx=(x-ship.x)/step;ship.vy=(y-ship.y)/step;ship.x=x;ship.y=y;}
  let target=rival;
  if(!rival){
    if(ship.side==='attack')target=SWNavalTarget(ship,units);
    else target=units.filter(u=>u.side!==ship.side&&!u.naval&&!u.building&&u.hp>0&&distance(ship,u)<=ship.range)
      .sort((a,b)=>distance(ship,a)-distance(ship,b)||(String(a.id)<String(b.id)?-1:1))[0]||null;
  }
  if(ship.vx||ship.vy)ship.heading=Math.atan2(ship.vy,ship.vx);
  else if(target)ship.heading=Math.atan2(target.y-ship.y,target.x-ship.x);
  if(!target||distance(ship,target)>(target.naval?ship.navalRange:ship.range)||time<ship.nextAttack)return null;
  // A fleet wins its sea lane first. Land bombardment starts only after reaching the coastal station.
  if(!target.naval&&distance(ship,station)>.4)return null;
  ship.nextAttack=time+ship.cooldown;
  const damage=ship.damage*(!target.naval&&!target.building ? .45 : 1);
  return {target,damage,splash:ship.kind==='bombard'&&!target.naval?units.filter(u=>u.id!==target.id&&u.side!==ship.side&&!u.naval&&u.hp>0&&distance(u,target)<=1.15).map(unit=>({unit,damage:damage*.35})):[],shot:{x:ship.x,y:ship.y,tx:target.x,ty:target.y,side:ship.side,kind:'naval',navalVersion:3,sourceId:ship.id,targetId:target.id,impact:target.naval?'ship':target.building?'structure':'troop',heading:Math.atan2(target.y-ship.y,target.x-ship.x)}};
}
var _l = (e) => e.kind === `wall` || e.kind === `gate`;
var vl = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
var yl = (e, t) => `${Math.round(e)},${Math.round(t)}`;
function bl(e) {
  let t = [],
    n = e.seed >>> 0,
    r = () => ((n = (1664525 * n + 1013904223) >>> 0), n / 4294967296);
  for (let n of e.defense.buildings) {
    let e =
        (n.kind === `keep`
          ? 420
          : n.kind === `tower`
            ? 135
            : n.kind === `wall`
              ? 230
              : n.kind === `gate`
                ? 185
                : 95) *
        (1 + (n.level - 1) * 0.45),
      i = qc(n);
    t.push({
      id: n.id,
      side: `defend`,
      kind: n.kind,
      x: n.x,
      y: n.y,
      hp: e,
      maxHp: e,
      damage: n.kind === `tower` ? i.damage : n.kind === `keep` ? 6 : 0,
      range: n.kind === `tower` ? i.range : 2.1,
      speed: 0,
      cooldown: n.kind === `tower` ? i.cooldown : 1.65,
      nextAttack: r(),
      building: !0,
      level: n.level,
      specialty: n.specialty,
    });
  }
  let i = {
      left: { x: -1, y: 6 },
      center: { x: 8, y: 8 },
      right: { x: 8, y: -1 },
    },
    a = 0,
    o = { left: 0, center: 0, right: 0 };
  for (let n of Object.keys(J)) {
    let s = J[n],
      c = e.deployments?.[n] || e.front,
      l = i[c];
    for (let i = 0; i < e.army[n]; i++) {
      let i = o[c]++,
        u = ((i % 4) - 1.5) * 0.38,
        d = Math.floor(i / 4) * 0.35;
      t.push({
        id: `a-${a++}`,
        side: `attack`,
        kind: n,
        x: l.x + u + (c === `left` ? -d : c === `center` ? d : 0),
        y: l.y + u + (c === `right` ? -d : c === `center` ? d : 0),
        hp: s.hp,
        maxHp: s.hp,
        damage: s.damage * e.bonus,
        range: s.range,
        speed: s.speed,
        cooldown: s.cooldown,
        nextAttack: r() * 0.7,
        building: !1,
        level: 1,
      });
    }
  }
  if (e.commander) {
    let n = e.commander,
      r = Oc[n.id],
      a = i[e.front],
      o = r.hp * (1 + (n.level - 1) * 0.15) * (n.gear === `armor` ? 1.25 : 1);
    t.push({
      id: `commander`,
      side: `attack`,
      kind: `hero`,
      commander: n.id,
      x: a.x - 0.45,
      y: a.y + 0.45,
      hp: o,
      maxHp: o,
      damage:
        r.damage *
        (1 + (n.level - 1) * 0.12) *
        (n.gear === `blade` ? 1.15 : 1) *
        e.bonus,
      range: r.range,
      speed: r.speed,
      cooldown: 1.1,
      nextAttack: 0,
      building: !1,
      level: n.level,
    });
  }
  for (let n of t.filter((e) => e.side === `attack`)) {
    let r = n.kind === `hero` ? e.front : e.deployments?.[n.kind] || e.front;
    for (
      let e = 0;
      e < 20 &&
      t.some(
        (e) =>
          e.building && Math.abs(e.x - n.x) < 0.7 && Math.abs(e.y - n.y) < 0.7,
      );
      e++
    )
      r === `left`
        ? (n.x -= 0.75)
        : r === `right`
          ? (n.y -= 0.75)
          : ((n.x += 0.75), (n.y += 0.75));
  }
  let s = new Map(t.filter((e) => e.building).map((e) => [yl(e.x, e.y), e])),
    c = Math.min(
      5,
      1 +
        e.defense.buildings.filter((e) => e.kind === `barracks`).length * 2 +
        Math.max(0, e.defense.level - 1),
    );
  for (let n = 0; n < c; n++) {
    let i = [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
    ].find((e) => !s.has(yl(e.x, e.y))) || { x: 0, y: 3 };
    t.push({
      id: `guard-${n}`,
      side: `defend`,
      kind: `infantry`,
      x: i.x + (n % 2) * 0.23,
      y: i.y + Math.floor(n / 2) * 0.18,
      hp: 65 + e.defense.level * 10,
      maxHp: 65 + e.defense.level * 10,
      damage: 7 + e.defense.level,
      range: 0.85,
      speed: 0.8,
      cooldown: 1.4,
      nextAttack: r(),
      building: !1,
      level: e.defense.level,
    });
  }
  let l = new Map(),
    u = 0,
    d = new Map(),
    f = (e, t) => {
      let n = s.get(yl(e, t));
      return n && n.hp > 0 ? n : void 0;
    },
    p = (e, t, n, r = !1) => {
      if (n > 1.3) return !0;
      let i = vl(e, t),
        a = Math.ceil(i * 5);
      for (let n = 1; n < a; n++) {
        let i = f(e.x + ((t.x - e.x) * n) / a, e.y + ((t.y - e.y) * n) / a);
        if (i && i.id !== t.id && !(r && _l(i))) return !1;
      }
      return !0;
    },
    m = (e, t) => {
      let n = { x: Math.round(e.x), y: Math.round(e.y) },
        r = `${u}:${e.id}:${yl(n.x, n.y)}:${t.id}:${yl(t.x, t.y)}`,
        i = d.get(r);
      if (i) return i;
      let a = [n],
        o = new Map([[yl(n.x, n.y), 0]]),
        s = new Map(),
        c,
        l = (n) => Math.max(0, vl(n, t) - e.range - (t.building ? 0.35 : 0));
      for (let n = 0; a.length && n < 400; n++) {
        let n = 0;
        for (let e = 1; e < a.length; e++)
          o.get(yl(a[e].x, a[e].y)) + l(a[e]) <
            o.get(yl(a[n].x, a[n].y)) + l(a[n]) && (n = e);
        let r = a.splice(n, 1)[0],
          i = yl(r.x, r.y);
        if (
          vl(r, t) <= e.range + (t.building ? 0.35 : 0) &&
          p(r, t, e.range, e.side === `attack`)
        ) {
          c = r;
          break;
        }
        for (let [t, n] of [
          [0, -1],
          [-1, 0],
          [1, 0],
          [0, 1],
        ]) {
          let c = { x: r.x + t, y: r.y + n };
          if (c.x < -5 || c.y < -5 || c.x > 14 || c.y > 14) continue;
          let l = f(c.x, c.y),
            u = 0;
          if (l)
            if (e.side === `defend` && l.kind === `gate`) u = 0;
            else if (e.side === `attack` && _l(l))
              u = (l.hp / Math.max(10, e.damage)) * 0.35;
            else continue;
          let d = yl(c.x, c.y),
            p = o.get(i) + 1 + u;
          p < (o.get(d) ?? 1 / 0) &&
            (o.set(d, p),
            s.set(d, r),
            a.some((e) => e.x === c.x && e.y === c.y) || a.push(c));
        }
      }
      let m = [];
      if (c) {
        let e = c;
        for (let t = 0; t < 210 && yl(e.x, e.y) !== yl(n.x, n.y); t++) {
          m.unshift(e);
          let t = s.get(yl(e.x, e.y));
          if (!t) break;
          e = t;
        }
      }
      return (d.set(r, m), m);
    },
    h = (e, t) => {
      let n = `${u}:${t.id}:${yl(t.x, t.y)}`,
        r = l.get(e.id);
      if (r?.signature === n && r.points.length) return r.points;
      let i = m(e, t).map((e) => ({ ...e })),
        a = { x: Math.round(e.x), y: Math.round(e.y) };
      return (
        i.length && vl(a, e) > 0.05 && !f(a.x, a.y) && i.unshift(a),
        l.set(e.id, { signature: n, points: i }),
        i
      );
    },
    g = [],
    _ = [],
    v = 0,
    y = !1,
    b = !1,
    x = -1,
    S = t.find((e) => e.kind === `hero`),
    C = (e, t) => {
      if (e.hp <= 0) return;
      e.side === `attack` &&
        v < x &&
        S &&
        S.hp > 0 &&
        vl(e, S) < 3.6 &&
        (t *= 0.35);
      let n = e.hp;
      ((e.hp = Math.max(0, n - t)),
        n > 0 && e.hp === 0 && e.building && (u++, d.clear()));
    },
    w = (t, n) => {
      if (v < t.nextAttack) return;
      let r = t.damage * (t.kind === `cannon` && n.building ? 2 : 1);
      (t.side === `attack` && n.building && (r *= e.structureBonus || 1),
        t.side === `attack` && y && v < (e.rallyAt || 0) + 7 && (r *= 1.3),
        C(n, r),
        (t.nextAttack = v + t.cooldown),
        _.push({
          x: t.x,
          y: t.y,
          tx: n.x,
          ty: n.y,
          side: t.side,
          kind:
            t.kind === `hero`
              ? t.commander === `ranger`
                ? `archer`
                : t.commander === `engineer`
                  ? `cannon`
                  : `infantry`
              : t.kind,
        }));
    },
    T = t.filter((e) => e.building && !_l(e)).length;
  for (let n = 0; n <= 360; n++) {
    if (((v = n * 0.25), e.rallyAt !== void 0 && !y && v >= e.rallyAt)) {
      for (let e of t.filter((e) => e.side === `attack` && e.hp > 0))
        e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.3);
      y = !0;
    }
    if (S && S.hp > 0 && e.heroAt !== void 0 && !b && v >= e.heroAt) {
      b = !0;
      let n = e.commander?.gear === `manual` ? 1.4 : 1;
      if (S.commander === `captain`) {
        x = v + 8 * n;
        for (let e of t.filter(
          (e) => e.side === `attack` && e.hp > 0 && vl(e, S) < 3.6,
        ))
          e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.18 * n);
      } else {
        let e = t
          .filter(
            (e) =>
              e.side === `defend` &&
              e.hp > 0 &&
              (S.commander === `ranger` || _l(e) || e.kind === `tower`),
          )
          .sort(
            (e, t) =>
              vl(e, S) +
              (e.kind === `tower` ? -3 : 0) -
              (vl(t, S) + (t.kind === `tower` ? -3 : 0)),
          );
        for (let t of e.slice(0, S.commander === `engineer` ? 1 : 3))
          (C(
            t,
            (S.commander === `engineer`
              ? 200 + S.level * 40
              : 80 + S.level * 15) * n,
          ),
            _.push({
              x: S.x,
              y: S.y,
              tx: t.x,
              ty: t.y,
              side: `attack`,
              kind: S.commander === `engineer` ? `cannon` : `archer`,
            }));
      }
    }
    let r = t.filter((e) => e.hp > 0);
    for (let t of r) {
      if (t.hp <= 0 || !t.damage) continue;
      let n = r.filter(
        (e) => e.side !== t.side && e.hp > 0 && (t.side !== `attack` || !_l(e)),
      );
      if (!n.length) continue;
      n.sort(
        (e, n) =>
          vl(t, e) +
          (t.kind === `cannon` && !e.building ? 3 : 0) -
          (vl(t, n) + (t.kind === `cannon` && !n.building ? 3 : 0)),
      );
      let i = n[0];
      if (t.building) {
        let e = n.find((e) => vl(t, e) <= t.range);
        e && w(t, e);
        continue;
      }
      if (vl(t, i) <= t.range + (i.building ? 0.35 : 0) && p(t, i, t.range)) {
        w(t, i);
        continue;
      }
      let a = h(t, i);
      if (!a.length) {
        for (let e of n.slice(1, 5))
          if (((a = h(t, e)), a.length)) {
            i = e;
            break;
          }
      }
      if (!a.length) continue;
      let o = a[0],
        s = f(o.x, o.y),
        c = o,
        l = 0;
      if (s && t.side === `attack` && _l(s)) {
        if (vl(t, s) <= t.range + 0.35) {
          w(t, s);
          continue;
        }
        ((c = s), (l = t.range + 0.3));
      }
      let u = c.x - t.x,
        d = c.y - t.y,
        m = Math.hypot(u, d),
        g =
          t.speed *
          0.25 *
          (t.side === `attack` && y && v < (e.rallyAt || 0) + 7 ? 1.25 : 1),
        _ = Math.max(0, Math.min(g, m - l));
      m &&
        ((t.x += (u / m) * _),
        (t.y += (d / m) * _),
        vl(t, o) < 0.025 && a.shift());
    }
    let i = t.filter((e) => !e.building && e.hp > 0);
    for (let e = 0; e < i.length; e++)
      for (let t = e + 1; t < i.length; t++) {
        let n = i[e],
          r = i[t],
          a = n.x - r.x,
          o = n.y - r.y,
          s = Math.hypot(a, o);
        if (s > 0.001 && s < 0.38) {
          let e = (0.38 - s) * 0.16;
          for (let [t, i] of [
            [n, 1],
            [r, -1],
          ]) {
            let n = t.x + (a / s) * e * i,
              r = t.y + (o / s) * e * i,
              c = f(n, r);
            (!c || (t.side === `defend` && c.kind === `gate`)) &&
              ((t.x = n), (t.y = r));
          }
        }
      }
    let a = t.filter((e) => e.building && !_l(e) && e.hp > 0).length,
      o = Math.round(((T - a) / Math.max(1, T)) * 100);
    if (
      (n % 2 == 0 &&
        (g.push({ time: v, units: jl(t), shots: _, destruction: o }), (_ = [])),
      !t.some((e) => e.side === `attack` && e.hp > 0) || a === 0)
    )
      break;
  }
  let ee = t.find((e) => e.kind === `keep` && e.building),
    E = !!ee && ee.hp <= 0,
    D = Math.round(
      (t.filter((e) => e.building && !_l(e) && e.hp <= 0).length /
        Math.max(1, T)) *
        100,
    ),
    te = { infantry: 0, archer: 0, cavalry: 0, cannon: 0 };
  for (let e of t)
    e.side === `attack` &&
      e.hp > 0 &&
      Object.hasOwn(te, e.kind) &&
      te[e.kind]++;
  return (
    g.push({ time: v, units: jl(t), shots: _, destruction: D }),
    {
      won: E,
      stars: E ? (D === 100 ? 3 : 2) : +(D >= 50),
      destruction: D,
      survivors: te,
      frames: g,
      duration: v,
    }
  );
}
var xl = [`gold`, `wood`, `stone`, `food`];
var Sl = {
    keep: {
      name: `Keep`,
      description: `The heart of your capital. Advance your age and unlock new buildings.`,
      cost: { gold: 280, wood: 135, stone: 160, food: 90 },
      time: 150,
      unlock: 1,
      max: 10,
      sprite: 0,
      benefit: `Unlocks the next age`,
    },
    farm: {
      name: `Farm`,
      description: `Fields and a granary to feed a growing army.`,
      cost: { gold: 55, wood: 49, stone: 0, food: 32 },
      time: 35,
      unlock: 1,
      max: 10,
      sprite: 1,
      benefit: `+24 provisions / min`,
    },
    lumber: {
      name: `Sawmill`,
      description: `Turn the valley’s timber into building materials.`,
      cost: { gold: 55, wood: 0, stone: 35, food: 35 },
      time: 35,
      unlock: 1,
      max: 10,
      sprite: 2,
      benefit: `+28 timber / min`,
    },
    quarry: {
      name: `Quarry`,
      description: `Cut stone for towers, upgrades, and a greater keep.`,
      cost: { gold: 65, wood: 52, stone: 0, food: 35 },
      time: 45,
      unlock: 1,
      max: 10,
      sprite: 3,
      benefit: `+16 stone / min`,
    },
    barracks: {
      name: `Barracks`,
      description: `Train thirteen troop classes. Each level adds six army slots.`,
      cost: { gold: 90, wood: 64, stone: 40, food: 42 },
      time: 60,
      unlock: 1,
      max: 10,
      sprite: 4,
      benefit: `+6 army capacity`,
    },
    forge: {
      name: `Foundry`,
      description: `Improve every soldier’s attack and unlock siege cannons.`,
      cost: { gold: 160, wood: 75, stone: 110, food: 50 },
      time: 90,
      unlock: 2,
      max: 10,
      sprite: 5,
      benefit: `+10% army attack / level`,
    },
    tower: {
      name: `Watchtower`,
      description: `An automatic ranged defense. Position it to cover your keep.`,
      cost: { gold: 80, wood: 49, stone: 80, food: 32 },
      time: 45,
      unlock: 1,
      max: 10,
      sprite: 6,
      benefit: `Defends a 3-tile radius`,
    },
    cottage: {
      name: `Cottage`,
      description: `A home for eight villagers. Each level adds residents and tax income.`,
      cost: { gold: 45, wood: 45, stone: 20, food: 30 },
      time: 35,
      unlock: 1,
      max: 10,
      sprite: 8,
      benefit: `+8 residents · +4 gold / min`,
    },
    market: {
      name: `Marketplace`,
      description: `Trade surplus food for timber, stone, or gold. Merchants also provide steady tax income.`,
      cost: { gold: 100, wood: 68, stone: 45, food: 45 },
      time: 60,
      unlock: 1,
      max: 10,
      sprite: 9,
      benefit: `+10 gold / min`,
    },
    harbor: {
      name: `Shipyard`,
      description: `Build on a coastal berth beside your capital. Launch ships from its pier and collect returning cargo.`,
      cost: { gold: 180, wood: 105, stone: 80, food: 70 },
      time: 120,
      unlock: 1,
      max: 10,
      sprite: 7,
      benefit: `+28 gold / min · +500 storage`,
    },
    builder: {
      name: `Builder’s lodge`,
      description: `An additional permanent construction crew. Upgrades improve construction speed. Up to three lodges.`,
      cost: { gold: 180, wood: 90, stone: 60, food: 60 },
      time: 90,
      unlock: 1,
      max: 10,
      sprite: 10,
      benefit: `+1 permanent builder`,
    },
    wall: {
      name: `Stone walls`,
      description: `Drag across plots to draw a wall. Troops must go around or breach it.`,
      cost: { gold: 4, wood: 0, stone: 8, food: 0 },
      time: 45,
      unlock: 1,
      max: 10,
      sprite: 11,
      benefit: `Shape enemy routes`,
    },
    gate: {
      name: `Fortified gate`,
      description: `Your people pass through; attackers must break it.`,
      cost: { gold: 15, wood: 15, stone: 15, food: 0 },
      time: 45,
      unlock: 1,
      max: 10,
      sprite: 13,
      benefit: `Friendly passage · enemy barrier`,
    },
    monument: {
      name: `Victor’s standard`,
      description: `A capital landmark earned in the weekly league.`,
      cost: { gold: 80, wood: 0, stone: 50, food: 0 },
      time: 60,
      unlock: 1,
      max: 10,
      sprite: 17,
      benefit: `Your league legacy`,
    },
    ...Sc,
  };
var J = {
    infantry: {
      name: `Infantry`,
      description: `Durable frontline soldiers.`,
      cost: { gold: 12, wood: 0, stone: 0, food: 18 },
      hp: 115,
      damage: 13,
      range: 0.85,
      speed: 1.1,
      cooldown: 1,
      unlock: 1,
      icon: `shield`,
    },
    archer: {
      name: `Archers`,
      description: `Attack safely behind the frontline.`,
      cost: { gold: 18, wood: 8, stone: 0, food: 20 },
      hp: 64,
      damage: 12,
      range: 2.65,
      speed: 1,
      cooldown: 1.2,
      unlock: 1,
      icon: `bow`,
    },
    cavalry: {
      name: `Cavalry`,
      description: `Fast, strong attackers for exposed defenses.`,
      cost: { gold: 38, wood: 0, stone: 0, food: 38 },
      hp: 170,
      damage: 21,
      range: 0.85,
      speed: 1.8,
      cooldown: 1.1,
      unlock: 2,
      icon: `horse`,
    },
    cannon: {
      name: `Cannons`,
      description: `Slow siege artillery. Double damage to structures.`,
      cost: { gold: 55, wood: 20, stone: 15, food: 25 },
      hp: 75,
      damage: 21,
      range: 3.5,
      speed: 0.58,
      cooldown: 2,
      unlock: 2,
      icon: `cannon`,
    },
    ...xc,
  };
function wl() {
  return Object.fromEntries(Object.keys(J).map((e) => [e, 0]));
}
var Tl = [
    {
      id: `camp-0`,
      name: `Briarwatch`,
      subtitle: `The bandit encampment`,
      description: `A walled bandit village. Scout its two gates, shield your archers, and keep reinforcements ready.`,
      level: 1,
      reward: { gold: 150, wood: 110, stone: 70, food: 100 },
      bonus: `A foothold in the valley`,
      x: 24,
      y: 68,
    },
    {
      id: `camp-1`,
      name: `Stonecross`,
      subtitle: `The river crossing`,
      description: `Two towers watch the crossing. Approach from a flank to avoid their overlapping fire.`,
      level: 2,
      reward: { gold: 210, wood: 160, stone: 130, food: 130 },
      bonus: `+8 timber / min from the crossing`,
      x: 42,
      y: 52,
    },
    {
      id: `camp-2`,
      name: `Ironridge`,
      subtitle: `The mountain stronghold`,
      description: `A reinforced keep guards the iron road. Bring cavalry or siege cannons.`,
      level: 3,
      reward: { gold: 320, wood: 210, stone: 230, food: 170 },
      bonus: `+8 stone / min from the mines`,
      x: 62,
      y: 34,
    },
    {
      id: `camp-3`,
      name: `Greyhaven`,
      subtitle: `The fortified harbor`,
      description: `Break the coastal defenses and secure a new trading route.`,
      level: 4,
      reward: { gold: 440, wood: 300, stone: 290, food: 230 },
      bonus: `+12 gold / min from sea trade`,
      x: 76,
      y: 57,
    },
    {
      id: `camp-4`,
      name: `The Crown Citadel`,
      subtitle: `The final stronghold`,
      description: `A ring of towers protects the citadel. A full, upgraded army will be essential.`,
      level: 5,
      reward: { gold: 650, wood: 450, stone: 420, food: 350 },
      bonus: `The frontier crown · +100 renown`,
      x: 85,
      y: 22,
    },
    {
      id: `camp-5`,
      name: `Emberport`,
      subtitle: `Chapter 6`,
      description: `A fortified realm with layered defenses. Upgrade your army and plan your breach.`,
      level: 6,
      reward: { gold: 1500, wood: 1e3, stone: 950, food: 700 },
      bonus: `A new chapter of your kingdom`,
      x: 50,
      y: 50,
    },
    {
      id: `camp-6`,
      name: `Blackstone Reach`,
      subtitle: `Chapter 7`,
      description: `A fortified realm with layered defenses. Upgrade your army and plan your breach.`,
      level: 7,
      reward: { gold: 1660, wood: 1100, stone: 1050, food: 780 },
      bonus: `A new chapter of your kingdom`,
      x: 50,
      y: 50,
    },
    {
      id: `camp-7`,
      name: `The Argent Wall`,
      subtitle: `Chapter 8`,
      description: `A fortified realm with layered defenses. Upgrade your army and plan your breach.`,
      level: 8,
      reward: { gold: 1820, wood: 1200, stone: 1150, food: 860 },
      bonus: `A new chapter of your kingdom`,
      x: 50,
      y: 50,
    },
    {
      id: `camp-8`,
      name: `Kingsfall`,
      subtitle: `Chapter 9`,
      description: `A fortified realm with layered defenses. Upgrade your army and plan your breach.`,
      level: 9,
      reward: { gold: 1980, wood: 1300, stone: 1250, food: 940 },
      bonus: `A new chapter of your kingdom`,
      x: 50,
      y: 50,
    },
    {
      id: `camp-9`,
      name: `The Imperial Throne`,
      subtitle: `Chapter 10`,
      description: `A fortified realm with layered defenses. Upgrade your army and plan your breach.`,
      level: 10,
      reward: { gold: 2140, wood: 1400, stone: 1350, food: 1020 },
      bonus: `A new chapter of your kingdom`,
      x: 50,
      y: 50,
    },
  ];
var El = [
    {
      id: `quarry`,
      title: `Lay the foundations`,
      text: `Build a quarry to supply your growing capital.`,
      reward: { gold: 100, wood: 80, stone: 60, food: 60 },
      check: (e) => e.buildings.some((e) => e.kind === `quarry` && e.level > 0),
    },
    {
      id: `barracks`,
      title: `Raise your banner`,
      text: `Complete a barracks to recruit your first army.`,
      reward: { gold: 100, wood: 60, stone: 50, food: 150 },
      check: (e) =>
        e.buildings.some((e) => e.kind === `barracks` && e.level > 0),
    },
    {
      id: `army`,
      title: `Ready for the frontier`,
      text: `Recruit at least six soldiers.`,
      reward: { gold: 100, wood: 50, stone: 50, food: 100 },
      check: (e) => Nl(e.army) >= 6,
    },
    {
      id: `victory`,
      title: `Beyond the gates`,
      text: `Capture Briarwatch in the campaign.`,
      reward: { gold: 150, wood: 120, stone: 100, food: 100 },
      check: (e) => e.campaign > 0,
    },
    {
      id: `age2`,
      title: `A kingdom in stone`,
      text: `Upgrade your keep to level 2.`,
      reward: { gold: 180, wood: 160, stone: 150, food: 140 },
      check: (e) => Ml(e) >= 2,
    },
    {
      id: `forge`,
      title: `The age of gunpowder`,
      text: `Build a foundry and unlock your first cannons.`,
      reward: { gold: 200, wood: 120, stone: 100, food: 160 },
      check: (e) => e.buildings.some((e) => e.kind === `forge` && e.level > 0),
    },
    {
      id: `frontier`,
      title: `Claim the frontier`,
      text: `Capture the first five campaign strongholds.`,
      reward: { gold: 400, wood: 300, stone: 300, food: 300 },
      check: (e) => e.campaign >= 5,
    },
  ];
var Dl = [
    {
      id: `foundation`,
      title: `Solid foundations`,
      description: `Complete your first quarry.`,
      icon: `hammer`,
      target: 1,
      value: (e) =>
        e.buildings.filter((e) => e.kind === `quarry` && e.level > 0).length,
      reward: { gold: 60, wood: 40, stone: 30, food: 0 },
    },
    {
      id: `banner`,
      title: `A banner to follow`,
      description: `Complete your first barracks.`,
      icon: `flag`,
      target: 1,
      value: (e) =>
        e.buildings.filter((e) => e.kind === `barracks` && e.level > 0).length,
      reward: { gold: 60, wood: 0, stone: 0, food: 80 },
    },
    {
      id: `first_victory`,
      title: `First conquest`,
      description: `Capture Briarwatch.`,
      icon: `swords`,
      target: 1,
      value: (e) => e.campaign,
      reward: { gold: 100, wood: 50, stone: 50, food: 50 },
    },
    {
      id: `town`,
      title: `From village to town`,
      description: `Complete eight buildings.`,
      icon: `castle`,
      target: 8,
      value: (e) => e.buildings.filter((e) => e.level > 0 && !zc(e)).length,
      reward: { gold: 100, wood: 80, stone: 60, food: 0 },
    },
    {
      id: `defense`,
      title: `Standing guard`,
      description: `Complete two watchtowers.`,
      icon: `shield`,
      target: 2,
      value: (e) =>
        e.buildings.filter((e) => e.kind === `tower` && e.level > 0).length,
      reward: { gold: 80, wood: 0, stone: 100, food: 0 },
    },
    {
      id: `age`,
      title: `A new age`,
      description: `Advance your keep to level 2.`,
      icon: `crown`,
      target: 2,
      value: (e) => Ml(e),
      reward: { gold: 150, wood: 80, stone: 80, food: 60 },
    },
    {
      id: `forge`,
      title: `Fire and iron`,
      description: `Complete a foundry.`,
      icon: `flame`,
      target: 1,
      value: (e) =>
        e.buildings.filter((e) => e.kind === `forge` && e.level > 0).length,
      reward: { gold: 120, wood: 60, stone: 60, food: 60 },
    },
    {
      id: `people`,
      title: `A place to call home`,
      description: `Grow your population to 50.`,
      icon: `users`,
      target: 50,
      value: (e) => zl(e),
      reward: { gold: 150, wood: 100, stone: 0, food: 100 },
    },
    {
      id: `veteran`,
      title: `Battle tested`,
      description: `Win five battles.`,
      icon: `trophy`,
      target: 5,
      value: (e) => e.wins,
      reward: { gold: 180, wood: 80, stone: 80, food: 100 },
    },
    {
      id: `crown`,
      title: `Crown of the frontier`,
      description: `Capture all five strongholds.`,
      icon: `crown`,
      target: 5,
      value: (e) => e.campaign,
      reward: { gold: 300, wood: 150, stone: 150, food: 150 },
    },
    {
      id: `shipwright`,
      title: `A seafaring realm`,
      description: `Complete your first ship.`,
      icon: `flag`,
      target: 1,
      value: (e) => (e.fleet || []).filter((e) => e.level > 0).length,
      reward: { gold: 80, wood: 100, stone: 0, food: 40 },
    },
    {
      id: `armada`,
      title: `Admiral of the coast`,
      description: `Build a fleet of four ships.`,
      icon: `crown`,
      target: 4,
      value: (e) => (e.fleet || []).filter((e) => e.level > 0).length,
      reward: { gold: 350, wood: 200, stone: 100, food: 200 },
    },
    {
      id: `citadel`,
      title: `A capital in stone`,
      description: `Reach keep level 5.`,
      icon: `crown`,
      target: 5,
      value: (e) => Ml(e),
      reward: { gold: 800, wood: 500, stone: 500, food: 300 },
    },
    {
      id: `master_troop`,
      title: `The finest in the realm`,
      description: `Upgrade a troop class to level 10.`,
      icon: `swords`,
      target: 10,
      value: (e) =>
        Math.max(1, ...Object.values(e.unitLevels || {}).map((e) => e || 1)),
      reward: { gold: 1200, wood: 800, stone: 800, food: 1e3 },
    },
    {
      id: `imperial`,
      title: `An imperial capital`,
      description: `Reach keep level 10.`,
      icon: `crown`,
      target: 10,
      value: (e) => Ml(e),
      reward: { gold: 3e3, wood: 2e3, stone: 2e3, food: 2e3 },
    },
    {
      id: `throne`,
      title: `The Imperial Throne`,
      description: `Conquer all ten campaign strongholds.`,
      icon: `trophy`,
      target: 10,
      value: (e) => e.campaign,
      reward: { gold: 2200, wood: 1200, stone: 1200, food: 1200 },
    },
  ];
function Ol(e, t) {
  return Math.min(t.target, Math.max(0, t.value(e)));
}
function Al(e = Date.now()) {
  return {
    schema: 1,
    balanceVersion: 2,
    gemVersion: 1,
    gems: 100,
    name: `Havencrest`,
    resources: { gold: 430, wood: 360, stone: 240, food: 260 },
    buildings: [
      { id: `keep`, kind: `keep`, x: 3, y: 3, level: 1 },
      { id: `farm`, kind: `farm`, x: 2, y: 5, level: 1 },
      { id: `lumber`, kind: `lumber`, x: 1, y: 2, level: 1 },
      { id: `cottage`, kind: `cottage`, x: 5, y: 2, level: 1 },
      { id: `market`, kind: `market`, x: 5, y: 5, level: 1 },
    ],
    army: wl(),
    terrain: [
      { x: 0, y: 3, kind: `tree` },
      { x: 1, y: 4, kind: `tree` },
      { x: 6, y: 2, kind: `rock` },
      { x: 4, y: 6, kind: `rock` },
    ],
    fleet: [],
    lastTick: e,
    campaign: 0,
    wins: 0,
    rating: 100,
    quests: [],
    published: !1,
    activeBattle: null,
    revision: 0,
    research: 0,
  };
}
function jl(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ml(e) {
  return e.buildings.find((e) => e.kind === `keep`)?.level || 1;
}
function Nl(e) {
  return Object.values(e).reduce((e, t) => e + t, 0);
}
function Pl(e) {
  return Math.min(
    72,
    6 +
      4 * (e.provinces?.find((e) => e.id === `highmarch`)?.level || 0) +
      e.buildings
        .filter((e) => e.kind === `barracks`)
        .reduce((e, t) => e + t.level * 6, 0),
  );
}
function Fl(e) { return SWCapacity(e); }
function Il(e, now=Date.now()) {
  const income={gold:6,wood:2,stone:2,food:4},land=SWLandStats(e),connected=new Set(land.connectedIds);
  for(const b of e.buildings){if(!b.level)continue;const roads=connected.has(b.id)?1.1:1,level=b.level;
   if(b.kind==='farm')income.food+=24*level*roads;
   if(b.kind==='lumber')income.wood+=28*level*roads;
   if(b.kind==='quarry')income.stone+=16*level*roads;
   if(b.kind==='keep')income.gold+=8*level;
   if(b.kind==='harbor')income.gold+=4*level*roads;
   if(b.kind==='cottage')income.gold+=4*level*roads*(1+land.gardenBonus);
   if(b.kind==='market')income.gold+=10*level*roads;
  }
  const renown=SWCampaignProgress17(e).total;
  if(renown>=2)income.wood+=8;if(renown>=3)income.stone+=8;if(renown>=4)income.gold+=12;
  for(const province of e.provinces||[]){const spec=Ac.find(p=>p.id===province.id);if(spec)income[spec.resource]+=spec.income*province.level;}
  const civicBonus=1+Math.min(.2,SWCivicLevel(e,'well')*.02)+((e.city?.festivalUntil||0)>now?.15:0);
  const projects=SWCivicBonuses(e);income.gold*=1+projects.goldIncome;income.food*=1+projects.foodIncome;
  for(const resource of xl)income[resource]*=civicBonus;return income;
}
function SWLegacyY13(e, t = Date.now()) {
  let n = jl(e);
  SWMigrateCoast(n);
  SWMigrateStorage(n);
  SWMigratePremium(n);
  SWCityTick(n, t);
  SWMigrateRaids(n,t);
  if (!n.gemVersion) { n.gemVersion = 1; n.gems = 100; }
  n.gems = Number.isSafeInteger(n.gems) && n.gems >= 0 ? n.gems : 0;
  if (!n.balanceVersion) {
    for (let e of Object.values(n.commanders || {}))
      e && (e.xp = Math.min(1440, Math.round(e.xp * 1.6)));
    n.balanceVersion = 2;
  }
  ((n.army = { ...wl(), ...n.army }),
    (n.unitLevels ||= {}),
    (n.fleet ||= []),
    (n.terrain ||= []),
    n.trainingResearch &&
      n.trainingResearch.readyAt <= t &&
      ((n.unitLevels[n.trainingResearch.kind] = n.trainingResearch.level),
      delete n.trainingResearch));
  for (const ship of n.fleet) if(ship.combatBattleId && ship.combatBattleId!==n.activeBattle) delete ship.combatBattleId;
  for (let e of n.fleet)
    e.readyAt &&
      e.readyAt <= t &&
      ((e.level = e.targetLevel || 1), delete e.readyAt, delete e.targetLevel);
  let r = Math.max(n.lastTick, t),
    i = Math.max(n.lastTick, r - 8 * 36e5),
    a = n.buildings
      .filter((e) => e.readyAt && e.readyAt <= r)
      .map((e) => e.readyAt)
      .sort((e, t) => e - t);
  for(const project of Object.values(n.city?.projects||{}))if(project.readyAt&&project.readyAt<=r)a.push(project.readyAt);
  if(n.city?.festivalUntil>i && n.city.festivalUntil<r)a.push(n.city.festivalUntil);a.sort((a,b)=>a-b);
  for (let e of [...a, r]) {
    let t = Math.max(i, e),
      r = Il(n, i),
      a = Fl(n);
    for (let e of xl)
      n.resources[e] = Math.min(a, n.resources[e] + (r[e] * (t - i)) / 6e4);
    for (let e of n.buildings)
      e.readyAt &&
        e.readyAt <= t &&
        ((e.level = e.targetLevel || 1),
        delete e.readyAt,
        delete e.targetLevel,
        delete e.projectId);
    SWCivicTick(n,t);
    SWMigrateRaids(n,t);
    i = t;
  }
  n.lastTick = r;
  let o = Pc(t);
  return (
    n.season?.id !== o.id &&
      (n.season = { id: o.id, points: 0, wins: 0, losses: 0 }),
    n
  );
}
function SWStorageContribution(level){return level>0?Math.round(800*Math.pow(1.5,Math.min(10,level)-1)):0;}
function SWCapacity(state){return 500+250*Ml(state)+state.buildings.filter(b=>b.kind==='storehouse').reduce((sum,b)=>sum+SWStorageContribution(b.level),0);}
function SWBuildingCount(state,kind){return state.buildings.filter(b=>b.kind===kind).length;}
function SWBuildingLimit(state,kind){
 const level=Math.max(1,Math.min(10,Ml(state)));
 const limits={keep:1,farm:1+Math.floor((level-1)/3),lumber:1+Math.floor((level-1)/3),quarry:1+Math.floor((level-1)/4),barracks:1+(level>=5),forge:1,market:1,harbor:1,workshop:1,tavern:1,monument:1,builder:1+(level>=4)+(level>=7),cottage:2+Math.floor((level-1)/2),tower:2+Math.floor((level-1)/2),wall:20+8*level,gate:2+Math.floor(level/3),storehouse:1+(level>=4)+(level>=7),well:1+(level>=6),mortar:1+(level>=6),bombtower:1+(level>=8),flame:1+(level>=8),bastion:1+(level>=9)};
 return limits[kind]??0;
}
function SWCanReceive(state,reward,cost={}){return xl.every(k=>state.resources[k]-(cost[k]||0)+(reward[k]||0)<=SWCapacity(state)+1e-6);}
function SWRequireRoom(state,reward,cost){if(!SWCanReceive(state,reward,cost))throw Error('Make room in your stores before collecting this reward.');}
function SWMigrateStorage(state){
 const cap=SWCapacity(state);state.reserveCrates||={gold:0,wood:0,stone:0,food:0};
 if(!state.storageVersion){for(const k of xl){const excess=Math.max(0,state.resources[k]-cap);state.reserveCrates[k]=(state.reserveCrates[k]||0)+excess;state.resources[k]-=excess;}state.storageVersion=1;}
 for(const k of xl){state.resources[k]=Math.max(0,Math.min(cap,state.resources[k]||0));state.reserveCrates[k]=Math.max(0,state.reserveCrates[k]||0);}
 for(const b of state.buildings)if(!Number.isInteger(b.facing))b.facing=b.axis==='y'?1:0;
}
function SWClaimReserve(state){let total=0;for(const k of xl){const value=Math.min(state.reserveCrates?.[k]||0,Math.max(0,SWCapacity(state)-state.resources[k]));state.resources[k]+=value;state.reserveCrates[k]-=value;total+=value;}if(total<.000001)throw Error('Spend supplies or expand storage to open space for reserve crates.');}
function SWFacing(value,fallback=0){if(value===undefined)return fallback;if(!Number.isInteger(value)||value<0||value>3)throw Error('Choose one of the four building directions.');return value;}
function SWLandStats(state){
 const key=(x,y)=>x+','+y,adj=p=>[[p.x-1,p.y],[p.x+1,p.y],[p.x,p.y-1],[p.x,p.y+1]],placedRoads=new Set((state.terrain||[]).filter(t=>t.kind==='road'&&!state.buildings.some(b=>b.kind!=='gate'&&b.x===t.x&&b.y===t.y)).map(t=>key(t.x,t.y))),roads=new Set([...placedRoads,...Array.from({length:6},(_,i)=>key(-1,i+1))]),keep=state.buildings.find(b=>b.kind==='keep'),reached=new Set(),queue=[];
 if(keep)for(const [x,y]of adj(keep)){const k=key(x,y);if(roads.has(k)){reached.add(k);queue.push({x,y});}}
 for(let i=0;i<queue.length;i++)for(const[x,y]of adj(queue[i])){const k=key(x,y);if(roads.has(k)&&!reached.has(k)){reached.add(k);queue.push({x,y});}}
 const connectedIds=state.buildings.filter(b=>b.kind!=='keep'&&b.level>0&&adj(b).some(([x,y])=>reached.has(key(x,y)))).map(b=>b.id);
 const gardens=(state.terrain||[]).filter(t=>t.kind==='garden'&&!state.buildings.some(b=>b.x===t.x&&b.y===t.y)),beneficial=gardens.filter(t=>state.buildings.some(b=>b.kind==='cottage'&&b.level>0&&Math.abs(b.x-t.x)+Math.abs(b.y-t.y)===1)).length;
 return {connectedIds,connectedCount:connectedIds.length,roadCount:placedRoads.size,connectedRoadCount:[...reached].filter(k=>placedRoads.has(k)).length,gardenCount:gardens.length,gardenBonus:Math.min(.1,beneficial*.02),incomeBonus:.1};
}
function SWRaidLoot(state,result){
 const protectedAmount=Math.floor(SWCapacity(state)*.2),fraction=.10*Math.max(0,Math.min(1,(result.destruction||0)/100))+(result.won?.08:0);
 return Object.fromEntries(xl.map(k=>[k,Math.floor(Math.max(0,state.resources[k]-protectedAmount)*fraction)]));
}
for(const province of Ac){const additions=[];for(let x=0;x<18;x++)for(let y=0;y<18;y++)if(x>=16||y>=16){const owner=x>=16&&y<6?'whisperwood':x>=16&&y<12?'sunmeadow':x>=16?'ironpass':x<6?'tidewatch':'highmarch';if(province.id===owner&&!province.tiles.some(t=>t.x===x&&t.y===y))additions.push({x,y});}province.tiles.push(...additions);}
function SWTradeQuote(state,resource,amount,payWith='food') {
  if(!xl.includes(resource)||!xl.includes(payWith)||payWith===resource||![50,100,250].includes(amount))throw Error('Choose two different resources and a trade amount.');
  const payment=amount*(payWith==='food'&&resource==='stone'?3:2);
  const reason=!state.buildings.some(b=>b.kind==='market'&&b.level>0)?'Complete a marketplace first.':state.resources[payWith]<payment?'More '+(payWith==='wood'?'timber':payWith)+' needed.':state.resources[resource]+amount>Fl(state)?'Make room in storage first.':null;
  return {resource,amount,payWith,payment,food:payWith==='food'?payment:0,reason};
}
function SWApplyTrade(state,action) {
  if(action.type!=='marketTrade')return false;
  const quote=SWTradeQuote(state,action.resource,action.amount,action.payWith||'food');
  if(quote.reason)throw Error(quote.reason);
  state.resources[quote.payWith]-=quote.payment;state.resources[quote.resource]+=quote.amount;return true;
}
Object.assign(Sl, {
  well:{name:'Village well',description:'Fresh water improves every resource producer. Each level adds 2% income, up to 20% across your wells.',cost:{gold:90,wood:35,stone:80,food:25},time:45,unlock:1,max:10,sprite:5,benefit:'+2% all resource income per level'},
  storehouse:{name:'Storehouse',description:'Keep more goods at home and supply the town.',cost:{gold:140,wood:110,stone:60,food:40},time:65,unlock:1,max:10,sprite:6,benefit:'Larger stores with every upgrade'},
  workshop:{name:'Artisan workshop',description:'Craft materials and equip your construction crews. Each level speeds building by 3%, up to 30%.',cost:{gold:180,wood:120,stone:100,food:65},time:85,unlock:2,max:10,sprite:5,benefit:'Craft goods · faster construction'},
  tavern:{name:'Town tavern',description:'A place for residents to gather. Improves request rewards and hosts festivals.',cost:{gold:160,wood:95,stone:65,food:100},time:75,unlock:2,max:10,sprite:6,benefit:'Resident requests · town festivals'}
});
const SWCityRecipes={
 stone:{name:'Dressed stone',cost:{gold:0,wood:50,stone:0,food:30},reward:{gold:0,wood:0,stone:90,food:0},duration:60},
 goods:{name:'Crafted goods',cost:{gold:0,wood:65,stone:35,food:25},reward:{gold:150,wood:0,stone:0,food:0},duration:90}
};
function SWCivicLevel(state,kind){return state.buildings.filter(b=>b.kind===kind).reduce((sum,b)=>sum+b.level,0);}
function SWCity(state){return state.city||{jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{}};}
function SWCityRequest(state,slot){
 const city=SWCity(state),record=city.requests?.[slot]||{count:0,readyAt:0},index=(slot+record.count)%3;
 const templates=[
  {name:'Meals for the workers',text:'The construction crews need a hot meal.',cost:{gold:0,wood:10,stone:0,food:85},reward:{gold:115,wood:0,stone:20,food:0}},
  {name:'Repair the market carts',text:'Replace the wheels and keep local trade moving.',cost:{gold:0,wood:70,stone:20,food:0},reward:{gold:100,wood:0,stone:0,food:75}},
  {name:'Supplies for new homes',text:'Residents are furnishing their new cottages.',cost:{gold:15,wood:50,stone:25,food:25},reward:{gold:135,wood:0,stone:35,food:0}}
 ];
 const task=templates[index],bonus=1+Math.min(.5,SWCivicLevel(state,'tavern')*.05);
 return {...task,reward:{...task.reward,gold:Math.round(task.reward.gold*bonus)},id:slot+':'+record.count,slot,readyAt:record.readyAt};
}
function SWShipRepairCost(ship){return Object.fromEntries(xl.map(k=>[k,Math.ceil(nl(ship.kind,ship.level)[k]*.35)]));}
function SWCityTick(state,now){
 for(const ship of state.fleet||[])if(ship.repairReadyAt&&ship.repairReadyAt<=now){delete ship.wrecked;delete ship.repairReadyAt;}
}
function SWCityAction(state,action,now){
 if(!['cityRequest','startCraft','collectCraft','festival','repairShip'].includes(action.type))return false;
 state.city={jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{},...state.city};
 const city=state.city;
 if(action.type==='repairShip'){
  const ship=state.fleet.find(s=>s.id===action.id);
  if(!ship?.wrecked||ship.repairReadyAt||ship.combatBattleId)throw Error('Choose a wrecked ship that is not being repaired.');
  if(state.fleet.some(s=>s.readyAt||s.repairReadyAt))throw Error('Your shipwright is already building or repairing a vessel.');
  Q(state,SWShipRepairCost(ship));ship.repairReadyAt=now+Math.ceil(wc[ship.kind].time*(1+.2*(ship.level-1))*.6*(1-SWCivicBonuses(state).repairSpeed))*1000;
 }else if(action.type==='cityRequest'){
  if(!Number.isInteger(action.slot)||action.slot<0||action.slot>2)throw Error('Choose a resident request.');
  const task=SWCityRequest(state,action.slot);
  if(task.id!==action.id||task.readyAt>now)throw Error('A new resident request will arrive shortly.');
  SWRequireRoom(state,task.reward,task.cost);Q(state,task.cost);Ll(state,task.reward);city.jobs++;
  city.requests={...city.requests,[action.slot]:{count:(city.requests?.[action.slot]?.count||0)+1,readyAt:now+60000}};
  if(city.jobs%5===0)state.gems+=3;
 }else if(action.type==='startCraft'){
  const recipe=SWCityRecipes[action.kind];
  if(!recipe||!SWCivicLevel(state,'workshop'))throw Error('Complete an artisan workshop first.');
  if(city.craft)throw Error('Collect the current workshop order first.');
  Q(state,recipe.cost);city.craft={kind:action.kind,readyAt:now+Math.max(20,recipe.duration-SWCivicLevel(state,'workshop')*3)*1000};
 }else if(action.type==='collectCraft'){
  if(!city.craft||city.craft.readyAt>now)throw Error('Your artisans are still working.');
  const recipe=SWCityRecipes[city.craft.kind];if(!recipe)throw Error('Unknown workshop order.');
  if(xl.some(k=>state.resources[k]+recipe.reward[k]>Fl(state)))throw Error('Make room in storage before collecting.');
  Ll(state,recipe.reward);delete city.craft;city.crafted++;
 }else if(action.type==='festival'){
  if(!SWCivicLevel(state,'tavern'))throw Error('Complete a town tavern first.');
  if((city.festivalReadyAt||0)>now)throw Error('Let the town prepare for its next festival.');
  Q(state,{gold:60,wood:0,stone:0,food:180});city.festivalUntil=now+(10+SWCivicBonuses(state).festivalMinutes)*60000;city.festivalReadyAt=now+1200000;
 }
 return true;
}
function SWDefenseInput(state){
 const level=Math.min(10,1+SWCity(state).raidWins),defense=Wl(state),army=wl(),orders=[];
 army.infantry=5+level*2;army.archer=2+level;army.ram=level>=3?Math.floor(level/3):0;
 const bounds=fl(defense),points=[{x:bounds.minX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:bounds.maxX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:Math.round((bounds.minX+bounds.maxX)/2),y:bounds.maxY}];
 for(const kind of Object.keys(army))for(let i=0;i<army[kind];i++)orders.push({kind,...points[Math.floor(orders.length/6)%points.length],time:Math.floor(orders.length/6)*4});
 return {defense,army,orders,bonus:1,front:'center',rulesVersion:4,combatVersion:12,presentationVersion:12,healerTacticsVersion:1,troopAbilitiesVersion:1,unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,Math.max(1,Math.ceil(level/2))])),seed:(state.revision*7919+level*131)>>>0,defenseRaidLevel:level,defenseEconomyVersion:2};
}
function SWResolveDefense(state,input,result,now=Date.now()){
 const city=state.city={jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{},...state.city};
 const won=!result.won,level=input.defenseRaidLevel||1;
 const loot=input.defenseEconomyVersion===2?SWRaidLoot(state,result):{gold:won?0:Math.min(150,Math.floor(state.resources.gold*.05)),wood:0,stone:0,food:0};
 for(const k of xl)state.resources[k]-=loot[k];
 const reward=won?Ll(state,{gold:120+level*45,wood:35+level*15,stone:40+level*20,food:30+level*10}):{gold:0,wood:0,stone:0,food:0};
 city.raidCount++;if(won){city.raidWins++;state.gems+=2;}city.raidReadyAt=now+300000;
 return {won,reward,lost:Object.values(loot).reduce((a,b)=>a+b,0),loot};
}
Dl.push(
 {id:'civic_water',title:'Water for everyone',description:'Complete your first village well.',icon:'users',target:1,value:s=>SWCivicLevel(s,'well'),reward:{gold:80,wood:25,stone:45,food:30}},
 {id:'helping_hands',title:'Helping hands',description:'Complete five resident requests.',icon:'users',target:5,value:s=>SWCity(s).jobs,reward:{gold:150,wood:60,stone:60,food:60}},
 {id:'artisan',title:'Made in Havencrest',description:'Collect three workshop orders.',icon:'hammer',target:3,value:s=>SWCity(s).crafted,reward:{gold:160,wood:80,stone:80,food:0}},
 {id:'hold_the_line',title:'Hold the line',description:'Repel your first computer raid.',icon:'shield',target:1,value:s=>SWCity(s).raidWins,reward:{gold:180,wood:60,stone:100,food:60}},
 {id:'frontier_provinces',title:'A wider world',description:'Capture your first province.',icon:'flag',target:1,value:s=>s.provinces?.length||0,reward:{gold:120,wood:100,stone:80,food:40}}
);
const SWCivicProjects=[
 {id:'market',name:'Market square',description:'Turn the market into a busy civic center with stalls, lighting and a guild court.',anchorKind:'market',stages:[
  {name:'Trading square',benefit:'+5% gold production',keep:2,anchorLevel:1,roads:2,jobs:1,duration:90,cost:{gold:180,wood:120,stone:150,food:100}},
  {name:'Lantern market',benefit:'+10% gold production',keep:4,anchorLevel:2,roads:6,jobs:5,duration:240,cost:{gold:600,wood:400,stone:500,food:350}},
  {name:'Guild court',benefit:'+15% gold production',keep:7,anchorLevel:4,roads:10,jobs:15,duration:600,cost:{gold:2200,wood:1500,stone:2000,food:1000}}]},
 {id:'waterfront',name:'Working waterfront',description:'Equip the harbor with cargo facilities and better shipwright services.',anchorKind:'harbor',stages:[
  {name:'Cargo landing',benefit:'Voyages 5% faster · ship repairs 10% faster',keep:3,anchorLevel:2,ships:1,duration:120,cost:{gold:300,wood:320,stone:180,food:150}},
  {name:'Shipwright quay',benefit:'Voyages 10% faster · ship repairs 20% faster',keep:5,anchorLevel:3,ships:2,duration:360,cost:{gold:1100,wood:900,stone:600,food:400}},
  {name:'Merchant waterfront',benefit:'Voyages 15% faster · ship repairs 30% faster',keep:8,anchorLevel:5,ships:3,duration:720,cost:{gold:3300,wood:3000,stone:2200,food:1600}}]},
 {id:'homes',name:'Residential quarter',description:'Add shared services, meeting spaces and a skilled neighborhood workforce.',anchorKind:'cottage',stages:[
  {name:'Village commons',benefit:'Construction 5% faster · 12 more residents',keep:2,anchorLevel:1,homes:1,well:1,duration:90,cost:{gold:170,wood:150,stone:100,food:120}},
  {name:'Neighborhood hall',benefit:'Construction 10% faster · 24 more residents',keep:4,anchorLevel:2,homes:2,well:1,duration:240,cost:{gold:650,wood:550,stone:450,food:400}},
  {name:'Town quarter',benefit:'Construction 15% faster · 36 more residents',keep:7,anchorLevel:4,homes:3,well:2,duration:600,cost:{gold:1800,wood:2200,stone:1700,food:1400}}]},
 {id:'gardens',name:'Public gardens',description:'Build a planted gathering place around the village well.',anchorKind:'well',stages:[
  {name:'Kitchen gardens',benefit:'+5% food production · festivals last 2 minutes longer',keep:2,anchorLevel:1,gardens:1,roads:2,duration:60,cost:{gold:150,wood:80,stone:90,food:90}},
  {name:'Community orchard',benefit:'+10% food production · festivals last 4 minutes longer',keep:4,anchorLevel:2,gardens:3,roads:6,duration:180,cost:{gold:400,wood:300,stone:350,food:200}},
  {name:'Fountain gardens',benefit:'+15% food production · festivals last 6 minutes longer',keep:6,anchorLevel:3,gardens:5,roads:10,duration:420,cost:{gold:1200,wood:850,stone:1000,food:600}}]}
];
function SWCivicStage(state,id){return Math.max(0,Math.min(3,state.city?.projects?.[id]?.stage||0));}
function SWCivicBonuses(state){return {goldIncome:.05*SWCivicStage(state,'market'),foodIncome:.05*SWCivicStage(state,'gardens'),buildSpeed:.05*SWCivicStage(state,'homes'),voyageSpeed:.05*SWCivicStage(state,'waterfront'),repairSpeed:.1*SWCivicStage(state,'waterfront'),festivalMinutes:2*SWCivicStage(state,'gardens'),residents:12*SWCivicStage(state,'homes')};}
function SWCivicProject(state,id,now=Date.now()){
 const def=SWCivicProjects.find(p=>p.id===id);if(!def)throw Error('Choose a civic project.');
 const record=state.city?.projects?.[id]||{},stage=SWCivicStage(state,id),next=def.stages[stage],anchor=state.buildings.filter(b=>b.kind===def.anchorKind&&b.level>0).sort((a,b)=>b.level-a.level)[0],land=SWLandStats(state),requirements=[];
 if(next){requirements.push({label:'Keep level '+next.keep,met:Ml(state)>=next.keep,buildKind:'keep',action:'building'},{label:Sl[def.anchorKind].name+' level '+next.anchorLevel,met:!!anchor&&anchor.level>=next.anchorLevel,buildKind:def.anchorKind,action:'building'});
  if(next.roads)requirements.push({label:next.roads+' roads connected to the Keep',met:land.connectedRoadCount>=next.roads,action:'plan'});
  if(next.jobs)requirements.push({label:next.jobs+' resident requests fulfilled',met:(SWCity(state).jobs||0)>=next.jobs,action:'residents'});
  if(next.ships)requirements.push({label:next.ships+' completed ships',met:(state.fleet||[]).filter(s=>s.level>0).length>=next.ships,buildKind:'harbor',action:'fleet'});
  if(next.homes)requirements.push({label:next.homes+' completed cottages',met:state.buildings.filter(b=>b.kind==='cottage'&&b.level>0).length>=next.homes,buildKind:'cottage',action:'build'});
  if(next.well)requirements.push({label:'Village well level '+next.well,met:state.buildings.some(b=>b.kind==='well'&&b.level>=next.well),buildKind:'well',action:'building'});
  if(next.gardens)requirements.push({label:next.gardens+' planted gardens',met:land.gardenCount>=next.gardens,action:'plan'});
 }
 const claimable=stage>(record.claimedStage||0),status=record.readyAt?'building':claimable?'claimable':stage===3?'complete':requirements.some(r=>!r.met)?'locked':'available';
 const reason=status==='building'?'Construction underway':claimable?'Celebrate the completed stage first':stage===3?'District complete':requirements.find(r=>!r.met)?.label||(!Rc(state)?'All construction crews are working':!Z(state,next.cost)?'More resources needed':null);
 return {...def,stage,nextStage:Math.min(3,stage+1),targetStage:record.targetStage,startedAt:record.startedAt,readyAt:record.readyAt,siteId:record.siteId||anchor?.id,status,benefit:stage?def.stages[stage-1].benefit:'No district bonus yet',nextBenefit:next?.benefit||def.stages[2].benefit,stageName:stage?def.stages[stage-1].name:'Not started',nextName:next?.name,cost:next?.cost||{gold:0,wood:0,stone:0,food:0},duration:next?.duration||0,requirements,reason,gemReward:claimable?stage*5:(stage+1)*5};
}
function SWCivicTick(state,now){
 for(const project of Object.values(state.city?.projects||{}))if(project.readyAt&&project.readyAt<=now){project.stage=project.targetStage;delete project.targetStage;delete project.startedAt;delete project.readyAt;}
}
function SWCivicProjectAction(state,action,now){
 if(!['startCivicProject','claimCivicProject'].includes(action.type))return false;
 const quote=SWCivicProject(state,action.id,now);state.city={...SWCity(state),projects:{...state.city?.projects}};
 if(action.type==='startCivicProject'){
  if(quote.reason)throw Error(quote.reason+'.');if(quote.status!=='available')throw Error('This district stage is not available.');
  Q(state,quote.cost);state.city.projects[action.id]={...state.city.projects[action.id],stage:quote.stage,siteId:quote.siteId,targetStage:quote.nextStage,startedAt:now,readyAt:now+quote.duration*1000};
 }else{
  if(quote.status!=='claimable')throw Error('This district celebration has already been collected.');
  state.gems+=quote.gemReward;state.city.projects[action.id]={...state.city.projects[action.id],claimedStage:quote.stage};
  state.city.prosperity=(state.city.prosperity||0)+quote.stage*10;
 }
 return true;
}
const SWRaidTiming={initialShield:20*60000,warning:5*60000,shield:2*3600000};
function SWMigrateRaids(state,now){
 state.city={...SWCity(state)};
 if(!state.city.raidSchedule)state.city.raidSchedule={version:1,enabled:true,cycle:0};
 const raid=state.city.raidSchedule;
 if(Ml(state)>=3&&!raid.eligibleAt){raid.eligibleAt=now;raid.shieldUntil=now+SWRaidTiming.initialShield;raid.dueAt=raid.shieldUntil+SWRaidTiming.warning;}
}
function SWRaidStatus(state,now=Date.now()){
 const raid=state.city?.raidSchedule,enabled=raid?.enabled!==false,wave=Math.max(1,Math.min(10,Math.ceil(Ml(state)/2)+Math.floor((SWCity(state).raidWins||0)/2)));
 const phase=state.activeBattle&&String(state.activeBattle).startsWith('defense-')?'active':!enabled||Ml(state)<3?'peace':!raid||now<raid.shieldUntil?'protected':now<raid.dueAt?'warning':'ready';
 return {phase,enabled,wave,endsAt:phase==='protected'?(raid?.shieldUntil||now+SWRaidTiming.initialShield):phase==='warning'?raid.dueAt:0,lootRisk:SWRaidLoot(state,{won:true,destruction:100}),cycle:raid?.cycle||0,dueAt:raid?.dueAt};
}
function SWRaidScheduleAfter(state,now,id){
 SWMigrateRaids(state,now);const raid=state.city.raidSchedule;
 raid.lastSettledId=id||raid.lastSettledId;raid.cycle=(raid.cycle||0)+1;raid.shieldUntil=now+SWRaidTiming.shield;raid.dueAt=raid.shieldUntil+SWRaidTiming.warning;
}
function SWRaidInput(state,now=Date.now(),automatic=false){
 SWMigrateRaids(state,now);const status=SWRaidStatus(state,now),input=SWDefenseInput(state);
 // New snapshots opt into measured telemetry and Keep-scaled raiders. Historical snapshots stay unchanged.
 const level=status.wave,army=wl(),orders=[],bounds=fl(input.defense),points=[{x:bounds.minX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:bounds.maxX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:Math.round((bounds.minX+bounds.maxX)/2),y:bounds.maxY}];
 army.infantry=5+level*2;army.archer=2+level;army.ram=level>=3?Math.floor(level/3):0;
 for(const kind of Object.keys(army))for(let i=0;i<army[kind];i++)orders.push({kind,...points[Math.floor(orders.length/6)%points.length],time:Math.floor(orders.length/6)*4});
 const raidId=automatic?'defense-auto-'+state.city.raidSchedule.cycle+'-'+state.city.raidSchedule.dueAt:'defense-'+now+'-'+state.revision;
 return {...input,army,orders,unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,Math.max(1,Math.ceil(level/2))])),seed:(state.revision*7919+level*131+state.city.raidSchedule.cycle*3571)>>>0,defenseRaidLevel:level,defenseEconomyVersion:2,defenseTelemetryVersion:1,raidId,automaticRaid:automatic};
}
function SWDefenseReport(input,result,outcome,now){
 const stats=result.defenseStats||{};return {id:input.raidId,won:outcome.won,keepHeld:outcome.won,destruction:result.destruction,duration:result.duration,loot:outcome.loot,reward:outcome.reward,lootProtected:Math.floor(SWCapacity({buildings:input.defense.buildings})*.2),towerDamage:stats.towerDamage,wallDamageAbsorbed:stats.wallDamageAbsorbed,wallDelaySeconds:stats.wallDelaySeconds,attackersDefeated:stats.attackersDefeated,startedAt:now-Math.round(result.duration*1000),endedAt:now,automatic:!!input.automaticRaid};
}
function SWSettleScheduledRaid(state,input,result,now){
 if(!input.raidId||state.city?.raidSchedule?.lastSettledId===input.raidId)return null;
 if(input.automaticRaid){const schedule=state.city?.raidSchedule;if(!schedule||now<schedule.dueAt||schedule.enabled===false||state.activeBattle||Ml(state)<3||input.raidId!=='defense-auto-'+schedule.cycle+'-'+schedule.dueAt)return null;}
 const outcome=SWResolveDefense(state,input,result,now);SWRaidScheduleAfter(state,now,input.raidId);const report=SWDefenseReport(input,result,outcome,now);state.city.lastDefense=report;return {...outcome,defenseReport:report};
}
function X(e, t = 1) {
  let n = Sl[e].cost,
    r = e === `keep` ? 1.7 ** (t - 1) : 1.6 ** (t - 1);
  return Object.fromEntries(xl.map((e) => [e, Math.round(n[e] * r)]));
}
function Z(e, t) {
  return xl.every((n) => e.resources[n] >= t[n]);
}
function Q(e, t) {
  if (!Z(e, t)) throw Error(`Not enough resources for this project.`);
  for (let n of xl) e.resources[n] -= t[n];
}
function Ll(e, t) {
  let n = { gold: 0, wood: 0, stone: 0, food: 0 };
  for (let r of xl) {
    let i = e.resources[r];
    ((e.resources[r] = Math.min(Fl(e), i + t[r])),
      (n[r] = Math.floor(Math.max(0, e.resources[r] - i) + 1e-6)));
  }
  return n;
}
function zl(e) {
  return (
    12 + SWCivicBonuses(e).residents +
    e.buildings.reduce(
      (e, t) =>
        e +
        (t.kind === `cottage`
          ? 8
          : t.kind === `farm` || t.kind === `lumber` || t.kind === `quarry`
            ? 3
            : 0) *
          t.level,
      0,
    )
  );
}
function SWLegacyBl13(e) {
  let t = e.level || e.targetLevel || 1;
  return (
    {
      keep: `Age ${t} · ${500 + 250*t} base storage`,
      farm: `+${24 * t} food / min`,
      lumber: `+${28 * t} timber / min`,
      quarry: `+${16 * t} stone / min`,
      barracks: `${6 * t} troop slots`,
      forge: `+${10 * t}% army attack`,
      tower: `${e.specialty === `ballista` ? `Ballista` : e.specialty === `volley` ? `Rapid-fire` : `Watchtower`} · ${qc(e).range}-tile range`,
      harbor: `+${4 * t} gold / min · ${Math.min(8,t+1)} ship berths`,
      storehouse: `+${SWStorageContribution(t).toLocaleString()} storage per resource`,
      cottage: `${8 * t} residents · +${4 * t} gold / min`,
      market: `+${10 * t} gold / min`,
      builder: `One crew · +${Math.round(Math.max(0, t - 1) * 2.5)}% build speed`,
      wall: `Level ${t} barrier · troops must go around or breach`,
      gate: `Level ${t} gate · villagers pass through`,
      monument: `A permanent mark of league achievement`,
    }[e.kind] || Sl[e.kind].benefit
  );
}
function Hl(e) {
  return (
    1 +
    e.buildings
      .filter((e) => e.kind === `forge`)
      .reduce((e, t) => e + t.level, 0) *
      0.1
  );
}
const SWPremiumCatalog=[
 {id:'palette:coastal',slot:'palette',value:'coastal',category:'appearance',name:'Havencrest blue',description:'Weathered granite, blue cloth and warm timber.',priceGems:0,starter:true,preview:'#4a84bc'},
 {id:'palette:ember',slot:'palette',value:'ember',category:'appearance',name:'Ember coast',description:'Terracotta accents and crimson cloth.',priceGems:15,preview:'#b7553e'},
 {id:'palette:forest',slot:'palette',value:'forest',category:'appearance',name:'Verdant realm',description:'Deep green cloth and garden tones.',priceGems:15,preview:'#4e8765'},
 {id:'palette:ivory',slot:'palette',value:'ivory',category:'appearance',name:'Pearl harbor',description:'Ivory cloth with brass and ocean-blue accents.',priceGems:25,collectionId:'mariner',preview:'#e3d7b6'},
 {id:'banner:blue',slot:'banner',value:'blue',category:'banners',name:'Founding blue',description:'The original colors of Havencrest.',priceGems:0,starter:true,preview:'#4c86d5'},
 {id:'banner:red',slot:'banner',value:'red',category:'banners',name:'Ironward crimson',description:'A red standard for a steadfast city.',priceGems:10,preview:'#b34e4d'},
 {id:'banner:green',slot:'banner',value:'green',category:'banners',name:'Vale green',description:'Green standards inspired by the frontier.',priceGems:10,preview:'#568660'},
 {id:'banner:ivory',slot:'banner',value:'ivory',category:'banners',name:'Admiral ivory',description:'Pale pennants with a golden edge.',priceGems:15,collectionId:'mariner',preview:'#e9dbae'},
 {id:'banner:beacon-crown',slot:'banner',value:'beacon-crown',category:'banners',name:'Coastal Crown',description:'A forked sea-glass standard bearing the crown of the united coast.',priceGems:null,unlockLabel:'Complete Crown of the coast',preview:'#4da4b1'},
 {id:'sail:linen',slot:'sail',value:'linen',category:'sails',name:'Working linen',description:'Natural canvas for the home fleet.',priceGems:0,starter:true,preview:'#d4c2a0'},
 {id:'sail:blue',slot:'sail',value:'blue',category:'sails',name:'Azure fleet',description:'Ocean-blue sails with bright trim.',priceGems:20,collectionId:'mariner',preview:'#467fc0'},
 {id:'sail:red',slot:'sail',value:'red',category:'sails',name:'Crimson fleet',description:'Scarlet canvas for a striking arrival.',priceGems:20,collectionId:'royal',preview:'#b34641'},
 {id:'sail:black',slot:'sail',value:'black',category:'sails',name:'Nightwatch sails',description:'Dark sails earned by breaking the blockade.',priceGems:null,unlockLabel:'Complete The Broken Beacon',preview:'#243640'},
 {id:'road:earth',slot:'road',value:'earth',category:'roads',name:'Packed earth',description:'A practical route through the settlement.',priceGems:0,starter:true,preview:'#a68f64'},
 {id:'road:stone',slot:'road',value:'stone',category:'roads',name:'Harbor cobbles',description:'Dressed stone for your working streets.',priceGems:25,collectionId:'mariner',preview:'#9aafa9'},
 {id:'road:royal',slot:'road',value:'royal',category:'roads',name:'Royal paving',description:'Pale paving with warm decorative borders.',priceGems:35,collectionId:'royal',preview:'#c8b47e'},
 {id:'commander:standard',slot:'commander',value:'standard',category:'outfits',name:'Field equipment',description:'The commanders in their familiar equipment.',priceGems:0,starter:true,preview:'#7b9db6'},
 {id:'commander:laurel',slot:'commander',value:'laurel',category:'outfits',name:'Laurel honors',description:'Ceremonial gold details for your commander.',priceGems:30,collectionId:'royal',preview:'#d8b761'},
 {id:'commander:veteran',slot:'commander',value:'veteran',category:'outfits',name:'Veteran mantle',description:'A campaign mantle earned through mastery trials.',priceGems:null,unlockLabel:'Complete all three mastery trials',preview:'#8ca4a9'},
 {id:'ornament:lantern',slot:'ornament',value:'lantern',category:'monuments',name:'Harbor lantern',description:'Place up to twelve warm lanterns around your town.',priceGems:15,collectionId:'founder',preview:'#edc975'},
 {id:'ornament:standard',slot:'ornament',value:'standard',category:'monuments',name:'Realm standard',description:'Place your colors at a district entrance.',priceGems:10,collectionId:'founder',preview:'#638fd1'},
 {id:'ornament:planter',slot:'ornament',value:'planter',category:'monuments',name:'Stone planters',description:'Bring planted color to your streets and squares.',priceGems:15,collectionId:'founder',preview:'#8baa72'},
 {id:'ornament:statue',slot:'ornament',value:'statue',category:'monuments',name:'Beacon guardian',description:'A permanent monument to the people of the coast.',priceGems:null,unlockLabel:'Complete The Broken Beacon',preview:'#b0b9ac'}
];
const SWPremiumCollections=[
 {id:'mariner',name:'Mariner collection',description:'Pearl cloth, azure sails and a cobbled waterfront.',productId:'com.chrismozer.stonewake.collection.mariner',items:['palette:ivory','banner:ivory','sail:blue','road:stone']},
 {id:'royal',name:'Royal collection',description:'Crimson sails, royal paving and laurel honors.',productId:'com.chrismozer.stonewake.collection.royal',items:['sail:red','road:royal','commander:laurel']},
 {id:'founder',name:'Citymaker collection',description:'Reusable lanterns, standards and planters for your city.',productId:'com.chrismozer.stonewake.collection.founder',items:['ornament:lantern','ornament:standard','ornament:planter']}
];
const SWPremiumDefaults={palette:'palette:coastal',banner:'banner:blue',road:'road:earth',sail:'sail:linen',commander:'commander:standard'};
function SWPremium(state){
 const old=state.premium||{};
 return {...old,version:12,owned:[...new Set([...Object.values(SWPremiumDefaults),...(Array.isArray(old.owned)?old.owned:[])])],sources:old.sources||{},equipped:{...SWPremiumDefaults,...old.equipped},ornaments:Array.isArray(old.ornaments)?old.ornaments:[],chapter:{completed:[],claimed:[],records:{},...old.chapter},trials:old.trials||{},stories:old.stories||{},events:old.events||{},seenScenes:Array.isArray(old.seenScenes)?old.seenScenes:[]};
}
function SWMigratePremium(state){
 const p=state.premium=SWPremium(state);
 if(p.eraCompletedAt){
  const id='banner:beacon-crown';
  if(!p.owned.includes(id))p.owned.push(id);
  p.sources={...p.sources,[id]:[...new Set([...(p.sources[id]||[]),'era:medieval'])]};
 }
 return p;
}
function SWOwnCosmetic(state,id,source='earned'){
 const item=SWPremiumCatalog.find(i=>i.id===id);if(!item)throw Error('This appearance is unavailable.');
 const p=SWMigratePremium(state);if(p.owned.includes(id)&&!p.sources[id])p.sources[id]=['legacy'];if(!p.owned.includes(id))p.owned.push(id);
 p.sources[id]=[...new Set([...(p.sources[id]||[]),source])];
}
function SWGrantCollection(state,id,sourceId='store:'+id){
 const collection=SWPremiumCollections.find(c=>c.id===id);if(!collection)throw Error('Unknown collection.');
 for(const itemId of collection.items)SWOwnCosmetic(state,itemId,'collection:'+id+':'+sourceId);
 return collection.items;
}
function SWRevokeCollection(state,id,sourceId){
 const collection=SWPremiumCollections.find(c=>c.id===id);if(!collection)throw Error('Unknown collection.');
 const p=SWMigratePremium(state),prefix='collection:'+id+':';
 for(const itemId of collection.items){
  const sources=p.sources[itemId];
  // Older independently owned items have no purchase source and must survive refunds.
  if(!sources)continue;
  p.sources[itemId]=sources.filter(s=>sourceId?s!==prefix+sourceId:!s.startsWith(prefix));
  if(!p.sources[itemId].length){p.owned=p.owned.filter(i=>i!==itemId);for(const slot of Object.keys(p.equipped))if(p.equipped[slot]===itemId)p.equipped[slot]=SWPremiumDefaults[slot];p.ornaments=p.ornaments.filter(o=>o.itemId!==itemId);}
 }
}
function SWCosmeticStatus(state,id){
 const item=SWPremiumCatalog.find(i=>i.id===id);if(!item)throw Error('Choose an appearance.');
 const p=SWPremium(state),owned=p.owned.includes(id),equipped=p.equipped[item.slot]===id;
 const reason=owned?null:item.priceGems===null?item.unlockLabel:(state.gems||0)<item.priceGems?'More gems needed':null;
 return {owned,equipped,canBuy:!owned&&!reason,reason,priceGems:item.priceGems,unlockLabel:item.unlockLabel||null};
}
function SWAppearance(state,previewId){
 const p=SWPremium(state),equipped={...p.equipped},item=SWPremiumCatalog.find(i=>i.id===previewId);
 if(item&&item.slot!=='ornament')equipped[item.slot]=item.id;
 const result={};for(const [slot,id]of Object.entries(SWPremiumDefaults)){const picked=SWPremiumCatalog.find(i=>i.id===equipped[slot]&&i.slot===slot&&(p.owned.includes(i.id)||i.id===previewId))||SWPremiumCatalog.find(i=>i.id===id);result[slot]=picked.value;}
 result.ornaments=p.ornaments.filter(o=>p.owned.includes(o.itemId)).map(o=>({...o,kind:SWPremiumCatalog.find(i=>i.id===o.itemId)?.value||o.kind}));
 if(item?.slot==='ornament')result.ornaments=[...result.ornaments,{id:'preview',itemId:item.id,kind:item.value,x:4,y:6,facing:0,preview:true}];
 const done=p.chapter.completed;result.landmark={kind:'lighthouse',stage:done.includes('blockade')?3:done.includes('escort')?2:done.includes('causeway')?1:0,x:-1,y:7};
 result.festival=(state.city?.festivalUntil||0)>(state.lastTick||0);result.tradeOpen=done.includes('escort');return result;
}
const SWChapterMissions=[
 {id:'survey',title:'The silent beacon',summary:'Elowen has found a signal tower above the abandoned landing.',characterId:'ranger',keep:1,type:'city',objective:'Supply a coastal survey.',cost:{gold:0,wood:0,stone:0,food:40},reward:{resources:{gold:60,wood:80,stone:30,food:0},gems:5},storyBefore:[{speaker:'Elowen Vale',text:'No smoke on the horizon. No bell from the beacon. Someone wants this coast forgotten.'}],storyAfter:[{speaker:'Elowen Vale',text:'The tower is sound. Its light was taken apart, piece by piece. We can bring it home.'}]},
 {id:'causeway',title:'A road to the sea',summary:'Reconnect the Keep and waterfront before the repair crews arrive.',characterId:'engineer',keep:2,type:'city',objective:'Connect your Keep to the shipyard through the coastal promenade.',cost:{gold:60,wood:80,stone:60,food:50},reward:{resources:{gold:90,wood:100,stone:60,food:0},gems:8},storyBefore:[{speaker:'Bram Flint',text:'A fine harbor is useless if every cart loses a wheel getting there. Give us a proper road.'}],storyAfter:[{speaker:'Mara Ironward',text:'The first crew is waiting at the landing. For the first time in years, this feels like a way home.'}]},
 {id:'rescue',title:'The missing shipwrights',summary:'Free Bram’s crew from Greyhaven and escort their engineer to safety.',characterId:'captain',keep:3,type:'battle',objective:'Break the prison, then protect the engineer until he reaches the western exit.',reward:{resources:{gold:160,wood:120,stone:80,food:60},gems:10},storyBefore:[{speaker:'Mara Ironward',text:'Break the holding house, then cover their retreat. These people are builders, not soldiers.'},{speaker:'Bram Flint',text:'Bring my crew back, Captain. I still owe them a roof that does not leak.'}],storyAfter:[{speaker:'Bram Flint',text:'All accounted for. Now let us build something the admiral cannot steal.'}]},
 {id:'escort',title:'Through the chain',summary:'Bring the beacon lens through a defended sea lane.',characterId:'engineer',keep:3,type:'battle',objective:'Destroy the coastal battery and keep the repair vessel alive until it reaches the harbor.',reward:{resources:{gold:180,wood:120,stone:100,food:60},gems:12},storyBefore:[{speaker:'Bram Flint',text:'That ship carries the only lens left on the coast. Silence the shore battery before it enters the channel.'},{speaker:'Admiral Veyr',text:'A light in your harbor is a challenge to my fleet. Consider what you are asking for.'}],storyAfter:[{speaker:'Mara Ironward',text:'The lens is ashore. The merchants saw us do it. They will remember.'}]},
 {id:'harbor',title:'Hold the harbor',summary:'Veyr sends raiders against the city you have built.',characterId:'captain',keep:4,type:'battle',objective:'Keep your own Keep standing against the warned assault.',reward:{resources:{gold:220,wood:100,stone:120,food:70},gems:12},storyBefore:[{speaker:'Mara Ironward',text:'We know their route. Put your walls and towers to work. I will bring everyone inside.'}],storyAfter:[{speaker:'Mara Ironward',text:'They came for an easy victory. They found a city that stands together.'}]},
 {id:'blockade',title:'The Broken Beacon',summary:'Defeat Veyr’s flagship and seize the signal fort to reopen the coast.',characterId:'engineer',keep:5,type:'battle',objective:'Destroy the flagship and capture the signal Keep.',reward:{resources:{gold:350,wood:180,stone:160,food:100},gems:20,cosmetics:['sail:black','ornament:statue']},storyBefore:[{speaker:'Elowen Vale',text:'His fleet has gathered beneath the signal fort. Cut off its orders and the blockade will break.'},{speaker:'Admiral Veyr',text:'You may light one beacon. There are older powers watching this sea.'}],storyAfter:[{speaker:'Bram Flint',text:'There. A little glass, a little fire, and the whole coast can find its way.'},{speaker:'Mara Ironward',text:'Let them see us. Havencrest is here to stay.'}]}
];
function SWMissionRequirements(state,mission){
 const p=SWPremium(state),index=SWChapterMissions.findIndex(m=>m.id===mission.id),requirements=[{label:'Keep level '+mission.keep,met:Ml(state)>=mission.keep,action:'building',buildKind:'keep'}];
 if(index>0)requirements.push({label:'Complete '+SWChapterMissions[index-1].title,met:p.chapter.claimed.includes(SWChapterMissions[index-1].id),action:'chronicle'});
 if(mission.id==='causeway')requirements.push({label:'Complete a shipyard',met:state.buildings.some(b=>b.kind==='harbor'&&b.level>0),action:'build',buildKind:'harbor'},{label:'A road from the Keep to your shipyard',met:state.buildings.some(b=>b.kind==='harbor'&&SWLandStats(state).connectedIds.includes(b.id)),action:'plan'});
 return requirements;
}
function SWChapter(state){
 const p=SWPremium(state);
 return {id:'broken-beacon',title:'The Broken Beacon',description:'Restore the light. Reopen the coast. Bring your people home.',completed:p.chapter.completed.length,claimed:!!p.chapter.finaleClaimed,missions:SWChapterMissions.map(m=>{const requirements=SWMissionRequirements(state,m),status=p.chapter.claimed.includes(m.id)?'complete':p.chapter.completed.includes(m.id)?'claimable':requirements.every(r=>r.met)?'available':'locked';return {...m,status,requirements,record:p.chapter.records[m.id]||null};})};
}
const SWTrialDefinitions=[
 {id:'swift-rescue',missionId:'rescue',title:'The narrow window',description:'Rescue the engineer in 32 seconds or less.',objective:'Rescue in 32 seconds',reward:{gems:8}},
 {id:'safe-passage',missionId:'escort',title:'Safe passage',description:'Deliver the repair vessel with at least 60% of its hull intact.',objective:'Save 60% of the repair vessel’s hull',reward:{gems:8}},
 {id:'decisive-strike',missionId:'blockade',title:'Decisive strike',description:'Break the blockade in 45 seconds with at least half your expedition alive.',objective:'Win within 45 seconds; preserve half the army',reward:{gems:12}}
];
function SWTrials(state){const p=SWPremium(state);return SWTrialDefinitions.map(t=>({...t,status:p.trials[t.id]?.completed?'complete':p.chapter.completed.includes(t.missionId)?'available':'locked',best:p.trials[t.id]||null,reason:p.chapter.completed.includes(t.missionId)?null:'Complete the story mission first.'}));}
function SWSagaDefense(id){
 const spec=SWChapterMissions.find(m=>m.id===id);if(!spec||spec.type!=='battle')throw Error('Choose a battle mission.');
 const buildings=[],add=(id,kind,x,y,level=1)=>buildings.push({id,kind,x,y,level,facing:0});
 add('signal-keep','keep',6,3,id==='blockade'?3:1);add('dock','harbor',-1,2,1);add('stores','storehouse',5,5,1);add('quarters','cottage',7,5,1);
 if(id==='rescue'){add('prison','cottage',3,3,1);add('east-watch','tower',6,1,2);add('exit-watch','tower',1,4,2);add('gate-north','gate',3,1,1);add('wall-a','wall',4,1,1);add('wall-b','wall',5,1,1);}
 if(id==='escort'){add('shore-battery','tower',0,0,2);add('watch','tower',4,2,1);add('barracks','barracks',6,5,1);}
 if(id==='blockade'){add('shore-battery','tower',0,0,3);add('mortar','mortar',5,2,2);add('watch','tower',7,1,2);for(let y=1;y<=5;y++)if(y!==3)add('wall-'+y,'wall',3,y,2);add('sea-gate','gate',3,3,2);}
 return {name:id==='rescue'?'Greyhaven holding':id==='escort'?'The chain passage':'Veyr’s signal fort',level:id==='blockade'?4:2,rating:100,buildings};
}
function SWSagaInput(state,id,trial=false,now=Date.now()){
 const mission=SWChapter(state).missions.find(m=>m.id===id);if(!mission||mission.type!=='battle')throw Error('Choose a battle mission.');
 if(mission.status==='locked')throw Error(mission.requirements.find(r=>!r.met)?.label||'Mission unavailable.');
 const trialDef=trial?SWTrialDefinitions.find(t=>t.id===trial||trial===true&&t.missionId===id):null;
 if(trial&&(!trialDef||trialDef.missionId!==id||!SWPremium(state).chapter.completed.includes(id)))throw Error('Complete this mission before its trial.');
 if(id==='harbor'){
  const input=SWDefenseInput(state);input.orders=input.orders.map(o=>({...o,time:o.time*.65}));
  return {...input,saga:{version:12,missionId:id,mode:'hold',label:mission.objective,holdSeconds:90,trialId:null},combatVersion:12,presentationVersion:12};
 }
 const level=id==='blockade'?4:2,army={...wl(),infantry:id==='blockade'?8:5,archer:5,shieldbearer:3,healer:2,ram:1,...(id==='blockade'?{trebuchet:2,crossbow:2}:{})};
 return {defense:SWSagaDefense(id),appearance:SWAppearance(state),army,orders:[],bonus:1.2,front:'center',rulesVersion:4,combatVersion:12,presentationVersion:12,healerTacticsVersion:1,troopAbilitiesVersion:1,navalVersion:3,navalSupport:id==='rescue'?undefined:{id:'expedition',kind:id==='blockade'?'bombard':'galley',level:id==='blockade'?5:3},enemyNavy:id==='rescue'?[]:[{id:'flagship',kind:id==='blockade'?'bombard':'galley',level:id==='blockade'?3:1}],unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,level])),commander:{id:id==='blockade'?'engineer':'captain',level:level,gear:'armor'},seed:120031+SWChapterMissions.findIndex(m=>m.id===id)*7919,saga:{version:12,missionId:id,mode:id==='rescue'?'rescue':id==='escort'?'escort':'blockade',label:trialDef?.objective||mission.objective,trialId:trialDef?.id||null},createdAt:now};
}
function SWSagaSpawn(input){
 if(input.saga?.mode!=='escort')return null;
 const ship=SWCreateNavalUnit({id:'repair-vessel',kind:'galley',level:2},'attack');
 return {...ship,id:'saga-escort',shipId:'repair-vessel',sagaEscort:true,x:-3.5,y:5,hp:420,maxHp:420,damage:0,speed:.16,nextAttack:Infinity};
}
function SWSagaStep(input,units,time){
 const saga=input.saga;if(!saga)return;
 if(saga.mode==='rescue'&&!units.some(u=>u.id==='saga-escort')&&units.some(u=>u.id==='prison'&&u.hp<=0))units.push({id:'saga-escort',kind:'worker',sagaEscort:true,side:'attack',x:3,y:3,hp:240,maxHp:240,speed:.45,damage:0,range:0,cooldown:2,nextAttack:Infinity,level:1,building:false});
 const escort=units.find(u=>u.id==='saga-escort');if(!escort||escort.hp<=0||escort.rescued)return;
 if(saga.mode==='escort'&&units.some(u=>u.id==='shore-battery'&&u.hp>0)){escort.waitingForBattery=true;return;}delete escort.waitingForBattery;
 const target=saga.mode==='rescue'?{x:-2,y:3}:{x:-3.5,y:-1.1},dx=target.x-escort.x,dy=target.y-escort.y,d=Math.hypot(dx,dy),step=Math.min(d,escort.speed*.25);
 escort.vx=d?dx/d*escort.speed:0;escort.vy=d?dy/d*escort.speed:0;escort.heading=Math.atan2(dy,dx);
 if(d){escort.x+=dx/d*step;escort.y+=dy/d*step;}
 if(d<.12){escort.x=target.x;escort.y=target.y;escort.rescued=true;escort.vx=0;escort.vy=0;}
}
function SWSagaObjective(input,units,time,finished=false){
 const saga=input.saga;if(!saga)return null;
 const escort=units.find(u=>u.id==='saga-escort'),keep=units.find(u=>u.kind==='keep'&&u.building),flagship=units.find(u=>u.shipId==='flagship'),battery=units.find(u=>u.id==='shore-battery');
 let won=false,failed=false,progress=0,label=saga.label;
 if(saga.mode==='hold'){failed=!!keep&&keep.hp<=0;won=!failed&&(time>=saga.holdSeconds||finished);progress=Math.min(1,time/saga.holdSeconds);label=failed?'The Keep has fallen':Math.max(0,Math.ceil(saga.holdSeconds-time))+'s · Hold the Keep';}
 if(saga.mode==='rescue'){won=!!escort?.rescued&&escort.hp>0;failed=!!escort&&escort.hp<=0;progress=escort?Math.min(1,Math.max(0,(3-escort.x)/5)):0;label=failed?'The engineer was lost':escort?'Protect the engineer · '+Math.round(progress*100)+'% to safety':'Break the holding house';}
 if(saga.mode==='escort'){won=!!escort?.rescued&&escort.hp>0;failed=!!escort&&escort.hp<=0;progress=escort?Math.min(1,Math.max(0,(5-escort.y)/6.1)):0;label=failed?'The repair vessel was lost':battery?.hp>0?'Silence the shore battery':'Protect the repair vessel · '+Math.round(progress*100)+'%';}
 if(saga.mode==='blockade'){won=!!keep&&keep.hp<=0&&!!flagship&&flagship.hp<=0;progress=(+(keep?.hp<=0)+ +(flagship?.hp<=0))/2;label=(keep?.hp<=0?'Signal fort captured':'Capture the signal fort')+' · '+(flagship?.hp<=0?'Flagship sunk':'Sink the flagship');}
 const health=escort?Math.max(0,escort.hp/escort.maxHp):null;
 if(input.retreatAt!==undefined&&time>=input.retreatAt){won=false;failed=true;label='Expedition withdrawn';}
 if(won&&saga.trialId){const alive=units.filter(u=>u.side==='attack'&&!u.building&&!u.naval&&u.kind!=='hero'&&!u.sagaEscort&&u.hp>0).length;
  const pass=saga.trialId==='swift-rescue'?time<=32:saga.trialId==='safe-passage'?health>=.6:time<=45&&alive>=Nl(input.army)/2;
  if(!pass){won=false;failed=true;label='Objective secured · mastery condition missed';}}
 return {missionId:saga.missionId,mode:saga.mode,label,won,failed,complete:won||failed,progress,escortHealth:health,trialId:saga.trialId};
}
function SWSagaSettle(state,input,result,now=Date.now()){
 if(input.saga?.version!==12||!SWChapterMissions.some(m=>m.id===input.saga.missionId&&m.type==='battle'))throw Error('Invalid expedition.');
 const p=SWMigratePremium(state),id=input.saga.missionId,record=p.chapter.records[id]||{},objective=result.objective;
 if(!objective||objective.missionId!==id)throw Error('Expedition result is missing its objective.');
 const won=!!result.won&&!!objective.won;
 const reward={gold:0,wood:0,stone:0,food:0};
 if(input.saga.trialId){const trial=SWTrialDefinitions.find(t=>t.id===input.saga.trialId&&t.missionId===id);if(!trial)throw Error('Invalid mastery trial.');const prior=p.trials[trial.id]||{};if(won){p.trials[trial.id]={completed:true,bestSeconds:Math.min(prior.bestSeconds||Infinity,result.duration),completedAt:prior.completedAt||now};if(!prior.completed)state.gems=(state.gems||0)+trial.reward.gems;if(SWTrialDefinitions.every(t=>p.trials[t.id]?.completed))SWOwnCosmetic(state,'commander:veteran','mastery');}return {reward,won,trialId:trial.id,firstClear:won&&!prior.completed};}
 if(won){if(!p.chapter.completed.includes(id))p.chapter.completed.push(id);p.chapter.records[id]={...record,completedAt:record.completedAt||now,bestSeconds:Math.min(record.bestSeconds||Infinity,result.duration),stars:Math.max(record.stars||0,result.stars||1),escortHealth:Math.max(record.escortHealth||0,objective.escortHealth||0)};}
 return {reward,won,missionId:id,firstClear:won&&!record.completedAt};
}
const SWResidentStoryDefinitions=[
 {id:'crew-supper',title:'A place at the table',characterId:'captain',keep:1,description:'Mara’s watch has worked through the night. Help the neighborhood welcome them home.',duration:30,choices:[{id:'feast',label:'Cook a harbor supper',description:'Share your harvest with the watch.',cost:{gold:0,wood:10,stone:0,food:120}},{id:'supplies',label:'Stock their mess hall',description:'Pay the market to prepare supplies.',cost:{gold:90,wood:10,stone:0,food:30}}],reward:{resources:{gold:90,wood:50,stone:20,food:0},gems:5},ending:'Lanterns stay lit around the commons. The watch finally sits down to eat.'},
 {id:'cartwright',title:'Wheels for the waterfront',characterId:'engineer',keep:2,description:'Bram can repair the old cargo carts or commission lighter ones for the new road.',duration:45,choices:[{id:'repair',label:'Restore the old carts',description:'Use timber and meals for the crew.',cost:{gold:10,wood:90,stone:10,food:60}},{id:'commission',label:'Commission new wheels',description:'Pay local craftspeople for a lighter design.',cost:{gold:120,wood:40,stone:20,food:40}}],reward:{resources:{gold:140,wood:0,stone:80,food:0},gems:6},ending:'Loaded carts start arriving at the harbor. Bram insists every wheel is perfectly round.'},
 {id:'watch-path',title:'The watcher’s path',characterId:'ranger',keep:2,description:'Elowen found an overgrown path between the orchards and the shore.',duration:45,choices:[{id:'clear',label:'Clear the path',description:'Feed a team and bridge the wet ground.',cost:{gold:0,wood:60,stone:20,food:110}},{id:'mark',label:'Set stone waymarkers',description:'Create a durable trail for travelers.',cost:{gold:60,wood:15,stone:90,food:50}}],reward:{resources:{gold:80,wood:120,stone:0,food:0},gems:6,cosmetics:['banner:green']},ending:'Green ribbons lead travelers safely between the trees. Elowen leaves the first map at the tavern.'},
 {id:'storm-square',title:'After the rain',characterId:'captain',keep:3,description:'A storm has damaged the market awnings. The traders have asked the city for help.',duration:60,choices:[{id:'timber',label:'Raise timber shelters',description:'Build sturdy new market frames.',cost:{gold:20,wood:140,stone:30,food:80}},{id:'stone',label:'Repair the arcade',description:'Give the square permanent cover.',cost:{gold:90,wood:30,stone:130,food:60}}],reward:{resources:{gold:190,wood:30,stone:30,food:0},gems:8,cosmetics:['ornament:planter']},ending:'The market opens beneath new cover. Someone plants flowers beside the repaired stalls.'},
 {id:'ship-launch',title:'A name for the sea',characterId:'engineer',keep:3,description:'The shipwrights are ready to launch a new merchant boat. Its first voyage needs a proper send-off.',duration:60,choices:[{id:'gather',label:'Gather the neighborhood',description:'Prepare a shared meal and decorate the quay.',cost:{gold:40,wood:60,stone:0,food:180}},{id:'outfit',label:'Outfit the crew',description:'Provide warm supplies and working tools.',cost:{gold:120,wood:110,stone:25,food:80}}],reward:{resources:{gold:180,wood:80,stone:50,food:0},gems:8,cosmetics:['ornament:lantern']},ending:'The bell rings as the hull touches water. The crew names her Homeward.'},
 {id:'beacon-bell',title:'The bell keeper',characterId:'ranger',keep:4,description:'Elowen has found the family that once tended the beacon. They are ready to return.',duration:90,choices:[{id:'home',label:'Prepare their home',description:'Restore the keeper’s cottage.',cost:{gold:70,wood:150,stone:100,food:100}},{id:'workshop',label:'Restore their workshop',description:'Make a place for the old bell to be repaired.',cost:{gold:160,wood:80,stone:150,food:60}}],reward:{resources:{gold:240,wood:60,stone:60,food:0},gems:10,cosmetics:['banner:ivory']},ending:'For the first time in a generation, the beacon bell answers the ships in the harbor.'}
];
function SWResidentStories(state,now=state.lastTick||Date.now()){
 const p=SWPremium(state);return SWResidentStoryDefinitions.map((s,index)=>{const record=p.stories[s.id],requirements=[{label:'Keep level '+s.keep,met:Ml(state)>=s.keep},...(index?[{label:'Complete '+SWResidentStoryDefinitions[index-1].title,met:!!p.stories[SWResidentStoryDefinitions[index-1].id]?.claimed}]:[])];return {...s,record,requirements,status:record?.claimed?'complete':record?.readyAt?record.readyAt<=now?'claimable':'building':requirements.every(r=>r.met)?'available':'locked',readyAt:record?.readyAt,reason:requirements.find(r=>!r.met)?.label||null};});
}
function SWEvents(state,now=state.lastTick||Date.now()){
 const p=SWPremium(state),stories=Object.values(p.stories).filter(s=>s.claimed).length,trials=Object.values(p.trials).filter(t=>t.completed).length;
 const list=[{id:'harbor-festival',title:'Harbor festival',description:'Bring the neighborhoods together through six resident stories.',progress:stories,target:6,thresholds:[2,4,6],rewards:[{gems:5},{gems:10},{gems:15,cosmetics:['ornament:standard']}]},{id:'siege-trials',title:'The captain’s trials',description:'Master three fixed-army challenges. Retry freely.',progress:trials,target:3,thresholds:[1,2,3],rewards:[{gems:5},{gems:8},{gems:12,cosmetics:['commander:veteran']}]},{id:'beacon-restoration',title:'Lights along the coast',description:'Complete the six missions of The Broken Beacon.',progress:p.chapter.claimed.length,target:6,thresholds:[2,4,6],rewards:[{gems:5},{gems:8},{gems:12,cosmetics:['banner:red']}] }];
 return list.map((event,index)=>({...event,featured:Math.floor(now/604800000)%3===index,endsAt:null,completed:event.progress>=event.target,tiers:event.thresholds.map((target,i)=>({id:String(i+1),target,reward:event.rewards[i],claimed:!!p.events[event.id]?.includes(String(i+1)),claimable:event.progress>=target&&!p.events[event.id]?.includes(String(i+1))}))}));
}
function SWPremiumReward(state,reward,source){
 const resources=reward?.resources||{};state.reserveCrates||={gold:0,wood:0,stone:0,food:0};
 const delivered={gold:0,wood:0,stone:0,food:0};
 for(const k of xl){const amount=Math.max(0,resources[k]||0),room=Math.max(0,SWCapacity(state)-state.resources[k]),put=Math.min(room,amount);state.resources[k]+=put;state.reserveCrates[k]=(state.reserveCrates[k]||0)+amount-put;delivered[k]=put;}
 state.gems=(state.gems||0)+(reward?.gems||0);for(const id of reward?.cosmetics||[])SWOwnCosmetic(state,id,source);return delivered;
}
function SWMedievalFinale(state){const p=SWPremium(state),requirements=[{label:'Reach Keep level 10',met:Ml(state)>=10,action:'building',buildKind:'keep'},{label:'Complete either the Land or Sea campaign',met:state.campaign>=Tl.length||state.seaCampaign>=10,action:state.seaCampaign>state.campaign?'sea':'frontier'},{label:'Relight the Broken Beacon',met:!!p.chapter.finaleClaimed,action:'chronicle'}];return {id:'crown-of-the-coast',title:'Crown of the coast',description:'The medieval coast stands united. Complete this age and record your kingdom in the chronicle.',requirements,status:p.eraCompletedAt?'complete':requirements.every(r=>r.met)?'claimable':'locked',reward:{gems:50,cosmetics:['commander:laurel','banner:ivory','banner:beacon-crown']},storyAfter:[{speaker:'Mara Ironward',text:'Every light along the coast answers ours. These people no longer need a refuge. They have a home.'},{speaker:'Bram Flint',text:'A merchant brought drawings of a curious new powder. That is a story for another age.'}],mastery:{districts:SWCivicProjects.filter(d=>SWCivicStage(state,d.id)===3).length,districtTarget:4,stories:Object.values(p.stories).filter(s=>s.claimed).length,storyTarget:6,trials:Object.values(p.trials).filter(t=>t.completed).length,trialTarget:3,land:Math.min(10,state.campaign||0),sea:Math.min(10,state.seaCampaign||0),campaignTarget:10}};}
function SWPremiumAction(state,action,now){
 if(!['buyCosmetic','buyGemCollection','equipCosmetic','placeOrnament','removeOrnament','advanceMission','claimMission','claimChapter','startResidentStory','claimResidentStory','claimEvent','claimEraFinale','dismissScene'].includes(action.type))return false;
 const p=SWMigratePremium(state);
 if(action.type==='buyCosmetic'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id),status=SWCosmeticStatus(state,action.id);
  if(status.owned)throw Error('You already own this appearance.');if(!status.canBuy)throw Error(status.reason||'Unavailable.');if(action.maxPrice!==item.priceGems)throw Error('The price changed. Review the item again.');
  state.gems-=item.priceGems;SWOwnCosmetic(state,item.id,'gems');
 }else if(action.type==='buyGemCollection'){
  const quote=SWCollectionQuote17(state,action.id);
  if(!quote.canBuy)throw Error(quote.reason);if(action.maxPrice!==quote.priceGems)throw Error('The price changed. Review the collection again.');
  state.gems-=quote.priceGems;for(const item of quote.missing)SWOwnCosmetic(state,item.id,'gems:collection:'+action.id);
 }else if(action.type==='equipCosmetic'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id);if(!item||!p.owned.includes(item.id))throw Error('Unlock this appearance first.');if(item.slot==='ornament')throw Error('Place this decoration on an empty plot.');p.equipped[item.slot]=item.id;
 }else if(action.type==='placeOrnament'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id);if(!item||item.slot!=='ornament'||!p.owned.includes(item.id))throw Error('Unlock this decoration first.');
  if(!Number.isInteger(action.x)||!Number.isInteger(action.y)||!Vc(state,action.x,action.y)||state.buildings.some(b=>b.x===action.x&&b.y===action.y)||(state.terrain||[]).some(t=>t.x===action.x&&t.y===action.y&&t.kind!=='road')||p.ornaments.some(o=>o.x===action.x&&o.y===action.y))throw Error('Choose an empty land plot or a road edge.');
  if(p.ornaments.length>=40||p.ornaments.filter(o=>o.itemId===item.id).length>=12)throw Error('Decoration limit reached. Move or remove an existing piece.');
  p.ornaments.push({id:'ornament-'+now+'-'+state.revision,itemId:item.id,kind:item.value,x:action.x,y:action.y,facing:SWFacing(action.facing)});
 }else if(action.type==='removeOrnament'){
  if(!p.ornaments.some(o=>o.id===action.placementId))throw Error('Decoration not found.');p.ornaments=p.ornaments.filter(o=>o.id!==action.placementId);
 }else if(action.type==='advanceMission'){
  const mission=SWChapter(state).missions.find(m=>m.id===action.id);if(!mission||mission.type!=='city'||mission.status!=='available')throw Error('This city objective is not ready.');Q(state,mission.cost);p.chapter.completed.push(mission.id);p.chapter.records[mission.id]={completedAt:now};
 }else if(action.type==='claimMission'){
  const mission=SWChapter(state).missions.find(m=>m.id===action.id);if(!mission||mission.status!=='claimable')throw Error('This mission reward is not ready or was already collected.');
  p.chapter.claimed.push(mission.id);SWPremiumReward(state,mission.reward,'mission:'+mission.id);
 }else if(action.type==='claimChapter'){
  if(p.chapter.claimed.length!==SWChapterMissions.length||p.chapter.finaleClaimed)throw Error('Complete and collect all six missions first.');p.chapter.finaleClaimed=true;p.chapter.finishedAt=now;SWPremiumReward(state,{gems:25,cosmetics:['sail:black','ornament:statue']},'chapter');
 }else if(action.type==='startResidentStory'){
  const story=SWResidentStories(state,now).find(s=>s.id===action.id),choice=story?.choices.find(c=>c.id===action.choice);if(!story||story.status!=='available'||!choice)throw Error('Choose an available resident story and response.');
  if(Object.values(p.stories).some(s=>s.readyAt&&!s.claimed))throw Error('Finish your current resident story first.');Q(state,choice.cost);p.stories[story.id]={choice:choice.id,startedAt:now,readyAt:now+story.duration*1000};
 }else if(action.type==='claimResidentStory'){
  const story=SWResidentStories(state,now).find(s=>s.id===action.id);if(!story||story.status!=='claimable')throw Error('This story reward is not ready or was already collected.');p.stories[story.id].claimed=true;p.stories[story.id].completedAt=now;SWPremiumReward(state,story.reward,'story:'+story.id);state.city={...SWCity(state),jobs:(SWCity(state).jobs||0)+1};
 }else if(action.type==='claimEvent'){
  const event=SWEvents(state,now).find(e=>e.id===action.id),tier=event?.tiers.find(t=>t.id===String(action.tier));if(!tier?.claimable)throw Error('This event reward is not ready or was already collected.');p.events[event.id]=[...(p.events[event.id]||[]),tier.id];SWPremiumReward(state,tier.reward,'event:'+event.id+':'+tier.id);
 }else if(action.type==='claimEraFinale'){
  const finale=SWMedievalFinale(state);if(finale.status!=='claimable')throw Error('Complete the medieval age requirements first.');p.eraCompletedAt=now;SWPremiumReward(state,finale.reward,'era:medieval');
 }else if(action.type==='dismissScene'){
  if(typeof action.id!=='string'||!SWChapterMissions.some(m=>action.id===m.id+':before'||action.id===m.id+':after'))throw Error('Unknown story scene.');if(!p.seenScenes.includes(action.id))p.seenScenes.push(action.id);
 }
 return true;
}
function SWLegacyUl13(e, t, n = Date.now()) {
  let r = Y(e, n),
    i = Lc(r) >= Ic(r);
  if(SWPremiumAction(r,t,n)){r.revision++;return r;}
  if(SWCivicProjectAction(r,t,n)){r.revision++;return r;}
  if(t.type==='claimReserve'){SWClaimReserve(r);r.revision++;return r;}
  if (SWCityAction(r, t, n)) { r.revision++; return Y(r, n); }
  if (SWApplyTrade(r, t)) { r.revision++; return Y(r, n); }
  if (ApplyGemAction(r, t, n)) { r.revision++; return Y(r, n); }
  if (ol(r, t, n)) return (r.revision++, r);
  if (t.type === `walls`) {
    if (i) throw Error(`All construction crews are working.`);
    let e = t.tiles;
    if (!Array.isArray(e) || !e.length || e.length > 24)
      throw Error(`Draw between 1 and 24 wall segments.`);
    let a = new Set();
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (
        !n ||
        !Vc(r, n.x, n.y) ||
        al(r, n.x, n.y) ||
        r.buildings.some((e) => e.x === n.x && e.y === n.y) ||
        (r.premium?.ornaments||[]).some(o=>o.x===n.x&&o.y===n.y) ||
        a.has(`${n.x},${n.y}`)
      )
        throw Error(`Walls need empty plots in your territory.`);
      if (t && Math.abs(n.x - e[t - 1].x) + Math.abs(n.y - e[t - 1].y) !== 1)
        throw Error(`Draw one connected wall.`);
      a.add(`${n.x},${n.y}`);
    }
    if (SWBuildingCount(r,'wall') + e.length > SWBuildingLimit(r,'wall'))
      throw Error(`Wall limit reached. Upgrade your Keep to unlock more segments.`);
    Q(r, { gold: 4 * e.length, wood: 0, stone: 8 * e.length, food: 0 });
    let o = `wall-project-${n}-${r.revision}`;
    for (let t = 0; t < e.length; t++) {
      let i = e[t],
        a = e[t + 1] || e[t - 1];
      r.buildings.push({
        id: `${o}-${t}`,
        kind: `wall`,
        ...i,
        level: 0,
        targetLevel: 1,
        startedAt: n,
        readyAt: n + Zc(r, `wall`) * 1e3,
        projectId: o,
        axis: a && a.x !== i.x ? `x` : `y`,
        facing: a && a.x !== i.x ? 0 : 1,
      });
    }
  } else if (t.type === `gate`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e || e.kind !== `wall` || e.readyAt)
      throw Error(`Select a completed wall to add a gate.`);
    if (i) throw Error(`All construction crews are working.`);
    if (SWBuildingCount(r,'gate') >= SWBuildingLimit(r,'gate'))
      throw Error(`Gate limit reached. Upgrade your Keep to unlock more.`);
    (Q(r, Sl.gate.cost),
      (e.kind = `gate`),
      (e.targetLevel = e.level),
      (e.startedAt = n),
      (e.readyAt = n + Zc(r, `gate`) * 1e3));
  } else if (t.type === `rotate`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Choose a building, wall or gate.`);
    e.facing=(SWFacing(e.facing,e.axis===`y`?1:0)+1)%4;
    if(zc(e))e.axis=e.facing%2?`y`:`x`;
  } else if (t.type === `specialize`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e || e.kind !== `tower` || e.level < 2 || e.readyAt)
      throw Error(`Complete a level 2 watchtower first.`);
    if (![`ballista`, `volley`].includes(t.specialty || ``))
      throw Error(`Choose a tower specialization.`);
    if (e.specialty === t.specialty)
      throw Error(`This tower already has that specialization.`);
    (Q(r, { gold: 120, wood: 0, stone: 100, food: 0 }),
      (e.specialty = t.specialty));
  } else if (t.type === `developProvince`) {
    let e = r.provinces?.find((e) => e.id === t.id);
    if (!e || e.level >= 10)
      throw Error(`Choose an owned province below level 10.`);
    if (e.level >= Ml(r))
      throw Error(`Upgrade your keep before developing this outpost.`);
    (Q(r, Uc(e.level)), e.level++);
  } else if (t.type === `commander`) {
    let e = t.id;
    if (!Object.hasOwn(Oc, e)) throw Error(`Choose a commander.`);
    if (r.activeBattle) throw Error(`Your commander is on the battlefield.`);
    if (Ml(r) < Oc[e].unlock)
      throw Error(`Requires keep level ${Oc[e].unlock}.`);
    (Wc(r, e) ||
      (Q(r, { gold: 200, wood: 0, stone: 0, food: 80 }),
      (r.commanders = {
        ...r.commanders,
        [e]: { xp: 0, gear: `armor`, owned: [`armor`] },
      })),
      (r.commander = e));
  } else if (t.type === `gear`) {
    let e = t.id || r.commander || `captain`,
      n = Wc(r, e);
    if (!Object.hasOwn(Oc, e) || !n || !t.gear || !Object.hasOwn(kc, t.gear))
      throw Error(`Choose valid commander equipment.`);
    if (r.activeBattle) throw Error(`Change equipment after the battle.`);
    let i = { ...n, owned: [...n.owned] };
    (i.owned.includes(t.gear) || (Q(r, kc[t.gear].cost), i.owned.push(t.gear)),
      (i.gear = t.gear),
      (r.commanders = { ...r.commanders, [e]: i }));
  } else if (t.type === `claimCosmetic`) {
    let e = jc.find((e) => e.id === t.id);
    if (!e || r.cosmetics?.includes(e.id) || (r.season?.points || 0) < e.points)
      throw Error(`Earn this league reward first.`);
    ((r.cosmetics = [...(r.cosmetics || []), e.id]),
      e.id !== `monument` && (r.livery = e.id));
  } else if (t.type === `livery`) {
    if (t.id !== `default` && !r.cosmetics?.includes(t.id || ``))
      throw Error(`Earn this livery first.`);
    r.livery = t.id;
  } else if (t.type === `build`) {
    let e = t.kind;
    if (!Object.hasOwn(Sl, e) || e === `keep`)
      throw Error(`Choose a valid building.`);
    let a = Sl[e];

    if (e === `monument` && !r.cosmetics?.includes(`monument`))
      throw Error(`Earn the Victor’s standard in the weekly league.`);
    if (t.axis !== void 0 && ![`x`, `y`].includes(t.axis))
      throw Error(`Choose a valid orientation.`);
    if (Ml(r) < a.unlock) throw Error(`Requires keep level ${a.unlock}.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (
      !SWCanPlace(r, e, t.x, t.y)
    )
      throw Error(e === `harbor` ? `Choose an empty coastal berth beside your capital.` : `Choose an empty land plot.`);
    if(SWBuildingCount(r,e)>=SWBuildingLimit(r,e))throw Error(`${a.name} limit reached (${SWBuildingLimit(r,e)} at Keep ${Ml(r)}).`);
    const facing=SWFacing(t.facing,t.axis==='y'?1:0);
    (Q(r, X(e)),
      r.buildings.push({
        id: `b-${n}-${r.revision}`,
        kind: e,
        x: t.x,
        y: t.y,
        level: 0,
        targetLevel: 1,
        startedAt: n,
        readyAt: n + Zc(r, e) * (1-Math.min(.3,SWCivicLevel(r,'workshop')*.03)) * 1e3,
        facing,
        ...(e === `wall` || e === `gate` ? { axis: facing%2 ? `y` : `x` } : {}),
      }));
  } else if (t.type === `upgrade`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Building not found.`);
    if (e.readyAt) throw Error(`This building is under construction.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (e.level >= Sl[e.kind].max)
      throw Error(`This building is fully upgraded.`);
    if (e.kind !== `keep` && e.level >= Ml(r))
      throw Error(`Upgrade your keep first.`);
    if (
      e.kind === `keep` &&
      e.level === 1 &&
      !r.buildings.some((e) => e.kind === `barracks` && e.level > 0)
    )
      throw Error(`Complete a barracks before advancing your age.`);
    let a = $c(r, e);
    if (a) throw Error(a);
    if(xl.some(k=>X(e.kind,e.level+1)[k]>Fl(r)))throw Error('Expand your storehouses before this upgrade.');
    (Q(r, X(e.kind, e.level + 1)),
      (e.targetLevel = e.level + 1),
      (e.startedAt = n),
      (e.readyAt = n + Zc(r, e.kind, e.level + 1) * (1-Math.min(.3,SWCivicLevel(r,'workshop')*.03)) * 1e3));
  } else if (t.type === `move`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Building not found.`);
    if (
      !SWCanPlace(r, e.kind, t.x, t.y, e.id)
    )
      throw Error(e.kind === `harbor` ? `Move your shipyard to another coastal berth.` : `Choose an empty land plot.`);
    e.facing=SWFacing(t.facing,e.facing||0);if(zc(e))e.axis=e.facing%2?`y`:`x`;
    ((e.x = t.x), (e.y = t.y));
  } else if (t.type === `recruit`) {
    if (r.activeBattle)
      throw Error(`Finish your battle before recruiting more soldiers.`);
    let e = t.kind,
      n = J[e],
      i = t.count === void 0 ? 1 : t.count;
    if (!Object.hasOwn(J, e) || !Number.isInteger(i) || i < 1 || i > 10)
      throw Error(`Choose a valid troop count.`);
    if (!r.buildings.some((e) => e.kind === `barracks` && e.level > 0))
      throw Error(`Build a barracks first.`);
    if (Ml(r) < n.unlock) throw Error(`Requires keep level ${n.unlock}.`);
    if (
      e === `cannon` &&
      !r.buildings.some((e) => e.kind === `forge` && e.level > 0)
    )
      throw Error(`Build a foundry to train cannons.`);
    if (Nl(r.army) + i > Pl(r))
      throw Error(`Upgrade or build another barracks for more army capacity.`);
    (Q(r, Object.fromEntries(xl.map((e) => [e, n.cost[e] * i]))),
      (r.army[e] += i));
  } else if (t.type === `claim`) {
    let e = El.find((e) => e.id === t.id);
    if (!e || r.quests.includes(e.id) || !e.check(r))
      throw Error(`Complete this objective before claiming it.`);
    SWRequireRoom(r,e.reward);
    (r.quests.push(e.id), Ll(r, e.reward), r.gems += 8);
  } else if (t.type === `claimAchievement`) {
    let e = Dl.find((e) => e.id === t.id);
    if (!e || r.honors?.includes(e.id) || Ol(r, e) < e.target)
      throw Error(`Earn this achievement before collecting its reward.`);
    SWRequireRoom(r,e.reward);
    ((r.honors = [...(r.honors || []), e.id]), Ll(r, e.reward), r.gems += 15);
  } else if (t.type === `rename`) {
    let e = (t.name || ``).trim();
    if (e.length < 2 || e.length > 24 || /[<>\x00-\x1f]/.test(e))
      throw Error(`Use a kingdom name between 2 and 24 characters.`);
    r.name = e;
  } else if (t.type === `publish`) {
    if (!r.buildings.some((e) => e.kind === `tower` && e.level > 0))
      throw Error(`Complete a watchtower before publishing your defenses.`);
    r.published = !0;
  } else if (t.type === `unpublish`) r.published = !1;
  else if (t.type !== `tick`) throw Error(`Unknown action.`);
  return (r.revision++, r);
}
function Wl(e) {
  return {
    name: e.name,
    level: Ml(e),
    rating: e.rating,
    provinces: e.provinces,
    livery: e.livery,
    appearance: SWAppearance(e),
    buildings: e.buildings
      .filter((e) => e.level > 0)
      .map((e) => ({
        id: e.id,
        kind: e.kind,
        x: e.x,
        y: e.y,
        level: e.level,
        axis: e.axis,
        facing: e.facing,
        specialty: e.specialty,
      })),
  };
}
function Gl(e) {
  let t = Tl[e];
  if (!t) throw Error(`Campaign not found.`);
  return cl(e, t.name, t.level);
}
function Kl(e) {
  return e.rulesVersion === 4 ? gl(e) : e.rulesVersion === 3 ? bl(e) : ql(e);
}
function ql(e) {
  let t = [],
    n = e.seed >>> 0,
    r = () => ((n = (1664525 * n + 1013904223) >>> 0), n / 4294967296);
  for (let n of e.defense.buildings) {
    let e =
      (n.kind === `keep` ? 420 : n.kind === `tower` ? 135 : 95) *
      (1 + (n.level - 1) * 0.45);
    t.push({
      id: n.id,
      side: `defend`,
      kind: n.kind,
      x: n.x,
      y: n.y,
      hp: e,
      maxHp: e,
      damage:
        n.kind === `tower`
          ? 12 * (1 + 0.25 * (n.level - 1))
          : n.kind === `keep`
            ? 6
            : 0,
      range: n.kind === `tower` ? 3.25 : 2.1,
      speed: 0,
      cooldown: n.kind === `tower` ? 1.25 : 1.65,
      nextAttack: r(),
      building: !0,
      level: n.level,
    });
  }
  let i =
      e.front === `left`
        ? { x: -0.7, y: 6.8 }
        : e.front === `right`
          ? { x: 6.8, y: -0.7 }
          : { x: 7.4, y: 7.4 },
    a = 0;
  for (let n of Object.keys(J)) {
    let o = J[n];
    for (let s = 0; s < e.army[n]; s++)
      (t.push({
        id: `a-${a}`,
        side: `attack`,
        kind: n,
        x:
          i.x +
          (r() - 0.5) * 1.1 +
          (e.rulesVersion === 2 ? ((a % 4) - 1.5) * 0.38 : 0),
        y:
          i.y +
          (r() - 0.5) * 1.1 +
          (e.rulesVersion === 2 ? Math.floor(a / 4) * 0.3 : 0),
        hp: o.hp,
        maxHp: o.hp,
        damage: o.damage * e.bonus,
        range: o.range,
        speed: o.speed,
        cooldown: o.cooldown,
        nextAttack: r(),
        building: !1,
        level: 1,
      }),
        a++);
  }
  let o = Math.min(
    5,
    1 +
      e.defense.buildings.filter((e) => e.kind === `barracks`).length * 2 +
      Math.max(0, e.defense.level - 1),
  );
  for (let n = 0; n < o; n++)
    t.push({
      id: `guard-${n}`,
      side: `defend`,
      kind: `infantry`,
      x: 3 + (r() - 0.5) * 1.5,
      y: 4 + (r() - 0.5) * 1.5,
      hp: 65 + e.defense.level * 10,
      maxHp: 65 + e.defense.level * 10,
      damage: 7 + e.defense.level,
      range: 0.8,
      speed: 0.7,
      cooldown: 1.4,
      nextAttack: r(),
      building: !1,
      level: e.defense.level,
    });
  let s = [],
    c = 0,
    l = e.defense.buildings.length,
    u = [],
    d = !1;
  for (let n = 0; n <= 180; n++) {
    if (((c = n * 0.25), e.rallyAt !== void 0 && !d && c >= e.rallyAt)) {
      for (let e of t.filter((e) => e.side === `attack` && e.hp > 0))
        e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.3);
      d = !0;
    }
    let r = t.filter((e) => e.hp > 0);
    for (let t of r) {
      if (t.hp <= 0 || !t.damage) continue;
      let n = r.filter((e) => e.side !== t.side && e.hp > 0);
      if (!n.length) continue;
      let i,
        a = 1 / 0;
      for (let e of n) {
        let n = Math.hypot(e.x - t.x, e.y - t.y);
        (t.kind === `cannon` && !e.building && (n += 2),
          n < a && ((a = n), (i = e)));
      }
      if (!i) continue;
      let o = i.x - t.x,
        s = i.y - t.y,
        l = Math.hypot(o, s),
        f = t.range + (i.building ? 0.3 : 0);
      if (l > f) {
        if (!t.building && t.speed) {
          let n =
            t.speed *
            0.25 *
            (t.side === `attack` &&
            d &&
            e.rallyAt !== void 0 &&
            c < e.rallyAt + 7
              ? 1.25
              : 1);
          ((t.x += (o / l) * Math.min(n, l - f)),
            (t.y += (s / l) * Math.min(n, l - f)));
        }
      } else if (c >= t.nextAttack) {
        let n =
          t.side === `attack` && d && e.rallyAt !== void 0 && c < e.rallyAt + 7
            ? 1.3
            : 1;
        ((i.hp = Math.max(
          0,
          i.hp - t.damage * n * (t.kind === `cannon` && i.building ? 2 : 1),
        )),
          (t.nextAttack = c + t.cooldown),
          u.push({
            x: t.x,
            y: t.y,
            tx: i.x,
            ty: i.y,
            side: t.side,
            kind: t.kind,
          }));
      }
    }
    if (e.rulesVersion === 2) {
      let e = t.filter((e) => !e.building && e.hp > 0);
      for (let t = 0; t < e.length; t++)
        for (let n = t + 1; n < e.length; n++) {
          let r = e[t],
            i = e[n],
            a = r.x - i.x,
            o = r.y - i.y,
            s = Math.hypot(a, o);
          if (s > 0 && s < 0.36) {
            let e = (0.36 - s) * 0.2;
            ((r.x += (a / s) * e),
              (r.y += (o / s) * e),
              (i.x -= (a / s) * e),
              (i.y -= (o / s) * e));
          }
        }
    }
    let i = t.filter(
        (e) => e.side === `defend` && e.building && e.hp > 0,
      ).length,
      a = Math.round(((l - i) / l) * 100);
    if (
      (n % 2 == 0 &&
        (s.push({ time: c, units: jl(t), shots: u, destruction: a }), (u = [])),
      !t.some((e) => e.side === `attack` && e.hp > 0) || i === 0)
    )
      break;
  }
  let f = t.find((e) => e.building && e.kind === `keep`),
    p = !!f && f.hp <= 0,
    m = Math.round(
      (t.filter((e) => e.side === `defend` && e.building && e.hp <= 0).length /
        l) *
        100,
    ),
    h = { infantry: 0, archer: 0, cavalry: 0, cannon: 0 };
  for (let e of t) e.side === `attack` && e.hp > 0 && h[e.kind]++;
  return (
    s.push({ time: c, units: jl(t), shots: [], destruction: m }),
    {
      won: p,
      stars: p ? (m === 100 ? 3 : 2) : +(m >= 50),
      destruction: m,
      survivors: h,
      frames: s,
      duration: c,
    }
  );
}
function Jl(e, t, n = 0.65) {
  return Object.fromEntries(
    Object.keys(J).map((r) => [
      r,
      (t[r] || 0) +
        (n === 0.65 ? Math.ceil : Math.floor)(
          Math.max(0, (e[r] || 0) - (t[r] || 0)) * n,
        ),
    ]),
  );
}
const SWCoast = Object.freeze({
  slots: [{x:-2,y:2},{x:-2,y:4},{x:-2,y:6}],
  focus: {x:350,y:220},
});
function SWIsCoastSlot(x,y) {
  return Number.isInteger(x) && Number.isInteger(y) && SWCoast.slots.some(s=>s.x===x&&s.y===y);
}
function SWWalkable(state,x,y) {
  return Vc(state,x,y) || (Number.isInteger(x)&&Number.isInteger(y)&&((x===-1&&y>=1&&y<=6)||SWIsCoastSlot(x,y)));
}
function SWCanPlace(state,kind,x,y,ignoreId) {
  return (kind==='harbor'?SWIsCoastSlot(x,y):Vc(state,x,y)&&!SWIsCoastSlot(x,y)) &&
    !al(state,x,y) && !state.buildings.some(b=>b.id!==ignoreId&&b.x===x&&b.y===y) && !(state.premium?.ornaments||[]).some(o=>o.x===x&&o.y===y);
}
function SWMigrateCoast(state) {
  if (state.coastVersion===1) return;
  const ports=state.buildings.filter(b=>b.kind==='harbor');
  const reserved=new Set(ports.filter(b=>SWIsCoastSlot(b.x,b.y)).map(b=>`${b.x},${b.y}`));
  for(const port of ports) {
    if(SWIsCoastSlot(port.x,port.y)) continue;
    const slot=SWCoast.slots.find(s=>!reserved.has(`${s.x},${s.y}`));
    if(!slot) continue;
    // Only relocate the port. Its identity, construction project and level survive.
    port.x=slot.x; port.y=slot.y; reserved.add(`${slot.x},${slot.y}`);
  }
  state.coastVersion=1;
}
function SWLegacyFu13(e, t, n, r, i, a = !0, o = Date.now()) {
  let s = { gold: 0, wood: 0, stone: 0, food: 0 };
  if (i.won) {
    if ((e.wins++, t === `campaign`))
      e.campaign === n
        ? ((s = Tl[n].reward), e.campaign++, (e.gems = (e.gems || 0) + 25), (e.rating += n === 4 ? 100 : 20))
        : (s = { gold: 35, wood: 20, stone: 15, food: 25 });
    else if (t === `province`) {
      let t = Ac.find((e) => e.id === r.provinceId);
      t &&
        !e.provinces?.some((e) => e.id === t.id) &&
        ((e.provinces = [...(e.provinces || []), { id: t.id, level: 1 }]),
        (s = t.reward),
        (e.rating += 25));
    } else
      t === `player` &&
        ((s = {
          gold: 90 + r.defense.level * 30,
          wood: 60,
          stone: 45,
          food: 60,
        }),
        (e.rating += Math.max(
          8,
          Math.min(25, Math.round(15 + (r.defense.rating - e.rating) / 20)),
        )));
    s = Ll(e, s);
  }
  if (
    (r.commander &&
      (r.rulesVersion !== 4 ||
        (r.orders?.some((e) => e.kind !== `hero`) && i.duration >= 10)) &&
      Kc(e, r.commander.id, i.won ? 40 : 15),
    t === `player`)
  ) {
    let t = Pc(o);
    e.season?.id !== t.id &&
      (e.season = { id: t.id, points: 0, wins: 0, losses: 0 });
    let n = e.season;
    i.won
      ? (n.wins++,
        a && (n.points += 20 + i.stars * 10 + (r.revengeReportId ? 10 : 0)))
      : n.losses++;
  }
  return s;
}
function GemCost(readyAt, now = Date.now()) { return Math.max(1, Math.ceil(Math.max(0, readyAt - now) / 60000)); }
function GemProjects(state) {
  const seen = new Set(), projects = [];
  for (const building of state.buildings) {
    if (!building.readyAt) continue;
    const key = building.projectId || building.id;
    if (seen.has(key)) continue;
    seen.add(key);
    projects.push({ target: 'building', id: building.id, name: Sl[building.kind].name, readyAt: building.readyAt });
  }
  if (state.trainingResearch) projects.push({target:'research',id:state.trainingResearch.kind,name:J[state.trainingResearch.kind].name+' research',readyAt:state.trainingResearch.readyAt});
  for(const ship of state.fleet || []) {
    if(ship.readyAt) projects.push({target:'ship',id:ship.id,name:wc[ship.kind].name,readyAt:ship.readyAt});
    if(ship.repairReadyAt) projects.push({target:'repair',id:ship.id,name:wc[ship.kind].name+' repair',readyAt:ship.repairReadyAt});
  }
  for(const [id,record] of Object.entries(state.city?.projects||{})) {
    if(!record.readyAt) continue;
    const district=SWCivicProjects.find(project=>project.id===id),stage=district?.stages[(record.targetStage||1)-1];
    projects.push({target:'civic',id,districtId:id,siteId:record.siteId,name:district?district.name+(stage?' · '+stage.name:''):'District construction',readyAt:record.readyAt});
  }
  return projects;
}
function ApplyGemAction(state, action, now) {
  if(action.type !== 'speedup') return false;
  if(!['building','research','ship','repair','civic'].includes(action.target) || typeof action.id !== 'string') throw Error('Choose an active project.');
  const project = GemProjects(state).find(p=>p.target===action.target && p.id===action.id);
  if(!project || project.readyAt<=now) throw Error('This project is already complete.');
  const cost=GemCost(project.readyAt,now);
  if(!Number.isInteger(action.maxCost) || action.maxCost<cost) throw Error('Review the current gem cost.');
  if(state.gems<cost) throw Error('Not enough gems. Earn more from objectives and first victories.');
  state.gems-=cost;
  if(action.target==='building') {
    const selected=state.buildings.find(b=>b.id===action.id);
    for(const b of state.buildings) if(b.id===selected.id || (selected.projectId && b.projectId===selected.projectId)) b.readyAt=now;
  } else if(action.target==='ship') state.fleet.find(s=>s.id===action.id).readyAt=now;
  else if(action.target==='repair') state.fleet.find(s=>s.id===action.id).repairReadyAt=now;
  else if(action.target==='civic') state.city.projects[action.id].readyAt=now;
  else state.trainingResearch.readyAt=now;
  return true;
}
export { bc, xc, Sc, Cc, wc, Tc, Ec, Oc, kc, Ac, jc, Mc, Nc, Pc, Ic, Lc, Rc, zc, Bc, Vc, Uc, Wc, Gc, Kc, qc, Jc, Zc, el, tl, nl, rl, il, al, SWLegacyFleet13, sl, cl, ll, ul, dl, fl, pl, ml, hl, SWMedicTarget, SWNavalShips, SWNavalStrike, SWAbilityData, SWTroopAbilities, SWApplyTroopStats, SWTroopDamageFactor, SWTroopIncomingFactor, SWTroopSplash, SWMedicHeals, SWNavalUnit, SWNavalTarget, SWEnemyNavy, SWCreateNavalUnit, SWEnemyNavalUnits, SWLegacyNavalStep13, _l, vl, yl, bl, xl, Sl, J, wl, Tl, El, Dl, Ol, Al, jl, Ml, Nl, Pl, Fl, Il, SWLegacyY13, SWStorageContribution, SWCapacity, SWBuildingCount, SWBuildingLimit, SWCanReceive, SWRequireRoom, SWMigrateStorage, SWClaimReserve, SWFacing, SWLandStats, SWRaidLoot, SWTradeQuote, SWApplyTrade, SWCityRecipes, SWCivicLevel, SWCity, SWCityRequest, SWShipRepairCost, SWCityTick, SWCityAction, SWDefenseInput, SWResolveDefense, SWCivicProjects, SWCivicStage, SWCivicBonuses, SWCivicProject, SWCivicTick, SWCivicProjectAction, SWRaidTiming, SWMigrateRaids, SWRaidStatus, SWRaidScheduleAfter, SWRaidInput, SWDefenseReport, SWSettleScheduledRaid, X, Z, Q, Ll, zl, SWLegacyBl13, Hl, SWPremiumCatalog, SWPremiumCollections, SWPremiumDefaults, SWPremium, SWMigratePremium, SWOwnCosmetic, SWGrantCollection, SWRevokeCollection, SWCosmeticStatus, SWAppearance, SWChapterMissions, SWMissionRequirements, SWChapter, SWTrialDefinitions, SWTrials, SWSagaDefense, SWSagaInput, SWSagaSpawn, SWSagaStep, SWSagaObjective, SWSagaSettle, SWResidentStoryDefinitions, SWResidentStories, SWEvents, SWPremiumReward, SWMedievalFinale, SWPremiumAction, SWLegacyUl13, Wl, Gl, Kl, ql, Jl, SWCoast, SWIsCoastSlot, SWWalkable, SWCanPlace, SWMigrateCoast, SWLegacyFu13, GemCost, GemProjects, ApplyGemAction };

function SWMissionScout(state,id,trialId){
 const mission=SWChapter(state).missions.find(m=>m.id===id);if(!mission||mission.type!=='battle')throw Error('Choose a battle mission.');
 const input=SWSagaInput(state,id,trialId||false,state.lastTick||Date.now());
 return {kind:trialId?'trial':'saga',missionId:id,trialId:trialId||undefined,fixedArmy:true,name:input.defense.name,defense:input.defense,title:mission.title,objective:input.saga.label,army:input.army,mission,previewInput:input};
}
function SWCanPlaceOrnament(state,id,x,y){const p=SWPremium(state),item=SWPremiumCatalog.find(i=>i.id===id);return !!item&&item.slot==='ornament'&&p.owned.includes(id)&&Number.isInteger(x)&&Number.isInteger(y)&&Vc(state,x,y)&&!state.buildings.some(b=>b.x===x&&b.y===y)&&!(state.terrain||[]).some(t=>t.x===x&&t.y===y&&t.kind!=='road')&&!p.ornaments.some(o=>o.x===x&&o.y===y)&&p.ornaments.length<40&&p.ornaments.filter(o=>o.itemId===id).length<12;}
export {SWMissionScout, SWCanPlaceOrnament};
