# Stonewake: proposed premium direction

September 19, 2026. Design proposal, not an implemented feature list. The playable cap remains level 10. Build 11 and its saves remain unchanged.

## The promise

Build a coastal realm worth caring about, lead its people through a contested sea, and watch your decisions become part of its history.

Stonewake should give the player four connected pleasures: making a beautiful working city, mastering readable battles, discovering people and places, and completing ambitious projects. A successful action should create a visible change, a useful opportunity, or a story consequence.

The current build supplies useful foundations: responsive dark menus, mixed land/naval combat, storage and building limits, provincial expansion, three commanders, civic projects, raids, and an online service awaiting activation. Current gaps are concrete: resident requests cycle through three resource-exchange templates; progression notes flag that fully upgraded armies can overpower the campaign; several animation types and building orientations still use fallbacks. The current renderer uses short four-frame movement/action loops and mirrored troop directions, with genuine four-view architecture for five building kinds; there are no editable animation rigs in the project. Automated correctness tests do not establish whether those activities feel compelling.

## 1. Establish an art and animation standard

Create a production reference for camera angle, scale, silhouettes, materials, shadows, light direction, water, roads and interfaces. Recognizable units, coherent architecture and clear impacts take priority at normal phone zoom.

Prototype a consistent source-model pipeline for one soldier, one building and one ship. Rigged models rendered to directional sprites are a promising route for preserving the isometric look while producing repeatable motion and upgrade variants. Compare that result in the current game before committing to an engine migration. A new engine alone does not supply better poses, timing or art direction.

Every troop needs authored anticipation, movement, attack, impact reaction and defeat. Damage should occur when the attack visibly connects. Siege weapons need a complete loading and release cycle. Ships need turning, broadside recoil, wakes, progressive damage and a readable sinking sequence. Buildings need construction stages, material-specific damage and a collapse that leaves correctly placed rubble.

Every upgrade should visibly change equipment, materials or detailing. Milestone upgrades should change the silhouette. Avoid multiplying tiny unreadable decorations to claim visual progression.

