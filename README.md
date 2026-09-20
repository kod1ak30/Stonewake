# Stonewake for iPhone · Build 18

Stonewake is a SwiftUI iPhone game with bundled artwork, effects and music. Its local kingdom works offline in WKWebView. Playable buildings, troops, ships, commanders and provinces stop at level 10.

This repository preserves the current Build 18 development checkpoint. Builds 15 through 17 introduced maintained source modules, landscape-only play, revised menus, separate land and sea campaigns, cargo preparation, ten Keep appearances, connected walls and roads, and additional character art. Build 18 repairs native button touch handling after a physical-phone diagnostic found repeated presses and unmatched releases. It also improves the optional touch diagnostic and keeps pressed button hit areas steady.

**This is a development checkpoint, not a production-ready release.** Build 18 is installed on the paired iPhone and the save was preserved byte for byte immediately after installation. The final launch attempt was blocked by the device lock; real-finger acceptance of the touch repair remains pending. Its recorded checks are 189 frontend tests, 36 native checks, successful device and Simulator compilation, and nine Simulator touch activations from nine recorded releases. Simulator input does not establish physical-finger reliability. Art, combat responsiveness, audio, balance and broader usability still require further work and device acceptance.

See the [Build 18 delivery record](planning/touch18/DELIVERY.md), [touch diagnosis](planning/touch18/DIAGNOSIS.md), [Build 17 delivery record](planning/overhaul17/DELIVERY.md) and [commercial launch gates](docs/BUILD15-LAUNCH-GATES.md). The earlier records remain historical evidence, not claims that their quality limits have been resolved. The GitHub recovery tag for this snapshot is `build-18-checkpoint`.

## Retained medieval content

Build 12 introduced The Broken Beacon: six connected missions with an engineer rescue, a vulnerable escort ship, a city defense and a combined land/sea finale. Three fixed-army mastery trials, six resident stories, three finite event tracks and a level-10 conclusion give progression clear goals and one-time rewards. These expeditions preserve the player's home army and fleet.

The new Store & Wardrobe contains 22 appearance pieces across kingdom palettes, banners, sails, roads, commander outfits and placeable ornaments. Earned gems purchase eligible items with an explicit confirmation; previews do not change ownership or spend currency. Three permanent cosmetic collections and gem packs have a StoreKit/server implementation, but real-money purchasing remains unavailable until Apple products and the service are activated. Appearance does not grant combat power.

The waterfront changes as the story progresses. Painted lighthouse stages, sail and roof recoloring, battle effects, structural debris and synchronized music/haptic events support presentation. Build 14's shared articulated renderer covers the troop families and four ship roles. This does not establish a finished commercial art standard.

Build 11 added stronger touch deployment, dark responsive city menus, four staged civic districts, warned computer raids, measured defense reports, working area defenses, expanded-map pathfinding and new painted animation/orientation art. The Keep, cottage, barracks, storehouse and shipyard have three architectural stages in four directions, with details at individual levels.

The home village has 256 land plots; all five provinces extend it to 324, plus coastal shipyard berths. Resource capacity grows through completed storehouses. Building limits include construction in progress. Existing overflow from the storage migration remains in withdrawable reserve crates. Roads connect producers to the Keep, gardens help nearby housing, and civic projects improve existing sites.

In battle, select a troop once and tap, hold or drag along valid deployment ground, or drag directly from its card. Two fingers control the camera without deploying troops. Sea battles add cargo landings, movement, focus fire, abilities and withdrawal. Sunk ships need repair. Mortars, bomb towers and flame defenses damage clustered ground troops. Saved historical battle inputs keep their original results.

At Keep 3, computer raids begin after a twenty-minute initial shield and five-minute warning. Settling a raid grants two hours of protection. Returning after a long absence resolves at most one overdue raid. Walls and defenses protect loot, and reports show actual damage contributions. Local defenders' buildings, army and fleet recover afterward; gems and reserve crates cannot be stolen.

The native online bridge and a server-authoritative D1 service implement Apple sign-in, revision-safe cloud backup, a separate online kingdom, asynchronous player attacks and verified StoreKit gem delivery. Hosting authentication and Apple provisioning are still required, so these features remain visibly unavailable in the bundled app until activated. No real purchase has been made. The existing local kingdom is preserved separately from online play.

