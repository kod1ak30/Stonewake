# Stonewake: why Build 15 misses the target

19 September 2026 · Product, interaction, art and economy reassessment

Build 16 follow-up, 20 September: the [battle preparation delivery](../preparation16/DELIVERY.md) implements the first preparation milestone with legal recommendations, optional ship/cargo editors and corrected Back routes. The final frontend suite has 83 passing tests; browser and native Simulator layout checks passed. Build 16 was installed on the phone with the save preserved exactly. First physical launch/visual acceptance is pending an iOS launch-lock or verification issue described in the delivery record. The broader art, combat, economy and finger-input findings below remain open.

Follow-up, 20 September: the Mac unlock enabled [native Simulator checks, an additional Harbor layout correction, and an actual-phone Mirroring pass](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/NATIVE-CHECK.md). All 23 tested Mirroring navigation clicks responded, while the installed phone confirmed moving Harbor tabs, cramped Army details and an over-capacity sea-loading default. Physical finger-tap reliability remains unresolved. No new build was installed. The original audit below remains the baseline rather than a claim that the planned redesign has shipped.

**Verdict: Build 15 remains an internal prototype. It does not meet the requested premium experience or a reasonable player-facing release standard.** The user's criticism is supported by fresh screen captures and source inspection. Passing code checks and completing a battle did not establish usable menus, reliable physical input, recognizable upgrades or worthwhile purchases. Those checks were too narrow, and another successful compilation would not close this gap.

This report separates observed behavior, rule-derived findings, and proposed design. The proposals are not delivered features. Two narrow input/navigation defects have been corrected locally; the widespread repeated-tap problem remains unresolved pending native measurement. No new build was installed on the phone during this reassessment.

## Evidence and limits

The current Build 15 interface was exercised in an isolated local browser at **844 × 390 landscape**, using a disposable copy of an established Keep 7 village. Screenshots below were captured and their saved files inspected in this run. Four soldiers were trained and one troop upgrade was started in that disposable copy; the user's phone save was not changed. The copy includes the previously requested test gems, which must be excluded from normal economy evaluation.

Clash analysis uses the user's nine supplied screenshots and twelve official Supercell sources. It is research and visual comparison, not a newly performed hands-on Clash playtest. No current regional prices, retention statistics, revenue results or exact historical wall-color chart were established. The Mac was locked during the attempted native check, so this pass cannot certify iPhone touch, physical performance, sound balance or safe-area behavior. Existing combat tests were run, but a new end-to-end battle was not visually audited in this pass.

## The current experience, step by step

### 1. Village – major visual revision required

![Current village](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/01-village.png)

The compact Build and Battle actions leave useful room for the map. That direction should stay. The environment and objects do not yet form one readable visual system: busy ground texture competes with thin roads and small residents; architecture repeats similar blue roof accents; roads appear as narrow disconnected fragments. The Keep does not dominate strongly enough for a developed capital. These are art-direction findings from this view, not a measured frame-rate result.

**Change:** quieter terrain, a stronger Keep silhouette, consistent object scale and light, roads with deliberate joins and destinations, and readable citizens doing short purposeful tasks. Review at ordinary phone zoom, not only enlarged asset sheets.

### 2. Main menu – functions, but asks the player to understand too much

![Main menu](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/02-menu.png)

Four prominent destinations sit above seven utilities and a sound control. There is some hierarchy, but Journal, City life, Layout, Storage, Shop and Customize all demand interpretation. Several functions could be reached from the building or character they affect. Small secondary labels make this harder at landscape scale.

**Change:** keep Build and Battle on the village, use the selected object for its own actions, and group the remaining navigation around Army, Harbor, Goals and Collection. Put settings in the existing gear. Do not introduce more parallel destinations.

### 3. Train troops – action works in browser; important content is clipped

![Training](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/03-army-training.png)

Training quantity, troop family, specific troop type and three Army sections coexist in a short screen. The footer stays visible, but the unit label and ability card extend into the clipped content area. Family counts are also squeezed at card boundaries. The ordinary browser training action succeeded; that does not contradict the user's report of missed physical taps throughout the game.

**Change:** default to the current force and a single Train missing action. Selecting a troop opens a focused detail view. Start with a small readable roster; expose additional doctrines as progression choices. Preserve ownership when consolidating existing variants.

