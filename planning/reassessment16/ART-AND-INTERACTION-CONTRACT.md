# Stonewake art and interaction contract

Proposed production specification, 19 September 2026. This is original design work, not completed art or a claim that the current build passes these requirements. It complements the screenshot-based reassessment.

## Visual direction

A coastal medieval kingdom built from warm timber, weathered stone, copper, slate and sea-glass. The world should read clearly at phone distance, with a few strong shapes and concentrated detail. Use one isometric camera, light direction, shadow softness, outline treatment and scale reference for every asset. Soft terrain sits behind distinct buildings and people. Dark menu surfaces use warm pale text and one restrained gold action color. Battle warnings use a separate danger color and shape.

Do not reproduce Clash's recognizable characters, wall skins, Town Hall shapes, branded typeface or sounds. Use its clarity and visible transformation as the quality reference.

## Level-by-level appearance specification

Each row is an unmistakable next appearance at the same camera distance. These are proposed visual changes; any mechanical benefit requires its own rule and UI quote. Decorative additions must not silently alter footprint, range or attack behavior.

| Level | Keep | Connected wall kit | Troop rank treatment | Ship development |
| --- | --- | --- | --- | --- |
| 1 | Small timber hall, stone hearth, one modest roof | Timber posts with a rope rail and rough gate | Plain cloth, simple wood or iron equipment, clear family silhouette | Low wooden hull, plain sail, compact rig |
| 2 | Raised stone footing and attached timber lookout | Braced posts, visibly thicker uprights, framed gate | Padded armor and broader equipment rim, an added role-specific pouch or guard | Raised prow, reinforced gunwale, larger visible cargo lashings |
| 3 | Stone lower hall and square watchtower | Rough masonry replaces timber, strong end piers | Chain or leather protection, improved weapon shape; first ability has an authored action pose | Reinforced hull band, protected steering position, first role-specific mount |
| 4 | Twin stone gate towers and a broader entrance | Dressed masonry with clear crenellations and joined corners | Distinct helm or hood and a changed shield/bow/tool outline | Forecastle and more substantial mast support |
| 5 | Broader slate-roofed citadel and bronze roof ridges | Taller courses with visible bronze ties | Brigandine or equivalent specialist gear, more substantial primary weapon | Stronger sail plan and recognizable faction pennant |
| 6 | Attached harbor beacon tower and a raised central chamber | Defined parapet walk and larger gate assembly | Plated shoulders or specialist harness; second ability gains a distinctive effect and motion | Raised stern deck and clearly upgraded role equipment |
| 7 | Dark granite central tower, copper roof and carved heraldry | Dark granite with heavy exterior buttresses | Veteran armor silhouette and visible faction insignia | Armored bow and upgraded hull profile, with role-preserving silhouette |
| 8 | Extended copper-roofed wing and a stronger beacon frame | Deeper parapet and patinated copper reinforcement | Grooved steel or specialist equivalent; new cloak, quiver or carrying rig | Taller protected command position and a visibly changed rig arrangement |
| 9 | Crownstone upper chamber above dark foundations | Pale crownstone caps with carved faction emblems | Elite crest and role-specific elite equipment; third ability has a unique readable tell | Crownstone/copper command detailing and elite sail design |
| 10 | Monumental beacon capital with an unmistakable crown silhouette | Integrated watch-post silhouettes and rare sea-glass accents | Final complete outfit with a distinct silhouette, restrained light only where justified | Final flagship form with a unique prow, silhouette and rig for each vessel role |

The armor column is a rank vocabulary, not permission to put identical armor on every troop. Rangers must remain recognizable by weapon and posture, medics by their aid gear, siege crews by their machine and crew scale. Every portrait, deployment card, upgrade comparison and in-world animation uses the same unit and level data. A Shieldbearer description cannot promise cloth and a buckler while showing unrelated heavy plate.

The ship column is a visual ladder to map onto the final supported upgrade rules. It does not authorize silently raising a ship level cap or adding ten purchase tiers. Transport, escort and siege ships retain different proportions throughout. A bigger mast cannot be the only difference between roles. Stay within the requested medieval scope: ballistae, stone projectiles, firepots and boarding equipment should not be presented as later industrial-age weapons.

## Required asset sets

