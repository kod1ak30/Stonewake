import { createRemoteJWKSet, jwtVerify } from "jose";
import rootG3 from "../certs/AppleRootCA-G3.cer";
import rootG2 from "../certs/AppleRootCA-G2.cer";
import rootLegacy from "../certs/AppleIncRootCertificate.cer";
// Only Apple's public keys and roots are trusted in the production entrypoint.
const keys = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
export async function verifyAppleIdentity(token, nonce, env) {
  const { payload } = await jwtVerify(token, keys, {
    issuer: "https://appleid.apple.com",
    audience: env.APPLE_BUNDLE_ID,
    algorithms: ["RS256"],
    maxTokenAge: "10m",
  });
  if (payload.nonce !== nonce || !payload.sub)
    throw Error("Apple sign-in could not be verified.");
  return payload;
}
export async function appleVerifier(env) {
  // Apple's dependency initializes entropy. Load it inside a request, never Worker global scope.
  const { SignedDataVerifier, Environment } =
    await import("@apple/app-store-server-library");
  const environment =
    env.APPLE_ENVIRONMENT === "Production"
      ? Environment.PRODUCTION
      : Environment.SANDBOX;
  if (environment === Environment.PRODUCTION && !Number(env.APPLE_APP_ID))
    throw Error("App Store app ID is not configured.");
  return new SignedDataVerifier(
    [rootG3, rootG2, rootLegacy].map((x) => Buffer.from(x)),
    true,
    environment,
    env.APPLE_BUNDLE_ID,
    Number(env.APPLE_APP_ID) || undefined,
  );
}
export async function verifyTransaction(jws, env) {
  return (await appleVerifier(env)).verifyAndDecodeTransaction(jws);
}
export async function verifyNotification(jws, env) {
  return (await appleVerifier(env)).verifyAndDecodeNotification(jws);
}
