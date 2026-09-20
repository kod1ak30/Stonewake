#!/usr/bin/env node
// Read-only release evidence check. Never deploys, enables billing or opens player saves.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = 'com.chrismozer.stonewake';
const landscape = ['UIInterfaceOrientationLandscapeLeft', 'UIInterfaceOrientationLandscapeRight'];
const gate = (status, name, detail) => ({status, name, detail});
const exactSet = (actual, expected) => Array.isArray(actual) && actual.length === expected.length && expected.every(item => actual.includes(item));
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function hostedHTTPS(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash &&
      host.includes('.') && !host.includes(':') && !/^\d+(\.\d+){3}$/.test(host) &&
      !/(^|\.)(localhost|local|test|invalid|example)(\.|$)|placeholder|replace[-_]?me/.test(host) &&
      !host.endsWith('.internal');
  } catch { return false; }
}

export function catalogStatus(raw, collections = []) {
  let value;
  try { value = JSON.parse(raw || '{}'); } catch { return {valid: false, count: 0}; }
  if (!object(value)) return {valid: false, count: 0};
  const entries = Object.entries(value);
  const valid = entries.every(([id, rawItem]) => {
    if (!/^com\.chrismozer\.stonewake\.[a-zA-Z0-9._-]+$/.test(id) || /placeholder|replace[-_]?me|example/i.test(id)) return false;
    const item = typeof rawItem === 'number' ? {type: 'consumable', gems: rawItem} : rawItem;
    return object(item) && ((item.type === 'consumable' && Number.isSafeInteger(item.gems) && item.gems > 0 && item.gems <= 100000) ||
      (item.type === 'nonConsumable' && collections.includes(item.collectionId)));
  });
  return {valid, count: entries.length};
}

export function evaluateConfiguration({info, privacy, wrangler, collections = []}) {
  const results = [];
  const local = (ok, name, detail) => results.push(gate(ok ? 'PASS' : 'FAIL', name, detail));
  const configured = (ok, name, detail) => results.push(gate(ok ? 'PASS' : 'BLOCKED', name, detail));
  local(info.CFBundleVersion === '18' && info.CFBundleShortVersionString === '1.0', 'Native version', 'Source declares version 1.0, build 18; this does not inspect a signed archive.');
  local(exactSet(info.UISupportedInterfaceOrientations, landscape) && exactSet(info['UISupportedInterfaceOrientations~ipad'], landscape) && landscape.includes(info.UIInterfaceOrientation) && info.UIStatusBarHidden === true, 'Landscape source contract', 'Both landscape orientations only, landscape launch and hidden status bar.');
  local(info.UILaunchStoryboardName === 'LaunchScreen', 'Branded launch configuration', 'LaunchScreen is selected in the source plist.');

  const types = privacy.NSPrivacyCollectedDataTypes || [];
  const expectedTypes = ['UserID', 'GameplayContent', 'PurchaseHistory'].map(type => 'NSPrivacyCollectedDataType' + type);
  const apis = privacy.NSPrivacyAccessedAPITypes || [];
  const privacyOK = privacy.NSPrivacyTracking === false && exactSet(privacy.NSPrivacyTrackingDomains, []) &&
    exactSet(types.map(type => type.NSPrivacyCollectedDataType), expectedTypes) && types.every(type => type.NSPrivacyCollectedDataTypeTracking === false && type.NSPrivacyCollectedDataTypeLinked === true && exactSet(type.NSPrivacyCollectedDataTypePurposes, ['NSPrivacyCollectedDataTypePurposeAppFunctionality'])) &&
    apis.some(api => api.NSPrivacyAccessedAPIType === 'NSPrivacyAccessedAPICategoryUserDefaults' && api.NSPrivacyAccessedAPITypeReasons?.includes('CA92.1')) &&
    apis.some(api => api.NSPrivacyAccessedAPIType === 'NSPrivacyAccessedAPICategorySystemBootTime' && api.NSPrivacyAccessedAPITypeReasons?.includes('35F9.1'));
  local(privacyOK, 'Expected privacy manifest', 'No tracking declared; intended online account/gameplay/purchase functionality and current required-reason APIs are declared. Final binary and disclosure review remain separate.');

  const vars = wrangler.vars || {};
  const database = wrangler.d1_databases?.find(item => item.binding === 'DB');
  configured(hostedHTTPS(info.StonewakeServiceURL), 'Service URL configuration', 'Requires a non-placeholder hosted HTTPS endpoint. Syntax validation never proves deployment, ownership or reachability.');
  configured(typeof database?.database_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(database.database_id) && !/^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(database.database_id), 'D1 configuration', 'Requires a non-placeholder database ID. This does not prove provisioning, migrations, isolation or backups.');
  local(vars.APPLE_BUNDLE_ID === bundle, 'Apple bundle namespace', 'Backend bundle audience matches the intended Stonewake bundle. Signing capabilities still require external verification.');
  configured(/^[1-9]\d*$/.test(String(vars.APPLE_APP_ID || '')), 'Apple app record configuration', 'Requires the numeric App Store Connect app ID; its ownership is not established by this check.');
  configured(vars.APPLE_ENVIRONMENT === 'Production', 'Production verification environment', 'Sandbox configuration is appropriate for testing but is not a production service configuration. Do not switch until the release gates are complete.');

  const catalog = catalogStatus(vars.PRODUCT_CATALOG, collections);
  const enabled = vars.PURCHASES_ENABLED === 'true';
  const explicitFlag = ['true', 'false'].includes(vars.PURCHASES_ENABLED);
  local(explicitFlag && (!enabled || (catalog.valid && catalog.count > 0)), 'Purchase configuration safety', 'Purchases must be explicitly disabled or paired with a nonempty valid catalog. Catalog syntax cannot establish real Apple product availability.');
  configured(catalog.valid && catalog.count > 0, 'Product catalog configuration', 'Requires valid product IDs, bounded consumable grants or existing cosmetic collections; real StoreKit products remain a separate gate.');
  configured(enabled && catalog.valid && catalog.count > 0, 'Commercial purchase activation', 'Currently held unless explicitly enabled with valid configuration. Never enable merely to make this check pass.');
  return results;
}

