# Build 15 native foundations

This is an implementation and verification record, not an App Store readiness declaration.

## Delivered

- iPhone supports landscape left and landscape right. Portrait is removed. The status bar is hidden and the world view fills the screen. HUD controls must respect the safe inset contract below.
- A dark Stonewake launch storyboard transitions into a matching native loading cover. Loading failure exposes a retry control and retains the saved kingdom. Loading ends on the web `ready` message, with a compatibility fallback that requires a rendered React root.
- Web content process termination reloads from the most recently acknowledged native save. The boot script is replaced on recovery, so stale snapshots do not accumulate. At most two automatic recoveries run in a 60-second window; further failures expose manual retry.
- The existing atomic primary/backup save format and native purchase guards remain intact. No balance grant, state migration or purchase activation is performed by the native changes.
- Bundle resources are read outside the main thread in 64 KB chunks, with two concurrent readers, a 64 MB per-file ceiling and cancellation. Resolved paths must remain inside the bundled Web directory. Versioned resources receive cache headers; other resources require revalidation. This bounds read memory, but does not establish a decoded GPU or WebKit memory budget.
- Backgrounding and audio interruptions stop sound effects, narration and music. Music resumes only when allowed and active. Unplugging headphones pauses audio until settings explicitly re-enable it. Media-service resets recreate players. Actual speaker, Bluetooth and interruption behavior still needs device testing.
- Build/research completion notifications are local and opt-in. Authorization is requested only by the explicit Settings action. Scheduling never asks for permission. The nearest 20 valid future projects are scheduled, superseded/completed projects are removed, and notifications stay quiet while the app is foregrounded. The app does not register for remote push.
- A local diagnostic ring stores at most 300 allowlisted events and numeric measurements. It excludes names, saves, credentials, purchase receipts and URLs. An explicit Export action opens the system share sheet; the app does not upload the report. An unclosed foreground session is labeled unclosed, not a proven crash. This is not a replacement for symbolicated crash reports or profiling.
- Privacy manifest now declares the system uptime use that already existed for in-app haptic timing, alongside UserDefaults. Raw uptime is not logged or exported. Final privacy declarations must still be reconciled with the shipping backend and all shipped dependencies.

## Native bridge

Post to `window.webkit.messageHandlers.stonewake`:

```js
{ kind: 'native', id: 'unique-request-id', method, payload: {} }
```

Replies are `stonewake-native-response` events with `detail: {id, ok, result}` or `{id, ok: false, error: {message}}`. An ID is optional for fire-and-forget events. The bridge accepts only the main `stonewake://app` frame.

| Method | Payload | Result / effect |
| --- | --- | --- |
| `ready` | `{}` | Dismiss loading cover after the first playable render. |
| `status` | `{}` | `{version:15, landscape:true, notifications, diagnostics}`. |
| `notifications.status` | `{}` | `{authorization, enabled, localOnly:true}`. Authorization and the app's opt-in flag are separate. |
| `notifications.request` | `{userInitiated:true}` | Request OS permission if undetermined, then enable only if authorized. No repeat prompt after denial. |
| `notifications.sync` | `{projects:[{id,title,readyAt}]}` | Replace the schedule with valid upcoming projects. `readyAt` is Unix milliseconds. IDs are bounded ASCII identifiers; titles are bounded to 80 characters. Scheduling is serialized. |
| `notifications.disable` | `{}` | Disable opt-in and remove Stonewake project notifications. |
| `notifications.settings` | `{userInitiated:true}` | Open app settings, for changing a denied OS permission. |
| `diagnostics.settings` | `{enabled:boolean}` | Persist the device-wide logging preference. `status.diagnostics.enabled` is authoritative on iPhone. Existing records remain until cleared. |
| `diagnostics.clear` | `{userInitiated:true}` | Clear and persist the native event ring; the web client also clears its local log. The essential foreground recovery marker is separate. |
| `diagnostics.record` | `{event,metrics}` | Record allowlisted event names and finite numeric values only. Unknown data is dropped. |
| `diagnostics.export` | `{userInitiated:true}` | Present the system share sheet with a local support JSON. No automatic sending. |

