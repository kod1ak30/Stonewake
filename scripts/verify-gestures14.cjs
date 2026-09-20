const {execFileSync} = require('node:child_process');
const path = require('node:path');

// Keep the historical release-check entry point, but exercise the actual shared
// pointer controller and production canvas handlers. Timing is defined by the
// controller, rather than duplicated in a second VM copy of the old bridge.
execFileSync(process.execPath, ['--test', path.join(__dirname, '../frontend/test/deployment17.test.mjs')], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
