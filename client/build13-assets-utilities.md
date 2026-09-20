# Stonewake Build 13 utility and defense atlas

- Asset: `Stonewake/Web/art/sculpted-utilities-v13.png`
- Generation: built-in image generation, new original atlas followed by a targeted spacing edit.
- Final raw source: `/Users/chrismozer/.codex/generated_images/01a0bbbf-df91-7343-a1ce-3b5df4bda62b/exec-70af5de3-b3e9-4173-958b-0c3061d316f8.png`
- Processing: unchanged PNG copied into project; no pixel postprocessing.
- Native size: 1254 x 1254. RGBA with alpha extrema 0 to 255; 71.1 percent fully transparent pixels.
- Grid: four equal columns and four equal rows. Normalized boundaries 0, 0.25, 0.5, 0.75, 1. Pixel boundaries rounded to 0, 314, 627, 940, 1254. Use fractional source rectangles or these adjacent rounded boundaries.
- Verification: all three vertical and three horizontal cell seams have zero occupied pixels at alpha > 32 in two-pixel-wide seam strips. Every cell contains exactly its intended subject with no crop. Requested 15 percent margins were not perfectly uniform: the narrowest detected margin is 15 pixels around the bottom-right statue, still fully contained within its cell. Other padding varies; use content bounds below if a consistent optical scale is desired.
- Visual inspection: readable sculpted teal roofs, warm limestone, copper/brass hardware, amber-lit windows. No backdrop, grid, text, ground terrain or foreign game branding. Farm has an integral wheat bed, shipyard an integral timber pier and statue an integral pedestal as specified.

## Cell mapping and local visible bounds

Bounds are alpha > 32, in local cell pixels, left/top/right/bottom.

| Row | Column | Kind | Bounds |
| --- | --- | --- | --- |
| 0 | 0 | wheat farm and barn | 74, 86, 276, 285 |
| 0 | 1 | lumber mill | 74, 92, 275, 279 |
| 0 | 2 | quarry and crane | 47, 89, 245, 285 |
| 0 | 3 | blacksmith forge | 60, 82, 241, 285 |
| 1 | 0 | market pavilion | 71, 69, 285, 275 |
| 1 | 1 | shipyard and pier | 64, 79, 275, 283 |
| 1 | 2 | builder cottage | 59, 80, 241, 279 |
| 1 | 3 | mechanical workshop | 59, 86, 248, 289 |
| 2 | 0 | seaside tavern | 55, 47, 275, 262 |
| 2 | 1 | stone well | 80, 53, 240, 258 |
| 2 | 2 | watchtower | 104, 35, 236, 259 |
| 2 | 3 | mortar | 72, 87, 262, 258 |
| 3 | 0 | barrel bomb tower | 75, 22, 265, 242 |
| 3 | 1 | copper flame defense | 85, 42, 254, 233 |
| 3 | 2 | reinforced bastion | 43, 19, 273, 238 |
| 3 | 3 | heroic brass statue | 88, 15, 238, 250 |

## Initial generation prompt

