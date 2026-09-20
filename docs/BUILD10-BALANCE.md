# Build 10 balance reference

Confirmed from the current game bundle and independent browser tests on a cloned save. These are implemented rules, not a claim that long-term pacing has been playtested.

## Storage and saved progress

Each resource has its own identical capacity: `500 + 250 × Keep level + completed storehouse contributions`. A storehouse contributes `round(800 × 1.5^(level−1))`. A new unfinished store adds nothing; an upgrade retains its previous contribution until completion. Building and store upgrades remain capped by Keep level.

| Keep | Base capacity | Store limit | One store at this level | Capacity with all stores at this level |
|---:|---:|---:|---:|---:|
| 1 | 750 | 1 | 800 | 1,550 |
| 2 | 1,000 | 1 | 1,200 | 2,200 |
| 3 | 1,250 | 1 | 1,800 | 3,050 |
| 4 | 1,500 | 2 | 2,700 | 6,900 |
| 5 | 1,750 | 2 | 4,050 | 9,850 |
| 6 | 2,000 | 2 | 6,075 | 14,150 |
| 7 | 2,250 | 3 | 9,113 | 29,589 |
| 8 | 2,500 | 3 | 13,669 | 43,507 |
| 9 | 2,750 | 3 | 20,503 | 64,259 |
| 10 | 3,000 | 3 | 30,755 | 95,265 |

Old resources above the new cap move into reserve crates exactly once. Manual withdrawal fills available space without duplication. Crates are not new passive storage: production above capacity is lost, and new overflow is not banked there. Existing buildings, levels, projects and excess building counts are preserved. Grandfathered excess buildings cannot be expanded until the current limit permits another copy.

Manual objectives, achievements, resident requests, cargo and workshop claims reject insufficient storage before paying or consuming the claim. Resident requests consider the space created by their payment. Automatic battle rewards and passive production are capped to the available room; their overflow is not stored. Gems and reserve crates are not raid loot.

## Building limits

Counts include construction in progress. Farm and lumber limits are identical. Gate conversion consumes a gate slot and frees a wall slot. Wall projects contain at most 24 connected segments per action.

| Keep | Farm / lumber | Quarry | Barracks | Tower | Walls | Gates | Cottages | Builder huts |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 1 | 1 | 2 | 28 | 2 | 2 | 1 |
| 2 | 1 | 1 | 1 | 2 | 36 | 2 | 2 | 1 |
| 3 | 1 | 1 | 1 | 3 | 44 | 3 | 3 | 1 |
| 4 | 2 | 1 | 1 | 3 | 52 | 3 | 3 | 2 |
| 5 | 2 | 2 | 2 | 4 | 60 | 3 | 4 | 2 |
| 6 | 2 | 2 | 2 | 4 | 68 | 4 | 4 | 2 |
| 7 | 3 | 2 | 2 | 5 | 76 | 4 | 5 | 3 |
| 8 | 3 | 2 | 2 | 5 | 84 | 4 | 5 | 3 |
| 9 | 3 | 3 | 2 | 6 | 92 | 5 | 6 | 3 |
| 10 | 4 | 3 | 2 | 6 | 100 | 5 | 6 | 3 |

One each: Keep, foundry, market, shipyard, workshop, tavern and monument. The monument also needs its league unlock. Wells allow one, then two at Keep 6. Mortars allow a second at Keep 6; bomb towers and flame towers at Keep 8; bastions at Keep 9. Their original building unlock levels still apply.

The home map has 256 land plots (16 × 16). Capturing all five provinces makes 324 land plots (18 × 18), plus the separate coastal shipyard berths. Army capacity is capped at 72. Builder huts allow up to four concurrent construction crews. Shipyard capacity is `min(8, shipyard level + 1)` vessels. New shipyard count is one, even though old additional shipyards remain saved. One shipwright handles construction, upgrades or repairs at a time; both the buttons and action validation enforce that rule.

## Income, costs and town planning

