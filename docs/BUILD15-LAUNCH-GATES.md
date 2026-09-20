# Build 15 launch gates

Status recorded on September 19, 2026. Build 15 has testable local foundations. Commercial release is blocked. An installable development build, a successful Simulator compile and passing fixture tests are different milestones from a verified paid release.

## Reproduce the assessment

From the project root on the configured Mac:

```sh
npm run release:check
```

The checker reads checked-in configuration and runs current module/type/lint checks, frontend tests, local backend tests and extracted native Swift policy tests. It does not rebuild packaged assets, deploy services, enable purchases, read a player's saves, install an app or contact App Store Connect. Backend tests run their local Workerd/D1 harness; successful transaction/identity cases use injected fixtures. The real Apple verifier is separately exercised with forged inputs that must be rejected.

The output distinguishes:

- **PASS:** a specific local check passed in this invocation, or a named source configuration condition is satisfied. Each result states its limit.
- **FAIL:** a local regression, unsafe configuration, invalid required input or test execution failure. Exit code `2`.
- **BLOCKED:** a missing configuration prerequisite or external evidence the checker cannot establish. Exit code `1` if there are no local failures. This is the expected current result.

`npm run release:check -- --config-only` skips all test execution and explicitly marks test evidence blocked. `node scripts/release-check.mjs --self-test` checks the release checker's validation and fail-closed behavior with in-memory inputs.

The report deliberately omits endpoint values, database IDs, product IDs, credentials and child-process output. To inspect a local failure, run its individual command: `npm run check`, `npm test`, `npm test --prefix backend` or `python3 scripts/verify-native15.py`.

External gates always remain blocked in this local tool. Supplying syntactically valid configuration does not produce an automatic commercial green light. Verified release evidence must be reviewed separately against the exact candidate; do not remove gates or activate purchases to obtain a zero exit code.

The final local validation run, after the Worker lifecycle review and guided-force regression update, reported **12 PASS, 0 FAIL, 11 BLOCKED** with the expected exit code `1`. Fresh results were **38 frontend checks, 12 backend checks and 31 compiled Swift policy checks**, plus module/type/lint checks. The focused guide/privacy/notification suite passed all 12 tests. The checker self-test previously passed 19 assertions. These counts supersede the earlier 35-test frontend handoff and must be refreshed after further changes.

The guided-force regression now follows the actual `trainLoadout` action. It checks that the fresh starting force requests 3 Infantry and 3 Archers, that construction and recruitment are affordable, and that all 6 troops are selected for battle afterward. The storage milestone is checked against a completed-victory state; this test does not itself prove a playable human victory. No UI, native code, packaged assets or player saves were changed during this final validation pass.

The 11 blocked checker gates are unchanged: service URL, D1 configuration, numeric Apple app record, Production verification environment, product catalog, commercial purchase activation, live backend/operations evidence, real Apple identity/StoreKit evidence, distribution/final archive, physical iPhone/player acceptance, and rights/privacy/storefront review. A development install or separately completed packaging does not clear those commercial gates.

## Current configuration and engineering evidence

| Area | Current observed state | What it establishes |
| --- | --- | --- |
| Native identity and orientation | Version 1.0, build 15; landscape left/right on iPhone and iPad; landscape launch; hidden status bar; branded launch storyboard selected. | Source configuration, not geometry on every device or contents of a signed archive. |
| Source/build architecture | Shared maintained modules compile the client, combat Worker and server rules. Reproducibility, historical replay compatibility, Worker equivalence and migration are regression-tested. | Local deterministic behavior and a maintainable build path. See [architecture record](BUILD15-ARCHITECTURE.md). |
| Native persistence and recovery | Atomic primary/backup save handling, bounded reloads and local completion notification policies are implemented. Extracted Swift validators run against disposable test storage. | Local policy behavior. Full WKWebView process recovery and OS delivery still need physical-device evidence. |
| Service URL | `StonewakeServiceURL` is empty. | This native source does not select a live backend. No endpoint is invented or configured by the checker. |
| Database | Checked-in D1 binding has a zero placeholder ID. | Production provisioning, isolation, migrations and backup/restore are not established. |
| Apple verification | Intended bundle namespace is configured; environment is Sandbox; numeric App Store app ID is empty. | Development intent only. Ownership, capabilities, real identity success and production verification remain unverified. |
| Store | `PURCHASES_ENABLED` is `false`; `PRODUCT_CATALOG` is empty. The native and server purchase guards remain in place. | Safe unavailable state. Examples in earlier docs are not real configured products or current prices. |
| Backend tests | Local D1 fixtures cover authoritative actions, concurrency, purchase deduplication/refunds/ownership, naval battles and replay rules. The production Apple verifier rejects forged transactions and identity tokens in Workerd. | Logic and rejection behavior, not genuine Apple purchase success, product approval, service operation or fraud resistance under production load. |
| Diagnostics | Device-local bounded allowlisted event rings, explicit export, persistent opt-out and clear controls. No automatic diagnostic upload or remote push registration is added. | A support tool for one device. This does not provide cross-player funnels, retention cohorts, symbolicated crash collection or consent for future remote analytics. |
| Privacy manifest | No tracking; intended online UserID, GameplayContent and PurchaseHistory functionality declarations; UserDefaults and internal uptime required-reason declarations. | Checked-in declarations. The shipping binary, dependencies, backend behavior and App Store privacy answers still require reconciliation. |