Treat sound, animation and haptics as one synchronized event. Apple describes this coordination in [Designing Audio-Haptic Experiences](https://developer.apple.com/videos/play/wwdc2019/810/). A siege impact can combine a brief wind-up, projectile travel, the exact contact flash, a low impact sound, dust and a short tactile pulse. Feedback must preserve target visibility and remain comfortable over repeated play.

Music should move between harbor calm, scouting tension, active combat and victory using related musical themes. Balance effects and dialogue against it, retain independent volume controls, and allow motion/haptics to be reduced.

## 2. Give battles decisions that remain interesting

Use readable strengths and counters: shields cover a breach, ranged units punish exposed defenders, healers sustain separate groups, siege weapons create routes, and ships contest water access. Telegraph dangerous enemy attacks and make outcomes explainable in the replay.

Build authored encounters around different objectives: escort a ship, disable a harbor chain, capture a watchtower, rescue an engineer, hold a gate, intercept supplies, or destroy a flagship. Islands and defenses should be structured around the objective and their inhabitants.

Three distinct encounter families can support levels 1–10: a fortified stone town with gates and firing lanes; a mobile coastal raider camp; and a trading harbor with ships and civilian infrastructure to preserve. Differences should affect composition and deployment choices.

Let land and sea help each other. Land troops capture a coastal battery that threatens the fleet; ships then suppress a sea gate or escort reinforcements. Enemy vessels can flank or contest that support. These interactions require explicit targeting, clear warnings and reliable pathfinding.

Add free fixed-army trials and quick retries. They isolate skill from upgrade strength and give the player an activity while city construction runs. Friendly base challenges are also a useful established model for practice, described by [Supercell](https://support.supercell.com/clash-of-clans/en/articles/friendly-challenges-3.html). Rewards and multiplayer ranking would remain separate from practice.

## 3. Build a small cast and a world with memory

Develop the existing commanders before expanding the roster:

- Mara Ironward: the shield captain responsible for keeping the settlement alive. Her missions concern protection, evacuation and difficult defensive choices.
- Bram Flint: the siege engineer who wants to rebuild what war destroyed. His construction projects become battlefield tools.
- Elowen Vale: the ranger who knows the provinces and the people beyond the walls. Her scouting changes routes and reveals optional objectives.

Give each a recognizable portrait, silhouette, short voice lines, a relationship with the city, and a small personal mission chain. Lore should appear through sites, battle objectives, brief exchanges and visible consequences. Longer histories belong in an optional journal.

A proposed central mystery: the ruined chain of coastal beacons once connected a larger realm. Restoring them reveals what broke that realm and who benefits from keeping its ports divided. This supports the future passage into later ages without implementing any level 11+ content now.

Use an antagonist with a concrete goal, such as a blockade commander controlling access to the coast. The player should encounter the consequences of that goal before reading a biography.

## 4. Make the city an active place

Build on the four existing civic districts. Roads carry deliveries, workshops visibly work, markets attract traders, gardens host residents, and harbor crews unload returning ships. Moving and rotating a site should preserve its connections or show the consequences before placement.

Turn repeated supply requests into bounded, authored local stories: repair storm damage, prepare a ship launch, restore an abandoned square, settle a trade dispute, or house rescued craftspeople. Present a few meaningful choices at a time with explicit costs and rewards.

Give food useful expedition, recovery and civic roles while maintaining a reason to invest in timber, stone and gold. Test total resource demand across army, city, fleet and research. Optional festivals should offer worthwhile opportunities without creating mandatory upkeep chores.

Tie provinces to concrete changes: secure timber access, open a trade route, unlock a building material or host a mission. The province view must explain its current output, next objective and remaining completion goals.

Rewards should return home: an engineer opens a workshop, a saved merchant docks at the harbor, a recovered bell rings from a restored lighthouse, and a flagship's figurehead becomes a city monument.

## 5. Design satisfying rewards and real completion

Use a hierarchy of feedback:

| Scale | Example | Treatment |
| --- | --- | --- |
| Immediate | Place a wall, deploy a squad, land an attack | Fast, precise visual/audio response |
| Short activity | Finish a mission or resident story | Clear result, useful reward and a visible next choice |
| Milestone | Launch a ship, unlock an ability, complete a district | Brief authored celebration with a lasting world change |
| Chapter | Break a blockade and restore a province | Finale, changed location, trophy and completion record |

The desired satisfaction comes from anticipation, mastery, discovery, ownership and closure. Routine collection should remain quick. Larger achievements can have a memorable ceremony, with prompt skip and reliable dismissal.

Create a chronicle with finite chapter objectives, optional medals, character stories, discoveries and district milestones. Show what is complete and what remains. Fixed-loadout medals can recognize precision, protection and efficiency without requiring superior paid stats.

At level 10, finish the medieval campaign with a real ending, a transformed capital and optional mastery challenges. Tease the future gunpowder transition after that ending; do not expand the playable cap yet.

Keep gems for clearly priced convenience. Build collectible district styles, banners, ship appearances and commander outfits around this world. Core stories and signature abilities should be earnable through play. Review purchase design after the free progression and combat loops succeed in playtests.

## 6. Events that change play

Prototype one reusable event framework after the first chapter proves the quality standard. An event combines a world change, an objective variant, a reward set and a finite completion track.

Examples include a harbor festival with visiting ships and civic projects; a blockade with coordinated land/sea encounters; a storm aftermath with rescue and rebuilding; and a siege trial with a fixed army. Events should have understandable boundaries and an archive for completed stories. Difficulty modifiers must be telegraphed.

Start with single-player events. After service activation, add asynchronous challenges and a shared fleet expedition. Cooperative play needs reliable settlement, reconnect behavior, moderation where communication exists, and fair matchmaking before becoming a recurring live feature.

## The next playable deliverable: The Broken Beacon

A bounded first chapter that demonstrates the whole promise, then supplies the quality standard for further chapters through level 10. Proposed scope: six short missions, Mara and Bram in leading roles, one coastal location, one evolving waterfront, one enemy captain and one combined land/sea finale. Elowen can introduce a later scouting chapter rather than expanding this first production scope. Use the existing city and resources. Provide a fixed-army trial version so an established city can test its tactical content without a reset or repeated first-clear payouts.

1. Survey the ruined beacon and identify the blocked trade route. Teach scouting with an immediate, visible objective.
2. Restore a working delivery route to the waterfront. Make the road and building system demonstrate a useful result.
3. Rescue Bram's stranded construction crew. Introduce protection and positioning in combat.
4. Escort a repair vessel past a coastal battery. Land troops and ships need each other to succeed.
5. Prepare the harbor for a warned counterattack. Let layout changes show up in a measured defense report.
6. Break the blockade and relight the beacon. End with a brief in-world ceremony, returning merchant ships, a permanent landmark and optional mastery medals.

An illustrative five-minute visit: notice the arriving merchant, choose one helpful city action, attempt a short escort encounter, bring its reward back to the waterfront, then leave with a clear next objective. Treat duration as a playtest hypothesis, not a forced daily schedule.

## Production order and release gates

1. Define the visual, animation and sound references. Prove one unit, building and ship to that standard in a crowded scene.
2. Build and tune the chapter's combined land/sea encounter with fixed armies. Verify tactical alternatives and readable failures.
3. Connect its missions, characters, city changes, progression and finale.
4. Run fresh-player and existing-city playtests, revise the weakest moments, then reuse the proven systems for the rest of levels 1–10.
5. Activate online services and verify real Apple sign-in, cloud recovery and Sandbox purchases. Expand cooperative and recurring content after that foundation works on devices.

Targets to verify, not claims about the current build:

- A new player understands the first objective and completes a meaningful action within the opening minute, without outside explanation.
- Players can describe why a battle was won or lost and identify a different tactic to try.
- Changing deployment or composition at the same power level creates a useful tactical difference.
- An ordinary five-minute visit contains a decision and a visible result; ongoing construction does not eliminate all playable activities.
- The chapter ends with a recognizable, permanent change to the player's city and a finite completion record.
- Repeated touch testing produces no accidental deployments from pinching or menus, and every overlay closes reliably in both orientations.
- Target steady 60 fps on the intended iPhone in representative crowded battles; measure sustained frame pacing, memory, heat and input response over a 15-minute session before increasing effect density.
- Interrupted missions and repeated reward claims preserve saves and settle once.
- In a first round with five unfamiliar players, record where they need help, what they remember, whether they voluntarily retry, and whether they can explain their next goal. Treat this as qualitative discovery, not proof of market demand or retention.

The next investment decision should follow that playable chapter: which parts people enjoy, what they understand, and what reaches the visual standard on the phone. Preserve the current level-10 scope while building that evidence.
