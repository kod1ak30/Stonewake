# Build 17 troop and ship artwork

## Accepted Vanguard pilot

The Vanguard now has four separately authored equipment ranks at levels 1, 4, 7 and 10. All four have the same eight frame slots: four walking frames and four attack frames. The first rank uses a round wooden shield; later ranks gain a kite shield, heavier armour, an attached helmet crest and an embroidered cloak. These are parts of the painted frames, not vector pieces placed over a moving soldier.

Production asset: `Stonewake/Web/art/build17/vanguard-ranks.png`, 2048 × 1024 RGBA, 8 columns × 4 rows, 1,423,995 bytes. Loader key: `vanguard17`. Frame selection and foot anchors live in `client/build17/unit-art.js`. World rendering and menu previews share `SWDrawPaintedTroop15`.

The legacy `SWUnitPortrait` also delegates to `lu` and `SWUnitPreview14`, removing its independent, outdated atlas loader. The shared preview waits for the asset loader, keeps the selected level, and cancels drawing when unmounted. Focused tests cover that entire component handoff.

Every frame uses one shared pixel scale and a per-pose foot anchor. Sword extension therefore does not move the character's grounded position or shrink its body. The existing simulation attack phase controls ready, wind-up, strike and recovery; no combat outcome or attack timing changed. All ranks retain one human-body reference height. Taller crests and equipment increase the silhouette naturally.

## Provenance and processing

Created with the built-in image-generation tool, guided by the sprite-pipeline skill. References were the first-row infantry in `Stonewake/Web/art/units-v13.png` and `Stonewake/Web/art/unit-actions-v13.png`, plus `Stonewake/Web/art/build17/keep-levels.png` for the original coastal palette. The existing unit sheets supplied identity and camera; the Keep supplied blue-teal cloth and warm brass direction only.

Initial generated file, rejected because some adjacent swords touched:

`/Users/chrismozer/.codex/generated_images/01a0bfb0-e575-76c3-8bf9-d20867fbbe29/exec-2fcb6dd4-6885-449c-aac6-b649c0c7d8c2.png`

Accepted source after a spacing-only regeneration:

`/Users/chrismozer/.codex/generated_images/01a0bfb0-e575-76c3-8bf9-d20867fbbe29/exec-632c1f6b-fe4f-4835-99bc-e7a36917f9d1.png`

The source contains 32 isolated alpha components. Processing cropped each component, used the sprite-pipeline normalizer with one common scale, aligned feet to the bottom of each 256 px frame, and packed the result into the production atlas. No code painted costume parts, invented poses, or synthesized replacement pixels. The private processing script and measured anchors are in `/Users/chrismozer/Library/Developer/Stonewake-review/build17-unit-art/normalize.py` and `vanguard-metadata.json`.

Initial prompt:

> Create ONE production sprite atlas for the original coastal medieval strategy game Stonewake. This is an animation asset, not a poster. Use the FIRST ROW soldier in reference images 1 and 2 as the character identity, proportions and 3/4 camera reference. Reference 3 only supplies the original blue-teal cloth, warm brass, ivory stone kingdom art direction. Do not include buildings or other characters from references. The subject is the same adult male Vanguard soldier at four equipment ranks, rendered as a cohesive premium hand-painted stylized 3D game sprite with dimensional textured materials and soft highlights. Keep his recognizable brown beard, adult face, stout heroic proportions, sword in right hand and shield in left. Entire body visible, same view facing screen-right in every cell. Exactly 32 individual separated sprites in a rigid grid: 8 equal-width columns and 4 equal-height rows. Transparent background with real alpha, no checkerboard paint, no shadows beyond a tiny optional contact shadow, no text, no labels, no grid lines, no scenery. Prefer a wide high-resolution 3072x1536 canvas; keep generous transparent gutters between every sprite and all limbs and blades inside their own cell. All rows have exactly the SAME 8 poses, camera, human body size and foot baseline, with equipment changed only by row. Columns 1-4 are four clearly distinct walking-cycle frames: left foot forward, passing pose, right foot forward, passing pose; sword carried low and shield beside body. Columns 5-8 are four clearly distinct sword attack frames: ready, sword raised above shoulder wind-up, strong forward sword strike with extended arm, recovery to guard. Weapon trajectory must read at small mobile size; hands hold the weapons naturally throughout. Row 1 = Level 1 coastal recruit: brown leather jerkin, short teal scarf, simple open bronze cap, small round wooden shield with a modest brass boss, short iron sword. Row 2 = Level 4 trained Vanguard: real steel breastplate and shoulder armor over blue-teal tunic, enclosed cheek-guard helmet but readable face, visibly larger brass-rimmed kite shield bearing an original lighthouse motif, longer steel sword, reinforced boots. Row 3 = Level 7 veteran: heavier layered plate armor, broad shoulder guards, proper teal cloth cloak hanging from his shoulders, tall tower-style kite shield with lighthouse emblem, reinforced sword and greaves, short attached helmet plume. Row 4 = Level 10 royal Vanguard: master-crafted steel and warm brass plate armor, dimensional sculpted shoulders, rich deep teal cloak with woven gold border, ornate broad kite shield with the same lighthouse crest, noble tall helmet crest ATTACHED to helmet, substantial bright steel sword. This rank is richly authored, not gold paint over the earlier sprite. Every piece of equipment must follow the exact walking and attack pose. No floating accessories, no sticker-like armor, no mannequin replacements, no detached weapons, no face covering. Four ranks must have obvious silhouette differences from armor, shield, cloak and helmet construction while still being the SAME man and the SAME eight body poses. Rank 1 human body height must remain the same as rank 10; only actual added equipment can extend its silhouette. Fit all 32 sprites cleanly into exactly 4 rows and 8 columns.

