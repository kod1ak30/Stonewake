# Build 18 touch reliability

The user ran the optional touch check on the physical iPhone after Build 17. Its three samples cover 87.61 seconds: 135 button press starts, 110 stationary releases, 44 matching clicks, 63 releases without a matching click within 550 ms, 3 detached controls, 25 moved gestures, no pointer cancellations and 69 repeated presses while a prior release awaited a click. Input dispatch p95 was 27 ms in each sample. Maximum timer lag was 3, 292 and 58 ms.

This is a serious touch-to-action mismatch. The earlier successful computer-control clicks did not establish physical-finger usability. The old probe matched clicks to the exact enabled down-control identity; it did not record release hit targets, disabled state at release, unmatched clicks or default prevention. Therefore these samples alone cannot prove that WebKit emitted no click event, or identify hover as the root cause. Sustained main-thread starvation is not the dominant measured pattern.

Apple documents that hover-induced content changes can suppress a synthesized click, but the source audit has not found a live hover-reveal rule that establishes this cause. Existing touch-action:manipulation already requests fast tapping. Reference: https://developer.apple.com/videos/play/wwdc2019/203/ and https://webkit.org/blog/5610/more-responsive-tapping-on-ios/.

The repair targets the input contract: intentional touch release on the same enabled action button should run its existing command once, without depending on delayed mouse-click synthesis. It must not activate after a scroll, drag, pinch, cancel, removed or disabled control, or release outside the original button. Mouse and keyboard activation remain supported. Battle gestures and native form controls retain their own behavior.

## Implemented repair

Native-host action buttons now use an explicit touch lifecycle. A stationary, single-finger release must hit the original connected and enabled button before its existing command runs. Scrolling, dragging away and back, pinching, cancellation, focus loss, long holds, disabled controls and removed controls reject activation. A matching delayed compatibility click is suppressed so the same gesture cannot spend twice or activate a newly exposed confirmation. Battle deployment controls, map gestures, native form controls, keyboard and mouse retain their respective handling.

Touch feedback no longer translates or scales the button under a finger. The optional diagnostic now distinguishes direct touch activations, rejected gestures, release hit mismatches, disabled controls, prevented releases and unmatched browser clicks. It still records numeric aggregates only. The touch-check controls are now at the top of Device settings.

## Verification, 20 September 2026

- Frontend: 189 tests passed. Native Swift: 36 checks passed. Build, module, type and lint checks passed.
- Signed Build 18 compiled for Simulator and physical iPhone. All 103 bundled Web files exactly match the final source bundle. Strict signature verification passed for the existing app identity and signing team.
- Simulator UI exercise: nine recorded stationary button releases produced nine direct touch activations, zero missing matches, zero repeat presses, zero release hit mismatches and zero rejected gestures. The observed menu, army quantity, upgrade tab, draft-discard and settings transitions each responded to one action. The plus control changed 5 to 6, and the minus control changed 6 to 5. This proves the native touch adapter was exercised, rather than only the browser mouse path. It does not prove physical-finger reliability or gesture scrolling on the phone.
- Build 18 installed on the physical iPhone and the installed version was independently queried as 18. The village save copied immediately after installation is byte-identical to the pre-install backup.
- Apple rejected the launch request because the iPhone was locked. A fresh physical-finger check has been requested. No post-repair phone result is available yet.

Status: implemented and installed, awaiting real-finger acceptance. Do not claim the measured physical failure is resolved until the new phone check is reviewed. Baseline and Simulator measurements are different input sources and are not a controlled before/after comparison.
