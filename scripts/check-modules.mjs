import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {parse} from 'acorn';
import * as scope from 'eslint-scope';
import globals from 'globals';
import {compileClient} from './build.mjs';
import {root} from '../frontend/build.config.mjs';

const built = await compileClient();
const sources = [...new Set(Object.values(built).flatMap(value => Object.keys(value.metafile.inputs)))];
const allowed = new Set(Object.keys({...globals.browser, ...globals.worker, ...globals.es2025}));
allowed.add('__STONEWAKE_WORKER_VERSION__');
// Optional host probes in the preserved React/vendor runtime, all guarded there.
const vendorProbes = new Set(['process', 'setImmediate', '__REACT_DEVTOOLS_GLOBAL_HOOK__', '__webpack_nonce__']);
const errors = [];
for (const file of sources) {
  const source = await readFile(path.join(root, file), 'utf8');
  const ast = parse(source, {ecmaVersion: 2022, sourceType: 'module', ranges: true});
  const analysis = scope.analyze(ast, {ecmaVersion: 2022, sourceType: 'module'});
  for (const ref of analysis.globalScope.through) {
    if (!allowed.has(ref.identifier.name) && !(file === 'frontend/vendor/runtime.js' && vendorProbes.has(ref.identifier.name))) errors.push(`${file}: missing import or undeclared name ${ref.identifier.name}`);
  }
  if (file.endsWith('engine13.js')) errors.push('The retired bundle is still part of the build.');
}
for (const name of ['worker', 'rules']) {
  const inputs = Object.keys(built[name].metafile.inputs);
  for (const file of inputs) if (/\/vendor\/|\/legacy\/presentation|\/interface\.js|\/premium-ui\.js|\/(Ju|Eu|ui|render)\.js/.test(file)) {
    errors.push(`${name} unexpectedly imports presentation code: ${file}`);
  }
}
if (/\.toString\(\)/.test(built.worker.code)) errors.push('Worker still serializes functions.');
if (errors.length) throw new Error([...new Set(errors)].join('\n'));
console.log(`Checked ${sources.length} module inputs: all imports resolve, worker/server are DOM-free, no retired bundle dependency.`);
