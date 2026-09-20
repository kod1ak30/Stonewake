# Build 13 design QA

Target: the existing Stonewake iOS game. The user requested similar polish to nine supplied screenshots, with an original visual identity and dark menus. Exact reproduction of the source game is intentionally excluded.

## Reference comparison

The supplied home screenshot, store screenshot, reward screenshot and character-dialogue screenshot were opened alongside live Stonewake renders in the same comparison inputs. Checks used a 852 by 393 landscape viewport and a 393 by 760 portrait viewport; native landscape and portrait were also inspected. Source screenshots are landscape reference compositions, not pixel-identical specifications for the portrait adaptation.

| Dimension | Result |
| --- | --- |
| Layout | Gameplay stays open; destinations collapse into one illustrated menu. Persistent battle tray and reachable primary actions remain. |
| Typography | Barlow Condensed headings with Nunito body text provide a distinct game voice and readable hierarchy. |
| Color | Dark teal surfaces, cream lettering, brass actions and restrained red close controls are consistent. |
| Imagery | Original sculpted assets, matching character actions and ships replace the principal older art. No reference-game assets or branding are shipped. |
| Interaction | Store and adventure tabs, close controls, building catalog, scouting and repeated deployment taps were exercised. |
| Responsive | Panel bounds, dark surfaces, close-button hit tests and absence of document overflow passed at 393x760, 740x320, 932x430, 430x800, 840x360 and 874x409. |
| Native | The final simulator build was inspected in portrait and landscape. The central village and compact illustrated menu fit the safe area. |

## Iterations resolved

| Severity | Finding | Resolution |
| --- | --- | --- |
| P1 | Store canvases were clipped to roof tips. | Explicit canvas dimensions now fit the entire building into its card. |
| P1 | The old world projection put harbor ships on grass. | The new terrain uses the same fixed shore projection as harbor and combat coordinates. |
| P1 | A wide battle view exposed stretched edge strips. | Enlarged the fixed source coverage and verified the full battle field after reload. |
| P2 | Legacy selector specificity kept dialog headings small. | Matched the actual title-row selector with the new heading size. |
| P2 | Character portraits had excess empty headroom. | Adjusted portrait framing and reduced the chapter cover height on portrait phones. |
| P2 | Empty result columns made no-loot outcomes look unfinished. | Single-column result metrics are centered when no loot or objective panel exists. |
| P2 | Collections required scrolling past a second row of cards in landscape. | Three columns, shorter illustrations and wrapping piece controls put all collections in the first row. |
| P2 | Short landscape construction cards lost their action labels below the fold. | Reduced their minimum height and art height at 360px and below. |
| P2 | Wall catalog art would be empty in the new portrait component. | Walls and gates retain their actual fortification renderer. |

Browser console errors: none observed in the reviewed flows. A full replay with twelve deployed units reached 100 percent victory. The preceding naval replay exercised new ships, infantry and archer actions and the regroup result. Deployment selection persisted and depleted correctly without opening another menu.

Native evidence is saved under `/Users/chrismozer/Library/Developer/Stonewake-review/build13/`. Bundle and device-install evidence are recorded separately from visual checks. Physical touch feel and audible volume still require the user's hands-on assessment.

Final result: passed for this redesign scope. This is not a claim of production 3D animation quality or completed live commerce.