| Producer | Resource per minute per completed level |
|---|---:|
| Farm | 24 food |
| Lumber camp | 28 timber |
| Quarry | 16 stone |
| Keep | 8 gold |
| Cottage | 4 gold |
| Market | 10 gold |
| Shipyard | 4 gold |

Base income is 6 gold, 2 timber, 2 stone and 4 food per minute. Campaign milestones add 8 timber at two victories, 8 stone at three, and 12 gold at four. Provinces add income per province level: Whisperwood 12 timber, Sunmeadow 14 food, Ironpass 10 stone, Tidewatch 16 gold and Highmarch 12 gold.

A road network must connect to a tile adjacent to the Keep and reach a producer's adjacent tile. Connected producers gain 10%; isolated roads do nothing. Occupied road or garden tiles grant no benefit. Each visible garden adjacent to a completed cottage adds 2% to housing gold income, capped at 10%. Wells add 2% all-resource income per level, capped at 20%. A festival adds 15% all-resource income for ten minutes, costs 60 gold plus 180 food and has a twenty-minute cooldown. Well and festival percentages add together. Offline income is limited to eight hours and splits correctly at festival expiry and construction completion.

Building costs scale by 1.6 per target level; Keep costs scale by 1.7. Storehouse base cost is 140 gold / 110 timber / 60 stone / 40 food. Troop research starts at 120 gold / 60 timber / 45 stone / 90 food and scales by 1.6 per existing troop level. Ship costs scale by 1.5 per target level. Repair costs 35% of the equivalent ship cost, rounded up per resource, and uses a separate repair timer without losing the ship's level.

All twelve directed resource exchanges are available at the market. Most trade two units for one received; food to stone costs three to one. Allowed received amounts are 50, 100 and 250. Trades validate payment and destination space first. Planting then clearing trees cannot create free timber; clearing an already clear plot is a no-op.

## NPC raids and rewards

NPC raids are started manually in City → Defense. They are not automatic attacks while the player is away. The next raid opens five minutes after settlement. Wave strength is `min(10, 1 + successful defenses)`; the real saved city layout determines defensive buildings and walls. Buildings recover afterward and the home army is preserved.

For each resource, protected stock is `floor(20% × capacity)`. Raid loss is `floor(max(0, stored − protected) × fraction)`, where `fraction = 10% × destruction fraction + 8% if the Keep falls`. A held Keep can therefore still lose some exposed stock if other buildings are destroyed. A completely destroyed, full-stock city loses at most 14.4% of its total stored amount of each resource, equivalent to 18% of the exposed portion.

Holding the Keep pays a capacity-limited bounty: gold `120 + 45 × wave`, timber `35 + 15 × wave`, stone `40 + 20 × wave`, food `30 + 10 × wave`, plus 2 gems. Old saved raids without the new economy version retain the old gold-only loss rule. Completed battles settle only once; replay is read-only.

## Verification and balance boundaries

`verify-balance10.cjs` passes migration conservation, reserve withdrawals, all twelve trades, claims, plot counts, caps, road connectivity and raid theft. `verify-balance-audit10.cjs` passes 521 affordability and transition checks, including the incremental path to upgrade stores from the preceding capacity, all building / ship / repair / troop training / research costs, unfinished stores, covered gardens, clearing, partial raid loss and historical raid compatibility. Four additional action checks reject overlapping ship construction, upgrades and repairs.

The tighter 1.50 store growth curve reduces maximum Keep 10 capacity to 95,265 per resource. The largest individual resource cost is 33,205, giving about 2.9 times headroom with all three stores. A single level 9 store no longer suffices to fund the Keep 10 upgrade; additional storage matters. No tested level 1–10 storage softlock was found. Actual time to accumulate supplies, raid risk versus bounty and maximum-level pacing still need ordinary playtesting.

Buildings, troops, ships, commanders and province development currently stop at level 10. Later ages are described as planned and are not playable content. This reference does not claim multiplayer or automatic offline raids are implemented. New audio has objective clipping, level and loop checks; this runtime could not perform a subjective headphone audition.
