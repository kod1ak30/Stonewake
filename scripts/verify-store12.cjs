// Test-only Apple identity/product/JWS fixtures feed the actual production bridge,
// UI, authoritative service and D1. This is not a successful Apple payment test.
const {
  chromium,
} = require("/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const root = path.resolve(__dirname, ".."),
  save = JSON.parse(
    fs.readFileSync(
      "/Users/chrismozer/Library/Developer/Stonewake-backups/post-install-build10-kingdom.json",
    ),
  );
(async () => {
  const { createUIFixture } = await import("../backend/test/ui-fixture.mjs"),
    fixture = await createUIFixture({ storeFixtures: true });
  const state = await fixture.readState();
  state.buildings.find((b) => b.kind === "keep").level = 3;
  state.premium.chapter.completed = ["survey", "causeway"];
  state.premium.chapter.claimed = ["survey", "causeway"];
  await fixture.seedState(state);
  const browser = await chromium.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    }),
    page = await browser.newPage({
      viewport: { width: 932, height: 430 },
      hasTouch: true,
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.exposeFunction("__nativeOnline", async (method, payload) => {
      try {
        return { ok: true, ...(await fixture.call(method, payload)) };
      } catch (e) {
        return {
          ok: false,
          error: {
            code: e.code || "unavailable",
            message: e.message,
            details: e.details,
          },
        };
      }
    });
    await page.route("**/assets/index-BPhrguZ3.js", (route) => {
      let source = fs.readFileSync(
        path.join(root, "Stonewake/Web/assets/index-BPhrguZ3.js"),
        "utf8",
      );
      assert(source.includes("  let kn = z?.frames.reduce"));
      source = source.replace(
        "  let kn = z?.frames.reduce",
        "  window.__ui={state:r.current,mode:o,input:R,battle:L,result:B,reports:vt,returnLocal:SWReturnLocal,refresh:SWRefreshOnline,navigate:SWNavigate,deploy:Sn,queue:swOnlineQueue.current};\n  let kn = z?.frames.reduce",
      );
      return route.fulfill({
        contentType: "text/javascript",
        body: source + "\nwindow.__engine={pl,Kl};",
      });
    });
    await page.addInitScript((save) => {
      window.__STONEWAKE_SAVE__ = save;
      window.__STONEWAKE_INTRO_SEEN__ = true;
      window.__localWrites = [];
      window.__feedback = [];
      window.webkit = {
        messageHandlers: {
          stonewake: {
            postMessage(m) {
              if (m.kind === "save") {
                window.__STONEWAKE_SAVE__ = JSON.parse(m.payload);
                window.__localWrites.push(JSON.parse(m.payload));
              }
              if (m.kind === "online")
                window
                  .__nativeOnline(m.method, m.payload)
                  .then((reply) =>
                    dispatchEvent(
                      new CustomEvent("stonewake-online-reply", {
                        detail: { id: m.id, ...reply },
                      }),
                    ),
                  );
              else window.__feedback.push(m);
            },
          },
        },
      };
    }, save);
    await page.goto("http://localhost:8768");
    await page.waitForFunction(
      () =>
        window.__ui?.mode === "practice" && window.SWOnline.state().signedIn,
    );
    await page.evaluate(() => window.__ui.navigate("account"));
    await page
      .getByRole("button", { name: "Enter Online Kingdom", exact: true })
      .tap();
    await page
      .locator(".sw-account-confirm")
      .getByRole("button", { name: "Enter Online Kingdom", exact: true })
      .tap();
    await page.waitForFunction(() => window.__ui.mode === "cloud");
    const local = await page.evaluate(() =>
      JSON.stringify(window.__STONEWAKE_SAVE__),
    );
    await page.evaluate(() => window.__ui.navigate("store"));
    await page.getByRole("button", { name: "Gems", exact: true }).tap();
    const pack = page
      .locator(".sw-store-product")
      .filter({ hasText: "TEST gem product" });
    await pack.waitFor();
    fixture.setPurchaseStatus("pending");
    await pack.tap();
    await page
      .getByText(
        "Waiting for Apple to confirm. Your balance has not been changed.",
        { exact: true },
      )
      .waitFor();
    assert.equal(await page.evaluate(() => window.__ui.state.gems), 100);
    fixture.setPurchaseStatus("cancelled");
    await pack.tap();
    await page
      .getByText("Purchase cancelled. Nothing was added.", { exact: true })
      .waitFor();
    assert.equal(await page.evaluate(() => window.__ui.state.gems), 100);
    fixture.setPurchaseStatus("granted");
    await pack.tap();
    await page.waitForFunction(() => window.__ui.state.gems === 350);
    assert.equal((await fixture.readState()).gems, 350);
    await page.getByRole("button", { name: "Collections", exact: true }).tap();
    await page
      .locator(".sw-store-product")
      .filter({ hasText: "TEST Mariner product" })
      .tap();
    await page
      .locator(".sw-collection-card")
      .filter({ hasText: "Mariner collection" })
      .getByText("Collection owned", { exact: true })
      .waitFor();
    assert.equal(await page.evaluate(() => window.__ui.state.gems), 350);
    await page
      .getByRole("button", { name: "Restore purchases", exact: true })
      .tap();
    await page
      .getByText(
        "Verified purchases have been checked for this Online Kingdom.",
        { exact: true },
      )
      .waitFor();
    assert.equal(await page.evaluate(() => window.__ui.state.gems), 350);
    assert.equal(
      (
        await fixture.db
          .prepare(
            "SELECT COUNT(*) AS n FROM store_entitlements WHERE account_id=?",
          )
          .bind(fixture.user.accountId)
          .first()
      ).n,
      1,
    );
    await page.getByRole("button", { name: "Wardrobe", exact: true }).tap();
    await page.getByRole("button", { name: "Roads", exact: true }).tap();
    await page
      .locator(".sw-catalog-item")
      .filter({ hasText: "Harbor cobbles" })
      .tap();
    await page
      .getByRole("button", { name: "Equip Harbor cobbles", exact: true })
      .tap();
    await page.waitForFunction(
      () => window.__ui.state.premium.equipped.road === "road:stone",
    );
    const revoked = await fixture.refundCollection("mariner");
    await page.evaluate(
      (game) =>
        dispatchEvent(
          new CustomEvent("stonewake-online-purchase", { detail: { game } }),
        ),
      revoked,
    );
    await page.waitForFunction(
      () => window.__ui.state.premium.equipped.road === "road:earth",
    );
    assert(!(await fixture.readState()).premium.owned.includes("road:stone"));
    assert.equal(
      await page.evaluate(() => JSON.stringify(window.__STONEWAKE_SAVE__)),
      local,
    );
    await page.evaluate(() => window.__ui.navigate("chronicle"));
    await page
      .locator(".sw-mission-choice")
      .filter({ hasText: "The missing shipwrights" })
      .tap();
    await page
      .getByRole("button", { name: "Prepare expedition", exact: true })
      .tap();
    await page
      .getByRole("button", { name: "Begin expedition", exact: true })
      .tap();
    await page.waitForFunction(() => window.__ui.battle?.kind === "saga");
    const battle = await fixture.request("/v1/game");
    assert.equal(battle.battle.input.saga.missionId, "rescue");
    assert.deepEqual(battle.state.army, state.army);
    assert.deepEqual(battle.battle.input.army, fixture.rules.SWSagaInput(state,"rescue",false,fixture.now()).army);
    const point = await page.evaluate(() => {
      for (let x = -2; x < 12; x++)
        for (let y = -2; y < 12; y++)
          if (window.__engine.pl(window.__ui.input.defense, x, y))
            return { x, y };
    });
    await page.evaluate((p) => window.__ui.deploy(p.x, p.y), point);
    await page.waitForFunction(() => window.__ui.queue.pending === 0);
    assert.equal((await fixture.request("/v1/game")).battle.commandSeq, 1);
    await page.getByRole("button", { name: "Retreat", exact: true }).tap();
    await page.waitForFunction(() => !!window.__ui.result);
    assert.equal(
      await page.evaluate(() => window.__ui.result.result.won),
      false,
    );
    assert.deepEqual((await fixture.readState()).army, state.army);
    await page
      .getByRole("button", { name: "Return to Adventures", exact: true })
      .tap();
    await page.evaluate(() => window.__ui.returnLocal());
    await page.waitForFunction(() => window.__ui.mode === "practice");
    assert.equal(
      await page.evaluate(() => window.__ui.state.gems),
      JSON.parse(local).state.gems,
    );
    assert(
      !(await page.evaluate(() =>
        window.__ui.state.premium.owned.includes("road:stone"),
      )),
    );
    const feedback = await page.evaluate(() => window.__feedback);
    assert(feedback.some((m) => m.kind === "feedbackSettings"));
    assert(
      feedback.some((m) => m.kind === "musicContext" && m.context === "scout"),
    );
    assert(
      feedback.some((m) => m.kind === "musicContext" && m.context === "battle"),
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS real UI/bridge + actual service/D1: fixture pending/cancelled do not grant; verified-fixture gem/collection ownership; restore dedup; equipped refund; local save isolation; server saga fixed forces/order/retreat; music and feedback bridge events. Apple products, payment signature and native files are explicit test fixtures, not a live purchase.",
    );
  } catch (e) {
    console.error(
      await page.evaluate(() => ({
        mode: window.__ui?.mode,
        text: document.body.innerText.slice(-2500),
        result: window.__ui?.result,
      })),
    );
    throw e;
  } finally {
    await browser.close();
    await fixture.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
