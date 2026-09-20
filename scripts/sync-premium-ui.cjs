// Copy only these owned UI blocks. Engine, renderer, and Ju integrations are preserved.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js');let text=fs.readFileSync(file,'utf8');
for(const [source,start,end] of [['client/premium-ui.js','// Stonewake premium interface.','// End Stonewake premium interface.'],['client/interface.js',"// Stonewake's mobile interface.",'function Ju({ deviceOnly:']]){const a=text.indexOf(start),b=text.indexOf(end,a);if(a<0||b<0)throw Error('Missing UI synchronization boundary');text=text.slice(0,a)+fs.readFileSync(path.join(root,source),'utf8').trimEnd()+'\n'+text.slice(b+(source.includes('premium-ui')?end.length:0));}
fs.writeFileSync(file,text);
