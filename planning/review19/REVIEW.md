# Stonewake review: where the biggest improvements are

28 September 2026 · Build 18 checkpoint (`f7c757e`)

Goal: a coastal assault strategy game with Clash of Clans–style presentation and controls, and more interesting attacks than Clash. Near-term focus: the village, the menus and upgrades. Cap every progression track at **level 5** while those systems are built out.

## How this was reviewed

- I read the rules catalog (`frontend/core/rules.js`), progression, civic, campaign and combat modules, and the earlier assessments (`planning/reassessment16`, `planning/overhaul17`).
- I played the packaged web build in a headless browser at 844 × 390 (iPhone landscape). I used a fresh save and a disposable Keep 3 fixture. The screens covered were the opening, village, Build, Keep upgrade, Menu, Army, Battle select, a live land battle, Harbor and Sea preparation.
- This review didn't cover physical-device touch, audio, performance or balance.

## Ranked findings

### 1. Upgrades don't give a reason to upgrade (highest impact)

In Clash, every Town Hall level unlocks new buildings, new troops and new level caps, and each upgrade visibly changes the object. In Stonewake, most levels only raise a number:

- Production increases by the same flat amount per level (`Il()`): farm +24 food, sawmill +28 timber, quarry +16 stone, market +10 gold, cottage +4 gold.
- Barracks gives +6 slots per level, and the Foundry gives +10% attack per level.
- The [Keep upgrade panel](screenshots/keep-upgrade.png) offers "Base storage 750 → 1000, Gold 28 → 36/min, Structure health 1050 → 1417.5". The health value isn't rounded. The panel names nothing the new level unlocks, though unlocks exist: mortar at Keep 2, bomb tower at 3, flame at 4, bastion at 5.
- Building art changes only at levels 1, 4 and 7 (three authored tiers). The Vanguard has four ranks, and other troop families have fewer. Most individual level-ups aren't visible.
- Troop abilities unlock at levels **3, 6 and 9**. Under a level-5 cap, each troop would get only one ability.

**Fix:** a single data table that defines what every Keep level 1–5 unlocks. Show those unlocks prominently on the Keep upgrade screen and in a post-upgrade reveal. Each Keep level should add at least:

1. one new building or building slot
2. one new troop, ship or attack ability
3. higher level caps for the buildings it gates
4. a visible art change

Retarget art tiers to levels 1, 3 and 5, and ability milestones to levels 2, 4 and 5 (or 3 and 5). Then every capped level is felt.

### 2. The village doesn't read as a base yet

Screenshots: [fresh village](screenshots/village-fresh.png), [Keep 3 village](screenshots/village-keep3.png), [Build menu](screenshots/build-menu.png).

- A handful of small buildings float in a large, uniform grass field. No grid or base footprint shows, roads and walls don't appear by default, and most of the screen is empty. Clash's village feels dense and owned because the play area is framed and compact.
- **Build** opens a full-screen modal that hides the village. At Keep 1 it lists about 20 building types, including five locked defenses and a "League reward required" monument. Only six cards fit on screen.
- Placement, moving and rotating live inside a detail panel rather than directly on the map.

**Fix:**

- **Framing:** a visible, framed island or plot grid sized for Keep 1–5, with room that grows at each Keep level. Start the village with a wall ring and a road to the Keep.
- **Build shop:** a bottom-sheet shop that keeps the village visible. Show only what the current Keep can build, plus a single "unlocks at Keep N" teaser row.
- **Placement:** drag a ghost building onto the grid with green/red footprint feedback.
- **Scope:** at levels 1–5, keep it to about 10 core building types. The Victor's standard, flame turret, bastion and extra civic types can wait.

### 3. There are too many menus, and they're disconnected from the world

- The [main Menu](screenshots/main-menu.png) has four large destinations (Army, Harbor, Goals, Collection) plus City life, Layout, Storage, Settings, Village, Mute and Choose battle. At 390 px height the panel runs off the bottom.
- Every destination is a full-screen modal with Back, a close button and tabs. Army has Force, Train and Upgrade tabs. Harbor has Fleet, Shipyard and Routes tabs.
- Clash routes nearly everything through the building itself. Tap the Barracks to get **Info / Upgrade / Train**. Tap the Laboratory to get **Research**.

**Fix:** tapping a building shows a small action bar anchored to it:

| Building | Actions |
| --- | --- |
| Barracks | Train · Upgrade |
| Foundry | Upgrade troops · Upgrade |
| Shipyard | Fleet · Upgrade |
| Keep | Upgrade · What unlocks next |
| Storehouse | Storage |
| Market | Trade |

The global Menu then shrinks to Goals, Collection and Settings. Army and Harbor become the Barracks and Shipyard panels. Standardize one panel template: a header with the level and a single primary action, a current-vs-next comparison, and a footer with the cost and one button. Use it for every building.

### 4. Attacks aren't yet "more interesting" than Clash

Screenshots: [battle start](screenshots/battle-start.png), [after deploying](screenshots/battle-deployed.png), [sea preparation](screenshots/sea-prep.png).

