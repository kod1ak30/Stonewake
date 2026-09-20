# Stonewake build 10

Installed and launched on the paired iPhone 15 Pro Max on September 19, 2026. The device reports bundle version 10. Both native packages match every shipped web asset and the device signature verifies.

## Changes

- Finite per-resource storage, increasingly valuable storehouse upgrades, Keep-based building counts, and protected versus exposed raid loot. Construction counts toward limits. Market exchanges now support all four resources.
- Existing supplies beyond capacity are preserved in reserve crates. New overflow does not create crates. Full stores pause production and block manual reward claims safely.
- 256 home plots, 324 with provinces, a wider camera range and continuous painted coastal terrain.
- Roads connected to the Keep raise adjacent producers by 10%; gardens improve housing gold. Rotation is saved for construction and moves.
- Direct Build, Army, City and Frontier navigation, grouped secondary actions, compact dark panels, capacity displays and brief collectible reward feedback. Toasts no longer block menu close buttons.
- Warships fight enemy ships, can sink, and surviving ships advance toward the coast. Damage adds cracks, fire, smoke, heavier destruction and splashes.
- Original battle music and layered naval, water and destruction effects. Battle intensity comes from the composition; the selected music volume is retained.
- Painted well, warmer roads, less duplicate crowding, varied citizen work and walking, larger troop portraits.

## Validation

Economy tests include 521 affordability and transition checks, finite storage, migration conservation, loss-making exchange cycles, capacity-blocked claims, construction counts, four single-shipwright guards, raid theft, roads and gardens. Naval tests cover deterministic simulation, historical replay compatibility, duels, sinking, real UI start, save/reload, one-time settlement and repairs. UI regression covered 393×760, 430×800, 840×360, 740×320, 932×430 and 874×409.

Native testing used a separate simulator seeded with a copy of the current phone save. Real clicks started an upgrade and bounded reserve collection. Native battle orders recorded two archers and a cavalry deployment, and runtime logs confirmed background simulation and city/battle music switching. The final native package was reopened and inspected after the final menu/art changes.

After installation, the physical phone save preserved the exact combined stored/reserve resource totals, all 17 buildings, four ships, army, gems, campaign, provinces, quests, honors and reports. Previously pending Royal Knight level 2 research completed according to its original saved timer.

NPC raids still start manually from City → Defense. This update does not add automatic offline raids or live multiplayer. Four facings use mirrored elevations and directional details rather than four unique paintings. Playable progression stops at 10. Long-term pacing needs normal playtesting; physical speaker/headphone sound was not independently auditioned.

[Detailed economy rules](BUILD10-BALANCE.md)

Verification: `/Users/chrismozer/Library/Developer/Stonewake-review/build10/verification.json`

## Generated artwork and final prompts

Both assets were made with the built-in image generation tool, inspected and copied into the project. Their generated alpha and dimensions were preserved. Original generation outputs remain available.

### coastal-world-v10.png

Saved asset: `/Users/chrismozer/Desktop/Stonewake-iOS/Stonewake/Web/art/coastal-world-v10.png`

Prompt file: `/Users/chrismozer/Desktop/Stonewake-iOS/client/coastal-world-v10-prompt.txt`

Final prompt:

Built-in imagegen, 2026-09-19. Original painted coastal terrain, no reference image.

Square continuous world terrain painting for Stonewake, medieval isometric ground plane, no interface, text, grid, buildings, ships, people, roads or settlements. Natural rocky diagonal shoreline from left edge about 59% height to right edge about 12%, ocean above, broad open sunny olive-green meadow below. Central gameplay area unobstructed, only low rocks/shrubs and trees near outer bottom/right edges. Detailed classic painted medieval strategy style, balanced daylight, blue teal sea. No horizon, sky, large cliffs, mirrored landmarks, tiled seams or empty margins.

Requested 3072 square; built-in returned 1254 square. Preserved returned original PNG. Rendered as fixed world rectangle (-1500,-1200,4200,4400), calibrated by sampling shoreline color and visually inspecting docks/sea lanes.

### village-well-v1.png

Saved asset: `/Users/chrismozer/Desktop/Stonewake-iOS/Stonewake/Web/art/village-well-v1.png`

Prompt file: `/Users/chrismozer/Desktop/Stonewake-iOS/client/village-well-prompt.txt`

Final prompt:

Use case: stylized-concept. Asset type: transparent game building sprite for an isometric medieval coastal town. Create one richly painted stone village well, a circular aged limestone well with a dark visible water shaft, two oak supports, a small weathered dark blue slate pitched roof, wooden crank, rope and bucket, small stone apron and a couple of moss tufts. Match polished hand-painted isometric strategy game architecture, realistic miniature materials and dimensional warm sunlight from upper left. Camera is orthographic 3/4 isometric, viewing the front and right sides at 30 degrees down; entire object visible with generous transparent margin and delicate contact shadow. The well should be a convincing small civic building next to detailed castles and half-timbered cottages, never a flat diagram or simple geometric icon. Single object centered, no people, no labels, no text, no watermarks, no scenery beyond its small apron. True transparent background with alpha, no checkerboard. Square asset.

## Audio sources

The original composition and all synthesis are reproducible from `scripts/compose-audio10.py`. No third-party samples were used. Assets: `Stonewake/Web/audio/battle.m4a`, `naval-fire.wav`, `naval-impact.wav`, `building-destroy.wav`, `wood-break.wav`, and `water-splash.wav`. Battle music is a 48-second loop, measured at -22.1 LUFS and -6.5 dB true peak with no clipped samples. The measured seam is below ordinary within-track sample variation.
