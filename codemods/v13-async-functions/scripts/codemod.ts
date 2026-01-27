import type { Transform } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { Edit, SgNode } from '@codemod.com/jssg-types/main';

const FUNCTIONS_TO_RENAME = new Map([
  ['render', 'renderAsync'],
  ['renderHook', 'renderHookAsync'],
  ['fireEvent', 'fireEventAsync'],
]);

export default async function transform(
  root: Parameters<Transform<TSX>>[0],
  options?: Parameters<Transform<TSX>>[1],
): ReturnType<Transform<TSX>> {
  const rootNode = root.root();
  const edits: Edit[] = [];

  const rntlImports = findRNTLImportStatements(rootNode);

  if (rntlImports.length === 0) {
    return null;
  }

  const importedFunctions = extractImportedFunctionNames(rntlImports, edits);

  if (importedFunctions.size === 0) {
    return null;
  }

  renameFunctionsInUsages(rootNode, importedFunctions, edits);

  if (edits.length === 0) {
    return null;
  }

  edits.sort((a, b) => b.startPos - a.startPos);

  return rootNode.commitEdits(edits);
}

function findRNTLImportStatements(rootNode: SgNode<TSX>): SgNode<TSX>[] {
  return rootNode.findAll({
    rule: {
      kind: 'import_statement',
      has: {
        kind: 'string',
        regex: '@testing-library/react-native',
      },
    },
  });
}

function extractImportedFunctionNames(
  rntlImports: SgNode<TSX>[],
  edits: Edit[],
): Set<string> {
  const importedFunctions = new Set<string>();

  for (const importStmt of rntlImports) {
    const importClause = importStmt.find({
      rule: { kind: 'import_clause' },
    });
    if (!importClause) continue;

    const namedImports = importClause.find({
      rule: { kind: 'named_imports' },
    });
    if (namedImports) {
      const specifiers = namedImports.findAll({
        rule: { kind: 'import_specifier' },
      });

      for (const specifier of specifiers) {
        const identifier = specifier.find({
          rule: { kind: 'identifier' },
        });
        if (identifier) {
          const funcName = identifier.text();
          if (FUNCTIONS_TO_RENAME.has(funcName)) {
            const newName = FUNCTIONS_TO_RENAME.get(funcName)!;
            const identifierRange = identifier.range();
            edits.push({
              startPos: identifierRange.start.index,
              endPos: identifierRange.end.index,
              insertedText: newName,
            });
            importedFunctions.add(funcName);
          }
        }
      }
    }

    const defaultImport = importClause.find({
      rule: { kind: 'identifier' },
    });
    if (defaultImport) {
      const funcName = defaultImport.text();
      if (FUNCTIONS_TO_RENAME.has(funcName)) {
        const newName = FUNCTIONS_TO_RENAME.get(funcName)!;
        const defaultImportRange = defaultImport.range();
        edits.push({
          startPos: defaultImportRange.start.index,
          endPos: defaultImportRange.end.index,
          insertedText: newName,
        });
        importedFunctions.add(funcName);
      }
    }

    const namespaceImport = importClause.find({
      rule: { kind: 'namespace_import' },
    });
    if (namespaceImport) {
      FUNCTIONS_TO_RENAME.forEach((_, funcName) => importedFunctions.add(funcName));
      break;
    }
  }

  return importedFunctions;
}

function renameFunctionsInUsages(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
  edits: Edit[],
): void {
  for (const funcName of importedFunctions) {
    const newName = FUNCTIONS_TO_RENAME.get(funcName)!;

    // Rename identifiers (direct function calls)
    const identifiers = rootNode.findAll({
      rule: {
        kind: 'identifier',
        regex: `^${funcName}$`,
      },
    });

    for (const identifier of identifiers) {
      const parent = identifier.parent();
      // Skip if it's already in an import specifier (we already handled imports)
      if (parent && parent.is('import_specifier')) {
        continue;
      }
      const identifierRange = identifier.range();
      edits.push({
        startPos: identifierRange.start.index,
        endPos: identifierRange.end.index,
        insertedText: newName,
      });
    }

    // Rename member expressions (e.g., fireEvent.press)
    const memberExpressions = rootNode.findAll({
      rule: {
        kind: 'member_expression',
        has: {
          field: 'object',
          kind: 'identifier',
          regex: `^${funcName}$`,
        },
      },
    });

    for (const memberExpr of memberExpressions) {
      const object = memberExpr.field('object');
      if (object && object.is('identifier')) {
        const objectRange = object.range();
        edits.push({
          startPos: objectRange.start.index,
          endPos: objectRange.end.index,
          insertedText: newName,
        });
      }
    }
  }
}
