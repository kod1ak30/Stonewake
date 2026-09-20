// Compatibility command. Frontend, dedicated worker and authoritative service
// now compile the same explicit modules in one reproducible build.
import('./build.mjs').then(({buildClient})=>buildClient()).catch(error=>{console.error(error);process.exitCode=1});
