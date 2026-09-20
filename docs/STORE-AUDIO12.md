# Build 12 store, feedback and audio

The implementation is local and reviewable. Cloudflare authentication, a deployed service, Apple Sign in provisioning and App Store products remain unconfigured. No real purchase, Apple-verified successful payment, deployment or physical iPhone audio/haptic test occurred.

## Verified store contract

`PRODUCT_CATALOG` is a server-only JSON configuration. Existing numeric gem grants remain compatible; explicit entries support these forms:

```json
{
  "com.chrismozer.stonewake.gems250": {"type":"consumable","gems":250},
  "com.chrismozer.stonewake.collection.mariner": {"type":"nonConsumable","collectionId":"mariner"},
  "com.chrismozer.stonewake.collection.royal": {"type":"nonConsumable","collectionId":"royal"},
  "com.chrismozer.stonewake.collection.founder": {"type":"nonConsumable","collectionId":"founder"}
}
```

This example specifies identifiers and grants, not available products or prices. The shipped catalog is empty and purchasing remains disabled. The server validates collections against the shared game catalog. It never accepts a product type, grant quantity, collection or price supplied by the purchase caller.

Native StoreKit returns `id`, `type`, localized `name`, `description` and `displayPrice`, plus the server's `gems` or `collectionId`. A StoreKit product must match the configured consumable/non-consumable type. `purchase {productId}` and `restorePurchases` deliver signed transactions to the server. The native bridge grants nothing from a local entitlement or receipt. Restore enumerates unfinished transactions and `Transaction.currentEntitlements`; an empty device list does not revoke another device's server ownership. These account-bound collections require the same Stonewake account; Family Sharing is not implemented and should not be enabled on these products.

The server checks Apple's signature/trust chain, bundle, environment, account token, quantity and type before granting. Consumable transactions grant once. Cosmetic entitlements use the original transaction ID, so restored transaction IDs cannot duplicate ownership or move a collection to another account. Each collection source is tracked separately from gem purchases and earned rewards.

Apply migration `0003_cosmetic_entitlements.sql` after migrations 0001 and 0002. Refund tombstones cover both transaction and original transaction IDs, including a refund received before delivery. Database triggers invalidate pending account writes and revoke matching entitlements atomically. The next authenticated snapshot reconciles shared ownership rules: equipped refunded items return to defaults and paid decorations disappear, while independent earned/gem ownership survives. Signed native revocation updates also return the reconciled game. Cached online state remains read-only offline; it cannot grant competitive ownership or spend paid items.

## Native feedback contract

- `musicSettings {enabled,volume}` and `soundSettings {enabled,volume}` remain independent.
- `musicContext {context,intensity?}` accepts `calm`/`city`, `scout`, `battle`, `victory`. The victory cue returns to calm after its ending. Battle intensity, clamped to 0–1, controls a quiet synchronized percussion layer.
- `feedbackSettings {haptics,reducedEffects}` controls tactile feedback independently of sound. Reduced effects limits impact strength, impact frequency, sound concurrency and percussion.
- `haptic {event,intensity?,eventId?}` accepts `select`, `place`, `deploy`, `impact`, `naval`, `destroy`, `victory`, `defeat`, `reward`, `error`. The caller dispatches it at the visual impact time. Native deduplication and rate limits suppress repeated or dense events. Replays should not dispatch haptics. Sound messages no longer implicitly vibrate.

Music fades between contexts, pauses on interruption/backgrounding, and resumes without restarting the current loop. Battle stems start against the same AVAudioPlayer device clock and resume at the same play position. Effects have bounded concurrency. The existing quiet default music gain is preserved; the new victory cue is slightly quieter.

Story dialogue also supports optional system narration. The explicit Listen control sends `narration {action:"speak",text,speaker?,eventId?}`; Stop, dialogue changes and closing the dialogue send `narration {action:"stop"}`. Native status events use `stonewake-narration-status` with `{status,eventId?}`, where status is `speaking`, `stopped`, `finished` or `unavailable`. Narration uses an already available Apple English (US) system voice, never downloads voices or starts automatically, and caps a passage at 3,000 characters. Sound enablement and volume apply to speech. Music ducks while speech is active and restores on completion or cancellation. Backgrounding or audio interruption stops narration without automatically resuming it. This is synthesized narration, not recorded character voice acting; physical-device audibility remains unverified.

## Original audio and checks

`scripts/compose-audio12.py` composes additional music from original oscillators and seeded noise, reusing only the instrument functions in our original Build 10 generator. No downloaded composition, recording or sample is used.

| Asset | Length | Integrated loudness | True peak | Clipped samples |
| --- | --- | --- | --- | --- |
| Scout | 42.67 s loop | −25.0 LUFS | −13.8 dBFS | 0 |
| Victory | 10.19 s cue | −25.0 LUFS | −14.1 dBFS | 0 |
| Battle percussion | 48 s loop | −30.1 LUFS | −14.9 dBFS | 0 |

The scout and percussion decoded boundary steps are below their normal 99.9th-percentile sample-to-sample changes. Details are in `Stonewake/Web/audio/audio12-analysis.json`. These checks establish level, clipping and a bounded loop seam; they do not establish subjective sound quality on physical speakers.

## Verification

- `npm test --prefix backend`: 11 tests pass, including real D1 cosmetic ownership/refund races, restoration deduplication, timed stories, actual expedition and mastery victories, once-only rewards, two historical combat hashes, and forged Apple data rejection in the actual workerd runtime.
- `node scripts/verify-store12.cjs`: real UI and production JavaScript bridge against the actual service/D1. Pending/cancelled purchase fixtures leave state alone; server grants/restore/refund, equipped appearance reset, local-save isolation, fixed expedition orders/retreat, and music/feedback messages pass. Apple identity, localized products, successful JWS payloads and native files are explicit test fixtures. This is not an Apple-signed successful purchase or physical haptic test.
- `node scripts/verify-online-service11.cjs`: existing backup, multiplayer, interrupted-order retry and scheduled-raid flows remain passing with the new menu.
- `node scripts/verify-server-parity11.cjs`: saved-state normalization and ten-level economy/province/civic parity pass after exporting the Build 12 rules.
- Simulator native compilation succeeds with build number 12. `npm run check --prefix backend` packages the Worker in dry-run mode; it does not deploy or validate a live plan's CPU allowance. Updated local compute observations are in `docs/ONLINE-CPU.json`.

## Primary references

- [Apple current entitlements](https://developer.apple.com/documentation/storekit/transaction/currententitlements)
- [Apple refund handling](https://developer.apple.com/documentation/storekit/handling-refund-notifications)
- [Apple server notification types](https://developer.apple.com/documentation/appstoreservernotifications/notificationtype)
- [Apple speech synthesizer](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer)
- [Apple available speech voices](https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice/speechvoices())
