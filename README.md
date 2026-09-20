# Stonewake for iPhone · Build 14

Stonewake is a SwiftUI iPhone game with bundled artwork, effects and music. Its local kingdom works offline in WKWebView. Playable buildings, troops, ships, commanders and provinces stop at level 10.

Build 14 separates ten land chapters from ten sea chapters. Land armies deploy directly. Sea forces use owned vessels, weighted cargo, selected landing areas, escort protection and ship orders. Four ship roles have visible level progression, damage, sinking and repair. Six troop families, saved forces, direct card-to-map deployment, shared upgrade requirements and a rebuilt dark menu system simplify the core loop. Layout mode supports commit/cancel and undo/redo. Art, combat effects, roads, citizens and the native audio mix have been revised.

Build 14 was installed and launched on the paired iPhone 15 Pro Max. Its existing kingdom and investments were checked before and after migration. Browser and Simulator checks complement the rules suite; physical touch feel, audio and sustained device performance still need hands-on validation. See the [release notes](docs/BUILD14-RELEASE.md) and [evidence worklog](planning/build14/WORKLOG.md).

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

Open `Stonewake.xcodeproj` in Xcode, choose the existing development team, and run on an unlocked paired iPhone or the dedicated Stonewake UI Test simulator. Current bundle: `com.chrismozer.stonewake`, build 14. Save storage is `Library/Application Support/Stonewake/kingdom.json`, with an atomic prior-copy backup. Archive the current save before a physical update and compare it after launch.

- [Build 14 release and verification](docs/BUILD14-RELEASE.md)
- [Build 12 release notes and remaining install/activation steps](docs/BUILD12-RELEASE.md)
- [Store ownership, native feedback and original audio](docs/STORE-AUDIO12.md)
- [Earlier Build 11 release](docs/BUILD11-RELEASE.md)
- [Civic progression, raid rules and pacing tests](docs/BUILD11-PROGRESSION.md)
- [Storage, building caps and base economy reference](docs/BUILD10-BALANCE.md), whose manual-only raid section is superseded by build 11
- [Online deployment and Apple provisioning](docs/ONLINE-DEPLOYMENT.md)
- [Native bridge and service API](docs/ONLINE-API.md)
- [Planned later ages](docs/progression-roadmap.md), none implemented beyond level 10

The current editable modules are `client/build14/{rules,naval,simulation,render,ui,gestures,Ju,Eu}.js`, with shared UI and art in `client/interface.js`, `client/premium-ui.js` and `client/visual13.js`. `client/build14/engine13.js` is the frozen base, not an editing target. After changes, run `node scripts/sync-build14.cjs`; after rule changes also run `node scripts/export-server-rules.cjs`. Do not run older bundle-preparation scripts over build 14. The active styles are `Stonewake/Web/interface14.css` and the base asset stylesheet; the older theme files are no longer loaded.

Current pure checks are `node scripts/verify-build14.cjs` and `node scripts/verify-gestures14.cjs`, plus `npm test` in `backend`. Backend tests use local D1 and the actual workerd Apple-verification entrypoint. Visual and touch flows are inspected through the browser and native Simulator. Use disposable save copies for gameplay tests. Older build 11/12 scripts are historical regression references and can contain obsolete UI assumptions.

Build 14 review images and rule reports are under `planning/build14`. Device logs, native build logs and raw save backups remain in `/Users/chrismozer/Library/Developer/Stonewake-review/build14`. Native builds and simulated play do not establish live Apple purchase availability or subjective device feel.