`stonewake-notifications-changed` broadcasts notification status after opt-in, opt-out and foreground activation. Sync again when enabled. Projects should be synced after relevant state changes, cancellation, completion, speedup and account/mode changes. Notification accuracy is limited to the latest schedule the app has received.

`stonewake-lifecycle` broadcasts `{state:'active'|'inactive'|'background'|'closed'}`. The web client should flush local progress on inactive/background and resume transient work on active. Native recovery restores only saves that native storage acknowledged.

`__STONEWAKE_NATIVE__ = {version:15,landscape:true}` is available at document start. Safe-area updates set `__STONEWAKE_SAFE_AREA__` and CSS `--sw-native-safe-top/right/bottom/left` in pixels, and emit `stonewake-safe-area`. Use CSS `max(env(safe-area-inset-left), var(--sw-native-safe-left, 0px))`, similarly for the other sides. Apply this to HUD/dialog controls, not the world canvas. The root viewport must use `viewport-fit=cover`.

Native diagnostic allowlists include the root client names `session_start`, `session_resume`, `session_background`, `session_end`, `screen_open`, `action_ok`, `action_blocked`, `battle_start`, `battle_end`, `guide_start`, `guide_step`, `guide_skip`, `guide_complete`, `frame_sample`, `runtime_error`, `promise_error`. Metrics include `screen`, `action`, `completed`, `total`, `fps`, `slow_percent`, `won`, `damage`, `sea`, `code`. Screen/action values must be numeric codes, never user text.

## Verification

- `python3 scripts/verify-native15.py`: 31 compiled Swift checks passed. Tests cover primary/backup atomic persistence, corrupt-primary recovery, rejection without overwrite, bounded notification schedules, timestamps, duplicate IDs, title sanitization, native diagnostic opt-out persistence, private metric rejection and clearing the on-disk event ring. A temporary save directory is substituted before compilation; real saves are not opened.
- Native Simulator build compiled for arm64 and x86_64, including the launch storyboard. Release configuration also compiled for physical iPhone arm64 with signing disabled. No Swift warnings; only the expected optional App Intents metadata notice. These builds use the native validation staging copy, not the final integrated web release.
- No device install or online deployment was performed by this native subtask. Compile success does not prove orientation on a cold physical launch, safe-area geometry, delivery while locked, audiovisual quality or stable performance.

## Remaining launch gates

1. Integrate the final web assets, then build and archive the exact release candidate. Verify packaged asset hashes and native version, rather than relying on this earlier native-only compile.
2. Test cold launch, both landscape rotations, first-run tutorial, loading failure/retry, background/foreground, lock/unlock, content-process termination and recovery against a backed-up real save. Confirm HUD controls avoid the Dynamic Island and home indicator.
3. Exercise notification authorization grant/deny, opt-out, speedup/cancellation, duplicate updates, foreground suppression, locked-device delivery and notification launch. Verify real completion times after app restart. Do not require notifications to play.
4. Test speaker volume, silent switch expectations, wired/Bluetooth route changes, interruptions, narration and repeated battles. Profile sustained play on the oldest supported physical iPhone and the current target. Record memory peaks, thermal behavior and measured frame pacing.
5. Create or verify the App Store Connect app record, bundle ownership, signing and distribution profiles, contracts, banking/tax and product configuration. None of those are completed by this source change.
6. Deploy and operate the production service with an approved HTTPS URL, verified Sign in with Apple configuration, purchase verification and refund handling, backups, monitoring and tested account deletion. The current native service URL remains empty. Purchases remain disabled with an empty catalog.
7. Define products and price points, verify StoreKit sandbox/TestFlight purchase, cancel, pending, restore, duplicate delivery, account ownership and refund scenarios, and submit the products with the release. No real-money purchase path is enabled here.
8. Complete privacy policy, support/contact and account-deletion surfaces, current App Store privacy disclosures, age rating, asset/audio rights, screenshots, description and review notes. Audit the privacy manifest against the release binary and backend. Local diagnostics do not establish product analytics or consent for remote measurement.
9. Test on TestFlight and a real fresh-player cohort. Establish funnel, retention, usability and stability evidence before declaring commercial readiness. Longer waits and purchases are not substitutes for those results.

Apple references checked for the required-reason API audit: [Required reason APIs](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api), [API categories](https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacyaccessedapitypes/nsprivacyaccessedapitype).
