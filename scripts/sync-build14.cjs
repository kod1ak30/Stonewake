// Compatibility command retained for old local workflows. Build 15 compiles
// maintained ES modules; the old marker/AST patch pipeline is retired.
import('./build.mjs').then(({buildClient})=>buildClient()).catch(error=>{console.error(error);process.exitCode=1});
