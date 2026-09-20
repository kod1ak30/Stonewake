# Build 15 implementation and release record

Build 15 improves the medieval game through level 10, repairs recurring usability problems and establishes a reproducible source build. This is a development candidate. Commercial release is not approved or established by these checks.

**Build 15 is installed on the paired iPhone.** Final signed iPhone and Simulator builds passed. The installed app reports bundle version 15, and the final installation preserved a byte-identical save before launch. After the phone was unlocked, native launch succeeded. Fresh local diagnostics recorded game_ready and engine_worker without a startup failure. The final Simulator build also opens successfully.

## Implemented changes

### Presentation

- Painted citizens replace the procedural-looking figures. Routes use consistent movement speed, work poses continue looping and contact shadows keep feet grounded. The home commander uses a corrected scale.
- Troops use painted action frames with rank-specific equipment and cloth treatments. Upgrade previews show the current and next rank alongside strength and ability changes. This is not ten fully authored animated models per troop; the source atlases still have limited poses and viewpoints.
- Original landing-cog and trebuchet-barge art provides three major hull stages. Ship previews include the mast, ships face their travel direction and sinking finishes instead of restarting.
- Building damage, collapse and ruins respond to structure size and damage. Naval impacts distinguish water, hull and siege effects. Particle and sprite caches have explicit limits, with reduced-motion alternatives.

Art scope and provenance are recorded in [BUILD15-ART.md](BUILD15-ART.md). Existing artwork and audio still need a complete rights and human-quality review before release.

### Menus and onboarding

- Dark landscape layouts keep essential Army, building, Harbor and battle controls reachable. Army preparation, training and upgrades have distinct views and a stable action area. Selected-building details show progression and requirements; village shortcuts hide while that panel or other menus are open.
- The Fleet orders panel stays visible for choosing movement, focus fire, withdrawal and ship abilities. A scout force below the three-troop minimum now says “Choose at least 3 troops” instead of reporting that it is ready to sail.
- A guided first chapter follows actual Keep inspection, construction, recruitment, victory and storage progress. It can be minimized, skipped or reopened. Established saves are not forced through a fresh tutorial.
- The fresh starting force is 3 Infantry and 3 Archers. The guide points to the existing Train missing action. Completing a Storehouse advances the final storage step through real game state.

### Build, combat and native foundations

- Maintained ES modules compile the app, dedicated battle worker and server rules. Normal builds no longer splice the frozen Build 13 bundle or serialize functions into worker source. The repository has a verified Build 14 baseline, pinned build dependencies, explicit imports and source maps.
- Modern battle start, saved-battle restoration, replay and final settlement use worker forecasts. A loading state keeps the battlefield visible while its first forecast is prepared. Worker failure discards stale results, blocks combat and settlement, and offers a retry using the latest orders. Historical replay versions retain their version-specific behavior.
- The iPhone app is landscape-only with a branded loading screen, safe-area controls, bounded recovery and bounded background asset reads. Atomic primary/backup persistence remains in place.
- Construction, research and ship-repair alerts are local and opt-in. The app does not request notification permission automatically. Notification plans serialize updates, acknowledge only successful synchronization and retry transient failures.
- Bounded, allowlisted diagnostics stay on the device. Players can disable logging, clear it or explicitly export a support report. No automatic diagnostic upload or remote push registration was added.

Details are in the [architecture record](BUILD15-ARCHITECTURE.md) and [native record](BUILD15-NATIVE.md). The recovery preserves existing resources, army, research, fleet, cosmetic ownership and gems. Build 15 does not repeat the previous 1,000-gem test grant.

## Validation completed

### Automated checks

| Check | Result | Scope |
| --- | --- | --- |
| `npm run verify` | 38 frontend tests passed; 21 module inputs checked; TypeScript and lint passed | Reproducible build, imports, preserved saves, worker lifecycle/parity, guide/privacy/notifications and presentation helpers |
| Build 14 rules regression | 280 checks passed | Migration, storage/caps, upgrade graph, loadouts, cargo, landings, ship orders, rewards, layout rollback and exact replay |
| Gesture regression | 27 checks passed | Card handoff, tap, hold, paint, invalid crossings, rail scroll, pinch, cancellation and no release burst |
| Premium rules regression | 179 assertions passed | Missions, trials, stories, event rewards, ownership/refunds, placement and the medieval conclusion |
| Local backend suite | 12 tests passed | Local Workerd/D1 authority, concurrency, purchase/refund fixtures, land/sea combat and replay preservation |
| Native policy suite | 31 compiled Swift checks passed | Disposable-storage persistence/recovery, notifications, diagnostics and policy bounds |
| Bundle verification | Passed | Packaged app/worker/rules match compiled source; worker content hash matches its URL version; historical replay hashes unchanged |
| Whitespace validation | `git diff --check` passed | Changed tracked files |

