# Stonewake online service: implementation and activation

As of 2026-09-19, the service works locally with Cloudflare D1 and the production Apple-verification entrypoint. The iPhone native code builds for arm64 and x86_64 simulators. No service has been deployed, no live player account has been created, and no App Store purchase has been made. Cloudflare's saved OAuth session expired and the browser opened a sign-in form with no active account. Apple Sign in capability and gem products are not provisioned in this project. The shipped service URL is empty, so the app accurately presents online features as unavailable.

## Implemented

- Native Apple sign-in with a single-use server nonce, Apple's JWKS signature/issuer/audience/age checks, hashed server sessions and Keychain-only bearer tokens.
- Independent cloud backup of the current local kingdom with compare-and-swap revisions and ten previous server versions. Explicit restore first creates a durable native archive, keeping ten archives. Online play never replaces the local save.
- A separate server-created Online Kingdom. The server runs rules extracted from the same client bundle, validates resource spending, owns timing, reserves armies/ships, snapshots real published player defenses, and computes outcomes. Client-authored wins, clocks, resources and full-state uploads are not trusted.
- Batched live orders with server times and versioned command sequences. Accepted concurrent commands cannot be discarded by an overlapping finish. Settlement is atomic across both players, credits only available storage, debits the same actual loot, saves reports and grants a two-hour defender shield.
- StoreKit2 localized product metadata, native purchase sheet, pending/cancelled handling, unfinished-transaction retry, and transaction finishing only after server delivery. Official Apple SignedDataVerifier checks certificate trust, signature, environment, bundle and purchase identity. appAccountToken binds a transaction to the online account. A unique transaction ledger prevents duplicate grants.
- Signed refund notifications. A database tombstone prevents a delayed original transaction from delivering after a refund. The reverse ordering removes delivered gems exactly once; spent refunded gems become debt applied against later purchased grants.
- Read-only native online snapshot cache, account isolation on asynchronous replies, and scheduled NPC raid resolution through the same authoritative rules.

## Activation steps, in order

1. Sign in to Cloudflare with the intended existing account. The agent's limited OAuth request uses account/user read, Workers write/scripts/tail and D1 write, all a subset of the previous grant. Do not use the old owner-only Sites application as a public API or embed its private gateway token in the iPhone app.
2. Review `backend/wrangler.jsonc` and create separate Sandbox and Production D1 databases. Replace its placeholder database ID with the returned ID. Never point production at the test database. Apply all three migrations (0001, 0002 and 0003). Set a worker CPU limit appropriate for the measured battle workload and the account plan; no plan purchase or upgrade is authorized by this document.
3. Run `npm ci`, `npm run rules`, `npm test` and `npm run check` in the backend workflow. Regenerate shared rules after any game-rule change. `scripts/verify-server-parity11.cjs` compares client/server saves, resource formulas, province bounds and civic claims. Review/deploy the exact resulting source with Wrangler. Confirm HTTPS health, unauthorized rejection and the two-player flow in the sandbox deployment before selecting it in the app.
4. Enable Sign in with Apple on `com.chrismozer.stonewake` for team `RC8WR3WZC7`, refresh the provisioning profile, and build with `STONEWAKE_ENTITLEMENTS=Stonewake/StonewakeOnline.entitlements`. Set `StonewakeServiceURL` in Info.plist to the reviewed HTTPS service origin. No secret goes in Info.plist or JavaScript.
5. Create consumable gem products and non-consumable cosmetic collections in App Store Connect. Product identifiers, types and grant quantities or collection IDs go in `PRODUCT_CATALOG` JSON; see `docs/STORE-AUDIO12.md`. The app obtains names and prices only from StoreKit. Configure the app's Apple numeric ID and the intended environment, then enable `PURCHASES_ENABLED` only after Sandbox verification. Production requires `APPLE_APP_ID`; Xcode/local-test StoreKit signatures are never accepted as Apple production/sandbox payments.
6. Configure App Store Server Notifications V2 to `/v1/store/notifications`. Test approved, pending, cancelled, duplicate, refunded-before-delivery and refunded-after-delivery transactions in Sandbox. Test account switching while a purchase is pending. Production and Sandbox ledgers must remain separate. No real-money purchase was performed during implementation.
7. Complete the public-release lifecycle before App Store submission: user-facing privacy policy and matching App Store privacy answers; account deletion and Apple token revocation flow; operations for refund reversal and customer support; recovery/retention policy and monitoring. The privacy manifest declares account IDs, gameplay content and purchase history for app functionality, without tracking. This implementation is not a claim of App Store approval or a public-launch security audit.

