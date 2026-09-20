# Stonewake Build 13 unit atlas

Generated with the built-in imagegen tool on 2026-09-19. New original Stonewake artwork. The supplied Photo 3 was a small-scale clarity and rendering-quality reference only. The generated Stonewake portrait atlas supplied the original coastal palette and material direction.

## Selected raw image

- Path: `Stonewake/Web/art/units-v13.png`
- Original output: `/Users/chrismozer/.codex/generated_images/01a0b852-4f50-75b2-99d8-563c4e224897/exec-f8ea38cf-5163-4c44-9813-a98cee5b0ce8.png`
- Dimensions: **1254 × 1254 pixels**.
- Format: RGBA PNG, alpha extrema 0 to 255, exactly transparent pixels 83.3018%.
- Saved raw output unchanged. No resizing, compositing, alpha processing or source-code changes were performed.
- Exactly 16 substantial separate connected silhouettes found with alpha >32. Each character is full-body, with required equipment and fixed down-right three-quarter isometric orientation. No visible background, platform, text or UI.

## Mapping

Rows are infantry, archer, field medic, worker. Columns are the four generated walking phases, left to right. Character designs are consistent across each row. Contact/passing and lifted-knee poses vary visibly; the generation still makes columns 1 and 3 similar in their leading-foot silhouettes. Exact anatomical opposite-foot alternation is not fully verified, so these are generated sprite frames rather than a verified rigged walk cycle.

## Packing inspection and limitations

Do not directly slice the raw image into mathematical equal quarters. Raw quarter boundaries are x/y = 0, 314, 627, 940, 1254. The first-row boots reach y=315–323, crossing the first nominal row boundary by 1–9 pixels into otherwise empty gutter. They do not collide with the archer silhouettes, which start at y=427. Uniform 18% margins were requested repeatedly but not achieved reliably by generation. Near-transparent generated edge speckles also remain outside the main silhouettes.

Use the following half-open global source bounds for normalization into equally sized game cells. Bounds are the 16 substantial connected components measured at alpha >32; retain a few source pixels of local padding for antialiasing, without reaching the adjacent figure. No other substantial component overlaps these bounds. Recommended broad row extraction bands, if needed, are 0–360, 360–660, 660–960, 960–1254. The packed atlas should establish equal cell sizes and consistent foot registration separately.

| Row | Type | Frame 0 | Frame 1 | Frame 2 | Frame 3 |
| --- | --- | --- | --- | --- | --- |
| 0 | Infantry | 120, 144, 247, 315 | 431, 141, 542, 318 | 705, 146, 843, 322 | 1018, 141, 1131, 323 |
| 1 | Archer | 112, 427, 266, 623 | 416, 428, 562, 621 | 707, 431, 855, 626 | 1011, 431, 1153, 622 |
| 2 | Field medic | 109, 725, 259, 912 | 411, 723, 553, 910 | 701, 722, 850, 914 | 1011, 721, 1153, 907 |
| 3 | Worker | 134, 1005, 244, 1180 | 436, 1005, 539, 1180 | 729, 1004, 837, 1181 | 1036, 1005, 1139, 1180 |

Machine-readable rectangles, in row-major order:

```json
[
  {
    "row": 0,
    "kind": "Infantry",
    "frames": [
      [
        120,
        144,
        247,
        315
      ],
      [
        431,
        141,
        542,
        318
      ],
      [
        705,
        146,
        843,
        322
      ],
      [
        1018,
        141,
        1131,
        323
      ]
    ]
  },
  {
    "row": 1,
    "kind": "Archer",
    "frames": [
      [
        112,
        427,
        266,
        623
      ],
      [
        416,
        428,
        562,
        621
      ],
      [
        707,
        431,
        855,
        626
      ],
      [
        1011,
        431,
        1153,
        622
      ]
    ]
  },
  {
    "row": 2,
    "kind": "Field medic",
    "frames": [
      [
        109,
        725,
        259,
        912
      ],
      [
        411,
        723,
        553,
        910
      ],
      [
        701,
        722,
        850,
        914
      ],
      [
        1011,
        721,
        1153,
        907
      ]
    ]
  },
  {
    "row": 3,
    "kind": "Worker",
    "frames": [
      [
        134,
        1005,
        244,
        1180
      ],
      [
        436,
        1005,
        539,
        1180
      ],
      [
        729,
        1004,
        837,
        1181
      ],
      [
        1036,
        1005,
        1139,
        1180
      ]
    ]
  }
]
```

## Generation history

1. Initial render: `exec-bcc9c1c1-8cda-4ed7-8b01-a5931f7a10c4.png`. Rejected for crowded cells and repeated contact poses.
2. Pose/layout revision: `exec-c8a60976-80bd-4b26-8f1a-0db007e8cd41.png`.
3. Targeted leg-phase correction: `exec-d00cae00-5ec1-4e6d-9d22-73a252d47664.png`. More distinct raised-knee phases, still tight cell boundaries.
4. Selected spacing revision: `exec-f8ea38cf-5163-4c44-9813-a98cee5b0ce8.png`.

