import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
import { Miniflare } from "miniflare";
import { fileURLToPath } from "node:url";
test("production Apple verifier loads in workerd and rejects forged StoreKit data and identity tokens", async () => {
  const entry = `import {verifyTransaction,verifyAppleIdentity} from './src/apple.mjs';export default {async fetch(request){const data=await request.json();try{const result=data.identity?await verifyAppleIdentity(data.jws,'nonce',{APPLE_BUNDLE_ID:'com.chrismozer.stonewake'}):await verifyTransaction(data.jws,{APPLE_ENVIRONMENT:'Sandbox',APPLE_BUNDLE_ID:'com.chrismozer.stonewake'});return Response.json({accepted:true,result})}catch(error){return Response.json({accepted:false,type:error.name,status:error.status??null})}}}`;
  const result = await build({
    stdin: { contents: entry, resolveDir: fileURLToPath(new URL("../", import.meta.url)) },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    target: "es2022",
    loader: { ".cer": "binary" },
    external: ["node:*"],
  });
  const mf = new Miniflare({
    modules: true,
    script: result.outputFiles[0].text,
    compatibilityDate: "2026-08-06",
    compatibilityFlags: ["nodejs_compat"],
  });
  try {
    const certificate = (
      await readFile(new URL("../certs/AppleRootCA-G3.cer", import.meta.url))
    ).toString("base64");
    const head = Buffer.from(
        JSON.stringify({
          alg: "ES256",
          x5c: [certificate, certificate, certificate],
        }),
      ).toString("base64url"),
      payload = Buffer.from(
        JSON.stringify({
          transactionId: "forged",
          originalTransactionId: "forged",
          bundleId: "com.chrismozer.stonewake",
          productId: "com.chrismozer.stonewake.gems250",
          purchaseDate: Date.now(),
          signedDate: Date.now(),
          environment: "Sandbox",
          type: "Consumable",
          quantity: 1,
        }),
      ).toString("base64url");
    for (const body of [
      { jws: "forged" },
      {
        jws:
          head + "." + payload + "." + Buffer.alloc(64).toString("base64url"),
      },
      { identity: true, jws: "forged" },
    ]) {
      const r = await mf.dispatchFetch("https://apple-test.local/", {
          method: "POST",
          body: JSON.stringify(body),
        }),
        json = await r.json();
      assert.equal(json.accepted, false);
      assert.ok(
        json.type !== "ReferenceError" && json.type !== "TypeError",
        JSON.stringify(json),
      );
    }
    console.log(
      "Apple trust roots and JWS validation executed inside actual Worker runtime; no purchase was made.",
    );
  } finally {
    await mf.dispose();
  }
});
