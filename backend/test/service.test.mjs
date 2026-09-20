import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Miniflare } from "miniflare";
import { createService } from "../src/service.mjs";
import * as R from "../src/rules.mjs";
let beforeFinishCommit = async () => {};
let mf,
  db,
  now = 1_800_000_000_000,
  claims = {};
const env = {
  APPLE_BUNDLE_ID: "com.chrismozer.stonewake",
  APPLE_ENVIRONMENT: "Sandbox",
  PURCHASES_ENABLED: "true",
  PRODUCT_CATALOG: '{"com.chrismozer.stonewake.gems250":250}',
};
const service = createService({
  beforeFinishCommit: (id) => beforeFinishCommit(id),
  onError: (e) => console.error(e.stack),
  clock: () => now,
  verifyAppleIdentity: async (token, nonce) => {
    if (token !== "test:" + nonce) throw Error("bad signature");
    return { sub: claims.sub };
  },
  verifyTransaction: async (jws) => {
    if (jws !== "test-signed-transaction") throw Error("bad signature");
    return claims.tx;
  },
  verifyNotification: async () => claims.notice,
});
async function req(path, body, token) {
  const response = await service.fetch(
    new Request("https://service.test" + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        ...(token ? { Authorization: "Bearer " + token } : {}),
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
    { ...env, DB: db },
  );
  return { status: response.status, ...(await response.json()) };
}
async function login(sub) {
  claims.sub = sub;
  const nonce = await req("/v1/auth/challenge", {});
  const result = await req("/v1/auth/apple", {
    challengeId: nonce.id,
    identityToken: "test:" + nonce.nonce,
  });
  assert.equal(result.status, 200, JSON.stringify(result));
  return result;
}
before(async () => {
  mf = new Miniflare({
    modules: true,
    script: 'export default {fetch(){return new Response("ok")}}',
    d1Databases: { DB: "test" },
  });
  db = await mf.getD1Database("DB");
  const schema = await readFile(
    new URL("../migrations/0001_accounts.sql", import.meta.url),
    "utf8",
  );
  for (const sql of schema
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean))
    await db.prepare(sql).run();
  const refundSchema = await readFile(
    new URL("../migrations/0002_refund_tombstones.sql", import.meta.url),
    "utf8",
  );
  for (const statement of refundSchema.match(
    /CREATE TABLE[^;]*;|CREATE TRIGGER[\s\S]*?END;/g,
  ))
    await db.prepare(statement).run();
  const cosmeticSchema = await readFile(
    new URL("../migrations/0003_cosmetic_entitlements.sql", import.meta.url),
    "utf8",
  );
  for (const statement of cosmeticSchema.match(
    /CREATE TRIGGER[\s\S]*?END;|(?:ALTER TABLE|DROP TRIGGER|CREATE (?:TABLE|UNIQUE INDEX|INDEX))[^;]*;/g,
  ))
    await db.prepare(statement).run();
});
after(async () => {
  await mf.dispose();
});
test("real D1: account nonce, cloud backup conflicts, actions, purchase dedup and authoritative battles", async () => {
  const a = await login("player-a"),
    b = await login("player-b");
  assert.equal((await req("/v1/game")).status, 401);
  const once = await req("/v1/auth/challenge", {});
  claims.sub = "nonce-user";
  assert.equal(
    (
      await req("/v1/auth/apple", {
        challengeId: once.id,
        identityToken: "test:" + once.nonce,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await req("/v1/auth/apple", {
        challengeId: once.id,
        identityToken: "test:" + once.nonce,
      })
    ).status,
    401,
  );
  const game = await req("/v1/game", undefined, a.token);
  assert.equal(game.state.name, "Havencrest");
  const backup = { state: { ...game.state, gems: 999999 }, reports: [] };
  let saved = await req(
    "/v1/backup",
    { save: backup, expectedRevision: 0 },
    a.token,
  );
  assert.equal(saved.revision, 1);
  assert.equal(
    (await req("/v1/game", undefined, a.token)).state.gems,
    100,
    "untrusted backup changed competitive economy",
  );
  assert.equal(
    (await req("/v1/backup", { save: backup, expectedRevision: 0 }, a.token))
      .status,
    409,
  );
  assert.deepEqual((await req("/v1/backup", undefined, a.token)).save, backup);
  let action = await req(
    "/v1/game/actions",
    {
      requestId: "build-barracks-1",
      revision: 0,
      action: { type: "build", kind: "barracks", x: 5, y: 6 },
    },
    a.token,
  );
  assert.equal(action.status, 200, JSON.stringify(action));
  assert.deepEqual(
    await req(
      "/v1/game/actions",
      {
        requestId: "build-barracks-1",
        revision: 0,
        action: { type: "build", kind: "barracks", x: 5, y: 6 },
      },
      a.token,
    ),
    action,
  );
  assert.equal(
    (
      await req(
        "/v1/game/actions",
        {
          requestId: "stale-build-2",
          revision: 0,
          action: { type: "build", kind: "tower", x: 5, y: 7 },
        },
        a.token,
      )
    ).status,
    409,
  );
  claims.tx = {
    productId: "com.chrismozer.stonewake.gems250",
    appAccountToken: a.accountId,
    bundleId: env.APPLE_BUNDLE_ID,
    environment: "Sandbox",
    type: "Consumable",
    transactionId: "test-transaction-1",
    quantity: 1,
    purchaseDate: now,
  };
  assert.equal(
    (await req("/v1/store/verify", { jws: "forged" }, a.token)).status,
    400,
  );
  assert.equal(
    (await req("/v1/store/verify", { jws: "test-signed-transaction" }, b.token))
      .status,
    400,
  );
  const paid = await req(
    "/v1/store/verify",
    { jws: "test-signed-transaction" },
    a.token,
  );
  assert.equal(paid.status, "granted");
  assert.equal(paid.game.state.gems, 350);
  const duplicate = await req(
    "/v1/store/verify",
    { jws: "test-signed-transaction" },
    a.token,
  );
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.game.state.gems, 350);
  // Test fixtures seed two DB-owned armies, never a client import endpoint.
  for (const user of [a, b]) {
    const state = R.Y(R.Al(now), now);
    state.army.infantry = 6;
    state.published = true;
    await db
      .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
      .bind(JSON.stringify(state), user.accountId)
      .run();
  }
  let rivals = await req("/v1/rivals", undefined, a.token);
  assert.equal(rivals.rivals.length, 1);
  assert.equal(rivals.rivals[0].id, b.accountId);
  const start = await req(
    "/v1/battles/start",
    {
      requestId: "battle-start-1",
      revision: 0,
      kind: "player",
      targetId: b.accountId,
      army: { infantry: 6 },
    },
    a.token,
  );
  assert.equal(start.status, 200, JSON.stringify(start));
  assert.equal(start.state.army.infantry, 0);
  assert.equal(start.battle.input.navalVersion, 3);
  assert.deepEqual(
    start.battle.input.enemyNavy,
    [],
    "a player without warships received a fabricated fleet",
  );
  assert.equal(
    (await req("/v1/game", undefined, a.token)).battle.id,
    start.battle.id,
  );
  const input = start.battle.input,
    x = Math.min(...input.defense.buildings.map((x) => x.x)) - 2,
    y = 3;
  let command = await req(
    "/v1/battles/commands",
    {
      requestId: "command-deploy-1",
      battleId: start.battle.id,
      commandSeq: 0,
      command: { type: "deploy", kind: "infantry", x, y, time: 99 },
    },
    a.token,
  );
  assert.equal(command.status, 200, JSON.stringify(command));
  assert.equal(
    command.input.orders[0].time,
    0,
    "client forged deployment time",
  );
  const failedBatch = await req(
    "/v1/battles/commands",
    {
      requestId: "bad-batch-commands",
      battleId: start.battle.id,
      commandSeq: 1,
      commands: [{ type: "rally" }, { type: "bad" }],
    },
    a.token,
  );
  assert.equal(failedBatch.status, 400);
  const noChange = await req("/v1/game", undefined, a.token);
  assert.equal(noChange.battle.commandSeq, 1);
  assert.equal(noChange.battle.input.rallyAt, undefined);
  const batch = await req(
    "/v1/battles/commands",
    {
      requestId: "good-batch-command",
      battleId: start.battle.id,
      commandSeq: 1,
      commands: [{ type: "rally" }, { type: "ability" }],
    },
    a.token,
  );
  assert.equal(batch.commandSeq, 3);
  assert.equal(batch.input.heroAt, 0);
  assert.equal(
    (
      await req(
        "/v1/battles/finish",
        { battleId: start.battle.id, result: { won: true, destruction: 100 } },
        a.token,
      )
    ).status,
    409,
  );
  now += 130000;
  const ended = await req(
    "/v1/battles/finish",
    { battleId: start.battle.id, result: { won: true, destruction: 100 } },
    a.token,
  );
  assert.equal(ended.status, 200, JSON.stringify(ended));
  assert.equal(ended.result.won, false, "client forged outcome");
  assert.equal(ended.state.activeBattle, null);
  assert.equal(ended.state.army.infantry, 5, "undeployed reserves lost");
  const again = await req(
    "/v1/battles/finish",
    { battleId: start.battle.id },
    a.token,
  );
  assert.deepEqual(again, ended, "duplicate settlement changed");
  assert.equal(
    (await req("/v1/reports", undefined, b.token)).reports[0].kind,
    "defense",
  );
  assert.equal(
    (await req("/v1/rivals", undefined, a.token)).rivals.length,
    0,
    "two-hour shield absent",
  );
});

test("D1 concurrency: one grant, one reserved attack, naval loss, timer migration and scheduled raids", async () => {
  const a = await login("race-a"),
    b = await login("race-b");
  const armyState = R.Y(R.Al(now), now);
  armyState.army.infantry = 6;
  armyState.fleet = [{ id: "warship", kind: "galley", level: 1 }];
  armyState.published = true;
  for (const user of [a, b])
    await db
      .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
      .bind(JSON.stringify(armyState), user.accountId)
      .run();
  claims.tx = {
    productId: "com.chrismozer.stonewake.gems250",
    appAccountToken: a.accountId,
    bundleId: env.APPLE_BUNDLE_ID,
    environment: "Sandbox",
    type: "Consumable",
    transactionId: "concurrent-tx",
    quantity: 1,
    purchaseDate: now,
  };
  const grants = await Promise.all([
    req("/v1/store/verify", { jws: "test-signed-transaction" }, a.token),
    req("/v1/store/verify", { jws: "test-signed-transaction" }, a.token),
  ]);
  assert.equal(grants.filter((x) => x.status === "granted").length, 1);
  assert.equal((await req("/v1/game", undefined, a.token)).state.gems, 350);
  assert.equal(
    (await req("/v1/store/verify", { jws: "test-signed-transaction" }, a.token))
      .duplicate,
    true,
  );
  let game = await req("/v1/game", undefined, a.token);
  const starts = await Promise.all(
    ["start-race-one", "start-race-two"].map((requestId) =>
      req(
        "/v1/battles/start",
        {
          requestId,
          revision: game.revision,
          kind: "campaign",
          campaignIndex: 0,
          army: { infantry: 6 },
          navalShipId: "warship",
        },
        a.token,
      ),
    ),
  );
  assert.equal(starts.filter((x) => x.status === 200).length, 1);
  const battle = starts.find((x) => x.status === 200).battle;
  game = await req("/v1/game", undefined, a.token);
  assert.equal(game.state.fleet[0].combatBattleId, battle.id);
  assert.equal(game.state.army.infantry, 0);
  now += 130000;
  const finish = await req(
    "/v1/battles/finish",
    { battleId: battle.id },
    a.token,
  );
  assert.equal(finish.status, 200, JSON.stringify(finish));
  assert.equal(finish.state.army.infantry, 6);
  assert.equal(finish.state.fleet[0].combatBattleId, undefined);
  assert.equal(
    !!finish.state.fleet[0].wrecked,
    !finish.result.navalSurvivors.warship,
  );
  const state = R.Al(now);
  state.buildings[0].level = 3;
  state.campaign = 2;
  await db
    .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
    .bind(JSON.stringify(state), b.accountId)
    .run();
  game = await req("/v1/game", undefined, b.token);
  const due = game.state.city.raidSchedule.dueAt;
  assert.ok(due > now);
  now = due + 1;
  game = await req("/v1/game", undefined, b.token);
  assert.equal(
    R.SWRaidStatus(game.state, now).phase,
    "ready",
    "read-only refresh kept restarting protection",
  );
  const raid = await req(
    "/v1/raids/resolve",
    { requestId: "resolve-raid-once", revision: game.revision },
    b.token,
  );
  assert.equal(raid.status, 200, JSON.stringify(raid));
  assert.equal(raid.state.city.raidCount, 1);
  const repeat = await req(
    "/v1/raids/resolve",
    { requestId: "resolve-raid-once", revision: game.revision },
    b.token,
  );
  assert.deepEqual(repeat, raid);
  assert.equal(
    (
      await req(
        "/v1/raids/resolve",
        { requestId: "resolve-raid-twice", revision: raid.revision },
        b.token,
      )
    ).status,
    409,
  );
});

test("refund-before-delivery tombstone and spent-gem debt, replay safe", async () => {
  const a = await login("refund-user");
  const original = {
    productId: "com.chrismozer.stonewake.gems250",
    appAccountToken: a.accountId,
    bundleId: env.APPLE_BUNDLE_ID,
    environment: "Sandbox",
    type: "Consumable",
    transactionId: "refunded-before",
    quantity: 1,
    purchaseDate: now,
  };
  claims.notice = {
    notificationUUID: "notice-before",
    data: { signedTransactionInfo: "test-signed-transaction" },
  };
  claims.tx = { ...original, revocationDate: now };
  assert.equal(
    (await req("/v1/store/notifications", { signedPayload: "test-notice" }))
      .status,
    200,
  );
  claims.tx = original;
  const denied = await req(
    "/v1/store/verify",
    { jws: "test-signed-transaction" },
    a.token,
  );
  assert.equal(denied.error.code, "revoked_purchase");
  assert.equal((await req("/v1/game", undefined, a.token)).state.gems, 100);
  claims.tx = { ...original, transactionId: "refunded-after" };
  assert.equal(
    (await req("/v1/store/verify", { jws: "test-signed-transaction" }, a.token))
      .status,
    "granted",
  );
  const state = (await req("/v1/game", undefined, a.token)).state;
  state.gems = 20;
  await db
    .prepare("UPDATE accounts SET state=? WHERE id=?")
    .bind(JSON.stringify(state), a.accountId)
    .run();
  claims.notice = {
    notificationUUID: "notice-after",
    data: { signedTransactionInfo: "test-signed-transaction" },
  };
  claims.tx = { ...claims.tx, revocationDate: now };
  await req("/v1/store/notifications", { signedPayload: "test-notice" });
  const refunded = await req("/v1/game", undefined, a.token);
  assert.equal(refunded.state.gems, 0);
  assert.equal(refunded.state.gemDebt, 230);
  await req("/v1/store/notifications", { signedPayload: "test-notice" });
  assert.equal((await req("/v1/game", undefined, a.token)).state.gemDebt, 230);
});

test("a concurrent accepted deployment cannot be overwritten by stale settlement", async () => {
  const a = await login("command-race");
  const state = R.Y(R.Al(now), now);
  state.army.infantry = 2;
  await db
    .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
    .bind(JSON.stringify(state), a.accountId)
    .run();
  const start = await req(
    "/v1/battles/start",
    {
      requestId: "interleave-start",
      revision: 0,
      kind: "campaign",
      campaignIndex: 0,
      army: { infantry: 2 },
    },
    a.token,
  );
  assert.equal(start.status, 200);
  now += 1000;
  let release, arrive;
  const entered = new Promise((r) => (arrive = r)),
    blocked = new Promise((r) => (release = r));
  beforeFinishCommit = async () => {
    arrive();
    await blocked;
  };
  const finish = req(
    "/v1/battles/finish",
    { battleId: start.battle.id, retreat: true },
    a.token,
  );
  await entered;
  const command = await req(
    "/v1/battles/commands",
    {
      requestId: "interleave-command",
      battleId: start.battle.id,
      commandSeq: 0,
      command: { type: "deploy", kind: "infantry", x: -2, y: 3 },
    },
    a.token,
  );
  assert.equal(command.status, 200);
  release();
  const rejected = await finish;
  assert.equal(rejected.status, 409);
  beforeFinishCommit = async () => {};
  const current = await req("/v1/game", undefined, a.token);
  assert.equal(current.battle.commandSeq, 1);
  assert.equal(
    current.state.army.infantry,
    0,
    "failed settlement partly committed troops",
  );
  const retry = await req(
    "/v1/battles/finish",
    { battleId: start.battle.id, retreat: true },
    a.token,
  );
  assert.equal(retry.status, 200);
  assert.equal(
    retry.report.input.orders.length,
    1,
    "accepted deployment disappeared from report",
  );
});

test("real player naval defense uses only two available owned warships, never invented patrols", async () => {
  const a = await login("fleet-a"),
    b = await login("fleet-b");
  const state = R.Y(R.Al(now), now);
  state.army.infantry = 2;
  state.published = true;
  await db
    .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
    .bind(JSON.stringify(state), a.accountId)
    .run();
  state.fleet = [
    { id: "galley-ready", kind: "galley", level: 2 },
    { id: "bombard-ready", kind: "bombard", level: 3 },
    { id: "spare-ready", kind: "galley", level: 1 },
    {
      id: "voyaging",
      kind: "galley",
      level: 10,
      voyage: { readyAt: now + 10000 },
    },
    {
      id: "cargo-uncollected",
      kind: "galley",
      level: 10,
      voyage: { readyAt: now - 1000 },
    },
    { id: "wrecked", kind: "bombard", level: 10, wrecked: true },
    { id: "building", kind: "bombard", level: 10, readyAt: now + 10000 },
    {
      id: "repairing",
      kind: "bombard",
      level: 10,
      wrecked: true,
      repairReadyAt: now + 10000,
    },
    { id: "fisher", kind: "cutter", level: 10 },
  ];
  await db
    .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
    .bind(JSON.stringify(state), b.accountId)
    .run();
  const rivals = await req("/v1/rivals", undefined, a.token),
    target = rivals.rivals.find((r) => r.id === b.accountId);
  assert.deepEqual(
    target.defense.navalDefense.map((s) => s.id),
    ["bombard-ready", "galley-ready"],
  );
  const started = await req(
    "/v1/battles/start",
    {
      requestId: "fleet-snapshot-start",
      revision: 0,
      kind: "player",
      targetId: b.accountId,
      army: { infantry: 2 },
    },
    a.token,
  );
  assert.deepEqual(started.battle.input.enemyNavy, target.defense.navalDefense);
});

test("victory loot conserves all four resources even with fractional remaining storage", async () => {
  const a = await login("loot-a"),
    b = await login("loot-b");
  const attack = R.Y(R.Al(now), now),
    defend = R.Y(R.Al(now), now);
  attack.army.infantry = 12;
  attack.unitLevels = { infantry: 10 };
  attack.published = defend.published = true;
  for (const k of ["gold", "wood", "stone", "food"])
    defend.resources[k] = R.SWCapacity(defend);
  for (const [user, state] of [
    [a, attack],
    [b, defend],
  ])
    await db
      .prepare("UPDATE accounts SET state=?,revision=0 WHERE id=?")
      .bind(JSON.stringify(state), user.accountId)
      .run();
  const start = await req(
    "/v1/battles/start",
    {
      requestId: "loot-start-battle",
      revision: 0,
      kind: "player",
      targetId: b.accountId,
      army: { infantry: 12 },
    },
    a.token,
  );
  assert.equal(start.status, 200);
  now += 1000;
  const commands = await req(
    "/v1/battles/commands",
    {
      requestId: "loot-deploy-army",
      battleId: start.battle.id,
      commandSeq: 0,
      commands: Array.from({ length: 12 }, () => ({
        type: "deploy",
        kind: "infantry",
        x: -1,
        y: 3,
      })),
    },
    a.token,
  );
  assert.equal(commands.status, 200);
  now += 130000;
  const current = (await req("/v1/game", undefined, a.token)).state;
  for (const k of ["gold", "wood", "stone", "food"])
    current.resources[k] = R.SWCapacity(current) - 2.7;
  current.lastTick = now;
  await db
    .prepare("UPDATE accounts SET state=? WHERE id=?")
    .bind(JSON.stringify(current), a.accountId)
    .run();
  const enemyBefore = (await req("/v1/game", undefined, b.token)).state;
  const result = await req(
    "/v1/battles/finish",
    { battleId: start.battle.id },
    a.token,
  );
  assert.equal(result.status, 200, JSON.stringify(result));
  assert.equal(result.result.won, true);
  const enemyAfter = (await req("/v1/game", undefined, b.token)).state;
  for (const k of ["gold", "wood", "stone", "food"]) {
    assert.equal(result.reward[k], 2);
    assert.ok(
      Math.abs(result.state.resources[k] - current.resources[k] - 2) < 1e-8,
    );
    assert.ok(
      Math.abs(enemyBefore.resources[k] - enemyAfter.resources[k] - 2) < 1e-8,
    );
  }
});

test("verified cosmetics: typed catalog, restore dedup, account binding and equipped refund", async () => {
  const a = await login("cosmetic-owner"),
    b = await login("cosmetic-other"),
    mariner = "com.chrismozer.stonewake.collection.mariner",
    founder = "com.chrismozer.stonewake.collection.founder",
    savedCatalog = env.PRODUCT_CATALOG;
  env.PRODUCT_CATALOG = JSON.stringify({
    ...JSON.parse(savedCatalog),
    [mariner]: { type: "nonConsumable", collectionId: "mariner" },
    [founder]: { type: "nonConsumable", collectionId: "founder" },
    "com.chrismozer.stonewake.invalid": {
      type: "nonConsumable",
      collectionId: "invented",
    },
  });
  try {
    const products = (await req("/v1/catalog")).products;
    assert.equal(products.find((p) => p.id === mariner).type, "nonConsumable");
    assert(!products.some((p) => p.collectionId === "invented"));
    assert(products.every((p) => !("displayPrice" in p)));
    let game = await req("/v1/game", undefined, a.token);
    game.state.gems = 1000;
    await db
      .prepare("UPDATE accounts SET state=? WHERE id=?")
      .bind(JSON.stringify(game.state), a.accountId)
      .run();
    async function action(action, id) {
      const current = await req("/v1/game", undefined, a.token),
        out = await req(
          "/v1/game/actions",
          { requestId: id, revision: current.revision, action },
          a.token,
        );
      assert.equal(out.status, 200, JSON.stringify(out));
      return out;
    }
    const ivoryPrice = R.SWPremiumCatalog.find((item) => item.id === "palette:ivory").priceGems;
    await action(
      { type: "buyCosmetic", id: "palette:ivory", maxPrice: ivoryPrice },
      "cosmetic-buy-independent",
    );
    const tx = {
      productId: mariner,
      appAccountToken: a.accountId,
      bundleId: env.APPLE_BUNDLE_ID,
      environment: "Sandbox",
      type: "Non-Consumable",
      transactionId: "collection-original",
      originalTransactionId: "collection-original",
      purchaseDate: now,
    };
    claims.tx = { ...tx, type: "Consumable" };
    assert.equal(
      (
        await req(
          "/v1/store/verify",
          { jws: "test-signed-transaction" },
          a.token,
        )
      ).status,
      400,
    );
    claims.tx = tx;
    assert.equal(
      (
        await req(
          "/v1/store/verify",
          { jws: "test-signed-transaction" },
          b.token,
        )
      ).status,
      400,
    );
    let paid = await req(
      "/v1/store/verify",
      { jws: "test-signed-transaction", collectionId: "royal", gems: 99999 },
      a.token,
    );
    assert.equal(paid.status, "granted");
    assert.equal(paid.game.state.gems, 1000 - ivoryPrice);
    assert(paid.game.state.premium.owned.includes("road:stone"));
    assert(!paid.game.state.premium.owned.includes("road:royal"));
    const ownership = paid.game.state.premium.owned.slice().sort();
    await action(
      { type: "equipCosmetic", id: "road:stone" },
      "cosmetic-equip-road",
    );
    const replay = await req(
      "/v1/store/verify",
      { jws: "test-signed-transaction" },
      a.token,
    );
    assert(replay.duplicate);
    assert.deepEqual(replay.game.state.premium.owned.slice().sort(), ownership);
    claims.tx = { ...tx, transactionId: "restored-collection" };
    const restored = await req(
      "/v1/store/verify",
      { jws: "test-signed-transaction" },
      a.token,
    );
    assert(restored.duplicate);
    assert.equal(restored.game.state.gems, 1000 - ivoryPrice);
    assert.deepEqual(
      restored.game.state.premium.owned.slice().sort(),
      ownership,
    );
    const beforeRefund = await req("/v1/game", undefined, a.token);
    claims.tx = {
      ...tx,
      transactionId: "refunded-restored-collection",
      revocationDate: now,
    };
    claims.notice = {
      notificationUUID: "cosmetic-refund",
      data: { signedTransactionInfo: "test-signed-transaction" },
    };
    assert.equal(
      (await req("/v1/store/notifications", { signedPayload: "test-notice" }))
        .status,
      200,
    );
    await assert.rejects(
      db.batch([
        db
          .prepare(
            "UPDATE accounts SET state=?,revision=revision+1 WHERE id=? AND revision=?",
          )
          .bind(
            JSON.stringify(beforeRefund.state),
            a.accountId,
            beforeRefund.revision,
          ),
        db.prepare("INSERT INTO mutation_guard(ok) VALUES(changes())"),
      ]),
      /CHECK constraint/,
      "Stale in-flight equip restored refunded ownership",
    );
    game = await req("/v1/game", undefined, a.token);
    assert(!game.state.premium.owned.includes("road:stone"));
    assert.equal(game.state.premium.equipped.road, "road:earth");
    assert(
      game.state.premium.owned.includes("palette:ivory"),
      "Refund removed independently gem-bought item",
    );
    assert.equal(game.state.gems, 1000 - ivoryPrice);
    assert.equal(game.state.gemDebt || 0, 0);
    const revision = game.revision;
    await req("/v1/store/notifications", { signedPayload: "test-notice" });
    assert.equal(
      (await req("/v1/game", undefined, a.token)).revision,
      revision,
    );
    claims.tx = { ...tx, transactionId: "another-restore" };
    assert.equal(
      (
        await req(
          "/v1/store/verify",
          { jws: "test-signed-transaction" },
          a.token,
        )
      ).error.code,
      "revoked_purchase",
    );
    const early = {
      ...tx,
      productId: founder,
      transactionId: "never-delivered",
      originalTransactionId: "never-delivered",
      revocationDate: now,
    };
    claims.tx = early;
    claims.notice = {
      notificationUUID: "cosmetic-early-refund",
      data: { signedTransactionInfo: "test-signed-transaction" },
    };
    await req("/v1/store/notifications", { signedPayload: "test-notice" });
    claims.tx = {
      ...early,
      revocationDate: undefined,
      transactionId: "early-restoration",
    };
    assert.equal(
      (
        await req(
          "/v1/store/verify",
          { jws: "test-signed-transaction" },
          a.token,
        )
      ).error.code,
      "revoked_purchase",
    );
    claims.tx = {
      ...early,
      revocationDate: undefined,
      transactionId: "founder-repurchase",
      originalTransactionId: "founder-repurchase",
    };
    paid = await req(
      "/v1/store/verify",
      { jws: "test-signed-transaction" },
      a.token,
    );
    assert.equal(paid.status, "granted");
    let placement;
    for (let x = 0; x < 16 && !placement; x++)
      for (let y = 0; y < 16 && !placement; y++) {
        const candidate = {
          type: "placeOrnament",
          id: "ornament:lantern",
          x,
          y,
          facing: 2,
        };
        try {
          R.Ul(paid.game.state, candidate, now);
          placement = candidate;
        } catch {}
      }
    assert(placement);
    await action(placement, "cosmetic-place-lantern");
    claims.tx = { ...claims.tx, revocationDate: now };
    const revoked = await req(
      "/v1/store/verify",
      { jws: "test-signed-transaction" },
      a.token,
    );
    assert.equal(revoked.status, "revoked");
    assert.equal(revoked.game.state.premium.ornaments.length, 0);
    assert.equal(
      (
        await db
          .prepare(
            "SELECT COUNT(*) AS n FROM store_entitlements WHERE account_id=?",
          )
          .bind(a.accountId)
          .first()
      ).n,
      2,
    );
  } finally {
    env.PRODUCT_CATALOG = savedCatalog;
  }
});

test("premium authority: timed stories and claims once; fixed expeditions cannot mint or consume home armies", async () => {
  const a = await login("saga-player");
  async function act(action, id) {
    const game = await req("/v1/game", undefined, a.token);
    return req(
      "/v1/game/actions",
      { requestId: id, revision: game.revision, action },
      a.token,
    );
  }
  assert.equal(
    (
      await act(
        { type: "buyCosmetic", id: "palette:ember", maxPrice: 0 },
        "bad-cosmetic-price",
      )
    ).status,
    400,
  );
  const story = await act(
    { type: "startResidentStory", id: "crew-supper", choice: "feast" },
    "story-start-once",
  );
  assert.equal(story.status, 200, JSON.stringify(story));
  assert.equal(
    (
      await act(
        { type: "claimResidentStory", id: "crew-supper" },
        "story-early-claim",
      )
    ).status,
    400,
  );
  now += 31000;
  const claimed = await act(
    { type: "claimResidentStory", id: "crew-supper" },
    "story-claim-once",
  );
  assert.equal(claimed.status, 200);
  assert.equal(claimed.state.gems, 105);
  assert.equal(
    (
      await act(
        { type: "claimResidentStory", id: "crew-supper" },
        "story-claim-once",
      )
    ).state.gems,
    105,
  );
  assert.equal(
    (
      await act(
        { type: "claimResidentStory", id: "crew-supper" },
        "story-claim-again",
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await act(
        { type: "claimEvent", id: "harbor-festival", tier: "3" },
        "event-forged-claim",
      )
    ).status,
    400,
  );
  assert.equal(
    (await act({ type: "advanceMission", id: "survey" }, "mission-survey-once"))
      .status,
    200,
  );
  const mission = await act(
    { type: "claimMission", id: "survey" },
    "mission-survey-reward",
  );
  assert.equal(mission.state.gems, 110);
  assert.equal(
    (await act({ type: "claimMission", id: "survey" }, "mission-survey-again"))
      .status,
    400,
  );
  const seed = (await req("/v1/game", undefined, a.token)).state;
  seed.buildings.find((b) => b.kind === "keep").level = 4;
  seed.army = R.wl();
  seed.fleet = [{ id: "home-ship", kind: "galley", level: 1 }];
  seed.premium.chapter.completed = ["survey", "causeway"];
  seed.premium.chapter.claimed = ["survey", "causeway"];
  await db
    .prepare("UPDATE accounts SET state=? WHERE id=?")
    .bind(JSON.stringify(seed), a.accountId)
    .run();
  let game = await req("/v1/game", undefined, a.token);
  const lockedTrial = await req(
    "/v1/battles/start",
    {
      requestId: "trial-locked-first",
      revision: game.revision,
      kind: "trial",
      missionId: "rescue",
      trialId: "swift-rescue",
    },
    a.token,
  );
  assert.equal(lockedTrial.status, 400);
  const started = await req(
    "/v1/battles/start",
    {
      requestId: "saga-start-fixed",
      revision: game.revision,
      kind: "saga",
      missionId: "rescue",
      army: { infantry: 999999 },
      navalShipId: "home-ship",
      seed: 1,
      bonus: 999,
      commander: { level: 10 },
    },
    a.token,
  );
  assert.equal(started.status, 200, JSON.stringify(started));
  assert.equal(started.battle.input.saga.missionId, "rescue");
  assert.deepEqual(started.battle.input.army, R.SWSagaInput(seed,"rescue",false,now).army);
  assert.notEqual(started.battle.input.seed, 1);
  assert.deepEqual(started.state.army, seed.army);
  assert.deepEqual(started.state.fleet, seed.fleet);
  now += 2000;
  const ended = await req(
    "/v1/battles/finish",
    {
      battleId: started.battle.id,
      retreat: true,
      won: true,
      objective: { won: true },
    },
    a.token,
  );
  assert.equal(ended.status, 200, JSON.stringify(ended));
  assert.equal(ended.result.won, false);
  assert.equal(ended.result.objective.won, false);
  assert.deepEqual(ended.state.army, seed.army);
  assert.deepEqual(ended.state.fleet, seed.fleet);
  assert(!ended.state.premium.chapter.completed.includes("rescue"));
  assert.equal(
    (
      await req(
        "/v1/battles/finish",
        { battleId: started.battle.id, retreat: true },
        a.token,
      )
    ).revision,
    ended.revision,
  );
  // Real objective success, including replayable first-clear mastery rewards.
  async function winRescue(kind,requestId) {
    const current=await req("/v1/game",undefined,a.token);
    const started=await req("/v1/battles/start",{requestId,revision:current.revision,kind,missionId:"rescue",...(kind==="trial"?{trialId:"swift-rescue"}:{})},a.token);
    assert.equal(started.status,200,JSON.stringify(started));
    const commands=Object.entries(started.battle.input.army).flatMap(([troop,n])=>Array.from({length:n},()=>({type:"deploy",kind:troop,x:-2,y:3})));
    assert(commands.length<=20);
    const orders=await req("/v1/battles/commands",{requestId:requestId+"-orders",battleId:started.battle.id,commandSeq:0,commands},a.token);assert.equal(orders.status,200,JSON.stringify(orders));
    now+=60000;
    const settled=await req("/v1/battles/finish",{battleId:started.battle.id},a.token);assert.equal(settled.status,200,JSON.stringify(settled));assert.equal(settled.result.objective.won,true);assert.equal(settled.result.won,true);assert.deepEqual(settled.state.army,seed.army);assert.deepEqual(settled.state.fleet,seed.fleet);return settled;
  }
  const won=await winRescue("saga","rescue-real-win");assert(won.state.premium.chapter.completed.includes("rescue"));assert.equal(won.state.gems,ended.state.gems,"Unclaimed mission minted gems");
  const reward=await act({type:"claimMission",id:"rescue"},"rescue-claim-once");assert.equal(reward.state.gems,ended.state.gems+10);assert.equal((await act({type:"claimMission",id:"rescue"},"rescue-claim-twice")).status,400);
  const trial=await winRescue("trial","rescue-mastery-first");assert.equal(trial.state.gems,reward.state.gems+8);assert.equal(trial.saga.firstClear,true);
  const repeat=await winRescue("trial","rescue-mastery-again");assert.equal(repeat.state.gems,trial.state.gems);assert.equal(repeat.saga.firstClear,false);
  const hold = repeat.state;
  hold.premium.chapter.completed = ["survey", "causeway", "rescue", "escort"];
  hold.premium.chapter.claimed = [...hold.premium.chapter.completed];
  await db
    .prepare("UPDATE accounts SET state=? WHERE id=?")
    .bind(JSON.stringify(hold), a.accountId)
    .run();
  game = await req("/v1/game", undefined, a.token);
  const defense = await req(
    "/v1/battles/start",
    {
      requestId: "saga-auto-harbor",
      revision: game.revision,
      kind: "saga",
      missionId: "harbor",
    },
    a.token,
  );
  assert.equal(defense.status, 200, JSON.stringify(defense));
  assert.equal(defense.battle.input.saga.mode, "hold");
  const forbidden = await req(
    "/v1/battles/commands",
    {
      requestId: "saga-forged-hold",
      battleId: defense.battle.id,
      commandSeq: 0,
      commands: [{ type: "rally" }],
    },
    a.token,
  );
  assert.equal(forbidden.error.code, "automatic_defense");
  assert.equal(
    (await req("/v1/game", undefined, a.token)).battle.commandSeq,
    0,
  );
  now += 500;
  const retreat = await req(
    "/v1/battles/finish",
    { battleId: defense.battle.id, retreat: true },
    a.token,
  );
  assert.equal(retreat.status, 200, JSON.stringify(retreat));
  assert.equal(retreat.report.defending, true);
  assert.equal(retreat.result.won, false);
});

test("dual campaigns: authoritative cargo, landings, ship commands, loadouts and atomic layout", async () => {
  const user=await login("dual-campaign-build14");
  const seed=R.Y(R.Al(now),now);seed.buildings.find(b=>b.kind==='keep').level=7;
  seed.buildings.push({id:'barracks-build14',kind:'barracks',x:3,y:5,level:7});
  seed.buildings.push({id:'dock-build14',kind:'harbor',x:-2,y:3,level:7});
  seed.campaign=10;seed.seaCampaign=0;seed.army={...R.wl(),infantry:8,archer:6,healer:3};
  seed.fleet=[{id:'cargo-cog',kind:'cog',level:4},{id:'guard-galley',kind:'galley',level:4}];
  seed.resources={gold:2000,wood:2000,stone:2000,food:2000};
  await db.prepare('UPDATE accounts SET state=?,revision=0 WHERE id=?').bind(JSON.stringify(seed),user.accountId).run();
  let game=await req('/v1/game',undefined,user.token);
  const army={...R.wl(),infantry:6,archer:4,healer:2};
  const fleet=R.SWPackCargo14(game.state,['cargo-cog','guard-galley'],army).fleet;
  const body={revision:game.revision,kind:'sea',campaignIndex:0,army,fleet,combatVersion:14};
  const bad=await req('/v1/battles/start',{...body,requestId:'sea-bad-cargo14',fleet:[{id:'cargo-cog',cargo:{trebuchet:80},level:99}]},user.token);
  assert.equal(bad.status,400);assert.ok(!(await req('/v1/game',undefined,user.token)).state.activeBattle);
  const started=await req('/v1/battles/start',{...body,requestId:'sea-start-valid14'},user.token);assert.equal(started.status,200,JSON.stringify(started));
  assert.equal(started.battle.input.navalVersion,4);assert.equal(started.battle.input.campaignType,'sea');assert.equal(started.state.army.infantry,2);assert.equal(started.state.fleet.filter(s=>s.combatBattleId===started.battle.id).length,2);
  const duplicate=await req('/v1/battles/start',{...body,requestId:'sea-start-valid14'},user.token);assert.deepEqual(duplicate,started);
  const invalidLanding=await req('/v1/battles/commands',{requestId:'sea-invalid-land14',battleId:started.battle.id,commandSeq:0,commands:[{type:'deploy',kind:'infantry',x:4,y:4,shipId:'cargo-cog'}]},user.token);assert.equal(invalidLanding.status,400);
  now+=1000;
  const order=await req('/v1/battles/commands',{requestId:'sea-landing14',battleId:started.battle.id,commandSeq:0,commands:[{type:'deploy',kind:'infantry',x:-1,y:3,shipId:'cargo-cog'},{type:'ship',order:{type:'ability',shipId:'cargo-cog',time:-999}},{type:'ship',order:{type:'move',shipId:'guard-galley',x:-5,y:1,time:999}}]},user.token);
  assert.equal(order.status,200,JSON.stringify(order));assert.equal(order.input.orders[0].shipId,'cargo-cog');assert.equal(order.input.shipOrders14[0].time,1);assert.equal(order.input.shipOrders14[1].time,1);
  const repeated=await req('/v1/battles/commands',{requestId:'sea-ability-again14',battleId:started.battle.id,commandSeq:3,commands:[{type:'ship',order:{type:'ability',shipId:'cargo-cog'}}]},user.token);assert.equal(repeated.status,400);
  now+=120000;
  const finished=await req('/v1/battles/finish',{battleId:started.battle.id},user.token);assert.equal(finished.status,200,JSON.stringify(finished));assert.ok(finished.state.fleet.every(s=>!s.combatBattleId));assert.equal(finished.state.campaign,10);assert.equal(finished.state.seaCampaign,finished.result.won?1:0);
  game=await req('/v1/game',undefined,user.token);
  const action=await req('/v1/game/actions',{requestId:'loadout-save14',revision:game.revision,action:{type:'saveLoadout',loadout:{id:'coastal',name:'Coastal guard',slots:['infantry','archer'],counts:{infantry:4,archer:3}}}},user.token);
  assert.equal(action.status,200,JSON.stringify(action));assert.equal(action.state.activeLoadout14,'coastal');
  const beforeLayout=await req('/v1/game',undefined,user.token);
  const rejectedLayout=await req('/v1/game/actions',{requestId:'layout-rollback14',revision:beforeLayout.revision,action:{type:'commitLayout',actions:[{type:'rotate',id:'keep'},{type:'upgrade',id:'keep'}]}},user.token);
  assert.equal(rejectedLayout.status,400);
  const afterLayout=await req('/v1/game',undefined,user.token);assert.equal(afterLayout.revision,beforeLayout.revision);assert.deepEqual(afterLayout.state.buildings,beforeLayout.state.buildings);
  const land=await req('/v1/battles/start',{requestId:'land-no-fleet14',revision:afterLayout.revision,kind:'campaign',campaignIndex:0,army:{...R.wl(),infantry:3},combatVersion:14},user.token);assert.equal(land.status,200,JSON.stringify(land));assert.equal(land.battle.input.navalVersion,0);assert.deepEqual(land.battle.input.fleet14,[]);
});
