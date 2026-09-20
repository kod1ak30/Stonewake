# Stonewake Build 15: naval preparation, progression, and shop audit

Date: 2026-09-19. Scope: current source review and a read-only execution of the current cargo-packing rule. No application code, assets, builds, saves, or purchase configuration were changed. This is not a new physical-device usability test. Recommendations below are proposals, not completed fixes.

## Judgment

The user's complaints about complexity, weak upgrade transformations, and poor shop value are supported by the current implementation. Stonewake has many systems, but the player has to reconcile them. Adding more systems or reward popups would deepen the problem. The next release should prove one effortless land loop and one understandable sea loop, then make the village's advancement visually unmistakable.

The naval setup already automatically selects ships and packs troops. The failure is that this automation is hidden behind a complicated interface, uses unsuitable selection rules, and can recommend an unbalanced army. The right response is a focused redesign of preparation and its rules, not another instruction paragraph.

## 1. Naval preparation has a poor default and excessive manual work

### Confirmed behavior

- The scout starts from the saved Army force, chooses ready ships by descending cargo capacity, then opens the **Force** tab. Sea preparation exposes **Force / Fleet / Cargo**. Sources: `client/build14/ui.js:94-108`.
- Army itself exposes **Force / Train / Upgrade**, six families, a separate troop-type selector, saved forces, exact numeric counts, save state, and training. A battle force allows one type per family, up to six types. Sources: `client/build14/ui.js:61-88`, `client/build14/rules.js:5-11`, `client/build14/rules.js:52-66`.
- Cargo exposes one numeric field for each active troop type on each selected ship. At the allowed maximum this is 6 types × 3 ships = **18 fields**, in addition to the Force counts. The player is shown a choice that can be handled automatically. Source: `client/build14/ui.js:108`.
- The packer sorts troop types by descending cargo weight and fills a cog first if one is available. It does not preserve frontline, ranged, healing, or siege proportions. Source: `client/build14/naval.js:28-34`.
- “Fit force to ships” replaces the intended force with whatever survived that greedy packing. The `remaining` label counts soldiers, while the main total measures cargo space. Both are presented beside each other without explaining the difference. Source: `client/build14/ui.js:97-104`.
- Selecting a third ship when the fleet is already at its limit does nothing; the button is not disabled and offers no “replace this ship” action. Source: `client/build14/ui.js:107`.
- Manual cargo editing clamps only against that troop's whole-force count, not the remaining count across other ships or available space. A player can create duplicate allocations and overfilled ships, then encounter a disabled launch. `remaining` sums absolute discrepancies, so “unassigned” can also mean **overassigned**. Sources: `client/build14/ui.js:97-108`, `client/build14/naval.js:36-44`.

### Reproduced example

Executed `SWPackCargo14` directly from the current module, without changing state on disk:

| Input | Value |
|---|---|
| Available transport | One level-1 Coastal cutter, 12 spaces |
| Intended force | 6 Infantry, 6 Archers, 2 Trebuchets, 1 Healer |
| Total desired weight | 24 spaces |
| Automatically packed | 2 Trebuchets and 1 Healer |
| Left at home | All 6 Infantry and all 6 Archers |

The interface's “Fit force” action accepts this three-unit army because the minimum is three soldiers. The result has no regular frontline or ranged support. It is mathematically within capacity, but a bad default for an inexperienced player. Sources: `client/build14/naval.js:25-34`, `client/build14/naval.js:81-90`, `client/build14/ui.js:104`.

### Fleet readiness is entangled with resource storage

`SWReadyFleet14` excludes any ship that still has a `voyage` object, even after it has returned. Collecting a voyage transfers only what fits and keeps that object while any goods remain. If storage is full, the player cannot release that ship for battle through collection. The scout says the fleet is “away or needs repairs,” omitting returned cargo as a distinct blocker. This takes the user from Battle to Harbor to Storage or construction, and then back again, for a problem that is not about combat. Sources: `client/build14/naval.js:26`, `client/build14/rules.js:123-127`, `client/build14/ui.js:107`, `client/build14/ui.js:116-121`.

