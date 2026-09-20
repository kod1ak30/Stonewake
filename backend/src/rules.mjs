// client/build17/gameplay.js
function SWCampaignProgress17(state) {
  const clears = (value) => typeof value === "number" && Number.isInteger(value) ? Math.max(0, Math.min(10, value)) : 0;
  const land = clears(state.campaign), sea = clears(state.seaCampaign), required = Math.min(10, Ml(state));
  return { land, sea, total: land + sea, required, next: Math.min(10, required + 1), met: required === 10 || land + sea >= required };
}
var resources = (raw) => Object.fromEntries(xl.map((kind) => {
  const value = (
    /** @type {Record<string, number> | undefined} */
    raw?.[kind]
  );
  return [kind, typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0];
}));
function committedCargo(state) {
  return Object.fromEntries(xl.map((kind) => [kind, (state.fleet || []).reduce((sum, ship) => sum + resources(ship.voyage?.reward)[kind], 0)]));
}
function SWMigrateHarbor17(state) {
  state.harborDepot17 = resources(state.harborDepot17);
  const committed = committedCargo(state), held = Math.max(0, ...xl.map((kind) => state.harborDepot17[kind] + committed[kind]));
  if (state.harborDepotVersion17 !== 1) {
    state.harborDepotLegacyCap17 = held;
    state.harborDepotVersion17 = 1;
  } else state.harborDepotLegacyCap17 = Math.min(Math.max(0, state.harborDepotLegacyCap17 || 0), held);
  return state;
}
function SWDepotStatus17(state) {
  const stored = resources(state.harborDepot17), committed = committedCargo(state);
  const main = (
    /** @type {Record<string, number>} */
    state.resources
  );
  const capacity = Math.max(SWCapacity(state), state.harborDepotLegacyCap17 || 0);
  return {
    resources: stored,
    capacity,
    committed,
    available: Object.fromEntries(xl.map((kind) => [kind, Math.max(0, capacity - stored[kind] - committed[kind])])),
    canClaim: xl.some((kind) => stored[kind] > 0 && main[kind] < SWCapacity(state))
  };
}
function SWReserveVoyage17(state, reward) {
  const depot = SWDepotStatus17(state);
  if (xl.some((kind) => resources(reward)[kind] > depot.available[kind])) throw Error("Move supplies from the Harbor depot into Storage before sending another trade voyage.");
}
function SWUnloadVoyage17(state, ship, now) {
  if (!ship?.voyage || ship.voyage.readyAt > now) throw Error("This ship has not returned yet.");
  const cargo = resources(ship.voyage.reward), depot = SWDepotStatus17(state), cap = SWCapacity(state);
  const main = (
    /** @type {Record<string, number>} */
    state.resources
  );
  const delivered = Object.fromEntries(xl.map((kind) => [kind, Math.min(cargo[kind], Math.max(0, cap - main[kind]))]));
  const stored = Object.fromEntries(xl.map((kind) => [kind, cargo[kind] - delivered[kind]]));
  if (xl.some((kind) => depot.resources[kind] + stored[kind] > depot.capacity)) throw Error("Move supplies out of the Harbor depot before unloading this cargo.");
  for (const kind of xl) {
    main[kind] += delivered[kind];
    state.harborDepot17[kind] += stored[kind];
  }
  delete ship.voyage;
  return { delivered, stored };
}
function SWClaimHarborDepot17(state) {
  const depot = SWDepotStatus17(state), moved = resources();
  const main = (
    /** @type {Record<string, number>} */
    state.resources
  );
  for (const kind of xl) moved[kind] = Math.min(depot.resources[kind], Math.max(0, SWCapacity(state) - main[kind]));
  if (!xl.some((kind) => moved[kind] > 0)) throw Error("Spend supplies or expand Storage before collecting from the Harbor depot.");
  for (const kind of xl) {
    main[kind] += moved[kind];
    state.harborDepot17[kind] -= moved[kind];
  }
  return moved;
}
function SWCollectionQuote17(state, id) {
  const collection = SWPremiumCollections.find((item) => item.id === id);
  if (!collection) throw Error("Choose a collection.");
  const owned = new Set(SWPremium(state).owned), items = collection.items.map((itemId) => {
    const item = SWPremiumCatalog.find((item2) => item2.id === itemId);
    if (!item) throw Error("This collection is unavailable.");
    return item;
  });
  const missing = items.filter((item) => !owned.has(item.id)), priceGems = Math.ceil(missing.reduce((sum, item) => sum + (item.priceGems || 0), 0) * 0.8);
  const reason = !missing.length ? "Collection owned" : missing.some((item) => item.priceGems === null) ? "Earn these pieces through adventures" : state.gems < priceGems ? "More gems needed" : null;
  return { id, name: collection.name, description: collection.description, items, missing, ownedCount: items.length - missing.length, priceGems, canBuy: !reason, reason };
}
function SWShortfallTrades17(state, cost) {
  const spareFood = Math.max(0, state.resources.food - (cost.food || 0)), result = [];
  const main = (
    /** @type {Record<string, number>} */
    state.resources
  );
  for (const resource of ["wood", "stone", "gold"]) {
    const shortfall = Math.max(0, (cost[resource] || 0) - main[resource]);
    if (!shortfall) continue;
    const choices = [50, 100, 250].map((amount) => SWTradeQuote(state, resource, amount, "food")).filter((quote2) => !quote2.reason && quote2.payment <= spareFood);
    const quote = choices.find((item) => item.amount >= shortfall) || choices.at(-1);
    if (quote) result.push({ ...quote, shortfall, action: { type: "marketTrade", resource, amount: quote.amount, payWith: "food" }, label: quote.payment + " food → " + quote.amount + " " + (resource === "wood" ? "timber" : resource) });
  }
  return result;
}
function SWBuildingUpgradeStats17(state, building) {
  if (!building || building.level >= 10) return [];
  const next = { ...building, level: Math.max(1, building.level + 1) }, after = { ...state, buildings: state.buildings.map((item) => item.id === building.id ? next : item) };
  const rows = [];
  const add = (label, before, value, unit = "") => {
    if (Math.abs(value - before) > 1e-5) rows.push({ label, before: Math.round(before * 10) / 10, after: Math.round(value * 10) / 10, unit });
  };
  const income = { farm: "food", lumber: "wood", quarry: "stone", cottage: "gold", market: "gold", harbor: "gold", keep: "gold" };
  if (building.kind === "storehouse") add("Storage per resource", SWCapacity(state), SWCapacity(after));
  if (building.kind === "keep") add("Base storage per resource", 500 + 250 * building.level, 500 + 250 * next.level);
  if (building.kind === "barracks") add("Army capacity", Pl(state), Pl(after), "troops");
  if (building.kind === "forge") add("Army attack bonus", (Hl(state) - 1) * 100, (Hl(after) - 1) * 100, "%");
  if (building.kind === "harbor") add("Ship berths", Math.min(8, building.level + 1), Math.min(8, next.level + 1));
  if (building.kind === "cottage") add("Residents", zl(state), zl(after));
  if (building.kind === "builder") {
    add("Construction crews", Ic(state), Ic(after));
    add("Crew speed bonus", Math.min(0.6, state.buildings.filter((item) => item.kind === "builder").reduce((sum, item) => sum + Math.max(0, item.level - 1) * 0.025, 0)) * 100, Math.min(0.6, after.buildings.filter((item) => item.kind === "builder").reduce((sum, item) => sum + Math.max(0, item.level - 1) * 0.025, 0)) * 100, "%");
  }
  if (building.kind === "workshop") add("Construction time reduction", Math.min(30, SWCivicLevel(state, "workshop") * 3), Math.min(30, SWCivicLevel(after, "workshop") * 3), "%");
  if (building.kind === "tavern") add("Resident request gold bonus", Math.min(50, SWCivicLevel(state, "tavern") * 5), Math.min(50, SWCivicLevel(after, "tavern") * 5), "%");
  if (income[building.kind]) add((income[building.kind] === "wood" ? "Timber" : income[building.kind][0].toUpperCase() + income[building.kind].slice(1)) + " income", Il(state)[income[building.kind]], Il(after)[income[building.kind]], "/ min");
  if (building.kind === "well") for (
    const resource of
    /** @type {(keyof Resources)[]} */
    xl
  ) add(resource === "wood" ? "Timber income" : resource[0].toUpperCase() + resource.slice(1) + " income", Il(state)[resource], Il(after)[resource], "/ min");
  const health = (item) => Cc.includes(item.kind) ? sl(item).hp : (item.kind === "keep" ? 1050 : item.kind === "wall" ? 500 : item.kind === "gate" ? 330 : 300) * (1 + (item.level - 1) * 0.35);
  if (Cc.includes(building.kind)) add("Damage per hit", sl(building).damage, sl(next).damage);
  add("Structure health", health(building), health(next));
  return rows;
}

// client/build14/rules.js
var SWFamilies14 = Object.freeze([
  { id: "vanguard", name: "Vanguard", role: "Protect and hold the breach", kinds: ["infantry", "shieldbearer", "spearman"], default: "infantry" },
  { id: "rangers", name: "Rangers", role: "Ranged support behind the frontline", kinds: ["archer", "crossbow"], default: "archer" },
  { id: "riders", name: "Riders", role: "Flank exposed targets", kinds: ["cavalry", "knight", "scout"], default: "cavalry" },
  { id: "breachers", name: "Breachers", role: "Open walls and gates", kinds: ["ram"], default: "ram" },
  { id: "siege", name: "Siege crews", role: "Heavy fire from long range", kinds: ["trebuchet", "cannon", "grenadier"], default: "trebuchet" },
  { id: "medics", name: "Field medics", role: "Support separate fighting groups", kinds: ["healer"], default: "healer" }
]);
function SWFamily14(kind) {
  return SWFamilies14.find((f) => f.kinds.includes(kind));
}
function SWMigrate14(state) {
  if (state.medievalVersion !== 14) {
    state.seaCampaign = Number.isInteger(state.seaCampaign) ? Math.max(0, Math.min(10, state.seaCampaign)) : 0;
    state.loadouts14 = Array.isArray(state.loadouts14) ? state.loadouts14.slice(0, 3) : [];
    if (!state.loadouts14.length) {
      const slots = SWFamilies14.map((f) => f.kinds.filter((k) => state.army?.[k] > 0).sort((a, b) => (state.unitLevels?.[b] || 1) - (state.unitLevels?.[a] || 1) || state.army[b] - state.army[a])[0] || f.default).filter((k) => (J[k].unlock || 1) <= Ml(state));
      state.loadouts14 = [{ id: "balanced", name: "Balanced force", slots, counts: Object.fromEntries(slots.map((k) => [k, Math.max(1, state.army?.[k] || (["ram", "trebuchet", "healer"].includes(k) ? 2 : 6))])) }];
    }
    for (const force of state.loadouts14) {
      let room = Pl(state);
      const desired = { ...force.counts };
      force.counts = Object.fromEntries(force.slots.map((k) => [k, 0]));
      while (room > 0) {
        let assigned = false;
        for (const k of force.slots) {
          if (room > 0 && force.counts[k] < (desired[k] || 0)) {
            force.counts[k]++;
            room--;
            assigned = true;
          }
        }
        if (!assigned) break;
      }
    }
    state.activeLoadout14 = state.loadouts14[0].id;
    state.medievalVersion = 14;
  }
  state.seaCampaign = Math.max(0, Math.min(10, state.seaCampaign || 0));
  SWMigrateHarbor17(state);
  return state;
}
function Y(state, now = Date.now()) {
  return SWMigrate14(SWLegacyY13(state, now));
}
function SWUpgradeQuote14(state, building) {
  if (!building) return { allowed: false, requirements: [{ id: "missing", text: "Choose a building.", met: false }], cost: {}, shortfall: {} };
  const level = building.level || 0, next = level + 1, max = Math.min(10, Sl[building.kind].max || 10), cost = X(building.kind, next), capacity = SWCapacity(state), requirements = [];
  const add = (id, text, met, action = null) => requirements.push({ id, text, met: !!met, action });
  add("maximum", level < max ? "Level " + next : "Medieval level complete", level < max);
  add("project", building.readyAt ? "Construction is in progress" : "Ready for development", !building.readyAt, { type: "projects" });
  add("builders", Rc(state) > 0 ? "Construction crew available" : "All construction crews are working", Rc(state) > 0, { type: "projects" });
  if (building.kind !== "keep") add("keep", "Keep " + next, Ml(state) >= next, { type: "buildingKind", kind: "keep" });
  else {
    const progress = SWCampaignProgress17(state);
    add("campaign", progress.total + " / " + level + " first victories across Land or Sea", progress.total >= level, { type: progress.sea > progress.land ? "sea" : "land" });
    for (const kind of level >= 2 ? ["barracks", "quarry"] : ["barracks"]) add(kind, Sl[kind].name + " " + level, state.buildings.some((b) => b.kind === kind && b.level >= level), { type: "buildingKind", kind });
  }
  const needed = Math.max(...Object.values(cost)), storeCount = SWBuildingCount(state, "storehouse"), canBuildStore = storeCount < SWBuildingLimit(state, "storehouse");
  add("storage", "Storage " + Math.floor(capacity).toLocaleString() + " / " + needed.toLocaleString(), needed <= capacity, canBuildStore ? { type: "build", kind: "storehouse" } : { type: "buildingKind", kind: "storehouse" });
  const shortfall = Object.fromEntries(xl.map((k) => [k, Math.max(0, Math.ceil(cost[k] - state.resources[k]))]));
  add("supplies", "Supplies for this upgrade", !Object.values(shortfall).some(Boolean), { type: "storage" });
  return { allowed: requirements.every((r) => r.met), requirements, level, next, max, cost, capacity, shortfall, deltas: SWBuildingUpgradeStats17(state, building), trades: SWShortfallTrades17(state, cost), duration: Zc(state, building.kind, next) * (1 - Math.min(0.3, SWCivicLevel(state, "workshop") * 0.03)), benefit: Bl({ ...building, level: next }), reason: requirements.find((r) => !r.met)?.text || null };
}
function Vl(state, building) {
  return SWUpgradeQuote14(state, building).reason;
}
function $c(state, building) {
  return SWUpgradeQuote14(state, building).requirements.find((r) => !r.met && ["campaign", "barracks", "quarry"].includes(r.id))?.text || null;
}
function Bl(building) {
  return SWLegacyBl13(building).replace(/^Age /, "Keep level ");
}
function SWLoadout14(state) {
  const list = state.loadouts14 || [];
  return list.find((l) => l.id === state.activeLoadout14) || list[0] || { id: "balanced", name: "Balanced force", slots: ["infantry", "archer"], counts: { infantry: 6, archer: 6 } };
}
function SWValidateLoadout14(state, raw) {
  if (!raw || !Array.isArray(raw.slots) || !raw.slots.length || raw.slots.length > 6) throw Error("Choose one to six troop types.");
  const slots = [...new Set(raw.slots)];
  if (slots.length !== raw.slots.length) throw Error("Choose each troop only once.");
  const families = /* @__PURE__ */ new Set();
  for (const k of slots) {
    if (!Object.hasOwn(J, k) || (J[k].unlock || 1) > Ml(state)) throw Error("That troop is not unlocked.");
    const family = SWFamily14(k).id;
    if (families.has(family)) throw Error("Choose one doctrine for each troop family.");
    families.add(family);
  }
  const counts = {};
  for (const k of slots) {
    const n = raw.counts?.[k];
    if (!Number.isInteger(n) || n < 0 || n > 80) throw Error("Choose between 0 and 80 troops per type.");
    counts[k] = n;
  }
  if (Object.values(counts).reduce((a, b) => a + b, 0) > Pl(state)) throw Error("This loadout exceeds your army capacity.");
  return { id: typeof raw.id === "string" && /^[a-z0-9_-]{1,30}$/.test(raw.id) ? raw.id : "balanced", name: String(raw.name || "My force").trim().slice(0, 24) || "My force", slots, counts };
}
function SWSelectedArmy14(state, loadout = SWLoadout14(state)) {
  return Object.fromEntries(Object.keys(J).map((k) => [k, loadout.slots.includes(k) ? Math.min(state.army[k] || 0, loadout.counts[k] || 0) : 0]));
}
function SWTrainQuote14(state, loadout = SWLoadout14(state)) {
  const missing = Object.fromEntries(loadout.slots.map((k) => [k, Math.max(0, (loadout.counts[k] || 0) - (state.army[k] || 0))]));
  const count = Object.values(missing).reduce((a, b) => a + b, 0), cost = Object.fromEntries(xl.map((r) => [r, Object.entries(missing).reduce((sum, [k, n]) => sum + (J[k].cost[r] || 0) * n, 0)]));
  const reason = !count ? "This force is ready" : !state.buildings.some((b) => b.kind === "barracks" && b.level > 0) ? "Complete a Barracks first" : missing.cannon > 0 && !state.buildings.some((b) => b.kind === "forge" && b.level > 0) ? "Complete a Forge for this siege doctrine" : loadout.slots.some((k) => missing[k] > 0 && (J[k].unlock || 1) > Ml(state)) ? "This troop is not unlocked" : Nl(state.army) + count > Pl(state) ? "Not enough army space" : !Z(state, cost) ? "More training supplies needed" : null;
  return { missing, count, cost, reason, allowed: !reason };
}
function SWTroopStats14(state, kind, level = el(state, kind)) {
  const base = J[kind], unit = { kind, level, hp: base.hp * (1 + 0.16 * (level - 1)), maxHp: base.hp * (1 + 0.16 * (level - 1)), damage: base.damage * (1 + 0.14 * (level - 1)), range: base.range, speed: base.speed, cooldown: base.cooldown };
  SWApplyTroopStats(unit);
  const townBonus = Hl(state);
  return { ...unit, baseDamage: unit.damage, damage: unit.damage * townBonus, townBonus, heal: kind === "healer" ? 20 * (1 + 0.14 * (level - 1)) : 0, abilities: SWTroopAbilities(kind).filter((a) => a.level <= level) };
}
var SWEquipment14 = Object.freeze({
  vanguard: ["Cloth tunic & buckler", "Padded vest & iron shield rim", "Mail shirt & guard stance", "Kite shield & bracers", "Full helm & longer blade", "Officer sash & cleaving blade", "Shoulder armor & house crest", "Plate vest & short mantle", "Veteran plume & embossed shield", "Gilded steel & royal mantle"],
  rangers: ["Shortbow & belt quiver", "Leather jerkin & broad quiver", "Longbow & leather hood", "Braced bow & arm guards", "Iron helm & bound arrows", "Reflex bow & quick-draw belt", "Mail shoulders & house cloak", "Reinforced limbs & steel tips", "Twin-arrow rig & veteran crest", "Royal bow & embroidered mantle"],
  riders: ["Light tack & riding spear", "Saddle blanket & leather vest", "Spurs & reinforced lance", "Horse chest guard & arm plates", "Barded neck & steel helm", "Charge lance & officer banner", "Mail barding & house shield", "Armored saddle & cape", "Veteran pennant & war plate", "Royal barding & gilded lance"],
  breachers: ["Timber frame & iron ram", "Bound beams & larger head", "Braced roof & heavy chassis", "Hide roof & crew shields", "Iron ribs & capstan", "Gatebreaker head & crew harness", "Plated roof & larger wheels", "Steel axle & armored doors", "Veteran crew & shock ram", "Royal siege frame & iron prow"],
  siege: ["Timber frame & stone sling", "Larger wheels & braced sling", "Long counterweight & lever", "Cross-braced frame & crew cover", "Stone counterweight & iron arm", "Shattering boulders & loading crane", "Armored crew station & banner", "Double braces & geared winch", "Veteran crew & quick-load rig", "Royal siege engine & gilded fittings"],
  medics: ["Satchel & walking staff", "Supply belt & padded robe", "Field lantern & reach staff", "White mantle & supply case", "Brass staff & surgeon kit", "Shared-care censer & blue sash", "Armored shoulders & field banner", "Reinforced satchel & long mantle", "Veteran halo & emergency kit", "Royal healer robes & beacon staff"]
});
function SWEquipmentName14(kind, level) {
  const index = Math.max(0, Math.min(9, level - 1)), base = SWEquipment14[SWFamily14(kind)?.id || "vanguard"][index];
  if (kind === "crossbow") return ["Light crossbow & bolt pouch", "Bound stock & leather jerkin", "Steel prod & leather hood", "Braced stock & arm guards", "Iron helm & broadhead bolts", "Windlass & quick-load belt", "Mail shoulders & house cloak", "Steel limbs & armor-piercing bolts", "Volley rig & veteran crest", "Royal crossbow & embroidered mantle"][index];
  if (kind === "grenadier") return ["Clay firepots & canvas satchel", "Leather apron & larger pots", "Throwing harness & fireproof gloves", "Bronze-capped pots & bracers", "Iron helm & protected fuses", "Fragmenting pots & armored apron", "Mail shoulders & house sash", "Steel supply case & short mantle", "Veteran crest & quick-throw harness", "Royal alchemist kit & gilded fittings"][index];
  if (kind === "cannon") return ["Iron barrel & timber carriage", "Bound wheels & reinforced carriage", "Long barrel & iron trunnions", "Braced axle & crew shields", "Cast barrel & plated carriage", "Blast shells & loading gear", "Crew armor & house banner", "Steel axles & counter-recoil brace", "Veteran crew & siege rounds", "Royal artillery & gilded fittings"][index];
  if (kind === "spearman") return base.replace("short blade", "spear").replace("longer blade", "long pike").replace("cleaving blade", "braced pike").replace("royal mantle", "royal pike");
  if (kind === "scout") return ["Light boots & scout blade", "Leather vest & field pack", "Hood & longer blade", "Bracers & trail cloak", "Steel helm & light mail", "Swift boots & officer sash", "Mail shoulders & house crest", "Plate vest & short mantle", "Veteran plume & embossed buckler", "Royal scout armor & mantle"][index];
  return base;
}
function SWLayoutAction14(state, action, now) {
  if (!Array.isArray(action.actions) || action.actions.length > 300) throw Error("A layout can contain up to 300 edits.");
  if (state.activeBattle) throw Error("Finish the battle before changing your defenses.");
  let draft = state;
  for (const edit of action.actions) {
    if (!["move", "rotate", "landscape"].includes(edit.type)) throw Error("Only layout edits may be committed.");
    draft = Ul(draft, edit, now);
  }
  return draft;
}
function Ul(state, action, now = Date.now()) {
  const current = Y(state, now);
  if (action.type === "claimHarborDepot") {
    SWClaimHarborDepot17(current);
    SWMigrateHarbor17(current);
    current.revision++;
    return current;
  }
  if (action.type === "upgrade") {
    const b = current.buildings.find((b2) => b2.id === action.id), q = SWUpgradeQuote14(current, b);
    if (!q.allowed) throw Error(q.requirements.filter((r) => !r.met).map((r) => r.text).join(" · "));
  }
  if (action.type === "saveLoadout") {
    if (current.activeBattle) throw Error("Change your force after the battle.");
    const loadout = SWValidateLoadout14(current, action.loadout);
    const others = current.loadouts14.filter((l) => l.id !== loadout.id);
    if (others.length >= 3) throw Error("You can save up to three forces.");
    current.loadouts14 = [...others, loadout];
    current.activeLoadout14 = loadout.id;
    current.revision++;
    return current;
  }
  if (action.type === "selectLoadout") {
    if (current.activeBattle) throw Error("Change your force after the battle.");
    if (!current.loadouts14.some((l) => l.id === action.id)) throw Error("Choose a saved force.");
    current.activeLoadout14 = action.id;
    current.revision++;
    return current;
  }
  if (action.type === "trainLoadout") {
    if (current.activeBattle) throw Error("Finish your battle before training.");
    const q = SWTrainQuote14(current);
    if (!q.allowed) throw Error(q.reason);
    Q(current, q.cost);
    for (const [kind, count] of Object.entries(q.missing)) current.army[kind] = (current.army[kind] || 0) + count;
    current.revision++;
    return current;
  }
  if (action.type === "commitLayout") return SWLayoutAction14(current, action, now);
  if (action.type === "collectFleet") {
    let collected = false;
    for (const ship of current.fleet) {
      if (ship.voyage && ship.voyage.readyAt <= now) {
        try {
          ol(current, { type: "collectVoyage", id: ship.id }, now);
          collected = true;
        } catch {
        }
      }
    }
    if (!collected) throw Error("No returned trade cargo is ready to unload.");
    SWMigrateHarbor17(current);
    current.revision++;
    return current;
  }
  const result = SWLegacyUl13(current, action, now);
  if (action.type === "move" && action.facing !== void 0) {
    if (!Number.isInteger(action.facing) || action.facing < 0 || action.facing > 3) throw Error("Choose a valid building rotation.");
    const b = result.buildings.find((b2) => b2.id === action.id);
    if (b) b.facing = action.facing;
  }
  return result;
}
function ol(state, action, now) {
  if (action.type === "voyage") {
    const preview = { ...state, fleet: state.fleet.map((ship) => ({ ...ship })) };
    SWLegacyFleet13(preview, action, now);
    const voyage = preview.fleet.find((ship) => ship.id === action.id).voyage;
    SWReserveVoyage17(state, voyage.reward);
    state.fleet.find((ship) => ship.id === action.id).voyage = voyage;
    return true;
  }
  if (action.type === "collectVoyage") {
    SWUnloadVoyage17(state, state.fleet?.find((ship) => ship.id === action.id), now);
    SWMigrateHarbor17(state);
    return true;
  }
  if (action.type === "landscape") {
    if (!SWWalkable(state, action.x, action.y)) throw Error("Choose a buildable plot or the harbor promenade.");
    if (state.buildings.some((b) => b.x === action.x && b.y === action.y)) throw Error("Move the building before changing this plot.");
    if ((state.premium?.ornaments || []).some((o) => o.x === action.x && o.y === action.y)) throw Error("Move the decoration before changing this plot.");
    if (!Object.hasOwn(Tc, action.kind || "")) throw Error("Choose a layout tool.");
    const before = il(state, action.x, action.y), kind = action.kind === "clear" ? "grass" : action.kind;
    if (before?.kind === kind || action.kind === "clear" && !before) return true;
    Q(state, Tc[action.kind].cost);
    if (action.kind === "clear" && before && !before.harvested) Ll(state, { gold: 0, wood: before.kind === "tree" ? 20 : 0, stone: before.kind === "rock" ? 15 : 0, food: 0 });
    state.terrain = [...(state.terrain || []).filter((t) => t.x !== action.x || t.y !== action.y), { x: action.x, y: action.y, kind, harvested: true }];
    return true;
  }
  return SWLegacyFleet13(state, action, now);
}

