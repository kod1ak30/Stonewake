# Native input follow-up, 20 September 2026

The initial Mac unlock allowed native Simulator testing to resume. At that stage, iPhone Mirroring still required separate authentication. The physical follow-up below was completed after authentication became available. No replacement build was installed on the phone.

At the end of the initial Simulator pass, the Mac locked again before iPhone Mirroring could be brought forward. The test app was terminated in Simulator after completing those checks.

## Results

| Check | Result | Limit |
| --- | --- | --- |
| Native menu navigation with sound effects on | 17 pointer downs, releases and clicks; zero missing-click or cancellation candidates | Two-minute Simulator sample, not physical finger input |
| Comparable navigation with effects off | 22 pointer downs, releases and clicks; zero missing-click or cancellation candidates | Approximately 99 seconds; not a controlled performance benchmark |
| Native training | One Crossbowman recruited on one press; army increased 47 to 48 | Disposable Simulator save |
| Native upgrade | Crossbowman research to level 2 started on one press | Disposable Simulator save; no instant-completion purchase |
| Harbor tab positions | Reproduced a large horizontal shift between Fleet and the other two sections; corrected and rechecked | Local source and Simulator only |
| Harbor landscape safe areas | Fixed tab positions and reachable primary actions in both landscape directions | iPhone 15 Pro Max Simulator |
| Compact Harbor layout | Browser checks at 667 × 375 and 932 × 430 passed for fixed tab bounds and reachable actions | Browser safe areas are zero; narrow ship detail needs a short internal scroll |
| Native sea preparation | Mission, Force, Fleet and Cargo opened with single presses | The existing over-capacity/default-loading and complexity problems remain |
| Native cargo keyboard | Keyboard moves the panel so the title and Close control are offscreen; keyboard dismissal restores them | Confirms the manual numeric-entry flow remains awkward |
| Automated validation | 50 tests, module/type/lint checks and native Simulator compilation passed | Does not establish physical touch reliability or overall release readiness |

## Input measurements

The local probe matched 39 recorded pointer-down sequences to clicks across both samples. Maximum DOM event delay was 29 ms with effects on and 209 ms with effects off; maximum JavaScript timer lag was 118 ms and 145 ms respectively. These small, non-randomized Simulator samples do not show an improvement from disabling effects. They do not establish that audio has no effect on the physical phone.

Seven native WebKit tap chains were also paired from existing logs: the first took approximately 973 ms from tap identification to synthetic-click completion, and the next six took approximately 13–56 ms. These are not touch-to-render timings. Startup, automated input and Simulator behavior remain possible contributors to the first outlier. No audio or save-path performance changes were made on this evidence.

The physical phone's copied log contains 81 events from September 19, 22:22–22:34 PDT. Eleven brief frame samples report 59.00–60.12 fps, with no recorded runtime, promise, save, engine, navigation or web-process errors in that retained interval. It contains no input samples because the installed phone build predates the optional probe. Those sparse, historical frame samples cannot disprove the user's missed taps.

Numeric test aggregates are in [input-summary.json](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/input-summary.json). Raw diagnostic copies and the pre-test Simulator save backup remain outside the repository under the private local review directory.

## Corrected Harbor defect

Before the correction, the Fleet tab row shared space with its actions, while Shipyard and Routes expanded to the entire row. In the same native window, the Shipyard target center moved from approximately x269 to x404, and Routes moved from x393 to x616. This means a rapid second press at the remembered position can target a different section even though input delivery is working.

The three sections now share one 300 px tab strip, consistent gaps and minimum 44 px touch height. Compact landscape moves Fleet actions to a separate row instead of squeezing or shifting the tabs. Sea campaign receives the scoped gold action styling. The native checks reused the same three coordinates successfully in both landscape directions. Only Harbor CSS was changed in this follow-up; no ship rules or army composition were modified.

Before, Fleet:

![Fleet before](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/02-fleet-before.png)

Before, Shipyard:

![Shipyard before](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/03-shipyard-before.png)

After, Fleet:

![Fleet corrected](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/04-fleet-fixed.png)

After, Shipyard:

![Shipyard corrected](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/05-shipyard-fixed.png)

The same layout with the camera cutout on the opposite side:

![Reverse landscape](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/07-reverse-landscape.png)

## Remaining native usability issue