| Set | Production requirement | Approval view |
| --- | --- | --- |
| Keep | Ten distinct finished appearances; construction, damaged and ruined states consistent with each stage | All ten at identical scale plus three real village screenshots |
| Other buildings | A deliberate appearance for every supported upgrade level using authored modular parts or complete sprites | Adjacent-level comparison at ordinary play zoom; no tint-only upgrade |
| Walls | End, straight, corner, junction, cross, gate, damaged and broken forms; shared pivots and mixed-level connections | Closed enclosure, irregular perimeter, rotated layout, mixed levels and ruined gap |
| Roads | Straight, bend, junction, crossing, end, doorway approach, dock approach and edge blending | Real populated village; no visible floating strips or foundation intersections |
| Troops | Idle, walk, wind-up, strike/fire, recover, hit, fall and ability states, with direction treatment | Three families side by side; maximum battle density; every ability milestone |
| Citizens | Several readable silhouettes and destination-specific work cycles with matching art style | Normal and zoomed-out village, including path turns and work transitions |
| Ships | Distinct hull/rig for each role, travel, turn, weapon recoil, hit, damage, landing and settled wreck states | Shore approach, ship duel, docked preview and simultaneous fleet battle |
| Effects | Material-specific contact, sparks, dust, splinters, water spray, rubble and earned reward motion | Busiest battle and reduced-motion view; targets remain legible |

Approve a representative finished scene before expanding production. It must contain a developed Keep, a gate and connected walls, a joined street, working residents, three troop families and a transport/escort pair. Review it in the actual phone-sized game. A beautiful isolated illustration is not an accepted gameplay asset.

## Layout contract

Use one shared panel structure: compact title/back row, content, and a stable primary-action area. Avoid two or three permanent tab rows above a tiny scrolling viewport. A tab may not make the same content impossible to see at a shorter height. Use deliberate content prioritization rather than shrinking all text.

Building selection: name and level, current/next picture, two useful benefits, requirements/cost/time and one Upgrade action. Move and Rotate are secondary. If blocked, the action explains the exact missing requirement and opens a remedy that returns here.

Troop detail: portrait at consistent scale, short battlefield role, current/next art, health/attack or role-specific benefit, and next ability. Avoid displaying unchanged stats as if they are rewards. One practice action demonstrates the ability. Quantity adjustment belongs with army composition, not the upgrade presentation.

Sea preparation: mission threat and scout thumbnail; one selected fleet strip; portraits and a single capacity summary such as `18 troops aboard · 24 / 30 spaces`; one Sail action. Change army and Change ships edit inline. Recommended loading needs no manual input fields. Exact disabled reasons are visible and actionable.

Store: a small set of substantial collections with accurate thumbnails, a large in-world preview, included items and ownership state. A user must understand what changes before purchase. Never use a generic starter building image to represent several paid appearances.

Minimum review sizes are 667 × 375, 844 × 390 and 932 × 430, with both actual landscape safe-area arrangements checked on device. Main content target is 14 px or greater; secondary labels 12 px or greater. Primary hit areas remain at least 44 points. These are acceptance targets, not performance claims about the current build.

## Input and deployment contract

- An ordinary enabled button responds to one press with immediate feedback and exactly one action. A pending asynchronous operation has a working state that prevents duplicate spending.
- Only one modal focus scope exists. Back returns to the previous context; Close always closes the active surface. Noninteractive banners cannot intercept taps.
- One-finger tap deploys the selected troop in a valid area. Holding deploys continuously; dragging while held lays troops along the path. The selected tray stays open and counts update immediately.
- Two-finger pinch cancels deployment before manipulating the map. Lifting either finger does not leak a troop placement. Camera gestures never resize the page or menu.
- Sea deployment chooses a vessel carrying the selected troop. The player sees its route and landing region. Optional vessel selection can override this choice, with a clear unavailable reason.
- Disabled or invalid actions explain their cause once without a blocking popup. Input is not silently discarded because a notice, stale modal or full army exists elsewhere.

## Completion and sound contract

A building upgrade reveals the actual finished object, settles with the material-appropriate sound, and directs attention to its benefit. A battle impact aligns to contact, damage persists, and the final collapse remains a ruin. Naval impact uses water and hull effects appropriate to the weapon. The result screen combines objectives, loot, losses and next action in one short sequence.

Music and effects have separate controls. Intense combat music leaves room for impact and command feedback and does not depend on extreme volume. Respect reduced motion and haptic settings. Avoid overlapping reward sounds and banners. A stronger reward should correspond to a stronger earned outcome.

## Approval standard

Reject an asset or screen if it looks good only when enlarged, if its gameplay benefit is unclear, or if its interaction fails at phone size. Require consistent views from the actual game, adjacent-level recognition checks, mixed-wall topology checks, useful new-player task observation and measured physical input. Do not mark this specification delivered merely because the files or menu entries exist.
