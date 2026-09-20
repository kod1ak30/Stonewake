// Load the exact shipped pure game rules for simulation without mounting the UI.
const fs=require('fs'),path=require('path'),acorn=require('../backend/node_modules/acorn'),scope=require('../backend/node_modules/eslint-scope');
module.exports=async(extra=[])=>{
 const source=fs.readFileSync(path.join(__dirname,'../Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8'),options={ecmaVersion:2022,sourceType:'module',ranges:true},ast=acorn.parse(source,options),defs=new Map(),pos=new Map();
 for(const n of ast.body){if(n.type==='FunctionDeclaration'){defs.set(n.id.name,source.slice(n.start,n.end));pos.set(n.id.name,n.start)}if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier'){defs.set(d.id.name,n.kind+' '+source.slice(d.start,d.end)+';');pos.set(d.id.name,d.start)}}
 const names=[...new Set(['Al','Y','Ul','Ml','Pl','X','Z','Il','SWCapacity','SWBuildingLimit','Rc','Lc','SWCanPlace','Vl','Kl','Gl','Wl','wl','Jl','Fu','Gc','Hl','J','Sl','Tl','Dl','El','Ol','SWCivicProjects','SWCivicProject','SWCivicBonuses','SWCivicStage','SWRaidInput','SWRaidStatus','SWSettleScheduledRaid','SWMigrateRaids','SWCityRequest','SWLandStats','nl','tl','fl','SWDefenseInput',...extra])],selected=new Map(),builtins=new Set(['Object','Array','JSON','Math','Date','Number','String','Boolean','Map','Set','Error','Infinity','NaN','undefined','Uint8Array']);
 const refs=code=>scope.analyze(acorn.parse(code,options),{ecmaVersion:2022,sourceType:'module'}).globalScope.through.map(r=>r.identifier.name);
 function add(name){if(selected.has(name)||builtins.has(name))return;const code=defs.get(name);if(!code)throw Error('Missing pure rule '+name);selected.set(name,code);for(const ref of refs(code))add(ref)}
 names.forEach(add);
 const mutations=ast.body.filter(n=>{const c=source.slice(n.start,n.end);return c.startsWith('Object.assign(Sl,')||c.startsWith('Dl.push(')||c.startsWith('for(const province of Ac)')}).map(n=>source.slice(n.start,n.end));
 for(const m of mutations)refs(m).forEach(add);
 const code=[...selected].sort((a,b)=>pos.get(a[0])-pos.get(b[0])).map(x=>x[1]).join('\n')+'\n'+mutations.join('\n')+'\nexport{'+names.join(',')+'};';
 return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
};