The UI exposes two different ship limits: up to eight owned berths, but two ships per attack until Keep 7 and three thereafter. That distinction is legitimate, but belongs in one preparation view, not in separate systems that use different counts. Sources: `client/build14/naval.js:27`, `client/build14/ui.js:116`.

### Recommended sea flow

**Battle → Sea → choose a mission → one Prepare screen → Sail.**

The Prepare screen should open in a launchable state whenever the player has a viable ready force:

1. Show the mission, enemy coastal threats, and a compact recommended fleet together.
2. Select a suitable transport and escort based on the mission, available ships, and player-owned troops. Do not blindly maximize cargo capacity. Show simple roles: Transport, Escort, Siege.
3. Automatically load a balanced force. Preserve a minimum frontline and ranged component, then add specialist support within capacity. If the player has a saved custom force, preserve its proportions and clearly preview who stays home.
4. Show troop portraits and `18 troops aboard · 24 / 30 spaces`. A cargo-space symbol must remain distinct from soldier count.
5. Keep **Sail** visible. One subordinate **Change army** and one **Change ships** action should edit in place. Per-ship manifests belong under optional **Advanced loading**.
6. A missing requirement should become an actionable button in this screen: **Train missing**, **Repair cutter**, or **Build first transport**. Returning from a requirement must restore the chosen mission and setup.
7. A returned trade ship should unload to a separate capped harbor depot or an explicitly defined existing reserve mechanism and become available. This needs an economic rule and migration, not a silent discard or unlimited resource bank.

For battle deployment, keep direct drag/hold deployment as the main interaction. The game should pick a suitable loaded transport automatically, visibly queue the landing, draw a brief route to the chosen beach, and show troops leave that ship. Ship micromanagement should be optional through direct ship selection. A selected transport should not silently prevent an otherwise available troop from deploying from another vessel.

### Naval acceptance gates

- At least four of five first-time testers can start the first sea mission and intentionally land two troop types on two beaches within 90 seconds, without coaching or editing a numeric field.
- Default force formation cannot produce an all-siege/support force when usable frontline and ranged units are available.
- A deterministic recommendation test covers one cutter, multiple transports, transport plus escort, mixed troop weights, full fleet, damaged ships, and no viable force.
- A full store cannot leave a returned fleet permanently unusable. No cargo is lost, duplicated, or silently made unlimited.
- Every blocked ship shows its exact state and a reachable remedy. Selecting beyond the attack fleet limit offers replacement or visibly explains the limit.
- Manual loading never permits invalid counts. Editing one ship immediately updates remaining troops and capacity on the others.
- Every accepted landing gesture receives visible feedback within the agreed input-latency budget. Rejected gestures show one concise reason. No extra Fleet menu is necessary to deploy a standard mixed force.
- Sail charges or reserves a force exactly once, even with rapid repeated taps, pause/resume, or a slow worker response.

## 2. Too many menu concepts compete with the central loop

The main menu has four destinations and seven utilities, plus sound. Battle then has five tabs. Journal has six tabs. Shop has three tabs and six cosmetic categories. Army and Harbor each add three sections. This is a navigation-density problem, even if every button fits in landscape.

| Area | Current choices | Evidence |
|---|---|---|
| Main menu | Village, Army, Battle, Harbor; Journal, City life, Layout mode, Storage, Shop, Customize, Settings | `client/build14/ui.js:22-23` |
| Battle | Land, Sea, Provinces, Rivals, League | `client/build14/Ju.js:1270-1297` |
| Journal | Chapter, Trials, Residents, Events, Achievements, Reports | `client/premium-ui.js:70-86` |
| Shop | Wardrobe, Collections, Gems; Kingdom, Banners, Sails, Roads, Monuments, Outfits | `client/premium-ui.js:10`, `client/premium-ui.js:42-48` |
| Army | Force, Train, Upgrade plus family/type/loadout hierarchy | `client/build14/ui.js:61-88` |
| Harbor | Fleet, Shipyard, Routes plus ship selection and route selector | `client/build14/ui.js:115-121` |

Recommended hierarchy:

