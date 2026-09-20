# Stonewake Build 13 naval ship atlas

- Asset: `Stonewake/Web/art/ships-v13.png`
- Generation mode: built-in image generation, original sprite atlas.
- Raw source: `/Users/chrismozer/.codex/generated_images/01a0bbbf-df91-7343-a1ce-3b5df4bda62b/exec-20b3afd5-852f-44be-9a1f-8bb081840401.png`
- Processing: source copied unchanged into the game project, no pixel postprocessing.
- Native dimensions: 1254 x 1254 pixels, RGBA, alpha range 0 to 255. Fully transparent pixels: 63.0 percent.
- Grid: three equal columns and three equal rows. Each source cell is exactly 418 x 418 pixels, boundaries 0, 418, 836, 1254.
- Seam check: both vertical and both horizontal boundaries have zero alpha > 32 pixels in two-pixel strips.
- Inspection: exactly nine complete ships. Bows face lower left and sterns upper right. Cutters have triangular sails, galleys have clear oar banks and square sails, bombard vessels have broad hulls and one/two/three large copper mortars. Visible structural and silhouette changes at each tier. Material palette is warm timber, brass/copper and deep teal sails with original lighthouse/anchor motifs.
- Padding: all ships are safely within their assigned cells, though the requested 18 percent padding was not perfectly honored. Tightest content margin is 5 pixels at the top of the level-7 bombard cell. No clipping, background, waves, labels or grid lines detected. Use the visible alpha bounds below for optical positioning.

## Row-major mapping and visible alpha bounds

Rows and columns are zero based. Bounds are local left/top/right/bottom at alpha > 32.

| Row | Column | Ship | Level | Bounds |
| --- | --- | --- | --- | --- |
| 0 | 0 | swift coast cutter | 1 | 74, 98, 334, 397 |
| 0 | 1 | swift coast cutter | 4 | 70, 40, 342, 397 |
| 0 | 2 | swift coast cutter | 7 | 58, 30, 374, 404 |
| 1 | 0 | galley warship | 1 | 50, 92, 372, 368 |
| 1 | 1 | galley warship | 4 | 32, 65, 387, 367 |
| 1 | 2 | galley warship | 7 | 27, 27, 392, 370 |
| 2 | 0 | heavy bombard ship | 1 | 76, 53, 344, 369 |
| 2 | 1 | heavy bombard ship | 4 | 56, 40, 360, 373 |
| 2 | 2 | heavy bombard ship | 7 | 29, 5, 401, 379 |

## Final prompt

Use case: stylized-concept.
Asset type: an original transparent 3 x 3 sprite atlas of naval ships for the premium maritime strategy game Stonewake.
Create ONE square PNG, preferably 2048 x 2048, with GENUINE alpha transparency. Exactly NINE individual original ship models on an EXACT 3 COLUMNS by 3 ROWS equal grid. Objects and all sails strictly inside their own cell. Each model is small enough that its complete bounding box occupies at most 64 percent of cell width and 64 percent of cell height, leaving at least 18 percent transparent margins on all sides. Preserve abundant blank space. Do not fill the canvas with oversized ships. Centers at normalized coordinates 16.67%,50%,83.33% in each axis. Entire horizontal and vertical seams at 33.33% and 66.67% must be empty transparent space.
All nine vessels point in the SAME DIRECTION: sharp BOW to LOWER LEFT and raised STERN to UPPER RIGHT. Consistent orthographic isometric view, camera high enough to show deck, visible side of hull, masts and sails without hiding the prow. Upper-left soft warm sunlight, crisp softly beveled forms, subtle ambient occlusion on the ships only.
Visual identity: polished sculpted 3D toy-diorama, boldly readable phone game silhouettes, deep warm timber hulls, teal fabric sails, brass edging, polished copper guns, cream ropes. Original maritime design with restrained carved lighthouse or anchor motifs on sails, no letters or numerals. Strong wood and textile materials; NO stone ships. More premium expressive dimensional models than photopainterly noise. All forms visually coherent with warm limestone and teal-roof architecture, but these vessels are entirely timber, fabric and metal.
ROW 1, left to right: SWIFT COAST CUTTER at three distinct upgrade stages.
Column1 beginner: small agile timber single-mast cutter, one modest triangular teal sail, simple brass prow cap, open rear deck, compact shallow hull.
Column2 veteran: larger cutter with taller graceful mast, two different-sized taut triangular teal sails, brass railings, a small copper swivel cannon, decorative carved prow.
Column3 elite: sleek impressive deep-hull cutter with double-mast split sail silhouette, three crisp teal triangular sails, gold/brass ornamental hull bands, upgraded copper swivel cannons, elegant raised stern platform.
ROW 2, left to right: GALLEY WARSHIP at three distinct upgrade stages.
Column1 beginner: medium long wooden galley, clearly readable paired oar banks, one square teal sail, modest low bow ram, open foredeck.
Column2 veteran: stronger longer war galley, two square teal sails, extended oar banks, reinforced brass bow ram, copper deck cannons, short raised stern gallery.
Column3 elite: large ceremonial battle galley, two tall elaborate rectangular teal sails and a small triangular fore sail, bold brass ram, reinforced layered hull, protected oar galleries and impressive raised stern cabin.
ROW 3, left to right: HEAVY BOMBARD SHIP at three distinct upgrade stages.
Column1 beginner: broad squat heavy timber bombard vessel, single stout mast with one small square teal sail, huge single copper mortar in open forward deck.
Column2 veteran: broader reinforced vessel, two stout masts with two compact teal sails, twin massive copper mortars, brass armor bands, raised enclosed stern cabin.
Column3 elite: unmistakably massive fortresslike timber-and-brass bombard flagship, three compact masts/sails stepping upward toward stern, three heavy copper bombards, layered reinforced wooden hull, ornate brass stern galleries and a prominent curved prow.
Three rows visually different: cutter sleek with triangular sails, galley long with oars and square sails, bombard broad with huge copper mortars. Within each row upgrades progressively richer and increasingly impressive in actual design, not merely scaled copies.
Constraints: no water, sea, wake, foam, smoke, islands, ground, pedestals, surface shadow, scene, background, UI, text, labels, borders, visible grid lines, checkerboard or watermark. All sails, oars and rigging must fit inside each own cell with generous transparent gap. Genuine transparent alpha, crisp antialiased edges, no white halo. Nine vessels exactly.

