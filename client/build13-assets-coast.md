# Stonewake Build 13 coastal terrain asset

- Asset: `Stonewake/Web/art/sculpted-coast-v13.png`
- Native dimensions: 1254 x 1254 pixels. Requested 2048 square; the built-in tool returned 1254 square for both initial and resolution refinement. Native output was retained without upscaling, as authorized.
- Generation mode: built-in image generation tool.
- Final generated source: `/Users/chrismozer/.codex/generated_images/01a0bbbf-df91-7343-a1ce-3b5df4bda62b/exec-34628b64-5446-4244-ac86-88c80de94241.png`
- Reference role: supplied game screenshots informed clarity and production quality only. No supplied-game characters, UI, or branding were copied. Final generation used existing Stonewake `coastal-world-v10.png` as orientation reference and the first original generated Stonewake terrain as a material-style reference.
- Processing: final source PNG copied unchanged to the project. No image postprocessing.
- Inspection: diagonal shoreline intersects left edge near 40 to 42 percent height and top edge near 52 to 55 percent width. Water stays in the upper-left triangle. Narrow rock/sand transition follows the diagonal. Lower and right plains are clear, without roads, buildings, people, grids, or text. Sparse shrubs remain along the far right edge and a tiny low bush at lower left. Fine grass variation provides a softly sculpted ground surface.
- Integration target: normalized boundary from source1200 x 800, `y = 338 - 0.519*x`. On this square image that corresponds to left edge 42.25 percent height and top edge 54.27 percent width. The generated shore is a visually close natural approximation, not a mathematical alpha mask.
- Initial vertical-shore draft and resolution attempt are discarded variants retained in the generated-images directory. Only the final diagonal asset is installed in the game art folder.

## Final prompt

Use case: stylized-concept.
Asset type: a complete square terrain background for the original maritime settlement game Stonewake. 2048 x 2048 preferred, native square output otherwise.
Input Image 1 is this project's earlier coastal background, used as orientation and terrain-category reference only. Input Image 2 is the new cleaner sculpted terrain, used as MATERIAL/STYLE reference only. Create a NEW original terrain matching the precise geometry below, retaining the cleaner sculpted forms and colors of Image 2. This is a gameplay ground plate, not a decorative scene.
CRITICAL COAST GEOMETRY: sea occupies ONLY the triangular UPPER-LEFT corner. The shore intersects the LEFT image edge at exactly 42 percent of image height measured from top. The shore intersects the TOP image edge at exactly 54 percent of image width measured from left. A gently irregular diagonal shoreline connects those two intersection points. Everything ABOVE-LEFT of that diagonal is deep turquoise sea and turquoise shallows. Everything BELOW-RIGHT is mostly clear, flat buildable grassy land. The sea must NOT extend all the way along the left edge and must NOT touch bottom or right edge. The sea triangle is only about 12 percent of total image area. Leave the entire lower half and all right half open grass. Preserve these normalized coordinates over the composition of reference image 1 if they differ.
Visual style: premium clean sculpted 3D diorama game art; chunky smoothly faceted pale stone and readable low shrubs, soft material shading, high-angle orthographic camera roughly 60 degrees downward, no horizon or vanishing point. Original maritime identity. Warm soft sun from upper left, subtle shadows.
Shore treatment: narrow irregular pale rockshore with a couple tiny pale sandy coves, turquoise transparent shallows, thin soft white foam. No towering cliffs or mountain forms. Cluster rocks directly against the water edge only. No detached rock clumps in the grassy interior.
Land: an enormous EMPTY gently textured grassy building plain. Muted sage-green and warm ochre, subtle low-contrast dry patches, tiny softly brushed grass variation, crisp but not noisy. Grass reaches all bottom and right edges. Nearly no trees. Sparse low shrubs permitted only along extreme outer right edge, not a continuous wall of bushes. Low visual contrast so separately rendered buildings are easy to see. Uniform planar ground without hills or steps.
Absolutely no buildings, structures, roads, fences, characters, people, vehicles, boats, castles, dramatic mountains, treasure, text, UI, logos, watermark, grid, squares, checkerboard, diamond tiles or artificial ground patches. Full bleed terrain to all four edges.