- The village has **Build**, **Army**, and **Battle**, with compact resource and construction status. Selecting a building opens its relevant action directly.
- **Battle** initially offers Land and Sea. Provinces can live on the land map; unavailable online Rivals and League do not deserve peer prominence in a disconnected local build.
- **Army** defaults to the current force with one **Train missing** action. Unit details show upgrade progression in place. Advanced formations and type variants remain available without being the first screen.
- **Harbor** manages vessels. Sea battle preparation is a mission step, not something the user must discover there first. Trading routes are secondary to that vessel's readiness.
- **Goals** combines the next meaningful chapter objective and claimable accomplishments. Reports are history, not a peer “activity.” Residents should also be reachable from the relevant visible city character or building.
- **Shop** and **Customize** should share one collection model and consistent preview, while the owned collection remains accessible independently of a purchasing pitch.

Gate: a user can always identify the primary next action, dismiss one surface with one tap, and return to the prior context. The root interaction audit must establish why repeated taps occur; this source review does not independently reproduce that timing defect.

## 3. Upgrade quantities exist; visual transformation is too weak

### What exists now

- Thirteen troop classes are grouped into six families. Stats rise with every level, and mechanical ability milestones exist at 3, 6, and 9. Health and damage baseline multipliers are +16% and +14% per level respectively, before other bonuses. Sources: `client/build14/rules.js:5-11`, `client/build14/rules.js:68-70`, `frontend/core/rules.js:915-942`.
- Keep, Cottage, Barracks, and Storehouse have **three authored base sprites**, selected at levels 1, 4, and 7. Levels 7 through 10 share the same third base. Utility buildings have **one authored base sprite each**. Sources: `client/visual13.js:7-15`.
- Intermediate changes are procedural crates, posts, flags, cranes, gold fittings, and level-10 additions, rather than a newly authored whole building. Source: `client/build14/render.js:235-246`.
- Walls stay the same basic stone prism language. They increase height by 2.1 pixels per level, then add small buttresses, trim, cloth, and a final flag. There is no clearly separated succession of primary wall materials. Source: `frontend/legacy/presentation.js:1182-1220`.
- Roads have three surfaces using the same joined procedural road form and pebble noise, with palette differences. Buying paving does not replace the village with a substantially different designed street system. Source: `frontend/legacy/presentation.js:1665-1687`.

### Recommended medieval progression contract

Define a coherent Stonewake visual history before producing more assets. For example: timber harbor settlement → dressed-stone coastal town → ironbound fortress → brass-trimmed beacon capital. This uses medieval materials and maritime motifs and stays within levels 1 through 10. It does not need to duplicate Clash's purple/lava sequence.

Every upgrade should deliver three things the player can see immediately:

1. A visible authored silhouette or material change, with all levels distinguishable at actual play zoom.
2. A small, concrete gameplay delta, including numeric health/damage/capacity where relevant.
3. A completion moment connected to the actual building or unit: construction reveals the finished object, a short sound and optional haptic confirm it, and an unlocked behavior can be tried.

For walls, author a complete connected kit at each material tier: straight, end, inner/outer corner, junction, gate, damaged, and destroyed. Test mixed-level joins. A visual upgrade should never introduce gaps or alter the functional footprint. For the Keep, produce level 1 through 10 side-by-side silhouettes at identical framing before approving any new art. Level 10 needs a meaningful final identity, not a small additional box.

Gate: blind comparisons at normal village zoom should let at least four of five testers identify which of two adjacent-level objects is upgraded and explain its material or silhouette change. For ability levels 3/6/9, a controlled practice scene must demonstrate the new behavior, not only a description. Existing player ownership must survive any consolidation of the 13 unit variants.

## 4. Store value is limited by the actual product, not the number of offers

The current source contains 22 cosmetic entries: five starter pieces, three earned-only pieces, and fourteen gem-priced pieces. Buying all gem-priced pieces totals **910 gems**. The paid catalogue is mostly recolors, alternate paving, small ornaments, and commander accessories.

| Current item class | Current gem prices | Actual implementation |
|---|---:|---|
| Kingdom palettes | 80, 80, 120 | Selective color replacement of blue cloth pixels |
| Banners | 35, 35, 60 | Alternate banner color |
| Sails | 65, 65 | Tint replacement in sail regions |
| Roads | 70, 100 | Same procedural joined surface, different palette |
| Commander honors | 90 | Small drawn laurel detail |
| Reusable ornaments | 30, 40, 40 | Standard, lantern, planter |

