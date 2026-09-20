import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {compileClient} from '../../scripts/build.mjs';
import * as R from '../../backend/src/rules.mjs';

test('a clean compilation is reproducible and independent of retired bundle and AST patch scripts', {timeout: 30000}, async () => {
  const first = await compileClient(), second = await compileClient();
  const workerVersion = createHash('sha256').update(first.worker.code).digest('hex').slice(0, 16);
  assert.ok(first.app.code.includes(workerVersion), 'Application must version its worker URL by the worker content.');
  for (const name of ['app', 'worker', 'rules']) {
    assert.equal(first[name].code, second[name].code);
    const inputs = Object.keys(first[name].metafile.inputs);
    assert.ok(!inputs.some(file => /engine13|sync-build14|export-server-rules/.test(file)));
    if (name !== 'app') assert.ok(!inputs.some(file => /\/vendor\/|\/legacy\/presentation|\/interface\.js|\/(ui|render|Ju|Eu)\.js/.test(file)));
  }
  const build = await readFile(new URL('../../scripts/build.mjs', import.meta.url), 'utf8');
  assert.ok(!/from ['"]acorn|from ['"]eslint-scope/.test(build));
});

test('migration preserves existing resources, army, research, fleet and paid ownership without another gem grant', () => {
  const now = 1800000000000, saved = R.Y(R.Al(now), now);
  saved.gems = 1023;
  saved.army.infantry = 13;
  saved.unitLevels = {infantry: 7, archer: 5};
  saved.fleet = [{id: 'owned', kind: 'cog', level: 4, hull: 0.8}];
  saved.premium.owned.push('palette:ember');
  const original = structuredClone(saved), restored = R.Y(saved, now);
  for (const key of ['resources', 'army', 'unitLevels', 'fleet', 'gems', 'campaign', 'premium', 'buildings']) {
    assert.deepEqual(restored[key], original[key], `${key} changed during module migration.`);
  }
  assert.deepEqual(R.Y(restored, now), restored);
  assert.deepEqual(saved, original);
});
