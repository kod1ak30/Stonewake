# Build 13 sculpted buildings rear views

Generated through the built-in image_gen tool using the imagegen skill. Edited from the approved front atlas after viewing it with view_image. All twelve retain the original coastal architectural identities, tier order, teal roofs, warm limestone and upper-left sculpted lighting.

## Selected asset

- Asset: `Stonewake/Web/art/sculpted-buildings-rear-v13.png`
- Source: `/Users/chrismozer/.codex/generated_images/01a0bbbf-9534-7ed1-a56e-b769f4781390/exec-b3a2578b-e087-4f6c-9ebf-b446156b736e.png`
- Input: `Stonewake/Web/art/sculpted-buildings-v13.png`
- Native dimensions: 1448 x 1086, RGBA with genuine transparency.
- Raw image copied without pixel modification or resizing.
- Measured safe crop rectangles: `client/build13-buildings-rear-rects.json`. Alpha >4 bounds plus 10px padding; all rectangles inside the canvas and pairwise disjoint.
- Visually inspected all twelve complete objects. Keeps show rear walls instead of front gates. Cottages show alternate roof slopes and rear windows. Barracks show rear storage and weapon racks. Warehouses show rear loading walls and service access. This is generated rear-quarter artwork, not a horizontal flip. Procedural geometric identity is not claimed; small details may differ from the front because these are separate painted renders.
- Row 1: Keep 1, Keep 4, Keep 8, Cottage 1.
- Row 2: Cottage 4, Cottage 8, Barracks 1, Barracks 4.
- Row 3: Barracks 8, Storehouse 1, Storehouse 4, Storehouse 8.

## Final prompt

Use case: precise-object-edit. Asset: opposite rear-quarter views for an existing production sprite atlas. The input contains twelve APPROVED building designs for Stonewake. Preserve exactly these same twelve architectural identities, upgrade tiers, proportions, material colors, warm limestone, teal roofs, bronze details, upper-left sunlight, orthographic isometric camera elevation, and 4 columns by 3 rows layout. Change the viewing direction by rotating each actual building around its vertical axis exactly 180 degrees. This is a NEW VIEW of the rear and opposite side of each building, NOT a horizontal flip or mirror. The front faces shown in the input must face away and must NOT be visible. Keep front gates and main facade crests on the far hidden side. Show the Keep rear limestone curtain wall and rear windows instead of the entrance gate. Keep tall and small turrets geometrically corresponding to the same design. Cottage rear walls with windows, rear chimney and plain rear roof planes replace front porches and balconies. Barracks rear integrated training yard and timber weapon storage visible, main entry hidden. Storehouse back service/loading doors and rear walls visible, no main facade crest. Every building is fully visible in its own cell, no overlapping neighboring sprites. Each building fits with generous transparent padding around all sides, including flags and barrels. Use genuine transparent alpha, no background or floor, no ground platform, no text or labels, no drawn grid, no scenery, no characters. Canvas 1448 x 1086. The exact row-major order must remain: row1 Keep1,Keep4,Keep8,Cottage1; row2 Cottage4,Cottage8,Barracks1,Barracks4; row3 Barracks8,Storehouse1,Storehouse4,Storehouse8. Sculpted polished 3D quality, crisp small-scale silhouettes, consistent upper-left light. Crucial: all 12 are viewed from behind; this is not the existing front view.