### 4. Upgrade troops – fails to communicate the upgrade

![Troop upgrade](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/04-upgrade.png)

The Shieldbearer level 1 and 2 pictures are almost indistinguishable at this scale. Health and attack change, while unchanged range and interval consume half the stat area. Equipment descriptions are beneath the visible region. The measured detail viewport was 114 px high for 185 px of content; some labels were 10 px. The screen technically contains information that the player cannot comfortably see.

**Change:** identical framing for clearly different current/next art, two or three meaningful benefits, rounded readable stats, and a visible ability milestone. The preview must match the actual upgraded unit. For levels 3, 6 and 9, a brief practice demonstration should show the existing unlocked behavior.

### 5. Harbor – storage and battle readiness are entangled

![Harbor](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/05-harbor.png)

Three returned ships show Cargo ready but cannot unload because stores are full. Only two other vessels are ready for battle. The selected ship combines a cargo action with next-level capacity and hull statistics, without clear current/next artwork labels. A long vessel list consumes scarce vertical space.

**Change:** separate a ship's job from its upgrade preview. Show exact state and remedy. Define a capped harbor depot or existing reserve policy that lets returned ships unload and become available without losing cargo or creating unlimited storage. This needs an explicit economy rule and save migration.

### 6. Sea preparation: Force – opens in an unusable state

![Sea force](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/06-sea-force.png)

The first mission opens with **64 / 15 cargo space, 25 unassigned** and a disabled Sail with 30 troops button. Only two troop rows fit. The user must first interpret a mismatch between troop count and space, then decide whether to change the army, ships or packing. A button called Fit force is present, but the system has not offered a sound default.

**Change:** show one legal recommended force and fleet together whenever available. Explain exclusions before committing. Never silently remove the frontline to fit heavy specialists.

### 7. Sea preparation: Fleet – alternatives and remedies are hidden

![Sea fleet](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/07-sea-fleet.png)

The view says choose up to three ships, but shows only the two ready vessels, with the second below the visible area. Returned cargo ships disappear from this selection. The player cannot tell from this screen why other owned ships are missing. Much of the available space is taken by repeated headers, instructions and a fixed footer.

**Change:** one horizontal fleet strip showing role, condition, capacity and readiness. Unavailable vessels remain understandable with one relevant remedy. A full selection offers replacement instead of silently ignoring another choice.

### 8. Sea preparation: Cargo – excessive manual administration

![Sea cargo](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/08-sea-cargo.png)

Even the first ship's editable counts fall below the fold. This setup has ten numeric cargo fields; the supported maximum is eighteen. Manual edits can create overassignment, while the summary calls discrepancies unassigned. The user is doing work the game can safely handle.

**Change:** balanced loading is automatic. Manual ship manifests become optional advanced controls, with legal counts enforced as they change. The primary strategy is which force, ship roles and landing zone to choose.

### 9. Shop catalogue – selection exists; visual differentiation is weak

![Shop catalogue](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/09-shop.png)

The palette cards reuse the same blue Keep thumbnail. Two layers of tabs use space needed for the item and its benefit. Category controls run beyond the visible width. Dark styling is consistent, but the result reads as a dense inventory form.

**Change:** fewer substantial collections, distinct accurate thumbnails, meaningful categories, and owned items accessible without a purchasing pitch. Do not make basic inexpensive paints carry the burden of premium products.

### 10. Cosmetic preview – too small to sell the result

![Cosmetic preview](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/10-shop-preview.png)

The preview does change the cloth color, but shows a tiny sample of buildings rather than the player's village. The description is clipped above the footer. The strongest visual element is the purchase button rather than the offered improvement.

**Change:** full-size, reversible preview in the player's own world; exact included objects; permanent ownership and power effects explained. A scenery collection should actually change coast, ground, props and atmosphere. A flagship appearance needs a distinct hull, rig and sails. A portrait tint alone is insufficient.

### 11. Gems – local spending works, commercial purchases are unavailable

![Gem store](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/screenshots/11-gem-store.png)

This view accurately says purchases are not connected. It is an unfinished product surface, not a functioning cash shop. The source likewise has purchases disabled and no configured live catalogue. Selling into a separate Online Kingdom would be confusing unless progress and ownership migration are designed and proven first.

