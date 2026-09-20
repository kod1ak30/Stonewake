// Compatibility entry for existing rule tests. The maintained source is now an
// ordinary shared ES module, not declarations extracted from a shipped bundle.
const path=require('node:path');
const {pathToFileURL}=require('node:url');
module.exports=async(extra=[])=>{
 const rules=await import(pathToFileURL(path.join(__dirname,'../frontend/core/server-entry.js')).href);
 for(const name of extra)if(!(name in rules))throw Error('Missing shared rule export '+name);
 return rules;
};