// client/build14/naval.js
var SWShipRoles14 = Object.freeze({
  cutter: { name: "Coastal cutter", role: "Fast landing craft", capacity: 12, growth: 3, hp: 440, damage: 12, range: 2.6, speed: 0.85, cooldown: 2.8 },
  cog: { name: "Landing cog", role: "Heavy troop transport", capacity: 24, growth: 5, hp: 760, damage: 10, range: 2.3, speed: 0.58, cooldown: 3.3 },
  galley: { name: "War galley", role: "Escort & interception", capacity: 8, growth: 2, hp: 680, damage: 38, range: 4.2, speed: 0.76, cooldown: 2.5 },
  bombard: { name: "Siege barge", role: "Trebuchet bombardment", capacity: 4, growth: 1, hp: 820, damage: 105, range: 7.4, speed: 0.38, cooldown: 6.5 }
});
var SWSeaChapters14 = Object.freeze([
  ["Saltwind Cove", "First landing", "Split a landing between two beaches.", 1, "assault"],
  ["The Lantern Run", "Convoy rescue", "Protect the relief cutter through the channel.", 2, "convoy"],
  ["Breakwater Gate", "Harbor assault", "Silence the patrol and take the harbor keep.", 2, "assault"],
  ["Iron Shoals", "Two approaches", "Move around the shoals before landing siege crews.", 3, "assault"],
  ["The Drowned Bells", "Coastal battery", "Land beyond the battery while your escort draws fire.", 3, "assault"],
  ["Red Sails", "Blockade", "Destroy the flagship and capture its stronghold.", 4, "blockade"],
  ["Greywater Reach", "Relief convoy", "Escort the relief ship through defended waters.", 4, "convoy"],
  ["The Splinter Coast", "Crossfire", "Open a safe beach between overlapping towers.", 5, "assault"],
  ["Crown Anchorage", "Fleet engagement", "Coordinate a landing and a duel against three ships.", 6, "blockade"],
  ["The Last Beacon", "Sea campaign finale", "Break the fleet, land your veterans, and take the beacon.", 7, "blockade"]
].map(([name, title, objective, keep, mode], index) => ({ id: "sea-" + index, index, name, title, objective, keep, mode, reward: { gold: 280 + index * 260, wood: 200 + index * 180, stone: 100 + index * 135, food: 90 + index * 90 }, gems: 30 })));
function SWShipCapacity14(ship) {
  const d = SWShipRoles14[ship.kind];
  return d ? d.capacity + d.growth * (Math.max(1, Math.min(10, ship.level || 1)) - 1) : 0;
}
function SWTroopWeight14(kind) {
  return { hero: 0, infantry: 1, archer: 1, spearman: 1, shieldbearer: 2, scout: 1, crossbow: 2, cavalry: 3, knight: 4, ram: 4, trebuchet: 5, cannon: 5, grenadier: 2, healer: 2 }[kind] ?? 1;
}
function SWReadyFleet14(state) {
  return (state.fleet || []).filter((s) => SWShipRoles14[s.kind] && s.level > 0 && !s.readyAt && !s.voyage && !s.combatBattleId && !s.wrecked && !s.repairReadyAt);
}
function SWFleetLimit14(state) {
  return Ml(state) >= 7 ? 3 : 2;
}
function SWCargoWeight14(army) {
  return Object.entries(army).reduce((sum, [kind, count]) => sum + SWTroopWeight14(kind) * count, 0);
}
function SWPreparationArmy14(state, requested = SWSelectedArmy14(state)) {
  const available = wl(), preferred = SWLoadout14(state).slots, keep = Ml(state);
  for (const kind of Object.keys(J)) {
    const count = requested?.[kind], owned = state.army?.[kind];
    if (Number.isFinite(count) && Number.isFinite(owned) && (J[kind].unlock || 1) <= keep) available[kind] = Math.max(0, Math.min(80, Math.floor(count), Math.floor(owned)));
  }
  const kinds = SWFamilies14.map((family) => family.kinds.filter((kind) => available[kind] > 0).sort((a, b) => Number(preferred.includes(b)) - Number(preferred.includes(a)) || available[b] - available[a] || family.kinds.indexOf(a) - family.kinds.indexOf(b))[0]).filter(Boolean);
  const army = wl();
  let room = Pl(state);
  while (room > 0) {
    let added = false;
    for (const kind of kinds) {
      if (room > 0 && army[kind] < available[kind]) {
        army[kind]++;
        room--;
        added = true;
      }
    }
    if (!added) break;
  }
  return army;
}
function SWPreparationShips14(state, ids) {
  const ready = SWReadyFleet14(state), seen = /* @__PURE__ */ new Set(), ships = [];
  for (const id of Array.isArray(ids) ? ids : []) {
    const ship = ready.find((candidate) => candidate.id === id);
    if (!ship || seen.has(id)) continue;
    seen.add(id);
    ships.push(ship);
    if (ships.length === SWFleetLimit14(state)) break;
  }
  return ships;
}
function SWCargoManifest14(ships, army) {
  const fleet = ships.map((ship) => ({ id: ship.id, kind: ship.kind, level: ship.level, cargo: {}, capacity: SWShipCapacity14(ship) }));
  const troops = Object.keys(J).flatMap((kind) => Array(army[kind] || 0).fill(kind)).sort((a, b) => SWTroopWeight14(b) - SWTroopWeight14(a));
  const room = fleet.map((ship) => ship.capacity), suffix = Array(troops.length + 1).fill(0), divisor = Array(troops.length + 1).fill(0), failed = /* @__PURE__ */ new Set();
  function gcd(a, b) {
    while (b) {
      const remainder = a % b;
      a = b;
      b = remainder;
    }
    return a;
  }
  for (let index = troops.length - 1; index >= 0; index--) {
    const weight = SWTroopWeight14(troops[index]);
    suffix[index] = suffix[index + 1] + weight;
    divisor[index] = gcd(weight, divisor[index + 1]);
  }
  function place(index) {
    if (index === troops.length) return true;
    if (suffix[index] > room.reduce((sum, value) => sum + value, 0)) return false;
    const unit = divisor[index];
    if (unit > 1 && suffix[index] > room.reduce((sum, value) => sum + Math.floor(value / unit) * unit, 0)) return false;
    const key2 = index + ":" + [...room].sort((a, b) => a - b).join(",");
    if (failed.has(key2)) return false;
    const kind = troops[index], weight = SWTroopWeight14(kind), tried = /* @__PURE__ */ new Set();
    const candidates = room.map((space, ship) => ({ space, ship, role: ["cog", "cutter"].includes(fleet[ship].kind) ? 0 : 1 })).filter((slot) => slot.space >= weight).sort((a, b) => a.role - b.role || a.space - b.space || a.ship - b.ship);
    for (const slot of candidates) {
      if (tried.has(slot.space)) continue;
      tried.add(slot.space);
      room[slot.ship] -= weight;
      if (place(index + 1)) {
        fleet[slot.ship].cargo[kind] = (fleet[slot.ship].cargo[kind] || 0) + 1;
        return true;
      }
      room[slot.ship] += weight;
    }
    failed.add(key2);
    return false;
  }
  return place(0) ? fleet : null;
}
function SWPackCargo14(state, ids, army = SWSelectedArmy14(state)) {
  const requestedArmy = SWPreparationArmy14(state, army), ships = SWPreparationShips14(state, ids), capacity = ships.reduce((sum, ship) => sum + SWShipCapacity14(ship), 0), loaded = wl();
  const kinds = Object.keys(J).filter((kind) => requestedArmy[kind] > 0), core = kinds.filter((kind) => ["vanguard", "rangers"].includes(SWFamily14(kind).id));
  const specialists = kinds.filter((kind) => !core.includes(kind)).sort((a, b) => SWTroopWeight14(b) - SWTroopWeight14(a));
  const complete = SWCargoManifest14(ships, requestedArmy);
  let fleet = complete || SWCargoManifest14(ships, loaded), coreWeight = 0;
  if (complete) Object.assign(loaded, requestedArmy);
  function add(kind) {
    if (loaded[kind] >= requestedArmy[kind]) return false;
    const candidate = { ...loaded, [kind]: loaded[kind] + 1 }, manifest = SWCargoManifest14(ships, candidate);
    if (!manifest) return false;
    loaded[kind]++;
    fleet = manifest;
    return true;
  }
  if (!complete && capacity > 0) {
    const reserve = Math.min(Math.ceil(capacity * 0.6), core.reduce((sum, kind) => sum + requestedArmy[kind] * SWTroopWeight14(kind), 0));
    while (coreWeight < reserve) {
      const next = [...core].sort((a, b) => loaded[a] / requestedArmy[a] - loaded[b] / requestedArmy[b]).find((kind) => add(kind));
      if (!next) break;
      coreWeight += SWTroopWeight14(next);
    }
    while (true) {
      let added = false;
      for (const kind of [...specialists, ...core]) if (add(kind)) added = true;
      if (!added) break;
    }
  }
  const remaining = Object.fromEntries(Object.keys(J).map((kind) => [kind, requestedArmy[kind] - loaded[kind]]));
  return { fleet, ids: fleet.map((ship) => ship.id), remaining, army: loaded, requestedArmy, capacity, weight: SWCargoWeight14(loaded), requestedWeight: SWCargoWeight14(requestedArmy), troopCount: Nl(loaded), excludedCount: Nl(remaining) };
}
function SWRecommendFleet14(state, army = SWSelectedArmy14(state)) {
  const requested = SWPreparationArmy14(state, army);
  if (!Nl(requested)) return [];
  const seen = /* @__PURE__ */ new Set(), ready = SWReadyFleet14(state).filter((ship) => {
    if (seen.has(ship.id)) return false;
    seen.add(ship.id);
    return true;
  }).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  let best = null;
  function consider(ships, start) {
    if (ships.length) {
      const pack = SWPackCargo14(state, ships.map((ship) => ship.id), requested), mix = ships.some((ship) => ["cutter", "cog"].includes(ship.kind)) && ships.some((ship) => ["galley", "bombard"].includes(ship.kind));
      const escortCargo = pack.fleet.filter((ship) => ["galley", "bombard"].includes(ship.kind)).reduce((sum, ship) => sum + SWCargoWeight14(ship.cargo), 0);
      const score = [Number(!pack.excludedCount), pack.troopCount, pack.weight, Number(mix), -ships.length, -escortCargo, ships.reduce((sum, ship) => sum + SWShipRoles14[ship.kind].damage * (1 + 0.13 * (ship.level - 1)), 0), -pack.capacity];
      const better = !best || score.some((value, index) => value !== best.score[index] && score.slice(0, index).every((before, i) => before === best.score[i]) && value > best.score[index]);
      if (better) best = { ids: pack.ids, score };
    }
    if (ships.length === SWFleetLimit14(state)) return;
    for (let index = start; index < ready.length; index++) consider([...ships, ready[index]], index + 1);
  }
  consider([], 0);
  return best?.ids || [];
}
function SWRecommendSeaPreparation14(state, army = SWSelectedArmy14(state), ids) {
  const pack = SWPackCargo14(state, ids === void 0 ? SWRecommendFleet14(state, army) : ids, army);
  const reason = !pack.fleet.length ? "Choose a ready ship in the Harbor." : pack.troopCount < 3 ? "At least three available troops must fit aboard." : null;
  return { ...pack, canSail: !reason, reason };
}
function SWValidateCargo14(state, rawFleet, army) {
  if (!Array.isArray(rawFleet) || !rawFleet.length || rawFleet.length > SWFleetLimit14(state)) throw Error("Choose up to " + SWFleetLimit14(state) + " ready ships.");
  const ids = /* @__PURE__ */ new Set(), totals = wl(), fleet = [];
  for (const raw of rawFleet) {
    const owned = SWReadyFleet14(state).find((s) => s.id === raw.id);
    if (!owned || ids.has(raw.id)) throw Error("Choose distinct, ready ships.");
    ids.add(raw.id);
    const cargo = {};
    for (const [kind, count] of Object.entries(raw.cargo || {})) {
      if (!Object.hasOwn(J, kind) || !Number.isInteger(count) || count < 0 || count > 80) throw Error("Invalid troop cargo.");
      cargo[kind] = count;
      totals[kind] += count;
    }
    if (Object.entries(cargo).reduce((n, [k, v]) => n + v * SWTroopWeight14(k), 0) > SWShipCapacity14(owned)) throw Error("Troops exceed this ship’s capacity.");
    fleet.push({ id: owned.id, kind: owned.kind, level: owned.level, cargo });
  }
  if (Object.keys(J).some((k) => totals[k] !== army[k])) throw Error("Every selected troop must be assigned to a ship.");
  return fleet;
}
function SWSeaDefense14(index) {
  const chapter = SWSeaChapters14[index];
  if (!chapter) throw Error("Choose a sea campaign.");
  const level = Math.min(10, Math.max(1, index)), defense = cl(Math.max(0, index - 1), chapter.name, level, { sea: true, chapter: index });
  defense.coast14 = true;
  defense.seaMode = chapter.mode;
  defense.buildings = defense.buildings.map((b) => ({ ...b, level: ["keep", "wall", "gate"].includes(b.kind) ? Math.max(1, level) : Math.max(1, Math.ceil(level * 0.7)) }));
  if (index === 0) defense.buildings = defense.buildings.filter((b) => !["tower", "mortar", "bastion"].includes(b.kind) || b.x === 6);
  defense.buildings = defense.buildings.filter((b) => b.x !== 0 || b.y !== 6);
  defense.buildings.push({ id: "sea-harbor", kind: "harbor", x: 0, y: 6, level: Math.max(1, chapter.keep) });
  defense.buildings = defense.buildings.filter((b, i, all) => !all.slice(0, i).some((p) => p.x === b.x && p.y === b.y));
  if (index >= 2) {
    defense.buildings = defense.buildings.filter((b) => b.x !== 0 || b.y !== 2);
    defense.buildings.push({ id: "shore-battery", kind: "tower", specialty: "ballista", x: 0, y: 2, level: Math.max(1, chapter.keep - 1) });
  }
  return defense;
}
function SWSeaNavy14(index) {
  return Array.from({ length: index < 2 ? 1 : index < 7 ? 2 : 3 }, (_, i) => ({ id: i === 0 ? "flagship" : "patrol-" + i, kind: index >= 5 && i === 0 ? "bombard" : "galley", level: Math.max(1, Math.ceil((index + 1) / 3)) }));
}
function SWSeaLanding14(defense, x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && x === -1 && y >= 0 && y <= 8 && !defense.buildings.some((b) => Math.hypot(b.x - x, b.y - y) < 0.9);
}
function SWCanDeploy14(input, x, y) {
  return input.campaignType === "sea" ? SWSeaLanding14(input.defense, x, y) : pl(input.defense, x, y);
}
function SWDeploymentOrder14(input, kind, x, y, time, shipId) {
  if (!SWCanDeploy14(input, x, y) || !hl(input)[kind]) return null;
  const order = { kind, x, y, time: Math.max(input.orders?.at(-1)?.time || 0, Math.min(119.5, Math.ceil(time * 4) / 4)) };
  if (input.campaignType === "sea") {
    const available = (input.fleet14 || []).filter((s) => !shipId || shipId === s.id).find((s) => kind === "hero" ? !(input.orders || []).some((o) => o.kind === "hero") : (s.cargo[kind] || 0) > (input.orders || []).filter((o) => o.shipId === s.id && o.kind === kind).length);
    if (!available) return null;
    order.shipId = available.id;
  }
  return order;
}
function SWOrders14(input, orders) {
  if (input.campaignType !== "sea") return ml(input, orders);
  if (!Array.isArray(orders) || orders.length > 81) throw Error("Invalid landing orders.");
  const accepted = [], counts = {};
  let last = 0;
  for (const raw of orders) {
    if (!raw || !(raw.kind === "hero" ? input.commander : Object.hasOwn(J, raw.kind)) || !Number.isFinite(raw.time) || raw.time < last || raw.time < 0 || raw.time > 119.5 || !SWSeaLanding14(input.defense, raw.x, raw.y)) throw Error("Choose a beach and a valid landing time.");
    const ship = input.fleet14.find((s) => s.id === raw.shipId);
    if (!ship) throw Error("This landing needs a transport.");
    const key2 = raw.kind === "hero" ? "hero" : raw.shipId + ":" + raw.kind;
    counts[key2] = (counts[key2] || 0) + 1;
    if (counts[key2] > (raw.kind === "hero" ? 1 : ship.cargo[raw.kind] || 0)) throw Error("That transport has no more of this troop.");
    accepted.push({ kind: raw.kind, x: raw.x, y: raw.y, time: raw.time, shipId: ship.id });
    last = raw.time;
  }
  return accepted;
}
function SWCreateBattle14(state, scout, preparation, seed) {
  const army = { ...wl(), ...preparation?.army || SWSelectedArmy14(state) };
  if (Object.entries(army).some(([k, n]) => !Object.hasOwn(J, k) || !Number.isInteger(n) || n < 0 || n > 80)) throw Error("Invalid troop selection.");
  const active = Object.keys(J).filter((k) => army[k] > 0);
  if (active.length > 6 || new Set(active.map((k) => SWFamily14(k).id)).size !== active.length) throw Error("Choose one doctrine per family, up to six types.");
  if (active.some((k) => !Number.isInteger(army[k]) || army[k] < 0 || army[k] > (state.army[k] || 0)) || Nl(army) < 3) throw Error("Choose at least three available troops.");
  if (Nl(army) > Pl(state)) throw Error("This force exceeds your army capacity.");
  if (active.some((k) => (J[k].unlock || 1) > Ml(state))) throw Error("This force contains a troop that is not unlocked.");
  const sea = scout.kind === "sea", chapter = SWSeaChapters14[scout.campaignIndex];
  if (sea && (!chapter || scout.campaignIndex > state.seaCampaign || Ml(state) < chapter.keep)) throw Error("Complete the previous sea chapter and its Keep requirement.");
  const fleet = sea ? SWValidateCargo14(state, preparation?.fleet || [], army) : [];
  return { defense: sea ? SWSeaDefense14(scout.campaignIndex) : scout.defense, appearance: SWAppearance(state), army, bonus: Hl(state), front: "center", rulesVersion: 4, combatVersion: 14, presentationVersion: 12, healerTacticsVersion: 1, troopAbilitiesVersion: 1, campaignType: sea ? "sea" : "land", navalVersion: sea ? 4 : 0, fleet14: fleet, enemyNavy: sea ? SWSeaNavy14(scout.campaignIndex) : [], seaMode: sea ? chapter.mode : void 0, seaIndex: sea ? scout.campaignIndex : void 0, orders: [], shipOrders14: [], unitLevels: { ...state.unitLevels }, commander: Gc(state), commanderStartingXP14: Wc(state, Gc(state).id)?.xp || 0, provinceId: scout.provinceId, structureBonus: 1 + 0.05 * (state.provinces?.find((p) => p.id === "ironpass")?.level || 0), seed };
}
function SWCreateShip14(ship, side, index = 0) {
  const d = SWShipRoles14[ship.kind];
  if (!d) return null;
  const level = Math.max(1, Math.min(10, ship.level || 1)), friendly = side === "attack", hp = d.hp * (1 + 0.14 * (level - 1)) * (friendly ? 1 : 0.52);
  return { id: (friendly ? "naval-" : "enemy-naval-") + ship.id, shipId: ship.id, side, kind: ship.kind, naval: true, navalVersion: 4, building: false, x: friendly ? -9 - index * 0.8 : -5.5 - index * 1.1, y: friendly ? 2 + index * 2 : 6 - index * 2, hp, maxHp: hp, level, damage: d.damage * (1 + 0.13 * (level - 1)) * (friendly ? 1 : 0.72), range: d.range, navalRange: ship.kind === "bombard" ? 5.8 : d.range, speed: d.speed, cooldown: d.cooldown, nextAttack: 1 + index * 0.4, heading: friendly ? 0 : Math.PI, vx: 0, vy: 0, cargo: { ...ship.cargo }, landed: 0, command: null };
}
function SWFleetUnits14(input) {
  return (input.fleet14 || []).map((s, i) => SWCreateShip14(s, "attack", i)).filter(Boolean);
}
function SWSeaEnemyUnits14(input) {
  return (input.enemyNavy || []).map((s, i) => SWCreateShip14(s, "defend", i)).filter(Boolean);
}
function SWValidateShipOrders14(input, orders) {
  if (!Array.isArray(orders) || orders.length > 80) throw Error("Invalid fleet orders.");
  let last = 0;
  return orders.map((order) => {
    if (!input.fleet14.some((s) => s.id === order.shipId) || !["move", "focus", "withdraw", "ability"].includes(order.type) || !Number.isFinite(order.time) || order.time < last || order.time > 119.5) throw Error("Choose a ship and a valid order.");
    last = order.time;
    if (order.type === "move" && (!Number.isFinite(order.x) || !Number.isFinite(order.y) || order.x < -12 || order.x > -2.4 || order.y < -2 || order.y > 11)) throw Error("Choose navigable water.");
    if (order.type === "focus" && typeof order.targetId !== "string") throw Error("Choose a visible enemy target.");
    return { shipId: order.shipId, type: order.type, time: order.time, ...order.type === "move" ? { x: order.x, y: order.y } : {}, ...order.type === "focus" ? { targetId: order.targetId } : {} };
  });
}
function SWSeaStep14(input, units, time, orders, spawn, events) {
  for (const command of input.shipOrders14 || []) {
    if (command.time > time || command.applied14) continue;
    command.applied14 = true;
    const ship = units.find((u) => u.shipId === command.shipId && u.side === "attack");
    if (!ship || ship.hp <= 0) continue;
    if (command.type === "ability") {
      if (ship.abilityUsed) continue;
      ship.abilityUsed = true;
      if (["cog", "cutter"].includes(ship.kind)) {
        ship.hp = Math.min(ship.maxHp, ship.hp + ship.maxHp * 0.2);
        ship.coverUntil = time + 7;
      } else ship.volleyUntil = time + 8;
    } else ship.command = { ...command };
  }
  for (const ship of units.filter((u) => u.navalVersion === 4 && u.side === "attack" && u.hp > 0 && !u.sagaEscort)) {
    const pending = orders.find((o) => !o.landed14 && o.time <= time && o.shipId === ship.shipId);
    if (!pending) {
      ship.landing = null;
      continue;
    }
    ship.landing = { x: -2.45, y: pending.y };
    if (ship.command?.type === "withdraw" || ship.command?.type === "move") continue;
    if (Math.hypot(ship.x + 2.45, ship.y - pending.y) > 0.5 || time < (ship.nextLanding14 || 0)) continue;
    spawn(pending, orders.indexOf(pending));
    pending.landed14 = true;
    ship.landed++;
    ship.nextLanding14 = time + 0.25;
    if (pending.kind !== "hero") ship.cargo[pending.kind] = Math.max(0, (ship.cargo[pending.kind] || 0) - 1);
    events.push({ id: "landing-" + orders.indexOf(pending), type: "landing", sourceId: ship.id, kind: pending.kind, x: ship.x, y: ship.y, tx: pending.x, ty: pending.y, time });
  }
  const convoy = units.find((u) => u.id === "relief-convoy");
  if (convoy && convoy.hp > 0) {
    convoy.y = Math.min(10, convoy.y + 0.25 * 0.13);
    convoy.heading = Math.PI / 2;
    convoy.vy = 0.13;
  }
}
function SWNavalStep(ship, units, time, step = 0.25) {
  if (ship.navalVersion !== 4) return SWLegacyNavalStep13(ship, units, time, step);
  ship.vx = 0;
  ship.vy = 0;
  if (ship.hp <= 0) return null;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), enemies = units.filter((u) => u.side !== ship.side && u.hp > 0), rivals = enemies.filter((u) => u.naval).sort((a, b) => distance(ship, a) - distance(ship, b) || a.id.localeCompare(b.id));
  let target = ship.command?.type === "focus" ? enemies.find((u) => u.id === ship.command.targetId) : null;
  target ||= rivals[0] || enemies.filter((u) => u.building && !ll(u)).sort((a, b) => distance(ship, a) - distance(ship, b))[0];
  const command = ship.command, withdraw = command?.type === "withdraw", manual = command?.type === "move";
  let destination = withdraw ? { x: -11, y: ship.y } : manual ? command : ship.landing || target || { x: -5, y: 4 };
  const range = target?.naval ? ship.navalRange : ship.range, desired = withdraw || manual || destination === ship.landing ? 0.15 : Math.max(0.3, range * 0.8);
  const arrival = destination === ship.landing || withdraw || manual ? 0.15 : desired;
  const goal = destination;
  if (ship.detour14 && Math.sign(goal.x - ship.x) !== ship.detour14.direction) ship.detour14 = null;
  if (ship.detour14) {
    while (ship.detour14.points.length && distance(ship, ship.detour14.points[0]) < 0.22) ship.detour14.points.shift();
    if (!ship.detour14.points.length) ship.detour14 = null;
  }
  if (!ship.detour14 && (ship.x < -6.7 && goal.x > -5.7 || ship.x > -5.7 && goal.x < -6.7)) {
    const ratio = (-6.2 - ship.x) / (goal.x - ship.x), crossY = ship.y + (goal.y - ship.y) * ratio;
    if (crossY > 3.05 && crossY < 5.85) {
      const direction = Math.sign(goal.x - ship.x), side = ship.y < 4.45 ? 2.95 : 5.95;
      ship.detour14 = { direction, points: [{ x: direction > 0 ? -7.1 : -5.3, y: side }, { x: direction > 0 ? -5.3 : -7.1, y: side }] };
    }
  }
  if (ship.detour14) destination = ship.detour14.points[0];
  let dx = destination.x - ship.x, dy = destination.y - ship.y, gap = Math.hypot(dx, dy);
  const stop = ship.detour14 ? 0.15 : arrival;
  if (gap > stop) {
    const stride = Math.min(ship.speed * step, gap - stop);
    dx = dx / gap * stride;
    dy = dy / gap * stride;
  } else {
    dx = 0;
    dy = 0;
    if (manual && !ship.detour14) ship.command = null;
  }
  for (const other of units.filter((u) => u.naval && u.hp > 0 && u.id !== ship.id)) {
    const d = distance(ship, other);
    if (d > 0.01 && d < 0.8) {
      dx += (ship.x - other.x) / d * 0.035;
      dy += (ship.y - other.y) / d * 0.035;
    }
  }
  const x = Math.max(-12, Math.min(-2.4, ship.x + dx)), y = Math.max(-2, Math.min(11, ship.y + dy));
  ship.vx = (x - ship.x) / step;
  ship.vy = (y - ship.y) / step;
  ship.x = x;
  ship.y = y;
  if (Math.hypot(ship.vx, ship.vy) > 5e-3) {
    const desired2 = Math.atan2(ship.vy, ship.vx), delta = Math.atan2(Math.sin(desired2 - ship.heading), Math.cos(desired2 - ship.heading));
    ship.heading += Math.max(-0.2, Math.min(0.2, delta));
  }
  if (!target || withdraw || distance(ship, target) > range || time < ship.nextAttack) return null;
  ship.nextAttack = time + ship.cooldown * (time < (ship.volleyUntil || 0) ? 0.5 : 1);
  const damage = ship.damage * (target.building && ship.kind === "bombard" ? 1.5 : 1);
  return { target, damage, splash: ship.kind === "bombard" ? enemies.filter((u) => u.id !== target.id && distance(u, target) < 1.1).map((unit) => ({ unit, damage: damage * 0.3 })) : [], shot: { x: ship.x, y: ship.y, tx: target.x, ty: target.y, side: ship.side, kind: "naval", navalVersion: 4, sourceId: ship.id, targetId: target.id, impact: target.naval ? "ship" : target.building ? "structure" : "troop", heading: Math.atan2(target.y - ship.y, target.x - ship.x) } };
}
function SWSeaObjective14(input, units) {
  const keep = units.find((u) => u.kind === "keep" && u.building), enemies = units.filter((u) => u.naval && u.side === "defend" && u.hp > 0), convoy = units.find((u) => u.id === "relief-convoy");
  if (input.seaMode === "convoy") return { won: !!convoy && convoy.hp > 0 && convoy.y >= 9.9, failed: !convoy || convoy.hp <= 0, label: "Protect the relief convoy", progress: convoy ? Math.round(Math.max(0, (convoy.y + 1) / 11) * 100) : 0, escortHealth: convoy ? Math.max(0, convoy.hp / convoy.maxHp) : 0 };
  const landed = units.some((u) => u.side === "attack" && !u.naval && !u.building && u.hp > 0), ruined = !!keep && keep.hp <= 0;
  const won = ruined && landed && (input.seaMode !== "blockade" || enemies.length === 0);
  return { won, failed: false, label: ruined && !landed ? "Land troops to secure the keep" : input.seaMode === "blockade" ? "Break the blockade and capture the keep" : "Capture the coastal keep", progress: keep ? Math.min(won ? 100 : 95, Math.round((1 - keep.hp / keep.maxHp) * 100)) : 0, enemyShips: enemies.length, landingRequired: !landed };
}
function Fu(state, kind, index, input, result, ranked = true, now = Date.now()) {
  if (kind !== "sea") return SWLegacyFu13(state, kind, index, input, result, ranked, now);
  const chapter = SWSeaChapters14[index];
  if (!chapter) throw Error("Sea campaign not found.");
  if (!result.won) return { gold: 0, wood: 0, stone: 0, food: 0 };
  const first = state.seaCampaign === index;
  if (index > state.seaCampaign) throw Error("Complete the earlier sea campaign first.");
  if (first) {
    state.seaCampaign++;
    state.gems += chapter.gems;
    state.rating += 20;
  }
  state.wins++;
  if (input.commander) Kc(state, input.commander.id, first ? 50 : 15);
  return Ll(state, first ? chapter.reward : { gold: 35, wood: 30, stone: 15, food: 20 });
}

