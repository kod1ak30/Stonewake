# Stonewake Build 13 portrait atlas

Generated with the built-in imagegen tool on 2026-09-19. This is a new original atlas. Photo 8 was used only as a clarity and polished rendering reference, not as a character or likeness reference.

## Selected raw asset

- Project path: `Stonewake/Web/art/portraits-v13.png`
- Original generated file: `/Users/chrismozer/.codex/generated_images/01a0b852-4f50-75b2-99d8-563c4e224897/exec-00a55917-10cf-4ba9-9821-29d13a4fd761.png`
- Actual dimensions: **1774 × 887 pixels**, RGBA PNG.
- Intended packed dimensions: 2048 × 1024 with four 512 × 1024 cells. The built-in tool returned a smaller 2:1 image despite the exact-size request. No resizing, compositing, or alpha cleanup was performed on the raw image.
- Alpha extrema: 0 to 255. Exactly transparent pixels: 58.7873%.
- Transparent background exists. A few stray near-transparent pixels with alpha 1–16 remain outside the visible cutouts. The visible silhouettes are complete and do not overlap neighboring cells. The requested uniform 40-pixel margins are not present in the raw output, so use the packing step to normalize each character with clear margins.

## Cell mapping and inspected visible bounds

Cell coordinates are half-open pixel ranges. Visible bounds below use alpha >16; this avoids counting nearly invisible generated speckles. Raw cells are divided at the nearest quarter boundaries.

| Cell | Character | Raw cell rectangle | Visible alpha bounds within cell |
| --- | --- | --- | --- |
| 0 | Mara Ironward | 0, 0, 444, 887 | 50, 179, 439, 756 |
| 1 | Bram Flint | 444, 0, 887, 887 | 59, 178, 431, 755 |
| 2 | Elowen Vale | 887, 0, 1330, 887 | 39, 153, 386, 759 |
| 3 | Admiral Voss | 1330, 0, 1774, 887 | 25, 170, 412, 749 |

All four identities and their required accessories were visually inspected: Mara has dark braids, bronze/teal armor and round shield; Bram has red beard, forehead goggles, teal scarf, apron and brass hammer; Elowen has a black curly ponytail, forest scouting cloak and longbow; Voss has short white hair, a grey beard, dark naval coat, burgundy collar and compass. No text, logos, UI panels or scenery are present.

## Initial prompt

Use case: stylized-concept.
Asset type: production character portrait atlas for the original maritime fantasy game Stonewake.
Create ONE high-quality RGBA PNG image, exactly 2048 pixels wide by 1024 pixels high. Fully transparent alpha background, no background scenery or fake checkerboard.
The image is a precisely aligned 4-column atlas: four equal cells of 512 by 1024 pixels in a single row, no visible borders or grid. The four vertical cell bounds are x=0–511, 512–1023, 1024–1535, and 1536–2047. Each portrait and every accessory must remain inside its own cell, with at least 40 pixels of completely transparent margin on all sides of that cell. Center each waist-up character within the cell, consistent head scale and eyeline. Leave all space outside the clean character silhouette fully transparent. No character overlaps another cell. No floor shadows or plinths.

Input reference: Photo 8 is only a reference for clarity, readable silhouette and polished three-dimensional render quality. Do not copy its character, likeness, costume, composition, logo or UI.
Style: original sculpted 3D maritime fantasy characters, expressive faces, sturdy proportions, polished animated-film materials, readable small-scale silhouettes. Warm soft key light from upper left, subtle cool fill, richly colored but restrained materials. Matte painted leather, burnished metal, softly textured cloth, believable hair clumps. Strong character differentiation, polished faces and hands. Waist-up front three-quarter portraits that feel alive and inviting.

Exactly four characters, left to right:
1. MARA IRONWARD: woman about 40, dark braided hair, confident experienced captain, bronze and teal plate armor, carrying a compact round shield close beside her body. Strong, warm, determined face.
2. BRAM FLINT: man about 50, wiry red beard, brass engineering hammer held upright close to torso, leather apron over practical clothing, teal scarf, goggles resting on forehead, warm grin. Clever artisan with expressive features.
3. ELOWEN VALE: woman about 30, olive complexion, black curly ponytail, teal and forest-green scouting cloak, a longbow held close beside her and contained fully within her cell, alert smile. Agile but sturdy scout.
4. ADMIRAL VOSS: man about 50, short white hair, neatly trimmed dark grey beard, charcoal naval coat, burgundy collar, brass compass held near chest, calculating expression. Dignified, formidable maritime antagonist.

No written names, lettering, text, numerals, logos, watermarks, UI panels, borders, background colors, landscape, backdrop gradients or drawn transparency pattern. Preserve true transparent alpha with crisp anti-aliased silhouette edges. Deliver a single complete atlas.

## Targeted layout revision prompt

The first attempt was rejected because the portraits touched cell edges and the image bottom. It remains only at the generation output path `exec-8804a11c-66fe-4ea6-81f8-50d0f11e0397.png` in the same generated-images directory.

Revise this original Stonewake portrait atlas for production sprite slicing. Keep the four characters, costumes, materials, lighting and left-to-right order. The previous image is NOT acceptable for slicing because each figure is clipped by its cell boundaries.

CRITICAL LAYOUT CORRECTION:
Output one 2048x1024 RGBA PNG, 2:1 wide. It has four equal 512x1024 cells. Do NOT draw cell borders.
Each entire waist-up portrait must fit in a smaller, separate silhouette inside its own cell. Shrink every character to only 78% of its current relative cell size, then center it horizontally AND vertically within its cell. Maintain at least 50px fully transparent clearance left and right and at least 80px clearance above AND below each character. No arm, shield, bow, hammer, coat, hair or hand may touch any cell boundary or image boundary. The waist-up portrait ends naturally below its waist and is fully contained, with TRANSPARENT SPACE UNDER THE WAIST. Do not extend any bodies off the bottom. All four portraits must be separate cutouts with visible transparent gaps between them. Total character content should be narrower and shorter than the current image.

CHARACTER CLARITY:
Keep original designs. Mara, first left, is 40 with a more mature broad square face, subtle smile lines and a confident captain's expression, dark braided hair, bronze/teal armor and round shield. Bram second is 50, mature wiry red beard, warm grin, leather apron, teal scarf, forehead goggles, brass hammer. Elowen third is 30 with olive complexion, a distinct narrower expressive face, black curly ponytail, teal/forest scouting cloak and longbow entirely within her portrait cell. Admiral Voss fourth is 50, short white hair, neatly trimmed dark-grey beard, charcoal coat with burgundy collar, brass compass, calculating expression.

Preserve polished sculpted 3D animated-film rendering, sturdy appealing proportions, readable strong silhouettes, warm upper-left key light.
Maintain true fully transparent alpha outside the four cutouts. No backdrop, floor, colored rectangles, checkerboard, grid, letters, text, names, logos or watermarks. Exact order Mara, Bram, Elowen, Voss.
Make the requested correction to generous all-around transparent margins unmistakable.