**Change:** establish coherent ownership and compelling goods before activating real-money offers. Price and verify them only after the free progression curve is playable and understandable.

**Accessibility limits across these steps:** clipping, very small labels, reliance on tiny portraits, and muted disabled states are visible risks. Screenshots do not establish contrast compliance, VoiceOver behavior, text scaling or motor accessibility. Those require separate testing. Primary controls need stable 44-point touch areas, readable labels, and a visible response to the first accepted tap.

## What Clash gets right, and what Stonewake should learn

| Principle | Evidence from Clash | Stonewake decision |
| --- | --- | --- |
| Reach the interesting decision quickly | Army resource costs were removed in 2022; training and hero recovery waits were removed in March 2025 | Do not recreate outdated waiting friction. Keep preparation short and reserve strategy for army composition, defenses and deployment |
| Provide usable defaults | June 2025 introduced Town Hall-specific starter Army Recipes | Recommend legal land and sea forces from the actual owned roster; expose customization without requiring it |
| Make a major upgrade a new chapter | Town Hall 15 paired a magical identity with Spell Tower and Monolith; Town Hall 18 introduced a meteorite identity and Guardians | Tie a visible change of materials and form to a meaningful tactical or civic unlock |
| Give gems understandable uses | Official support describes permanent Builder Huts, completion items and free earning routes | One premium currency, permanent saving goals, exact time savings, clear grants and debits |
| Present rewards clearly | The 2026 Gold Pass redesign emphasizes large icons and complete reward views; August revised victory and loot presentation | One readable reward sequence connected to actual progress, not several overlapping banners |
| Keep the battlefield readable | The supplied screenshots show a persistent troop tray, open terrain and contextual controls | Permanent compact deployment tray; clear silhouettes, damage and target selection; no troop-menu reopening during deployment |

