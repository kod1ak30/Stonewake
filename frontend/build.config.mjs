import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const common = {
  absWorkingDir: root,
  bundle: true,
  minify: false,
  treeShaking: false,
  target: 'es2022',
  charset: 'utf8',
  legalComments: 'eof',
  sourcemap: 'external',
  sourcesContent: true,
  metafile: true,
  write: false,
  logLevel: 'warning'
};
export const targets = {
  app: {entryPoints: ['frontend/app.js'], outfile: '.build/assets/app.js', format: 'esm', platform: 'browser'},
  worker: {entryPoints: ['frontend/runtime/battle-worker.js'], outfile: '.build/assets/battle-worker.js', format: 'iife', platform: 'browser'},
  rules: {entryPoints: ['frontend/core/server-entry.js'], outfile: '.build/assets/rules.mjs', format: 'esm', platform: 'neutral'}
};
