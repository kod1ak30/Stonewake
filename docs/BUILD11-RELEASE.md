# Stonewake build 11

Build 11 improves touch deployment, city development, defensive play, animation, building orientation and online-service readiness while retaining the level-10 cap.

## What changed

- Persistent troop selection with tap, hold and drag deployment. A second finger cancels deployment for camera gestures, including when it lands on the troop rail. Dragged cells are retained under simulation load. Online commands use immediate previews and an idempotent server-confirmed queue.
- Dark, responsive menus with City Overview, Projects, Residents and Defense. Requirements link directly to the action that satisfies them. Results avoid duplicate panels. Account and kingdom switching preserve the local city.
- Four three-stage civic districts at existing building sites: market square, working waterfront, residential quarter and public gardens. They use normal construction crews and give permanent benefits plus one-time celebrations.
- Warned computer raids with initial and post-raid protection, bounded resource theft, one overdue event on returning, and measured defense reports. Mortar, bomb-tower and flame splash damage now works. New battles can reach the expanded outer map tiles.
- New painted building views and architectural stages, worker activities, specialist troop action frames, common troop defeat sequences and civic details. A live-render clock repair prevents movement and animation from freezing between simulation frames. Existing special effects, naval duels, sinking, terrain planning and level details remain.
- Native Apple sign-in, cloud backup/restore, separate server-owned online kingdoms, asynchronous player defenses and verified StoreKit purchases are implemented with a D1 service. Successful local service tests do not make these features live. The service URL remains empty pending hosting login and Apple provisioning.

## Verification

The final frozen-source simulator and signed iPhone builds compile as build 11. All 62 packaged web files match the tested source, and iPhone code-signature validation passes. Both use bundle `com.chrismozer.stonewake`, team `RC8WR3WZC7`. Native portrait and landscape review confirmed City, Settings and Account layouts and dismissals. A cloned saved city retained all building records, fleet, gems and reserve supplies after native load and save; its raid schedule was added safely. The final rebuilt app was reinstalled and launched in the simulator, visually checked in upright portrait and landscape, and verified to preserve those values and the existing raid schedule again.

Automated checks cover six viewport sizes, real menu navigation and dismissals, touch/rail/pinch conflicts, civic completion and one-time reward claims, defense replay and settlement, 169 civic/raid assertions, 521 affordability cases, storage conservation, all resource trades, exact historical replay hashes, coordinated healers, two-sided naval combat and repairs. Two fresh free-to-play simulations reach Keep 10 without injecting resources or spending gems. See BUILD11-PROGRESSION.md for model limits.

The service has nine passing backend tests, shared-rule parity checks and a production-entrypoint workerd test rejecting forged Apple identity and purchase data. An actual local service plus D1 plus app-interface run also passed backup/restore, published rivals, battle reservations, lost-acknowledgment retry, return-to-local isolation, resumed orders, settlement, reports and one-time scheduled raids. Apple identity and native file storage were test fixtures; purchases were disabled in that run. Concurrency, duplicate grants, refunds, command/finish races, exact loot transfer and cross-account reply isolation are covered. Real Apple login and a successful Apple-signed Sandbox purchase require activation and were not performed.

## Remaining activation and install steps

The physical iPhone is paired but repeatedly refused service assertions or timed out during the fresh-save copy. The final device inventory reports it as unavailable. Build 11 has not been installed on that phone. Connect it by cable and leave it unlocked, then make a fresh backup, install, launch and compare the save.

Cloudflare authentication is required to deploy the service. Apple Sign in capability, provisioning and consumable products also need configuration and actual Sandbox verification. Online gameplay and paid gems remain unavailable until those steps are complete. No real purchase was made. ONLINE-DEPLOYMENT.md contains the exact activation sequence and public-release prerequisites.

## Review artifacts

The exact package hashes, verification results and activation status are recorded in `verification-manifest.json` in the review directory. Review images and motion captures are in `/Users/chrismozer/Library/Developer/Stonewake-review/build11`. Useful files include `capital-actual-932.png`, `painted-directions-5-buildings.png`, `painted-specialist-animation-frames.png`, `painted-worker-animation-frames.png`, `painted-civic-projects.png`, `live-combat.mp4`, and `city-workers.mp4`. These are local test scenes or cloned saves, not a claim that the phone installation completed.

Editable renderer, interface, civic, raid and online helpers are in `client/`. New painted source assets are bundled under `Stonewake/Web/art/`; generation prompts are retained under `client/`. The pre-change build-10 project backup is `/Users/chrismozer/Library/Developer/Stonewake-backups/build-10-20260919-131007`.
