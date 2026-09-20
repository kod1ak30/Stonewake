import * as R from "./rules.mjs";
const defenderFleet = (state) =>
  R.SWNavalShips(state)
    .sort(
      (a, b) =>
        b.level +
          (b.kind === "bombard" ? 2 : 0) -
          (a.level + (a.kind === "bombard" ? 2 : 0)) || (a.id < b.id ? -1 : 1),
    )
    .slice(0, 2)
    .map(({ id, kind, level }) => ({ id, kind, level }));
const resources = ["gold", "wood", "stone", "food"];
const summary = ({ frames, ...result }) => result;
class Fault extends Error {
  constructor(status, code, message, details) {
    super(message);
    Object.assign(this, { status, code, details });
  }
}
const fail = (status, code, message, details) => {
  throw new Fault(status, code, message, details);
};
const cleanAction = (action) => {
  const out = {};
  for (const k of [
    "type",
    "kind",
    "id",
    "name",
    "count",
    "x",
    "y",
    "axis",
    "specialty",
    "gear",
    "slot",
    "resource",
    "amount",
    "payWith",
    "target",
    "shipId",
    "routeId",
    "maxCost",
    "enabled",
    "facing",
    "maxPrice",
    "placementId",
    "choice",
    "tier",
  ])
    if (Object.hasOwn(action, k)) out[k] = action[k];
  if (Array.isArray(action.tiles))
    out.tiles = action.tiles.map((t) => ({ x: t?.x, y: t?.y }));
  if (action.type === "saveLoadout") out.loadout = action.loadout;
  if (action.type === "commitLayout" && Array.isArray(action.actions)) {
    if (action.actions.length > 300) fail(400, "invalid_action", "A layout can contain up to 300 edits.");
    out.actions = action.actions.map(edit => ({type:edit?.type,id:edit?.id,kind:edit?.kind,x:edit?.x,y:edit?.y,facing:edit?.facing}));
  }
  return out;
};
const uuid = (x) => typeof x === "string" && /^[a-zA-Z0-9_-]{8,100}$/.test(x);
const json = (x, status = 200) =>
  Response.json(x, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
async function digest(value) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
  ]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
