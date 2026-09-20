# Build 18 delivery

Build 18 is a focused input-reliability repair following the user's physical touch check. It does not establish production readiness for the broader game overhaul.

## Acceptance evidence

| Check | Result |
| --- | --- |
| Frontend regression suite | 189 passed |
| Native Swift checks | 36 passed |
| Type, lint and module checks | Passed |
| Simulator and device compilation | Passed |
| Signed bundle identity | com.chrismozer.stonewake, version 1.0, build 18 |
| Strict signature verification | Passed |
| Bundled Web source parity | 103 of 103 files match |
| Simulator native touch path | 9 releases, 9 direct activations, 0 missing matches |
| Physical phone installation | Confirmed build 18 |
| Village preservation | Exact byte match before and immediately after installation |
| Physical phone launch | Blocked by Apple's device lock |
| Real-finger acceptance | Pending user's new touch check |

The final sorted Web manifest SHA256 is `b1c8434f8b6e7fdad06331566b2c6df839c6b7e050af41ec2c7f4ea5787a0894`.

Raw phone and Simulator diagnostics, install receipt, installed-app response and save backups remain outside the repository under the private local review directory. The repository baseline contains only the relevant aggregate measurements.

## Next acceptance step

On the phone, open Settings, Device, Start touch check. Use the menus with a finger for about one minute, including tabs, close buttons and quantity controls. Stop touch check. Review the new diagnostic samples alongside the user's experience; do not treat a low missing-click count as sufficient if taps feel unreliable, commands run twice or scrolling is impaired.

The previous touch diagnostic could establish exact-control click mismatch but not its unique browser cause. The enhanced metrics and direct touch path are intended to make both behavior and any remaining failures observable.
