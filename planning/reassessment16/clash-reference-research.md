# Stonewake: lessons from Clash of Clans

Research date: 19 September 2026. This is a design analysis based on current and historical official Supercell material plus the nine Clash screenshots supplied by the user. It is not a fresh hands-on Clash playtest, a performance comparison, or proof of Stonewake's current behavior. Stonewake recommendations below are design proposals, not implemented features or measured results.

## Assessment

The user's comparison is valid. The useful benchmark is the clarity of the action, the visible consequence, and the desire to do it again. The supplied Clash screens keep the base readable, tie actions to the selected object, show a persistent battle roster, and give victory a distinct visual payoff. They also demonstrate clear material hierarchies: soft terrain, legible buildings, readable characters, and high-contrast controls. These are observations from the supplied images, not a claim that every current Clash screen is simple or faultless.

Stonewake will not reach that standard through more menu entries, louder music, extra particle counts, or slightly recolored sprites. It needs a smaller, coherent set of interactions and authored visual progression that can be recognized at ordinary phone zoom. Touch reliability is a release blocker before either new content or monetization.

## What current Clash actually does

1. **It removed much of the friction before the fun.** Army resource costs were removed in June 2022 to encourage experimentation. Troop, spell, and siege-machine training time and hero healing were removed in the March 2025 update. The 2022 document's remaining training timers are historical and were superseded by the 2025 changes. Copying the old wait-to-attack economy would copy an obsolete version of the reference. [Home Village Changes, 26 June 2022](https://supercell.com/en/games/clashofclans/blog/news/home-village-changes-2/) and [Clash Anytime, 24 March 2025](https://supercell.com/en/games/clashofclans/blog/release-notes/welcome-to-clash-anytime-update/).

