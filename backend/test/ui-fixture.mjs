// Test-only native boundary. The service and SQLite transactions are real; Apple
// identity is injected here only. This file is never imported by the Worker.
import { readFile } from "node:fs/promises";
import { Miniflare } from "miniflare";
import { createService } from "../src/service.mjs";
import * as R from "../src/rules.mjs";

export async function createUIFixture({ storeFixtures = false } = {}) {
  const mf = new Miniflare({
    modules: true,
    script: 'export default {fetch(){return new Response("test fixture")}}',
    d1Databases: { DB: "ui-test" },
  });
  const db = await mf.getD1Database("DB");
  const schema = await readFile(
    new URL("../migrations/0001_accounts.sql", import.meta.url),
    "utf8",
  );
  for (const sql of schema
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean))
    await db.prepare(sql).run();
  const refund = await readFile(
    new URL("../migrations/0002_refund_tombstones.sql", import.meta.url),
    "utf8",
  );
  for (const sql of refund.match(
    /CREATE TABLE[^;]*;|CREATE TRIGGER[\s\S]*?END;/g,
  ))
    await db.prepare(sql).run();
  const cosmeticSchema = await readFile(
    new URL("../migrations/0003_cosmetic_entitlements.sql", import.meta.url),
    "utf8",
  );
  for (const statement of cosmeticSchema.match(
    /CREATE TRIGGER[\s\S]*?END;|(?:ALTER TABLE|DROP TRIGGER|CREATE (?:TABLE|UNIQUE INDEX|INDEX))[^;]*;/g,
  ))
    await db.prepare(statement).run();
  let offset = 0,
    cache = null,
    dropCommandReply = false,
    commandDelay = 0;
  const now = () => Date.now() + offset,
    calls = [],
    archives = [],
    transactions = new Map(),
    notices = new Map();
  let purchaseStatus = "granted",
    nextTransaction = 0;
  const storeProducts = storeFixtures
    ? [
        {
          id: "com.chrismozer.stonewake.gems250",
          type: "consumable",
          gems: 250,
          name: "TEST gem product",
          description: "Fixture only",
          displayPrice: "$0.99 TEST",
        },
        {
          id: "com.chrismozer.stonewake.collection.mariner",
          type: "nonConsumable",
          collectionId: "mariner",
          name: "TEST Mariner product",
          description: "Fixture only",
          displayPrice: "$3.99 TEST",
        },
      ]
    : [];
  const service = createService({
    clock: now,
    onError: (e) => console.error(e.stack),
    verifyAppleIdentity: async (token, nonce) => {
      const claim = JSON.parse(token);
      if (claim.nonce !== nonce || !claim.sub?.startsWith("ui-fixture-"))
        throw Error("invalid fixture identity");
      return { sub: claim.sub };
    },
    verifyTransaction: async (jws) => {
      if (!transactions.has(jws)) throw Error("Invalid fixture signature");
      return structuredClone(transactions.get(jws));
    },
    verifyNotification: async (jws) => {
      if (!notices.has(jws)) throw Error("Invalid fixture notification");
      return structuredClone(notices.get(jws));
    },
  });
  const env = {
    DB: db,
    APPLE_BUNDLE_ID: "com.chrismozer.stonewake",
    APPLE_ENVIRONMENT: "Sandbox",
    PURCHASES_ENABLED: storeFixtures ? "true" : "false",
    PRODUCT_CATALOG: JSON.stringify(
      Object.fromEntries(
        storeProducts.map((p) => [
          p.id,
          p.type === "consumable"
            ? { type: p.type, gems: p.gems }
            : { type: p.type, collectionId: p.collectionId },
        ]),
      ),
    ),
  };
  async function request(path, { method = "GET", body } = {}, token) {
    const response = await service.fetch(
      new Request("https://local-fixture.test" + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }),
      env,
    );
    const data = await response.json();
    if (!response.ok)
      throw Object.assign(
        Error(data.error?.message || data.message || "Service request failed"),
        {
          code: data.error?.code || data.code,
          status: response.status,
          details: data.error?.details || data.details,
        },
      );
    return data;
  }
  async function login(sub) {
    const challenge = await request("/v1/auth/challenge", {
      method: "POST",
      body: {},
    });
    return request("/v1/auth/apple", {
      method: "POST",
      body: {
        challengeId: challenge.id,
        identityToken: JSON.stringify({ sub, nonce: challenge.nonce }),
      },
    });
  }
  const user = await login("ui-fixture-attacker"),
    rival = await login("ui-fixture-defender");
  async function readState(id = user.accountId) {
    return JSON.parse(
      (
        await db
          .prepare("SELECT state FROM accounts WHERE id=?")
          .bind(id)
          .first()
      ).state,
    );
  }
  async function seedState(state, id = user.accountId) {
    await db
      .prepare(
        "UPDATE accounts SET state=?,revision=?,shield_until=0 WHERE id=?",
      )
      .bind(JSON.stringify(state), state.revision || 0, id)
      .run();
  }
  const player = await readState();
  player.name = "Online Test";
  player.army.infantry = 8;
  player.army.archer = 4;
  await seedState(player);
  const opponent = await readState(rival.accountId);
  opponent.name = "Fixture Rival";
  opponent.published = true;
  await seedState(opponent, rival.accountId);
  let status = {
    configured: true,
    signedIn: true,
    accountId: user.accountId,
    status: "ready",
    message: "",
    products: [],
    backup: null,
    onlineKingdom: true,
    busy: false,
  };
  async function call(method, payload = {}) {
    calls.push({ method, payload: structuredClone(payload), at: now() });
    let result;
    if (method === "status") {
      const account = await request("/v1/account", {}, user.token);
      status = { ...status, ...account };
      result = status;
    } else if (method === "archiveLocal") {
      archives.push(structuredClone(payload.save));
      result = { saved: true };
    } else if (method === "cacheOnline") {
      cache = {
        accountId: user.accountId,
        game: structuredClone(payload.game),
        cachedAt: now(),
      };
      result = { saved: true };
    } else if (method === "getOnlineCache") result = cache || {};
    else if (method === "products") {
      status = { ...status, products: storeProducts };
      result = { products: storeProducts };
    } else if (method === "purchase") {
      const product = storeProducts.find((p) => p.id === payload.productId);
      if (!product) throw Error("Unavailable fixture product");
      if (purchaseStatus !== "granted") result = { status: purchaseStatus };
      else {
        const previous = [...transactions.entries()].find(
          ([, tx]) =>
            product.type === "nonConsumable" &&
            tx.productId === product.id &&
            !tx.revocationDate,
        );
        const key = previous?.[0] || "fixture-transaction-" + ++nextTransaction;
        if (!previous)
          transactions.set(key, {
            productId: product.id,
            appAccountToken: user.accountId,
            bundleId: env.APPLE_BUNDLE_ID,
            environment: "Sandbox",
            type:
              product.type === "consumable" ? "Consumable" : "Non-Consumable",
            transactionId: key,
            originalTransactionId: key,
            quantity: 1,
            purchaseDate: now(),
          });
        result = await request(
          "/v1/store/verify",
          { method: "POST", body: { jws: key } },
          user.token,
        );
      }
    } else if (method === "restorePurchases") {
      for (const [key, tx] of transactions)
        if (tx.type === "Non-Consumable" && !tx.revocationDate)
          await request(
            "/v1/store/verify",
            { method: "POST", body: { jws: key } },
            user.token,
          );
      result = {
        status: "checked",
        game: await request("/v1/game", {}, user.token),
      };
    } else if (method === "backup") {
      result = await request(
        "/v1/backup",
        { method: "POST", body: payload },
        user.token,
      );
      status = { ...status, backup: result };
    } else if (method === "restoreBackup")
      result = await request("/v1/backup", {}, user.token);
    else if (method === "request") {
      if (payload.path === "/v1/battles/commands" && commandDelay)
        await new Promise((r) => setTimeout(r, commandDelay));
      result = await request(
        payload.path,
        { method: payload.method, body: payload.body },
        user.token,
      );
      if (payload.path === "/v1/battles/commands" && dropCommandReply) {
        dropCommandReply = false;
        throw Object.assign(
          Error("Connection interrupted. Retry to continue."),
          { code: "timeout" },
        );
      }
    } else
      throw Object.assign(
        Error("This test does not simulate purchases or native identity UI."),
        { code: "unavailable" },
      );
    return { result, state: { ...status } };
  }
  return {
    call,
    calls,
    archives,
    user,
    rival,
    db,
    readState,
    seedState,
    now,
    request: (path, options) => request(path, options, user.token),
    dropNextCommandReply() {
      dropCommandReply = true;
    },
    delayCommands(ms) {
      commandDelay = ms;
    },
    setPurchaseStatus(value) {
      purchaseStatus = value;
    },
    async refundCollection(collectionId) {
      const product = storeProducts.find(
          (p) => p.collectionId === collectionId,
        ),
        entry = [...transactions.entries()].find(
          ([, tx]) => tx.productId === product?.id,
        );
      if (!entry) throw Error("No fixture purchase");
      const [key, tx] = entry;
      transactions.set(key, { ...tx, revocationDate: now() });
      const notice = "fixture-refund-" + key;
      notices.set(notice, {
        notificationUUID: notice,
        data: { signedTransactionInfo: key },
      });
      await request("/v1/store/notifications", {
        method: "POST",
        body: { signedPayload: notice },
      });
      return request("/v1/game", {}, user.token);
    },
    advance(ms) {
      offset += ms;
    },
    close: () => mf.dispose(),
    rules: R,
    async makeRaidDue() {
      const state = await readState();
      state.buildings.find((b) => b.kind === "keep").level = 3;
      state.city.raidSchedule = {
        version: 1,
        enabled: true,
        cycle: 0,
        eligibleAt: now() - 2e6,
        shieldUntil: now() - 4e5,
        dueAt: now() - 1e3,
      };
      await seedState(state);
      return state;
    },
  };
}
