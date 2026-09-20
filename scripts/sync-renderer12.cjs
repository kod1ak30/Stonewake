const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'client/battle-renderer.js');
let helper=fs.readFileSync(source,'utf8');
const sourceMarker='// Editable model geometry.';
const premiumMarker='// Premium presentation uses saved appearance only;';
if(helper.includes(premiumMarker))helper=helper.slice(0,helper.indexOf(premiumMarker));
if(helper.includes(sourceMarker))helper=helper.slice(0,helper.indexOf(sourceMarker));
helper=helper.trimEnd()+'\n\n'+fs.readFileSync(path.join(root,'client/premium-presentation.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'client/art-source/canonical-models.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'client/art-source/stonewake-rigs-v12.json'),'utf8'));
const marker='const SWRigSource = ';
if(helper.includes(marker)){const start=helper.indexOf(marker),end=helper.indexOf(';\n',start);helper=helper.slice(0,start)+marker+JSON.stringify(data)+';\n'+helper.slice(end+2);fs.writeFileSync(source,helper);}
const bundle=path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),before=fs.readFileSync(bundle,'utf8'),start=before.indexOf('// Stone fortifications use'),end=before.indexOf('// Coastal gameplay uses',start);
if(start<0||end<start)throw Error('Renderer section boundaries missing');
fs.writeFileSync(bundle,before.slice(0,start)+helper.trimEnd()+'\n\n'+before.slice(end));
console.log('Synchronized exact renderer section and editable rig data');
