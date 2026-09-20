import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {transformSync} from 'esbuild';

const web=new URL('../../Stonewake/Web/',import.meta.url);
const index=readFileSync(new URL('index.html',web),'utf8');
const styles=[...index.matchAll(/<link\b[^>]*href="([^"?]+\.css)(?:\?[^"]*)?"[^>]*>/g)].map(match=>match[1].replace(/^\//,''));
const geometry=/^(?:transform|translate|scale|rotate|(?:min-|max-)?(?:width|height)|margin(?:-.+)?|padding(?:-.+)?|border(?:-.+)?-width|position|inset(?:-.+)?|top|bottom|left|right|display|visibility|font-size|line-height)$/;

test('the last loaded game stylesheet prevents every legacy active button transform on touch',()=>{
 assert.equal(styles.at(-1),'interface17.css');
 const css=readFileSync(new URL('interface17.css',web),'utf8');
 const touch=css.match(/@media\s*\(hover\s*:\s*none\)\s*\{\s*button:active:not\(:disabled\)\s*\{([^}]+)\}\s*\}/);
 assert.ok(touch,'Touch-only feedback must retain an explicit stable-hitbox override.');
 for(const property of ['transform','translate','scale','rotate'])assert.match(touch[1],new RegExp('(?:^|;)'+property+':none!important(?:;|$)'));
 assert.match(touch[1],/filter:brightness\(1\.08\)!important/);
 assert.doesNotMatch(touch[1],/transition-property:[^;}]*(?:transform|translate|scale|rotate)/);
 assert.deepEqual(transformSync(css,{loader:'css'}).warnings,[]);
 const overrides=new Set(['transform','translate','scale','rotate']);
 for(const path of styles){
  const source=readFileSync(new URL(path,web),'utf8');
  for(const [,selector,body]of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
   if(!selector.includes(':active')||!/(?:button|primary|build-card|recruit-button)/.test(selector))continue;
   for(const declaration of body.split(';')){
    const colon=declaration.indexOf(':');if(colon<0)continue;
    const property=declaration.slice(0,colon).trim(),value=declaration.slice(colon+1).trim();
    if(!geometry.test(property))continue;
    assert.ok(overrides.has(property),path+' active selector changes unguarded geometry: '+property);
    if(path!=='interface17.css')assert.ok(!value.includes('!important'),path+' legacy active geometry must not outrank the touch guard.');
   }
  }
 }
});