The backend suite exercises the actual Apple verifier with forged inputs that must fail, while successful transaction and identity cases use fixtures. It does not establish a genuine Apple purchase, identity success or a running production service.

### Observed gameplay and layout checks

Browser play used disposable saves and actual controls. These are observed sessions, not an exhaustive regression of every possible army, menu or mission.

| Session | Observed result |
| --- | --- |
| Fresh land campaign | Trained 3 Infantry and 3 Archers, deployed troops and the Commander through direct card drags and map swipes, and won the first land battle at 56% destruction. |
| Storage and guide completion | Built a Storehouse after victory. Resource capacity increased from 750 to 1,550 and the guide completed. |
| Saltwind Cove sea campaign | Victory at 50% destruction in 71 seconds. Three troops landed, three returned aboard, and every ship returned safely. Ship damage was visible during combat. |
| Final naval command layout | Fleet orders were visible and the Rapid Volley command responded. |
| Native Simulator | Both landscape orientations and Settings → Device fit. No automatic notification permission prompt appeared. |
| Signed development builds | iPhone and Simulator builds passed. This is development signing/build evidence, not a distribution archive or TestFlight approval. |
| Installed iPhone save | Final installation confirmed as version 15; save bytes matched the pre-update backup before launch. After unlock, native launch and game readiness were verified. Protected village progress and gems remained intact. A pending ship completed and an overdue raid settled normally. |

Screenshots:

- [Final native village in Simulator](../planning/build15/screenshots/native-final-village.png)
- [Army progression at 844×390](../planning/build15/screenshots/army-final-844.png)
- [Completed first chapter at 844×390](../planning/build15/screenshots/completed-first-chapter-844.png)
- [Guide after the first land victory at 844×390](../planning/build15/screenshots/guide-after-first-victory-844.png)
- [Harbor layout at 932×430](../planning/build15/screenshots/harbor-final-932.png)
- [Sea victory at 932×430](../planning/build15/screenshots/sea-victory-932.png)
- [Fleet orders at 932×430](../planning/build15/screenshots/sea-orders-final-932.png)

The [worklog](../planning/build15/WORKLOG.md) records the implementation and earlier QA corrections. Private saves and native logs remain outside the source repository.

## Remaining release gates

The latest readiness assessment is **12 PASS, 0 FAIL, 11 BLOCKED**. The 11 blocked categories remain: service URL, D1 configuration, numeric Apple app record, Production verification environment, product catalog, purchase activation, live backend operations, genuine Apple identity/StoreKit evidence, distribution/final archive, physical iPhone/player acceptance, and rights/privacy/storefront review. See [BUILD15-LAUNCH-GATES.md](BUILD15-LAUNCH-GATES.md).

The service is not activated, purchases remain unavailable, and no public deployment, real-money transaction or App Store submission is claimed. Completion notifications still need locked-device delivery and permission-path testing. Physical touch quality, speaker/Bluetooth audio, interruptions and sustained frame pacing, memory and thermal behavior are not claimed as verified. External fresh-player feedback and full art acceptance also remain necessary.

The exact final app hash is `e7b00b5f2f19e3b202748d5dfd657c7d5412d597c27ed4cc6c117ca888c1266b`; worker hash is `7e91c13867ccd9067a2e00b07539d6ffdb2ec0258b74238fbc0081822c69fe53`. Packaged HTML, stylesheet and original art also matched source-output hashes. Both native build logs contain BUILD SUCCEEDED. Before release, verify both orientations and complete the held hands-on physical tests. Further source or stylesheet changes require fresh candidate evidence.

## Physical launch follow-up

The unlocked phone launched the final installed Build 15 successfully. The process path matched the final installation, and fresh local diagnostics recorded game readiness and the dedicated combat worker. Post-launch comparison preserved buildings, army, terrain, both campaigns, research, unit levels, gems, previous test grants, cosmetic ownership, commanders, provinces and saved loadouts. A pending ship moved from construction level 0 to completed level 1. An overdue automatic enemy raid settled with 1,636 of each resource looted, alongside normal income/time updates. These gameplay changes are distinct from migration loss. No additional gem grant or manual save change was made.