All generated originals remain in the same generated-images directory. Only the selected raw image is copied into project art.

## Initial prompt

Use case: stylized-concept.
Asset type: production animated unit sprite atlas for the original maritime fantasy game Stonewake.
Create ONE square RGBA PNG with a true transparent background, ideally 2048x2048 pixels. It contains EXACTLY 16 separate full-body unit sprites arranged as a precise 4-column by 4-row atlas. Equal square cells. No grid lines or labels are visible.
This is a WALK-CYCLE atlas, not a character concept lineup. Each row is the SAME EXACT CHARACTER repeated in four genuinely different consecutive walk poses. Same face, clothing, gear, scale, anatomy and colors in that row. All sixteen sprites face DOWN-RIGHT, at the same three-quarter isometric camera angle, viewed from slightly above, suitable for an isometric town strategy game.
CRITICAL SPACING: Every sprite, including every weapon/accessory, occupies only the inner 64% of its own cell, centered horizontally and vertically. Keep at least 18% of the cell size as completely transparent margin on ALL FOUR SIDES. Full head to boot soles visible in each cell. No sprite touches or extends over a cell boundary. No shared floor, no platforms, no background, no floor shadow extending outside the character. Transparent gaps clearly separate all sixteen figures.

Art direction: original sculpted 3D animated-film characters, warm coastal palette of teal, bronze, tan and natural green. Large readable heads and hands, sturdy appealing proportions, anatomically clear separate limbs, polished leather/cloth/metal materials, soft ambient occlusion on the figure, warm key light from upper left. Clear silhouettes, not tiny photorealistic people. Reference Photo 3 is ONLY a small-scale clarity/render-quality reference, never copy its characters, UI or buildings. The Stonewake portrait reference defines the original game's rendering and coastal material palette, but these are full-body generic game units rather than the named protagonists.

ROWS, TOP TO BOTTOM:
ROW 1: armored sword infantry, a sturdy adult soldier with teal padded tunic, burnished bronze shoulder plates and helmet with visible face, compact short sword in right hand, round teal-and-bronze shield in left hand, sturdy boots. Four walking poses of this exact same soldier.
ROW 2: female archer, curly dark hair pulled back, green-and-teal scout cloak, practical brown belt and boots, slim curved bow carried low and close beside the body, quiver on back. Four walking poses of this exact same archer.
ROW 3: field medic, friendly adult with short dark hair, WHITE tunic and teal trim, teal mantle, clearly visible white-and-teal medical satchel at hip with a simple teal cross emblem, wooden walking staff held near body, brown boots. Four walking poses of this exact same medic. The medic must read as a healer, not armored infantry.
ROW 4: peasant worker, adult worker in plain cream shirt, tan leather apron, rolled sleeves, brown trousers and boots, carrying a SMALL wooden crate near the torso. Four walking poses of this exact same worker.

COLUMNS, LEFT TO RIGHT IN EVERY ROW:
COLUMN 1: contact pose A, LEFT foot extended FORWARD down-right, RIGHT foot planted behind up-left, arms counter-swing naturally.
COLUMN 2: passing pose A, feet passing under hips, RIGHT knee moving forward, left leg supports body, subtle raised body.
COLUMN 3: contact pose B, RIGHT foot extended FORWARD down-right, LEFT foot planted behind up-left, arms counter-swing opposite column 1.
COLUMN 4: passing pose B, feet passing under hips, LEFT knee moving forward, right leg supports body, opposite arm phase from column 2.
The four poses must have visibly distinct leg spacing, bent knees, foot contacts and arm positions. Never paste four identical poses. Keep the exact same down-right orientation in all cells; do not rotate one pose to another direction. No extra limbs. Accessories move naturally with the arms but stay within the margin. The worker keeps the crate balanced while walking.

True fully transparent alpha outside each silhouette, including the entire gap between cells. No drawn checkerboard, background color, letters, numbers, labels, UI, logos, watermarks, landscape, platforms, motion blur, ground planes, or decorative props. Deliver the complete 4x4 atlas in a single image.

## First targeted revision

Edit this Stonewake 4x4 transparent unit atlas. Preserve each row's exact character design, face, outfit, equipment, 3D rendering and fixed down-right isometric facing. Correct TWO production defects: figures need generous transparent cell margins, and the four walking poses must not repeat.

Keep a square image and exactly four columns by four rows. All cells equal square sizes, no drawn grid. Recompose each full-body sprite centered within the INNER 64% of its cell, with at least 18% cell-size blank transparent margin above, below, left and right. Shrink the figures to about 70% of their previous relative size. All heads, boots, bows, staffs, shields, swords and crates are fully contained and separated from neighbors. Entire exterior background and cell margins have real alpha 0. No ground shadows or platforms.

