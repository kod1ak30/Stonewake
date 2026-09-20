import {build} from 'esbuild';
import {readFile, writeFile, mkdir, rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {common, targets, root} from '../frontend/build.config.mjs';

const digest = data => createHash('sha256').update(data).digest('hex');
const outputPaths = {
  app: 'Stonewake/Web/assets/index-BPhrguZ3.js',
  worker: 'Stonewake/Web/assets/battle-worker.js',
  rules: 'backend/src/rules.mjs'
};

/** Compile maintained modules directly. This intentionally does not read the
 * frozen engine13.js, splice strings, extract AST declarations or run old syncs.
 */
export async function compileClient() {
  async function compile(name, define = {}) {
    const result = await build({...common, ...targets[name], define});
    const program = result.outputFiles.find(file => !file.path.endsWith('.map'));
    const map = result.outputFiles.find(file => file.path.endsWith('.map'));
    if (!program) throw new Error(`Missing compiler output for ${name}.`);
    return [name, {code: program.text, map: map?.text, metafile: result.metafile}];
  }
  const entries = await Promise.all(['worker', 'rules'].map(name => compile(name)));
  const workerVersion = digest(entries.find(([name]) => name === 'worker')[1].code).slice(0, 16);
  entries.push(await compile('app', {__STONEWAKE_WORKER_VERSION__: JSON.stringify(workerVersion)}));
  return Object.fromEntries(entries);
}

async function atomicWrite(relativePath, content) {
  const destination = path.join(root, relativePath);
  await mkdir(path.dirname(destination), {recursive: true});
  const temporary = destination + '.building-' + process.pid;
  await writeFile(temporary, content);
  await rename(temporary, destination);
}

export async function buildClient() {
  const results = await compileClient();
  const rulesHash = digest(results.rules.code);
  const programs = {
    app: results.app.code,
    worker: results.worker.code,
    rules: `${results.rules.code}\n// Generated from shared ES modules by npm run build. Do not edit.\nexport const RULES_HASH = ${JSON.stringify(rulesHash)};\n`
  };
  const manifest = {build: 18, rulesHash, outputs: {}};
  for (const [name, code] of Object.entries(programs)) {
    await atomicWrite(outputPaths[name], code);
    manifest.outputs[name] = {path: outputPaths[name], bytes: Buffer.byteLength(code), sha256: digest(code)};
    await atomicWrite(`.build/${name}-metafile.json`, JSON.stringify(results[name].metafile, null, 2) + '\n');
    await atomicWrite(targets[name].outfile, code);
    if (results[name].map) await atomicWrite(targets[name].outfile + '.map', results[name].map);
  }
  const indexPath = path.join(root, 'Stonewake/Web/index.html');
  let html = await readFile(indexPath, 'utf8');
  for (const asset of ['assets/index-Cbkaoajb.css', 'interface14.css', 'interface15.css', 'interface17.css', 'assets/index-BPhrguZ3.js', 'online-game.js']) {
    let data;
    try { data = await readFile(path.join(root, 'Stonewake/Web', asset)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp('/' + escaped + '(?:\\?[^"\\s]*)?"', 'g'), '/' + asset + '?v=18-' + digest(data).slice(0, 10) + '"');
  }
  await atomicWrite('Stonewake/Web/index.html', html);
  await atomicWrite('.build/build-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Built app, dedicated combat worker, and shared server rules (${rulesHash.slice(0, 12)}).`);
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildClient();