// client/build14/simulation.js
function gl(e) {
  if (e.navalVersion === 4) e = { ...e, shipOrders14: SWValidateShipOrders14(e, e.shipOrders14 || []) };
  const swSea = e.campaignType === "sea" && e.navalVersion === 4;
  const swModern = e.presentationVersion === 12, swSagaMode = e.saga?.mode;
  let swEventId = 0, swEvents = [];
  const swTelemetry = e.defenseTelemetryVersion === 1 ? { towerDamage: 0, wallDamageAbsorbed: 0, wallDelaySeconds: 0, attackersDefeated: 0 } : null;
  const swPathBounds = e.combatVersion >= 11 ? fl(e.defense) : { minX: -5, minY: -5, maxX: 14, maxY: 14 };
  const swMedicAssignments = /* @__PURE__ */ new Map();
  const swMedicRules = e.healerTacticsVersion === 1;
  let swNavalFired = false;
  const swAbilities = e.troopAbilitiesVersion === 1;
  let t = [], n = e.seed >>> 0, r = () => (n = 1664525 * n + 1013904223 >>> 0, n / 4294967296);
  for (let n2 of e.defense.buildings) {
    let e2 = sl(n2), i2 = Cc.includes(n2.kind), a2 = i2 ? e2.hp : (n2.kind === `keep` ? 1050 : n2.kind === `wall` ? 500 : n2.kind === `gate` ? 330 : 300) * (1 + (n2.level - 1) * 0.35);
    t.push({
      id: n2.id,
      side: `defend`,
      kind: n2.kind,
      x: n2.x,
      y: n2.y,
      hp: a2,
      maxHp: a2,
      damage: i2 ? e2.damage : n2.kind === `keep` ? 7 + 1.5 * n2.level : 0,
      range: i2 ? e2.range : 2.3,
      speed: 0,
      cooldown: i2 ? e2.cooldown : 1.6,
      nextAttack: r(),
      building: true,
      level: n2.level,
      specialty: n2.specialty
    });
  }
  const swFleet = swSea ? SWFleetUnits14(e) : [];
  const swNaval = swSea ? swFleet[0] : SWNavalUnit(e);
  if (swSea) t.push(...swFleet);
  else if (swNaval) t.push(swNaval);
  const swEnemyNavy = swSea ? SWSeaEnemyUnits14(e) : SWEnemyNavalUnits(e);
  t.push(...swEnemyNavy);
  if (swSea && e.seaMode === "convoy") {
    const convoy = SWCreateShip14({ id: "relief", kind: "cog", level: 2 }, "attack");
    Object.assign(convoy, { id: "relief-convoy", x: -8, y: -1, hp: 650, maxHp: 650, damage: 0, sagaEscort: true });
    t.push(convoy);
  }
  if (swSea) {
    for (const unit of t) if (unit.id === "shore-battery") {
      unit.range = 7;
      unit.damage = 18 + 4 * unit.level;
      unit.cooldown = 2.2;
    }
  }
  const swEscort = e.saga ? SWSagaSpawn(e) : null;
  if (swEscort) t.push(swEscort);
  if (e.saga?.version === 12) {
    for (const unit of t) {
      if (e.saga.mode === "escort" && unit.id === "shore-battery") {
        unit.hp = unit.maxHp = 850;
        unit.damage = 28;
        unit.range = 8;
        unit.cooldown = 1.8;
      }
      if (e.saga.mode === "blockade" && unit.shipId === "flagship") {
        unit.hp = unit.maxHp = 950;
        unit.damage = 55;
        unit.cooldown = 6;
      }
      if (e.saga.mode === "blockade" && unit.kind === "keep") {
        unit.hp = unit.maxHp = 2200;
      }
      if (e.saga.mode === "rescue" && unit.id === "prison") unit.hp = unit.maxHp = 650;
    }
  }
  let i = swSea ? SWOrders14(e, e.orders || []) : ml(e, e.orders || []), a = 0, o = (n2, i2) => {
    if (n2.kind === `hero`) {
      let r2 = e.commander, i3 = Oc[r2.id], a3 = i3.hp * (1 + (r2.level - 1) * 0.15) * (r2.gear === `armor` ? 1.25 : 1);
      t.push({
        id: `commander`,
        side: `attack`,
        kind: `hero`,
        commander: r2.id,
        x: n2.x,
        y: n2.y,
        hp: a3,
        maxHp: a3,
        damage: i3.damage * (1 + (r2.level - 1) * 0.12) * (r2.gear === `blade` ? 1.15 : 1) * e.bonus,
        range: i3.range,
        speed: i3.speed,
        cooldown: 1.1,
        nextAttack: n2.time,
        building: false,
        level: r2.level
      });
      return;
    }
    let a2 = J[n2.kind], o2 = Math.max(1, Math.min(10, e.unitLevels?.[n2.kind] || 1)), s2 = a2.hp * (1 + 0.16 * (o2 - 1));
    t.push({
      id: `a-${i2}`,
      side: `attack`,
      kind: n2.kind,
      x: n2.x + (r() - 0.5) * 0.25,
      y: n2.y + (r() - 0.5) * 0.25,
      hp: s2,
      maxHp: s2,
      damage: a2.damage * e.bonus * (1 + 0.14 * (o2 - 1)),
      range: a2.range,
      speed: a2.speed,
      cooldown: a2.cooldown,
      nextAttack: n2.time + r() * 0.35,
      building: false,
      level: o2
    });
    if (swAbilities) SWApplyTroopStats(t[t.length - 1]);
  }, s = new Map(t.filter((e2) => e2.building).map((e2) => [dl(e2.x, e2.y), e2])), c = Math.min(
    10,
    2 + e.defense.buildings.filter((e2) => e2.kind === `barracks`).length * 2 + Math.floor(e.defense.level / 2)
  );
  for (let n2 = 0; n2 < c; n2++) {
    let i2 = [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 2 },
      { x: 1, y: 3 }
    ].find((e2) => !s.has(dl(e2.x, e2.y))) || { x: 0, y: 3 };
    t.push({
      id: `guard-${n2}`,
      side: `defend`,
      kind: `infantry`,
      x: i2.x + n2 % 2 * 0.23,
      y: i2.y + Math.floor(n2 / 2) * 0.18,
      hp: 95 + e.defense.level * 16,
      maxHp: 95 + e.defense.level * 16,
      damage: 8 + e.defense.level * 1.2,
      range: 0.85,
      speed: 0.8,
      cooldown: 1.4,
      nextAttack: r(),
      building: false,
      level: e.defense.level
    });
  }
  let l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = 0, f = /* @__PURE__ */ new Map(), p = (e2, t2) => {
    let n2 = s.get(dl(e2, t2));
    return n2 && n2.hp > 0 ? n2 : void 0;
  }, m = (e2, t2, n2, r2 = false) => {
    if (n2 > 1.3) return true;
    let i2 = ul(e2, t2), a2 = Math.ceil(i2 * 5);
    for (let n3 = 1; n3 < a2; n3++) {
      let i3 = p(e2.x + (t2.x - e2.x) * n3 / a2, e2.y + (t2.y - e2.y) * n3 / a2);
      if (i3 && i3.id !== t2.id && !(r2 && ll(i3))) return false;
    }
    return true;
  }, h = (e2, t2) => {
    let n2 = { x: Math.round(e2.x), y: Math.round(e2.y) }, r2 = `${d}:${e2.id}:${dl(n2.x, n2.y)}:${t2.id}:${dl(t2.x, t2.y)}`, i2 = f.get(r2);
    if (i2) return i2;
    let a2 = [n2], o2 = /* @__PURE__ */ new Map([[dl(n2.x, n2.y), 0]]), s2 = /* @__PURE__ */ new Map(), c2, l2 = (n3) => Math.max(0, ul(n3, t2) - e2.range - (t2.building ? 0.35 : 0));
    for (let n3 = 0; a2.length && n3 < (swPathBounds.maxX > 14 || swPathBounds.maxY > 14 ? 1600 : 400); n3++) {
      let n4 = 0;
      for (let e3 = 1; e3 < a2.length; e3++)
        o2.get(dl(a2[e3].x, a2[e3].y)) + l2(a2[e3]) < o2.get(dl(a2[n4].x, a2[n4].y)) + l2(a2[n4]) && (n4 = e3);
      let r3 = a2.splice(n4, 1)[0], i3 = dl(r3.x, r3.y);
      if (ul(r3, t2) <= e2.range + (t2.building ? 0.35 : 0) && m(r3, t2, e2.range, e2.side === `attack`)) {
        c2 = r3;
        break;
      }
      for (let [t3, n5] of [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1]
      ]) {
        let c3 = { x: r3.x + t3, y: r3.y + n5 };
        if (c3.x < swPathBounds.minX || c3.y < swPathBounds.minY || c3.x > swPathBounds.maxX || c3.y > swPathBounds.maxY) continue;
        let l3 = p(c3.x, c3.y), u3 = 0;
        if (l3)
          if (e2.side === `defend` && l3.kind === `gate`) u3 = 0;
          else if (e2.side === `attack` && ll(l3))
            u3 = l3.hp / Math.max(10, e2.damage) * 0.35;
          else continue;
        let d2 = dl(c3.x, c3.y), f2 = o2.get(i3) + 1 + u3;
        f2 < (o2.get(d2) ?? 1 / 0) && (o2.set(d2, f2), s2.set(d2, r3), a2.some((e3) => e3.x === c3.x && e3.y === c3.y) || a2.push(c3));
      }
    }
    let u2 = [];
    if (c2) {
      let e3 = c2;
      for (let t3 = 0; t3 < 210 && dl(e3.x, e3.y) !== dl(n2.x, n2.y); t3++) {
        u2.unshift(e3);
        let t4 = s2.get(dl(e3.x, e3.y));
        if (!t4) break;
        e3 = t4;
      }
    }
    return f.set(r2, u2), u2;
  }, g = (e2, t2) => {
    let n2 = `${d}:${t2.id}:${dl(t2.x, t2.y)}`, r2 = u.get(e2.id);
    if (r2?.signature === n2 && r2.points.length) return r2.points;
    let i2 = h(e2, t2).map((e3) => ({ ...e3 })), a2 = { x: Math.round(e2.x), y: Math.round(e2.y) };
    return i2.length && ul(a2, e2) > 0.05 && !p(a2.x, a2.y) && i2.unshift(a2), u.set(e2.id, { signature: n2, points: i2 }), i2;
  }, _ = [], v = [], y = 0, b = false, x = false, S = -1, C, swAllUnits = t, w = (e2, t2, source) => {
    if (e2.hp <= 0) return;
    if (e2.navalVersion === 4 && y < (e2.coverUntil || 0)) t2 *= 0.65;
    e2.side === `attack` && !e2.naval && y < S && C && C.hp > 0 && ul(e2, C) < 3.6 && (t2 *= 0.5);
    if (swAbilities) t2 *= SWTroopIncomingFactor(e2, swAllUnits);
    if (swSagaMode === "blockade" && e2.shipId === "flagship" && swAllUnits.some((u2) => u2.kind === "keep" && u2.building && u2.hp > 0)) t2 *= 0.55;
    if (swSagaMode === "escort" && e2.id === "shore-battery" && source?.naval) t2 *= 0.08;
    let n2 = e2.hp;
    e2.hp = Math.max(0, n2 - t2), n2 > 0 && e2.hp === 0 && e2.building && (d++, f.clear());
    if (swModern) {
      const actual = n2 - e2.hp;
      if (actual > 0) swEvents.push({ id: "event-" + swEventId++, type: e2.hp === 0 ? e2.building ? "breach" : "death" : "impact", sourceId: source?.id, targetId: e2.id, kind: source?.kind || "impact", targetKind: e2.kind, x: source?.x ?? e2.x, y: source?.y ?? e2.y, tx: e2.x, ty: e2.y, time: y, amount: Math.round(actual) });
    }
    if (swTelemetry) {
      const damage = n2 - e2.hp;
      if (e2.side === "defend" && e2.building && ll(e2)) swTelemetry.wallDamageAbsorbed += damage;
      if (e2.side === "attack" && source?.side === "defend" && source.building && Cc.includes(source.kind)) swTelemetry.towerDamage += damage;
      if (e2.side === "attack" && !e2.building && !e2.naval && e2.kind !== "hero" && n2 > 0 && e2.hp === 0) swTelemetry.attackersDefeated++;
    }
    if (e2.navalVersion >= 3 && n2 > 0 && e2.hp === 0) {
      e2.sunkAt = y;
      e2.vx = 0;
      e2.vy = 0;
    }
  }, T = (t2, n2) => {
    if (y < t2.nextAttack) return;
    let r2 = t2.damage * (t2.kind === `cannon` && n2.building ? 2 : t2.kind === `ram` && ll(n2) ? 4 : t2.kind === `spearman` && [`cavalry`, `knight`].includes(n2.kind) ? 2 : 1);
    r2 *= SWTroopDamageFactor(t2, n2);
    if (swModern) {
      t2.lastAttackAt = y;
      t2.targetId = n2.id;
      t2.heading = Math.atan2(n2.y - t2.y, n2.x - t2.x);
    }
    t2.kind === `crossbow` && n2.kind === `shieldbearer` && (r2 /= 0.65), t2.side === `attack` && n2.building && (r2 *= e.structureBonus || 1), t2.side === `attack` && b && y < (e.rallyAt || 0) + 7 && (r2 *= 1.3), w(n2, r2, t2), t2.nextAttack = y + t2.cooldown, v.push({
      ...swModern ? { sourceId: t2.id, targetId: n2.id, firedAt: Math.max(0, y - (["cannon", "trebuchet", "archer", "crossbow", "grenadier"].includes(t2.kind) ? 0.35 : 0.12)), impactAt: y } : {},
      x: t2.x,
      y: t2.y,
      tx: n2.x,
      ty: n2.y,
      side: t2.side,
      kind: t2.kind === `hero` ? t2.commander === `ranger` ? `archer` : t2.commander === `engineer` ? `cannon` : `infantry` : t2.kind
    });
    if (t2.abilitiesVersion === 1) {
      for (const hit of SWTroopSplash(t2, n2, swAllUnits)) w(hit.unit, r2 * hit.fraction, t2);
      t2.attackCount++;
    }
    if (e.combatVersion >= 11 && t2.building && !n2.naval) {
      const radius = sl(t2).splash;
      if (radius > 0) {
        for (const other of swAllUnits) if (other.id !== n2.id && other.side !== t2.side && !other.naval && other.hp > 0 && ul(other, n2) <= radius) w(other, r2 * 0.55, t2);
      }
    }
  }, ee = t.filter((e2) => e2.building && !ll(e2)).length;
  for (let n2 = 0; n2 <= 480; n2++) {
    y = n2 * 0.25;
    if (swSea) SWSeaStep14(e, t, y, i, o, swEvents);
    else for (; a < i.length && i[a].time <= y; ) o(i[a], a), a++;
    if (C = t.find((e2) => e2.kind === `hero`), e.rallyAt !== void 0 && !b && y >= e.rallyAt) {
      for (let e2 of t.filter((e3) => e3.side === `attack` && !e3.naval && e3.hp > 0))
        e2.hp = Math.min(e2.maxHp, e2.hp + e2.maxHp * 0.3);
      b = true;
    }
    if (C && C.hp > 0 && e.heroAt !== void 0 && !x && y >= e.heroAt) {
      x = true;
      let n3 = e.commander?.gear === `manual` ? 1.4 : 1;
      if (C.commander === `captain`) {
        S = y + 6 * n3;
        for (let e2 of t.filter(
          (e3) => e3.side === `attack` && !e3.naval && e3.hp > 0 && ul(e3, C) < 3.6
        ))
          e2.hp = Math.min(e2.maxHp, e2.hp + e2.maxHp * 0.12 * n3);
      } else {
        let e2 = t.filter(
          (e3) => e3.side === `defend` && e3.hp > 0 && (C.commander === `ranger` || ll(e3) || Cc.includes(e3.kind))
        ).sort(
          (e3, t2) => ul(e3, C) + (Cc.includes(e3.kind) ? -3 : 0) - (ul(t2, C) + (Cc.includes(t2.kind) ? -3 : 0))
        );
        for (let t2 of e2.slice(0, C.commander === `engineer` ? 1 : 3))
          w(
            t2,
            (C.commander === `engineer` ? 200 + C.level * 40 : 80 + C.level * 15) * n3
          ), v.push({
            x: C.x,
            y: C.y,
            tx: t2.x,
            ty: t2.y,
            side: `attack`,
            kind: C.commander === `engineer` ? `cannon` : `archer`
          });
      }
    }
    if (!swNavalFired) {
      const strike = SWNavalStrike(e, t, y);
      if (strike) {
        swNavalFired = true;
        for (const hit of strike.hits) w(hit.unit, hit.damage);
        v.push(strike.shot);
      }
    }
    if (e.saga) SWSagaStep(e, t, y);
    let r2 = t.filter((e2) => e2.hp > 0);
    for (let n3 of r2) {
      if (n3.hp <= 0 || n3.sagaEscort) continue;
      if (n3.navalVersion >= 3) {
        const strike = SWNavalStep(n3, t, y);
        if (strike) {
          w(strike.target, strike.damage, n3);
          for (const hit of strike.splash) w(hit.unit, hit.damage, n3);
          v.push({ ...strike.shot, ...swModern ? { firedAt: Math.max(0, y - 0.4), impactAt: y } : {} });
          if (swModern) {
            n3.lastAttackAt = y;
            n3.targetId = strike.target.id;
          }
        }
        continue;
      }
      if (n3.naval) {
        const target = SWNavalTarget(n3, t);
        if (target && y >= n3.nextAttack) {
          w(target, n3.damage);
          if (n3.kind === "bombard") for (const other of t.filter((u4) => u4.id !== target.id && u4.side === "defend" && u4.hp > 0 && ul(u4, target) <= 1.15)) w(other, n3.damage * 0.4);
          n3.nextAttack = y + n3.cooldown;
          v.push({ x: n3.x, y: n3.y, tx: target.x, ty: target.y, side: n3.side, kind: "naval" });
        }
        continue;
      }
      if (n3.kind === `healer` && swMedicRules) {
        const ally = SWMedicTarget(n3, t, swMedicAssignments, y);
        if (ally) {
          const previous = swMedicAssignments.get(n3.id);
          n3.healTargetId = ally.id;
          swMedicAssignments.set(n3.id, { targetId: ally.id, until: previous?.targetId === ally.id ? previous.until : y + 2 });
          const missing = ally.maxHp - ally.hp;
          if (missing > 0 && ul(n3, ally) <= n3.range && y >= n3.nextAttack) {
            for (const heal of SWMedicHeals(n3, ally, t)) {
              const before = heal.unit.hp;
              heal.unit.hp = Math.min(heal.unit.maxHp, heal.unit.hp + heal.amount);
              v.push({ x: n3.x, y: n3.y, tx: heal.unit.x, ty: heal.unit.y, side: n3.side, kind: `heal`, healerId: n3.id, targetId: heal.unit.id, ...swModern ? { firedAt: y, impactAt: y } : {} });
              if (swModern) swEvents.push({ id: "event-" + swEventId++, type: "heal", sourceId: n3.id, targetId: heal.unit.id, kind: "healer", x: n3.x, y: n3.y, tx: heal.unit.x, ty: heal.unit.y, time: y, amount: Math.round(heal.unit.hp - before) });
            }
            n3.nextAttack = y + n3.cooldown;
          } else if (ul(n3, ally) > n3.range * 0.8) {
            const route = g(n3, ally), point = route[0];
            if (point && !p(point.x, point.y)) {
              const distance = ul(n3, point), step = Math.min(n3.speed * 0.25, distance);
              if (distance) {
                n3.x += (point.x - n3.x) / distance * step;
                n3.y += (point.y - n3.y) / distance * step;
                if (ul(n3, point) < 0.025) route.shift();
              }
            }
          }
        } else {
          swMedicAssignments.delete(n3.id);
          delete n3.healTargetId;
        }
        continue;
      }
      if (n3.kind === `healer`) {
        let e2 = t.filter(
          (e3) => e3.side === n3.side && !e3.building && e3.hp > 0 && e3.id !== n3.id
        ), r3 = e2.filter((e3) => e3.hp < e3.maxHp).sort((e3, t2) => ul(n3, e3) - ul(n3, t2)), i3 = r3[0] || e2.sort((e3, t2) => ul(n3, e3) - ul(n3, t2))[0];
        if (i3) {
          if (r3.length && ul(n3, i3) <= n3.range && y >= n3.nextAttack)
            i3.hp = Math.min(i3.maxHp, i3.hp + 20 * (1 + 0.14 * (n3.level - 1))), n3.nextAttack = y + n3.cooldown, v.push({
              x: n3.x,
              y: n3.y,
              tx: i3.x,
              ty: i3.y,
              side: n3.side,
              kind: `heal`
            });
          else if (ul(n3, i3) > n3.range * 0.8) {
            let e3 = g(n3, i3), t2 = e3[0];
            if (t2 && !p(t2.x, t2.y)) {
              let r4 = ul(n3, t2), i4 = Math.min(n3.speed * 0.25, r4);
              r4 && (n3.x += (t2.x - n3.x) / r4 * i4, n3.y += (t2.y - n3.y) / r4 * i4, ul(n3, t2) < 0.025 && e3.shift());
            }
          }
        }
        continue;
      }
      if (!n3.damage) continue;
      let i2 = r2.filter(
        (e2) => e2.side !== n3.side && e2.hp > 0 && (!e2.naval || n3.building || e2.navalVersion >= 3 && n3.range >= 2 && ul(n3, e2) <= n3.range + 0.35) && (n3.side !== `attack` || !ll(e2) || n3.kind === `ram`)
      );
      if (!i2.length) continue;
      let a2 = (e2) => n3.kind === `ram` && ll(e2) ? -12 : n3.kind === `knight` && Cc.includes(e2.kind) ? -3 : n3.kind === `scout` && [`farm`, `lumber`, `quarry`, `market`].includes(e2.kind) ? -4 : n3.kind === `cannon` && !e2.building ? 3 : 0;
      i2.sort((e2, t2) => ul(n3, e2) + a2(e2) - ul(n3, t2) - a2(t2));
      let o2 = i2[0];
      if (n3.building) {
        let e2 = sl(n3).minRange, t2 = (swSagaMode === "escort" && n3.id === "shore-battery" && y >= 12 ? i2.find((t3) => t3.sagaEscort && ul(n3, t3) <= n3.range) : null) || i2.find(
          (t3) => t3.id === l.get(n3.id) && ul(n3, t3) <= (t3.naval ? Math.max(t3.navalVersion === 3 ? 5.75 : 7, n3.range) : n3.range) && ul(n3, t3) >= e2
        ) || i2.find((t3) => ul(n3, t3) <= (t3.naval ? Math.max(t3.navalVersion === 3 ? 5.75 : 7, n3.range) : n3.range) && ul(n3, t3) >= e2);
        t2 && l.set(n3.id, t2.id), t2 && T(n3, t2);
        continue;
      }
      if (ul(n3, o2) <= n3.range + (o2.building ? 0.35 : 0) && m(n3, o2, n3.range)) {
        if (swTelemetry && n3.side === "attack" && ll(o2)) swTelemetry.wallDelaySeconds += 0.25;
        T(n3, o2);
        continue;
      }
      let s3 = g(n3, o2);
      if (!s3.length) {
        for (let e2 of i2.slice(1, 5))
          if (s3 = g(n3, e2), s3.length) {
            o2 = e2;
            break;
          }
      }
      if (!s3.length) continue;
      let c3 = s3[0], u3 = p(c3.x, c3.y), d2 = c3, f2 = 0;
      if (u3 && n3.side === `attack` && ll(u3)) {
        if (ul(n3, u3) <= n3.range + 0.35) {
          if (swTelemetry) swTelemetry.wallDelaySeconds += 0.25;
          T(n3, u3);
          continue;
        }
        d2 = u3, f2 = n3.range + 0.3;
      }
      let h2 = d2.x - n3.x, _2 = d2.y - n3.y, x2 = Math.hypot(h2, _2), S2 = n3.speed * 0.25 * (n3.side === `attack` && b && y < (e.rallyAt || 0) + 7 ? 1.25 : 1), C2 = Math.max(0, Math.min(S2, x2 - f2));
      x2 && (n3.x += h2 / x2 * C2, n3.y += _2 / x2 * C2, ul(n3, c3) < 0.025 && s3.shift());
    }
    let s2 = t.filter((e2) => !e2.building && !e2.naval && !e2.sagaEscort && e2.hp > 0);
    for (let e2 = 0; e2 < s2.length; e2++)
      for (let t2 = e2 + 1; t2 < s2.length; t2++) {
        let n3 = s2[e2], r3 = s2[t2], i2 = n3.x - r3.x, a2 = n3.y - r3.y, o2 = Math.hypot(i2, a2);
        const spacing = swMedicRules && n3.kind === `healer` && r3.kind === `healer` && n3.side === r3.side ? 0.9 : 0.38;
        if (o2 > 1e-3 && o2 < spacing) {
          let e3 = (spacing - o2) * 0.16;
          for (let [t3, s3] of [
            [n3, 1],
            [r3, -1]
          ]) {
            let n4 = t3.x + i2 / o2 * e3 * s3, r4 = t3.y + a2 / o2 * e3 * s3, c3 = p(n4, r4);
            (!c3 || t3.side === `defend` && c3.kind === `gate`) && (t3.x = n4, t3.y = r4);
          }
        }
      }
    let c2 = t.filter((e2) => e2.building && !ll(e2) && e2.hp > 0).length, u2 = Math.round((ee - c2) / Math.max(1, ee) * 100);
    if (n2 % 2 == 0 && (_.push({ time: y, units: jl(t), shots: v, destruction: u2, ...swModern ? { events: swEvents } : {}, ...swSea ? { objective: SWSeaObjective14(e, t) } : e.saga ? { objective: SWSagaObjective(e, t, y) } : {} }), v = [], swEvents = []), t.filter((e2) => e2.side === `attack` && e2.kind !== `hero` && !e2.naval).length >= Object.values(e.army).reduce((e2, t2) => e2 + t2, 0) && !t.some((e2) => e2.side === `attack` && e2.hp > 0) || !e.saga && !swSea && c2 === 0 || swSea && (SWSeaObjective14(e, t).won || SWSeaObjective14(e, t).failed) || e.saga && SWSagaObjective(e, t, y).complete || e.retreatAt !== void 0 && y >= e.retreatAt)
      break;
  }
  let E = t.find((e2) => e2.kind === `keep` && e2.building), D = !!E && E.hp <= 0, te = Math.round(
    t.filter((e2) => e2.building && !ll(e2) && e2.hp <= 0).length / Math.max(1, ee) * 100
  ), ne = wl();
  for (let e2 of t)
    e2.side === `attack` && e2.hp > 0 && Object.hasOwn(ne, e2.kind) && ne[e2.kind]++;
  for (let n2 of Object.keys(J))
    ne[n2] += Math.max(
      0,
      (e.army[n2] || 0) - t.filter((e2) => e2.side === `attack` && e2.kind === n2).length
    );
  if (!Object.hasOwn(e.army, "trebuchet")) delete ne.trebuchet;
  return _.push({ time: y, units: jl(t), shots: v, destruction: te, ...swModern ? { events: swEvents } : {}, ...swSea ? { objective: SWSeaObjective14(e, t) } : e.saga ? { objective: SWSagaObjective(e, t, y, true) } : {} }), {
    won: swSea ? SWSeaObjective14(e, t).won : e.saga ? SWSagaObjective(e, t, y, true).won : D,
    stars: swSea ? SWSeaObjective14(e, t).won ? te === 100 ? 3 : 2 : +(te >= 50) : e.saga ? SWSagaObjective(e, t, y, true).won ? 3 : 0 : D ? te === 100 ? 3 : 2 : +(te >= 50),
    ...swSea ? { objective: SWSeaObjective14(e, t) } : e.saga ? { objective: SWSagaObjective(e, t, y, true) } : {},
    destruction: te,
    survivors: ne,
    frames: _,
    duration: y,
    ...swTelemetry ? { defenseStats: Object.fromEntries(Object.entries(swTelemetry).map(([key2, value]) => [key2, key2 === "wallDelaySeconds" ? Math.round(value * 4) / 4 : Math.round(value)])) } : {},
    ...swSea ? { landedTroops: i.filter((o2) => o2.landed14 && o2.kind !== "hero").length, rescuedTroops: Nl(e.army) - i.filter((o2) => o2.landed14 && o2.kind !== "hero").length, navalSurvivors: Object.fromEntries(swFleet.map((s2) => [s2.shipId, s2.hp > 0])), navalHealth: Object.fromEntries(swFleet.map((s2) => [s2.shipId, Math.max(0, s2.hp / s2.maxHp)])) } : swNaval ? { navalSurvivors: { [swNaval.shipId]: swNaval.hp > 0 }, navalHealth: { [swNaval.shipId]: Math.max(0, swNaval.hp / swNaval.maxHp) } } : {},
    ...swEnemyNavy.length ? { enemyNavalSurvivors: Object.fromEntries(swEnemyNavy.map((ship) => [ship.shipId, ship.hp > 0])), enemyNavalHealth: Object.fromEntries(swEnemyNavy.map((ship) => [ship.shipId, Math.max(0, ship.hp / ship.maxHp)])) } : {}
  };
}

// client/build17/campaign.js
var forts = [
  { outline: [[0, 0], [8, 0], [8, 8], [0, 8]], gates: [[4, 0], [0, 5], [6, 8]], keep: [4, 3], towers: [[2, 2], [6, 5]], hint: "The western gate leads past the quarry. The eastern tower covers the longer approach." },
  { outline: [[1, 0], [8, 0], [8, 7], [0, 7], [0, 2], [1, 2]], gates: [[5, 0], [0, 4], [5, 7]], keep: [5, 3], towers: [[2, 3], [6, 5]], hint: "The keep sits behind the eastern battery. The western supply court offers another way in." },
  { outline: [[0, 0], [8, 0], [8, 8], [2, 8], [2, 6], [0, 6]], gates: [[3, 0], [0, 3], [6, 8]], keep: [5, 5], towers: [[2, 2], [6, 2]], hint: "Two towers cover the northern gate. The recessed southern court gives siege troops a shorter route." },
  { outline: [[0, 0], [6, 0], [6, 2], [8, 2], [8, 8], [0, 8]], gates: [[3, 0], [0, 5], [8, 5]], keep: [3, 5], towers: [[2, 2], [6, 6]], hint: "A narrow eastern entrance opens beside the workshops. Split the guards before committing your siege crews." },
  { outline: [[0, 0], [8, 0], [8, 6], [6, 6], [6, 8], [0, 8]], gates: [[5, 0], [0, 3], [4, 8]], keep: [4, 3], towers: [[2, 5], [6, 2]], hint: "The southern bastion shields the keep. Ranged troops can support a breach through either side gate." },
  { outline: [[0, 1], [2, 1], [2, 0], [8, 0], [8, 8], [0, 8]], gates: [[5, 0], [0, 5], [5, 8]], keep: [5, 5], towers: [[3, 2], [6, 6]], hint: "The northern supply yard is lightly screened. The main gate leads into overlapping defensive fire." },
  { outline: [[0, 0], [8, 0], [8, 3], [7, 3], [7, 8], [0, 8]], gates: [[3, 0], [0, 4], [4, 8]], keep: [3, 3], towers: [[2, 6], [6, 2]], hint: "The keep is close to the western approach, but the southern battery can punish a crowded landing." },
  { outline: [[0, 0], [8, 0], [8, 8], [0, 8], [0, 5], [1, 5], [1, 2], [0, 2]], gates: [[5, 0], [8, 4], [4, 8]], keep: [5, 3], towers: [[2, 2], [6, 6]], hint: "The recessed western wall protects the supply road. Use the eastern gate to draw defenders away from the keep." },
  { outline: [[0, 0], [7, 0], [7, 2], [8, 2], [8, 8], [0, 8]], gates: [[3, 0], [0, 5], [5, 8]], keep: [3, 5], towers: [[2, 2], [6, 5]], hint: "Kingsfall has a deep southern keep. Open a breach before sending fragile ranged units through the gates." },
  { outline: [[0, 0], [8, 0], [8, 8], [1, 8], [1, 6], [0, 6]], gates: [[4, 0], [0, 3], [5, 8]], keep: [5, 4], towers: [[2, 2], [6, 6]], hint: "The throne is covered from both flanks. Preserve your siege units and use the commander when the breach opens." }
];
var seaHints = [
  "The cutter can cover a landing near the harbor. Troops stay safe aboard until you choose the beach.",
  "Protect the relief cutter while the landing force draws the shore defenders inland.",
  "The northern shore battery covers the harbor. Land farther south or silence it with your escort.",
  "A recessed shoreline offers two approaches. Move your transport before choosing the landing point.",
  "The shore battery reaches the northern beach. Draw its fire with an escort and land your siege force farther south.",
  "The flagship must fall as well as the keep. Keep your transport behind its escort until the channel opens.",
  "The relief ship must survive. Divide your fleet between protection and support for the landing force.",
  "The coastal towers cover different beaches. Break one battery to create a safe landing lane.",
  "Three enemy ships contest the coast. Focus your escort fire while the transports choose a separate landing.",
  "The fleet and the beacon stronghold both stand in your way. Preserve enough troops for the final inland push."
];
var key = (x, y) => `${x},${y}`;
function inside(point, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if (a[1] > point[1] !== b[1] > point[1] && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) result = !result;
  }
  return result;
}
function SWCampaignFort17(stage, name, level, options = {}) {
  const chapter = Math.max(0, Math.min(9, Math.floor(options.chapter ?? stage))), sea = !!options.sea;
  const plan = forts[sea ? (chapter + 3) % forts.length : chapter];
  const buildings = [];
  const occupied = /* @__PURE__ */ new Set();
  const put = (kind, x, y, axis = "x") => {
    const id = key(x, y);
    if (occupied.has(id)) return false;
    occupied.add(id);
    buildings.push({ id: `fort-${x}-${y}`, kind, x, y, level, axis });
    return true;
  };
  const gateKeys = new Set(plan.gates.map(([x, y]) => key(x, y)));
  for (let i = 0; i < plan.outline.length; i++) {
    const a = plan.outline[i], b = plan.outline[(i + 1) % plan.outline.length], dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]), length = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    for (let s = 0; s < length; s++) {
      const x = a[0] + dx * s, y = a[1] + dy * s;
      put(gateKeys.has(key(x, y)) ? "gate" : "wall", x, y, dx ? "x" : "y");
    }
  }
  const candidates = [];
  for (let x = 1; x < 8; x++) for (let y = 1; y < 8; y++) if (inside([x, y], plan.outline) && !occupied.has(key(x, y))) candidates.push([x, y]);
  const place = (kind, preferred) => {
    const spots = candidates.filter(([x, y]) => !occupied.has(key(x, y))).toSorted((a, b) => Math.hypot(a[0] - preferred[0], a[1] - preferred[1]) - Math.hypot(b[0] - preferred[0], b[1] - preferred[1]));
    if (spots.length) put(kind, spots[0][0], spots[0][1]);
  };
  place("keep", sea ? [6, chapter % 2 ? 3 : 5] : plan.keep);
  place("tower", sea ? [2, 2] : plan.towers[0]);
  place("tower", sea ? [6, 6] : plan.towers[1]);
  const extras = [["tower", 1, [1, 7]], ["mortar", 2, [6, 7]], ["bombtower", 3, [7, 1]], ["flame", 4, [4, 6]], ["bastion", 6, [1, 1]], ["bastion", 8, [7, 7]]];
  for (const [kind, at, p] of extras) if (stage >= at) place(kind, sea && kind === "bastion" ? [1, p[1]] : p);
  const economic = [["cottage", [2, 5]], ["market", [2, 7]], ["farm", [6, 6]], ["lumber", [6, 4]], ["barracks", [4, 1]], ["quarry", [1, 3]]];
  for (const [kind, p] of economic) {
    const shifted = chapter % 2 ? [8 - p[0], p[1]] : p;
    place(kind, shifted);
  }
  return { name, level, rating: 100 + stage * 140, buildings, layoutVersion17: 1, tacticalHint17: sea ? seaHints[chapter] : plan.hint };
}