## Verification evidence and limits

`npm test` uses real local D1/SQLite transactions. Identity and successful transaction payloads are injected by test-only dependency fixtures to exercise the ledger; production has no test-auth route or mock purchase branch. A separate actual workerd test loads the production Apple verifier and rejects forged JWS data, an untrusted certificate chain and an invalid identity token. Real Apple-account login and an Apple-signed successful purchase still require provisioning and Sandbox testing.

`node scripts/verify-online-service11.cjs` drives the real app UI and production JavaScript bridge against the actual local service and ephemeral D1. It passes backup revision/isolation, archive-before-restore of an older save, authoritative rename, published-player scout/attack, battle reservation, server-timed batched deployment, retry after losing an already-committed reply, return to local during an in-flight order, authoritative resume, retreat settlement, duplicate-finish rejection, defender report shape and one scheduled NPC raid. Native identity and file storage are explicit test boundaries in `backend/test/ui-fixture.mjs`; purchases are disabled. This fixture is not imported by the Worker and contains no production route. The test requires the local app server on port 8768 and preserves the physical phone save.

The rule-parity test uses a clone of the saved phone kingdom. No device save is imported into the competitive service. Native builds do not prove device login, StoreKit availability, physical audio, or deployed network availability.

Store results contain compact outcomes and immutable battle input, not the multi-megabyte render frames. Replays regenerate frames locally. This prevents D1's row-size limit from breaking long naval battles.

Authoritative online actions require a connection. Offline cached online state is read-only. The local kingdom remains playable offline. There is no implicit merge, no client snapshot that can mint paid gems, and no invented live opponent.

### Battle compute budget

`backend/test/benchmark-rules.mjs` measured the following three-run ranges for the Build 12 combat/presentation inputs on this Mac using Node v25.5.0, darwin arm64. Full results and the exact rules hash are in `docs/ONLINE-CPU.json`. These local process measurements are not Cloudflare CPU or latency guarantees. Process CPU includes Node runtime work and can exceed wall time. A deployed Sandbox benchmark and the intended account's Worker CPU allowance are activation requirements; free-plan production readiness has not been established.

| Simulation | Buildings / troops | Local wall time | Local process CPU | Full frames / stored summary |
| --- | --- | --- | --- | --- |
| Early campaign with navy | 41 / 12 | 33–37 ms | 62–86 ms | 1.55 MB / 405 bytes |
| Late campaign with navy | 47 / 72 | 195–209 ms | 199–347 ms | 2.07 MB / 408 bytes |
| Saved city scheduled raid | 17 / 20 | 65–66 ms | 69–156 ms | 3.20 MB / 329 bytes |
| Expanded city, Keep at 17,17, navy | 17 / 72 | 512–601 ms | 670–961 ms | 2.77 MB / 407 bytes |

The service computes a battle on settlement, not for each deployment command. Long path searches on expanded cities are the most expensive tested case. Do not choose a CPU limit solely from the early campaign case. Configure `limits.cpu_ms` only after checking the account plan and deployed measurements, with headroom for authentication, validation, database work and more demanding legal layouts. No plan upgrade or spend has been performed.

## Primary references

- [Apple sign-in and nonce verification](https://developer.apple.com/documentation/signinwithapple/authenticating-users-with-sign-in-with-apple)
- [Apple StoreKit transactions](https://developer.apple.com/documentation/storekit/transaction)
- [Apple App Store Server Library and trust-root setup](https://github.com/apple/app-store-server-library-node)
- [Apple PKI trust roots](https://www.apple.com/certificateauthority/)
- [Cloudflare D1 transactional batches](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Cloudflare Workers Node crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/)
- [Apple privacy manifest collected data types](https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacycollecteddatatypes/nsprivacycollecteddatatype)
