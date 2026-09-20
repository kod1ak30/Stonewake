# Stonewake Build 13

An original coastal redesign inspired by the readability, illustration quality and clear actions in the supplied game references. Stonewake keeps its own characters, teal roofs, limestone architecture, brass accents and dark menus.

## Changes

- New coastal terrain with a fixed shoreline aligned to the shipyard and battle waters.
- Sculpted building artwork for the keep, homes, barracks, stores and sixteen utility types. The four core types have three architectural stages and separate rear views.
- Four original character portraits, new infantry, archer, medic and worker frames, and matching attack poses for the three combat units.
- Nine ship images covering three ship classes and three visual stages, shared by fleet menus, harbor boats and battle ships.
- Illustrated kingdom navigation, adventure scenes, collection cards and a compass reward medallion.
- A consistent dark teal and brass interface, stronger type hierarchy, fitted card art and compact landscape layouts.
- Existing touch deployment remains persistent. Pinch camera controls, building rotation, progression, storage, customization and battle rules are preserved.

## Playtest gift

The requested 1,000 gems were added only to the backed-up local kingdom on the paired iPhone. `scripts/grant-playtest-gems13.cjs` preserves all other save contents and records a one-time grant marker. It is a deployment tool, not a universal in-game reward or an online purchase grant.

## Verification

- 179 premium gameplay assertions passed.
- Combat regression checks passed, including the historical replay hash, coordinated medics, naval eligibility and once-only damage.
- All 77 measured building, ship and unit sprite regions are nonempty and remain within their source images.
- Local gift checks cover exact amount, input preservation, idempotency, save migration and invalid inputs.
- Browser checks cover six phone viewport sizes, dark backgrounds, panel bounds and reachable close buttons. Manual checks cover menu, store, chapter, resident choices, construction, scouting, deployment and both battle outcomes.
- Simulator and physical device builds compiled successfully. Packaged web files are compared with the working source before installation.

See [design QA](design-qa.md) and [asset manifest](client/build13-assets.md).

## Scope and remaining limits

This remains a 2D canvas game with generated sprite animation, not a fully rigged 3D game. Specialist troops and some existing civic props retain their prior artwork. The four-frame walking sequences are not a motion-captured or anatomically verified walk cycle. The existing App Store collections and online service still require production configuration; this build does not activate real-money purchases. Progression beyond level 10 remains unbuilt.

## Device delivery

Build 13 is installed on the paired iPhone 15 Pro Max. The local balance increased from 86 to 1,086. A read-back of the phone save confirmed exactly +1,000 gems, one revision increment and the grant marker; every other field matched the pre-gift backup. All 92 web files in both native packages matched source after the final build. The last rebuild used a byte-identical local copy under `~/Library/Developer/Stonewake-build13-source` to avoid a macOS file-coordination stall on the Desktop. The Desktop project remains authoritative.

The app launched successfully on the physical iPhone. A post-launch read-back confirmed the grant persisted at 1,086 gems, with Keep 7, thirty-eight placed structures and four ships.