ANIMATION CORRECTION:
The previous image wrongly repeats almost the same contact pose in columns 1 and 3. Fix it with an unmistakable four-frame walking sequence, same camera angle, same direction and equipment. Make the figure's anatomical left and right legs exchange roles. Show distinct motion silhouettes in all four columns:
Column 1: CONTACT: anatomical LEFT leg stretched forward toward lower-right, anatomical RIGHT leg clearly trailing backward; visible wide split stance.
Column 2: PASSING / UP: LEFT leg is straight underneath supporting body; RIGHT knee bent and lifted forward with right boot lifted entirely off the ground; arms counter-swing.
Column 3: OPPOSITE CONTACT: anatomical RIGHT leg stretched forward and crossing the foreground toward lower-right; anatomical LEFT leg is clearly behind. This must visibly swap which leg and which trouser seam is forward versus column 1. Make right shoulder forward and left shoulder slightly back, with natural opposite counter-swing. DO NOT repeat column 1.
Column 4: OPPOSITE PASSING / DOWN: RIGHT leg under body supports weight with bent knee; LEFT knee lifts and swings forward, left boot lifted behind the right shin; arms in opposite phase to column 2. DO NOT repeat column 2.
Keep both legs anatomically attached and readable, exactly two legs and two arms per person. The fixed stance direction remains down-right throughout; do not mirror the whole sprite or turn one to face left. Same scale and registration in each row, slight body bob only. Believable natural walk with changing knee bends, foot separations and arm positions; no motion blur.

ROW 1: same bronze/teal infantry, short sword and round shield.
ROW 2: same female curly-haired green/teal archer with bow.
ROW 3: same white/teal medic, staff and cross-marked satchel.
ROW 4: same tan-apron worker holding the small crate steadily, with walking phases clearly visible in the legs.
No new characters, text, UI, numbers, labels, logos, backdrop, floor or decorative additions. One complete polished 4x4 RGBA atlas.

## Leg-phase correction

Make a precise animation correction to this 4x4 Stonewake sprite atlas. Keep all 16 characters, the same 4x4 cell positions, true transparent background and fixed down-right isometric facing. Preserve the exact designs and rendering. Do not change columns 1 or 2.

ONLY REPOSE THE LEGS AND ARMS IN COLUMNS 3 AND 4:
Currently column 3 repeats column 1, with the boot on the image-right side extended forward. That is wrong.
In COLUMN 3 for ALL FOUR ROWS, move the leg that appears on the IMAGE-LEFT side of the character far FORWARD, diagonally crossing in front of the torso toward the lower-right. That image-left leg's boot must now be the LOWEST AND RIGHTMOST boot in the sprite. The other leg, formerly leading in column 1, is visibly TRAILING toward the upper-left with a bent knee and lifted heel. Show the crossing thighs and trouser seams clearly enough to see which hip the forward leg comes from. Natural opposite shoulder and arm swing; equipment remains attached to the correct hand. This is the opposite-foot contact pose, not a repeat, not a mirrored whole character.
In COLUMN 4 for ALL FOUR ROWS, show the image-right knee lifted HIGH and forward near the apron/tunic hem, with its boot clearly raised OFF THE GROUND and ankle bent. The image-left leg is straight downward supporting the body. Make the lifted knee and boot conspicuous, clearly different from the second column. Turn neither torso nor face: all still face down-right.
The crate carrier must also have obviously different legs beneath the apron, while keeping the crate steady.
Exactly two legs and two arms on each character, no blur, no speed lines. Make the changed foot contacts visually unmistakable, even at thumbnail scale.

Maintain generous transparent gaps between all cells, all full bodies and weapons within their cells, no cutoffs. No background scenery, ground platforms, text, labels, grids, logos or UI. One complete square 4x4 RGBA PNG.

## Final spacing revision

Preserve these EXACT sixteen Stonewake unit designs and their sixteen poses. Do not redesign faces, costumes or walking poses. This is ONLY a sprite-atlas layout correction.

Recompose as an exact square 4x4 grid of equal invisible square cells. Center each sprite on the exact center of its own cell. All sixteen sprites should look noticeably SMALLER, each full-body silhouette occupying ONLY 50% of the cell height and at most 50% of the cell width. Reduce every existing figure to 60% of its current size. There must be broad fully transparent bands both vertically and horizontally between all cells, with at least one quarter-cell of empty alpha around each unit. This generous transparent padding is mandatory for a game engine; filling the page is wrong. Maintain the same size within each row, same registration and down-right isometric facing.

Grid centers as percentages of the total image:
Columns x=12.5%,37.5%,62.5%,87.5%.
Rows y=12.5%,37.5%,62.5%,87.5%.
Each sprite is centered at one of these sixteen positions. No sprite, boot, staff, bow, shield, sword, crate, stray pixel or shadow may touch a cell boundary. Keep the whole full-body figure and all accessories inside each inner-half cell. No artwork in the broad empty gutters.

Top row bronze/teal sword infantry; second row green/teal female archers; third row white/teal medics with staff and cross-marked satchel; bottom row tan-apron crate workers. Four existing consecutive walk poses per row preserved.
True RGBA transparency outside all sixteen cutouts, clean alpha with no faint stray pixels in gutters. No floors, cast floor shadows, plinths, backgrounds, gradient rectangles, checkerboards, grid lines, borders, names, numbers, letters, logos or UI. One complete 4x4 atlas with generous transparent padding.

