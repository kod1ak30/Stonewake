# Stonewake Build 17 delivery record

Verified delivery: 20 September 2026. Version 1.0, build 17. This is a development build for evaluation, not a production-ready or commercially approved release.

## Delivery status

The final Build 17 candidate, including the last City layout and road-rendering changes, was signed, installed and launched successfully on the paired iPhone 15 Pro Max. The device app inventory reports bundle `com.chrismozer.stonewake`, version 1.0, build 17. All 103 packaged web files match the source by SHA-256.

On the physical phone, the main menu, Army screen, Upgrade tab and close action each responded to one click through iPhone Mirroring. These checks preceded only the last City and generated-footpath polish. After the final update, the native launch command succeeded. Mirroring then ended because the phone was in use, so the final City screen was visually checked in the iOS Simulator and in browser viewports of 932 × 430 and 740 × 360 instead. This is not a completed physical combat, multi-touch, audio or endurance playtest.

| Final candidate evidence | Result |
| --- | --- |
| Web package | 103 of 103 source files match the signed app |
| Native builds | Signed iOS device and iOS Simulator builds succeeded; strict signature verification passed |
| Final install | Successful; device inventory confirms build 17 |
| Final launch | Successful on the physical iPhone |
| Final native City layout | One-click Menu and City Life navigation; three overview cards and pinned tabs fit in the Simulator |
| Automated checks | 167 frontend tests, 12 backend tests and 36 native policy checks passed; module/type/lint checks passed |
| Saved kingdom | 988 gems, army, research, fleet, campaign progress and owned cosmetics preserved; all pre-install building IDs retained |

Local device evidence is in `/Users/chrismozer/Library/Developer/Stonewake-review/overhaul17/`: `install-final.json`, `installed-final-app.json`, `launch-final.json`, `bundle-verification-final.json` and `save-verification-final.json`. The before/after saves are private local backups, not repository fixtures. The later save contains an additional gate and a wall upgrade started during subsequent phone use; it is not byte-identical to the earlier snapshot.

## What changed

| Area | Implemented scope |
| --- | --- |
| Village architecture | Ten distinct Keep levels with matching front/rear art and four facings. Farm, timber works, quarry and storage have three authored milestones. Frame bounds and world dimensions are shared with previews. |
| Walls, roads and people | Connected wall ends, corners, junctions and gates with ten material/height treatments, damage and ruins. Joined roads avoid building plots, pass through gates and use bounded geometry caches. New farmer, dockworker and mason sprites replace the rejected procedural figures. |
| Troop and ship presentation | Vanguard has four authored equipment ranks with walk/attack frames and stable foot anchors. Menu portraits use the battle renderer. Ships gain torn sails and hull damage while retaining existing hull tiers. Floating legacy equipment overlays were removed. |
| Menus and City | Dark panels reorganize building upgrades, Army, Harbor, campaigns, storage, settings and projects. Upgrade views show actual current/next benefits and actionable blockers. City now separates Overview, Projects, Residents and Defense; its final compact layout is installed and checked in browser and native Simulator. |
| Land and Sea campaigns | Ten distinct stronghold geometries per campaign, with different entrances and Keep/defense placement. Scouts use the actual tactical briefing. Sea harbors now replace their boundary-wall plot instead of disappearing behind it. |
| Sea preparation and deployment | Ready owned ships and legal troop counts determine a balanced cargo recommendation. Capacity and troops left at home are visible. Optional edits preserve per-ship limits; equal-weight swaps require an explicit choice. Landing selection uses a live vessel with the selected troop aboard. Gesture and feedback work remains subject to physical acceptance. |
| Progression and supplies | First clears from either campaign contribute to Keep progression, capped at level 10. Returning trade cargo unloads into available storage and a bounded Harbor depot, releasing the vessel for combat. Food can remedy project shortfalls through existing Market rates. Gated streets now provide their real civic connectivity benefit. |
| Projects and rewards | Civic district work appears with its real timer in Projects and completion notifications. Quoted civic speedup frees the crew through the normal completion rules; celebration remains separately claimable once. The medieval finale adds the earned-only Coastal Crown banner, including an idempotent ownership update for earlier completions. |
| Gem value | The 14 purchasable cosmetic pieces total 260 gems instead of the audited 910. Permanent Mariner, Royal and Citymaker collections cost 68, 68 and 32 gems before ownership discounts. Quotes charge only missing pieces. No new gem grant or live cash purchasing was added. |