- A land battle currently means deploying troops, then using **Rally** and the commander's ability. That's roughly Clash with fewer tools, and it has no equivalent of spells.
- Every fort is a rectangular wall box. The ten layouts vary the interior, but the approach is always "breach the square".
- The troop tray covers about 30% of the screen and hides the fort's south wall. At default zoom the troops are small next to the buildings.
- The coastal hook (ships, landings, naval fire) is the differentiator, but it lives only in the Sea campaign. That campaign has a heavy prep flow: 0 ships, then Choose ships, then cargo.

**Fix:** make the coast part of **every** attack. For levels 1–5, pick three or four attack verbs that tie to things the player builds:

- **Broadside:** a galley or bombard in the fleet adds a targetable bombardment strike to the tray. This builds on the existing `SWNavalStrike`.
- **Beach landing:** deploy troops from a boat onto a chosen shore segment rather than only along the land edge. A second landing wave mid-battle spends cargo.
- **Grapnels / siege ladders:** let a small squad cross one wall segment. This is a counterpart to the ram's breach.
- **Smoke / sea fog:** briefly blinds tower targeting in an area.

Give forts coastal geometry: a harbor side, sea walls and cliff faces with landing beaches. The player should then choose between the land gate and the beach. Also shrink the tray to a single row of about 64 px, and default the camera closer.

### 5. The level cap is hardcoded, not configured

There is no `MAX_LEVEL` constant. "10" is hard-coded in more than 150 places across 27 source files. The backend alone has 62 in `backend/src/rules.mjs`, the frontend rules have 48 and `presentation.js` has 35. Examples:

- `max: 10` on every building and defense
- `if (i >= 10) throw Error('Maximum troop level reached.')`
- `SWBuildingLimit` clamps to 10
- `SWStorageContribution` uses `Math.min(10, level)`
- the campaign progress clamps
- the finale requires Keep 10

Content above level 5 that a cap would strand:

| Area | Above level 5 |
| --- | --- |
| Land campaign | Missions 6–10 (Emberport … The Imperial Throne) |
| Sea campaign | Missions 6–10 |
| Troops | Royal knights unlock at 6 |
| Defenses | Second mortar at 6, second bomb tower and flame at 8, second bastion at 9 |
| Builders | Third builder at 7, third storehouse at 7 |
| Civic districts | Stage 3 requires Keep 6, 7 or 8 |
| Abilities | Troop abilities at levels 6 and 9 |
| Finale | Crown of the Coast requires Keep 10 and campaign 10 |

**Existing saves:** the preserved phone save is **Keep 7, Land 10**. You need to choose a policy for such saves:

- **Grandfather (recommended):** saves above the cap keep what they have, and the cap only blocks further upgrades.
- **Clamp:** reduce such saves to the cap, with a migration and a compensation grant.

**Fix:** add one `progression.js` (or a similar module) with `MAX_LEVEL = 5` and a per-Keep unlock table. Import it everywhere, including the server rules export. Temporarily hide Land and Sea missions 6–10, the knight, and civic district stage 3. Retarget the finale to "Keep 5 + both campaigns' chapter 5". Add a regression test that no command can produce a level above `MAX_LEVEL`.

### 6. Code structure slows every change to the village and menus

- The UI and rules still live largely in recovered, minified-style modules with names like `Ju`, `Eu`, `X`, `Z`, `Q` and `Ml`. `client/build14/Ju.js` is 118 KB and `frontend/legacy/presentation.js` is 272 KB.
- The rules are split between `frontend/core/rules.js` and several `client/build14`–`build17` layers.
- Rebuilding the village and menus is the right moment to write new, readable modules (`village/`, `menus/`, `progression/`) and retire the legacy screens one at a time. That beats patching the minified ones again.
- Housekeeping: on a fresh checkout, `npm test` shows 13 failures until you run `npm ci`. The cause is missing `acorn` and `esbuild`, not a code bug.

## Suggested order for the level-5 milestone

| # | Deliverable | Done when |
| --- | --- | --- |
| 1 | `MAX_LEVEL = 5`, a Keep 1–5 unlock table, and the save policy | No path can exceed level 5. Content above 5 is hidden. The existing Keep 7 save loads under the chosen policy. |
| 2 | Keep upgrade screen and post-upgrade reveal driven by the unlock table | Each Keep level shows exactly what it unlocks. Every level 1→5 has a visible art change. |
| 3 | Tap-a-building action bar and one shared upgrade panel template | Army, Harbor and Research are reached from their building. The global Menu has three items and fits at 390 px. |
| 4 | Framed village plot, bottom-sheet Build shop, and drag-to-place ghost | The village stays visible while building. Only buildings available at the current Keep are listed. |
| 5 | Two coastal attack verbs (Broadside, Beach landing) in land battles, plus coastal fort geometry | A Keep 3 player can win a mission either through the gate or the beach. |
| 6 | Rebalance levels 1–5 using the existing progression model (`frontend/test/progression-model17.mjs`) | Fresh save to Keep 5 has no dead ends. Each session produces at least one visible upgrade. |

Items 1–3 are the biggest improvement for the effort. They turn "numbers go up" into a Clash-style progression ladder, and everything else builds on the unlock table.
