# Stonewake input reliability review

Status: source corrections implemented; integrated browser and physical-device validation remains with the main task. No phone build was installed by this subtask.

## Confirmed geometry defect: feedback covers most of the scene

The loaded Build 15 styles combine these rules:

- `interface14.css`: `.sw-notice` is fixed, `bottom:14px`, `z-index:90`, `pointer-events:auto`.
- `interface15.css`: `.sw-notice` adds `top:calc(var(--sw-toolbar) + var(--sw-safe-top) + 8px)` but did not reset `bottom`.
- Celebration notices remain for 1,800 ms, as implemented by `Hu().celebrate()` in `frontend/legacy/presentation.js`.

The main task reproduced the old geometry in the running browser at 844 × 390 after training one Shieldbearer. The notice text was “1 soldier ready!” and its observed bounds were:

| Property | Observed value |
| --- | --- |
| Left / right | 310.25 / 533.75 px |
| Top / bottom | 64 / 376 px |
| Width / height | 223.5 / 312 px |
| Computed bottom | 14 px |
| Pointer events | auto |
| z-index | 90 |

This is a real layout defect. It is not yet proof that this is the complete explanation for the user's repeated taps. A Train tab tap in a portaled Army dialog still succeeded while the old notice was present. The game shell uses `isolation:isolate`, so comparing the notice's z-index with a dialog's z-index alone does not prove their hit-test order. The likely interception surface is the home scene and its menu, pending direct hit testing.

Correction in `Stonewake/Web/interface15.css`:

- Explicit `bottom:auto` and `height:auto` prevent stretched geometry.
- Noninteractive notice and Journal feedback surfaces use `pointer-events:none`.
- Their actual dismiss buttons retain `pointer-events:auto`.

The correction preserves dismissal and avoids replacing native click handling with an unsafe synthetic touch-to-click workaround.

## Confirmed navigation state defect: Build can remain a second modal

`SWNavigate()` closed boolean-controlled dialogs, but Build is controlled separately by `f === 'build'`. Previously, `SWNavigate('army')`, `SWNavigate('fleet')`, `SWNavigate('storage')` and similar destinations opened their dialog without clearing the Build screen. The source therefore permitted two modal focus and pointer scopes to remain mounted. Whether this was the exact path behind the user's missed taps has not been reproduced on their device.

Correction in `client/build14/Ju.js`:

- Retire the Build screen before opening a different destination.
- Preserve deliberate Back navigation, which can restore Build as the sole dialog.
- Keep the frontier visible behind scouting and Army preparation.
- Preserve the explicit save/cancel gate for an unfinished layout.

`frontend/test/navigation.test.mjs` executes the exact production `SWNavigate()` declaration with controlled state setters. It does not duplicate a separate routing implementation. Four tests pass, covering 19 menu destinations, dialog-to-dialog transitions, Back and Close, frontier preparation, screen navigation, and unfinished-layout protection. The JavaScript syntax check and targeted lint also pass.

## Other inspected paths and limits

- Buttons already use `touch-action:manipulation`; there is no need to blindly add another touch handler to every button.
- The native root scroll view has scrolling and page pinch disabled; map pinch is handled by the map itself. No proven native recognizer fault was found in this source pass.
- Battle pointer listeners are global and observe UI pointers, but this source pass did not prove they suppress ordinary menu clicks. They were not changed speculatively.
- Main-thread rendering remains active behind menus. That warrants performance measurement, but is not a proven cause of repeated taps from source inspection alone.
- No claim is made that these two corrections resolve every sizing, navigation, responsiveness, or device-specific defect.

## Integrated browser result

The main task rebuilt the client and repeated the notice check. At the same 844 × 390 viewport, the notice height was **64 px instead of 312 px**. Its surface computed to `pointer-events:none`, while the dismiss button computed to `pointer-events:auto`. This verifies the geometry and hit-target correction. It does not establish that a widespread physical-iPhone input problem has been fixed.

## Systemic input follow-up

The user clarified that repeated taps occur throughout the game. Treat that as a separate unresolved priority until native event delivery and response timing are measured.