export function evaluateLocalContract(native, experience, app, service) {
  const diagnostic = native.split('@MainActor final class StonewakeDiagnostics15')[1]?.split('@MainActor final class StonewakeNative15')[0] || '';
  const exportCase = native.split('case "diagnostics.export":')[1]?.split('default:')[0] || '';
  const requestCase = native.split('case "notifications.request":')[1]?.split('case "notifications.sync":')[0] || '';
  const localOnly = diagnostic.includes('allowedEvents.contains(event)') && diagnostic.includes('allowedMetrics.contains') && diagnostic.includes('events.count > 300') && diagnostic.includes('guard enabled') && diagnostic.includes('"localOnly": true') &&
    exportCase.includes('payload["userInitiated"] as? Bool == true') && requestCase.includes('payload["userInitiated"] as? Bool == true') &&
    !/URLSession|registerForRemoteNotifications/.test(native) && !/registerForRemoteNotifications/.test(app) &&
    !/\bfetch\s*\(|sendBeacon\s*\(|XMLHttpRequest/.test(experience) && experience.includes('events.slice(-200)') && experience.includes('SWCleanMetrics15');
  return [gate(localOnly ? 'PASS' : 'FAIL', 'Local support and notification source guards', 'Static allowlist/bounds/user-action checks. Local reports are not uploaded by this layer; a full release-binary privacy audit remains required.'),
    gate(service.includes('env.PURCHASES_ENABLED !== "true"') ? 'PASS' : 'FAIL', 'Backend purchase guard', 'Purchase delivery still checks the explicit server enable flag.')];
}

export const externalGates = [
  gate('BLOCKED', 'Live backend and operations evidence', 'No live deployment, intended account, migrations, authenticated health, recovery, account deletion or production load evidence is established by local checks.'),
  gate('BLOCKED', 'Real Apple identity and StoreKit evidence', 'Local success cases use injected fixtures. Forged-token rejection is valuable, but real sandbox/TestFlight success, pending/cancel/restore/refund and account ownership must be verified.'),
  gate('BLOCKED', 'Distribution and final archive', 'Signed release archive, entitlements, provisioning, App Store Connect records/contracts/products and TestFlight distribution require separate verified evidence.'),
  gate('BLOCKED', 'Physical iPhone and player acceptance', 'Touch deployment, menus, villagers, audio, notifications, recovery, sustained frame pacing and fresh-player usability require acceptance on the exact release candidate.'),
  gate('BLOCKED', 'Rights, privacy and storefront review', 'Complete asset/audio license inventory, final privacy disclosures/policy, support/account deletion, age rating, screenshots and review notes remain manual release gates.')
];

async function readPlist(relative) {
  const result = spawnSync('/usr/bin/plutil', ['-convert', 'json', '-o', '-', path.join(root, relative)], {encoding: 'utf8', timeout: 10000});
  if (result.status !== 0) throw new Error('plist-read');
  return JSON.parse(result.stdout);
}

function runCheck(name, executable, args, description) {
  console.log(`CHECK   ${name}`);
  const result = spawnSync(executable, args, {cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024});
  // Do not echo child output: future test failures could include account or configuration data.
  const count = result.stdout?.match(/(?:#|ℹ)\s+tests\s+(\d+)/)?.[1] || result.stdout?.match(/Native15: (\d+) Swift checks/)?.[1];
  return gate(result.status === 0 ? 'PASS' : 'FAIL', name, result.status === 0 ? `${count ? count + ' checks passed. ' : ''}${description}` : 'Local command failed or timed out. Run the documented individual command locally to inspect its output. No child output or configuration values are printed here.');
}

export function selfTest() {
  assert.equal(hostedHTTPS(''), false);
  assert.equal(hostedHTTPS('http://stonewake.app'), false);
  assert.equal(hostedHTTPS('https://user:secret@stonewake.app'), false);
  assert.equal(hostedHTTPS('https://example.com'), false);
  assert.equal(hostedHTTPS('https://127.0.0.1'), false);
  assert.equal(hostedHTTPS('https://api.stonewake.app'), true);
  assert.deepEqual(catalogStatus('{}'), {valid: true, count: 0});
  assert.equal(catalogStatus('[]').valid, false);
  assert.equal(catalogStatus('{broken').valid, false);
  assert.equal(catalogStatus('{"com.other.gems":1}').valid, false);
  assert.equal(catalogStatus('{"com.chrismozer.stonewake.gems":100001}').valid, false);
  assert.equal(catalogStatus('{"com.chrismozer.stonewake.gems":2.5}').valid, false);
  assert.equal(catalogStatus('{"com.chrismozer.stonewake.gems":250}').valid, true);
  assert.equal(catalogStatus('{"com.chrismozer.stonewake.cosmetic":{"type":"nonConsumable","collectionId":"missing"}}', ['harbor']).valid, false);
  assert.equal(catalogStatus('{"com.chrismozer.stonewake.cosmetic":{"type":"nonConsumable","collectionId":"harbor"}}', ['harbor']).valid, true);
  const fixture = {info: {}, privacy: {}, wrangler: {vars: {PURCHASES_ENABLED: 'true', PRODUCT_CATALOG: '{}'}}};
  const find = input => evaluateConfiguration(input).find(item => item.name === 'Purchase configuration safety').status;
  assert.equal(find(fixture), 'FAIL');
  fixture.wrangler.vars.PURCHASES_ENABLED = 'false';
  assert.equal(find(fixture), 'PASS');
  fixture.wrangler.vars.PURCHASES_ENABLED = 'maybe';
  assert.equal(find(fixture), 'FAIL');
  assert.ok(externalGates.every(item => item.status === 'BLOCKED'));
  console.log('PASS    Release checker self-test: 19 assertions; example configuration never establishes external release evidence.');
}

async function main() {
  if (process.argv.includes('--self-test')) { selfTest(); return; }
  if (process.argv.slice(2).some(arg => arg !== '--config-only')) throw new Error('unsupported-argument');
  console.log('Stonewake Build 18 release evidence check');
  console.log('Read-only configuration and local tests. No deployment, purchase activation, save access or device installation.');
  const [info, privacy, config, native, experience, app, service, rules] = await Promise.all([
    readPlist('Stonewake/Info.plist'), readPlist('Stonewake/PrivacyInfo.xcprivacy'), readFile(path.join(root, 'backend/wrangler.jsonc'), 'utf8'),
    readFile(path.join(root, 'Stonewake/StonewakeNative15.swift'), 'utf8'), readFile(path.join(root, 'client/build15/experience.js'), 'utf8'),
    readFile(path.join(root, 'Stonewake/StonewakeApp.swift'), 'utf8'), readFile(path.join(root, 'backend/src/service.mjs'), 'utf8'),
    import('../frontend/core/server-entry.js')
  ]);
  const parsed = ts.parseConfigFileTextToJson('wrangler.jsonc', config);
  if (parsed.error) throw new Error('configuration-parse');
  const results = evaluateConfiguration({info, privacy, wrangler: parsed.config, collections: rules.SWPremiumCollections.map(item => item.id)});
  results.push(...evaluateLocalContract(native, experience, app, service));
  if (process.argv.includes('--config-only')) {
    results.push(gate('BLOCKED', 'Local test evidence', 'Tests were intentionally not run. Remove --config-only for fresh module, frontend, backend and native-policy results.'));
  } else {
    results.push(runCheck('Module/type/lint checks', 'npm', ['run', 'check'], 'Current source checks only, not a signed app build.'));
    results.push(runCheck('Frontend regression suite', 'npm', ['test'], 'Includes in-memory reproducible compilation, guide/privacy, Worker and presentation checks.'));
    results.push(runCheck('Local backend suite', 'npm', ['test', '--prefix', 'backend'], 'Local D1 fixtures and actual verifier forged-input rejection; no genuine successful Apple receipt is proved.'));
    results.push(runCheck('Native policy suite', 'python3', ['scripts/verify-native15.py'], 'Compiled extracted Swift validators use disposable saves/defaults. This is not a full native build or physical-device test.'));
  }
  results.push(...externalGates);
  for (const item of results) console.log(`${item.status.padEnd(7)} ${item.name}: ${item.detail}`);
  const total = status => results.filter(item => item.status === status).length;
  console.log(`\nResult: ${total('PASS')} PASS, ${total('FAIL')} FAIL, ${total('BLOCKED')} BLOCKED.`);
  console.log('Commercial release remains blocked until external evidence is independently verified. See docs/BUILD15-LAUNCH-GATES.md.');
  process.exitCode = total('FAIL') ? 2 : total('BLOCKED') ? 1 : 0;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch(() => {
    console.error('FAIL    Release check could not read or validate its required local inputs. No configuration values or child output were printed.');
    process.exitCode = 2;
  });
}