Catalogue and prices: `frontend/core/rules.js:2417-2444`. Palette rendering: `frontend/legacy/presentation.js:1771-1778`. Roads: `frontend/legacy/presentation.js:1665-1687`. Sails and commander accessory: `frontend/legacy/presentation.js:1817-1827`. Ornaments: `frontend/legacy/presentation.js:1794-1803`.

The catalogue calls itself appearance-only and does not sell raw combat power. That is a valid product choice. The problem is that the visual benefit is too modest to make the offer attractive. The preview must sell the actual in-game improvement at play scale. More rarity badges, fake discounts, or extra confetti cannot make a tiny color change worth buying.

### Actual monetization state

There are **no verified live offers or live dollar prices** in the current configuration. `Stonewake/Info.plist:23-24` has an empty service URL. `backend/wrangler.jsonc:8-9` has purchases disabled, Sandbox, an empty Apple app ID, an empty product catalogue, and a placeholder database ID. StoreKit product prices are loaded dynamically only from a configured service and Apple's products, rather than hardcoded as real offers. Sources: `Stonewake/StonewakeOnline.swift:27-34`, `Stonewake/StonewakeOnline.swift:152-171`.

The Shop displays unavailable Collections and Gems states and says real purchases belong to a separate Online Kingdom. That makes it premature to describe this as a working commercial store and would be confusing if a player expected purchases to improve their existing local village. Source: `client/premium-ui.js:56-62`.

### Recommended catalogue

- Keep basic paint changes cheap or earnable.
- Sell fewer, visibly substantial collections only after their art is approved: a full harbor environment, a commander with authored animation and equipment silhouette, or a themed village kit with distinct road edging, wall dressing, foliage, banners, and ambient details.
- Let the user preview the actual collection in their own village, then restore without changing the save.
- Show the entire contents, permanent ownership, where it applies, and any already-owned contents. A bundle must not charge again for the same entitlement without a clear policy.
- Preserve convenience spending as optional, with an exact time saved. Do not create resource shortages or hide controls to sell their removal.
- Establish a single understandable identity and entitlement model for the player's existing village before enabling real purchases. A local-to-online transition requires an explicit migration design and evidence that progress and ownership survive it.

Gate: testers can point out the purchased visual transformation at normal camera distance and explain what they own, where it works, and whether it changes power. No real-money offer is activated until purchase/restore/refund/pending/offline behavior and save migration have been verified in the appropriate Apple environment.

## 5. Gems and resource balance need measurement across a complete level curve

Current gem rules are simple: one gem per minute of remaining construction/research/ship development, rounded up, at least one. Repairs are absent from `GemProjects`. New players receive 100 starter gems; a first land clear gives 25 and a first sea clear gives 30, with other objective, achievement, civic, and story sources. Sources: `frontend/core/rules.js:2087`, `frontend/core/rules.js:3173-3200`, `frontend/core/rules.js:2840-2846`, `frontend/core/rules.js:3132`, `client/build14/naval.js:23`, `client/build14/naval.js:166`.

Consequences of the current formula, before builder/civic speed bonuses:

| Target Keep level | Construction time | Gems to finish immediately |
|---|---:|---:|
| 2 | 4m 15s | 5 |
| 4 | 12m 17s | 13 |
| 7 | 60m 21s | 61 |
| 10 | 4h | 240 |

Computed from `Sl.keep.time`, the 1.7 growth curve capped at 14,400 seconds, and `GemCost`: `frontend/core/rules.js:571-580`, `frontend/core/rules.js:1495-1503`, `frontend/core/rules.js:3173`. These are rule-derived examples, not observed median player times. They do not include the cost, resource, campaign, or prerequisite gates.

The early game makes one victory worth multiple early instant completions, while a small cosmetic may cost several first clears. That may be acceptable, but it needs a deliberate target and playtest rather than arbitrary prices. The requested developer/test gem grant must be excluded from normal-economy balance measurement.

