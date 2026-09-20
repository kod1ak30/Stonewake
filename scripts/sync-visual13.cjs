const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js');
const start='// Stonewake sculpted visual system.',end='// End Stonewake sculpted visual system.';
const bundle=fs.readFileSync(file,'utf8'),a=bundle.indexOf(start),b=bundle.indexOf(end,a);
if(a<0||b<a)throw Error('Missing visual system boundaries');
fs.writeFileSync(file,bundle.slice(0,a)+fs.readFileSync(path.join(root,'client/visual13.js'),'utf8').trimEnd()+bundle.slice(b+end.length));
console.log('Synchronized Build 13 visual system');
