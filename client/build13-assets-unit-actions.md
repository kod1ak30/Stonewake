# Stonewake Build 13 unit action atlas

Generated with the built-in image generation tool using the existing original Stonewake walking atlas as the sole character reference. One generation was performed for this action sheet. No image pixels were edited after generation.

## Files and provenance

- Asset: `Stonewake/Web/art/unit-actions-v13.png`
- Extraction metadata: `client/build13-assets-unit-actions.json`
- Character reference: `Stonewake/Web/art/units-v13.png`
- Original tool output: `/Users/chrismozer/.codex/generated_images/01a0b852-4f50-75b2-99d8-563c4e224897/exec-749f4dfc-4361-4ad0-8a10-3dc0b50ef61d.png`
- Actual size: **1448 × 1086**, RGBA PNG.
- Requested ideal size: 2048 × 1536. Native output retained unchanged.
- SHA-256: `ac2f7eac68390c2690a9ec32cff2bc1bee15aa9646a5cb8f02f3207781e48d36`
- Alpha spans 0–255. Exactly 71.6847% of pixels have zero alpha.
- No text, grid, labels, ground platforms, or scenery.
- The reference atlas was used to retain original Stonewake designs; no third-party character likeness was requested.

## Layout and inspection

Four columns: ready, windup, release/strike, recovery. Three rows: infantry, archer, medic. The nominal cell is 362 × 362 pixels.

The first row retains the bronze helmet, round teal shield, teal clothing, and sword. Poses show guard, raised sword, extended slash, and recovery. The second row retains the curly-haired archer, cloak, quiver, and wooden bow, with clearly different ready, draw, release, and recovery poses. The third row retains the cream-and-teal medic, cross-marked satchel, and staff. Its action is healing, with a contained translucent glow.

Visual continuity was inspected against the reference. This is a generated pose sheet, not a rigged or playback-verified animation. Small hand, face, and equipment changes between painted frames can remain.

There are twelve substantial connected silhouettes at alpha > 32, with no visible overlap between neighboring figures. The broad empty separators are usable for extraction, but the requested 18% margins were not uniformly achieved. The infantry strike extends to y=367, five pixels past the nominal first-row boundary. **Do not extract by exact equal row slices.**

The JSON contains zero-based row/column indices, half-open global rectangles, multiple alpha thresholds, and suggested extraction rectangles. Suggested `safeRect` values include all alpha > 8 and three pixels of padding. This includes the visible medic glow. Very faint isolated alpha <= 8 speckles are present in broad transparent regions; `alphaInclusiveRect` also records all nonzero alpha. The raw PNG retains every original pixel.

Suggested extraction rectangles [left, top, right, bottom]:

| Unit | Ready | Windup | Release / strike | Recovery |
| --- | --- | --- | --- | --- |
| Infantry | [94,90,292,349] | [427,52,650,356] | [809,102,1077,370] | [1185,90,1359,356] |
| Archer | [79,421,310,704] | [439,418,698,709] | [800,419,1038,710] | [1165,429,1374,709] |
| Medic | [86,761,294,1038] | [437,767,660,1037] | [798,765,1049,1041] | [1167,763,1367,1037] |

`anchorHint` is only the bottom center of each significant silhouette, not a skeletal anchor. Integration should normalize sprite scale and ground position across walk and action sheets.

## Exact generation prompt

```text
Use case: stylized-concept.
Create a companion ACTION animation atlas for the attached original Stonewake unit atlas.
The reference is the authoritative character design sheet: preserve the EXACT FIRST THREE unit designs, same faces, hair, outfits, gear, proportions, material rendering and colors. Do not include the worker row. No redesigns.
Output ONE RGBA PNG, landscape 4:3 ratio, ideally 2048x1536, with EXACTLY FOUR columns and THREE rows of equally sized invisible square cells. Twelve full-body sprites total. Every sprite faces the same DOWN-RIGHT three-quarter isometric direction as the reference, viewed from slightly above.

CRITICAL SPACING: Every sprite and every item it holds must be centered within its own cell, occupying no more than the inner 60% of the cell width and height. Broad true transparent gutters, at least 18% transparent margin on each side. All heads, boots, weapons, bows, staff tips and effects fully contained inside each cell. No sprite or effect crosses into neighboring cells. No floor shadow, base, plinth, terrain, drawn checkerboard, backdrop, grid, label, text, number, logo or UI. Preserve true fully transparent alpha between and around all twelve silhouettes. Large readable heads/hands, anatomically clear limbs, sculpted animated-film 3D quality, soft ambient occlusion on the figure, warm upper-left light.

ROW 1, TOP: the same dark-bearded infantry soldier from reference row 1: bronze helmet and shoulder armor, teal padded tunic/scarf, leather belt/boots, short sword in his right hand and round teal/bronze shield in his left hand. Four distinct successive combat poses:
Column 1 READY: sturdy guard stance, sword lowered diagonally, shield held protectively in front.
Column 2 WINDUP: knees bent, torso slightly coiled, sword arm drawn back beside the shoulder, shield forward. Maintain down-right facing.
Column 3 STRIKE: decisive short-sword slash toward lower-right, right arm extended across the front, weight shifted onto leading foot, shield braced back slightly. Sword entirely contained in cell.
Column 4 RECOVERY: sword finishes lower across the body, torso settles upright, rear foot steps under hip, shield returns to guard.

ROW 2, MIDDLE: the same female archer from reference row 2: black curly ponytail, forest-green cloak with teal accents, brown boots and belt, curved wooden bow and back quiver. Four distinct consecutive bow poses:
Column 1 READY: relaxed braced stance, bow low in left hand, right hand preparing one arrow.
Column 2 DRAW: bow raised toward down-right, left arm extended, right hand pulls bowstring back to cheek with a clearly taut string and nocked arrow. Torso braces.
Column 3 RELEASE: bow still aimed down-right, right fingers open and right hand pulled slightly behind cheek; bowstring rebounds forward. No detached flying arrow needed, no motion blur.
Column 4 RECOVERY: bow lowers slightly, right hand reaches back toward the quiver, stance resets.

ROW 3, BOTTOM: the same friendly dark-haired bearded field medic from reference row 3: cream-white tunic with teal sleeve and hem trim, teal scarf/mantle, brown boots, white-and-teal cross-marked satchel, wood staff with wrapped/brass cap. He HEALS, he does not fight with a weapon.
Column 1 READY: staff planted close beside body, free hand relaxed near the satchel.
Column 2 GATHER: lean forward slightly, raise the free hand toward chest and grip staff, a small restrained turquoise-gold light gathers in the palm.
Column 3 HEAL: extend the free hand toward lower-right while staff remains grounded, a small contained translucent turquoise-gold healing sparkle around the outstretched palm. No large cloud, projectile, enemy or second character.
Column 4 RECOVERY: lower hand toward satchel as the small light fades, shoulders relax and staff returns upright.

Each column is a distinct body/arm action, not four pasted duplicates. Retain exact character continuity across both the source walking atlas and this action atlas. No extra limbs, no replacement costumes, no scene. One complete 4x3 transparent sprite atlas.
```