Storage and quantity limits are real, so it would be incorrect to say there is no balance system. Storage is `500 + 250 × Keep + Storehouse contributions`, and a Storehouse contributes `800 × 1.5^(level−1)`. Building limits rise with Keep level; for example Barracks 1→2 at Keep 5, Storehouses 1→2→3 at Keep 4/7, and army size caps at 72. Sources: `frontend/core/rules.js:2052-2060`, `frontend/core/rules.js:2140-2146`.

However, resource importance is not interchangeable. Sawmills produce 28 timber/level/minute and farms 24 food/level/minute, while most construction and every ship demand timber. A cog costs 280 timber and no food. Training and residents spend food, so a player building their city and fleet without repeated retraining can accumulate food and experience a timber shortage. The existing marketplace trades two food for one timber, but it is another screen to discover. Sources: `frontend/core/rules.js:156-190`, `frontend/core/rules.js:2063-2078`, `frontend/core/rules.js:2171-2181`.

Keep advancement requires previous land victories plus Barracks/Quarry progression. Sea progression does not substitute. This makes the two campaigns less independent than the UI suggests. It is a design decision to revisit, not a proved deadlock: either use clearly defined shared campaign renown or explicitly present the land requirement as the core progression path. Sources: `client/build14/rules.js:36-45`.

Required balance work:

1. Simulate and play three intended player styles through Keep 10: builder, frequent raider, and naval explorer. Exclude test grants and account for losses, repairs, timers, storage, idle caps, and repeat rewards.
2. Track the minutes blocked by each resource, overflowing income, sources/sinks by resource, battle replacement cost, and time between useful choices. Equal resource totals are not the objective; predictable and purposeful constraints are.
3. Put an optional fair trade shortcut beside an actual shortfall. Show the quoted exchange, never automatically spend gems or choose a purchase.
4. Remove late surprise gates. Next Keep requirements, one next troop ability, and one useful fleet improvement should be understandable from the current screen.
5. Define target earned-gem purchasing power before pricing more items. Communicate optional completion spending as time saved, not ambiguous premium value.

## 6. Make play satisfying through visible consequences

The useful target is feedback, mastery, and anticipation. More interruptions are counterproductive when the underlying action is unreliable.

- Input: immediate press response and one completed action, with a visible working state if asynchronous.
- Build: a placement preview that matches the finished footprint, a short material-specific construction reveal, a building that visibly changes, and an accurate next benefit.
- Combat: readable anticipation, impact at the point of contact, stagger/recoil, persistent damage, collapse, and loot that reaches the resource meter. Avoid explosions on attacks that cannot logically explode.
- Sea: readable cargo boarding/landing, wake direction, weapon arcs, visible hull condition, and an understandable recovery cost after sinking.
- Progression: unlock one meaningful behavior at a time and give a short opportunity to use it. A completed goal should improve the visible village or reveal a useful choice.
- Rewards: one skippable, coordinated result sequence rather than multiple overlapping notifications. Never interrupt a placement gesture or cover the next battle control. Respect reduced motion, music settings, and haptic preferences.
- Collection: show remaining discoverable items and permanent achievements. Do not manufacture urgency or variable spending pressure to substitute for enjoyable mechanics.

## Priority and proof

| Priority | Deliverable | Proof before another device release |
|---|---|---|
| P0 | Reliable navigation and controls | Repeated opening/closing and primary actions pass on physical phone; no ignored first taps, duplicate mutation, stuck overlays, or clipped primary controls |
| P0 | One-screen sea preparation | Usability gate and packing/readiness cases above pass |
| P1 | Authored Keep/wall/street material system | Approved same-scale contact sheets plus village/battle captures, connected-wall topology checks, adjacent-level recognition test |
| P1 | Focused upgrade presentation | Numeric effect, distinct appearance, and ability demonstration agree with actual rules |
| P1 | Coherent navigation hierarchy | New tester finds Build, Train, Land attack, Sea attack, and next upgrade without coaching |
| P2 | Resource/gem curve | Level 1–10 scenario data and actual play sessions show understandable constraints without accidental locks |
| P2 | Valuable catalogue | Accurate in-village previews, substantial differences, ownership clarity, verified service/Apple lifecycle before activation |

This pass should reduce the amount the player has to understand while improving the consequence of each action. Passing mathematical tests and obtaining a battle victory are necessary, but neither establishes that the game is pleasant or commercially ready.
