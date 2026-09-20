# Stonewake build 14

Delivered to the paired iPhone 15 Pro Max. The installed app reports version 1.0, bundle version 14; launch succeeded and the saved kingdom migrated to medieval version 14.

Authorized scope: the build 13 improvement plan, extended to separate land and sea campaigns. Gameplay remains at medieval levels 1–10.

## Implemented and checked

- [x] One upgrade quote for UI, local actions and server validation. The current Keep route shows the second Storehouse and Quarry requirement together. Storage and building limits have valid progression routes through level 10.
- [x] Shared dark menus, simpler navigation, responsive preparation, building, commander, harbor and build screens. Next unfinished missions and damaged ships appear before completed content. Superseded theme files are no longer loaded.
- [x] Six troop families with chosen doctrines, up to three saved forces and atomic train-missing actions. Existing troop inventory and research are retained. Current/next gear, stats and abilities are shown.
- [x] Shared tray/map deployment controller: direct card drag, tap, hold, continuous painting, invalid-ground suspension and pinch cancellation. Releasing does not dump queued troops.
- [x] Independent ten-chapter land and sea campaigns. Land battles deploy directly; sea battles use owned ships and weighted cargo. First-clear rewards are separate and cannot be repeatedly claimed.
- [x] Four ship roles with level progression, fleet selection, automatic or manual cargo allocation, chosen landing areas, escort objectives, enemy ships, coastal defenses and navigable shoals.
- [x] Ship move, focus-fire, ability and withdraw commands. Sunk vessels remain owned and require repair. Undeployed cargo is rescued; troop and ship ownership are validated on both local and server paths.
- [x] Shared articulated troop and ship rendering, level-specific equipment, projectile/impact timing, material collapse, persistent rubble, damage stages, wakes, roads and working citizens.
- [x] Quieter native audio, separate village/battle music controls, effect ducking, voice limits and dismissible rewards. Physical audibility and haptic feel remain unverified.
- [x] Layout draft with commit/cancel, undo/redo, move, rotate, paint and erase. Plot, road, defense and harbor overlays explain usable land. Draft building selection cannot accidentally spend on an upgrade.
- [x] Journal brings chapter tasks, resident activity, mastery trials, collections and reports together; existing medieval completion and cosmetic rewards remain available.
- [x] Native device and Simulator builds; final packaged files match source hashes. Installed over the existing app without uninstalling, then launched successfully.

## Verification evidence

| Check | Result |
| --- | --- |
| Rules regression | 280 checks passed, recorded in `rules-evidence.json` |
| Gesture controller | 27 checks passed |
| Backend integration | 12 tests passed, including actual workerd Apple verification and D1 action validation |
| Backend packaging | Dry run passed; no public deployment or purchase activation |
| Naval feasibility | 20 simulations completed successfully, covering all ten chapters at two force levels; `naval-balance.json` |
| Browser play | Two sea victories, cargo fitting, direct card deployment, repair ability, replay and replay exit; no console errors at the final check |
| Responsive browser layouts | 932 × 430, 844 × 390 and 390 × 844; Army, Build, Keep requirements, Harbor, Shop, Commanders, Settings, Journal, Provinces and result/preparation screens |
| Layout interaction | Paint, undo, redo, commit, rotate, undo and cancel verified on a disposable kingdom |
| Native Simulator | Portrait and both landscape directions; village, menu, army touch scrolling, campaign tabs, cargo fitting, fleet selection, settings and final next-chapter ordering |
| Actual iPhone installation | Bundle version 14 confirmed by device inventory; launch succeeded; migrated save read back from the phone |

The save was byte-for-byte unchanged immediately after installation. After launch, buildings, terrain, army, fleet, research, unit levels, commanders, cosmetics, playtest grant markers and land progress matched exactly. An overdue successful automatic defense awarded two gems, changing 1,021 to 1,023. The earlier 1,000-gem grant was not repeated. Sea progress starts at zero; completed land progress remains ten.

Raw saves and device logs stay in the private local review folder at `/Users/chrismozer/Library/Developer/Stonewake-review/build14`. Source backup: `/Users/chrismozer/Library/Developer/Stonewake-backups/build13-before-dual-campaign-20260919-174132`.

## Evidence limits and follow-through

- [ ] Physical finger gesture matrix, measured input latency, audible mix and haptic feel on the user's phone.
- [ ] Sustained 15-minute device performance/thermal profiling, frame-time distributions and measured memory. Cache and effect limits are implemented; a 60 fps performance claim has not been established.
- [ ] VoiceOver, increased text size and the full interruption/rotation matrix during combat.
- [ ] Repeated gameplay balance across different player strategies and resource economies. The twenty naval simulations establish feasible wins, not comprehensive balance.
- [ ] Side-by-side phone video and player approval of the final art standard. The renderer is materially changed, but this is not evidence of a finished commercial art pipeline.

Local and backend rules are implemented and tested. Online service provisioning, production StoreKit configuration, multiplayer release and real purchase validation remain separate work. No era beyond level 10 was implemented.

Screenshots are a development sequence, not all the same revision. `02`, `05`, `09`, `12`, `15` and `16` record the final relevant screens. Earlier captures show intermediate presentation and should not be used as final acceptance evidence for subsequently changed screens.