async function bodyOf(request) {
  const reader = request.body?.getReader();
  if (!reader) return {};
  let size = 0,
    parts = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 2_000_000) {
      await reader.cancel();
      fail(413, "too_large", "That save is too large.");
    }
    parts.push(value);
  }
  try {
    return JSON.parse(new TextDecoder().decode(Buffer.concat(parts)));
  } catch {
    fail(400, "invalid_json", "Invalid request.");
  }
}
function catalog(env) {
  try {
    const out = {};
    for (const [id, raw] of Object.entries(
      JSON.parse(env.PRODUCT_CATALOG || "{}"),
    )) {
      if (!/^com\.chrismozer\.stonewake\.[a-zA-Z0-9._-]+$/.test(id)) continue;
      const item =
        typeof raw === "number" ? { type: "consumable", gems: raw } : raw;
      if (
        item?.type === "consumable" &&
        Number.isSafeInteger(item.gems) &&
        item.gems > 0 &&
        item.gems <= 100000
      )
        out[id] = { type: "consumable", gems: item.gems };
      if (
        item?.type === "nonConsumable" &&
        R.SWPremiumCollections?.some((c) => c.id === item.collectionId)
      )
        out[id] = { type: "nonConsumable", collectionId: item.collectionId };
    }
    return out;
  } catch {
    return {};
  }
}
function assertSave(save) {
  if (
    !save ||
    typeof save !== "object" ||
    save.state?.schema !== 1 ||
    !Number.isSafeInteger(save.state.revision) ||
    !Array.isArray(save.state.buildings) ||
    !save.state.buildings.length
  )
    fail(400, "invalid_save", "This backup is not a Stonewake kingdom.");
}
export function createService({
  verifyAppleIdentity,
  verifyTransaction,
  verifyNotification,
  clock = () => Date.now(),
  onError = () => {},
  beforeFinishCommit = () => {},
}) {
  return {
    async fetch(request, env) {
      const db = env.DB,
        now = clock(),
        path = new URL(request.url).pathname;
      const sql = (query, ...args) => db.prepare(query).bind(...args);
      const guard = () =>
        sql("INSERT INTO mutation_guard(ok) VALUES(changes())");
      async function batch(statements) {
        try {
          return await db.batch([
            ...statements,
            sql("DELETE FROM mutation_guard"),
          ]);
        } catch (error) {
          if (error.message.includes("revoked transaction"))
            fail(
              400,
              "revoked_purchase",
              "This purchase was refunded. No gems were added.",
            );
          if (/CHECK constraint|UNIQUE constraint/.test(error.message))
            fail(
              409,
              "conflict",
              "Your kingdom changed on another device. Refresh and try again.",
            );
          throw error;
        }
      }
      async function accountFor() {
        const token = request.headers
          .get("Authorization")
          ?.replace(/^Bearer /, "");
        if (!token || token.length < 32 || token.length > 200)
          fail(401, "sign_in", "Sign in to continue.");
        const session = await sql(
          "SELECT a.* FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.hash=? AND s.expires_at>?",
          await digest(token),
          now,
        ).first();
        if (!session)
          fail(401, "sign_in", "Sign in again to reconnect your kingdom.");
        return reconcileStore(session);
      }
      const stateOf = (row) => R.Y(JSON.parse(row.state), now);
      const update = (row, state) => {
        state.revision = row.revision + 1;
        return [
          sql(
            "UPDATE accounts SET state=?,revision=revision+1 WHERE id=? AND revision=?",
            JSON.stringify(state),
            row.id,
            row.revision,
          ),
          guard(),
        ];
      };
      async function reconcileStore(row) {
        if (!R.SWGrantCollection || !R.SWRevokeCollection) return row;
        const entitlements = (
          await sql(
            "SELECT * FROM store_entitlements WHERE account_id=? ORDER BY granted_at,original_transaction_id",
            row.id,
          ).all()
        ).results;
        if (!entitlements.length) return row;
        const state = stateOf(row),
          before = JSON.stringify(state.premium);
        for (const entitlement of entitlements) {
          const source =
            "store:" +
            entitlement.environment +
            ":" +
            entitlement.original_transaction_id;
          if (entitlement.revoked_at)
            R.SWRevokeCollection(state, entitlement.collection_id, source);
          else R.SWGrantCollection(state, entitlement.collection_id, source);
        }
        if (JSON.stringify(state.premium) === before) return row;
        await batch(update(row, state));
        return {
          ...row,
          state: JSON.stringify(state),
          revision: state.revision,
        };
      }
      async function revokeTransaction(transaction, notificationID) {
        if (
          transaction.bundleId !== env.APPLE_BUNDLE_ID ||
          transaction.environment !== env.APPLE_ENVIRONMENT ||
          !transaction.transactionId ||
          !Number.isFinite(transaction.revocationDate)
        )
          fail(
            400,
            "invalid_transaction",
            "This revocation is not for this app.",
          );
        const statements = [
          sql(
            "INSERT OR IGNORE INTO revoked_transactions(environment,transaction_id,revoked_at,original_transaction_id) VALUES(?,?,?,?)",
            transaction.environment,
            transaction.transactionId,
            transaction.revocationDate,
            transaction.originalTransactionId || transaction.transactionId,
          ),
        ];
        if (notificationID)
          statements.push(
            sql(
              "INSERT OR IGNORE INTO notification_receipts(id,created_at) VALUES(?,?)",
              notificationID,
              now,
            ),
          );
        await batch(statements);
      }
      async function rate(key, max, period) {
        const row = await sql(
          "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count",
          key,
          now + period,
          now,
          now,
        ).first();
        if (row.count > max)
          fail(429, "slow_down", "Please wait a moment and try again.");
      }
      async function cached(row, id) {
        if (!uuid(id))
          fail(400, "request_id", "A unique request ID is required.");
        const found = await sql(
          "SELECT response FROM requests WHERE account_id=? AND request_id=?",
          row.id,
          id,
        ).first();
        return found ? JSON.parse(found.response) : null;
      }
      const remember = (row, id, result) =>
        sql(
          "INSERT INTO requests(account_id,request_id,response,created_at) VALUES(?,?,?,?)",
          row.id,
          id,
          JSON.stringify(result),
          now,
        );
      async function game(row) {
        const state = stateOf(row);
        if (
          JSON.stringify(state.city?.raidSchedule) !==
          JSON.stringify(JSON.parse(row.state).city?.raidSchedule)
        ) {
          await batch(update(row, state));
          row = {
            ...row,
            revision: row.revision + 1,
            state: JSON.stringify(state),
          };
        }
        const battle = state.activeBattle
          ? await sql(
              "SELECT * FROM battles WHERE id=? AND attacker_id=? AND finished_at IS NULL",
              state.activeBattle,
              row.id,
            ).first()
          : null;
        return {
          state,
          revision: row.revision,
          mode: "online",
          rulesHash: R.RULES_HASH,
          serverTime: now,
          battle: battle
            ? {
                id: battle.id,
                kind: battle.kind,
                input: JSON.parse(battle.input),
                createdAt: battle.started_at,
                commandSeq: battle.command_seq,
              }
            : null,
        };
      }
      try {
        if (request.method === "GET" && path === "/health")
          return json({
            ok: true,
            service: "stonewake",
            rulesHash: R.RULES_HASH,
          });
        if (request.method === "GET" && path === "/v1/catalog")
          return json({
            enabled: env.PURCHASES_ENABLED === "true",
            environment: env.APPLE_ENVIRONMENT,
            products: Object.entries(catalog(env)).map(([id, item]) => ({
              id,
              ...item,
            })),
          });
        if (request.method === "POST" && path === "/v1/auth/challenge") {
          await rate(
            "auth:" +
              (await digest(
                request.headers.get("CF-Connecting-IP") || "local",
              )),
            15,
            60000,
          );
          const id = crypto.randomUUID(),
            nonce = crypto.randomUUID() + crypto.randomUUID();
          await sql(
            "INSERT INTO challenges(id,nonce,expires_at) VALUES(?,?,?)",
            id,
            nonce,
            now + 300000,
          ).run();
          return json({ id, nonce });
        }
        if (request.method === "POST" && path === "/v1/auth/apple") {
          const body = await bodyOf(request),
            challenge = await sql(
              "SELECT * FROM challenges WHERE id=? AND expires_at>?",
              String(body.challengeId || ""),
              now,
            ).first();
          if (!challenge)
            fail(401, "sign_in", "Sign-in expired. Please try again.");
          let claims;
          try {
            claims = await verifyAppleIdentity(
              body.identityToken,
              challenge.nonce,
              env,
            );
          } catch {
            fail(
              401,
              "invalid_identity",
              "Apple sign-in could not be verified.",
            );
          }
          if (typeof claims.sub !== "string" || claims.sub.length > 300)
            fail(
              401,
              "invalid_identity",
              "Apple sign-in could not be verified.",
            );
          let account = await sql(
            "SELECT * FROM accounts WHERE apple_sub=?",
            claims.sub,
          ).first();
          const id = account?.id || crypto.randomUUID(),
            token = crypto.randomUUID() + crypto.randomUUID();
          const commands = [
            sql(
              "DELETE FROM challenges WHERE id=? AND expires_at>?",
              challenge.id,
              now,
            ),
            guard(),
          ];
          if (!account)
            commands.push(
              sql(
                "INSERT INTO accounts(id,apple_sub,state,revision,created_at) VALUES(?,?,?,0,?)",
                id,
                claims.sub,
                JSON.stringify(R.Y(R.Al(now), now)),
                now,
              ),
            );
          commands.push(
            sql(
              "INSERT INTO sessions(hash,account_id,expires_at) VALUES(?,?,?)",
              await digest(token),
              id,
              now + 30 * 86400000,
            ),
          );
          await batch(commands);
          return json({ token, accountId: id, expiresAt: now + 30 * 86400000 });
        }
        if (request.method === "POST" && path === "/v1/store/notifications") {
          const body = await bodyOf(request);
          let notice, transaction;
          try {
            notice = await verifyNotification(body.signedPayload, env);
            if (notice.data?.signedTransactionInfo)
              transaction = await verifyTransaction(
                notice.data.signedTransactionInfo,
                env,
              );
          } catch {
            fail(
              401,
              "invalid_transaction",
              "Notification could not be verified.",
            );
          }
          if (!notice.notificationUUID)
            fail(400, "invalid_notification", "Missing notification ID.");
          if (
            await sql(
              "SELECT id FROM notification_receipts WHERE id=?",
              notice.notificationUUID,
            ).first()
          )
            return json({ ok: true });
          if (transaction?.revocationDate) {
            await revokeTransaction(transaction, notice.notificationUUID);
            return json({ ok: true });
          }
          await sql(
            "INSERT OR IGNORE INTO notification_receipts(id,created_at) VALUES(?,?)",
            notice.notificationUUID,
            now,
          ).run();
          return json({ ok: true });
        }
        const account = await accountFor();
        await rate("user:" + account.id, 180, 60000);
        if (request.method === "GET" && path === "/v1/account") {
          const backup = await sql(
            "SELECT revision,updated_at AS updatedAt FROM backups WHERE account_id=?",
            account.id,
          ).first();
          return json({
            accountId: account.id,
            backup,
            onlineKingdom: true,
            environment: env.APPLE_ENVIRONMENT,
          });
        }
        if (request.method === "POST" && path === "/v1/auth/signout") {
          await sql(
            "DELETE FROM sessions WHERE hash=?",
            await digest(
              request.headers.get("Authorization").replace(/^Bearer /, ""),
            ),
          ).run();
          return json({ ok: true });
        }
        if (request.method === "GET" && path === "/v1/backup") {
          const row = await sql(
            "SELECT payload,revision,updated_at FROM backups WHERE account_id=?",
            account.id,
          ).first();
          if (!row)
            fail(404, "no_backup", "No cloud backup has been saved yet.");
          return json({
            save: JSON.parse(row.payload),
            revision: row.revision,
            updatedAt: row.updated_at,
          });
        }
        if (request.method === "POST" && path === "/v1/backup") {
          const body = await bodyOf(request);
          assertSave(body.save);
          const previous = await sql(
            "SELECT * FROM backups WHERE account_id=?",
            account.id,
          ).first();
          if (body.expectedRevision !== (previous?.revision || 0))
            fail(
              409,
              "backup_conflict",
              "A newer backup exists. Load its details before replacing it.",
              {
                revision: previous?.revision || 0,
                updatedAt: previous?.updated_at,
              },
            );
          const revision = (previous?.revision || 0) + 1,
            statements = [];
          if (previous)
            statements.push(
              sql(
                "INSERT INTO backup_history(id,account_id,payload,revision,created_at) VALUES(?,?,?,?,?)",
                crypto.randomUUID(),
                account.id,
                previous.payload,
                previous.revision,
                now,
              ),
              sql(
                "UPDATE backups SET payload=?,revision=?,updated_at=? WHERE account_id=? AND revision=?",
                JSON.stringify(body.save),
                revision,
                now,
                account.id,
                previous.revision,
              ),
              guard(),
            );
          else
            statements.push(
              sql(
                "INSERT INTO backups(account_id,payload,revision,updated_at) VALUES(?,?,1,?)",
                account.id,
                JSON.stringify(body.save),
                now,
              ),
            );
          statements.push(
            sql(
              "DELETE FROM backup_history WHERE account_id=? AND id NOT IN (SELECT id FROM backup_history WHERE account_id=? ORDER BY created_at DESC LIMIT 10)",
              account.id,
              account.id,
            ),
          );
          await batch(statements);
          return json({ revision, updatedAt: now });
        }
        if (request.method === "GET" && path === "/v1/game")
          return json(await game(account));
        if (request.method === "POST" && path === "/v1/game/actions") {
          const body = await bodyOf(request),
            prior = await cached(account, body.requestId);
          if (prior) return json(prior);
          if (body.revision !== account.revision)
            fail(
              409,
              "conflict",
              "Your kingdom changed. Refresh and try again.",
              await game(account),
            );
          if (!body.action || typeof body.action.type !== "string")
            fail(400, "invalid_action", "Choose a game action.");
          // Deny arbitrary client identity/progression fields. Shared rules validate the action itself.
          if (JSON.stringify(body.action).length > 20000)
            fail(400, "invalid_action", "That action is too large.");
          let state;
          try {
            state = R.Ul(
              JSON.parse(account.state),
              cleanAction(body.action),
              now,
            );
          } catch (error) {
            fail(400, "game_rule", error.message);
          }
          state.revision = account.revision + 1;
          const result = { state, revision: state.revision, serverTime: now };
          await batch([
            ...update(account, state),
            remember(account, body.requestId, result),
          ]);
          return json(result);
        }
        if (request.method === "GET" && path === "/v1/rivals") {
          const state = stateOf(account),
            rows = (
              await sql(
                "SELECT id,state,shield_until FROM accounts WHERE id<>? AND shield_until<=? ORDER BY created_at DESC LIMIT 100",
                account.id,
                now,
              ).all()
            ).results;
          return json({
            rivals: rows
              .map((r) => ({
                id: r.id,
                state: stateOf(r),
                shieldUntil: r.shield_until,
              }))
              .filter(
                (r) =>
                  r.state.published &&
                  !r.state.activeBattle &&
                  Math.abs(R.Ml(r.state) - R.Ml(state)) <= 2,
              )
              .slice(0, 25)
              .map((r) => ({
                id: r.id,
                kind: "player",
                defense: {
                  ...R.Wl(r.state),
                  navalDefense: defenderFleet(r.state),
                },
                name: r.state.name,
                level: R.Ml(r.state),
                rating: r.state.rating,
                shieldUntil: r.shieldUntil,
              })),
            source: "players",
          });
        }
        if (request.method === "POST" && path === "/v1/raids/resolve") {
          const body = await bodyOf(request),
            prior = await cached(account, body.requestId);
          if (prior) return json(prior);
          if (body.revision !== account.revision)
            fail(
              409,
              "conflict",
              "Refresh your kingdom before reviewing the raid.",
            );
          const state = stateOf(account),
            status = R.SWRaidStatus(state, now);
          if (state.activeBattle || status.phase !== "ready")
            fail(409, "raid_not_due", "No scheduled raid is due now.");
          const input = R.SWRaidInput(state, now, true),
            result = summary(R.Kl(input)),
            outcome = R.SWSettleScheduledRaid(state, input, result, now);
          if (!outcome)
            fail(409, "raid_settled", "This raid has already been settled.");
          state.revision = account.revision + 1;
          const report = {
            id: input.raidId,
            kind: "defense",
            defending: true,
            input,
            result,
            reward: outcome.reward,
            loot: outcome.loot,
            lost: outcome.lost,
            defenseReport: outcome.defenseReport,
            createdAt: now,
          };
          const response = {
            state,
            revision: state.revision,
            result,
            outcome,
            report,
            serverTime: now,
          };
          await batch([
            ...update(account, state),
            sql(
              "INSERT INTO reports(id,account_id,payload,created_at) VALUES(?,?,?,?)",
              report.id,
              account.id,
              JSON.stringify(report),
              now,
            ),
            remember(account, body.requestId, response),
          ]);
          return json(response);
        }
        if (request.method === "GET" && path === "/v1/league") {
          const rows = (
              await sql(
                "SELECT id,state FROM accounts ORDER BY created_at LIMIT 500",
              ).all()
            ).results,
            season = R.Pc(now);
          return json({
            season,
            players: rows
              .map((r) => ({ id: r.id, ...JSON.parse(r.state) }))
              .filter((s) => s.published)
              .map((s) => ({
                id: s.id,
                name: s.name,
                rating: s.rating,
                points: s.season?.id === season.id ? s.season.points : 0,
                wins: s.season?.id === season.id ? s.season.wins : 0,
              }))
              .sort((a, b) => b.points - a.points || b.rating - a.rating)
              .slice(0, 50),
          });
        }
        if (request.method === "GET" && path === "/v1/reports") {
          const rows = (
            await sql(
              "SELECT payload FROM reports WHERE account_id=? ORDER BY created_at DESC LIMIT 30",
              account.id,
            ).all()
          ).results;
          return json({ reports: rows.map((r) => JSON.parse(r.payload)) });
        }
        if (request.method === "POST" && path === "/v1/battles/start") {
          const body = await bodyOf(request),
            prior = await cached(account, body.requestId);
          if (prior) return json(prior);
          if (body.revision !== account.revision)
            fail(409, "conflict", "Refresh your kingdom before attacking.");
          const state = stateOf(account);
          if (state.activeBattle)
            fail(409, "battle_active", "Finish your current battle first.");
          const kind = body.kind;
          if (
            !["campaign", "sea", "province", "player", "saga", "trial"].includes(kind)
          )
            fail(
              400,
              "invalid_battle",
              "Choose a campaign, province, or player defense.",
            );
          let expedition = null;
          if (kind === "saga" || kind === "trial") {
            try {
              expedition = R.SWSagaInput(
                state,
                body.missionId,
                kind === "trial" ? body.trialId || true : false,
                now,
              );
            } catch (error) {
              fail(400, "locked", error.message);
            }
          }
          let defense = expedition?.defense,
            defender = null;
          if (kind === "campaign") {
            if (
              !Number.isInteger(body.campaignIndex) ||
              body.campaignIndex < 0 ||
              body.campaignIndex > state.campaign
            )
              fail(400, "locked", "That campaign town is not unlocked.");
            defense = R.Gl(body.campaignIndex);
          }
          if (kind === "sea") {
            const chapter = R.SWSeaChapters14[body.campaignIndex];
            if (!Number.isInteger(body.campaignIndex) || !chapter || body.campaignIndex > state.seaCampaign || R.Ml(state) < chapter.keep) fail(400, "locked", "Complete the earlier sea chapter and its Keep requirement.");
            defense = R.SWSeaDefense14(body.campaignIndex);
          }
          if (kind === "province") {
            const p = R.Ac.find((p) => p.id === body.provinceId);
            if (
              !p ||
              state.provinces?.some((v) => v.id === p.id) ||
              state.campaign < p.campaign ||
              !p.requires.every((id) =>
                state.provinces?.some((v) => v.id === id),
              )
            )
              fail(400, "locked", "That province cannot be attacked.");
            defense = R.Jc(p.id);
          }
          if (kind === "player") {
            if (body.targetId === account.id)
              fail(400, "invalid_target", "Choose another kingdom.");
            defender = await sql(
              "SELECT * FROM accounts WHERE id=?",
              String(body.targetId || ""),
            ).first();
            if (!defender)
              fail(404, "no_target", "That kingdom is no longer available.");
            const enemy = stateOf(defender);
            if (
              !enemy.published ||
              enemy.activeBattle ||
              defender.shield_until > now ||
              Math.abs(R.Ml(enemy) - R.Ml(state)) > 2
            )
              fail(
                409,
                "shielded",
                "That kingdom is not available for attack.",
              );
            defense = { ...R.Wl(enemy), navalDefense: defenderFleet(enemy) };
          }
          if (!defense?.buildings?.length)
            fail(400, "invalid_target", "No defense is available.");
          const modern = body.combatVersion === 14 || kind === "sea";
          if (modern && !expedition && Object.keys(body.army || {}).some(k=>!Object.hasOwn(R.J,k))) fail(400,"invalid_army","Unknown troop type.");
          const army = expedition?.army || R.wl();
          for (const k of expedition ? [] : Object.keys(army)) {
            const qty = body.army?.[k] || 0;
            if (!Number.isInteger(qty) || qty < 0 || qty > state.army[k])
              fail(
                400,
                "invalid_army",
                "Choose troops available in your army.",
              );
            army[k] = qty;
          }
          if (!R.Nl(army)) fail(400, "no_army", "Choose at least one troop.");
          const ship =
            !modern && !expedition && body.navalShipId
              ? R.SWNavalShips(state).find((s) => s.id === body.navalShipId)
              : null;
          if (!modern && !expedition && body.navalShipId && !ship)
            fail(400, "ship_busy", "That ship is not ready.");
          const id = crypto.randomUUID(),
            input = expedition || (modern ? (()=>{try{return R.SWCreateBattle14(state,{kind,campaignIndex:body.campaignIndex,provinceId:body.provinceId,defense},{army,fleet:body.fleet},crypto.getRandomValues(new Uint32Array(1))[0])}catch(error){fail(400,"invalid_army",error.message)}})() : {
              defense,
              army,
              orders: [],
              bonus: R.Hl(state),
              front: "center",
              rulesVersion: 4,
              combatVersion: 12,
              presentationVersion: 12,
              healerTacticsVersion: 1,
              troopAbilitiesVersion: 1,
              navalVersion: 3,
              unitLevels: state.unitLevels || {},
              commander: R.Gc(state),
              enemyNavy:
                kind === "player"
                  ? defense.navalDefense
                  : R.SWEnemyNavy(defense),
              seed: crypto.getRandomValues(new Uint32Array(1))[0],
              campaignIndex: body.campaignIndex,
              provinceId: body.provinceId,
            });
          input.campaignIndex = body.campaignIndex;
          input.provinceId = body.provinceId;
          if (ship)
            input.navalSupport = {
              id: ship.id,
              kind: ship.kind,
              level: ship.level,
            };
          if (!expedition)
            for (const k of Object.keys(army)) state.army[k] -= army[k];
          state.activeBattle = id;
          if (ship) ship.combatBattleId = id;
          for (const vessel of input.fleet14 || []) state.fleet.find(s=>s.id===vessel.id).combatBattleId=id;
          state.revision = account.revision + 1;
          const battle = { id, kind, input, createdAt: now, commandSeq: 0 },
            result = {
              state,
              revision: state.revision,
              battle,
              serverTime: now,
            };
          const statements = [
            ...update(account, state),
            sql(
              "INSERT INTO battles(id,attacker_id,defender_id,kind,input,started_at) VALUES(?,?,?,?,?,?)",
              id,
              account.id,
              defender?.id || null,
              kind,
              JSON.stringify(input),
              now,
            ),
            remember(account, body.requestId, result),
          ];
          // Starting a raid temporarily reserves the target, preventing simultaneous looting.
          if (defender)
            statements.push(
              sql(
                "UPDATE accounts SET shield_until=? WHERE id=? AND revision=? AND shield_until<=?",
                now + 180000,
                defender.id,
                defender.revision,
                now,
              ),
              guard(),
            );
          await batch(statements);
          return json(result);
        }
        if (request.method === "POST" && path === "/v1/battles/commands") {
          const body = await bodyOf(request),
            prior = await cached(account, body.requestId);
          if (prior) return json(prior);
          const battle = await sql(
            "SELECT * FROM battles WHERE id=? AND attacker_id=? AND finished_at IS NULL",
            String(body.battleId || ""),
            account.id,
          ).first();
          if (!battle) fail(404, "no_battle", "No active battle found.");
          if (body.commandSeq !== battle.command_seq)
            fail(
              409,
              "command_conflict",
              "Refresh the battle before issuing another order.",
            );
          const input = JSON.parse(battle.input),
            elapsed = Math.min(
              119.5,
              Math.max(0, (now - battle.started_at) / 1000),
            ),
            time = Math.floor(elapsed * 2) / 2;
          if (elapsed >= 119.5)
            fail(
              409,
              "battle_complete",
              "The battle has ended. View its result.",
            );
          if (input.saga?.mode === "hold")
            fail(
              400,
              "automatic_defense",
              "Your defenses fight this mission automatically.",
            );
          const commands = body.commands || [body.command];
          if (
            !Array.isArray(commands) ||
            !commands.length ||
            commands.length > 20
          )
            fail(
              400,
              "invalid_order",
              "Send between 1 and 20 battle commands.",
            );
          for (const command of commands) {
            if (command?.type === "deploy") {
              const orders = [
                ...input.orders,
                { kind: command.kind, x: command.x, y: command.y, time, ...(input.campaignType === "sea" ? {shipId:command.shipId} : {}) },
              ];
              try {
                input.orders = R.SWOrders14(input, orders);
              } catch (error) {
                fail(400, "invalid_order", error.message);
              }
            } else if (command?.type === "ship") {
              if (input.navalVersion !== 4) fail(400,"invalid_order","This battle has no commandable fleet.");
              const order={...command.order,time};
              if(order.type==="ability"&&(input.shipOrders14||[]).some(o=>o.shipId===order.shipId&&o.type==="ability")) fail(400,"already_used","This ship ability has already been used.");
              try { input.shipOrders14=R.SWValidateShipOrders14(input,[...(input.shipOrders14||[]),order]); }
              catch(error){fail(400,"invalid_order",error.message)}
            } else if (command?.type === "rally") {
              if (input.rallyAt !== undefined)
                fail(400, "already_used", "Rally has already been used.");
              input.rallyAt = time;
            } else if (command?.type === "ability") {
              if (input.heroAt !== undefined)
                fail(
                  400,
                  "already_used",
                  "This ability has already been used.",
                );
              input.heroAt = time;
            } else fail(400, "invalid_order", "Choose a valid battle order.");
          }
          const result = {
            input,
            commandSeq: battle.command_seq + commands.length,
            serverTime: now,
          };
          await batch([
            sql(
              "UPDATE battles SET input=?,command_seq=command_seq+? WHERE id=? AND command_seq=? AND finished_at IS NULL",
              JSON.stringify(input),
              commands.length,
              battle.id,
              battle.command_seq,
            ),
            guard(),
            remember(account, body.requestId, result),
          ]);
          return json(result);
        }
        if (request.method === "POST" && path === "/v1/battles/finish") {
          const body = await bodyOf(request),
            battle = await sql(
              "SELECT * FROM battles WHERE id=? AND attacker_id=?",
              String(body.battleId || ""),
              account.id,
            ).first();
          if (!battle) fail(404, "no_battle", "No active battle found.");
          if (battle.response) return json(JSON.parse(battle.response));
          const state = stateOf(account);
          if (state.activeBattle !== battle.id)
            fail(409, "no_battle", "This battle is no longer active.");
          const input = JSON.parse(battle.input),
            elapsed = Math.max(0, (now - battle.started_at) / 1000);
          if (body.retreat === true)
            input.retreatAt = Math.min(120, Math.floor(elapsed * 2) / 2);
          const result = summary(R.Kl(input));
          if (elapsed + 1 < result.duration)
            fail(409, "battle_running", "The battle is still in progress.");
          const returned = input.saga
            ? {}
            : R.Jl(input.army, result.survivors, 0.45);
          for (const k of Object.keys(state.army))
            state.army[k] += returned[k] || 0;
          if (!input.saga) for (const vessel of input.fleet14 || (input.navalSupport ? [input.navalSupport] : [])) {
            const ship=state.fleet.find(s=>s.id===vessel.id);
            if(ship){delete ship.combatBattleId;if(result.navalSurvivors?.[ship.id]===false)ship.wrecked=true;}
          }
          let reward,
            defender = null,
            enemy = null;
          const before = { ...state.resources };
          let sagaOutcome = null;
          if (input.saga) {
            sagaOutcome = R.SWSagaSettle(state, input, result, now);
            reward = sagaOutcome.reward;
          } else
            reward = R.Fu(
              state,
              battle.kind,
              input.campaignIndex,
              input,
              result,
              true,
              now,
            );
          if (battle.defender_id) {
            defender = await sql(
              "SELECT * FROM accounts WHERE id=?",
              battle.defender_id,
            ).first();
            enemy = stateOf(defender);
            state.resources = before;
            const available = R.SWRaidLoot(enemy, result);
            reward = Object.fromEntries(
              resources.map((k) => [
                k,
                Math.min(
                  available[k],
                  Math.max(
                    0,
                    Math.floor(R.SWCapacity(state) - state.resources[k] + 1e-6),
                  ),
                ),
              ]),
            );
            for (const k of resources) {
              state.resources[k] += reward[k];
              enemy.resources[k] -= reward[k];
            }
          }
          state.activeBattle = null;
          state.revision = account.revision + 1;
          const report = {
            id: battle.id,
            kind: battle.kind,
            input,
            result,
            reward,
            createdAt: now,
            opponent: input.defense.name,
            ...(input.saga
              ? { saga: sagaOutcome, defending: input.saga.mode === "hold" }
              : {}),
          };
          const response = {
              state,
              revision: state.revision,
              result,
              reward,
              report,
              ...(sagaOutcome ? { saga: sagaOutcome } : {}),
              serverTime: now,
            },
            statements = [
              ...update(account, state),
              sql(
                "UPDATE battles SET input=?,finished_at=?,response=? WHERE id=? AND finished_at IS NULL AND command_seq=?",
                JSON.stringify(input),
                now,
                JSON.stringify(response),
                battle.id,
                battle.command_seq,
              ),
              guard(),
              sql(
                "INSERT INTO reports(id,account_id,payload,created_at) VALUES(?,?,?,?)",
                battle.id,
                account.id,
                JSON.stringify(report),
                now,
              ),
            ];
          if (defender) {
            const lost = { ...reward },
              defenseReport = {
                ...report,
                kind: "defense",
                defending: true,
                opponent: state.name,
                loot: lost,
                lost: Object.values(lost).reduce((a, b) => a + b, 0),
                reward: Object.fromEntries(resources.map((k) => [k, 0])),
              };
            statements.push(
              ...update(defender, enemy),
              sql(
                "UPDATE accounts SET shield_until=? WHERE id=?",
                now + 7200000,
                defender.id,
              ),
              sql(
                "INSERT INTO reports(id,account_id,payload,created_at) VALUES(?,?,?,?)",
                battle.id,
                defender.id,
                JSON.stringify(defenseReport),
                now,
              ),
            );
          }
          await beforeFinishCommit(battle.id);
          await batch(statements);
          return json(response);
        }
        if (request.method === "POST" && path === "/v1/store/verify") {
          if (env.PURCHASES_ENABLED !== "true")
            fail(503, "store_unavailable", "Purchases are not connected yet.");
          const body = await bodyOf(request);
          let tx;
          try {
            tx = await verifyTransaction(body.jws, env);
          } catch {
            fail(
              400,
              "invalid_transaction",
              "Apple could not verify this purchase. Nothing was granted.",
            );
          }
          const item = catalog(env)[tx.productId];
          if (
            !item ||
            tx.appAccountToken?.toLowerCase() !== account.id.toLowerCase() ||
            tx.bundleId !== env.APPLE_BUNDLE_ID ||
            tx.environment !== env.APPLE_ENVIRONMENT ||
            tx.type !==
              (item.type === "nonConsumable"
                ? "Non-Consumable"
                : "Consumable") ||
            !tx.transactionId ||
            (item.type === "consumable"
              ? tx.quantity !== 1
              : tx.quantity !== undefined && tx.quantity !== 1)
          )
            fail(
              400,
              "invalid_transaction",
              "This purchase does not belong to this account or is not eligible.",
            );
          const original = tx.originalTransactionId || tx.transactionId;
          if (tx.revocationDate) {
            await revokeTransaction(tx);
            const refreshed = await reconcileStore(
              await sql(
                "SELECT * FROM accounts WHERE id=?",
                account.id,
              ).first(),
            );
            return json({ status: "revoked", game: await game(refreshed) });
          }
          if (
            await sql(
              "SELECT transaction_id FROM revoked_transactions WHERE environment=? AND (transaction_id=? OR transaction_id=? OR original_transaction_id=?)",
              tx.environment,
              tx.transactionId,
              original,
              original,
            ).first()
          )
            fail(
              400,
              "revoked_purchase",
              "This purchase was refunded. Nothing was granted.",
            );
          const prior = await sql(
            "SELECT * FROM purchases WHERE environment=? AND transaction_id=?",
            tx.environment,
            tx.transactionId,
          ).first();
          if (prior) {
            if (prior.account_id !== account.id)
              fail(
                409,
                "purchase_owner",
                "This purchase belongs to a different account.",
              );
            if (prior.revoked_at)
              fail(400, "revoked_purchase", "This purchase was refunded.");
            return json({
              status: "granted",
              duplicate: true,
              game: await game(account),
            });
          }
          const entitlement =
            item.type === "nonConsumable"
              ? await sql(
                  "SELECT * FROM store_entitlements WHERE environment=? AND original_transaction_id=?",
                  tx.environment,
                  original,
                ).first()
              : null;
          if (
            entitlement &&
            (entitlement.account_id !== account.id ||
              entitlement.collection_id !== item.collectionId)
          )
            fail(
              409,
              "purchase_owner",
              "This collection belongs to a different account.",
            );
          if (entitlement?.revoked_at)
            fail(400, "revoked_purchase", "This collection was refunded.");
          const state = stateOf(account),
            amount = item.gems || 0,
            debt = Math.min(state.gemDebt || 0, amount);
          state.gemDebt = (state.gemDebt || 0) - debt;
          state.gems += amount - debt;
          if (item.type === "nonConsumable")
            R.SWGrantCollection(
              state,
              item.collectionId,
              "store:" + tx.environment + ":" + original,
            );
          const statements = [
            ...update(account, state),
            sql(
              "INSERT INTO purchases(environment,transaction_id,account_id,product_id,gems,purchased_at,product_type,collection_id,original_transaction_id) VALUES(?,?,?,?,?,?,?,?,?)",
              tx.environment,
              tx.transactionId,
              account.id,
              tx.productId,
              amount,
              tx.purchaseDate || now,
              item.type,
              item.collectionId || null,
              original,
            ),
          ];
          if (item.type === "nonConsumable" && !entitlement)
            statements.push(
              sql(
                "INSERT INTO store_entitlements(environment,original_transaction_id,account_id,collection_id,granted_at) VALUES(?,?,?,?,?)",
                tx.environment,
                original,
                account.id,
                item.collectionId,
                now,
              ),
            );
          await batch(statements);
          return json({
            status: "granted",
            duplicate: !!entitlement,
            gems: amount - debt,
            collectionId: item.collectionId,
            game: { state, revision: state.revision, serverTime: now },
            environment: tx.environment,
          });
        }

        fail(404, "not_found", "That service is not available.");
      } catch (error) {
        if (error instanceof Fault)
          return json(
            {
              error: {
                code: error.code,
                message: error.message,
                details: error.details,
              },
            },
            error.status,
          );
        onError(error);
        console.error(
          JSON.stringify({ event: "request_failed", path, error: error.name }),
        );
        return json(
          {
            error: {
              code: "unavailable",
              message:
                "The service is temporarily unavailable. Your progress is safe.",
            },
          },
          503,
        );
      }
    },
  };
}