The visual direction remains Stonewake's coastal architecture, teal cloth, warm timber, granite and copper. Reference games informed clarity and hierarchy; their recognizable assets were not copied. Asset provenance and exact limitations are recorded in [WORLD.md](WORLD.md) and [ART.md](ART.md).

## Verification checkpoint

The complete frontend suite passed after the last City and road edits. Backend rules retain export hash `8b0d64a22bc3`, matching the tested server export. The native source did not change after its 36 checks; temporary event tracing was removed before the clean device and Simulator builds.

The deployment controller covers press-and-drag, held deployment, cancellation, multi-pointer rejection, rail scrolling and release-only drag events. A native Simulator trace revealed that the computer-control drag supplied down/up coordinates without intermediate moves. Handling the final release position made that tray-to-map gesture deploy exactly one cavalry unit in the native retest. This does not prove continuous physical-finger painting or multi-touch pinch behavior.

Focused gameplay evidence includes fresh kingdoms progressing through all ten actual simulated Land battles and all ten Sea battles without resource refills or gem spending. The new final Sea fort defeated the original middle-beach tactic; a legal northern landing completed it. This demonstrates an attainable strategy, not that every force or beach is balanced. The economy models exercise authored costs, storage upgrades, recruiting, research, voyages, repairs and timers; their clocks are not human completion forecasts.

Five archived phone saves were checked for preservation of gems, armies, research, fleet, buildings, campaign progress and ownership. They retained 988 gems, Keep 7, Land 10 and Sea 2 with idempotent migration. That fixture evidence is separate from the final physical launch and save export documented above. See [GAMEPLAY.md](GAMEPLAY.md) for commands, quantities, model assumptions and regression details.

## Remaining quality limits

- Economic buildings have three authored silhouettes, Vanguard four ranks, and ships three existing hull tiers. Other troop families still need equivalent authored progression. This is not a complete art replacement at every level.
- Citizen and Vanguard walk cycles have modest stride variation. Canvas proofs and automated frame tests do not establish final animation quality in motion on a phone.
- The latest City layout has browser and native Simulator verification. Physical checks covered the menu, Army, Upgrade and close actions, not every screen. Continuous finger deployment, pinch, naval landings and longer play sessions still require hands-on acceptance.
- Audio mixing, interruption recovery, Bluetooth/headphone transitions, background/lock recovery, sustained frame pacing, memory and thermals remain physical acceptance work.
- Automated victories do not prove enjoyable difficulty, fair long-term resource pressure, player comprehension or retention. New and returning players still need to play both routes.

## Commercial blockers

[BUILD15-LAUNCH-GATES.md](../../docs/BUILD15-LAUNCH-GATES.md) remains the detailed release checklist. Its Build 15 dates and test totals are historical; the unresolved external prerequisites still apply. Current checked-in configuration continues to have an empty native service URL, a placeholder D1 database, Sandbox Apple verification, no numeric App Store app record, an empty product catalog and purchases disabled.

A commercial release still requires:

1. A verified owning Apple team, final signing/capabilities, immutable archive, symbols and matching TestFlight candidate.
2. A real isolated backend with recorded migrations, monitoring, abuse controls, deletion handling, demonstrated backup/restore and rollback ownership.
3. Approved products and real Sandbox sign-in, purchase, pending/cancel, delivery, restore, account-switch, refund and revocation evidence. Injected successful receipts and rejection of forged receipts do not replace genuine StoreKit flows.
4. Exact-candidate physical usability, stability, accessibility and sustained-performance acceptance, followed by fresh-player and returning-player evaluation.
5. Complete art/font/audio rights inventory and final privacy, support, storefront, age-rating and purchase disclosures reconciled with the shipped app and service.

Enabling purchases, publishing the backend, submitting to the store and approving a commercial release are separate operations. None is established by this delivery record.
