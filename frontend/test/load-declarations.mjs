import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parse} from 'acorn';

/** Isolate exact production declarations for pure tests without mounting React.
 * This test helper is not part of the frontend build or runtime.
 */
export function loadDeclarations(file, names, environment = {}) {
  const source = readFileSync(file, 'utf8');
  const ast = parse(source, {ecmaVersion: 2022, sourceType: 'module'});
  const definitions = new Map();
  for (let node of ast.body) {
    if (node.type === 'ExportNamedDeclaration' && node.declaration) node = node.declaration;
    if (node.type === 'FunctionDeclaration') definitions.set(node.id.name, source.slice(node.start, node.end));
    if (node.type === 'VariableDeclaration') for (const declaration of node.declarations) {
      if (declaration.id.type === 'Identifier') definitions.set(declaration.id.name, node.kind + ' ' + source.slice(declaration.start, declaration.end) + ';');
    }
  }
  const code = names.map(name => {
    if (!definitions.has(name)) throw new Error(`Declaration ${name} missing from ${file}.`);
    return definitions.get(name);
  }).join('\n');
  const context = vm.createContext(environment);
  return vm.runInContext(code + '\n({' + names.join(',') + '})', context);
}
