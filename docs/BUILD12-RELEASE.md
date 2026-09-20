# Stonewake Build 12

September 19, 2026. The playable cap remains level 10. This release extends the existing kingdom; it does not require a reset. The source was backed up before development in `/Users/chrismozer/Library/Developer/Stonewake-backups/build-11-before-premium-20260919-141850`.

## New play

The Broken Beacon is a finite six-mission coastal chapter. Survey the silent beacon, connect a working road to the harbor, rescue an engineer, escort a repair vessel through an enemy battery, defend the home harbor, then destroy the blockade flagship and its signal keep. The escort can actually be destroyed. Land troops must silence its battery before it can sail safely. The story involves Mara Ironward, Bram Flint, Elowen Vale and an opposing blockade captain.

Three mastery trials reuse supplied forces so player upgrades cannot buy a better medal: rescue within 32 seconds, escort with at least 60% hull remaining, and finish the blockade within 45 seconds with at least half the deployed expedition surviving. Replays and retries do not spend home troops or ships, and first-clear rewards cannot be farmed.

Six authored resident stories have alternative resource costs, visible work timers and finite outcomes. Three event tracks cover the harbor festival, siege trials and beacon restoration. Their featured order changes weekly, but unfinished rewards do not expire. At Keep 10, completing the existing campaign and the chapter unlocks a separate medieval conclusion; optional district, resident and trial mastery remains visible. Later ages are only a story teaser.

## Ownership and customization

Store & Wardrobe provides 22 pieces across six categories. Preview kingdom roof/cloth palettes, banners, ship sails, road surfaces and commander details on painted assets. Place and rotate lanterns, standards, planters and the earned monument; removing a decoration preserves ownership. Buildings and terrain edits cannot overwrite ornaments. Three permanent cosmetic collections are defined for the future live store.

Gem prices are checked again when buying. Local purchases spend only locally earned gems. Paid collection grants, restores and refunds use the authoritative service and verified Apple transactions. Ownership keeps separate sources so refunding a collection cannot revoke the same piece independently earned or purchased with gems. Equipped revoked pieces fall back safely. No paid cosmetic changes battle stats.

Real-money sales are not live. App Store products, Apple provisioning and the deployed service remain configuration gates. Tests use explicit Apple/native fixtures where those services are unavailable; they are not successful Apple-signed purchases. See [store and audio contract](STORE-AUDIO12.md).

## Presentation

The chapter restores a three-stage painted lighthouse and brings trade and festival details home. Real palette changes preserve the painted texture of roofs and sails. Battle effects follow stable contact events with projectile timing, impact reactions, dust and irregular structural debris. Native music now changes between city, scout, battle and victory. A restrained percussion layer builds during combat. Haptics and reduced effects have independent controls, and dense impacts are rate limited.

The source-model proof includes editable soldier, building and ship geometry, directional animation exports and upgrade tiers. This is a reproducible pipeline prototype, not a completed replacement for the entire painted unit roster. Painted sprites still have short-loop and direction fallbacks. Full cast voice acting, all-unit authored animation and a physical 15-minute performance/playability session remain production work. Optional system narration is not actor performance.

## Validation and boundaries

The rules suite verifies 179 cases including save migration, prices, refunds, independent ownership, placement, actual road connectivity, mission objectives, deterministic battle results, successful and failed approaches, once-only rewards, storage limits and the Keep-10 ending. Real deployment timing changes escort survival from a badly damaged vessel to a healthy arrival. All three mastery conditions are attainable in deterministic supplied-army runs.

UI checks cover six sizes, portrait and landscape, purchase cancel/confirm, appearance changes, closing and reopening overlays, stories, event claims and saved decoration placement. Separate actual UI tests deploy and finish saga battles, retry losses and replay without duplicating rewards. The backend suite uses the actual local D1/workerd service and passes its 11 tests, including old combat replay hashes. Historical combat and civic/raid checks continue to pass.

Renderer checks cover previews, road/palette/sail changes, lighthouse stages, live moving escort/engineer objectives and a crowded battle. Desktop browser frame timing is not physical iPhone performance evidence. Audio clipping/loudness analysis is not subjective speaker verification.

Both final native builds succeeded: signed iPhone and simulator, build 12, bundle `com.chrismozer.stonewake`. All 77 bundled web resources match the current source byte-for-byte and both code signatures verify. The simulator update preserved its existing kingdom file byte-for-byte before launch. After launch, buildings, ships, army, troop levels, commanders, land and provinces remained unchanged. One legitimately overdue computer raid settled, adding its defense report and two gems, with ordinary loot/income changes; the new default wardrobe was added.

Native simulator inspection verified Store & Wardrobe in both orientations, painted Ember Coast preview without spending, portrait character dialogue, Listen/Stop controls, landscape Adventures and reliable close back to the capital. Screenshots and package/save reports are saved with the review artifacts. The existing Keep-7 kingdom was retained. The physical phone save was never read or modified during this release. The user's physical iPhone is unavailable, so this release has not been installed there. No production backend deployment or real purchase occurred.

Review artifacts: `/Users/chrismozer/Library/Developer/Stonewake-review/build12`.

## Physical installation, September 19

At the user's request, build 12 was installed on the paired physical iPhone 15 Pro Max and successfully launched. The installed app listing confirms bundle version 12. A fresh pre-install kingdom backup was made and the post-install save was byte-for-byte identical before launch. Evidence is in `physical-installed.json`, `physical-launch.json` and `physical-save-check.json` under the Build 12 review directory. Live store activation and subjective audio/performance testing remain outstanding.