Sources: [army costs](https://supercell.com/en/games/clashofclans/blog/news/home-village-changes-2/), [Clash Anytime](https://supercell.com/en/games/clashofclans/blog/release-notes/welcome-to-clash-anytime-update/), [Army Recipes](https://supercell.com/en/games/clashofclans/blog/release-notes/welcome-to-lets-get-crafty-update/), [Town Hall 15](https://supercell.com/en/games/clashofclans/blog/release-notes/full-release-notes-2/), [Town Hall 18](https://supercell.com/en/games/clashofclans/blog/release-notes/town-hall-18-crash-lands-update/), [Builder Huts](https://ingame.help.supercellsupport.com/clash-of-clans/en/articles/builders-4.html), [Gold Pass](https://supercell.com/en/games/clashofclans/blog/news/big-changes-are-coming-to-gold-pass/), [August update](https://supercell.com/en/games/clashofclans/blog/release-notes/august-update-3/).

The lesson from purple crystal and lava is unmistakable progression through material, shape and light. We should create Stonewake's own coastal identity rather than copy Supercell's characters, exact tier designs, skins, icons or audio. Likewise, recent Clash event currencies and random chests are not a reason to add more complexity here.

## The redesign to build

### A. Reliable input before any extra content

Two confirmed defects received local corrections. A celebration combined top and bottom positioning, making a small notice **312 px tall** at a 390 px screen height. It is now content-sized and does not intercept input outside its dismiss button; the same browser case measured **64 px tall** after rebuilding. Separately, opening another destination could leave the Build modal mounted. Navigation now closes that screen before opening the next destination. Four regression tests cover this state behavior.

Neither finding proves the cause of every missed iPhone tap. A browser tap on an Army tab succeeded while the old notice existed. The user's clarification that failures happen throughout the game requires a shared-input investigation, not a claim that one CSS change solved it.

Native sound playback reconfigures audio and opens players on the main thread; native saving validates and writes on the same thread. These are latency candidates, not established causes. Measure touch arrival, stationary release, click arrival and the visible action response, plus sound-on/off behavior. A passive, explicitly started local touch check has been added for input counts and delay measurement. It collects no labels, coordinates or save contents and does not by itself prove that a click completed its intended action. Do not add synthetic clicks that could double-spend resources.

### B. One straightforward path into a battle

**Village → Battle → Land or Sea → Mission → Prepare → Attack.** Land requires no ships. The sea Prepare screen includes the mission threat, recommended fleet, selected troops and capacity on one view. It opens ready to launch whenever a viable force exists.

One Change army and one Change ships action edit in place. Advanced manifests stay optional. If a ship needs repair or the player lacks troops, the precise remedy appears here and returns to the same mission. Do not force the player to remember a chain through Harbor, Storage, Army and campaign tabs.

During sea combat, the chosen troop selects a suitable loaded transport automatically. A shoreline drag previews the route and landing zone; holding and sweeping deploys steadily with immediate count changes. Selecting a specific vessel is an optional tactical override. Escorts attack enemy vessels; shore defenses threaten ships; wakes, weapon arcs, hull damage and rescue/sinking outcomes make the battle understandable. The player must know what happens to troops aboard a lost ship before committing to battle.

The current cargo rule is not an adequate recommendation system. In a reproduced 12-space cutter case, an intended force of six infantry, six archers, two trebuchets and one healer loaded only the trebuchets and healer. The replacement must preserve useful frontline/ranged proportions before adding specialists, while honoring explicit player choices and showing what stays behind.

### C. One authored world with visible progression from 1 to 10

Current Keep, Cottage, Barracks and Storehouse art has three authored bases, at levels 1, 4 and 7. Many utilities have one base. Small procedural decorations fill the gaps. Walls largely retain one stone shape with small height and trim changes. This is why the player does not feel ten levels of advancement.

Approve a complete original progression sheet before generating isolated replacement art:

| Levels | Capital identity | Walls and defenses | Troops and vessels |
| --- | --- | --- | --- |
| 1–2 | Timber harbor, limewashed footings, modest pitched roofs | Connected timber palisade, proper gate | Cloth, wood shields, small plain-sailed hulls |
| 3–4 | Dressed stone, copper fittings, broader towers | Masonry, strong corners, crenellations | Leather and chain, reinforced prow, visible weapon improvements |
| 5–6 | Slate and bronze, a working harbor beacon | Taller courses, bronze ties, distinct gatehouse | Mail and plate shapes, pennants, readable deck weapons |
| 7–8 | Dark coastal granite, copper patina, carved heraldry | Buttresses and heavier parapets | Veteran armor, stronger hull and rigging, faction detail |
| 9–10 | Pale crownstone, dark foundations, restrained sea-glass light | Crownstone caps and integrated watch posts | Elite equipment silhouettes and a recognizable flagship |

Every individual level within a pair still needs a visible structural or material change. Keep 10 must look substantially different from Keep 7. All work remains within the requested medieval level cap. The [art and interaction contract](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/ART-AND-INTERACTION-CONTRACT.md) specifies each of the ten levels, required asset states, wall joins, screen structures and deployment behavior.

Walls need a shared connection system: straight, end, corner, junction, cross, gate, damaged and broken pieces, including mixed-level neighbors and rotation. Roads need consistent width, authored corners/junctions, ground blending and valid approaches to doors and docks. They must not cut through foundations or float above terrain.

Citizens need consistent perspective and scale, readable silhouettes, feet anchored to ground and purposeful work cycles. Combat needs attack anticipation, contact-timed impact, recoil, persistent building damage and a collapse that settles into ruins. Ship hits should produce appropriate splinters, spray, recoil and hull damage. Expensive particles must not obscure aiming or harm input responsiveness.

### D. Rewards with a visible consequence

| Timescale | Required experience |
| --- | --- |
| Every input | Immediate press response; one committed action; a working state for slower actions |
| Upgrade or objective | A short reveal at the actual object, a distinct sound/haptic, a visible benefit |
| Session | A few completable goals that fund a named next improvement or unlock a useful choice |
| Chapter | A character moment, a permanent collectible and a new city service, ability or campaign option |

Keep these coordinated and skippable. A battle result should show earned loot, losses, objectives and the next useful action. If storage is full, it must explain what is stored or reserved; it must not celebrate silently discarded rewards. New abilities should be demonstrated. More flashing and louder sound are not substitutes for satisfying consequences.

### E. A deliberate economy and a store worth visiting

The current game does have storage and building limits. The failure is the interaction of its constraints, not their absence. Construction and all ships use timber, whereas much food spending depends on training and side activities. Equal resource totals are not the goal; purposeful demand without accidental dead ends is.

Balance three fresh-save paths through Keep 10: a builder, a frequent land raider and a naval explorer. Track resource-blocked time, overflow, losses, repair/replacement cost, useful decisions per session, and earned gems. Sea progress currently does not substitute for required land victories in Keep progression. Either introduce shared campaign renown or clearly present land as the advancement requirement. Do not imply two equally independent progress paths while enforcing an undisclosed gate.

The current fourteen gem cosmetics total 910 gems and mostly change color or small details. Their value problem is not solved by raising prices or adding rarity borders. Basic paint should be cheap or earnable. Premium collections should contain substantial authored scenery, an animated commander, or a distinctive flagship, with a truthful in-world preview.

Use gems for clear optional convenience and lasting ownership. A permanent extra construction crew within a fixed balance cap is worth testing as a saving goal, with an attainable free route. Exact project completion should show time saved and the resulting upgrade. Do not sell extra power or create artificial frustration to make an offer necessary. A seasonal pass should wait until content and reward delivery are reliable.

Before cash purchases: one clear account/kingdom ownership model, migration of existing progress and entitlements, verified Apple products and prices, and purchase/restore/pending/refund/offline tests. No live real-money offers were activated here.

## Delivery order and acceptance gates

| Order | Concrete deliverable | Required evidence |
| --- | --- | --- |
| 1 | Input repair and one shared menu layout | Native input diagnosis; 100 representative phone actions with zero ignored enabled taps or duplicate commits; stable buttons and close controls |
| 2 | One complete village-to-land-battle loop | Fresh player builds, upgrades, trains, deploys by hold/drag, wins, claims and returns without coaching or menu traps |
| 3 | One-screen sea preparation and correct loading | Balanced default cases; legal edits; exact ship blockers; at least four of five new testers start a sea mission and intentionally land two types without numeric-field work or coaching |
| 4 | Keep, wall, road, citizen and unit art system | Same-scale contact sheets and in-game captures; adjacent-level differences recognized by four of five testers; all wall joins and rotations inspected |
| 5 | Combat and reward presentation | Phone capture of the busiest supported battle; readable attacks, damage and landing; sound mix checked; reduced motion respected |
| 6 | Measured progression and worthwhile goods | Three level 1–10 paths tested without developer grants; no storage/cargo dead ends; meaningful collection previews and reliable ownership |
| 7 | Candidate for phone testing | Complete regression on the actual phone, both landscape directions, cold/resume/offline paths, existing-save migration and a fresh-save session |

For layout, validate at least 667 × 375, 844 × 390 and 932 × 430 plus actual safe areas. Critical content must not disappear below a fixed footer. Aim for 14 px body text and at least 12 px secondary text; critical controls cannot depend on 10 px captions. No horizontal page scroll, unwanted browser zoom, clipped primary actions or stacked focus traps. These are proposed acceptance targets, not claims of passing them today.

Use one representative finished area to approve the art direction before replacing the entire catalogue: a developed Keep, a connected wall enclosure and gate, an adjoining street, several citizens, three troop families and one transport/escort pair. That area must work in the real game at phone scale. Then extend the approved system across the other assets and levels.

## What this pass completed

- Fresh evidence for eleven interface steps, with screenshot inspection and measured clipping.
- A twelve-source Clash reference study, including current preparation, progression and reward changes.
- Rule and catalogue analysis, including a reproduced unbalanced auto-loading case.
- Local notice geometry/input correction and single-modal navigation correction, with four regression tests.
- An optional, explicitly started two-minute local touch check, with eight tests for event counting, delays, cancellation, privacy and shutdown behavior.
- A rebuilt local bundle, module/type/lint checks and **50 passing automated tests** after the final source changes. This is automated evidence, not a physical tap-reliability result.
- A successful iOS Simulator build of the native wrapper. In the browser, the optional touch check was confirmed inactive initially and could be explicitly started and stopped; no console warnings or errors were captured in that check. It was not run on the phone.

The full interface redesign, new authored art, naval preparation replacement, economy rebalance and physical touch repair are still work to perform. This report does not relabel the existing game as production-ready. The next device candidate should be judged by these acceptance gates and actual player use, not by the number of new systems added.

Detailed supporting reviews: [input reliability](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/input-findings.md), [naval, progression and economy](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/naval-economy-audit.md), [Clash reference research](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/clash-reference-research.md).
