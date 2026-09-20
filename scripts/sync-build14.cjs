const fs=require('fs'),path=require('path'),acorn=require('../backend/node_modules/acorn');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
let source=read('client/build14/engine13.js');
const sections=[['client/interface.js',"// Stonewake's mobile interface.",'function Ju({ deviceOnly:'],['client/premium-ui.js','// Stonewake premium interface.','// End Stonewake premium interface.'],['client/visual13.js','// Stonewake sculpted visual system.','// End Stonewake sculpted visual system.']];
for(const [file,start,end]of sections){const a=source.indexOf(start),b=source.indexOf(end,a);if(a<0||b<a)throw Error('Section missing '+file);source=source.slice(0,a)+read(file)+'\n'+source.slice(b);}
const modules=['rules','naval','simulation','render','ui','gestures'].map(name=>'client/build14/'+name+'.js').filter(p=>fs.existsSync(path.join(root,p))).map(read).join('\n');
const opts={ecmaVersion:2022,sourceType:'module'},moduleAst=acorn.parse(modules,opts),overrides=new Set(moduleAst.body.filter(n=>n.type==='FunctionDeclaration').map(n=>n.id.name));
const aliases={SWDrawSculptedBuilding13:'SWLegacySculpted13',Y:'SWLegacyY13',Ul:'SWLegacyUl13',Fu:'SWLegacyFu13',Bl:'SWLegacyBl13',ol:'SWLegacyFleet13',SWNavalStep:'SWLegacyNavalStep13',SWNavalShips:'SWLegacyNavalShips13',SWDrawBuilding13:'SWLegacyBuilding13',SWDrawUnit13:'SWLegacyUnit13',SWDrawCollapse:'SWLegacyCollapse13',SWDrawNavalUnit:'SWLegacyDrawShip13'};
const ast=acorn.parse(source,opts),edits=[];
for(const n of ast.body){if(n.type!=='FunctionDeclaration')continue;const name=n.id.name;
 if(['Ju','Eu'].includes(name))edits.push([n.start,n.end,(name==='Ju'?modules+'\n':'')+read('client/build14/'+name+'.js')]);
 else if(overrides.has(name)){if(aliases[name])edits.push([n.id.start,n.id.end,aliases[name]]);else edits.push([n.start,n.end,'']);}
}
for(const [start,end,text]of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+text+source.slice(end);
acorn.parse(source,opts);fs.writeFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),source);
console.log('Build 14 synced: '+overrides.size+' shared functions, '+source.length+' bytes');
const crypto=require('crypto'),htmlPath=path.join(root,'Stonewake/Web/index.html');
let html=fs.readFileSync(htmlPath,'utf8');
for(const asset of ['assets/index-Cbkaoajb.css','interface14.css','assets/index-BPhrguZ3.js','online-game.js']) {
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'Stonewake/Web',asset))).digest('hex').slice(0,10);
 html=html.replace(new RegExp('/'+asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:\\?[^"\\s]*)?"','g'),'/'+asset+'?v=14-'+hash+'"');
}
fs.writeFileSync(htmlPath,html);