Spacing correction prompt:

> Production spritesheet cleanup edit of the attached Stonewake Vanguard atlas. Keep the SAME exact 32 painted characters, same faces, same four costume ranks, same camera, same 8 poses per row, same colors and materials. Change ONLY layout and spacing. The current sword strike sprites in column 7 touch column 8, and sprites touch adjacent rows; this makes the atlas unusable. Return EXACTLY 8 columns x 4 rows on a genuine fully transparent canvas. Every sprite must be wholly isolated inside its own equal-sized cell. Reduce ALL characters uniformly to 70% of their current size relative to the cell, preserving all proportions, to create large transparent gutters on all sides. Set every sprite's feet on one consistent baseline within its cell, including the sword-raised and sword-thrust frames; do NOT scale individual frames differently. Center each character body in the cell with extra room to screen-right for the full extended sword. No sprite or weapon may touch any adjacent cell. Keep row 1 recruit, row 2 steel kite-shield soldier, row 3 caped veteran with plume, row 4 ornate royal Vanguard with gold-bordered cloak. Do not add or remove or repaint costume items. No labels, no captions, no background, no shadows, no grid lines. There must be clear empty transparent horizontal and vertical gutters between all 32 sprites. The output should remain a wide 2:1 atlas, preferably 3072 x 1536 if available.

## Accepted ship damage

`SWShipDamageArt17` derives bounded damage tiles from the existing ship artwork. Sail tears remove actual cloth alpha; heavier damage darkens sails and chars or splits the painted hull. The new asset is also the input to sail-customization masking, preserving the torn edges when a custom sail is selected. Healthy ship portraits use the original art. Damage bands cache a maximum of 36 tiles with a maximum extent of 256 px, approximately 9 MiB of uncompressed pixel storage at the upper bound. Ship movement, sinking, heading and fit-to-height behavior remain intact.

## Visual verification and limits

The private proof uses the exact production renderer and asset selectors, not a separate illustrative drawing. Reviewed outputs:

- `/Users/chrismozer/Library/Developer/Stonewake-review/build17-unit-art/progression.png`
- `/Users/chrismozer/Library/Developer/Stonewake-review/build17-unit-art/combat-damage.png`

The initial procedural equipment proposal was rejected after this proof showed flat plates and floating parts. Existing legacy `SWTroopTier` overlays were also removed at their source because they drifted away from bodies during attacks, especially on mounted troops. Other troop families retain their existing authored sprites and subtle material treatment.

This is four Vanguard rank appearances, not ten separately authored levels. Intermediate upgrades still need the game's strength and ability progression to communicate their benefit. The walking frames show only modest stride variation; this is not a complete locomotion overhaul. Other troop families still need equivalent authored upgrade sheets. Ships retain three existing artwork tiers; the accepted new work is damage presentation, not newly authored per-level hulls. This proof establishes canvas output and focused contracts, not physical-device frame rate or final app acceptance.

Focused tests cover rank/frame selection, phase boundaries, stable ground anchors, unchanged body scale, transparent atlas dimensions, fallback behavior, bounded wound caches, unique sail-mask keys, ship heading and full-mast preview sizing.
