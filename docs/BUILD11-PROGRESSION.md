# Build 11 progression and defense checks

The playable cap remains Keep 10. This update adds no post-medieval age content.

## Civic districts

Each district upgrades an existing building site through three visible stages. District construction pays the shown four-resource cost, occupies a normal construction crew, and grants its permanent benefit only after the timer completes. Its one-time celebration grants 5, 10 or 15 gems for stages 1, 2 or 3. Starting the next stage requires collecting the previous celebration. Moving the anchor building moves its district details without purchasing another footprint.

| District | Keep gates | Main requirements | Permanent benefits by stage |
|---|---|---|---|
| Market square | 2 / 4 / 7 | Market level 1 / 2 / 4; 2 / 6 / 10 connected roads; 1 / 5 / 15 fulfilled requests | Gold production +5 / 10 / 15% |
| Working waterfront | 3 / 5 / 8 | Shipyard level 2 / 3 / 5; 1 / 2 / 3 completed vessels | Voyages 5 / 10 / 15% faster; repairs 10 / 20 / 30% faster |
| Residential quarter | 2 / 4 / 7 | Cottage level 1 / 2 / 4; 1 / 2 / 3 cottages; well level 1 / 1 / 2 | Construction 5 / 10 / 15% faster; 12 / 24 / 36 residents |
| Public gardens | 2 / 4 / 6 | Well level 1 / 2 / 3; 1 / 3 / 5 gardens; 2 / 6 / 10 connected roads | Food production +5 / 10 / 15%; festivals last 2 / 4 / 6 minutes longer |

The new City menu links unmet requirements directly to the relevant building, fleet, resident or land-planning action.

## Warned computer raids

Computer raids begin at Keep 3. Existing eligible saves and newly eligible villages get an initial twenty-minute shield, followed by a five-minute warning. Completing a raid grants a two-hour shield before the next warning. A long absence resolves at most one overdue raid when the player returns, and never stacks missed raids. Settlement waits until the current battle is finished. Local raids resolve on-device; connected online raids resolve through the service.

Wave strength is capped at ten and uses Keep level plus prior successful defenses. The real layout is simulated. The existing storage protection remains: 20% of capacity is protected; losses are at most 18% of the exposed amount. Gems and reserve crates cannot be stolen. Buildings and the home army recover after defending. A held Keep earns the existing bounded bounty and two gems.

Reports record actual tower damage, wall damage absorbed, defeated attackers and the aggregate time attackers spent engaging walls. Wall time is a sum of attacker-seconds, not a hypothetical estimate of extra time the city would otherwise have lost. Replays and repeated settlement do not grant another reward.

## Combat balance repairs

New snapshots use combat version 11. Mortars, bomb towers and flame defenses now apply their declared splash radius to nearby ground enemies at 55% of primary damage. Dispersing a six-unit group reduced early damage substantially in a controlled seeded test: mortar 172.8 to 71.4, bomb tower 124.2 to 51.3, and flame 145.8 to 60.3. These are test-scene totals, not a promise about every formation.

New pathfinding uses the actual map bounds. A Keep on tile 17,17 is reachable in the new rules; the historical fixed boundary stopped attackers at tile 14. Saved inputs without the new version retain their original replay result.

## Pacing simulation and limits

`scripts/simulate-progression11.cjs` starts two fresh free-to-play kingdoms, pays every building, recruitment, research and civic cost, runs actual seeded campaign battles, collects earned rewards and resolves scheduled raids. It injects no currency or free upgrades. Both the growth and civic policies reach Keep 10 without a resource-capacity deadlock or spending gems.

The policies deliberately complete extensive economy and army upgrades in sequence, making them conservative routes rather than estimates of a skilled player's minimum time. Results and resource spending, overflow, raid losses and milestone times are saved in the review folder's `progression.json`. A deterministic simulation does not replace ordinary human playtesting. Fully upgraded large armies still outperform the campaign; idle production can reach the storage cap. These remain pacing observations to assess in device play, rather than claims of perfect long-term balance.

`verify-civic-raids11.cjs` passes 169 assertions on all twelve district stages, exact costs and reward amounts, shared crews, completion boundaries, warning/shield timing, bounded catch-up raids, duplicate settlement, measured reports and unchanged combat outcomes when telemetry alone is enabled. `verify-splash11.cjs` checks the three area defenses, dispersed deployment, determinism and outer-map reachability. Existing storage/cap/trade, 521 affordability, legacy replay, medic, naval duel, sinking, repair and save-flow checks also pass.