| Candidate / inspected path | Exact source evidence | What is and is not established |
| --- | --- | --- |
| Native sound work on menu taps | `Stonewake/StonewakeApp.swift:463`, `:483`, `:484`, `:487` | Each accepted effect reconfigures and activates the audio session and creates a player before playback. The work is synchronous in the handler path. Its duration and effect on touch delivery have not been measured. |
| Native save work | `Stonewake/StonewakeApp.swift:200`, `:202`, `:260` | Saving validates JSON, reads and validates the prior save, then writes a backup and primary atomically before acknowledging. This synchronous callback work could stall input if slow. No device timing has established that it does. |
| Web save serialization | `frontend/legacy/presentation.js:2209` | The full envelope is serialized before the native message or browser storage write. Timing depends on actual envelope size and device. |
| Scene rendering behind menus | `client/build14/Eu.js:521`, `:961` | Rendering continues while the document is visible, including under modal menus. This can consume rendering budget; source inspection cannot establish input latency. |
| State update frequency | `client/build14/Ju.js:183`, `:457`, `:662` | Derived state is evaluated during renders, the village ticks each second, and combat time updates at 50 ms intervals. No button replacement or global click suppression was proven. |
| Map gesture capture | `client/build14/Eu.js:86`, `:1120`; `client/build14/gestures.js:11`, `:34` | Global listeners track pointer state. Prevent-default and capture calls belong to map/deployment starts. Ordinary buttons do not use a global blanket prevent-default. A native cancellation defect remains unproven. |
| Native page gestures | `Stonewake/StonewakeApp.swift:48`, `:54`, `:213` | Root page scrolling/zooming are disabled. Map gestures are handled separately. Blindly toggling these flags would risk breaking scrolling or deployment without evidence. |
| Native loading cover | `Stonewake/StonewakeNative15.swift:73` | The initial cover fades out and is hidden after readiness. No evidence shows it repeatedly blocking normal gameplay. |

No speculative changes were made to audio, saving, UIKit gesture arbitration, or the game-wide click handlers.

### Optional two-minute touch check

Implemented in `frontend/runtime/input-probe.js`, exposed through **Settings > Device > Start touch check**:

- Off by default, session-only, and requires Local diagnostics to be on. Existing diagnostics default to on, so merely enabling diagnostics does not start this separate check.
- Passive capture listeners observe button-like controls. They do not prevent defaults, stop propagation, replay taps, synthesize clicks, or change game state.
- Numeric aggregates are batched at most once every 30 seconds and once on stop. No control text, touch locations, identifiers, saves, URLs, or raw event records are exported. Temporary pointer coordinates are used only in memory to exclude drags.
- Stops after two minutes, when the app is hidden, when diagnostics are disabled or cleared, or when the game lifecycle is disposed.
- Reports button downs, stationary releases, click arrivals, cancels, drags, detached controls, repeated presses while a previous release awaits a click, event-delivery delay, and the largest observed 250 ms timer delay.
- A `tapMissingClicks` count means a stationary release did not produce a matching click within 550 ms. It does not by itself prove an application bug: a control can become disabled, focus can change, a native gesture can intervene, or a delayed click can arrive later.
- A DOM click count does not prove the intended action was accepted or painted. Compare it with the existing `screen_open`, `action_ok`, and `action_blocked` samples, and observed UI behavior.
- The probe cannot see a physical tap that never reaches the web document. It also does not cover sliders, text fields, selectors, or map deployment as expected-click controls.

Eight deterministic tests pass for normal taps, keyboard/synthetic-event exclusion, scrolling/cancel handling, missing and delayed clicks, detached controls, lifecycle reset, numeric-only output, passive listener cleanup, diagnostics opt-out and the two-minute time limit. The existing 12 experience tests, strict TypeScript check, and targeted lint also pass.

### Exact native acceptance procedure

1. Use the same physical iPhone and saved village. Record the actual app build and orientation. Start the optional check; do not grant currency or reset progress.
2. With sound effects on, perform 20 deliberate single taps across Menu, Army tabs/families, Harbor tabs/ship selection, Settings tabs and Close. Count intended versus visible transitions. Repeat a small number after a scroll and after a reward, and distinguish disabled controls from failed enabled controls.
3. Stop the check and export its local support report. Repeat the same sequence with effects off, with a fresh check. A clear difference is evidence to profile audio work, not proof by itself.
4. Use Xcode Instruments' main-thread and event/hang views during that sequence. Place timing signposts around sound-session setup, player creation, full save serialization/validation, backup/primary writes and the native save acknowledgment. Record p50, p95 and maximum elapsed time using the actual phone save size; do not infer timing from desktop results.
5. If physical taps are missing before DOM `pointerdown`, use a development-only native event-delivery counter or Instruments to compare UIKit touch arrival with web pointer events. Keep that probe passive and numeric; do not introduce another gesture recognizer merely to manufacture clicks.
6. If down/up arrive but clicks are canceled, correlate with scroll/gesture cancellation, detached or newly disabled targets, modal overlays and pointer capture. If clicks arrive and are accepted but painting is late, profile scene rendering and the React/state work instead.
7. Acceptance requires single-tap behavior across both landscape orientations, immediately after opening a menu, after scrolling, after rewards, during save/completion activity and after background/resume. A few successful desktop clicks do not close this issue.

Physical-phone execution of this procedure is still pending. A [20 September native follow-up](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/NATIVE-CHECK.md) recorded 39 matching Simulator input sequences, checked recruitment and upgrading, and fixed moving Harbor tab positions. The input probe remains diagnostic instrumentation, not a claimed fix for the systemic physical-phone issue.