The test village's sea mission opened with 74 spaces of troops for 24 cargo spaces and a disabled launch. Manual cargo entry then displaced navigation above the keyboard. These are still reasons to replace this workflow with one legal recommended force and optional advanced loading. This pass did not implement that larger redesign.

![Sea preparation](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/08-sea-preparation.png)

![Cargo keyboard](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/09-cargo-keyboard.png)

## Release status

The widespread physical-phone tap issue is still open. These results narrow the investigation and fix one additional concrete layout defect; they do not certify the game or justify calling it production-ready. The physical Mirroring follow-up below establishes that the tested navigation paths can respond on the installed build. Finger input still requires a current diagnostic sample and player confirmation. The broader art, naval preparation and economy work remains as specified in the main reassessment.

## Physical iPhone follow-up, 20 September

iPhone Mirroring connected to the paired iPhone 15 Pro Max. The installed version was verified as 1.0, build 15. Primary and backup saves plus existing diagnostics were copied into a new private, timestamped directory before launching the app. No source build was installed. The installed build does not include the local notice, navigation and Harbor corrections or the optional touch probe.

**23 of 23 deliberate navigation clicks produced the expected visible transition on the first attempt.** These were Mac clicks relayed through iPhone Mirroring, not physical finger taps, rapid tapping, or instrumented latency measurements. The check therefore does not resolve or contradict the user's repeated-tap report. Mirroring navigation outside the game had initially been inconsistent, which is an additional automation confounder.

The actions were: Menu, Army, Upgrade, Rangers, Force, Close, Menu, Harbor, Shipyard, Routes, Fleet, Sea campaign, Prepare fleet, Close, Breakwater Gate, Fleet, Cargo, Close, Settings, Device, Close, Menu, Village. Every action was followed by a fresh visual check. No battle was launched, no unit or ship was trained/upgraded, no purchase was made, and no numeric field or audio setting was changed.

### Confirmed on the installed physical build

- Harbor targets jump horizontally when changing between Fleet and Shipyard/Routes, matching the earlier Simulator reproduction and local correction.
- Army ability/details are clipped into a small internal viewport. Current and next-level troop pictures remain difficult to distinguish at normal scale.
- The Sea campaign's prominent Prepare fleet action opens Harbor instead of mission loading. A mission card is the actual entry into loading. The label and hierarchy make these different tasks difficult to understand.
- Breakwater Gate opens with **64 / 60 cargo space, 2 unassigned**, and a disabled Sail with 30 troops action. The local recommendation has not solved its own capacity constraint.
- Fleet shows only one selected vessel before scrolling. Cargo shows one numeric count before the footer; manual manifest administration remains cramped.
- Settings and Close responded on the first click. The installed Device screen has ordinary local diagnostics, but no optional touch check because it predates that addition.

![Physical iPhone cargo screen](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/10-physical-cargo.png)

![Physical iPhone village](/Users/chrismozer/Desktop/Stonewake-iOS/planning/reassessment16/native-2026-09-20/11-physical-village.png)

Both saved captures were reopened and visually inspected. The app was left at the village.

### Save and diagnostics comparison

A second read-only snapshot confirmed that all 38 buildings, 56 troops, 8 ships, troop levels, 988 gems, wins and both campaign progress values were unchanged. The save revision advanced from 506 to 507. This is structural preservation, not exact resource preservation: launching the existing game automatically settled a queued defense loss, with 100% destruction and 1,636 of each resource stolen. The persisted city history records the matching fourth raid and exact debit. Stored resource values therefore changed from 11,363 to 9,727 each; the live screen then accrued production. The copied save reflects launch settlement and does not include all later displayed accrual. No save was restored or manually edited.

The new diagnostics include six brief frame samples at 59.96–60.12 fps with zero reported slow frames, and no recorded errors. These periodic windows are not a continuous performance capture and do not establish tap latency. There are no input samples in this older build.

### Performance recording limitation

Time Profiler listed the phone but could not attach to the freshly verified Stonewake process, first by PID and then by exact process name. Both attempts stopped before collecting samples. They provide no evidence about main-thread stalls, audio cost or save cost. No performance conclusion is inferred from that failure.

This physical pass verifies specific navigation transitions and strengthens the layout findings. It does not certify physical finger input, audio balance, combat performance, upgrade artwork or release readiness.
