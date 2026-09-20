import globals from 'globals';

export default [{
  files: ['frontend/runtime/**/*.js', 'frontend/test/**/*.mjs', 'scripts/build.mjs', 'scripts/check-modules.mjs'],
  languageOptions: {ecmaVersion: 2022, sourceType: 'module', globals: {...globals.browser, ...globals.worker, ...globals.node, __STONEWAKE_WORKER_VERSION__: 'readonly'}},
  rules: {'no-undef': 'error', 'no-unused-vars': ['error', {argsIgnorePattern: '^_', caughtErrors: 'none'}], 'no-unreachable': 'error', 'no-constant-condition': ['error', {checkLoops: false}], 'valid-typeof': 'error'}
}];