2. **It helps players construct a usable army.** June 2025 introduced starter Army Recipes suited to the player's Town Hall. The same update lets players reorder troops and spells by holding and dragging, with that order preserved in battle. It also makes warnings selectable for more information. These are concrete reductions in preparation effort. [Let's Get Crafty, 16 June 2025](https://supercell.com/en/games/clashofclans/blog/release-notes/welcome-to-lets-get-crafty-update/).

3. **A major level is a new visual and mechanical chapter.** The Town Hall 15 release explicitly couples a magical palette with Spell Tower and Monolith mechanics; Spell Tower upgrade levels unlock different defensive spells. Town Hall 18 uses meteorite as its identity, an interactive upgrade reveal, and new Guardian defenses. That combination is stronger than increasing hitpoints while retaining the same silhouette. The Town Hall 15 article is historical; its old training times and weapon upgrade rules are not presented here as current rules. [Town Hall 15 release, 10 October 2022](https://supercell.com/en/games/clashofclans/blog/release-notes/full-release-notes-2/) and [Town Hall 18 release, 17 November 2025](https://supercell.com/en/games/clashofclans/blog/release-notes/town-hall-18-crash-lands-update/).

4. **Gems have recognizable purposes and free sources.** Official support identifies extra Builder Huts as permanent gem purchases; achievements, obstacles, gem boxes, events, and the Builder Base Gem Mine supply free gems. This creates a saving goal alongside spending opportunities. Current listed Builder Hut costs are 250, 500, 1,000, and 2,000 gems for huts two through five; these are virtual-currency costs, not regional cash prices. [Builders and Builder's Huts, undated support article](https://ingame.help.supercellsupport.com/clash-of-clans/en/articles/builders-4.html) and [Free Gems and Resources, undated support article](https://support.supercell.com/clash-of-clans/en/articles/how-can-i-get-free-gems-and-resources.html). Both were retrieved on the research date.

5. **Acceleration products have understandable effects.** Magic items accelerate building/research, complete projects, or fill stores, and can be earned or bought through several routes. Examples currently described by support include a building-completion book and a builder-speed potion. Inventory limits and confirmations matter to their usefulness. Do not transplant old wall-ring tables: the newer August 2026 release explicitly removes the free-builder requirement for Wall Rings. [Magic Items and the Trader, undated support article](https://support.supercell.com/clash-of-clans/en/articles/magic-items-and-the-trader.html) and [August Update, 30 August 2026](https://supercell.com/en/games/clashofclans/blog/release-notes/august-update-3/).

6. **The pass sells understandable accumulated value.** The February 2026 redesign describes larger reward icons, a full-screen presentation, ordinary-play daily tasks, stackable catch-up stamp cards, choice rewards, and rewards scaled to progression. The later August update says lower-level availability is a September test, so it is not safe to claim every new account gets the same pass immediately. Neither announcement establishes the user's current regional cash price. [Gold Pass redesign, 16 February 2026](https://supercell.com/en/games/clashofclans/blog/news/big-changes-are-coming-to-gold-pass/) and [August Update, 30 August 2026](https://supercell.com/en/games/clashofclans/blog/release-notes/august-update-3/).

7. **Progression earns both function and identity.** The June 2026 Hero Journey turns cumulative hero levels into a reward track with equipment, resources, quests, and exclusive appearances. August then added fallback quests when the required equipment is absent. This is a useful lesson: reward goals must remain completable for the actual player state. [Anime Fury update, 15 June 2026](https://supercell.com/en/games/clashofclans/blog/release-notes/the-anime-fury-update-is-here/) and [August Update, 30 August 2026](https://supercell.com/en/games/clashofclans/blog/release-notes/august-update-3/).

8. **It continually improves the payoff screen.** The August 2026 notes describe a rebuilt battle-end layout, a new victory banner, and clearer loot and bonus breakdowns. A result should make the achievement and the newly enabled next step obvious. Merely dumping resource numbers into a modal misses much of that function. [August Update, 30 August 2026](https://supercell.com/en/games/clashofclans/blog/release-notes/august-update-3/).

9. **Not every current system is appropriate to copy.** The September Equipment Blast uses event progress, temporary troops, a paid event pass, and randomized chests with published probabilities. These are verified current event mechanisms, not evidence that Stonewake needs random paid rewards. Copying that degree of currency and event layering now would worsen the user's complexity complaint. [Equipment Blast Medal Event, 9 September 2026](https://supercell.com/en/games/clashofclans/blog/news/equipment-blast-medal-event/).

## Upgrade art: the actual lesson of purple crystal and lava

The user's purple/crystal/lava examples describe a real design requirement: progression must change material, shape, light, and perceived power. This research did not verify a complete legacy wall-level-to-color chart from primary sources, so no exact historical wall palette table is asserted. The official Town Hall examples above establish the broader approach without pretending that all levels have unique abilities or wholly new art.

For Stonewake's existing medieval levels 1–10, commission one original coastal-fantasy art direction and a deliberate progression sheet before producing isolated sprites:

| Levels | Keep and defenses | Walls | Troops and ships |
| --- | --- | --- | --- |
| 1–2 | Timber watchpost, limewashed stone, simple pitched roofs | Joined timber palisades with visible posts and gates | Cloth, wood shields, small hulls, plain sails |
| 3–4 | Cut stone, copper fittings, stronger towers | Dressed masonry, connected corners and crenellations | Leather/chain, stronger weapons, reinforced prow |
| 5–6 | Slate roofs, bronze roof ridges, harbor beacon | Taller stone courses, bronze ties, distinct gatehouse | Mail/plate silhouettes, pennants, visible deck armaments |
| 7–8 | Dark coastal granite, oxidized copper, carved heraldry | Buttresses, heavier parapets, restrained beacon lighting | Veteran armor, larger rigging, shields and weapon mounts |
| 9–10 | Pale crownstone over dark foundations, sea-glass details, monumental beacon | Crownstone caps, integrated watch posts, rare luminous insets | Elite faction identity, distinctive flagship hull and sail shapes |

This is a proposal, not a borrowed Clash tier list. Within each pair, every individual level still needs a visible attachment, structural change, or material transition. A new number or tiny hue adjustment does not pass. Do not expand beyond level 10 as part of this work.

Each wall tier needs straight segments, corners, ends, T junctions, crosses, gates, and damaged forms with consistent pivots, scale, shadows, and adjacency. A wall must read as a continuous defense even when adjacent levels differ. Upgrade a selected run with a clear total quote. Show the new appearance on the map immediately when completed.

Roads need the same connection discipline: authored joins, width, corners, junctions, edge blending, and placement rules that avoid building foundations. They should be subordinate to buildings. Surface detail should not create visual noise or look like floating beige lines. Citizens should follow readable routes between destinations, perform purposeful short tasks, and share the world's light and perspective. Neither change is solved by adding more villagers or more random details.

## A simpler Stonewake action model

The following is original design inference from the references and the user's complaints.

- Village: two strong actions, **Build** and **Battle**. A quiet status strip holds resources and workers. Secondary systems remain inside one menu. Selecting a building shows its name, level, upgrade preview, benefit, cost, and a single primary action. Move and rotate are secondary.
- Battle choice: **Land Campaign** or **Sea Campaign**. Keep land accessible without transport requirements.
- Preparation: one **Army** screen with a ready recommendation and editable composition. Saved loadouts are an advanced convenience, not a prerequisite for the first attack. Missing troops, resources, or capacity appear inline with the exact remedy.
- Upgrade: show current and next art side by side at identical scale; two or three meaningful stat changes; the next ability milestone; exact requirements and time. Do not scatter prerequisites across several menus.
- Empty or blocked state: the control should tell the player what it needs on the first press. Never silently ignore a valid touch. Feedback must distinguish “processing,” “cannot afford,” “no room,” and “action completed.”

The supplied battle screenshots support a permanently visible deployment bar and an unobstructed battlefield. They do not establish precise current gesture timings. Stonewake should support selection plus map tap, continuous hold/drag deployment, immediate count changes, a clear forbidden-area response, and pinch gestures that cancel deployment rather than accidentally spending units. These are proposed acceptance behaviors, not claims from a new Clash session.

## Loading ships without homework

Do not make players navigate Army, Harbor, individual vessels, expedition assignments, and a separate campaign setup to start one sea battle. The choice of ship and landing position should be strategic; the act of loading should be simple.

Proposed flow: **Sea Campaign → Choose mission → Load fleet → Scout → Battle**.

The Load Fleet screen should have one visible strip of ship cards, each with a role, capacity meter, condition, and assigned troop portraits. A recommended fleet arrives preselected. **Auto-load** creates a legal, balanced loadout from the selected army with one action. The player can then drag a squad to another ship or tap a troop to adjust its quantity. One total capacity line always explains remaining room. Troops excluded by capacity remain visible, with the reason, before committing. Loading must reserve units only once and must not destroy or duplicate them when the screen closes.

For battle, selecting a transport highlights valid beaches. Dragging to the shoreline previews the ship's route and landing area before release. Its assigned squads appear in a persistent tray; holding and sweeping on a valid landing zone disembarks them steadily. Escort ships have explicit attack targets and visible range. Coastal defenses can threaten ships. A damaged or sinking transport must visibly communicate what happens to survivors, with the consequence specified before the attack. Avoid a punishment that is discovered only after the player's entire army disappears.

This is a Stonewake system proposal. Clash's main village attacks are not being cited as a naval-loading mechanic.

## Reward pacing and store value

“More dopamine” should be translated into responsive, earned, legible rewards. Do not treat more sound, flashing, or random prizes as proof of better engagement. The proposal is to connect four timescales:

| Moment | Feedback | Meaningful consequence |
| --- | --- | --- |
| Every successful action | Immediate pressed state, short visual response, restrained sound/haptic | Player knows the action registered |
| Completed upgrade or battle objective | Brief material reveal, specific sound, visible numbers with actual gains | An ability, capacity, appearance, or tactical option improves |
| Session milestone | A small set of achievable town/campaign goals and a clear claim | Resources help fund a named next upgrade; an earned cosmetic marks completion |
| Chapter completion | Original character beat, short keep/harbor celebration, collectible | A new mission, city service, troop ability milestone, or visual tier opens |

All feedback must be skippable or nonblocking, respect reduced motion and sound settings, and avoid stacking popups while the player is issuing orders. The victory screen should show loot gained, losses, objective results, and the next useful action. Only paid products actually deliverable by the configured purchase system may be purchasable.

A proposed compact store should prioritize products with visible utility:

| Product | Why a player might value it | Required presentation |
| --- | --- | --- |
| Permanent additional builder within a fixed cap | More simultaneous village progress | Explicit permanent ownership, cap, availability, and free earning path |
| Exact project speedup | Complete a chosen upgrade now | Exact time removed, cost, resulting level/art, and confirmation |
| Harbor/keep/village cosmetic set | Substantial visual ownership | Full in-world preview, included objects, no hidden combat advantage |
| Modest progression bundle | Several useful steps toward the player's current goal | Actual capacity-safe resources, clear project relevance, no unusable overflow |
| Later seasonal pass | Predictable earned rewards over a well-tested season | Complete free/paid track preview, attainable requirements, disclosed end date and missed-reward policy |

These are product hypotheses, not validated prices or revenue forecasts. Value must be measured against the player's stage: usable projects enabled, capacity, expected play effort, and lasting visual impact. Do not quote “10× value” without a consistent truthful comparison. Avoid selling resources the player cannot store, selling the solution to a broken interface, mandatory payment to retry core combat, or time-limited pressure before the game proves enjoyable.

Use one premium currency with transparent earning and spending. Record each grant and debit, prevent duplicate claims, and show balance changes immediately. Preserve previously granted gems. Do not hide the free route or use the cost of an unrelated purchase as an invented value anchor. A gem economy needs a tested resource/time model and actual player comprehension before more product SKUs.

## Acceptance criteria for the next candidate

These are proposed Stonewake gates, not measured Clash benchmarks:

1. **Touch reliability:** every enabled menu action responds to one ordinary tap across the supported iPhone landscape sizes. A logged physical-device run exercises at least 100 representative actions with no missed or duplicate commits. Press feedback appears promptly; a pending state is shown if work takes longer. Button hit areas remain stable during refresh and scroll.
2. **Layout:** no clipping, inaccessible close control, overlapping footer, unexpected zoom, or horizontal page scroll in Army, Harbor, Shop, Building, Settings, Campaign, and Battle Results. The same check covers both landscape orientations and real safe areas.
3. **Sea usability:** a new player can load a recommended fleet and land the intended squads without verbal instruction or leaving the mission flow. Capture failures and number of backtracks, not just one expert success.
4. **Visual progression:** a contact sheet and in-game inspection show all Keep/wall levels 1–10 and each troop milestone. At normal gameplay zoom, successive levels are distinguishable without reading the number. Every displayed picture matches the actual unit and level.
5. **Battle readability:** deployment always updates the selected card count; damage comes from visible attacks; important defenses, beaches, survivors, and targets remain readable through effects. Test the busiest supported battle on the phone.
6. **Value and rewards:** a fresh and established village can complete the available goals; rewards are not silently discarded at storage caps; purchases disclose exact deliverables and cannot duplicate or lose currency on retry.
7. **Release language:** an internal candidate is not called production-ready because it compiles or wins a scripted battle. Known touch, art, economy, purchase, or player-understanding failures remain explicit blockers.

## Evidence limits

Twelve primary sources are linked above. Publication dates come from the articles; support pages are undated and were retrieved on 19 September 2026. Exact live cash prices, account-specific offers, conversion, retention, device frame times, and current legacy wall color mappings were not established. A Supercell news link to the old store route returned 404 during this pass, so no live store purchase or logged-in offer inspection is claimed. No Supercell assets, characters, UI skins, or audio were copied into Stonewake.