// frontend/core/rules.js
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
    icon: `spear`
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
    icon: `shield`
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
    icon: `scout`
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
    icon: `bow`
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
    icon: `ram`
  },
  trebuchet: {
    name: `Trebuchets`,
    description: `Long-range siege engines. Heavy stones crush structures and damage nearby defenders.`,
    cost: bc(110, 85, 55, 65),
    hp: 115,
    damage: 46,
    range: 5.2,
    speed: 0.38,
    cooldown: 4.8,
    unlock: 5,
    maxLevel: 10,
    icon: `cannon`
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
    icon: `heart`
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
    icon: `bomb`
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
    icon: `horse`
  }
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
    benefit: `Splash damage · 5-tile range`
  },
  bombtower: {
    name: `Bomb tower`,
    description: `Throws explosives into groups at medium range.`,
    cost: bc(230, 98, 180, 65),
    time: 120,
    unlock: 3,
    max: 10,
    sprite: 19,
    benefit: `Area damage · 3.5-tile range`
  },
  flame: {
    name: `Flame turret`,
    description: `Scorches nearby attackers with rapid area damage.`,
    cost: bc(320, 90, 260, 60),
    time: 150,
    unlock: 4,
    max: 10,
    sprite: 20,
    benefit: `Close-range crowd control`
  },
  bastion: {
    name: `Bastion`,
    description: `A heavily armored defensive strongpoint with powerful crossbows.`,
    cost: bc(480, 150, 400, 100),
    time: 210,
    unlock: 5,
    max: 10,
    sprite: 21,
    benefit: `Heavy armor · 4-tile range`
  }
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
    sprite: 0
  },
  cog: {
    name: `Merchant cog`,
    description: `Large cargo holds earn gold on trading voyages.`,
    unlock: 2,
    cost: bc(260, 280, 80),
    time: 150,
    power: 25,
    sprite: 1
  },
  galley: {
    name: `War galley`,
    description: `Escort merchants and clear pirate waters.`,
    unlock: 3,
    cost: bc(440, 350, 160),
    time: 210,
    power: 48,
    sprite: 2
  },
  bombard: {
    name: `Bombard ship`,
    description: `Heavy guns open the most dangerous sea routes.`,
    unlock: 5,
    cost: bc(760, 520, 340),
    time: 300,
    power: 90,
    sprite: 3
  }
};
var Tc = {
  clear: {
    name: `Clear land`,
    description: `Remove a tree or rock; recover materials once.`,
    cost: bc(6)
  },
  road: {
    name: `Lay road`,
    description: `Connect your buildings with stone paths.`,
    cost: bc(0, 0, 3)
  },
  tree: {
    name: `Plant trees`,
    description: `Place a tree on an empty plot.`,
    cost: bc(12, 8)
  },
  rock: {
    name: `Place rock`,
    description: `Shape your landscape with stone.`,
    cost: bc(8, 0, 10)
  },
  garden: {
    name: `Plant garden`,
    description: `Create a green square between buildings.`,
    cost: bc(20, 10)
  }
};
var Ec = [
  {
    id: `coast`,
    name: `Coastal fisheries`,
    duration: 180,
    power: 0,
    unlock: 1,
    reward: bc(25, 110, 0, 65)
  },
  {
    id: `trade`,
    name: `Amber trade route`,
    duration: 480,
    power: 25,
    unlock: 2,
    reward: bc(220, 70, 40, 35)
  },
  {
    id: `pirates`,
    name: `Breakwater pirates`,
    duration: 720,
    power: 65,
    unlock: 3,
    reward: bc(330, 150, 150, 90)
  },
  {
    id: `crown`,
    name: `Crown sea passage`,
    duration: 1200,
    power: 170,
    unlock: 5,
    reward: bc(700, 280, 300, 180)
  }
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
    sprite: 0
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
    sprite: 1
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
    sprite: 2
  }
};
var kc = {
  blade: {
    name: `Tempered weapon`,
    description: `+15% commander damage`,
    cost: { gold: 100, wood: 0, stone: 40, food: 0 }
  },
  armor: {
    name: `Reinforced armor`,
    description: `+25% commander health`,
    cost: { gold: 100, wood: 0, stone: 50, food: 0 }
  },
  manual: {
    name: `Field manual`,
    description: `Stronger commander ability`,
    cost: { gold: 120, wood: 30, stone: 0, food: 0 }
  }
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
      { x: 1, y: 0 }
    ],
    reward: { gold: 100, wood: 130, stone: 40, food: 60 }
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
      { x: 5, y: 8 }
    ],
    reward: { gold: 110, wood: 60, stone: 40, food: 160 }
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
      { x: 8, y: 5 }
    ],
    reward: { gold: 180, wood: 100, stone: 180, food: 90 }
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
      { x: 8, y: 7 }
    ],
    reward: { gold: 280, wood: 160, stone: 150, food: 130 }
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
      { x: 8, y: 9 }
    ],
    reward: { gold: 400, wood: 220, stone: 250, food: 200 }
  }
];
var jc = [
  {
    id: `azure`,
    name: `Azure league banner`,
    points: 75,
    description: `Violet and silver standards for your keep and outposts.`
  },
  {
    id: `crimson`,
    name: `Crimson guard livery`,
    points: 150,
    description: `Crimson standards for your military buildings.`
  },
  {
    id: `monument`,
    name: `Victor’s standard`,
    points: 250,
    description: `An exclusive monument you can place in your capital.`
  }
];
var Mc = Date.UTC(2026, 0, 5);
var Nc = 7 * 864e5;
function Pc(e = Date.now()) {
  let t = Math.floor((e - Mc) / Nc);
  return {
    id: `week-${t}`,
    number: t + 1,
    start: Mc + t * Nc,
    end: Mc + (t + 1) * Nc
  };
}
function Ic(e) {
  return Math.min(
    4,
    1 + e.buildings.filter((e2) => e2.kind === `builder` && e2.level > 0).length
  );
}
function Lc(e) {
  return [
    ...new Set(
      e.buildings.filter((e2) => e2.readyAt).map((e2) => e2.projectId || e2.id)
    )
  ].length + Object.values(e.city?.projects || {}).filter((p) => p.readyAt).length;
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
  return Bc(t, n) || !!e.provinces?.some(
    (e2) => Ac.find((t2) => t2.id === e2.id)?.tiles.some((e3) => e3.x === t && e3.y === n)
  );
}
function Uc(e) {
  return { gold: 150 * e, wood: 90 * e, stone: 80 * e, food: 0 };
}
function Wc(e, t) {
  return e.commanders?.[t] || (t === `captain` ? { xp: 0, gear: `armor`, owned: [`armor`] } : void 0);
}
function Gc(e) {
  let t = e.commander || `captain`, n = Wc(e, t) || Wc(e, `captain`);
  return {
    id: t,
    level: Math.min(10, 1 + Math.floor(n.xp / 160)),
    gear: n.gear
  };
}
function Kc(e, t, n) {
  let r = Wc(e, t);
  r && (e.commanders = {
    ...e.commanders,
    [t]: { ...r, xp: Math.min(1440, r.xp + n) }
  });
}
function qc(e) {
  let t = Math.max(1, e.level);
  return e.specialty === `ballista` ? { damage: 26 * (1 + 0.25 * (t - 1)), range: 4.6, cooldown: 2.1 } : e.specialty === `volley` ? { damage: 9 * (1 + 0.25 * (t - 1)), range: 2.8, cooldown: 0.65 } : { damage: 12 * (1 + 0.25 * (t - 1)), range: 3.25, cooldown: 1.25 };
}
function Jc(e) {
  let t = Ac.find((t2) => t2.id === e);
  if (!t) throw Error(`Unknown province.`);
  return cl(Math.max(0, t.campaign), t.name, t.level);
}
function Zc(e, t, n = 1) {
  let r = 1 + Math.min(
    0.6,
    e.buildings.filter((e2) => e2.kind === `builder`).reduce((e2, t2) => e2 + Math.max(0, t2.level - 1) * 0.025, 0)
  );
  return Math.ceil(Math.min(14400, Sl[t].time * 1.7 ** (n - 1)) / r * (1 - SWCivicBonuses(e).buildSpeed));
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
    food: Math.round(90 * n)
  };
}
function nl(e, t = 1) {
  let n = wc[e].cost, r = 1.5 ** (t - 1);
  return Object.fromEntries(xl.map((e2) => [e2, Math.round(n[e2] * r)]));
}
function rl(e) {
  return Math.max(
    0,
    ...e.buildings.filter((e2) => e2.kind === `harbor`).map((e2) => e2.level)
  );
}
function il(e, t, n) {
  return e.terrain?.find((e2) => e2.x === t && e2.y === n);
}
function al(e, t, n) {
  return [`tree`, `rock`].includes(il(e, t, n)?.kind || ``);
}
function SWLegacyFleet13(e, t, n) {
  if (t.type === `landscape`) {
    if (!Vc(e, t.x, t.y)) throw Error(`Choose a plot inside your territory.`);
    if (e.buildings.some((e2) => e2.x === t.x && e2.y === t.y))
      throw Error(`Move the building before changing this plot.`);
    if ((e.premium?.ornaments || []).some((o) => o.x === t.x && o.y === t.y)) throw Error(`Return the decoration to your wardrobe before changing this plot.`);
    if (!Object.hasOwn(Tc, t.kind || ``))
      throw Error(`Choose a landscape tool.`);
    let n2 = t.kind, r = il(e, t.x, t.y), i = n2 === `clear` ? `grass` : n2;
    if (r?.kind === i || n2 === "clear" && !r) return true;
    return Q(e, Tc[n2].cost), n2 === `clear` && r && !r.harvested && (r.kind === `tree` && Ll(e, { gold: 0, wood: 20, stone: 0, food: 0 }), r.kind === `rock` && Ll(e, { gold: 0, wood: 0, stone: 15, food: 0 })), e.terrain = [
      ...(e.terrain || []).filter((e2) => e2.x !== t.x || e2.y !== t.y),
      { x: t.x, y: t.y, kind: i, harvested: true }
    ], true;
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
    if (!e.buildings.some((e2) => e2.kind === `barracks` && e2.level > 0))
      throw Error(`Complete a barracks first.`);
    if (Ml(e) < J[r].unlock) throw Error(`Unlock this troop first.`);
    return Q(e, tl(e, r)), e.trainingResearch = {
      kind: r,
      level: i + 1,
      readyAt: n + Math.ceil(120 * 1.7 ** (i - 1)) * 1e3
    }, true;
  }
  if (t.type === `buildShip`) {
    let r = t.kind;
    if (!Object.hasOwn(wc, r)) throw Error(`Choose a ship.`);
    let i = rl(e);
    if (i < wc[r].unlock) throw Error(`Requires a level ${wc[r].unlock} port.`);
    if ((e.fleet?.length || 0) >= Math.min(8, i + 1))
      throw Error(`Upgrade the port for another berth.`);
    if (e.fleet?.some((e2) => e2.readyAt || e2.repairReadyAt))
      throw Error(`Your shipwright is working on another vessel.`);
    return Q(e, nl(r)), e.fleet = [
      ...e.fleet || [],
      {
        id: `ship-${n}-${e.revision}`,
        kind: r,
        level: 0,
        targetLevel: 1,
        readyAt: n + wc[r].time * 1e3
      }
    ], true;
  }
  if (t.type === `upgradeShip`) {
    let r = e.fleet?.find((e2) => e2.id === t.id);
    if (!r || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt)
      throw Error(`Choose an idle, completed ship.`);
    if (r.level >= 10) throw Error(`Maximum ship level reached.`);
    if (r.level >= rl(e)) throw Error(`Upgrade the port first.`);
    if (e.fleet?.some((e2) => e2.readyAt || e2.repairReadyAt))
      throw Error(`Your shipwright is busy.`);
    return Q(e, nl(r.kind, r.level + 1)), r.targetLevel = r.level + 1, r.readyAt = n + Math.ceil(wc[r.kind].time * 1.5 ** r.level) * 1e3, true;
  }
  if (t.type === `voyage`) {
    let r = e.fleet?.find((e2) => e2.id === t.id), i = Ec.find((e2) => e2.id === t.kind);
    if (!r || !r.level || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt || !i)
      throw Error(`Choose a ready ship and sea route.`);
    if (rl(e) < i.unlock || wc[r.kind].power * (1 + 0.22 * (r.level - 1)) < i.power)
      throw Error(`This ship needs more strength for that route.`);
    let a = 1 + 0.15 * (r.level - 1);
    return r.voyage = {
      route: i.id,
      startedAt: n,
      readyAt: n + Math.ceil(i.duration * (1 - SWCivicBonuses(e).voyageSpeed)) * 1e3,
      reward: Object.fromEntries(
        xl.map((e2) => [e2, Math.round(i.reward[e2] * a)])
      )
    }, true;
  }
  if (t.type === `collectVoyage`) {
    let r = e.fleet?.find((e2) => e2.id === t.id);
    if (!r?.voyage || r.voyage.readyAt > n)
      throw Error(`This ship has not returned yet.`);
    SWRequireRoom(e, r.voyage.reward);
    return Ll(e, r.voyage.reward), delete r.voyage, true;
  }
  return false;
}
function sl(e) {
  let t = Math.max(1, e.level), n = 1 + 0.22 * (t - 1), r = e.kind === `mortar` ? { damage: 32, range: 5, cooldown: 3.2, splash: 1.15, minRange: 1.6 } : e.kind === `bombtower` ? { damage: 23, range: 3.5, cooldown: 2.1, splash: 1.05, minRange: 0 } : e.kind === `flame` ? {
    damage: 9,
    range: 2.15,
    cooldown: 0.45,
    splash: 0.65,
    minRange: 0
  } : e.kind === `bastion` ? { damage: 32, range: 4, cooldown: 1.35, splash: 0, minRange: 0 } : e.specialty === `ballista` ? {
    damage: 28,
    range: 4.6,
    cooldown: 2,
    splash: 0,
    minRange: 0
  } : e.specialty === `volley` ? {
    damage: 10,
    range: 2.8,
    cooldown: 0.65,
    splash: 0,
    minRange: 0
  } : {
    damage: 20,
    range: 3.25,
    cooldown: 1.25,
    splash: 0,
    minRange: 0
  };
  return {
    ...r,
    damage: r.damage * n,
    hp: (e.kind === `bastion` ? 620 : 320) * (1 + 0.35 * (t - 1))
  };
}
function cl(stage, name, level, options = {}) {
  return SWCampaignFort17(stage, name, level, options);
}
var ll = (e) => e.kind === `wall` || e.kind === `gate`;
var ul = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
var dl = (e, t) => `${Math.round(e)},${Math.round(t)}`;
function fl(e) {
  let t = e.buildings;
  return {
    minX: Math.min(...t.map((e2) => e2.x)) - 2,
    maxX: Math.max(...t.map((e2) => e2.x)) + 2,
    minY: Math.min(...t.map((e2) => e2.y)) - 2,
    maxY: Math.max(...t.map((e2) => e2.y)) + 2
  };
}
function pl(e, t, n) {
  if (!Number.isInteger(t) || !Number.isInteger(n)) return false;
  let r = fl(e);
  return t >= r.minX && t <= r.maxX && n >= r.minY && n <= r.maxY && (t <= r.minX + 1 || t >= r.maxX - 1 || n <= r.minY + 1 || n >= r.maxY - 1) && !e.buildings.some((e2) => Math.abs(e2.x - t) < 0.8 && Math.abs(e2.y - n) < 0.8);
}
function ml(e, t) {
  if (!Array.isArray(t) || t.length > 80)
    throw Error(`Invalid deployment orders.`);
  let n = {}, r = [], i = 0;
  for (let a of t) {
    if (!a || typeof a != `object`) throw Error(`Invalid deployment order.`);
    let t2 = a;
    if (!(t2.kind === `hero` ? e.commander : Object.hasOwn(J, t2.kind)) || !pl(e.defense, t2.x, t2.y) || !Number.isFinite(t2.time) || t2.time < i || t2.time < 0 || t2.time > 119.5)
      throw Error(`Deploy along the perimeter outside the walls at a valid time.`);
    if (n[t2.kind] = (n[t2.kind] || 0) + 1, n[t2.kind] > (t2.kind === `hero` ? 1 : e.army[t2.kind] || 0))
      throw Error(`No troops of this type remain in reserve.`);
    i = t2.time, r.push({
      kind: t2.kind,
      x: t2.x,
      y: t2.y,
      time: Math.round(t2.time * 2) / 2
    });
  }
  return r;
}
function hl(e) {
  let t = { ...wl(), ...e.army, hero: +!!e.commander };
  for (let n of e.orders || []) t[n.kind] = Math.max(0, t[n.kind] - 1);
  return t;
}
function SWMedicTarget(healer, units, assignments, time) {
  const allies = units.filter((u) => u.side === healer.side && !u.building && !u.naval && u.hp > 0 && u.id !== healer.id);
  if (!allies.length) return null;
  const fighters = allies.filter((u) => u.kind !== "healer");
  const candidates = fighters.length ? allies.filter((u) => u.kind !== "healer" || u.hp / u.maxHp < 0.45) : allies;
  const enemies = units.filter((u) => u.side !== healer.side && u.hp > 0 && u.damage > 0);
  const living = new Map(units.filter((u) => u.hp > 0).map((u) => [u.id, u]));
  const heal = 20 * (1 + 0.14 * ((healer.level || 1) - 1));
  const previous = assignments.get(healer.id);
  const frontline = /* @__PURE__ */ new Set(["infantry", "shieldbearer", "spearman", "cavalry", "knight", "ram", "hero"]);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  let winner = null, best = Infinity;
  for (const ally of candidates) {
    const missing = ally.maxHp - ally.hp, ratio = missing / ally.maxHp;
    const local = candidates.filter((u) => distance(u, ally) < 2.4);
    const groupNeed = local.reduce((sum, u) => sum + (u.maxHp - u.hp), 0);
    let incoming = 0, coverage = 0;
    for (const [medicId, assignment] of assignments) {
      if (medicId === healer.id) continue;
      const medic = living.get(medicId), target = living.get(assignment.targetId);
      if (!medic || !target || medic.side !== healer.side) continue;
      const separation = distance(target, ally);
      if (separation < 2.4) coverage += 1 - separation / 3.2;
      if (target.id === ally.id && distance(medic, ally) <= medic.range + 1 && medic.nextAttack <= time + 1)
        incoming += 20 * (1 + 0.14 * ((medic.level || 1) - 1));
    }
    const uncovered = Math.max(0, missing - incoming);
    const threatened = enemies.some((enemy) => distance(enemy, ally) <= Math.max(1, enemy.range || 0) + 0.8);
    const priority = uncovered > 1 ? uncovered / ally.maxHp * 8 + Math.min(2, uncovered / heal) * 2 : 0;
    const coveragePenalty = coverage * 9 / Math.max(1, groupNeed / (heal * 2.5));
    const incomingPenalty = incoming && missing <= incoming ? 7 : 0;
    const overheal = missing > 0 && missing < heal * 0.55 ? 2.8 : 0;
    const sticky = previous?.targetId === ally.id ? time < previous.until ? 5 : 2.2 : 0;
    const score = distance(healer, ally) * 0.75 + coveragePenalty + incomingPenalty + overheal - priority - (frontline.has(ally.kind) ? 1.5 : 0) - (threatened ? 2 : 0) - sticky;
    if (score < best - 1e-9 || Math.abs(score - best) < 1e-9 && String(ally.id) < String(winner?.id)) {
      best = score;
      winner = ally;
    }
  }
  return winner;
}
function SWNavalShips(state) {
  return (state.fleet || []).filter((ship) => ["galley", "bombard"].includes(ship.kind) && ship.level > 0 && !ship.readyAt && !ship.voyage && !ship.combatBattleId && !ship.wrecked && !ship.repairReadyAt);
}
function SWNavalStrike(input, units, time) {
  if (input.navalVersion !== 1 || !input.navalSupport || !["galley", "bombard"].includes(input.navalSupport.kind) || !Number.isFinite(input.navalAt) || input.navalAt < 0 || input.navalAt > 119.5 || time < input.navalAt) return null;
  const shore = { x: -3, y: 3 }, weapons = /* @__PURE__ */ new Set(["tower", "mortar", "bombtower", "flame", "bastion"]);
  const targets = units.filter((u) => u.side === "defend" && u.building && u.hp > 0 && (weapons.has(u.kind) || u.kind === "keep"));
  targets.sort((a, b) => (weapons.has(a.kind) ? 0 : 1) - (weapons.has(b.kind) ? 0 : 1) || Math.hypot(a.x - shore.x, a.y - shore.y) - Math.hypot(b.x - shore.x, b.y - shore.y) || (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0));
  const target = targets[0];
  if (!target) return null;
  const level = Math.max(1, Math.min(10, Math.trunc(input.navalSupport.level) || 1));
  const damage = input.navalSupport.kind === "bombard" ? 260 + 45 * level : 140 + 30 * level;
  const hits = units.filter((u) => u.side === "defend" && u.hp > 0 && Math.hypot(u.x - target.x, u.y - target.y) <= 1.25).map((unit) => ({ unit, damage: damage * (1 - Math.min(0.5, Math.hypot(unit.x - target.x, unit.y - target.y) * 0.4)) }));
  return { target, hits, shot: { x: shore.x, y: shore.y, tx: target.x, ty: target.y, side: "attack", kind: "naval" } };
}
var SWAbilityData = Object.freeze({
  infantry: [[3, "Shield drill", "10% less incoming damage."], [6, "Cleave", "Strikes one nearby enemy for 35% damage."], [9, "Veteran guard", "25% less incoming damage."]],
  archer: [[3, "Longbow", "Adds 0.35 attack range."], [6, "Quick draw", "Attack cooldown is 20% shorter."], [9, "Split volley", "Hits a second nearby enemy for 60% damage."]],
  cavalry: [[3, "Spurred charge", "Moves 12% faster."], [6, "Impact charge", "First attack deals 75% extra damage."], [9, "Tower riders", "Deals 25% extra damage to defensive weapons."]],
  cannon: [[3, "Long barrel", "Adds 0.5 attack range."], [6, "Blast shell", "Nearby enemies take 45% blast damage."], [9, "Siege ammunition", "Deals 35% extra damage to structures."]],
  spearman: [[3, "Long pikes", "Adds 0.3 attack range."], [6, "Cavalry counter", "Deals triple damage to cavalry and knights."], [9, "Braced formation", "25% less incoming damage."]],
  shieldbearer: [[3, "Reinforced shield", "Adds 15% maximum health."], [6, "Shield cover", "Nearby allies take 12% less damage."], [9, "Bulwark", "Shield protection reduces incoming damage by a further 30%."]],
  scout: [[3, "Fleet foot", "Moves 15% faster."], [6, "Supply raider", "Deals 65% extra damage to production buildings."], [9, "Relentless raids", "Attack cooldown is 30% shorter."]],
  crossbow: [[3, "Heavy bow", "Adds 0.4 attack range."], [6, "Armor piercing", "Deals 40% extra damage to armored defenders."], [9, "Precision volley", "Every third attack deals 75% extra damage."]],
  ram: [[3, "Heavy frame", "Adds 20% maximum health."], [6, "Gate breaker", "Deals sixfold damage to walls and gates."], [9, "Breach shock", "Nearby enemies take 50% impact damage."]],
  healer: [[3, "Field reach", "Adds 0.4 healing range."], [6, "Shared care", "A nearby wounded ally receives a 50% follow-up heal."], [9, "Emergency care", "Heals 40% more when a patient is below 35% health."]],
  grenadier: [[3, "Long throw", "Adds 0.35 attack range."], [6, "Shrapnel", "Wider blasts deal 90% damage to nearby enemies."], [9, "Rapid bombardment", "Attack cooldown is 25% shorter."]],
  knight: [[3, "Plate armor", "Adds 15% maximum health."], [6, "Fortress assault", "Deals 50% extra damage to defensive weapons."], [9, "Iron resolve", "Takes 25% less damage."]],
  trebuchet: [[3, "Long counterweight", "Adds 0.75 attack range."], [6, "Shattering boulder", "Wide impacts deal 65% damage to nearby enemies."], [9, "Veteran crew", "Attack cooldown is 25% shorter."]]
});
function SWTroopAbilities(kind) {
  return (SWAbilityData[kind] || []).map(([level, name, description]) => ({ level, name, description }));
}
function SWApplyTroopStats(unit) {
  const level = Math.min(10, unit.level || 1), kind = unit.kind;
  unit.abilitiesVersion = 1;
  unit.attackCount = 0;
  if (level >= 3) {
    if (["shieldbearer", "knight"].includes(kind)) unit.hp = unit.maxHp *= 1.15;
    if (kind === "ram") unit.hp = unit.maxHp *= 1.2;
    const range = { archer: 0.35, cannon: 0.5, spearman: 0.3, crossbow: 0.4, healer: 0.4, grenadier: 0.35, trebuchet: 0.75 }[kind] || 0;
    unit.range += range;
    if (kind === "cavalry") unit.speed *= 1.12;
    if (kind === "scout") unit.speed *= 1.15;
  }
  if (level >= 6 && kind === "archer") unit.cooldown *= 0.8;
  if (level >= 9 && kind === "scout") unit.cooldown *= 0.7;
  if (level >= 9 && ["grenadier", "trebuchet"].includes(kind)) unit.cooldown *= 0.75;
  return unit;
}
function SWTroopDamageFactor(attacker, target) {
  if (attacker.abilitiesVersion !== 1) return 1;
  const kind = attacker.kind, level = attacker.level || 1, weapons = ["tower", "mortar", "bombtower", "flame", "bastion"];
  let factor = 1;
  if (kind === "trebuchet" && target.building) factor *= 2.4;
  if (level >= 6) {
    if (kind === "cavalry" && attacker.attackCount === 0) factor *= 1.75;
    if (kind === "spearman" && ["cavalry", "knight"].includes(target.kind)) factor *= 1.5;
    if (kind === "scout" && ["farm", "lumber", "quarry", "market"].includes(target.kind)) factor *= 1.65;
    if (kind === "crossbow" && ["keep", "tower", "bastion", "shieldbearer", "knight"].includes(target.kind)) factor *= 1.4;
    if (kind === "ram" && ["wall", "gate"].includes(target.kind)) factor *= 1.5;
    if (kind === "knight" && weapons.includes(target.kind)) factor *= 1.5;
  }
  if (level >= 9) {
    if (kind === "cavalry" && weapons.includes(target.kind)) factor *= 1.25;
    if (kind === "cannon" && target.building) factor *= 1.35;
    if (kind === "crossbow" && (attacker.attackCount + 1) % 3 === 0) factor *= 1.75;
  }
  return factor;
}
function SWTroopIncomingFactor(unit, units) {
  let factor = 1;
  if (unit.abilitiesVersion === 1) {
    if (unit.kind === "infantry" && unit.level >= 3) factor *= unit.level >= 9 ? 0.75 : 0.9;
    if (unit.level >= 9 && ["spearman", "knight"].includes(unit.kind)) factor *= 0.75;
    if (unit.kind === "shieldbearer") factor *= unit.level >= 9 ? 0.65 * 0.7 : 0.65;
  }
  if (!unit.naval && units.some((ally) => ally.id !== unit.id && ally.hp > 0 && ally.side === unit.side && ally.kind === "shieldbearer" && ally.abilitiesVersion === 1 && ally.level >= 6 && Math.hypot(ally.x - unit.x, ally.y - unit.y) <= 1.8)) factor *= 0.88;
  return factor;
}
function SWTroopSplash(attacker, target, units) {
  if (attacker.abilitiesVersion !== 1) return [];
  const kind = attacker.kind, level = attacker.level || 1;
  let radius = 0, fraction = 0, limit = Infinity;
  if (kind === "grenadier") {
    radius = level >= 6 ? 1 : 0.7;
    fraction = level >= 6 ? 0.9 : 0.4;
  }
  if (kind === "trebuchet") {
    radius = level >= 6 ? 1.5 : 0.8;
    fraction = level >= 6 ? 0.65 : 0.3;
  }
  if (level >= 6 && kind === "infantry") {
    radius = 0.9;
    fraction = 0.35;
    limit = 1;
  }
  if (level >= 6 && kind === "cannon") {
    radius = 0.9;
    fraction = 0.45;
  }
  if (level >= 9 && kind === "archer") {
    radius = 1;
    fraction = 0.6;
    limit = 1;
  }
  if (level >= 9 && kind === "ram") {
    radius = 1.05;
    fraction = 0.5;
  }
  return units.filter((u) => u.id !== target.id && u.side !== attacker.side && u.hp > 0 && !u.naval && Math.hypot(u.x - target.x, u.y - target.y) <= radius).sort((a, b) => Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y) || (String(a.id) < String(b.id) ? -1 : 1)).slice(0, limit).map((unit) => ({ unit, fraction }));
}
function SWMedicHeals(medic, target, units) {
  let amount = 20 * (1 + 0.14 * ((medic.level || 1) - 1));
  if (medic.abilitiesVersion === 1 && medic.level >= 9 && target.hp / target.maxHp < 0.35) amount *= 1.4;
  const heals = [{ unit: target, amount }];
  if (medic.abilitiesVersion === 1 && medic.level >= 6) {
    const next = units.filter((u) => u.id !== target.id && u.id !== medic.id && u.side === medic.side && !u.building && !u.naval && u.hp > 0 && u.hp < u.maxHp && Math.hypot(u.x - target.x, u.y - target.y) <= 1.8).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp || (String(a.id) < String(b.id) ? -1 : 1))[0];
    if (next) heals.push({ unit: next, amount: amount * 0.5 });
  }
  return heals;
}
function SWNavalUnit(input) {
  const ship = input.navalSupport;
  if (input.navalVersion === 3) return SWCreateNavalUnit(ship, "attack");
  if (input.navalVersion !== 2 || !ship || !["galley", "bombard"].includes(ship.kind)) return null;
  const level = Math.max(1, Math.min(10, Math.trunc(ship.level) || 1)), bombard = ship.kind === "bombard";
  const hp = bombard ? 520 + 65 * level : 380 + 50 * level;
  return { id: "naval-" + ship.id, shipId: ship.id, side: "attack", kind: ship.kind, naval: true, building: false, x: -3, y: 3, hp, maxHp: hp, level, damage: bombard ? 90 + 18 * level : 55 + 12 * level, range: 16, speed: 0, cooldown: bombard ? 7 : 5, nextAttack: 1 };
}
function SWNavalTarget(ship, units) {
  return units.filter((u) => u.side !== ship.side && u.building && u.hp > 0 && !["wall", "gate"].includes(u.kind) && Math.hypot(u.x - ship.x, u.y - ship.y) <= ship.range).sort((a, b) => (["tower", "mortar", "bombtower", "flame", "bastion"].includes(a.kind) ? 0 : 1) - (["tower", "mortar", "bombtower", "flame", "bastion"].includes(b.kind) ? 0 : 1) || Math.hypot(a.x - ship.x, a.y - ship.y) - Math.hypot(b.x - ship.x, b.y - ship.y) || (String(a.id) < String(b.id) ? -1 : 1))[0] || null;
}
function SWEnemyNavy(defense) {
  if (!defense) return [];
  const level = Math.max(1, Math.min(10, Math.trunc(defense.level) || 1));
  return [{ id: "coastal-patrol", kind: level >= 7 ? "bombard" : "galley", level: Math.ceil(level / 2) }];
}
function SWCreateNavalUnit(ship, side, index = 0) {
  if (!ship || !["galley", "bombard"].includes(ship.kind)) return null;
  const level = Math.max(1, Math.min(10, Math.trunc(ship.level) || 1)), bombard = ship.kind === "bombard", friendly = side === "attack";
  const hp = friendly ? bombard ? 800 + 100 * level : 620 + 80 * level : bombard ? 340 + 65 * level : 250 + 55 * level;
  return { id: (friendly ? "naval-" : "enemy-naval-") + ship.id, shipId: ship.id, side, kind: ship.kind, naval: true, navalVersion: 3, building: false, x: -5 - index * 0.65, y: friendly ? 3 : -index * 1.3, hp, maxHp: hp, level, damage: friendly ? bombard ? 90 + 18 * level : 55 + 12 * level : bombard ? 26 + 6 * level : 18 + 4 * level, range: friendly ? 16 : 5.2, navalRange: 2.3, speed: bombard ? 0.34 : 0.44, cooldown: friendly ? bombard ? 7 : 5 : bombard ? 7 : 5.5, nextAttack: 1 + index * 0.5, heading: friendly ? -Math.PI / 2 : Math.PI / 2, vx: 0, vy: 0 };
}
function SWEnemyNavalUnits(input) {
  return input.navalVersion === 3 && Array.isArray(input.enemyNavy) ? input.enemyNavy.slice(0, 2).map((ship, index) => SWCreateNavalUnit(ship, "defend", index)).filter(Boolean) : [];
}
function SWLegacyNavalStep13(ship, units, time, step = 0.25) {
  ship.vx = 0;
  ship.vy = 0;
  if (ship.hp <= 0) return null;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), opponents = units.filter((u) => u.naval && u.side !== ship.side && u.hp > 0);
  opponents.sort((a, b) => distance(ship, a) - distance(ship, b) || (String(a.id) < String(b.id) ? -1 : 1));
  const rival = opponents[0], station = ship.side === "attack" ? { x: -3, y: 3 } : { x: -3.2, y: 0.8 };
  const destination = rival || station, desired = rival ? ship.navalRange * 0.92 : 0.06, gap = distance(ship, destination);
  let dx = 0, dy = 0;
  if (gap > desired) {
    const stride = Math.min(ship.speed * step, gap - desired);
    dx = (destination.x - ship.x) / gap * stride;
    dy = (destination.y - ship.y) / gap * stride;
  } else if (rival && gap > 0.1) {
    const stride = ship.speed * step * 0.3;
    dx = -(rival.y - ship.y) / gap * stride;
    dy = (rival.x - ship.x) / gap * stride;
  }
  if (dx || dy) {
    const x = Math.max(-6.5, Math.min(rival ? -4.9 : -3, ship.x + dx)), y = Math.max(-1.5, Math.min(5.5, ship.y + dy));
    ship.vx = (x - ship.x) / step;
    ship.vy = (y - ship.y) / step;
    ship.x = x;
    ship.y = y;
  }
  let target = rival;
  if (!rival) {
    if (ship.side === "attack") target = SWNavalTarget(ship, units);
    else target = units.filter((u) => u.side !== ship.side && !u.naval && !u.building && u.hp > 0 && distance(ship, u) <= ship.range).sort((a, b) => distance(ship, a) - distance(ship, b) || (String(a.id) < String(b.id) ? -1 : 1))[0] || null;
  }
  if (ship.vx || ship.vy) ship.heading = Math.atan2(ship.vy, ship.vx);
  else if (target) ship.heading = Math.atan2(target.y - ship.y, target.x - ship.x);
  if (!target || distance(ship, target) > (target.naval ? ship.navalRange : ship.range) || time < ship.nextAttack) return null;
  if (!target.naval && distance(ship, station) > 0.4) return null;
  ship.nextAttack = time + ship.cooldown;
  const damage = ship.damage * (!target.naval && !target.building ? 0.45 : 1);
  return { target, damage, splash: ship.kind === "bombard" && !target.naval ? units.filter((u) => u.id !== target.id && u.side !== ship.side && !u.naval && u.hp > 0 && distance(u, target) <= 1.15).map((unit) => ({ unit, damage: damage * 0.35 })) : [], shot: { x: ship.x, y: ship.y, tx: target.x, ty: target.y, side: ship.side, kind: "naval", navalVersion: 3, sourceId: ship.id, targetId: target.id, impact: target.naval ? "ship" : target.building ? "structure" : "troop", heading: Math.atan2(target.y - ship.y, target.x - ship.x) } };
}
var _l = (e) => e.kind === `wall` || e.kind === `gate`;
var vl = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
var yl = (e, t) => `${Math.round(e)},${Math.round(t)}`;
function bl(e) {
  let t = [], n = e.seed >>> 0, r = () => (n = 1664525 * n + 1013904223 >>> 0, n / 4294967296);
  for (let n2 of e.defense.buildings) {
    let e2 = (n2.kind === `keep` ? 420 : n2.kind === `tower` ? 135 : n2.kind === `wall` ? 230 : n2.kind === `gate` ? 185 : 95) * (1 + (n2.level - 1) * 0.45), i2 = qc(n2);
    t.push({
      id: n2.id,
      side: `defend`,
      kind: n2.kind,
      x: n2.x,
      y: n2.y,
      hp: e2,
      maxHp: e2,
      damage: n2.kind === `tower` ? i2.damage : n2.kind === `keep` ? 6 : 0,
      range: n2.kind === `tower` ? i2.range : 2.1,
      speed: 0,
      cooldown: n2.kind === `tower` ? i2.cooldown : 1.65,
      nextAttack: r(),
      building: true,
      level: n2.level,
      specialty: n2.specialty
    });
  }
  let i = {
    left: { x: -1, y: 6 },
    center: { x: 8, y: 8 },
    right: { x: 8, y: -1 }
  }, a = 0, o = { left: 0, center: 0, right: 0 };
  for (let n2 of Object.keys(J)) {
    let s2 = J[n2], c2 = e.deployments?.[n2] || e.front, l2 = i[c2];
    for (let i2 = 0; i2 < e.army[n2]; i2++) {
      let i3 = o[c2]++, u2 = (i3 % 4 - 1.5) * 0.38, d2 = Math.floor(i3 / 4) * 0.35;
      t.push({
        id: `a-${a++}`,
        side: `attack`,
        kind: n2,
        x: l2.x + u2 + (c2 === `left` ? -d2 : c2 === `center` ? d2 : 0),
        y: l2.y + u2 + (c2 === `right` ? -d2 : c2 === `center` ? d2 : 0),
        hp: s2.hp,
        maxHp: s2.hp,
        damage: s2.damage * e.bonus,
        range: s2.range,
        speed: s2.speed,
        cooldown: s2.cooldown,
        nextAttack: r() * 0.7,
        building: false,
        level: 1
      });
    }
  }
  if (e.commander) {
    let n2 = e.commander, r2 = Oc[n2.id], a2 = i[e.front], o2 = r2.hp * (1 + (n2.level - 1) * 0.15) * (n2.gear === `armor` ? 1.25 : 1);
    t.push({
      id: `commander`,
      side: `attack`,
      kind: `hero`,
      commander: n2.id,
      x: a2.x - 0.45,
      y: a2.y + 0.45,
      hp: o2,
      maxHp: o2,
      damage: r2.damage * (1 + (n2.level - 1) * 0.12) * (n2.gear === `blade` ? 1.15 : 1) * e.bonus,
      range: r2.range,
      speed: r2.speed,
      cooldown: 1.1,
      nextAttack: 0,
      building: false,
      level: n2.level
    });
  }
  for (let n2 of t.filter((e2) => e2.side === `attack`)) {
    let r2 = n2.kind === `hero` ? e.front : e.deployments?.[n2.kind] || e.front;
    for (let e2 = 0; e2 < 20 && t.some(
      (e3) => e3.building && Math.abs(e3.x - n2.x) < 0.7 && Math.abs(e3.y - n2.y) < 0.7
    ); e2++)
      r2 === `left` ? n2.x -= 0.75 : r2 === `right` ? n2.y -= 0.75 : (n2.x += 0.75, n2.y += 0.75);
  }
  let s = new Map(t.filter((e2) => e2.building).map((e2) => [yl(e2.x, e2.y), e2])), c = Math.min(
    5,
    1 + e.defense.buildings.filter((e2) => e2.kind === `barracks`).length * 2 + Math.max(0, e.defense.level - 1)
  );
  for (let n2 = 0; n2 < c; n2++) {
    let i2 = [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 2 },
      { x: 1, y: 3 }
    ].find((e2) => !s.has(yl(e2.x, e2.y))) || { x: 0, y: 3 };
    t.push({
      id: `guard-${n2}`,
      side: `defend`,
      kind: `infantry`,
      x: i2.x + n2 % 2 * 0.23,
      y: i2.y + Math.floor(n2 / 2) * 0.18,
      hp: 65 + e.defense.level * 10,
      maxHp: 65 + e.defense.level * 10,
      damage: 7 + e.defense.level,
      range: 0.85,
      speed: 0.8,
      cooldown: 1.4,
      nextAttack: r(),
      building: false,
      level: e.defense.level
    });
  }
  let l = /* @__PURE__ */ new Map(), u = 0, d = /* @__PURE__ */ new Map(), f = (e2, t2) => {
    let n2 = s.get(yl(e2, t2));
    return n2 && n2.hp > 0 ? n2 : void 0;
  }, p = (e2, t2, n2, r2 = false) => {
    if (n2 > 1.3) return true;
    let i2 = vl(e2, t2), a2 = Math.ceil(i2 * 5);
    for (let n3 = 1; n3 < a2; n3++) {
      let i3 = f(e2.x + (t2.x - e2.x) * n3 / a2, e2.y + (t2.y - e2.y) * n3 / a2);
      if (i3 && i3.id !== t2.id && !(r2 && _l(i3))) return false;
    }
    return true;
  }, m = (e2, t2) => {
    let n2 = { x: Math.round(e2.x), y: Math.round(e2.y) }, r2 = `${u}:${e2.id}:${yl(n2.x, n2.y)}:${t2.id}:${yl(t2.x, t2.y)}`, i2 = d.get(r2);
    if (i2) return i2;
    let a2 = [n2], o2 = /* @__PURE__ */ new Map([[yl(n2.x, n2.y), 0]]), s2 = /* @__PURE__ */ new Map(), c2, l2 = (n3) => Math.max(0, vl(n3, t2) - e2.range - (t2.building ? 0.35 : 0));
    for (let n3 = 0; a2.length && n3 < 400; n3++) {
      let n4 = 0;
      for (let e3 = 1; e3 < a2.length; e3++)
        o2.get(yl(a2[e3].x, a2[e3].y)) + l2(a2[e3]) < o2.get(yl(a2[n4].x, a2[n4].y)) + l2(a2[n4]) && (n4 = e3);
      let r3 = a2.splice(n4, 1)[0], i3 = yl(r3.x, r3.y);
      if (vl(r3, t2) <= e2.range + (t2.building ? 0.35 : 0) && p(r3, t2, e2.range, e2.side === `attack`)) {
        c2 = r3;
        break;
      }
      for (let [t3, n5] of [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1]
      ]) {
        let c3 = { x: r3.x + t3, y: r3.y + n5 };
        if (c3.x < -5 || c3.y < -5 || c3.x > 14 || c3.y > 14) continue;
        let l3 = f(c3.x, c3.y), u2 = 0;
        if (l3)
          if (e2.side === `defend` && l3.kind === `gate`) u2 = 0;
          else if (e2.side === `attack` && _l(l3))
            u2 = l3.hp / Math.max(10, e2.damage) * 0.35;
          else continue;
        let d2 = yl(c3.x, c3.y), p2 = o2.get(i3) + 1 + u2;
        p2 < (o2.get(d2) ?? 1 / 0) && (o2.set(d2, p2), s2.set(d2, r3), a2.some((e3) => e3.x === c3.x && e3.y === c3.y) || a2.push(c3));
      }
    }
    let m2 = [];
    if (c2) {
      let e3 = c2;
      for (let t3 = 0; t3 < 210 && yl(e3.x, e3.y) !== yl(n2.x, n2.y); t3++) {
        m2.unshift(e3);
        let t4 = s2.get(yl(e3.x, e3.y));
        if (!t4) break;
        e3 = t4;
      }
    }
    return d.set(r2, m2), m2;
  }, h = (e2, t2) => {
    let n2 = `${u}:${t2.id}:${yl(t2.x, t2.y)}`, r2 = l.get(e2.id);
    if (r2?.signature === n2 && r2.points.length) return r2.points;
    let i2 = m(e2, t2).map((e3) => ({ ...e3 })), a2 = { x: Math.round(e2.x), y: Math.round(e2.y) };
    return i2.length && vl(a2, e2) > 0.05 && !f(a2.x, a2.y) && i2.unshift(a2), l.set(e2.id, { signature: n2, points: i2 }), i2;
  }, g = [], _ = [], v = 0, y = false, b = false, x = -1, S = t.find((e2) => e2.kind === `hero`), C = (e2, t2) => {
    if (e2.hp <= 0) return;
    e2.side === `attack` && v < x && S && S.hp > 0 && vl(e2, S) < 3.6 && (t2 *= 0.35);
    let n2 = e2.hp;
    e2.hp = Math.max(0, n2 - t2), n2 > 0 && e2.hp === 0 && e2.building && (u++, d.clear());
  }, w = (t2, n2) => {
    if (v < t2.nextAttack) return;
    let r2 = t2.damage * (t2.kind === `cannon` && n2.building ? 2 : 1);
    t2.side === `attack` && n2.building && (r2 *= e.structureBonus || 1), t2.side === `attack` && y && v < (e.rallyAt || 0) + 7 && (r2 *= 1.3), C(n2, r2), t2.nextAttack = v + t2.cooldown, _.push({
      x: t2.x,
      y: t2.y,
      tx: n2.x,
      ty: n2.y,
      side: t2.side,
      kind: t2.kind === `hero` ? t2.commander === `ranger` ? `archer` : t2.commander === `engineer` ? `cannon` : `infantry` : t2.kind
    });
  }, T = t.filter((e2) => e2.building && !_l(e2)).length;
  for (let n2 = 0; n2 <= 360; n2++) {
    if (v = n2 * 0.25, e.rallyAt !== void 0 && !y && v >= e.rallyAt) {
      for (let e2 of t.filter((e3) => e3.side === `attack` && e3.hp > 0))
        e2.hp = Math.min(e2.maxHp, e2.hp + e2.maxHp * 0.3);
      y = true;
    }
    if (S && S.hp > 0 && e.heroAt !== void 0 && !b && v >= e.heroAt) {
      b = true;
      let n3 = e.commander?.gear === `manual` ? 1.4 : 1;
      if (S.commander === `captain`) {
        x = v + 8 * n3;
        for (let e2 of t.filter(
          (e3) => e3.side === `attack` && e3.hp > 0 && vl(e3, S) < 3.6
        ))
          e2.hp = Math.min(e2.maxHp, e2.hp + e2.maxHp * 0.18 * n3);
      } else {
        let e2 = t.filter(
          (e3) => e3.side === `defend` && e3.hp > 0 && (S.commander === `ranger` || _l(e3) || e3.kind === `tower`)
        ).sort(
          (e3, t2) => vl(e3, S) + (e3.kind === `tower` ? -3 : 0) - (vl(t2, S) + (t2.kind === `tower` ? -3 : 0))
        );
        for (let t2 of e2.slice(0, S.commander === `engineer` ? 1 : 3))
          C(
            t2,
            (S.commander === `engineer` ? 200 + S.level * 40 : 80 + S.level * 15) * n3
          ), _.push({
            x: S.x,
            y: S.y,
            tx: t2.x,
            ty: t2.y,
            side: `attack`,
            kind: S.commander === `engineer` ? `cannon` : `archer`
          });
      }
    }
    let r2 = t.filter((e2) => e2.hp > 0);
    for (let t2 of r2) {
      if (t2.hp <= 0 || !t2.damage) continue;
      let n3 = r2.filter(
        (e2) => e2.side !== t2.side && e2.hp > 0 && (t2.side !== `attack` || !_l(e2))
      );
      if (!n3.length) continue;
      n3.sort(
        (e2, n4) => vl(t2, e2) + (t2.kind === `cannon` && !e2.building ? 3 : 0) - (vl(t2, n4) + (t2.kind === `cannon` && !n4.building ? 3 : 0))
      );
      let i3 = n3[0];
      if (t2.building) {
        let e2 = n3.find((e3) => vl(t2, e3) <= t2.range);
        e2 && w(t2, e2);
        continue;
      }
      if (vl(t2, i3) <= t2.range + (i3.building ? 0.35 : 0) && p(t2, i3, t2.range)) {
        w(t2, i3);
        continue;
      }
      let a3 = h(t2, i3);
      if (!a3.length) {
        for (let e2 of n3.slice(1, 5))
          if (a3 = h(t2, e2), a3.length) {
            i3 = e2;
            break;
          }
      }
      if (!a3.length) continue;
      let o3 = a3[0], s2 = f(o3.x, o3.y), c2 = o3, l2 = 0;
      if (s2 && t2.side === `attack` && _l(s2)) {
        if (vl(t2, s2) <= t2.range + 0.35) {
          w(t2, s2);
          continue;
        }
        c2 = s2, l2 = t2.range + 0.3;
      }
      let u2 = c2.x - t2.x, d2 = c2.y - t2.y, m2 = Math.hypot(u2, d2), g2 = t2.speed * 0.25 * (t2.side === `attack` && y && v < (e.rallyAt || 0) + 7 ? 1.25 : 1), _2 = Math.max(0, Math.min(g2, m2 - l2));
      m2 && (t2.x += u2 / m2 * _2, t2.y += d2 / m2 * _2, vl(t2, o3) < 0.025 && a3.shift());
    }
    let i2 = t.filter((e2) => !e2.building && e2.hp > 0);
    for (let e2 = 0; e2 < i2.length; e2++)
      for (let t2 = e2 + 1; t2 < i2.length; t2++) {
        let n3 = i2[e2], r3 = i2[t2], a3 = n3.x - r3.x, o3 = n3.y - r3.y, s2 = Math.hypot(a3, o3);
        if (s2 > 1e-3 && s2 < 0.38) {
          let e3 = (0.38 - s2) * 0.16;
          for (let [t3, i3] of [
            [n3, 1],
            [r3, -1]
          ]) {
            let n4 = t3.x + a3 / s2 * e3 * i3, r4 = t3.y + o3 / s2 * e3 * i3, c2 = f(n4, r4);
            (!c2 || t3.side === `defend` && c2.kind === `gate`) && (t3.x = n4, t3.y = r4);
          }
        }
      }
    let a2 = t.filter((e2) => e2.building && !_l(e2) && e2.hp > 0).length, o2 = Math.round((T - a2) / Math.max(1, T) * 100);
    if (n2 % 2 == 0 && (g.push({ time: v, units: jl(t), shots: _, destruction: o2 }), _ = []), !t.some((e2) => e2.side === `attack` && e2.hp > 0) || a2 === 0)
      break;
  }
  let ee = t.find((e2) => e2.kind === `keep` && e2.building), E = !!ee && ee.hp <= 0, D = Math.round(
    t.filter((e2) => e2.building && !_l(e2) && e2.hp <= 0).length / Math.max(1, T) * 100
  ), te = { infantry: 0, archer: 0, cavalry: 0, cannon: 0 };
  for (let e2 of t)
    e2.side === `attack` && e2.hp > 0 && Object.hasOwn(te, e2.kind) && te[e2.kind]++;
  return g.push({ time: v, units: jl(t), shots: _, destruction: D }), {
    won: E,
    stars: E ? D === 100 ? 3 : 2 : +(D >= 50),
    destruction: D,
    survivors: te,
    frames: g,
    duration: v
  };
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
    benefit: `Unlocks the next age`
  },
  farm: {
    name: `Farm`,
    description: `Fields and a granary to feed a growing army.`,
    cost: { gold: 55, wood: 49, stone: 0, food: 32 },
    time: 35,
    unlock: 1,
    max: 10,
    sprite: 1,
    benefit: `+24 provisions / min`
  },
  lumber: {
    name: `Sawmill`,
    description: `Turn the valley’s timber into building materials.`,
    cost: { gold: 55, wood: 0, stone: 35, food: 35 },
    time: 35,
    unlock: 1,
    max: 10,
    sprite: 2,
    benefit: `+28 timber / min`
  },
  quarry: {
    name: `Quarry`,
    description: `Cut stone for towers, upgrades, and a greater keep.`,
    cost: { gold: 65, wood: 52, stone: 0, food: 35 },
    time: 45,
    unlock: 1,
    max: 10,
    sprite: 3,
    benefit: `+16 stone / min`
  },
  barracks: {
    name: `Barracks`,
    description: `Train thirteen troop classes. Each level adds six army slots.`,
    cost: { gold: 90, wood: 64, stone: 40, food: 42 },
    time: 60,
    unlock: 1,
    max: 10,
    sprite: 4,
    benefit: `+6 army capacity`
  },
  forge: {
    name: `Foundry`,
    description: `Improve every soldier’s attack and unlock siege cannons.`,
    cost: { gold: 160, wood: 75, stone: 110, food: 50 },
    time: 90,
    unlock: 2,
    max: 10,
    sprite: 5,
    benefit: `+10% army attack / level`
  },
  tower: {
    name: `Watchtower`,
    description: `An automatic ranged defense. Position it to cover your keep.`,
    cost: { gold: 80, wood: 49, stone: 80, food: 32 },
    time: 45,
    unlock: 1,
    max: 10,
    sprite: 6,
    benefit: `Defends a 3-tile radius`
  },
  cottage: {
    name: `Cottage`,
    description: `A home for eight villagers. Each level adds residents and tax income.`,
    cost: { gold: 45, wood: 45, stone: 20, food: 30 },
    time: 35,
    unlock: 1,
    max: 10,
    sprite: 8,
    benefit: `+8 residents · +4 gold / min`
  },
  market: {
    name: `Marketplace`,
    description: `Trade surplus food for timber, stone, or gold. Merchants also provide steady tax income.`,
    cost: { gold: 100, wood: 68, stone: 45, food: 45 },
    time: 60,
    unlock: 1,
    max: 10,
    sprite: 9,
    benefit: `+10 gold / min`
  },
  harbor: {
    name: `Shipyard`,
    description: `Build on a coastal berth beside your capital. Launch ships from its pier and collect returning cargo.`,
    cost: { gold: 180, wood: 105, stone: 80, food: 70 },
    time: 120,
    unlock: 1,
    max: 10,
    sprite: 7,
    benefit: `+28 gold / min · +500 storage`
  },
  builder: {
    name: `Builder’s lodge`,
    description: `An additional permanent construction crew. Upgrades improve construction speed. Up to three lodges.`,
    cost: { gold: 180, wood: 90, stone: 60, food: 60 },
    time: 90,
    unlock: 1,
    max: 10,
    sprite: 10,
    benefit: `+1 permanent builder`
  },
  wall: {
    name: `Stone walls`,
    description: `Drag across plots to draw a wall. Troops must go around or breach it.`,
    cost: { gold: 4, wood: 0, stone: 8, food: 0 },
    time: 45,
    unlock: 1,
    max: 10,
    sprite: 11,
    benefit: `Shape enemy routes`
  },
  gate: {
    name: `Fortified gate`,
    description: `Your people pass through; attackers must break it.`,
    cost: { gold: 15, wood: 15, stone: 15, food: 0 },
    time: 45,
    unlock: 1,
    max: 10,
    sprite: 13,
    benefit: `Friendly passage · enemy barrier`
  },
  monument: {
    name: `Victor’s standard`,
    description: `A capital landmark earned in the weekly league.`,
    cost: { gold: 80, wood: 0, stone: 50, food: 0 },
    time: 60,
    unlock: 1,
    max: 10,
    sprite: 17,
    benefit: `Your league legacy`
  },
  ...Sc
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
    icon: `shield`
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
    icon: `bow`
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
    icon: `horse`
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
    icon: `cannon`
  },
  ...xc
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
    y: 68
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
    y: 52
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
    y: 34
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
    y: 57
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
    y: 22
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
    y: 50
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
    y: 50
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
    y: 50
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
    y: 50
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
    y: 50
  }
];
var El = [
  {
    id: `quarry`,
    title: `Lay the foundations`,
    text: `Build a quarry to supply your growing capital.`,
    reward: { gold: 100, wood: 80, stone: 60, food: 60 },
    check: (e) => e.buildings.some((e2) => e2.kind === `quarry` && e2.level > 0)
  },
  {
    id: `barracks`,
    title: `Raise your banner`,
    text: `Complete a barracks to recruit your first army.`,
    reward: { gold: 100, wood: 60, stone: 50, food: 150 },
    check: (e) => e.buildings.some((e2) => e2.kind === `barracks` && e2.level > 0)
  },
  {
    id: `army`,
    title: `Ready for the frontier`,
    text: `Recruit at least six soldiers.`,
    reward: { gold: 100, wood: 50, stone: 50, food: 100 },
    check: (e) => Nl(e.army) >= 6
  },
  {
    id: `victory`,
    title: `Beyond the gates`,
    text: `Capture Briarwatch in the campaign.`,
    reward: { gold: 150, wood: 120, stone: 100, food: 100 },
    check: (e) => e.campaign > 0
  },
  {
    id: `age2`,
    title: `A kingdom in stone`,
    text: `Upgrade your keep to level 2.`,
    reward: { gold: 180, wood: 160, stone: 150, food: 140 },
    check: (e) => Ml(e) >= 2
  },
  {
    id: `forge`,
    title: `The age of gunpowder`,
    text: `Build a foundry and unlock your first cannons.`,
    reward: { gold: 200, wood: 120, stone: 100, food: 160 },
    check: (e) => e.buildings.some((e2) => e2.kind === `forge` && e2.level > 0)
  },
  {
    id: `frontier`,
    title: `Claim the frontier`,
    text: `Capture the first five campaign strongholds.`,
    reward: { gold: 400, wood: 300, stone: 300, food: 300 },
    check: (e) => e.campaign >= 5
  }
];
var Dl = [
  {
    id: `foundation`,
    title: `Solid foundations`,
    description: `Complete your first quarry.`,
    icon: `hammer`,
    target: 1,
    value: (e) => e.buildings.filter((e2) => e2.kind === `quarry` && e2.level > 0).length,
    reward: { gold: 60, wood: 40, stone: 30, food: 0 }
  },
  {
    id: `banner`,
    title: `A banner to follow`,
    description: `Complete your first barracks.`,
    icon: `flag`,
    target: 1,
    value: (e) => e.buildings.filter((e2) => e2.kind === `barracks` && e2.level > 0).length,
    reward: { gold: 60, wood: 0, stone: 0, food: 80 }
  },
  {
    id: `first_victory`,
    title: `First conquest`,
    description: `Capture Briarwatch.`,
    icon: `swords`,
    target: 1,
    value: (e) => e.campaign,
    reward: { gold: 100, wood: 50, stone: 50, food: 50 }
  },
  {
    id: `town`,
    title: `From village to town`,
    description: `Complete eight buildings.`,
    icon: `castle`,
    target: 8,
    value: (e) => e.buildings.filter((e2) => e2.level > 0 && !zc(e2)).length,
    reward: { gold: 100, wood: 80, stone: 60, food: 0 }
  },
  {
    id: `defense`,
    title: `Standing guard`,
    description: `Complete two watchtowers.`,
    icon: `shield`,
    target: 2,
    value: (e) => e.buildings.filter((e2) => e2.kind === `tower` && e2.level > 0).length,
    reward: { gold: 80, wood: 0, stone: 100, food: 0 }
  },
  {
    id: `age`,
    title: `A new age`,
    description: `Advance your keep to level 2.`,
    icon: `crown`,
    target: 2,
    value: (e) => Ml(e),
    reward: { gold: 150, wood: 80, stone: 80, food: 60 }
  },
  {
    id: `forge`,
    title: `Fire and iron`,
    description: `Complete a foundry.`,
    icon: `flame`,
    target: 1,
    value: (e) => e.buildings.filter((e2) => e2.kind === `forge` && e2.level > 0).length,
    reward: { gold: 120, wood: 60, stone: 60, food: 60 }
  },
  {
    id: `people`,
    title: `A place to call home`,
    description: `Grow your population to 50.`,
    icon: `users`,
    target: 50,
    value: (e) => zl(e),
    reward: { gold: 150, wood: 100, stone: 0, food: 100 }
  },
  {
    id: `veteran`,
    title: `Battle tested`,
    description: `Win five battles.`,
    icon: `trophy`,
    target: 5,
    value: (e) => e.wins,
    reward: { gold: 180, wood: 80, stone: 80, food: 100 }
  },
  {
    id: `crown`,
    title: `Crown of the frontier`,
    description: `Capture all five strongholds.`,
    icon: `crown`,
    target: 5,
    value: (e) => e.campaign,
    reward: { gold: 300, wood: 150, stone: 150, food: 150 }
  },
  {
    id: `shipwright`,
    title: `A seafaring realm`,
    description: `Complete your first ship.`,
    icon: `flag`,
    target: 1,
    value: (e) => (e.fleet || []).filter((e2) => e2.level > 0).length,
    reward: { gold: 80, wood: 100, stone: 0, food: 40 }
  },
  {
    id: `armada`,
    title: `Admiral of the coast`,
    description: `Build a fleet of four ships.`,
    icon: `crown`,
    target: 4,
    value: (e) => (e.fleet || []).filter((e2) => e2.level > 0).length,
    reward: { gold: 350, wood: 200, stone: 100, food: 200 }
  },
  {
    id: `citadel`,
    title: `A capital in stone`,
    description: `Reach keep level 5.`,
    icon: `crown`,
    target: 5,
    value: (e) => Ml(e),
    reward: { gold: 800, wood: 500, stone: 500, food: 300 }
  },
  {
    id: `master_troop`,
    title: `The finest in the realm`,
    description: `Upgrade a troop class to level 10.`,
    icon: `swords`,
    target: 10,
    value: (e) => Math.max(1, ...Object.values(e.unitLevels || {}).map((e2) => e2 || 1)),
    reward: { gold: 1200, wood: 800, stone: 800, food: 1e3 }
  },
  {
    id: `imperial`,
    title: `An imperial capital`,
    description: `Reach keep level 10.`,
    icon: `crown`,
    target: 10,
    value: (e) => Ml(e),
    reward: { gold: 3e3, wood: 2e3, stone: 2e3, food: 2e3 }
  },
  {
    id: `throne`,
    title: `The Imperial Throne`,
    description: `Conquer all ten campaign strongholds.`,
    icon: `trophy`,
    target: 10,
    value: (e) => e.campaign,
    reward: { gold: 2200, wood: 1200, stone: 1200, food: 1200 }
  }
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
      { id: `market`, kind: `market`, x: 5, y: 5, level: 1 }
    ],
    army: wl(),
    terrain: [
      { x: 0, y: 3, kind: `tree` },
      { x: 1, y: 4, kind: `tree` },
      { x: 6, y: 2, kind: `rock` },
      { x: 4, y: 6, kind: `rock` }
    ],
    fleet: [],
    lastTick: e,
    campaign: 0,
    wins: 0,
    rating: 100,
    quests: [],
    published: false,
    activeBattle: null,
    revision: 0,
    research: 0
  };
}
function jl(e) {
  return JSON.parse(JSON.stringify(e));
}
function Ml(e) {
  return e.buildings.find((e2) => e2.kind === `keep`)?.level || 1;
}
function Nl(e) {
  return Object.values(e).reduce((e2, t) => e2 + t, 0);
}
function Pl(e) {
  return Math.min(
    72,
    6 + 4 * (e.provinces?.find((e2) => e2.id === `highmarch`)?.level || 0) + e.buildings.filter((e2) => e2.kind === `barracks`).reduce((e2, t) => e2 + t.level * 6, 0)
  );
}
function Fl(e) {
  return SWCapacity(e);
}
function Il(e, now = Date.now()) {
  const income = { gold: 6, wood: 2, stone: 2, food: 4 }, land = SWLandStats(e), connected = new Set(land.connectedIds);
  for (const b of e.buildings) {
    if (!b.level) continue;
    const roads = connected.has(b.id) ? 1.1 : 1, level = b.level;
    if (b.kind === "farm") income.food += 24 * level * roads;
    if (b.kind === "lumber") income.wood += 28 * level * roads;
    if (b.kind === "quarry") income.stone += 16 * level * roads;
    if (b.kind === "keep") income.gold += 8 * level;
    if (b.kind === "harbor") income.gold += 4 * level * roads;
    if (b.kind === "cottage") income.gold += 4 * level * roads * (1 + land.gardenBonus);
    if (b.kind === "market") income.gold += 10 * level * roads;
  }
  const renown = SWCampaignProgress17(e).total;
  if (renown >= 2) income.wood += 8;
  if (renown >= 3) income.stone += 8;
  if (renown >= 4) income.gold += 12;
  for (const province of e.provinces || []) {
    const spec = Ac.find((p) => p.id === province.id);
    if (spec) income[spec.resource] += spec.income * province.level;
  }
  const civicBonus = 1 + Math.min(0.2, SWCivicLevel(e, "well") * 0.02) + ((e.city?.festivalUntil || 0) > now ? 0.15 : 0);
  const projects = SWCivicBonuses(e);
  income.gold *= 1 + projects.goldIncome;
  income.food *= 1 + projects.foodIncome;
  for (const resource of xl) income[resource] *= civicBonus;
  return income;
}
function SWLegacyY13(e, t = Date.now()) {
  let n = jl(e);
  SWMigrateCoast(n);
  SWMigrateStorage(n);
  SWMigratePremium(n);
  SWCityTick(n, t);
  SWMigrateRaids(n, t);
  if (!n.gemVersion) {
    n.gemVersion = 1;
    n.gems = 100;
  }
  n.gems = Number.isSafeInteger(n.gems) && n.gems >= 0 ? n.gems : 0;
  if (!n.balanceVersion) {
    for (let e2 of Object.values(n.commanders || {}))
      e2 && (e2.xp = Math.min(1440, Math.round(e2.xp * 1.6)));
    n.balanceVersion = 2;
  }
  n.army = { ...wl(), ...n.army }, n.unitLevels ||= {}, n.fleet ||= [], n.terrain ||= [], n.trainingResearch && n.trainingResearch.readyAt <= t && (n.unitLevels[n.trainingResearch.kind] = n.trainingResearch.level, delete n.trainingResearch);
  for (const ship of n.fleet) if (ship.combatBattleId && ship.combatBattleId !== n.activeBattle) delete ship.combatBattleId;
  for (let e2 of n.fleet)
    e2.readyAt && e2.readyAt <= t && (e2.level = e2.targetLevel || 1, delete e2.readyAt, delete e2.targetLevel);
  let r = Math.max(n.lastTick, t), i = Math.max(n.lastTick, r - 8 * 36e5), a = n.buildings.filter((e2) => e2.readyAt && e2.readyAt <= r).map((e2) => e2.readyAt).sort((e2, t2) => e2 - t2);
  for (const project of Object.values(n.city?.projects || {})) if (project.readyAt && project.readyAt <= r) a.push(project.readyAt);
  if (n.city?.festivalUntil > i && n.city.festivalUntil < r) a.push(n.city.festivalUntil);
  a.sort((a2, b) => a2 - b);
  for (let e2 of [...a, r]) {
    let t2 = Math.max(i, e2), r2 = Il(n, i), a2 = Fl(n);
    for (let e3 of xl)
      n.resources[e3] = Math.min(a2, n.resources[e3] + r2[e3] * (t2 - i) / 6e4);
    for (let e3 of n.buildings)
      e3.readyAt && e3.readyAt <= t2 && (e3.level = e3.targetLevel || 1, delete e3.readyAt, delete e3.targetLevel, delete e3.projectId);
    SWCivicTick(n, t2);
    SWMigrateRaids(n, t2);
    i = t2;
  }
  n.lastTick = r;
  let o = Pc(t);
  return n.season?.id !== o.id && (n.season = { id: o.id, points: 0, wins: 0, losses: 0 }), n;
}
function SWStorageContribution(level) {
  return level > 0 ? Math.round(800 * Math.pow(1.5, Math.min(10, level) - 1)) : 0;
}
function SWCapacity(state) {
  return 500 + 250 * Ml(state) + state.buildings.filter((b) => b.kind === "storehouse").reduce((sum, b) => sum + SWStorageContribution(b.level), 0);
}
function SWBuildingCount(state, kind) {
  return state.buildings.filter((b) => b.kind === kind).length;
}
function SWBuildingLimit(state, kind) {
  const level = Math.max(1, Math.min(10, Ml(state)));
  const limits = { keep: 1, farm: 1 + Math.floor((level - 1) / 3), lumber: 1 + Math.floor((level - 1) / 3), quarry: 1 + Math.floor((level - 1) / 4), barracks: 1 + (level >= 5), forge: 1, market: 1, harbor: 1, workshop: 1, tavern: 1, monument: 1, builder: 1 + (level >= 4) + (level >= 7), cottage: 2 + Math.floor((level - 1) / 2), tower: 2 + Math.floor((level - 1) / 2), wall: 20 + 8 * level, gate: 2 + Math.floor(level / 3), storehouse: 1 + (level >= 4) + (level >= 7), well: 1 + (level >= 6), mortar: 1 + (level >= 6), bombtower: 1 + (level >= 8), flame: 1 + (level >= 8), bastion: 1 + (level >= 9) };
  return limits[kind] ?? 0;
}
function SWCanReceive(state, reward, cost = {}) {
  return xl.every((k) => state.resources[k] - (cost[k] || 0) + (reward[k] || 0) <= SWCapacity(state) + 1e-6);
}
function SWRequireRoom(state, reward, cost) {
  if (!SWCanReceive(state, reward, cost)) throw Error("Make room in your stores before collecting this reward.");
}
function SWMigrateStorage(state) {
  const cap = SWCapacity(state);
  state.reserveCrates ||= { gold: 0, wood: 0, stone: 0, food: 0 };
  if (!state.storageVersion) {
    for (const k of xl) {
      const excess = Math.max(0, state.resources[k] - cap);
      state.reserveCrates[k] = (state.reserveCrates[k] || 0) + excess;
      state.resources[k] -= excess;
    }
    state.storageVersion = 1;
  }
  for (const k of xl) {
    state.resources[k] = Math.max(0, Math.min(cap, state.resources[k] || 0));
    state.reserveCrates[k] = Math.max(0, state.reserveCrates[k] || 0);
  }
  for (const b of state.buildings) if (!Number.isInteger(b.facing)) b.facing = b.axis === "y" ? 1 : 0;
}
function SWClaimReserve(state) {
  let total = 0;
  for (const k of xl) {
    const value = Math.min(state.reserveCrates?.[k] || 0, Math.max(0, SWCapacity(state) - state.resources[k]));
    state.resources[k] += value;
    state.reserveCrates[k] -= value;
    total += value;
  }
  if (total < 1e-6) throw Error("Spend supplies or expand storage to open space for reserve crates.");
}
function SWFacing(value, fallback = 0) {
  if (value === void 0) return fallback;
  if (!Number.isInteger(value) || value < 0 || value > 3) throw Error("Choose one of the four building directions.");
  return value;
}
function SWLandStats(state) {
  const key2 = (x, y) => x + "," + y, adj = (p) => [[p.x - 1, p.y], [p.x + 1, p.y], [p.x, p.y - 1], [p.x, p.y + 1]], placedRoads = new Set((state.terrain || []).filter((t) => t.kind === "road" && !state.buildings.some((b) => b.kind !== "gate" && b.x === t.x && b.y === t.y)).map((t) => key2(t.x, t.y))), roads = /* @__PURE__ */ new Set([...placedRoads, ...Array.from({ length: 6 }, (_, i) => key2(-1, i + 1))]), keep = state.buildings.find((b) => b.kind === "keep"), reached = /* @__PURE__ */ new Set(), queue = [];
  if (keep) for (const [x, y] of adj(keep)) {
    const k = key2(x, y);
    if (roads.has(k)) {
      reached.add(k);
      queue.push({ x, y });
    }
  }
  for (let i = 0; i < queue.length; i++) for (const [x, y] of adj(queue[i])) {
    const k = key2(x, y);
    if (roads.has(k) && !reached.has(k)) {
      reached.add(k);
      queue.push({ x, y });
    }
  }
  const connectedIds = state.buildings.filter((b) => b.kind !== "keep" && b.level > 0 && adj(b).some(([x, y]) => reached.has(key2(x, y)))).map((b) => b.id);
  const gardens = (state.terrain || []).filter((t) => t.kind === "garden" && !state.buildings.some((b) => b.x === t.x && b.y === t.y)), beneficial = gardens.filter((t) => state.buildings.some((b) => b.kind === "cottage" && b.level > 0 && Math.abs(b.x - t.x) + Math.abs(b.y - t.y) === 1)).length;
  return { connectedIds, connectedCount: connectedIds.length, roadCount: placedRoads.size, connectedRoadCount: [...reached].filter((k) => placedRoads.has(k)).length, gardenCount: gardens.length, gardenBonus: Math.min(0.1, beneficial * 0.02), incomeBonus: 0.1 };
}
function SWRaidLoot(state, result) {
  const protectedAmount = Math.floor(SWCapacity(state) * 0.2), fraction = 0.1 * Math.max(0, Math.min(1, (result.destruction || 0) / 100)) + (result.won ? 0.08 : 0);
  return Object.fromEntries(xl.map((k) => [k, Math.floor(Math.max(0, state.resources[k] - protectedAmount) * fraction)]));
}
for (const province of Ac) {
  const additions = [];
  for (let x = 0; x < 18; x++) for (let y = 0; y < 18; y++) if (x >= 16 || y >= 16) {
    const owner = x >= 16 && y < 6 ? "whisperwood" : x >= 16 && y < 12 ? "sunmeadow" : x >= 16 ? "ironpass" : x < 6 ? "tidewatch" : "highmarch";
    if (province.id === owner && !province.tiles.some((t) => t.x === x && t.y === y)) additions.push({ x, y });
  }
  province.tiles.push(...additions);
}
function SWTradeQuote(state, resource, amount, payWith = "food") {
  if (!xl.includes(resource) || !xl.includes(payWith) || payWith === resource || ![50, 100, 250].includes(amount)) throw Error("Choose two different resources and a trade amount.");
  const payment = amount * (payWith === "food" && resource === "stone" ? 3 : 2);
  const reason = !state.buildings.some((b) => b.kind === "market" && b.level > 0) ? "Complete a marketplace first." : state.resources[payWith] < payment ? "More " + (payWith === "wood" ? "timber" : payWith) + " needed." : state.resources[resource] + amount > Fl(state) ? "Make room in storage first." : null;
  return { resource, amount, payWith, payment, food: payWith === "food" ? payment : 0, reason };
}
function SWApplyTrade(state, action) {
  if (action.type !== "marketTrade") return false;
  const quote = SWTradeQuote(state, action.resource, action.amount, action.payWith || "food");
  if (quote.reason) throw Error(quote.reason);
  state.resources[quote.payWith] -= quote.payment;
  state.resources[quote.resource] += quote.amount;
  return true;
}
Object.assign(Sl, {
  well: { name: "Village well", description: "Fresh water improves every resource producer. Each level adds 2% income, up to 20% across your wells.", cost: { gold: 90, wood: 35, stone: 80, food: 25 }, time: 45, unlock: 1, max: 10, sprite: 5, benefit: "+2% all resource income per level" },
  storehouse: { name: "Storehouse", description: "Keep more goods at home and supply the town.", cost: { gold: 140, wood: 110, stone: 60, food: 40 }, time: 65, unlock: 1, max: 10, sprite: 6, benefit: "Larger stores with every upgrade" },
  workshop: { name: "Artisan workshop", description: "Craft materials and equip your construction crews. Each level speeds building by 3%, up to 30%.", cost: { gold: 180, wood: 120, stone: 100, food: 65 }, time: 85, unlock: 2, max: 10, sprite: 5, benefit: "Craft goods · faster construction" },
  tavern: { name: "Town tavern", description: "A place for residents to gather. Improves request rewards and hosts festivals.", cost: { gold: 160, wood: 95, stone: 65, food: 100 }, time: 75, unlock: 2, max: 10, sprite: 6, benefit: "Resident requests · town festivals" }
});
var SWCityRecipes = {
  stone: { name: "Dressed stone", cost: { gold: 0, wood: 50, stone: 0, food: 30 }, reward: { gold: 0, wood: 0, stone: 90, food: 0 }, duration: 60 },
  goods: { name: "Crafted goods", cost: { gold: 0, wood: 65, stone: 35, food: 25 }, reward: { gold: 150, wood: 0, stone: 0, food: 0 }, duration: 90 }
};
function SWCivicLevel(state, kind) {
  return state.buildings.filter((b) => b.kind === kind).reduce((sum, b) => sum + b.level, 0);
}
function SWCity(state) {
  return state.city || { jobs: 0, crafted: 0, raidWins: 0, raidCount: 0, requests: {} };
}
function SWCityRequest(state, slot) {
  const city = SWCity(state), record = city.requests?.[slot] || { count: 0, readyAt: 0 }, index = (slot + record.count) % 3;
  const templates = [
    { name: "Meals for the workers", text: "The construction crews need a hot meal.", cost: { gold: 0, wood: 10, stone: 0, food: 85 }, reward: { gold: 115, wood: 0, stone: 20, food: 0 } },
    { name: "Repair the market carts", text: "Replace the wheels and keep local trade moving.", cost: { gold: 0, wood: 70, stone: 20, food: 0 }, reward: { gold: 100, wood: 0, stone: 0, food: 75 } },
    { name: "Supplies for new homes", text: "Residents are furnishing their new cottages.", cost: { gold: 15, wood: 50, stone: 25, food: 25 }, reward: { gold: 135, wood: 0, stone: 35, food: 0 } }
  ];
  const task = templates[index], bonus = 1 + Math.min(0.5, SWCivicLevel(state, "tavern") * 0.05);
  return { ...task, reward: { ...task.reward, gold: Math.round(task.reward.gold * bonus) }, id: slot + ":" + record.count, slot, readyAt: record.readyAt };
}
function SWShipRepairCost(ship) {
  return Object.fromEntries(xl.map((k) => [k, Math.ceil(nl(ship.kind, ship.level)[k] * 0.35)]));
}
function SWCityTick(state, now) {
  for (const ship of state.fleet || []) if (ship.repairReadyAt && ship.repairReadyAt <= now) {
    delete ship.wrecked;
    delete ship.repairReadyAt;
  }
}
function SWCityAction(state, action, now) {
  if (!["cityRequest", "startCraft", "collectCraft", "festival", "repairShip"].includes(action.type)) return false;
  state.city = { jobs: 0, crafted: 0, raidWins: 0, raidCount: 0, requests: {}, ...state.city };
  const city = state.city;
  if (action.type === "repairShip") {
    const ship = state.fleet.find((s) => s.id === action.id);
    if (!ship?.wrecked || ship.repairReadyAt || ship.combatBattleId) throw Error("Choose a wrecked ship that is not being repaired.");
    if (state.fleet.some((s) => s.readyAt || s.repairReadyAt)) throw Error("Your shipwright is already building or repairing a vessel.");
    Q(state, SWShipRepairCost(ship));
    ship.repairReadyAt = now + Math.ceil(wc[ship.kind].time * (1 + 0.2 * (ship.level - 1)) * 0.6 * (1 - SWCivicBonuses(state).repairSpeed)) * 1e3;
  } else if (action.type === "cityRequest") {
    if (!Number.isInteger(action.slot) || action.slot < 0 || action.slot > 2) throw Error("Choose a resident request.");
    const task = SWCityRequest(state, action.slot);
    if (task.id !== action.id || task.readyAt > now) throw Error("A new resident request will arrive shortly.");
    SWRequireRoom(state, task.reward, task.cost);
    Q(state, task.cost);
    Ll(state, task.reward);
    city.jobs++;
    city.requests = { ...city.requests, [action.slot]: { count: (city.requests?.[action.slot]?.count || 0) + 1, readyAt: now + 6e4 } };
    if (city.jobs % 5 === 0) state.gems += 3;
  } else if (action.type === "startCraft") {
    const recipe = SWCityRecipes[action.kind];
    if (!recipe || !SWCivicLevel(state, "workshop")) throw Error("Complete an artisan workshop first.");
    if (city.craft) throw Error("Collect the current workshop order first.");
    Q(state, recipe.cost);
    city.craft = { kind: action.kind, readyAt: now + Math.max(20, recipe.duration - SWCivicLevel(state, "workshop") * 3) * 1e3 };
  } else if (action.type === "collectCraft") {
    if (!city.craft || city.craft.readyAt > now) throw Error("Your artisans are still working.");
    const recipe = SWCityRecipes[city.craft.kind];
    if (!recipe) throw Error("Unknown workshop order.");
    if (xl.some((k) => state.resources[k] + recipe.reward[k] > Fl(state))) throw Error("Make room in storage before collecting.");
    Ll(state, recipe.reward);
    delete city.craft;
    city.crafted++;
  } else if (action.type === "festival") {
    if (!SWCivicLevel(state, "tavern")) throw Error("Complete a town tavern first.");
    if ((city.festivalReadyAt || 0) > now) throw Error("Let the town prepare for its next festival.");
    Q(state, { gold: 60, wood: 0, stone: 0, food: 180 });
    city.festivalUntil = now + (10 + SWCivicBonuses(state).festivalMinutes) * 6e4;
    city.festivalReadyAt = now + 12e5;
  }
  return true;
}
function SWDefenseInput(state) {
  const level = Math.min(10, 1 + SWCity(state).raidWins), defense = Wl(state), army = wl(), orders = [];
  army.infantry = 5 + level * 2;
  army.archer = 2 + level;
  army.ram = level >= 3 ? Math.floor(level / 3) : 0;
  const bounds = fl(defense), points = [{ x: bounds.minX, y: Math.round((bounds.minY + bounds.maxY) / 2) }, { x: bounds.maxX, y: Math.round((bounds.minY + bounds.maxY) / 2) }, { x: Math.round((bounds.minX + bounds.maxX) / 2), y: bounds.maxY }];
  for (const kind of Object.keys(army)) for (let i = 0; i < army[kind]; i++) orders.push({ kind, ...points[Math.floor(orders.length / 6) % points.length], time: Math.floor(orders.length / 6) * 4 });
  return { defense, army, orders, bonus: 1, front: "center", rulesVersion: 4, combatVersion: 12, presentationVersion: 12, healerTacticsVersion: 1, troopAbilitiesVersion: 1, unitLevels: Object.fromEntries(Object.keys(J).map((k) => [k, Math.max(1, Math.ceil(level / 2))])), seed: state.revision * 7919 + level * 131 >>> 0, defenseRaidLevel: level, defenseEconomyVersion: 2 };
}
function SWResolveDefense(state, input, result, now = Date.now()) {
  const city = state.city = { jobs: 0, crafted: 0, raidWins: 0, raidCount: 0, requests: {}, ...state.city };
  const won = !result.won, level = input.defenseRaidLevel || 1;
  const loot = input.defenseEconomyVersion === 2 ? SWRaidLoot(state, result) : { gold: won ? 0 : Math.min(150, Math.floor(state.resources.gold * 0.05)), wood: 0, stone: 0, food: 0 };
  for (const k of xl) state.resources[k] -= loot[k];
  const reward = won ? Ll(state, { gold: 120 + level * 45, wood: 35 + level * 15, stone: 40 + level * 20, food: 30 + level * 10 }) : { gold: 0, wood: 0, stone: 0, food: 0 };
  city.raidCount++;
  if (won) {
    city.raidWins++;
    state.gems += 2;
  }
  city.raidReadyAt = now + 3e5;
  return { won, reward, lost: Object.values(loot).reduce((a, b) => a + b, 0), loot };
}
Dl.push(
  { id: "civic_water", title: "Water for everyone", description: "Complete your first village well.", icon: "users", target: 1, value: (s) => SWCivicLevel(s, "well"), reward: { gold: 80, wood: 25, stone: 45, food: 30 } },
  { id: "helping_hands", title: "Helping hands", description: "Complete five resident requests.", icon: "users", target: 5, value: (s) => SWCity(s).jobs, reward: { gold: 150, wood: 60, stone: 60, food: 60 } },
  { id: "artisan", title: "Made in Havencrest", description: "Collect three workshop orders.", icon: "hammer", target: 3, value: (s) => SWCity(s).crafted, reward: { gold: 160, wood: 80, stone: 80, food: 0 } },
  { id: "hold_the_line", title: "Hold the line", description: "Repel your first computer raid.", icon: "shield", target: 1, value: (s) => SWCity(s).raidWins, reward: { gold: 180, wood: 60, stone: 100, food: 60 } },
  { id: "frontier_provinces", title: "A wider world", description: "Capture your first province.", icon: "flag", target: 1, value: (s) => s.provinces?.length || 0, reward: { gold: 120, wood: 100, stone: 80, food: 40 } }
);
var SWCivicProjects = [
  { id: "market", name: "Market square", description: "Turn the market into a busy civic center with stalls, lighting and a guild court.", anchorKind: "market", stages: [
    { name: "Trading square", benefit: "+5% gold production", keep: 2, anchorLevel: 1, roads: 2, jobs: 1, duration: 90, cost: { gold: 180, wood: 120, stone: 150, food: 100 } },
    { name: "Lantern market", benefit: "+10% gold production", keep: 4, anchorLevel: 2, roads: 6, jobs: 5, duration: 240, cost: { gold: 600, wood: 400, stone: 500, food: 350 } },
    { name: "Guild court", benefit: "+15% gold production", keep: 7, anchorLevel: 4, roads: 10, jobs: 15, duration: 600, cost: { gold: 2200, wood: 1500, stone: 2e3, food: 1e3 } }
  ] },
  { id: "waterfront", name: "Working waterfront", description: "Equip the harbor with cargo facilities and better shipwright services.", anchorKind: "harbor", stages: [
    { name: "Cargo landing", benefit: "Voyages 5% faster · ship repairs 10% faster", keep: 3, anchorLevel: 2, ships: 1, duration: 120, cost: { gold: 300, wood: 320, stone: 180, food: 150 } },
    { name: "Shipwright quay", benefit: "Voyages 10% faster · ship repairs 20% faster", keep: 5, anchorLevel: 3, ships: 2, duration: 360, cost: { gold: 1100, wood: 900, stone: 600, food: 400 } },
    { name: "Merchant waterfront", benefit: "Voyages 15% faster · ship repairs 30% faster", keep: 8, anchorLevel: 5, ships: 3, duration: 720, cost: { gold: 3300, wood: 3e3, stone: 2200, food: 1600 } }
  ] },
  { id: "homes", name: "Residential quarter", description: "Add shared services, meeting spaces and a skilled neighborhood workforce.", anchorKind: "cottage", stages: [
    { name: "Village commons", benefit: "Construction 5% faster · 12 more residents", keep: 2, anchorLevel: 1, homes: 1, well: 1, duration: 90, cost: { gold: 170, wood: 150, stone: 100, food: 120 } },
    { name: "Neighborhood hall", benefit: "Construction 10% faster · 24 more residents", keep: 4, anchorLevel: 2, homes: 2, well: 1, duration: 240, cost: { gold: 650, wood: 550, stone: 450, food: 400 } },
    { name: "Town quarter", benefit: "Construction 15% faster · 36 more residents", keep: 7, anchorLevel: 4, homes: 3, well: 2, duration: 600, cost: { gold: 1800, wood: 2200, stone: 1700, food: 1400 } }
  ] },
  { id: "gardens", name: "Public gardens", description: "Build a planted gathering place around the village well.", anchorKind: "well", stages: [
    { name: "Kitchen gardens", benefit: "+5% food production · festivals last 2 minutes longer", keep: 2, anchorLevel: 1, gardens: 1, roads: 2, duration: 60, cost: { gold: 150, wood: 80, stone: 90, food: 90 } },
    { name: "Community orchard", benefit: "+10% food production · festivals last 4 minutes longer", keep: 4, anchorLevel: 2, gardens: 3, roads: 6, duration: 180, cost: { gold: 400, wood: 300, stone: 350, food: 200 } },
    { name: "Fountain gardens", benefit: "+15% food production · festivals last 6 minutes longer", keep: 6, anchorLevel: 3, gardens: 5, roads: 10, duration: 420, cost: { gold: 1200, wood: 850, stone: 1e3, food: 600 } }
  ] }
];
function SWCivicStage(state, id) {
  return Math.max(0, Math.min(3, state.city?.projects?.[id]?.stage || 0));
}
function SWCivicBonuses(state) {
  return { goldIncome: 0.05 * SWCivicStage(state, "market"), foodIncome: 0.05 * SWCivicStage(state, "gardens"), buildSpeed: 0.05 * SWCivicStage(state, "homes"), voyageSpeed: 0.05 * SWCivicStage(state, "waterfront"), repairSpeed: 0.1 * SWCivicStage(state, "waterfront"), festivalMinutes: 2 * SWCivicStage(state, "gardens"), residents: 12 * SWCivicStage(state, "homes") };
}
function SWCivicProject(state, id, now = Date.now()) {
  const def = SWCivicProjects.find((p) => p.id === id);
  if (!def) throw Error("Choose a civic project.");
  const record = state.city?.projects?.[id] || {}, stage = SWCivicStage(state, id), next = def.stages[stage], anchor = state.buildings.filter((b) => b.kind === def.anchorKind && b.level > 0).sort((a, b) => b.level - a.level)[0], land = SWLandStats(state), requirements = [];
  if (next) {
    requirements.push({ label: "Keep level " + next.keep, met: Ml(state) >= next.keep, buildKind: "keep", action: "building" }, { label: Sl[def.anchorKind].name + " level " + next.anchorLevel, met: !!anchor && anchor.level >= next.anchorLevel, buildKind: def.anchorKind, action: "building" });
    if (next.roads) requirements.push({ label: next.roads + " roads connected to the Keep", met: land.connectedRoadCount >= next.roads, action: "plan" });
    if (next.jobs) requirements.push({ label: next.jobs + " resident requests fulfilled", met: (SWCity(state).jobs || 0) >= next.jobs, action: "residents" });
    if (next.ships) requirements.push({ label: next.ships + " completed ships", met: (state.fleet || []).filter((s) => s.level > 0).length >= next.ships, buildKind: "harbor", action: "fleet" });
    if (next.homes) requirements.push({ label: next.homes + " completed cottages", met: state.buildings.filter((b) => b.kind === "cottage" && b.level > 0).length >= next.homes, buildKind: "cottage", action: "build" });
    if (next.well) requirements.push({ label: "Village well level " + next.well, met: state.buildings.some((b) => b.kind === "well" && b.level >= next.well), buildKind: "well", action: "building" });
    if (next.gardens) requirements.push({ label: next.gardens + " planted gardens", met: land.gardenCount >= next.gardens, action: "plan" });
  }
  const claimable = stage > (record.claimedStage || 0), status = record.readyAt ? "building" : claimable ? "claimable" : stage === 3 ? "complete" : requirements.some((r) => !r.met) ? "locked" : "available";
  const reason = status === "building" ? "Construction underway" : claimable ? "Celebrate the completed stage first" : stage === 3 ? "District complete" : requirements.find((r) => !r.met)?.label || (!Rc(state) ? "All construction crews are working" : !Z(state, next.cost) ? "More resources needed" : null);
  return { ...def, stage, nextStage: Math.min(3, stage + 1), targetStage: record.targetStage, startedAt: record.startedAt, readyAt: record.readyAt, siteId: record.siteId || anchor?.id, status, benefit: stage ? def.stages[stage - 1].benefit : "No district bonus yet", nextBenefit: next?.benefit || def.stages[2].benefit, stageName: stage ? def.stages[stage - 1].name : "Not started", nextName: next?.name, cost: next?.cost || { gold: 0, wood: 0, stone: 0, food: 0 }, duration: next?.duration || 0, requirements, reason, gemReward: claimable ? stage * 5 : (stage + 1) * 5 };
}
function SWCivicTick(state, now) {
  for (const project of Object.values(state.city?.projects || {})) if (project.readyAt && project.readyAt <= now) {
    project.stage = project.targetStage;
    delete project.targetStage;
    delete project.startedAt;
    delete project.readyAt;
  }
}
function SWCivicProjectAction(state, action, now) {
  if (!["startCivicProject", "claimCivicProject"].includes(action.type)) return false;
  const quote = SWCivicProject(state, action.id, now);
  state.city = { ...SWCity(state), projects: { ...state.city?.projects } };
  if (action.type === "startCivicProject") {
    if (quote.reason) throw Error(quote.reason + ".");
    if (quote.status !== "available") throw Error("This district stage is not available.");
    Q(state, quote.cost);
    state.city.projects[action.id] = { ...state.city.projects[action.id], stage: quote.stage, siteId: quote.siteId, targetStage: quote.nextStage, startedAt: now, readyAt: now + quote.duration * 1e3 };
  } else {
    if (quote.status !== "claimable") throw Error("This district celebration has already been collected.");
    state.gems += quote.gemReward;
    state.city.projects[action.id] = { ...state.city.projects[action.id], claimedStage: quote.stage };
    state.city.prosperity = (state.city.prosperity || 0) + quote.stage * 10;
  }
  return true;
}
var SWRaidTiming = { initialShield: 20 * 6e4, warning: 5 * 6e4, shield: 2 * 36e5 };
function SWMigrateRaids(state, now) {
  state.city = { ...SWCity(state) };
  if (!state.city.raidSchedule) state.city.raidSchedule = { version: 1, enabled: true, cycle: 0 };
  const raid = state.city.raidSchedule;
  if (Ml(state) >= 3 && !raid.eligibleAt) {
    raid.eligibleAt = now;
    raid.shieldUntil = now + SWRaidTiming.initialShield;
    raid.dueAt = raid.shieldUntil + SWRaidTiming.warning;
  }
}
function SWRaidStatus(state, now = Date.now()) {
  const raid = state.city?.raidSchedule, enabled = raid?.enabled !== false, wave = Math.max(1, Math.min(10, Math.ceil(Ml(state) / 2) + Math.floor((SWCity(state).raidWins || 0) / 2)));
  const phase = state.activeBattle && String(state.activeBattle).startsWith("defense-") ? "active" : !enabled || Ml(state) < 3 ? "peace" : !raid || now < raid.shieldUntil ? "protected" : now < raid.dueAt ? "warning" : "ready";
  return { phase, enabled, wave, endsAt: phase === "protected" ? raid?.shieldUntil || now + SWRaidTiming.initialShield : phase === "warning" ? raid.dueAt : 0, lootRisk: SWRaidLoot(state, { won: true, destruction: 100 }), cycle: raid?.cycle || 0, dueAt: raid?.dueAt };
}
function SWRaidScheduleAfter(state, now, id) {
  SWMigrateRaids(state, now);
  const raid = state.city.raidSchedule;
  raid.lastSettledId = id || raid.lastSettledId;
  raid.cycle = (raid.cycle || 0) + 1;
  raid.shieldUntil = now + SWRaidTiming.shield;
  raid.dueAt = raid.shieldUntil + SWRaidTiming.warning;
}
function SWRaidInput(state, now = Date.now(), automatic = false) {
  SWMigrateRaids(state, now);
  const status = SWRaidStatus(state, now), input = SWDefenseInput(state);
  const level = status.wave, army = wl(), orders = [], bounds = fl(input.defense), points = [{ x: bounds.minX, y: Math.round((bounds.minY + bounds.maxY) / 2) }, { x: bounds.maxX, y: Math.round((bounds.minY + bounds.maxY) / 2) }, { x: Math.round((bounds.minX + bounds.maxX) / 2), y: bounds.maxY }];
  army.infantry = 5 + level * 2;
  army.archer = 2 + level;
  army.ram = level >= 3 ? Math.floor(level / 3) : 0;
  for (const kind of Object.keys(army)) for (let i = 0; i < army[kind]; i++) orders.push({ kind, ...points[Math.floor(orders.length / 6) % points.length], time: Math.floor(orders.length / 6) * 4 });
  const raidId = automatic ? "defense-auto-" + state.city.raidSchedule.cycle + "-" + state.city.raidSchedule.dueAt : "defense-" + now + "-" + state.revision;
  return { ...input, army, orders, unitLevels: Object.fromEntries(Object.keys(J).map((k) => [k, Math.max(1, Math.ceil(level / 2))])), seed: state.revision * 7919 + level * 131 + state.city.raidSchedule.cycle * 3571 >>> 0, defenseRaidLevel: level, defenseEconomyVersion: 2, defenseTelemetryVersion: 1, raidId, automaticRaid: automatic };
}
function SWDefenseReport(input, result, outcome, now) {
  const stats = result.defenseStats || {};
  return { id: input.raidId, won: outcome.won, keepHeld: outcome.won, destruction: result.destruction, duration: result.duration, loot: outcome.loot, reward: outcome.reward, lootProtected: Math.floor(SWCapacity({ buildings: input.defense.buildings }) * 0.2), towerDamage: stats.towerDamage, wallDamageAbsorbed: stats.wallDamageAbsorbed, wallDelaySeconds: stats.wallDelaySeconds, attackersDefeated: stats.attackersDefeated, startedAt: now - Math.round(result.duration * 1e3), endedAt: now, automatic: !!input.automaticRaid };
}
function SWSettleScheduledRaid(state, input, result, now) {
  if (!input.raidId || state.city?.raidSchedule?.lastSettledId === input.raidId) return null;
  if (input.automaticRaid) {
    const schedule = state.city?.raidSchedule;
    if (!schedule || now < schedule.dueAt || schedule.enabled === false || state.activeBattle || Ml(state) < 3 || input.raidId !== "defense-auto-" + schedule.cycle + "-" + schedule.dueAt) return null;
  }
  const outcome = SWResolveDefense(state, input, result, now);
  SWRaidScheduleAfter(state, now, input.raidId);
  const report = SWDefenseReport(input, result, outcome, now);
  state.city.lastDefense = report;
  return { ...outcome, defenseReport: report };
}
function X(e, t = 1) {
  let n = Sl[e].cost, r = e === `keep` ? 1.7 ** (t - 1) : 1.6 ** (t - 1);
  return Object.fromEntries(xl.map((e2) => [e2, Math.round(n[e2] * r)]));
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
    e.resources[r] = Math.min(Fl(e), i + t[r]), n[r] = Math.floor(Math.max(0, e.resources[r] - i) + 1e-6);
  }
  return n;
}
function zl(e) {
  return 12 + SWCivicBonuses(e).residents + e.buildings.reduce(
    (e2, t) => e2 + (t.kind === `cottage` ? 8 : t.kind === `farm` || t.kind === `lumber` || t.kind === `quarry` ? 3 : 0) * t.level,
    0
  );
}
function SWLegacyBl13(e) {
  let t = e.level || e.targetLevel || 1;
  return {
    keep: `Age ${t} · ${500 + 250 * t} base storage`,
    farm: `+${24 * t} food / min`,
    lumber: `+${28 * t} timber / min`,
    quarry: `+${16 * t} stone / min`,
    barracks: `${6 * t} troop slots`,
    forge: `+${10 * t}% army attack`,
    tower: `${e.specialty === `ballista` ? `Ballista` : e.specialty === `volley` ? `Rapid-fire` : `Watchtower`} · ${qc(e).range}-tile range`,
    harbor: `+${4 * t} gold / min · ${Math.min(8, t + 1)} ship berths`,
    storehouse: `+${SWStorageContribution(t).toLocaleString()} storage per resource`,
    cottage: `${8 * t} residents · +${4 * t} gold / min`,
    market: `+${10 * t} gold / min`,
    builder: `One crew · +${Math.round(Math.max(0, t - 1) * 2.5)}% build speed`,
    wall: `Level ${t} barrier · troops must go around or breach`,
    gate: `Level ${t} gate · villagers pass through`,
    monument: `A permanent mark of league achievement`
  }[e.kind] || Sl[e.kind].benefit;
}
function Hl(e) {
  return 1 + e.buildings.filter((e2) => e2.kind === `forge`).reduce((e2, t) => e2 + t.level, 0) * 0.1;
}
var SWPremiumCatalog = [
  { id: "palette:coastal", slot: "palette", value: "coastal", category: "appearance", name: "Havencrest blue", description: "Weathered granite, blue cloth and warm timber.", priceGems: 0, starter: true, preview: "#4a84bc" },
  { id: "palette:ember", slot: "palette", value: "ember", category: "appearance", name: "Ember coast", description: "Terracotta accents and crimson cloth.", priceGems: 15, preview: "#b7553e" },
  { id: "palette:forest", slot: "palette", value: "forest", category: "appearance", name: "Verdant realm", description: "Deep green cloth and garden tones.", priceGems: 15, preview: "#4e8765" },
  { id: "palette:ivory", slot: "palette", value: "ivory", category: "appearance", name: "Pearl harbor", description: "Ivory cloth with brass and ocean-blue accents.", priceGems: 25, collectionId: "mariner", preview: "#e3d7b6" },
  { id: "banner:blue", slot: "banner", value: "blue", category: "banners", name: "Founding blue", description: "The original colors of Havencrest.", priceGems: 0, starter: true, preview: "#4c86d5" },
  { id: "banner:red", slot: "banner", value: "red", category: "banners", name: "Ironward crimson", description: "A red standard for a steadfast city.", priceGems: 10, preview: "#b34e4d" },
  { id: "banner:green", slot: "banner", value: "green", category: "banners", name: "Vale green", description: "Green standards inspired by the frontier.", priceGems: 10, preview: "#568660" },
  { id: "banner:ivory", slot: "banner", value: "ivory", category: "banners", name: "Admiral ivory", description: "Pale pennants with a golden edge.", priceGems: 15, collectionId: "mariner", preview: "#e9dbae" },
  { id: "banner:beacon-crown", slot: "banner", value: "beacon-crown", category: "banners", name: "Coastal Crown", description: "A forked sea-glass standard bearing the crown of the united coast.", priceGems: null, unlockLabel: "Complete Crown of the coast", preview: "#4da4b1" },
  { id: "sail:linen", slot: "sail", value: "linen", category: "sails", name: "Working linen", description: "Natural canvas for the home fleet.", priceGems: 0, starter: true, preview: "#d4c2a0" },
  { id: "sail:blue", slot: "sail", value: "blue", category: "sails", name: "Azure fleet", description: "Ocean-blue sails with bright trim.", priceGems: 20, collectionId: "mariner", preview: "#467fc0" },
  { id: "sail:red", slot: "sail", value: "red", category: "sails", name: "Crimson fleet", description: "Scarlet canvas for a striking arrival.", priceGems: 20, collectionId: "royal", preview: "#b34641" },
  { id: "sail:black", slot: "sail", value: "black", category: "sails", name: "Nightwatch sails", description: "Dark sails earned by breaking the blockade.", priceGems: null, unlockLabel: "Complete The Broken Beacon", preview: "#243640" },
  { id: "road:earth", slot: "road", value: "earth", category: "roads", name: "Packed earth", description: "A practical route through the settlement.", priceGems: 0, starter: true, preview: "#a68f64" },
  { id: "road:stone", slot: "road", value: "stone", category: "roads", name: "Harbor cobbles", description: "Dressed stone for your working streets.", priceGems: 25, collectionId: "mariner", preview: "#9aafa9" },
  { id: "road:royal", slot: "road", value: "royal", category: "roads", name: "Royal paving", description: "Pale paving with warm decorative borders.", priceGems: 35, collectionId: "royal", preview: "#c8b47e" },
  { id: "commander:standard", slot: "commander", value: "standard", category: "outfits", name: "Field equipment", description: "The commanders in their familiar equipment.", priceGems: 0, starter: true, preview: "#7b9db6" },
  { id: "commander:laurel", slot: "commander", value: "laurel", category: "outfits", name: "Laurel honors", description: "Ceremonial gold details for your commander.", priceGems: 30, collectionId: "royal", preview: "#d8b761" },
  { id: "commander:veteran", slot: "commander", value: "veteran", category: "outfits", name: "Veteran mantle", description: "A campaign mantle earned through mastery trials.", priceGems: null, unlockLabel: "Complete all three mastery trials", preview: "#8ca4a9" },
  { id: "ornament:lantern", slot: "ornament", value: "lantern", category: "monuments", name: "Harbor lantern", description: "Place up to twelve warm lanterns around your town.", priceGems: 15, collectionId: "founder", preview: "#edc975" },
  { id: "ornament:standard", slot: "ornament", value: "standard", category: "monuments", name: "Realm standard", description: "Place your colors at a district entrance.", priceGems: 10, collectionId: "founder", preview: "#638fd1" },
  { id: "ornament:planter", slot: "ornament", value: "planter", category: "monuments", name: "Stone planters", description: "Bring planted color to your streets and squares.", priceGems: 15, collectionId: "founder", preview: "#8baa72" },
  { id: "ornament:statue", slot: "ornament", value: "statue", category: "monuments", name: "Beacon guardian", description: "A permanent monument to the people of the coast.", priceGems: null, unlockLabel: "Complete The Broken Beacon", preview: "#b0b9ac" }
];
var SWPremiumCollections = [
  { id: "mariner", name: "Mariner collection", description: "Pearl cloth, azure sails and a cobbled waterfront.", productId: "com.chrismozer.stonewake.collection.mariner", items: ["palette:ivory", "banner:ivory", "sail:blue", "road:stone"] },
  { id: "royal", name: "Royal collection", description: "Crimson sails, royal paving and laurel honors.", productId: "com.chrismozer.stonewake.collection.royal", items: ["sail:red", "road:royal", "commander:laurel"] },
  { id: "founder", name: "Citymaker collection", description: "Reusable lanterns, standards and planters for your city.", productId: "com.chrismozer.stonewake.collection.founder", items: ["ornament:lantern", "ornament:standard", "ornament:planter"] }
];
var SWPremiumDefaults = { palette: "palette:coastal", banner: "banner:blue", road: "road:earth", sail: "sail:linen", commander: "commander:standard" };
function SWPremium(state) {
  const old = state.premium || {};
  return { ...old, version: 12, owned: [.../* @__PURE__ */ new Set([...Object.values(SWPremiumDefaults), ...Array.isArray(old.owned) ? old.owned : []])], sources: old.sources || {}, equipped: { ...SWPremiumDefaults, ...old.equipped }, ornaments: Array.isArray(old.ornaments) ? old.ornaments : [], chapter: { completed: [], claimed: [], records: {}, ...old.chapter }, trials: old.trials || {}, stories: old.stories || {}, events: old.events || {}, seenScenes: Array.isArray(old.seenScenes) ? old.seenScenes : [] };
}
function SWMigratePremium(state) {
  const p = state.premium = SWPremium(state);
  if (p.eraCompletedAt) {
    const id = "banner:beacon-crown";
    if (!p.owned.includes(id)) p.owned.push(id);
    p.sources = { ...p.sources, [id]: [.../* @__PURE__ */ new Set([...p.sources[id] || [], "era:medieval"])] };
  }
  return p;
}
function SWOwnCosmetic(state, id, source = "earned") {
  const item = SWPremiumCatalog.find((i) => i.id === id);
  if (!item) throw Error("This appearance is unavailable.");
  const p = SWMigratePremium(state);
  if (p.owned.includes(id) && !p.sources[id]) p.sources[id] = ["legacy"];
  if (!p.owned.includes(id)) p.owned.push(id);
  p.sources[id] = [.../* @__PURE__ */ new Set([...p.sources[id] || [], source])];
}
function SWGrantCollection(state, id, sourceId = "store:" + id) {
  const collection = SWPremiumCollections.find((c) => c.id === id);
  if (!collection) throw Error("Unknown collection.");
  for (const itemId of collection.items) SWOwnCosmetic(state, itemId, "collection:" + id + ":" + sourceId);
  return collection.items;
}
function SWRevokeCollection(state, id, sourceId) {
  const collection = SWPremiumCollections.find((c) => c.id === id);
  if (!collection) throw Error("Unknown collection.");
  const p = SWMigratePremium(state), prefix = "collection:" + id + ":";
  for (const itemId of collection.items) {
    const sources = p.sources[itemId];
    if (!sources) continue;
    p.sources[itemId] = sources.filter((s) => sourceId ? s !== prefix + sourceId : !s.startsWith(prefix));
    if (!p.sources[itemId].length) {
      p.owned = p.owned.filter((i) => i !== itemId);
      for (const slot of Object.keys(p.equipped)) if (p.equipped[slot] === itemId) p.equipped[slot] = SWPremiumDefaults[slot];
      p.ornaments = p.ornaments.filter((o) => o.itemId !== itemId);
    }
  }
}
function SWCosmeticStatus(state, id) {
  const item = SWPremiumCatalog.find((i) => i.id === id);
  if (!item) throw Error("Choose an appearance.");
  const p = SWPremium(state), owned = p.owned.includes(id), equipped = p.equipped[item.slot] === id;
  const reason = owned ? null : item.priceGems === null ? item.unlockLabel : (state.gems || 0) < item.priceGems ? "More gems needed" : null;
  return { owned, equipped, canBuy: !owned && !reason, reason, priceGems: item.priceGems, unlockLabel: item.unlockLabel || null };
}
function SWAppearance(state, previewId) {
  const p = SWPremium(state), equipped = { ...p.equipped }, item = SWPremiumCatalog.find((i) => i.id === previewId);
  if (item && item.slot !== "ornament") equipped[item.slot] = item.id;
  const result = {};
  for (const [slot, id] of Object.entries(SWPremiumDefaults)) {
    const picked = SWPremiumCatalog.find((i) => i.id === equipped[slot] && i.slot === slot && (p.owned.includes(i.id) || i.id === previewId)) || SWPremiumCatalog.find((i) => i.id === id);
    result[slot] = picked.value;
  }
  result.ornaments = p.ornaments.filter((o) => p.owned.includes(o.itemId)).map((o) => ({ ...o, kind: SWPremiumCatalog.find((i) => i.id === o.itemId)?.value || o.kind }));
  if (item?.slot === "ornament") result.ornaments = [...result.ornaments, { id: "preview", itemId: item.id, kind: item.value, x: 4, y: 6, facing: 0, preview: true }];
  const done = p.chapter.completed;
  result.landmark = { kind: "lighthouse", stage: done.includes("blockade") ? 3 : done.includes("escort") ? 2 : done.includes("causeway") ? 1 : 0, x: -1, y: 7 };
  result.festival = (state.city?.festivalUntil || 0) > (state.lastTick || 0);
  result.tradeOpen = done.includes("escort");
  return result;
}
var SWChapterMissions = [
  { id: "survey", title: "The silent beacon", summary: "Elowen has found a signal tower above the abandoned landing.", characterId: "ranger", keep: 1, type: "city", objective: "Supply a coastal survey.", cost: { gold: 0, wood: 0, stone: 0, food: 40 }, reward: { resources: { gold: 60, wood: 80, stone: 30, food: 0 }, gems: 5 }, storyBefore: [{ speaker: "Elowen Vale", text: "No smoke on the horizon. No bell from the beacon. Someone wants this coast forgotten." }], storyAfter: [{ speaker: "Elowen Vale", text: "The tower is sound. Its light was taken apart, piece by piece. We can bring it home." }] },
  { id: "causeway", title: "A road to the sea", summary: "Reconnect the Keep and waterfront before the repair crews arrive.", characterId: "engineer", keep: 2, type: "city", objective: "Connect your Keep to the shipyard through the coastal promenade.", cost: { gold: 60, wood: 80, stone: 60, food: 50 }, reward: { resources: { gold: 90, wood: 100, stone: 60, food: 0 }, gems: 8 }, storyBefore: [{ speaker: "Bram Flint", text: "A fine harbor is useless if every cart loses a wheel getting there. Give us a proper road." }], storyAfter: [{ speaker: "Mara Ironward", text: "The first crew is waiting at the landing. For the first time in years, this feels like a way home." }] },
  { id: "rescue", title: "The missing shipwrights", summary: "Free Bram’s crew from Greyhaven and escort their engineer to safety.", characterId: "captain", keep: 3, type: "battle", objective: "Break the prison, then protect the engineer until he reaches the western exit.", reward: { resources: { gold: 160, wood: 120, stone: 80, food: 60 }, gems: 10 }, storyBefore: [{ speaker: "Mara Ironward", text: "Break the holding house, then cover their retreat. These people are builders, not soldiers." }, { speaker: "Bram Flint", text: "Bring my crew back, Captain. I still owe them a roof that does not leak." }], storyAfter: [{ speaker: "Bram Flint", text: "All accounted for. Now let us build something the admiral cannot steal." }] },
  { id: "escort", title: "Through the chain", summary: "Bring the beacon lens through a defended sea lane.", characterId: "engineer", keep: 3, type: "battle", objective: "Destroy the coastal battery and keep the repair vessel alive until it reaches the harbor.", reward: { resources: { gold: 180, wood: 120, stone: 100, food: 60 }, gems: 12 }, storyBefore: [{ speaker: "Bram Flint", text: "That ship carries the only lens left on the coast. Silence the shore battery before it enters the channel." }, { speaker: "Admiral Veyr", text: "A light in your harbor is a challenge to my fleet. Consider what you are asking for." }], storyAfter: [{ speaker: "Mara Ironward", text: "The lens is ashore. The merchants saw us do it. They will remember." }] },
  { id: "harbor", title: "Hold the harbor", summary: "Veyr sends raiders against the city you have built.", characterId: "captain", keep: 4, type: "battle", objective: "Keep your own Keep standing against the warned assault.", reward: { resources: { gold: 220, wood: 100, stone: 120, food: 70 }, gems: 12 }, storyBefore: [{ speaker: "Mara Ironward", text: "We know their route. Put your walls and towers to work. I will bring everyone inside." }], storyAfter: [{ speaker: "Mara Ironward", text: "They came for an easy victory. They found a city that stands together." }] },
  { id: "blockade", title: "The Broken Beacon", summary: "Defeat Veyr’s flagship and seize the signal fort to reopen the coast.", characterId: "engineer", keep: 5, type: "battle", objective: "Destroy the flagship and capture the signal Keep.", reward: { resources: { gold: 350, wood: 180, stone: 160, food: 100 }, gems: 20, cosmetics: ["sail:black", "ornament:statue"] }, storyBefore: [{ speaker: "Elowen Vale", text: "His fleet has gathered beneath the signal fort. Cut off its orders and the blockade will break." }, { speaker: "Admiral Veyr", text: "You may light one beacon. There are older powers watching this sea." }], storyAfter: [{ speaker: "Bram Flint", text: "There. A little glass, a little fire, and the whole coast can find its way." }, { speaker: "Mara Ironward", text: "Let them see us. Havencrest is here to stay." }] }
];
function SWMissionRequirements(state, mission) {
  const p = SWPremium(state), index = SWChapterMissions.findIndex((m) => m.id === mission.id), requirements = [{ label: "Keep level " + mission.keep, met: Ml(state) >= mission.keep, action: "building", buildKind: "keep" }];
  if (index > 0) requirements.push({ label: "Complete " + SWChapterMissions[index - 1].title, met: p.chapter.claimed.includes(SWChapterMissions[index - 1].id), action: "chronicle" });
  if (mission.id === "causeway") requirements.push({ label: "Complete a shipyard", met: state.buildings.some((b) => b.kind === "harbor" && b.level > 0), action: "build", buildKind: "harbor" }, { label: "A road from the Keep to your shipyard", met: state.buildings.some((b) => b.kind === "harbor" && SWLandStats(state).connectedIds.includes(b.id)), action: "plan" });
  return requirements;
}
function SWChapter(state) {
  const p = SWPremium(state);
  return { id: "broken-beacon", title: "The Broken Beacon", description: "Restore the light. Reopen the coast. Bring your people home.", completed: p.chapter.completed.length, claimed: !!p.chapter.finaleClaimed, missions: SWChapterMissions.map((m) => {
    const requirements = SWMissionRequirements(state, m), status = p.chapter.claimed.includes(m.id) ? "complete" : p.chapter.completed.includes(m.id) ? "claimable" : requirements.every((r) => r.met) ? "available" : "locked";
    return { ...m, status, requirements, record: p.chapter.records[m.id] || null };
  }) };
}
var SWTrialDefinitions = [
  { id: "swift-rescue", missionId: "rescue", title: "The narrow window", description: "Rescue the engineer in 32 seconds or less.", objective: "Rescue in 32 seconds", reward: { gems: 8 } },
  { id: "safe-passage", missionId: "escort", title: "Safe passage", description: "Deliver the repair vessel with at least 60% of its hull intact.", objective: "Save 60% of the repair vessel’s hull", reward: { gems: 8 } },
  { id: "decisive-strike", missionId: "blockade", title: "Decisive strike", description: "Break the blockade in 45 seconds with at least half your expedition alive.", objective: "Win within 45 seconds; preserve half the army", reward: { gems: 12 } }
];
function SWTrials(state) {
  const p = SWPremium(state);
  return SWTrialDefinitions.map((t) => ({ ...t, status: p.trials[t.id]?.completed ? "complete" : p.chapter.completed.includes(t.missionId) ? "available" : "locked", best: p.trials[t.id] || null, reason: p.chapter.completed.includes(t.missionId) ? null : "Complete the story mission first." }));
}
function SWSagaDefense(id) {
  const spec = SWChapterMissions.find((m) => m.id === id);
  if (!spec || spec.type !== "battle") throw Error("Choose a battle mission.");
  const buildings = [], add = (id2, kind, x, y, level = 1) => buildings.push({ id: id2, kind, x, y, level, facing: 0 });
  add("signal-keep", "keep", 6, 3, id === "blockade" ? 3 : 1);
  add("dock", "harbor", -1, 2, 1);
  add("stores", "storehouse", 5, 5, 1);
  add("quarters", "cottage", 7, 5, 1);
  if (id === "rescue") {
    add("prison", "cottage", 3, 3, 1);
    add("east-watch", "tower", 6, 1, 2);
    add("exit-watch", "tower", 1, 4, 2);
    add("gate-north", "gate", 3, 1, 1);
    add("wall-a", "wall", 4, 1, 1);
    add("wall-b", "wall", 5, 1, 1);
  }
  if (id === "escort") {
    add("shore-battery", "tower", 0, 0, 2);
    add("watch", "tower", 4, 2, 1);
    add("barracks", "barracks", 6, 5, 1);
  }
  if (id === "blockade") {
    add("shore-battery", "tower", 0, 0, 3);
    add("mortar", "mortar", 5, 2, 2);
    add("watch", "tower", 7, 1, 2);
    for (let y = 1; y <= 5; y++) if (y !== 3) add("wall-" + y, "wall", 3, y, 2);
    add("sea-gate", "gate", 3, 3, 2);
  }
  return { name: id === "rescue" ? "Greyhaven holding" : id === "escort" ? "The chain passage" : "Veyr’s signal fort", level: id === "blockade" ? 4 : 2, rating: 100, buildings };
}
function SWSagaInput(state, id, trial = false, now = Date.now()) {
  const mission = SWChapter(state).missions.find((m) => m.id === id);
  if (!mission || mission.type !== "battle") throw Error("Choose a battle mission.");
  if (mission.status === "locked") throw Error(mission.requirements.find((r) => !r.met)?.label || "Mission unavailable.");
  const trialDef = trial ? SWTrialDefinitions.find((t) => t.id === trial || trial === true && t.missionId === id) : null;
  if (trial && (!trialDef || trialDef.missionId !== id || !SWPremium(state).chapter.completed.includes(id))) throw Error("Complete this mission before its trial.");
  if (id === "harbor") {
    const input = SWDefenseInput(state);
    input.orders = input.orders.map((o) => ({ ...o, time: o.time * 0.65 }));
    return { ...input, saga: { version: 12, missionId: id, mode: "hold", label: mission.objective, holdSeconds: 90, trialId: null }, combatVersion: 12, presentationVersion: 12 };
  }
  const level = id === "blockade" ? 4 : 2, army = { ...wl(), infantry: id === "blockade" ? 8 : 5, archer: 5, shieldbearer: 3, healer: 2, ram: 1, ...id === "blockade" ? { trebuchet: 2, crossbow: 2 } : {} };
  return { defense: SWSagaDefense(id), appearance: SWAppearance(state), army, orders: [], bonus: 1.2, front: "center", rulesVersion: 4, combatVersion: 12, presentationVersion: 12, healerTacticsVersion: 1, troopAbilitiesVersion: 1, navalVersion: 3, navalSupport: id === "rescue" ? void 0 : { id: "expedition", kind: id === "blockade" ? "bombard" : "galley", level: id === "blockade" ? 5 : 3 }, enemyNavy: id === "rescue" ? [] : [{ id: "flagship", kind: id === "blockade" ? "bombard" : "galley", level: id === "blockade" ? 3 : 1 }], unitLevels: Object.fromEntries(Object.keys(J).map((k) => [k, level])), commander: { id: id === "blockade" ? "engineer" : "captain", level, gear: "armor" }, seed: 120031 + SWChapterMissions.findIndex((m) => m.id === id) * 7919, saga: { version: 12, missionId: id, mode: id === "rescue" ? "rescue" : id === "escort" ? "escort" : "blockade", label: trialDef?.objective || mission.objective, trialId: trialDef?.id || null }, createdAt: now };
}
function SWSagaSpawn(input) {
  if (input.saga?.mode !== "escort") return null;
  const ship = SWCreateNavalUnit({ id: "repair-vessel", kind: "galley", level: 2 }, "attack");
  return { ...ship, id: "saga-escort", shipId: "repair-vessel", sagaEscort: true, x: -3.5, y: 5, hp: 420, maxHp: 420, damage: 0, speed: 0.16, nextAttack: Infinity };
}
function SWSagaStep(input, units, time) {
  const saga = input.saga;
  if (!saga) return;
  if (saga.mode === "rescue" && !units.some((u) => u.id === "saga-escort") && units.some((u) => u.id === "prison" && u.hp <= 0)) units.push({ id: "saga-escort", kind: "worker", sagaEscort: true, side: "attack", x: 3, y: 3, hp: 240, maxHp: 240, speed: 0.45, damage: 0, range: 0, cooldown: 2, nextAttack: Infinity, level: 1, building: false });
  const escort = units.find((u) => u.id === "saga-escort");
  if (!escort || escort.hp <= 0 || escort.rescued) return;
  if (saga.mode === "escort" && units.some((u) => u.id === "shore-battery" && u.hp > 0)) {
    escort.waitingForBattery = true;
    return;
  }
  delete escort.waitingForBattery;
  const target = saga.mode === "rescue" ? { x: -2, y: 3 } : { x: -3.5, y: -1.1 }, dx = target.x - escort.x, dy = target.y - escort.y, d = Math.hypot(dx, dy), step = Math.min(d, escort.speed * 0.25);
  escort.vx = d ? dx / d * escort.speed : 0;
  escort.vy = d ? dy / d * escort.speed : 0;
  escort.heading = Math.atan2(dy, dx);
  if (d) {
    escort.x += dx / d * step;
    escort.y += dy / d * step;
  }
  if (d < 0.12) {
    escort.x = target.x;
    escort.y = target.y;
    escort.rescued = true;
    escort.vx = 0;
    escort.vy = 0;
  }
}
function SWSagaObjective(input, units, time, finished = false) {
  const saga = input.saga;
  if (!saga) return null;
  const escort = units.find((u) => u.id === "saga-escort"), keep = units.find((u) => u.kind === "keep" && u.building), flagship = units.find((u) => u.shipId === "flagship"), battery = units.find((u) => u.id === "shore-battery");
  let won = false, failed = false, progress = 0, label = saga.label;
  if (saga.mode === "hold") {
    failed = !!keep && keep.hp <= 0;
    won = !failed && (time >= saga.holdSeconds || finished);
    progress = Math.min(1, time / saga.holdSeconds);
    label = failed ? "The Keep has fallen" : Math.max(0, Math.ceil(saga.holdSeconds - time)) + "s · Hold the Keep";
  }
  if (saga.mode === "rescue") {
    won = !!escort?.rescued && escort.hp > 0;
    failed = !!escort && escort.hp <= 0;
    progress = escort ? Math.min(1, Math.max(0, (3 - escort.x) / 5)) : 0;
    label = failed ? "The engineer was lost" : escort ? "Protect the engineer · " + Math.round(progress * 100) + "% to safety" : "Break the holding house";
  }
  if (saga.mode === "escort") {
    won = !!escort?.rescued && escort.hp > 0;
    failed = !!escort && escort.hp <= 0;
    progress = escort ? Math.min(1, Math.max(0, (5 - escort.y) / 6.1)) : 0;
    label = failed ? "The repair vessel was lost" : battery?.hp > 0 ? "Silence the shore battery" : "Protect the repair vessel · " + Math.round(progress * 100) + "%";
  }
  if (saga.mode === "blockade") {
    won = !!keep && keep.hp <= 0 && !!flagship && flagship.hp <= 0;
    progress = (+(keep?.hp <= 0) + +(flagship?.hp <= 0)) / 2;
    label = (keep?.hp <= 0 ? "Signal fort captured" : "Capture the signal fort") + " · " + (flagship?.hp <= 0 ? "Flagship sunk" : "Sink the flagship");
  }
  const health = escort ? Math.max(0, escort.hp / escort.maxHp) : null;
  if (input.retreatAt !== void 0 && time >= input.retreatAt) {
    won = false;
    failed = true;
    label = "Expedition withdrawn";
  }
  if (won && saga.trialId) {
    const alive = units.filter((u) => u.side === "attack" && !u.building && !u.naval && u.kind !== "hero" && !u.sagaEscort && u.hp > 0).length;
    const pass = saga.trialId === "swift-rescue" ? time <= 32 : saga.trialId === "safe-passage" ? health >= 0.6 : time <= 45 && alive >= Nl(input.army) / 2;
    if (!pass) {
      won = false;
      failed = true;
      label = "Objective secured · mastery condition missed";
    }
  }
  return { missionId: saga.missionId, mode: saga.mode, label, won, failed, complete: won || failed, progress, escortHealth: health, trialId: saga.trialId };
}
function SWSagaSettle(state, input, result, now = Date.now()) {
  if (input.saga?.version !== 12 || !SWChapterMissions.some((m) => m.id === input.saga.missionId && m.type === "battle")) throw Error("Invalid expedition.");
  const p = SWMigratePremium(state), id = input.saga.missionId, record = p.chapter.records[id] || {}, objective = result.objective;
  if (!objective || objective.missionId !== id) throw Error("Expedition result is missing its objective.");
  const won = !!result.won && !!objective.won;
  const reward = { gold: 0, wood: 0, stone: 0, food: 0 };
  if (input.saga.trialId) {
    const trial = SWTrialDefinitions.find((t) => t.id === input.saga.trialId && t.missionId === id);
    if (!trial) throw Error("Invalid mastery trial.");
    const prior = p.trials[trial.id] || {};
    if (won) {
      p.trials[trial.id] = { completed: true, bestSeconds: Math.min(prior.bestSeconds || Infinity, result.duration), completedAt: prior.completedAt || now };
      if (!prior.completed) state.gems = (state.gems || 0) + trial.reward.gems;
      if (SWTrialDefinitions.every((t) => p.trials[t.id]?.completed)) SWOwnCosmetic(state, "commander:veteran", "mastery");
    }
    return { reward, won, trialId: trial.id, firstClear: won && !prior.completed };
  }
  if (won) {
    if (!p.chapter.completed.includes(id)) p.chapter.completed.push(id);
    p.chapter.records[id] = { ...record, completedAt: record.completedAt || now, bestSeconds: Math.min(record.bestSeconds || Infinity, result.duration), stars: Math.max(record.stars || 0, result.stars || 1), escortHealth: Math.max(record.escortHealth || 0, objective.escortHealth || 0) };
  }
  return { reward, won, missionId: id, firstClear: won && !record.completedAt };
}
var SWResidentStoryDefinitions = [
  { id: "crew-supper", title: "A place at the table", characterId: "captain", keep: 1, description: "Mara’s watch has worked through the night. Help the neighborhood welcome them home.", duration: 30, choices: [{ id: "feast", label: "Cook a harbor supper", description: "Share your harvest with the watch.", cost: { gold: 0, wood: 10, stone: 0, food: 120 } }, { id: "supplies", label: "Stock their mess hall", description: "Pay the market to prepare supplies.", cost: { gold: 90, wood: 10, stone: 0, food: 30 } }], reward: { resources: { gold: 90, wood: 50, stone: 20, food: 0 }, gems: 5 }, ending: "Lanterns stay lit around the commons. The watch finally sits down to eat." },
  { id: "cartwright", title: "Wheels for the waterfront", characterId: "engineer", keep: 2, description: "Bram can repair the old cargo carts or commission lighter ones for the new road.", duration: 45, choices: [{ id: "repair", label: "Restore the old carts", description: "Use timber and meals for the crew.", cost: { gold: 10, wood: 90, stone: 10, food: 60 } }, { id: "commission", label: "Commission new wheels", description: "Pay local craftspeople for a lighter design.", cost: { gold: 120, wood: 40, stone: 20, food: 40 } }], reward: { resources: { gold: 140, wood: 0, stone: 80, food: 0 }, gems: 6 }, ending: "Loaded carts start arriving at the harbor. Bram insists every wheel is perfectly round." },
  { id: "watch-path", title: "The watcher’s path", characterId: "ranger", keep: 2, description: "Elowen found an overgrown path between the orchards and the shore.", duration: 45, choices: [{ id: "clear", label: "Clear the path", description: "Feed a team and bridge the wet ground.", cost: { gold: 0, wood: 60, stone: 20, food: 110 } }, { id: "mark", label: "Set stone waymarkers", description: "Create a durable trail for travelers.", cost: { gold: 60, wood: 15, stone: 90, food: 50 } }], reward: { resources: { gold: 80, wood: 120, stone: 0, food: 0 }, gems: 6, cosmetics: ["banner:green"] }, ending: "Green ribbons lead travelers safely between the trees. Elowen leaves the first map at the tavern." },
  { id: "storm-square", title: "After the rain", characterId: "captain", keep: 3, description: "A storm has damaged the market awnings. The traders have asked the city for help.", duration: 60, choices: [{ id: "timber", label: "Raise timber shelters", description: "Build sturdy new market frames.", cost: { gold: 20, wood: 140, stone: 30, food: 80 } }, { id: "stone", label: "Repair the arcade", description: "Give the square permanent cover.", cost: { gold: 90, wood: 30, stone: 130, food: 60 } }], reward: { resources: { gold: 190, wood: 30, stone: 30, food: 0 }, gems: 8, cosmetics: ["ornament:planter"] }, ending: "The market opens beneath new cover. Someone plants flowers beside the repaired stalls." },
  { id: "ship-launch", title: "A name for the sea", characterId: "engineer", keep: 3, description: "The shipwrights are ready to launch a new merchant boat. Its first voyage needs a proper send-off.", duration: 60, choices: [{ id: "gather", label: "Gather the neighborhood", description: "Prepare a shared meal and decorate the quay.", cost: { gold: 40, wood: 60, stone: 0, food: 180 } }, { id: "outfit", label: "Outfit the crew", description: "Provide warm supplies and working tools.", cost: { gold: 120, wood: 110, stone: 25, food: 80 } }], reward: { resources: { gold: 180, wood: 80, stone: 50, food: 0 }, gems: 8, cosmetics: ["ornament:lantern"] }, ending: "The bell rings as the hull touches water. The crew names her Homeward." },
  { id: "beacon-bell", title: "The bell keeper", characterId: "ranger", keep: 4, description: "Elowen has found the family that once tended the beacon. They are ready to return.", duration: 90, choices: [{ id: "home", label: "Prepare their home", description: "Restore the keeper’s cottage.", cost: { gold: 70, wood: 150, stone: 100, food: 100 } }, { id: "workshop", label: "Restore their workshop", description: "Make a place for the old bell to be repaired.", cost: { gold: 160, wood: 80, stone: 150, food: 60 } }], reward: { resources: { gold: 240, wood: 60, stone: 60, food: 0 }, gems: 10, cosmetics: ["banner:ivory"] }, ending: "For the first time in a generation, the beacon bell answers the ships in the harbor." }
];
function SWResidentStories(state, now = state.lastTick || Date.now()) {
  const p = SWPremium(state);
  return SWResidentStoryDefinitions.map((s, index) => {
    const record = p.stories[s.id], requirements = [{ label: "Keep level " + s.keep, met: Ml(state) >= s.keep }, ...index ? [{ label: "Complete " + SWResidentStoryDefinitions[index - 1].title, met: !!p.stories[SWResidentStoryDefinitions[index - 1].id]?.claimed }] : []];
    return { ...s, record, requirements, status: record?.claimed ? "complete" : record?.readyAt ? record.readyAt <= now ? "claimable" : "building" : requirements.every((r) => r.met) ? "available" : "locked", readyAt: record?.readyAt, reason: requirements.find((r) => !r.met)?.label || null };
  });
}
function SWEvents(state, now = state.lastTick || Date.now()) {
  const p = SWPremium(state), stories = Object.values(p.stories).filter((s) => s.claimed).length, trials = Object.values(p.trials).filter((t) => t.completed).length;
  const list = [{ id: "harbor-festival", title: "Harbor festival", description: "Bring the neighborhoods together through six resident stories.", progress: stories, target: 6, thresholds: [2, 4, 6], rewards: [{ gems: 5 }, { gems: 10 }, { gems: 15, cosmetics: ["ornament:standard"] }] }, { id: "siege-trials", title: "The captain’s trials", description: "Master three fixed-army challenges. Retry freely.", progress: trials, target: 3, thresholds: [1, 2, 3], rewards: [{ gems: 5 }, { gems: 8 }, { gems: 12, cosmetics: ["commander:veteran"] }] }, { id: "beacon-restoration", title: "Lights along the coast", description: "Complete the six missions of The Broken Beacon.", progress: p.chapter.claimed.length, target: 6, thresholds: [2, 4, 6], rewards: [{ gems: 5 }, { gems: 8 }, { gems: 12, cosmetics: ["banner:red"] }] }];
  return list.map((event, index) => ({ ...event, featured: Math.floor(now / 6048e5) % 3 === index, endsAt: null, completed: event.progress >= event.target, tiers: event.thresholds.map((target, i) => ({ id: String(i + 1), target, reward: event.rewards[i], claimed: !!p.events[event.id]?.includes(String(i + 1)), claimable: event.progress >= target && !p.events[event.id]?.includes(String(i + 1)) })) }));
}
function SWPremiumReward(state, reward, source) {
  const resources2 = reward?.resources || {};
  state.reserveCrates ||= { gold: 0, wood: 0, stone: 0, food: 0 };
  const delivered = { gold: 0, wood: 0, stone: 0, food: 0 };
  for (const k of xl) {
    const amount = Math.max(0, resources2[k] || 0), room = Math.max(0, SWCapacity(state) - state.resources[k]), put = Math.min(room, amount);
    state.resources[k] += put;
    state.reserveCrates[k] = (state.reserveCrates[k] || 0) + amount - put;
    delivered[k] = put;
  }
  state.gems = (state.gems || 0) + (reward?.gems || 0);
  for (const id of reward?.cosmetics || []) SWOwnCosmetic(state, id, source);
  return delivered;
}
function SWMedievalFinale(state) {
  const p = SWPremium(state), requirements = [{ label: "Reach Keep level 10", met: Ml(state) >= 10, action: "building", buildKind: "keep" }, { label: "Complete either the Land or Sea campaign", met: state.campaign >= Tl.length || state.seaCampaign >= 10, action: state.seaCampaign > state.campaign ? "sea" : "frontier" }, { label: "Relight the Broken Beacon", met: !!p.chapter.finaleClaimed, action: "chronicle" }];
  return { id: "crown-of-the-coast", title: "Crown of the coast", description: "The medieval coast stands united. Complete this age and record your kingdom in the chronicle.", requirements, status: p.eraCompletedAt ? "complete" : requirements.every((r) => r.met) ? "claimable" : "locked", reward: { gems: 50, cosmetics: ["commander:laurel", "banner:ivory", "banner:beacon-crown"] }, storyAfter: [{ speaker: "Mara Ironward", text: "Every light along the coast answers ours. These people no longer need a refuge. They have a home." }, { speaker: "Bram Flint", text: "A merchant brought drawings of a curious new powder. That is a story for another age." }], mastery: { districts: SWCivicProjects.filter((d) => SWCivicStage(state, d.id) === 3).length, districtTarget: 4, stories: Object.values(p.stories).filter((s) => s.claimed).length, storyTarget: 6, trials: Object.values(p.trials).filter((t) => t.completed).length, trialTarget: 3, land: Math.min(10, state.campaign || 0), sea: Math.min(10, state.seaCampaign || 0), campaignTarget: 10 } };
}
function SWPremiumAction(state, action, now) {
  if (!["buyCosmetic", "buyGemCollection", "equipCosmetic", "placeOrnament", "removeOrnament", "advanceMission", "claimMission", "claimChapter", "startResidentStory", "claimResidentStory", "claimEvent", "claimEraFinale", "dismissScene"].includes(action.type)) return false;
  const p = SWMigratePremium(state);
  if (action.type === "buyCosmetic") {
    const item = SWPremiumCatalog.find((i) => i.id === action.id), status = SWCosmeticStatus(state, action.id);
    if (status.owned) throw Error("You already own this appearance.");
    if (!status.canBuy) throw Error(status.reason || "Unavailable.");
    if (action.maxPrice !== item.priceGems) throw Error("The price changed. Review the item again.");
    state.gems -= item.priceGems;
    SWOwnCosmetic(state, item.id, "gems");
  } else if (action.type === "buyGemCollection") {
    const quote = SWCollectionQuote17(state, action.id);
    if (!quote.canBuy) throw Error(quote.reason);
    if (action.maxPrice !== quote.priceGems) throw Error("The price changed. Review the collection again.");
    state.gems -= quote.priceGems;
    for (const item of quote.missing) SWOwnCosmetic(state, item.id, "gems:collection:" + action.id);
  } else if (action.type === "equipCosmetic") {
    const item = SWPremiumCatalog.find((i) => i.id === action.id);
    if (!item || !p.owned.includes(item.id)) throw Error("Unlock this appearance first.");
    if (item.slot === "ornament") throw Error("Place this decoration on an empty plot.");
    p.equipped[item.slot] = item.id;
  } else if (action.type === "placeOrnament") {
    const item = SWPremiumCatalog.find((i) => i.id === action.id);
    if (!item || item.slot !== "ornament" || !p.owned.includes(item.id)) throw Error("Unlock this decoration first.");
    if (!Number.isInteger(action.x) || !Number.isInteger(action.y) || !Vc(state, action.x, action.y) || state.buildings.some((b) => b.x === action.x && b.y === action.y) || (state.terrain || []).some((t) => t.x === action.x && t.y === action.y && t.kind !== "road") || p.ornaments.some((o) => o.x === action.x && o.y === action.y)) throw Error("Choose an empty land plot or a road edge.");
    if (p.ornaments.length >= 40 || p.ornaments.filter((o) => o.itemId === item.id).length >= 12) throw Error("Decoration limit reached. Move or remove an existing piece.");
    p.ornaments.push({ id: "ornament-" + now + "-" + state.revision, itemId: item.id, kind: item.value, x: action.x, y: action.y, facing: SWFacing(action.facing) });
  } else if (action.type === "removeOrnament") {
    if (!p.ornaments.some((o) => o.id === action.placementId)) throw Error("Decoration not found.");
    p.ornaments = p.ornaments.filter((o) => o.id !== action.placementId);
  } else if (action.type === "advanceMission") {
    const mission = SWChapter(state).missions.find((m) => m.id === action.id);
    if (!mission || mission.type !== "city" || mission.status !== "available") throw Error("This city objective is not ready.");
    Q(state, mission.cost);
    p.chapter.completed.push(mission.id);
    p.chapter.records[mission.id] = { completedAt: now };
  } else if (action.type === "claimMission") {
    const mission = SWChapter(state).missions.find((m) => m.id === action.id);
    if (!mission || mission.status !== "claimable") throw Error("This mission reward is not ready or was already collected.");
    p.chapter.claimed.push(mission.id);
    SWPremiumReward(state, mission.reward, "mission:" + mission.id);
  } else if (action.type === "claimChapter") {
    if (p.chapter.claimed.length !== SWChapterMissions.length || p.chapter.finaleClaimed) throw Error("Complete and collect all six missions first.");
    p.chapter.finaleClaimed = true;
    p.chapter.finishedAt = now;
    SWPremiumReward(state, { gems: 25, cosmetics: ["sail:black", "ornament:statue"] }, "chapter");
  } else if (action.type === "startResidentStory") {
    const story = SWResidentStories(state, now).find((s) => s.id === action.id), choice = story?.choices.find((c) => c.id === action.choice);
    if (!story || story.status !== "available" || !choice) throw Error("Choose an available resident story and response.");
    if (Object.values(p.stories).some((s) => s.readyAt && !s.claimed)) throw Error("Finish your current resident story first.");
    Q(state, choice.cost);
    p.stories[story.id] = { choice: choice.id, startedAt: now, readyAt: now + story.duration * 1e3 };
  } else if (action.type === "claimResidentStory") {
    const story = SWResidentStories(state, now).find((s) => s.id === action.id);
    if (!story || story.status !== "claimable") throw Error("This story reward is not ready or was already collected.");
    p.stories[story.id].claimed = true;
    p.stories[story.id].completedAt = now;
    SWPremiumReward(state, story.reward, "story:" + story.id);
    state.city = { ...SWCity(state), jobs: (SWCity(state).jobs || 0) + 1 };
  } else if (action.type === "claimEvent") {
    const event = SWEvents(state, now).find((e) => e.id === action.id), tier = event?.tiers.find((t) => t.id === String(action.tier));
    if (!tier?.claimable) throw Error("This event reward is not ready or was already collected.");
    p.events[event.id] = [...p.events[event.id] || [], tier.id];
    SWPremiumReward(state, tier.reward, "event:" + event.id + ":" + tier.id);
  } else if (action.type === "claimEraFinale") {
    const finale = SWMedievalFinale(state);
    if (finale.status !== "claimable") throw Error("Complete the medieval age requirements first.");
    p.eraCompletedAt = now;
    SWPremiumReward(state, finale.reward, "era:medieval");
  } else if (action.type === "dismissScene") {
    if (typeof action.id !== "string" || !SWChapterMissions.some((m) => action.id === m.id + ":before" || action.id === m.id + ":after")) throw Error("Unknown story scene.");
    if (!p.seenScenes.includes(action.id)) p.seenScenes.push(action.id);
  }
  return true;
}
function SWLegacyUl13(e, t, n = Date.now()) {
  let r = Y(e, n), i = Lc(r) >= Ic(r);
  if (SWPremiumAction(r, t, n)) {
    r.revision++;
    return r;
  }
  if (SWCivicProjectAction(r, t, n)) {
    r.revision++;
    return r;
  }
  if (t.type === "claimReserve") {
    SWClaimReserve(r);
    r.revision++;
    return r;
  }
  if (SWCityAction(r, t, n)) {
    r.revision++;
    return Y(r, n);
  }
  if (SWApplyTrade(r, t)) {
    r.revision++;
    return Y(r, n);
  }
  if (ApplyGemAction(r, t, n)) {
    r.revision++;
    return Y(r, n);
  }
  if (ol(r, t, n)) return r.revision++, r;
  if (t.type === `walls`) {
    if (i) throw Error(`All construction crews are working.`);
    let e2 = t.tiles;
    if (!Array.isArray(e2) || !e2.length || e2.length > 24)
      throw Error(`Draw between 1 and 24 wall segments.`);
    let a = /* @__PURE__ */ new Set();
    for (let t2 = 0; t2 < e2.length; t2++) {
      let n2 = e2[t2];
      if (!n2 || !Vc(r, n2.x, n2.y) || al(r, n2.x, n2.y) || r.buildings.some((e3) => e3.x === n2.x && e3.y === n2.y) || (r.premium?.ornaments || []).some((o2) => o2.x === n2.x && o2.y === n2.y) || a.has(`${n2.x},${n2.y}`))
        throw Error(`Walls need empty plots in your territory.`);
      if (t2 && Math.abs(n2.x - e2[t2 - 1].x) + Math.abs(n2.y - e2[t2 - 1].y) !== 1)
        throw Error(`Draw one connected wall.`);
      a.add(`${n2.x},${n2.y}`);
    }
    if (SWBuildingCount(r, "wall") + e2.length > SWBuildingLimit(r, "wall"))
      throw Error(`Wall limit reached. Upgrade your Keep to unlock more segments.`);
    Q(r, { gold: 4 * e2.length, wood: 0, stone: 8 * e2.length, food: 0 });
    let o = `wall-project-${n}-${r.revision}`;
    for (let t2 = 0; t2 < e2.length; t2++) {
      let i2 = e2[t2], a2 = e2[t2 + 1] || e2[t2 - 1];
      r.buildings.push({
        id: `${o}-${t2}`,
        kind: `wall`,
        ...i2,
        level: 0,
        targetLevel: 1,
        startedAt: n,
        readyAt: n + Zc(r, `wall`) * 1e3,
        projectId: o,
        axis: a2 && a2.x !== i2.x ? `x` : `y`,
        facing: a2 && a2.x !== i2.x ? 0 : 1
      });
    }
  } else if (t.type === `gate`) {
    let e2 = r.buildings.find((e3) => e3.id === t.id);
    if (!e2 || e2.kind !== `wall` || e2.readyAt)
      throw Error(`Select a completed wall to add a gate.`);
    if (i) throw Error(`All construction crews are working.`);
    if (SWBuildingCount(r, "gate") >= SWBuildingLimit(r, "gate"))
      throw Error(`Gate limit reached. Upgrade your Keep to unlock more.`);
    Q(r, Sl.gate.cost), e2.kind = `gate`, e2.targetLevel = e2.level, e2.startedAt = n, e2.readyAt = n + Zc(r, `gate`) * 1e3;
  } else if (t.type === `rotate`) {
    let e2 = r.buildings.find((e3) => e3.id === t.id);
    if (!e2) throw Error(`Choose a building, wall or gate.`);
    e2.facing = (SWFacing(e2.facing, e2.axis === `y` ? 1 : 0) + 1) % 4;
    if (zc(e2)) e2.axis = e2.facing % 2 ? `y` : `x`;
  } else if (t.type === `specialize`) {
    let e2 = r.buildings.find((e3) => e3.id === t.id);
    if (!e2 || e2.kind !== `tower` || e2.level < 2 || e2.readyAt)
      throw Error(`Complete a level 2 watchtower first.`);
    if (![`ballista`, `volley`].includes(t.specialty || ``))
      throw Error(`Choose a tower specialization.`);
    if (e2.specialty === t.specialty)
      throw Error(`This tower already has that specialization.`);
    Q(r, { gold: 120, wood: 0, stone: 100, food: 0 }), e2.specialty = t.specialty;
  } else if (t.type === `developProvince`) {
    let e2 = r.provinces?.find((e3) => e3.id === t.id);
    if (!e2 || e2.level >= 10)
      throw Error(`Choose an owned province below level 10.`);
    if (e2.level >= Ml(r))
      throw Error(`Upgrade your keep before developing this outpost.`);
    Q(r, Uc(e2.level)), e2.level++;
  } else if (t.type === `commander`) {
    let e2 = t.id;
    if (!Object.hasOwn(Oc, e2)) throw Error(`Choose a commander.`);
    if (r.activeBattle) throw Error(`Your commander is on the battlefield.`);
    if (Ml(r) < Oc[e2].unlock)
      throw Error(`Requires keep level ${Oc[e2].unlock}.`);
    Wc(r, e2) || (Q(r, { gold: 200, wood: 0, stone: 0, food: 80 }), r.commanders = {
      ...r.commanders,
      [e2]: { xp: 0, gear: `armor`, owned: [`armor`] }
    }), r.commander = e2;
  } else if (t.type === `gear`) {
    let e2 = t.id || r.commander || `captain`, n2 = Wc(r, e2);
    if (!Object.hasOwn(Oc, e2) || !n2 || !t.gear || !Object.hasOwn(kc, t.gear))
      throw Error(`Choose valid commander equipment.`);
    if (r.activeBattle) throw Error(`Change equipment after the battle.`);
    let i2 = { ...n2, owned: [...n2.owned] };
    i2.owned.includes(t.gear) || (Q(r, kc[t.gear].cost), i2.owned.push(t.gear)), i2.gear = t.gear, r.commanders = { ...r.commanders, [e2]: i2 };
  } else if (t.type === `claimCosmetic`) {
    let e2 = jc.find((e3) => e3.id === t.id);
    if (!e2 || r.cosmetics?.includes(e2.id) || (r.season?.points || 0) < e2.points)
      throw Error(`Earn this league reward first.`);
    r.cosmetics = [...r.cosmetics || [], e2.id], e2.id !== `monument` && (r.livery = e2.id);
  } else if (t.type === `livery`) {
    if (t.id !== `default` && !r.cosmetics?.includes(t.id || ``))
      throw Error(`Earn this livery first.`);
    r.livery = t.id;
  } else if (t.type === `build`) {
    let e2 = t.kind;
    if (!Object.hasOwn(Sl, e2) || e2 === `keep`)
      throw Error(`Choose a valid building.`);
    let a = Sl[e2];
    if (e2 === `monument` && !r.cosmetics?.includes(`monument`))
      throw Error(`Earn the Victor’s standard in the weekly league.`);
    if (t.axis !== void 0 && ![`x`, `y`].includes(t.axis))
      throw Error(`Choose a valid orientation.`);
    if (Ml(r) < a.unlock) throw Error(`Requires keep level ${a.unlock}.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (!SWCanPlace(r, e2, t.x, t.y))
      throw Error(e2 === `harbor` ? `Choose an empty coastal berth beside your capital.` : `Choose an empty land plot.`);
    if (SWBuildingCount(r, e2) >= SWBuildingLimit(r, e2)) throw Error(`${a.name} limit reached (${SWBuildingLimit(r, e2)} at Keep ${Ml(r)}).`);
    const facing = SWFacing(t.facing, t.axis === "y" ? 1 : 0);
    Q(r, X(e2)), r.buildings.push({
      id: `b-${n}-${r.revision}`,
      kind: e2,
      x: t.x,
      y: t.y,
      level: 0,
      targetLevel: 1,
      startedAt: n,
      readyAt: n + Zc(r, e2) * (1 - Math.min(0.3, SWCivicLevel(r, "workshop") * 0.03)) * 1e3,
      facing,
      ...e2 === `wall` || e2 === `gate` ? { axis: facing % 2 ? `y` : `x` } : {}
    });
  } else if (t.type === `upgrade`) {
    let e2 = r.buildings.find((e3) => e3.id === t.id);
    if (!e2) throw Error(`Building not found.`);
    if (e2.readyAt) throw Error(`This building is under construction.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (e2.level >= Sl[e2.kind].max)
      throw Error(`This building is fully upgraded.`);
    if (e2.kind !== `keep` && e2.level >= Ml(r))
      throw Error(`Upgrade your keep first.`);
    if (e2.kind === `keep` && e2.level === 1 && !r.buildings.some((e3) => e3.kind === `barracks` && e3.level > 0))
      throw Error(`Complete a barracks before advancing your age.`);
    let a = $c(r, e2);
    if (a) throw Error(a);
    if (xl.some((k) => X(e2.kind, e2.level + 1)[k] > Fl(r))) throw Error("Expand your storehouses before this upgrade.");
    Q(r, X(e2.kind, e2.level + 1)), e2.targetLevel = e2.level + 1, e2.startedAt = n, e2.readyAt = n + Zc(r, e2.kind, e2.level + 1) * (1 - Math.min(0.3, SWCivicLevel(r, "workshop") * 0.03)) * 1e3;
  } else if (t.type === `move`) {
    let e2 = r.buildings.find((e3) => e3.id === t.id);
    if (!e2) throw Error(`Building not found.`);
    if (!SWCanPlace(r, e2.kind, t.x, t.y, e2.id))
      throw Error(e2.kind === `harbor` ? `Move your shipyard to another coastal berth.` : `Choose an empty land plot.`);
    e2.facing = SWFacing(t.facing, e2.facing || 0);
    if (zc(e2)) e2.axis = e2.facing % 2 ? `y` : `x`;
    e2.x = t.x, e2.y = t.y;
  } else if (t.type === `recruit`) {
    if (r.activeBattle)
      throw Error(`Finish your battle before recruiting more soldiers.`);
    let e2 = t.kind, n2 = J[e2], i2 = t.count === void 0 ? 1 : t.count;
    if (!Object.hasOwn(J, e2) || !Number.isInteger(i2) || i2 < 1 || i2 > 10)
      throw Error(`Choose a valid troop count.`);
    if (!r.buildings.some((e3) => e3.kind === `barracks` && e3.level > 0))
      throw Error(`Build a barracks first.`);
    if (Ml(r) < n2.unlock) throw Error(`Requires keep level ${n2.unlock}.`);
    if (e2 === `cannon` && !r.buildings.some((e3) => e3.kind === `forge` && e3.level > 0))
      throw Error(`Build a foundry to train cannons.`);
    if (Nl(r.army) + i2 > Pl(r))
      throw Error(`Upgrade or build another barracks for more army capacity.`);
    Q(r, Object.fromEntries(xl.map((e3) => [e3, n2.cost[e3] * i2]))), r.army[e2] += i2;
  } else if (t.type === `claim`) {
    let e2 = El.find((e3) => e3.id === t.id);
    if (!e2 || r.quests.includes(e2.id) || !e2.check(r))
      throw Error(`Complete this objective before claiming it.`);
    SWRequireRoom(r, e2.reward);
    r.quests.push(e2.id), Ll(r, e2.reward), r.gems += 8;
  } else if (t.type === `claimAchievement`) {
    let e2 = Dl.find((e3) => e3.id === t.id);
    if (!e2 || r.honors?.includes(e2.id) || Ol(r, e2) < e2.target)
      throw Error(`Earn this achievement before collecting its reward.`);
    SWRequireRoom(r, e2.reward);
    r.honors = [...r.honors || [], e2.id], Ll(r, e2.reward), r.gems += 15;
  } else if (t.type === `rename`) {
    let e2 = (t.name || ``).trim();
    if (e2.length < 2 || e2.length > 24 || /[<>\x00-\x1f]/.test(e2))
      throw Error(`Use a kingdom name between 2 and 24 characters.`);
    r.name = e2;
  } else if (t.type === `publish`) {
    if (!r.buildings.some((e2) => e2.kind === `tower` && e2.level > 0))
      throw Error(`Complete a watchtower before publishing your defenses.`);
    r.published = true;
  } else if (t.type === `unpublish`) r.published = false;
  else if (t.type !== `tick`) throw Error(`Unknown action.`);
  return r.revision++, r;
}
function Wl(e) {
  return {
    name: e.name,
    level: Ml(e),
    rating: e.rating,
    provinces: e.provinces,
    livery: e.livery,
    appearance: SWAppearance(e),
    buildings: e.buildings.filter((e2) => e2.level > 0).map((e2) => ({
      id: e2.id,
      kind: e2.kind,
      x: e2.x,
      y: e2.y,
      level: e2.level,
      axis: e2.axis,
      facing: e2.facing,
      specialty: e2.specialty
    }))
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
  let t = [], n = e.seed >>> 0, r = () => (n = 1664525 * n + 1013904223 >>> 0, n / 4294967296);
  for (let n2 of e.defense.buildings) {
    let e2 = (n2.kind === `keep` ? 420 : n2.kind === `tower` ? 135 : 95) * (1 + (n2.level - 1) * 0.45);
    t.push({
      id: n2.id,
      side: `defend`,
      kind: n2.kind,
      x: n2.x,
      y: n2.y,
      hp: e2,
      maxHp: e2,
      damage: n2.kind === `tower` ? 12 * (1 + 0.25 * (n2.level - 1)) : n2.kind === `keep` ? 6 : 0,
      range: n2.kind === `tower` ? 3.25 : 2.1,
      speed: 0,
      cooldown: n2.kind === `tower` ? 1.25 : 1.65,
      nextAttack: r(),
      building: true,
      level: n2.level
    });
  }
  let i = e.front === `left` ? { x: -0.7, y: 6.8 } : e.front === `right` ? { x: 6.8, y: -0.7 } : { x: 7.4, y: 7.4 }, a = 0;
  for (let n2 of Object.keys(J)) {
    let o2 = J[n2];
    for (let s2 = 0; s2 < e.army[n2]; s2++)
      t.push({
        id: `a-${a}`,
        side: `attack`,
        kind: n2,
        x: i.x + (r() - 0.5) * 1.1 + (e.rulesVersion === 2 ? (a % 4 - 1.5) * 0.38 : 0),
        y: i.y + (r() - 0.5) * 1.1 + (e.rulesVersion === 2 ? Math.floor(a / 4) * 0.3 : 0),
        hp: o2.hp,
        maxHp: o2.hp,
        damage: o2.damage * e.bonus,
        range: o2.range,
        speed: o2.speed,
        cooldown: o2.cooldown,
        nextAttack: r(),
        building: false,
        level: 1
      }), a++;
  }
  let o = Math.min(
    5,
    1 + e.defense.buildings.filter((e2) => e2.kind === `barracks`).length * 2 + Math.max(0, e.defense.level - 1)
  );
  for (let n2 = 0; n2 < o; n2++)
    t.push({
      id: `guard-${n2}`,
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
      building: false,
      level: e.defense.level
    });
  let s = [], c = 0, l = e.defense.buildings.length, u = [], d = false;
  for (let n2 = 0; n2 <= 180; n2++) {
    if (c = n2 * 0.25, e.rallyAt !== void 0 && !d && c >= e.rallyAt) {
      for (let e2 of t.filter((e3) => e3.side === `attack` && e3.hp > 0))
        e2.hp = Math.min(e2.maxHp, e2.hp + e2.maxHp * 0.3);
      d = true;
    }
    let r2 = t.filter((e2) => e2.hp > 0);
    for (let t2 of r2) {
      if (t2.hp <= 0 || !t2.damage) continue;
      let n3 = r2.filter((e2) => e2.side !== t2.side && e2.hp > 0);
      if (!n3.length) continue;
      let i3, a3 = 1 / 0;
      for (let e2 of n3) {
        let n4 = Math.hypot(e2.x - t2.x, e2.y - t2.y);
        t2.kind === `cannon` && !e2.building && (n4 += 2), n4 < a3 && (a3 = n4, i3 = e2);
      }
      if (!i3) continue;
      let o2 = i3.x - t2.x, s2 = i3.y - t2.y, l2 = Math.hypot(o2, s2), f2 = t2.range + (i3.building ? 0.3 : 0);
      if (l2 > f2) {
        if (!t2.building && t2.speed) {
          let n4 = t2.speed * 0.25 * (t2.side === `attack` && d && e.rallyAt !== void 0 && c < e.rallyAt + 7 ? 1.25 : 1);
          t2.x += o2 / l2 * Math.min(n4, l2 - f2), t2.y += s2 / l2 * Math.min(n4, l2 - f2);
        }
      } else if (c >= t2.nextAttack) {
        let n4 = t2.side === `attack` && d && e.rallyAt !== void 0 && c < e.rallyAt + 7 ? 1.3 : 1;
        i3.hp = Math.max(
          0,
          i3.hp - t2.damage * n4 * (t2.kind === `cannon` && i3.building ? 2 : 1)
        ), t2.nextAttack = c + t2.cooldown, u.push({
          x: t2.x,
          y: t2.y,
          tx: i3.x,
          ty: i3.y,
          side: t2.side,
          kind: t2.kind
        });
      }
    }
    if (e.rulesVersion === 2) {
      let e2 = t.filter((e3) => !e3.building && e3.hp > 0);
      for (let t2 = 0; t2 < e2.length; t2++)
        for (let n3 = t2 + 1; n3 < e2.length; n3++) {
          let r3 = e2[t2], i3 = e2[n3], a3 = r3.x - i3.x, o2 = r3.y - i3.y, s2 = Math.hypot(a3, o2);
          if (s2 > 0 && s2 < 0.36) {
            let e3 = (0.36 - s2) * 0.2;
            r3.x += a3 / s2 * e3, r3.y += o2 / s2 * e3, i3.x -= a3 / s2 * e3, i3.y -= o2 / s2 * e3;
          }
        }
    }
    let i2 = t.filter(
      (e2) => e2.side === `defend` && e2.building && e2.hp > 0
    ).length, a2 = Math.round((l - i2) / l * 100);
    if (n2 % 2 == 0 && (s.push({ time: c, units: jl(t), shots: u, destruction: a2 }), u = []), !t.some((e2) => e2.side === `attack` && e2.hp > 0) || i2 === 0)
      break;
  }
  let f = t.find((e2) => e2.building && e2.kind === `keep`), p = !!f && f.hp <= 0, m = Math.round(
    t.filter((e2) => e2.side === `defend` && e2.building && e2.hp <= 0).length / l * 100
  ), h = { infantry: 0, archer: 0, cavalry: 0, cannon: 0 };
  for (let e2 of t) e2.side === `attack` && e2.hp > 0 && h[e2.kind]++;
  return s.push({ time: c, units: jl(t), shots: [], destruction: m }), {
    won: p,
    stars: p ? m === 100 ? 3 : 2 : +(m >= 50),
    destruction: m,
    survivors: h,
    frames: s,
    duration: c
  };
}
function Jl(e, t, n = 0.65) {
  return Object.fromEntries(
    Object.keys(J).map((r) => [
      r,
      (t[r] || 0) + (n === 0.65 ? Math.ceil : Math.floor)(
        Math.max(0, (e[r] || 0) - (t[r] || 0)) * n
      )
    ])
  );
}
var SWCoast = Object.freeze({
  slots: [{ x: -2, y: 2 }, { x: -2, y: 4 }, { x: -2, y: 6 }],
  focus: { x: 350, y: 220 }
});
function SWIsCoastSlot(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && SWCoast.slots.some((s) => s.x === x && s.y === y);
}
function SWWalkable(state, x, y) {
  return Vc(state, x, y) || Number.isInteger(x) && Number.isInteger(y) && (x === -1 && y >= 1 && y <= 6 || SWIsCoastSlot(x, y));
}
function SWCanPlace(state, kind, x, y, ignoreId) {
  return (kind === "harbor" ? SWIsCoastSlot(x, y) : Vc(state, x, y) && !SWIsCoastSlot(x, y)) && !al(state, x, y) && !state.buildings.some((b) => b.id !== ignoreId && b.x === x && b.y === y) && !(state.premium?.ornaments || []).some((o) => o.x === x && o.y === y);
}
function SWMigrateCoast(state) {
  if (state.coastVersion === 1) return;
  const ports = state.buildings.filter((b) => b.kind === "harbor");
  const reserved = new Set(ports.filter((b) => SWIsCoastSlot(b.x, b.y)).map((b) => `${b.x},${b.y}`));
  for (const port of ports) {
    if (SWIsCoastSlot(port.x, port.y)) continue;
    const slot = SWCoast.slots.find((s) => !reserved.has(`${s.x},${s.y}`));
    if (!slot) continue;
    port.x = slot.x;
    port.y = slot.y;
    reserved.add(`${slot.x},${slot.y}`);
  }
  state.coastVersion = 1;
}
function SWLegacyFu13(e, t, n, r, i, a = true, o = Date.now()) {
  let s = { gold: 0, wood: 0, stone: 0, food: 0 };
  if (i.won) {
    if (e.wins++, t === `campaign`)
      e.campaign === n ? (s = Tl[n].reward, e.campaign++, e.gems = (e.gems || 0) + 25, e.rating += n === 4 ? 100 : 20) : s = { gold: 35, wood: 20, stone: 15, food: 25 };
    else if (t === `province`) {
      let t2 = Ac.find((e2) => e2.id === r.provinceId);
      t2 && !e.provinces?.some((e2) => e2.id === t2.id) && (e.provinces = [...e.provinces || [], { id: t2.id, level: 1 }], s = t2.reward, e.rating += 25);
    } else
      t === `player` && (s = {
        gold: 90 + r.defense.level * 30,
        wood: 60,
        stone: 45,
        food: 60
      }, e.rating += Math.max(
        8,
        Math.min(25, Math.round(15 + (r.defense.rating - e.rating) / 20))
      ));
    s = Ll(e, s);
  }
  if (r.commander && (r.rulesVersion !== 4 || r.orders?.some((e2) => e2.kind !== `hero`) && i.duration >= 10) && Kc(e, r.commander.id, i.won ? 40 : 15), t === `player`) {
    let t2 = Pc(o);
    e.season?.id !== t2.id && (e.season = { id: t2.id, points: 0, wins: 0, losses: 0 });
    let n2 = e.season;
    i.won ? (n2.wins++, a && (n2.points += 20 + i.stars * 10 + (r.revengeReportId ? 10 : 0))) : n2.losses++;
  }
  return s;
}
function GemCost(readyAt, now = Date.now()) {
  return Math.max(1, Math.ceil(Math.max(0, readyAt - now) / 6e4));
}
function GemProjects(state) {
  const seen = /* @__PURE__ */ new Set(), projects = [];
  for (const building of state.buildings) {
    if (!building.readyAt) continue;
    const key2 = building.projectId || building.id;
    if (seen.has(key2)) continue;
    seen.add(key2);
    projects.push({ target: "building", id: building.id, name: Sl[building.kind].name, readyAt: building.readyAt });
  }
  if (state.trainingResearch) projects.push({ target: "research", id: state.trainingResearch.kind, name: J[state.trainingResearch.kind].name + " research", readyAt: state.trainingResearch.readyAt });
  for (const ship of state.fleet || []) {
    if (ship.readyAt) projects.push({ target: "ship", id: ship.id, name: wc[ship.kind].name, readyAt: ship.readyAt });
    if (ship.repairReadyAt) projects.push({ target: "repair", id: ship.id, name: wc[ship.kind].name + " repair", readyAt: ship.repairReadyAt });
  }
  for (const [id, record] of Object.entries(state.city?.projects || {})) {
    if (!record.readyAt) continue;
    const district = SWCivicProjects.find((project) => project.id === id), stage = district?.stages[(record.targetStage || 1) - 1];
    projects.push({ target: "civic", id, districtId: id, siteId: record.siteId, name: district ? district.name + (stage ? " · " + stage.name : "") : "District construction", readyAt: record.readyAt });
  }
  return projects;
}
function ApplyGemAction(state, action, now) {
  if (action.type !== "speedup") return false;
  if (!["building", "research", "ship", "repair", "civic"].includes(action.target) || typeof action.id !== "string") throw Error("Choose an active project.");
  const project = GemProjects(state).find((p) => p.target === action.target && p.id === action.id);
  if (!project || project.readyAt <= now) throw Error("This project is already complete.");
  const cost = GemCost(project.readyAt, now);
  if (!Number.isInteger(action.maxCost) || action.maxCost < cost) throw Error("Review the current gem cost.");
  if (state.gems < cost) throw Error("Not enough gems. Earn more from objectives and first victories.");
  state.gems -= cost;
  if (action.target === "building") {
    const selected = state.buildings.find((b) => b.id === action.id);
    for (const b of state.buildings) if (b.id === selected.id || selected.projectId && b.projectId === selected.projectId) b.readyAt = now;
  } else if (action.target === "ship") state.fleet.find((s) => s.id === action.id).readyAt = now;
  else if (action.target === "repair") state.fleet.find((s) => s.id === action.id).repairReadyAt = now;
  else if (action.target === "civic") state.city.projects[action.id].readyAt = now;
  else state.trainingResearch.readyAt = now;
  return true;
}
function SWMissionScout(state, id, trialId) {
  const mission = SWChapter(state).missions.find((m) => m.id === id);
  if (!mission || mission.type !== "battle") throw Error("Choose a battle mission.");
  const input = SWSagaInput(state, id, trialId || false, state.lastTick || Date.now());
  return { kind: trialId ? "trial" : "saga", missionId: id, trialId: trialId || void 0, fixedArmy: true, name: input.defense.name, defense: input.defense, title: mission.title, objective: input.saga.label, army: input.army, mission, previewInput: input };
}
function SWCanPlaceOrnament(state, id, x, y) {
  const p = SWPremium(state), item = SWPremiumCatalog.find((i) => i.id === id);
  return !!item && item.slot === "ornament" && p.owned.includes(id) && Number.isInteger(x) && Number.isInteger(y) && Vc(state, x, y) && !state.buildings.some((b) => b.x === x && b.y === y) && !(state.terrain || []).some((t) => t.x === x && t.y === y && t.kind !== "road") && !p.ornaments.some((o) => o.x === x && o.y === y) && p.ornaments.length < 40 && p.ornaments.filter((o) => o.itemId === id).length < 12;
}
export {
  $c,
  Ac,
  Al,
  ApplyGemAction,
  Bc,
  Bl,
  Cc,
  Dl,
  Ec,
  El,
  Fl,
  Fu,
  Gc,
  GemCost,
  GemProjects,
  Gl,
  Hl,
  Ic,
  Il,
  J,
  Jc,
  Jl,
  Kc,
  Kl,
  Lc,
  Ll,
  Mc,
  Ml,
  Nc,
  Nl,
  Oc,
  Ol,
  Pc,
  Pl,
  Q,
  Rc,
  SWAbilityData,
  SWAppearance,
  SWApplyTrade,
  SWApplyTroopStats,
  SWBuildingCount,
  SWBuildingLimit,
  SWBuildingUpgradeStats17,
  SWCampaignProgress17,
  SWCanDeploy14,
  SWCanPlace,
  SWCanPlaceOrnament,
  SWCanReceive,
  SWCapacity,
  SWChapter,
  SWChapterMissions,
  SWCity,
  SWCityAction,
  SWCityRecipes,
  SWCityRequest,
  SWCityTick,
  SWCivicBonuses,
  SWCivicLevel,
  SWCivicProject,
  SWCivicProjectAction,
  SWCivicProjects,
  SWCivicStage,
  SWCivicTick,
  SWClaimReserve,
  SWCoast,
  SWCollectionQuote17,
  SWCosmeticStatus,
  SWCreateBattle14,
  SWCreateNavalUnit,
  SWCreateShip14,
  SWDefenseInput,
  SWDefenseReport,
  SWDeploymentOrder14,
  SWDepotStatus17,
  SWEnemyNavalUnits,
  SWEnemyNavy,
  SWEquipment14,
  SWEquipmentName14,
  SWEvents,
  SWFacing,
  SWFamilies14,
  SWFamily14,
  SWFleetLimit14,
  SWFleetUnits14,
  SWGrantCollection,
  SWIsCoastSlot,
  SWLandStats,
  SWLayoutAction14,
  SWLegacyBl13,
  SWLegacyFleet13,
  SWLegacyFu13,
  SWLegacyNavalStep13,
  SWLegacyUl13,
  SWLegacyY13,
  SWLoadout14,
  SWMedicHeals,
  SWMedicTarget,
  SWMedievalFinale,
  SWMigrate14,
  SWMigrateCoast,
  SWMigratePremium,
  SWMigrateRaids,
  SWMigrateStorage,
  SWMissionRequirements,
  SWMissionScout,
  SWNavalShips,
  SWNavalStep,
  SWNavalStrike,
  SWNavalTarget,
  SWNavalUnit,
  SWOrders14,
  SWOwnCosmetic,
  SWPackCargo14,
  SWPremium,
  SWPremiumAction,
  SWPremiumCatalog,
  SWPremiumCollections,
  SWPremiumDefaults,
  SWPremiumReward,
  SWPreparationArmy14,
  SWRaidInput,
  SWRaidLoot,
  SWRaidScheduleAfter,
  SWRaidStatus,
  SWRaidTiming,
  SWReadyFleet14,
  SWRecommendFleet14,
  SWRecommendSeaPreparation14,
  SWRequireRoom,
  SWResidentStories,
  SWResidentStoryDefinitions,
  SWResolveDefense,
  SWRevokeCollection,
  SWSagaDefense,
  SWSagaInput,
  SWSagaObjective,
  SWSagaSettle,
  SWSagaSpawn,
  SWSagaStep,
  SWSeaChapters14,
  SWSeaDefense14,
  SWSeaEnemyUnits14,
  SWSeaLanding14,
  SWSeaNavy14,
  SWSeaObjective14,
  SWSeaStep14,
  SWSelectedArmy14,
  SWSettleScheduledRaid,
  SWShipCapacity14,
  SWShipRepairCost,
  SWShipRoles14,
  SWShortfallTrades17,
  SWStorageContribution,
  SWTradeQuote,
  SWTrainQuote14,
  SWTrialDefinitions,
  SWTrials,
  SWTroopAbilities,
  SWTroopDamageFactor,
  SWTroopIncomingFactor,
  SWTroopSplash,
  SWTroopStats14,
  SWTroopWeight14,
  SWUpgradeQuote14,
  SWValidateCargo14,
  SWValidateLoadout14,
  SWValidateShipOrders14,
  SWWalkable,
  Sc,
  Sl,
  Tc,
  Tl,
  Uc,
  Ul,
  Vc,
  Vl,
  Wc,
  Wl,
  X,
  Y,
  Z,
  Zc,
  _l,
  al,
  bc,
  bl,
  cl,
  dl,
  el,
  fl,
  gl,
  hl,
  il,
  jc,
  jl,
  kc,
  ll,
  ml,
  nl,
  ol,
  pl,
  qc,
  ql,
  rl,
  sl,
  tl,
  ul,
  vl,
  wc,
  wl,
  xc,
  xl,
  yl,
  zc,
  zl
};

// Generated from shared ES modules by npm run build. Do not edit.
export const RULES_HASH = "8b0d64a22bc33661d06a5c929887c152f102f566b10ad194bd5863a5030fc3c6";
