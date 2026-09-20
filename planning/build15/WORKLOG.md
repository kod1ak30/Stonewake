# Build 15 production-readiness work

User scope: substantial visual repair and improvement, landscape-only iPhone play, core usability, a guided first chapter, sustainable code/build foundations and honest release gates. Preserve the existing village and all earned or purchased progress. No expansion beyond medieval level 10. No repeated 1000-gem test grant.

Baseline: verified Build 14 source backup at `~/Library/Developer/Stonewake-backups/build14-before-production15-20260919-205440`. Dedicated repository baseline commit `e895933` was made from this backup. Private saves remain under `~/Library/Developer/Stonewake-review`, outside the source tree.

## Implementation

- Maintained ES modules compile into the app, a dedicated battle worker and matching server rules. Historical replay results are compared exactly; normal builds no longer splice a frozen bundle.
- Landscape-only native container, full-screen world, safe-area HUD, branded loading/recovery, opt-in local completion notifications and bounded private diagnostics.
- Painted citizens restored with role-specific looping work, consistent feet/route movement and bounded masked-sprite caches. Home commander scale corrected.
- Painted troop animation with visible rank fittings and distinct cloth treatments. Ten separate fully authored animated models are not claimed.
- Original cog and trebuchet-barge art with three major hull stages, motion-aligned wakes and completed sinking.
- Material-aware building collapse, footprint-aware ruins, proportional damage and naval impacts. Effects have explicit budgets and reduced-motion alternatives.
- Landscape menu geometry, stable Army action/footer layout, compact side-by-side building progression and separate actionable requirements.
- New-player guide follows actual game state, can be collapsed/skipped/reopened and stays out of established saves by default. Local diagnostics measure blocked actions, guide progress and frame samples without uploading data.

## Visual QA and regression work

- Initial 932×430 check exposed the old Army content pushing essential controls below the fold. Rebuilt the Army content and footer rather than accepting the first pass.
- Initial 844×390 building check exposed primary village buttons overlapping the selected-building footer. Fixed visibility and applied consistent footer styling.
- Checked the fresh-player welcome, Keep inspection, Quarry placement/confirmation and construction state through actual browser controls on a disposable new save.
- Broader gameplay, native geometry, final performance observations and device preservation results are appended as completed.

## Release claim

This is a development/release-candidate improvement, not proof of commercial launch readiness. The release checker intentionally blocks when production service configuration, Apple products/distribution, rights, physical quality or external playtest evidence is missing. No public deployment, real-money purchase activation or App Store submission has been performed.

## Final playtest and package evidence

- Fresh disposable first chapter reached a land victory through card drags and a map deployment swipe. Storehouse construction then increased capacity from 750 to 1,550 and completed the guide.
- Saltwind Cove sea playtest won at 50% destruction in 71 seconds. Three troops landed and returned; the ship took damage and returned safely. A subsequent replay verified visible Fleet orders and a responding Rapid Volley action, then retreated with three troops rescued aboard.
- Actual small-screen review exposed misleading readiness below the three-troop minimum, clipped Fleet orders, an oversized Harbor header and Army content crowding. These were corrected and visually rechecked. Final Army comparison at 844×390 shows all six family choices plus the fixed action footer. Harbor actions fit at 932×430. Secondary detail content intentionally scrolls within its panel.
- The native Simulator displayed both landscape orientations, respected the display cutout, and showed Device settings without automatically prompting for notifications. Final native package opens the village correctly. Browser console checks returned no warnings/errors in both disposable sessions.
- Final source compilation passed 38 frontend tests, 21 module checks, TypeScript and lint. Earlier integrated unchanged-rules checks passed 280 rules, 27 gestures, 179 premium assertions, 12 backend tests and 31 compiled native checks.
- Final signed iPhone Debug and Simulator builds succeeded. Packaged HTML, app, dedicated worker, stylesheet and original art match source-output hashes. Installed iPhone reports bundle version 15, and final installation preserved the save byte for byte before launch.
- Browser screenshots are development views. The native village screenshot is Simulator evidence, not a physical-phone screenshot. Physical speaker quality, notification delivery, touch feel and sustained thermal/performance behavior remain unverified.

- Physical launch: initial remote launch timed out; the retry returned an explicit iOS device-lock refusal. Installation and save preservation are verified separately. User was asked to unlock for the remaining launch check.

- Unlock follow-up: final phone launch succeeded. Fresh game_ready and engine_worker events confirm startup. Protected buildings, army, terrain, campaigns, research, unit levels, gems, grants, cosmetics, commanders, provinces and saved forces matched the pre-update save. A pending ship finished building and one overdue raid resolved, losing 1,636 of each resource under existing rules; normal income/time updates also occurred. No save edits or additional grants were applied.