The native-only validation builds described in [the native record](BUILD15-NATIVE.md) are not a substitute for a signed final candidate containing the integrated web assets. Later source edits also require a fresh candidate build.

## External release evidence still needed

| Gate | Current status | Concrete next input and pass condition |
| --- | --- | --- |
| Final release candidate | **Not established by this check.** Root task may create a development candidate; that alone is not distribution approval. | Identify one immutable candidate by version/build, source revision and asset hashes. Archive with the intended team and capabilities, inspect the packaged privacy manifest and resources, and retain the archive and symbols. |
| Apple ownership and distribution | **Unverified.** No account provisioning or App Store submission is performed here. | Confirm the owning Apple Developer team, registered bundle, numeric App Store Connect app ID, Sign in with Apple capability, signing/provisioning, required agreements and intended TestFlight group. Verify the installed TestFlight candidate matches the archive. |
| Live backend | **Blocked by checked-in URL and D1 placeholders.** | Owner supplies the intended service account, deployment environments and approved endpoint. Provision isolated Sandbox/Production databases, apply and record migrations, verify authenticated actions, conflict handling, account deletion and recovery, and measure actual Worker CPU/latency at expected load. Keep production deployment as a separate authorized operation. |
| Operations | **No verified production evidence in this assessment.** | Assign an operator and support owner; establish monitoring, incident response, backup retention, a demonstrated restore and rollback procedure, rate/abuse limits, secrets rotation and data-deletion handling. Local benchmark files do not establish deployed capacity. |
| Real products and pricing | **Blocked by empty catalog and disabled purchases.** | Owner approves the product set, grants, cosmetic entitlements and price tiers. Create matching real App Store products with accurate localized metadata. Reconcile IDs/types/grants with the server catalog and verify prices are obtained from StoreKit. This task changes no prices or products. |
| Real StoreKit and identity validation | **Unverified external success path.** | On the actual candidate and Sandbox service, exercise real Apple sign-in, purchase success/cancel/pending, interrupted delivery, duplicate delivery, reinstall/restore, account switching, ownership, refunds and revocations. Verify App Store Server Notifications delivery, environment separation and ledger reconciliation. Injected receipts and forged-token rejection cannot close this gate. |
| Production purchase enablement | **Intentionally disabled.** | Complete and review the preceding Apple/product/server evidence, then configure the production app ID, environment and catalog through the release process. Verify the selected endpoint and fail-closed behavior before controlled activation. Never use the test catalog as production proof. |
| Physical iPhone stability and input | **Still requires exact-candidate acceptance.** Simulator/embedded checks are partial evidence. | Test both landscape orientations, cold launch, island/home-indicator safe areas, menu scrolling and dismissal, pinch gestures, hold/drag troop deployment, naval cargo/landing/orders, store/keep upgrades, fresh guide and established saves. Repeat background/lock/interrupt/recovery flows and verify progress survives. Record device/OS and any remaining defects. |
| Notifications and audio | **Implemented with unverified physical behavior.** | Test notification grant/deny, app opt-out independent of OS authorization, cancel/speedup rescheduling, locked-device delivery and tapping an alert. Test speaker/Bluetooth/headphone changes, interruptions, battle/music/SFX balance and long sessions. Playing must not require notification consent. |
| Performance and accessibility | **No sustained device performance or comprehensive accessibility sign-off.** | Profile the oldest supported physical iPhone and a current device through city, dense land/naval combat and repeated menus. Record frame pacing, memory, thermals, launch/reload times and low-memory behavior. Check touch targets, text scaling/contrast, reduced motion and meaningful accessibility navigation. Agree acceptable budgets before declaring a pass. |
| Villagers, visual quality and audio rights | **User has rejected the prior villager presentation.** Build 15 improvements still require human acceptance. Complete license inventory is unverified. | Review villagers at actual gameplay scale, animation direction/feet/shadows, buildings, roads, ships, hits/destruction and UI in motion on phone. Obtain user/art approval. Inventory every shipped image, sprite, font, sound and track with source, author, license and commercial rights. Original-audio generation notes do not cover all assets. |
| Privacy, storefront and support | **Unverified for the final service and binary.** | Finalize privacy policy and disclosures against actual collection, retention, processors and account deletion; audit third-party dependencies and required APIs; verify support/contact and in-app deletion flow. Complete age rating, accurate screenshots/description, review notes and purchase disclosures. A manifest alone is not legal or App Review approval. |
| Game quality and commercial evidence | **Unproven.** Existing guided/return systems and automated tests do not prove player satisfaction or retention. | Run fresh-player and returning-save sessions through both campaigns. Measure first-build/train/battle comprehension, menu friction, return reasons, challenge/progression and resource pressure. Set success criteria and sample/observation windows, review actual behavior and player feedback, then prioritize fixes. Obtain consent before adding any remote measurement. |

## Order of work

1. Finish the exact Build 15 candidate and physical usability/art acceptance, especially villagers, deployment, menus, save recovery and sustained performance.
2. Gather the missing ownership, endpoint, product and rights inputs. Keep local play and disabled purchases functional while this evidence is assembled.
3. Verify real Sandbox identity/purchase/refund/account flows and operational recovery with an isolated service.
4. Complete signed TestFlight, external playtesting and the final privacy/storefront review.
5. Make a separate evidence-based production release decision. No timer extension, price change, service deployment or paid activation is part of this readiness check.

Apple and platform requirements can change. The release owner must check the current official requirements at submission time; this source-level checklist does not claim approval or exhaustive legal compliance.
