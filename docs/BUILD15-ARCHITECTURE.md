# Build 15 source and build recovery

The client now compiles maintained ES modules directly. The regular build does not read `engine13.js`, splice marker strings, replace declarations by byte offset, or construct combat workers from function text.

## Reproduce the client

Use Node 22.13 or newer, then run:

```sh
npm ci
npm run verify
```

`npm run build` compiles the application, a dedicated combat worker, and the server rules from the same source modules. It refreshes the local app's asset hashes. It does not deploy a backend, enable purchases, change a device save, or install an app.

The dependency versions are pinned in `package-lock.json`. Source maps, compiler dependency graphs and a content-hash manifest are retained under `.build/`, outside the packaged web assets.

## Source map

| Location | Responsibility |
| --- | --- |
| `frontend/app.js` | Application entry and React mount |
| `frontend/core/rules.js` | Recovered pure catalogs, economy, older combat versions and save rules |
| `frontend/core/api.js` | Descriptive aliases for new callers |
| `client/build14/rules.js` | Current progression, action validation, preparation and migration |
| `client/build14/naval.js` | Sea campaign, cargo, ship orders and objectives |
| `client/build14/simulation.js` | Current deterministic battle simulation |
| `client/build14/Ju.js`, `Eu.js`, `ui.js`, `render.js` | App coordination, world input, menus and presentation |
| `client/interface.js`, `premium-ui.js`, `visual13.js` | Shared interface and authored visual helpers |
| `client/build15/experience.js` | First-session guidance and local device diagnostics |
| `frontend/legacy/presentation.js` | Preserved older presentation helpers, now an explicit module |
| `frontend/vendor/runtime.js` | Vendored library runtime preserved during recovery |
| `frontend/runtime/` | Worker entry and main-thread job coordination |
| `frontend/contracts/game.ts` | Typed save and Worker message boundaries |

Every active source file has explicit imports and exports. Add a named import when using a declaration from another file. `npm run check` reports missing bindings and rejects browser/UI dependencies in the Worker or server graph.

The previous generated client remains historical reference material. The `sync-build14.cjs` and `export-server-rules.cjs` compatibility commands now delegate to the ordinary compiler. Other older `sync-*` scripts are retired and must not be used over Build 15 output. The server consumes the rules emitted by the ordinary module compiler.

## Worker behavior

The worker has its own compiler entry and asset. Browser previews load that asset directly. Native WKWebView loads the same compiled asset through a Blob transport for its custom URL scheme. Neither path serializes function bodies or assembles declarations at runtime.

The queue keeps only the newest pending forecast while allowing a completed in-flight prefix to update animation. Cancellation prevents stale results from restoring a closed battle. Startup, shutdown and worker failure have explicit handling. Failure is reported instead of silently moving the simulation onto the rendering thread.

Modern battle start, restoration, replay and settlement use the worker result. The battlefield remains visible while the first forecast loads. A worker failure clears the previous result, blocks clock advancement, orders and settlement, and offers a retry using the latest input in a new worker. Historical replay versions retain their original version-specific simulation path.

The Worker dispatches through the same version-aware simulation function as the server, preserving historical replay versions.

## Safety and validation

A dedicated repository was initialized inside Stonewake. Commit `e895933` records the confirmed pre-change Build 14 backup. The enclosing Desktop repository was not changed. Recovery preserved the live presentation and experience edits while retaining the existing save and replay semantics.

Regression checks cover reproducible output, historical replay hashes, current sea-battle Worker/server equality, preservation of existing progression and gem balance, queue/cancel/failure behavior, genuine tutorial milestones and selected presentation behavior. The existing rules and backend suites remain relevant.

At the final code review, `npm run verify` passed all module checks across 21 input modules, checked JavaScript/TypeScript, lint and 38 frontend tests. Separate runs passed 280 existing Build 14 rule checks, 27 gesture checks, 179 premium-rule assertions and all 12 backend tests. Both historical replay hashes were unchanged. The compiled worker also matched the server exactly for a current sea battle with weighted cargo, landings and a ship ability. Forecast lifecycle tests cover persisted-order restoration, discarding stale victories after failure, retry with the latest orders and cancellation during an in-flight forecast.

The `.build/build-manifest.json` file records hashes for the exact generated assets. The app versions its worker request by that worker's content hash, so a cached earlier combat engine cannot be mixed with a newer app.

## Remaining engineering work

This is a build and module recovery, not a claim that all legacy code has been modernized. Many older identifiers remain short, and the vendored runtime remains a preserved compiled library snapshot. Recovered legacy files use `@ts-nocheck`; the new Worker and message boundaries receive checked JavaScript/TypeScript coverage. Broader domain typing, smaller legacy modules, accessible UI testing and localization are still incremental work.

Automated checks do not establish production purchase readiness, physical touch quality, sustained device performance, or commercial game quality. Those require their own native and player validation.
