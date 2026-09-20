import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Kl} from '../src/rules.mjs';
for(const file of ['combat-legacy.json','naval-v2-legacy.json'])test('shared server preserves historical replay '+file,async()=>{const fixture=JSON.parse(await readFile(new URL('../../scripts/fixtures/'+file,import.meta.url),'utf8'));assert.equal(createHash('sha256').update(JSON.stringify(Kl(fixture.input))).digest('hex'),fixture.sha256);});
