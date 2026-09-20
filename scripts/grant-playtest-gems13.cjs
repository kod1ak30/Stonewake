// Explicitly requested local playtest gift. Run on a backed-up device save only.
const fs=require('node:fs');
const grantId='stonewake-build13-user-request-1000';
function grant(save){
  if(save?.state?.schema!==1||!Array.isArray(save.state.buildings)||!save.state.buildings.length||!Number.isSafeInteger(save.state.gems)||save.state.gems<0)throw Error('Invalid local kingdom save');
  const out=structuredClone(save);
  if(out.state.playtestGrants?.[grantId])return out;
  out.state.gems+=1000;
  out.state.revision+=1;
  out.state.playtestGrants={...out.state.playtestGrants,[grantId]:{amount:1000,build:13}};
  return out;
}
if(require.main===module){
  const [input,output]=process.argv.slice(2);
  if(!input||!output||input===output)throw Error('Supply separate input backup and output paths');
  const before=JSON.parse(fs.readFileSync(input,'utf8')),after=grant(before);
  fs.writeFileSync(output,JSON.stringify(after));
  console.log(JSON.stringify({before:before.state.gems,after:after.state.gems,added:after.state.gems-before.state.gems,grantId}));
}
module.exports={grant,grantId};