## Build and review

Use Node 22.13 or newer. From the project root:

```sh
npm ci
npm run verify
```

`npm run build` compiles the application, dedicated combat worker and shared server rules, then refreshes packaged asset hashes. `npm run check` checks module boundaries, TypeScript and lint; `npm test` runs frontend regressions. Source maps and the exact output manifest are under `.build/`. These commands do not install an app, deploy services or enable purchases.

Open `Stonewake.xcodeproj` in Xcode, choose the appropriate development team, and run on an unlocked paired iPhone or an iOS Simulator. Current identity: `com.chrismozer.stonewake`, version 1.0, build 18. Save storage is `Library/Application Support/Stonewake/kingdom.json`, with an atomic prior-copy backup. Archive the current save before a physical update, compare bytes immediately after installation and before launch, then check preserved progress after launch.

For a disposable browser review origin:

```sh
python3 scripts/preview15.py --port 8773
```

Open `http://127.0.0.1:8773`. The server binds only to localhost and serves the packaged Web directory. Use a separate origin or an explicitly supplied disposable fixture for gameplay tests. Keep private device saves outside the source tree.

The maintained entry is `frontend/app.js`. Shared rules live in `frontend/core/` and `client/build14/{rules,naval,simulation}.js`; current app coordination and presentation remain in `client/build14/{render,ui,gestures,Ju,Eu}.js`, the shared `client/` modules, `client/build15/` and `client/build17/`. Native touch activation and its diagnostic live in `frontend/runtime/`. The frozen `client/build14/engine13.js` is historical reference and is not a build input. Do not run retired bundle-preparation scripts. The old `sync-build14.cjs` and `export-server-rules.cjs` names only delegate to the ordinary compiler for compatibility.

Active styles are `Stonewake/Web/interface17.css`, `interface15.css`, `interface14.css` and the base asset stylesheet. Native Xcode packaging includes the Web folder, including `assets/battle-worker.js`, `art/build15/` and `art/build17/`. Generated app assets are retained with their source so the installed development checkpoint can be recovered.

Additional regression checks:

```sh
node scripts/verify-build14.cjs
node scripts/verify-gestures14.cjs
node scripts/verify-premium-rules12.cjs
npm test --prefix backend
python3 scripts/verify-native15.py
npm run release:check
```

A fresh backend checkout also needs `npm ci --prefix backend`. Backend tests use local D1 and Workerd; they do not establish genuine Apple purchase success or live service readiness. The release checker currently returns **12 PASS, 0 FAIL, 11 BLOCKED**, with expected exit code `1`. Missing commercial evidence must be resolved separately, rather than bypassing gates.

Build 15 screenshots are under [planning/build15/screenshots](planning/build15/screenshots). Native logs and raw device-save backups remain outside the repository under `~/Library/Developer/Stonewake-review`. See the release record for the exact scope and limits of verification.

## Engineering and earlier releases

- [Build 15 source architecture and reproducible build](docs/BUILD15-ARCHITECTURE.md)
- [Build 18 touch repair and verification](planning/touch18/DELIVERY.md)
- [Build 17 world and gameplay overhaul](planning/overhaul17/DELIVERY.md)
- [Build 15 native implementation and policies](docs/BUILD15-NATIVE.md)
- [Build 15 art provenance and remaining work](docs/BUILD15-ART.md)
- [Build 14 release and verification](docs/BUILD14-RELEASE.md)
- [Build 12 release notes](docs/BUILD12-RELEASE.md)
- [Store ownership, native feedback and original audio](docs/STORE-AUDIO12.md)
- [Earlier Build 11 release](docs/BUILD11-RELEASE.md)
- [Civic progression, raid rules and pacing tests](docs/BUILD11-PROGRESSION.md)
- [Storage, building caps and base economy reference](docs/BUILD10-BALANCE.md), whose manual-only raid section is superseded by Build 11
- [Online deployment and Apple provisioning](docs/ONLINE-DEPLOYMENT.md)
- [Native bridge and service API](docs/ONLINE-API.md)
- [Planned later ages](docs/progression-roadmap.md), none implemented beyond level 10
