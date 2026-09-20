# Online bridge and service contract

All calls are opt-in. An online kingdom is server-created and separate from the existing local kingdom. Backups of the local kingdom are untrusted storage and never grant online resources.

`SWOnline.call(method,payload)` returns JSON or rejects with `error.code`, `error.message`, and optional `error.details`. `SWOnline.request(path,{method,body})` uses the same native bridge. The token stays in the Keychain. `SWOnline.state()` and event `stonewake-online-status` expose configured, signedIn, accountId, backup, products, onlineKingdom, status, message, busy. Only localized StoreKit products are shown.

Native methods:

- `status`, `signIn`, `signOut`, `products`.
- `products` returns `{products:[{id,type,name,description,displayPrice,gems?,collectionId?}]}`. Type is `consumable` or `nonConsumable`; all display prices come from StoreKit.
- `purchase {productId}` returns `{status:'granted',game}` or `{status:'pending'|'cancelled'}`. A signed revocation returns `{status:'revoked',game}`. `restorePurchases` retries unfinished consumables and verifies current non-consumable entitlements with the server, returning `{status:'checked',game}`. Event `stonewake-online-purchase` provides `{game}` for background-delivered purchases and revocations. Local StoreKit data never grants game ownership.
- `backup {save:envelope,expectedRevision:number}` returns `{revision,updatedAt}`. Conflict code `backup_conflict`, details `{revision,updatedAt}`. No overwrite on conflict.
- `restoreBackup {}` returns `{save:envelope,revision,updatedAt}`. Merely fetches; never applies automatically.
- `archiveLocal {save:envelope}` validates and atomically writes a versioned native archive, keeps the newest ten. Returns `{saved:true}`. Works while service is unconfigured/offline. Await before replacing local progress.
- `cacheOnline {game}` saves a read-only server snapshot bound to current account; `{saved:true}`. `getOnlineCache {}` returns `{accountId,game,cachedAt}` or `{}`. Cached data never becomes an authoritative action or upload.

HTTP service via `SWOnline.request`:

| Method/path | Request | Response |
|---|---|---|
| GET `/v1/game` | none | `{state,revision,mode:'online',rulesHash,serverTime,battle}` |
| POST `/v1/game/actions` | `{requestId,revision,action}` | `{state,revision,serverTime}` |
| GET `/v1/rivals` | none | `{rivals:[{id,kind:'player',defense,name,level,rating,shieldUntil}],source:'players'}` |
| GET `/v1/reports` | none | `{reports:[...]}` |
| GET `/v1/league` | none | `{season,players:[{id,name,rating,points,wins}]}` |
| POST `/v1/battles/start` | `{requestId,revision,kind,campaignIndex?,provinceId?,targetId?,army,navalShipId?}` | `{state,revision,battle,serverTime}` |
| POST `/v1/battles/commands` | `{requestId,battleId,commandSeq,commands:[...]}` or singular `command` | `{input,commandSeq,serverTime}` |
| POST `/v1/battles/finish` | `{battleId,retreat?:true}` | `{state,revision,result,reward,report,serverTime}` |

A `battle` is `{id,kind,input,createdAt,commandSeq}`. Null means no active battle. Server `revision` must accompany mutations, not a locally ticked revision. Request IDs must be unique 8-100 character alphanumeric/hyphen/underscore strings; UUIDs work. Reusing a committed ID returns the original response without reapplying.

Command batches accept 1-20 commands. Each is `{type:'deploy',kind,x,y}`, `{type:'rally'}`, or `{type:'ability'}`. The server assigns the same current half-second time to every command in one batch. A successful batch increases sequence by its command count. Validation is atomic: a failed batch applies nothing and does not consume sequence. A retry with the same request ID returns its original acknowledgment. The client should serialize batches, reconcile acknowledged input, and drain before finish. Rally and ability can each occur only once. The server stores ability as `heroAt`, matching the engine. Late/backdated client timestamps are ignored.

Finish is rejected while the authoritative simulation duration exceeds actual elapsed time. Retreat uses current server time. Repeating a finish returns exactly the saved settlement. The server computes result and naval losses; supplied client results are ignored. Player loot debits the defender by exactly the amount credited to the attacker after storage limits. Defender receives a report and two-hour shield. Starting a raid also reserves its target for three minutes.

The local save file must never receive online state. Returning to the local kingdom reloads that original envelope. Cached online view is read-only when disconnected.

Scheduled raids: POST `/v1/raids/resolve` `{requestId,revision}` returns `{state,revision,result,outcome,report,serverTime}`. Only a due scheduled raid with no active player battle can settle. Duplicate request IDs are idempotent. Result objects from service settlement omit render `frames`; use immutable `report.input` to regenerate replays.

Player scout defenses include `navalDefense:[{id,kind,level}]`: at most two strongest available completed owned warships. Voyage cargo must be collected; ships being built, repaired, reserved or wrecked are excluded. Empty means no defending fleet. NPC patrol generation is unchanged. Defending ships recover like the base; the attacking selected ship can become a persistent repairable wreck.

Build 12 adds `kind:'saga'|'trial'` starts with `missionId` and optional `trialId`. The server generates the fixed expedition; supplied army, ship, commander, bonus and seed are ignored. Only `activeBattle` is reserved. Home troops and ships are not spent, returned or wrecked. A hold mission fights automatically and rejects all command batches. Settlement includes `saga:{won,firstClear,missionId?|trialId?,reward}` in its response and report. Home defense reports carry `defending:true`. The engine's actual objective determines victory. Mission reward claims are separate one-time actions; mastery gems are settled once.

Added game actions: `buyCosmetic {id,maxPrice}`, `equipCosmetic {id}`, `placeOrnament {id,x,y,facing}`, `removeOrnament {placementId}`, `advanceMission {id}`, `claimMission {id}`, `claimChapter {}`, `startResidentStory {id,choice}`, `claimResidentStory {id}`, `claimEvent {id,tier}`, `dismissScene {id}`. The action `type` accompanies those fields. The server validates unlocks, ownership, prices, story timers and claim state using exported shared rules.