Use case: stylized-concept.
Asset type: finished transparent game sprite atlas for Stonewake, an original premium maritime medieval mobile settlement game.
Create ONE square 2048 x 2048 PNG with a genuinely transparent alpha background. Exactly sixteen different standalone buildings, arranged as an exact 4 COLUMNS x 4 ROWS uniform grid. No lines or labels marking the grid. Every building fully fits inside its own equal square cell with generous 15 percent transparent margin on all four sides. Consistent moderate scale within cells. No overlap, no cropped eaves, no contact between neighboring cells. No drop shadow extending outside its cell.
Style: polished chunky sculpted 3D toy-diorama game models, readable at phone size. Warm pale limestone block walls, deep teal roofs, brass and copper fittings, warm amber glowing windows and forge details. Beveled edges, solid appealing volumes and distinctive silhouettes. Medium detail, clean material shading, physically coherent soft sunlight from upper left, soft ambient occlusion. Consistent orthographic isometric camera showing front and right side, front entrances face lower left. Completely original maritime architectural language: sea-green tall asymmetric roofs, carved stone, copper fins and brass lanterns. No recognizable existing-game architecture or characters.
ROW 1, LEFT TO RIGHT:
1. Wheat farm with small limestone-and-teal barn, gathered golden wheat and a tiny attached harvest patch, compact silhouette.
2. Lumber mill with visible large saw wheel, stacked cut logs and an open timber work area.
3. Quarry with a compact wooden-and-brass stone crane and cut pale stone blocks, no ground platform.
4. Blacksmith forge with a stout stone chimney, vivid small amber furnace opening, anvil and hammer.
ROW 2, LEFT TO RIGHT:
5. Bustling market pavilion, elegant teal and cream striped canvas awning, wooden produce stalls, baskets and crates, no people.
6. Coastal shipyard workshop with a short attached wooden pier, timber ribs of a small hull under construction and brass crane; no water.
7. Builder cottage with an unusually angled teal roof, leaning hand tools, workbench and stacked planks.
8. Mechanical workshop with copper gears, a brass flywheel and stout square masonry body.
ROW 3, LEFT TO RIGHT:
9. Seaside tavern with a broad teal gable roof, stone chimney, welcoming lit doorway, barrels and a hanging blank wooden sign.
10. Stone well, pale masonry ring, two timber uprights, teal small pitched canopy, copper bucket and brass windlass.
11. Watchtower with a tall narrow stone shaft, compact covered teal lookout, brass bell and small banner.
12. Mortar defense, squat heavy bronze mortar angled upward on a compact stone-and-wood carriage, small cannonballs, no tall tower.
ROW 4, LEFT TO RIGHT:
13. Barrel bomb tower, reinforced compact stone platform tower topped with three strapped powder barrels and visible fuse hardware; no explosion.
14. Copper flame defense, low round masonry body supporting a distinctive copper nozzle and shield, small contained amber pilot flame.
15. Reinforced bastion, broad squat fortress turret with beveled limestone masonry, bronze reinforcements and a teal central canopy.
16. Heroic brass statue of an original maritime commander with a long coat, one hand on a ship's wheel, on a small integral stone pedestal.
Constraints: whole object only, NO surrounding ground base, grass, water, terrain, diamond tiles, scenic platform, floating rock, landscape, backdrop, grid lines, borders, labels, letters, numbers, UI or watermark. Individual foundations and integral piers/pedestals belong to the object; no generic platform underneath. Absolutely transparent between all objects. Do not draw a checkerboard, use true alpha transparency. Crisp antialiased edges without a white halo. All sixteen specified objects and no extras.

## Final spacing refinement prompt

This is an image editing task: preserve all SIXTEEN exact original Stonewake building designs, their materials, colors, lighting, camera, and sequence. Change only their SCALE AND LAYOUT so this becomes a mathematically usable equal-cell sprite atlas. Keep a genuinely transparent alpha background.
The atlas is exactly 4 columns and 4 rows. All 16 building images must be individually SHRUNK TO 65 PERCENT of their current size, then individually centered inside their own equal-sized cells. This must create very generous transparent blank space between rows and columns. Do not shrink the whole arrangement as one group. Each separate building shrinks around its own cell center. Maintain 4 x 4 uniform cell positions filling the canvas.
For a normalized 100 by 100 canvas, these are exact center coordinates:
row 1 centers (12.5,12.5),(37.5,12.5),(62.5,12.5),(87.5,12.5);
row 2 centers (12.5,37.5),(37.5,37.5),(62.5,37.5),(87.5,37.5);
row 3 centers (12.5,62.5),(37.5,62.5),(62.5,62.5),(87.5,62.5);
row 4 centers (12.5,87.5),(37.5,87.5),(62.5,87.5),(87.5,87.5).
Each building's full visible bounding box must fit within a 17 x 17 square around its center. Entire rows at y=25%,50%,75% and columns x=25%,50%,75% must be COMPLETELY EMPTY TRANSPARENT corridors. No pixels near those seams.
Order unchanged: row1 wheatfarm,lumbermill,quarry,forge; row2 market,shipyard,buildercottage,mechanicalworkshop; row3 tavern,well,watchtower,mortar; row4 bombtower,flameturret,bastion,statue.
No labels, numbers, visible cell borders, ground platforms, extra objects, new artwork or background. Do NOT fill the new transparent padding with anything. This is a precise spacing correction only. PNG true transparency, square output.

