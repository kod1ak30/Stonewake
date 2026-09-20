# Build 17 gameplay and economy evidence

Verified 20 September 2026. This records implemented rules and deterministic checks, not commercial release approval or a human playtest result.

## Progression and upgrade value

Land and Sea first clears now contribute to one Keep progression requirement. Either campaign, or a mixture, can supply the required victories. Repeats, practice battles and raids do not add campaign renown. The same combined progress drives the existing income milestones. Keep advancement still requires its authored buildings, resources, storage and construction crew, and stops at level 10.

Upgrade quotes expose actual changes in health, damage, production, storage, army capacity, berths, residents and applicable civic bonuses. They use the same formulas as the rules. Roads through gates now connect civic income; other occupied building footprints still block roads. A regression verifies increased farm food income across a gated street.

Active civic district work now appears in the shared Projects list and completion-notification plan with its district, target stage and deadline. Its occupied crew can no longer be hidden behind an empty project list. Optional civic speedup uses the existing authoritative gem quote, completes the stage through the normal tick and frees the crew; the once-only district celebration remains a separate claim. Tests cover natural completion, paid completion, upgrade unblocking and rejected stale, duplicate or unaffordable commands.

## Storage and returning ships

Main storage remains capped. Voyages reserve space before departure in a separate Harbor depot, capped per resource at main storage capacity. Collecting a returned voyage fills available main storage, moves the remainder into that depot and releases the ship for combat. Claiming depot supplies moves only what fits, conserving every resource. Further departures are blocked when their promised cargo would exceed the depot reservation.

Existing cargo receives a one-time bounded migration allowance when necessary. That allowance never increases and shrinks as the grandfathered supplies are used. No new resources or gems are granted. Five archived physical-phone saves retained identical gems, armies, research, fleets, buildings, campaign progress, quests, honors and premium ownership; repeat migration was idempotent. Those snapshots each contained 988 gems, Keep 7, Land 10 and Sea 2.

## Balance decisions and permanent gem value

Construction, troop and ship resource prices were retained. The deterministic funding model found gold, rather than timber, was the main waiting constraint after production upgrades. Adding an arbitrary food charge was not justified. Optional shortfall trades use existing Market rates and preserve the food needed for the selected project.

Permanent cosmetic prices now total **260 gems across 14 purchasable pieces**, compared with the audited 910. A Mariner collection costs 68 gems for four pieces, Royal 68 for three, and Citymaker 32 for three when none are owned. Collection quotes charge only missing pieces at 80% of their individual total, rounded up. Exact-price confirmation rejects stale purchases, duplicate ownership is not charged, and independently gem-owned items survive cash-entitlement revocation. Earned-only pieces stay earned-only. This work does not enable live cash purchases or add a gem grant. Ship repair now participates in the existing optional, quoted gem completion flow.

The medieval finale adds the exclusive **Coastal Crown** banner alongside its existing rewards. It cannot be purchased, included in a paid collection or equipped before ownership. Previously completed finales receive this banner idempotently without another gem award or changes to their equipped appearance. New completion preserves the established 50-gem, laurel and ivory-banner rewards.

## Reproducible progression checks

`frontend/test/progression-model17.mjs` uses production construction, research, recruiting, storage, voyage, repair, trade and timer rules from a fresh kingdom. It never refills resources or spends gems. Baseline models explicitly assume victories and one-third field losses. Separate combat runs simulate every mission, preserve actual survivors and repair actual wrecks.

| Run through Keep 10 | Model clock, minutes | Actions | Trades | Gems spent |
|---|---:|---:|---:|---:|
| Builder, assumed battle results | 2,788.3 | 173 | 57 | 0 |
| Builder, without trades | 2,878.0 | 116 | 0 | 0 |
| Land, assumed battle results | 2,284.8 | 189 | 91 | 0 |
| Sea, assumed battle results | 3,677.1 | 248 | 87 | 0 |
| Land, all 10 actual simulated battles won | 2,285.3 | 199 | 91 | 0 |
| Sea, all 10 actual simulated battles won | 3,687.8 | 250 | 89 | 0 |

These clocks include modeled funding and project waits; they omit human decision time and battle duration. They are not a prediction of player completion time. The combat setup uses Infantry/Archers and Sea ship abilities at eight seconds. After distinct fort layouts were integrated, the final Sea mission required a different legal landing choice: northern beach row 1 instead of row 4. The earlier fixed row-4 attempt lost; the updated final encounter won in 51.25 seconds with 82% destruction and 52 survivors. Every earlier Sea mission retains row 4. This proves an attainable route, not difficulty balance across every army, beach, seed or play style. Builder trades reduce modeled funding wait from 139.4 to 49.6 minutes without changing prices. No storage deadlock occurred; final modeled capacity was 37,172 per resource.

The authored forts provide ten distinct layouts in each campaign. Tests retain the previous combat-building counts and levels before Sea-specific adjustments. Perimeters range from 30 to 34 wall/gate tiles instead of the old 32; this is a small physical layout difference that can still affect approach difficulty. Every interior building is enclosed, gates join neighboring wall segments, and plots/IDs do not overlap. Sea generation now replaces the wall at the harbor plot explicitly, keeping all ten harbors visible. All nine legal landing rows remain clear of land structures.

## Regression and visual integration evidence

The eight focused suites cover **54 tests**: `naval-preparation`, `cargo-transfer`, `gameplay17`, `progression17`, `world17`, `civic-projects17`, `finale17` and `campaign17`. Run them with `node --test frontend/test/{naval-preparation,cargo-transfer,gameplay17,progression17,world17,civic-projects17,finale17,campaign17}.test.mjs`. `npm run check` passes module checks, TypeScript and lint with the new campaign rules. The backend suite last passed **12 tests**, including actual Worker rejection of forged purchase data, D1 concurrency, historical replays, authoritative cargo/deployment, cosmetic restoration and refund conservation. Its old cosmetic-price assertions now read the real catalog price. The final server bundle must be regenerated and rechecked for the added civic/finale/campaign rules.

Coverage includes owned/unlocked balanced cargo, fragmented holds, transport priority, explicit equal-weight swaps, conservation, unavailable vessels, depot reservation/migration, exact upgrade deltas, campaign progression and permanent collection ownership. World checks validate real PNG bounds, all ten Keep levels in four front/rear/mirrored facings, matching selection/render sizes, mixed wall joins, perpendicular gate connections, road footprint avoidance and path-cache reuse. Economic art has three authored tiers per family at levels 1, 4 and 7, with intermediate scale growth. These checks do not establish subjective art quality, phone performance or usability approval.
