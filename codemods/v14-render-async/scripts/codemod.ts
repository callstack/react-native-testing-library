import type { Transform } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { Edit, SgNode } from '@codemod.com/jssg-types/main';

// Functions that should be transformed to async
const FUNCTIONS_TO_TRANSFORM = new Set(['render', 'renderHook', 'act']);

// Variants that should be skipped (they're already async or have different behavior)
const SKIP_VARIANTS = new Set(['renderAsync', 'unsafe_renderHookSync', 'unsafe_act']);

const transform: Transform<TSX> = async (root) => {
  const rootNode = root.root();

  // Step 1: Check if any of the target functions are imported from @testing-library/react-native
  const rntlImports = rootNode.findAll({
    rule: {
      kind: 'import_statement',
      has: {
        kind: 'string',
        regex: '@testing-library/react-native',
      },
    },
  });

  if (rntlImports.length === 0) {
    return null; // No RNTL imports, skip this file
  }

  // Track which functions are imported using a Set
  const importedFunctions = new Set<string>();
  for (const importStmt of rntlImports) {
    const importClause = importStmt.find({
      rule: { kind: 'import_clause' },
    });
    if (!importClause) continue;

    // Check for named imports: import { render, act, renderHook, ... } from ...
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
          if (FUNCTIONS_TO_TRANSFORM.has(funcName)) {
            importedFunctions.add(funcName);
          }
        }
      }
    }

    // Check for default import: import render from ...
    const defaultImport = importClause.find({
      rule: { kind: 'identifier' },
    });
    if (defaultImport) {
      const funcName = defaultImport.text();
      if (FUNCTIONS_TO_TRANSFORM.has(funcName)) {
        importedFunctions.add(funcName);
      }
    }

    // Check for namespace import: import * as RNTL from ...
    const namespaceImport = importClause.find({
      rule: { kind: 'namespace_import' },
    });
    if (namespaceImport) {
      // For namespace imports, we'll check if functions are called via the namespace
      // This is handled in the call matching below
      // We assume all functions might be available via namespace
      FUNCTIONS_TO_TRANSFORM.forEach((func) => importedFunctions.add(func));
      break;
    }
  }

  if (importedFunctions.size === 0) {
    return null; // None of the target functions are imported, skip
  }

  // Step 2: Find all call expressions for imported functions
  const functionCalls: SgNode<TSX>[] = [];
  for (const funcName of importedFunctions) {
    const calls = rootNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'identifier',
          regex: `^${funcName}$`,
        },
      },
    });
    functionCalls.push(...calls);
  }

  if (functionCalls.length === 0) {
    return null; // No function calls found
  }

  const edits: Edit[] = [];
  const functionsToMakeAsync = new Map<number, SgNode<TSX>>(); // Use Map with node ID to ensure uniqueness

  // Step 3: Process each function call
  for (const functionCall of functionCalls) {
    // Skip if already awaited
    const parent = functionCall.parent();
    if (parent && parent.is('await_expression')) {
      continue; // Already awaited, skip
    }

    // Skip variants that should not be transformed
    const functionNode = functionCall.field('function');
    if (functionNode) {
      const funcName = functionNode.text();
      if (SKIP_VARIANTS.has(funcName)) {
        continue;
      }
    }

    // Step 4: Find the containing function (test/it callback)
    const containingFunction = findContainingTestFunction(functionCall);
    if (!containingFunction) {
      // Not inside a test function, skip (could be a helper function)
      continue;
    }

    // Step 5: Track functions that need to be made async
    // Check if function is already async
    // For arrow functions, async is a child node; for function declarations, it's before "function"
    let isAsync = false;
    if (containingFunction.is('arrow_function')) {
      // Check if arrow function has async child node by checking children
      const children = containingFunction.children();
      isAsync = children.some((child) => child.text() === 'async');
    } else {
      // For function declarations/expressions, check text before
      const funcStart = containingFunction.range().start.index;
      const textBefore = rootNode.text().substring(Math.max(0, funcStart - 10), funcStart);
      isAsync = textBefore.trim().endsWith('async');
    }

    // Only add if not already async and not already in the map
    if (!isAsync && !functionsToMakeAsync.has(containingFunction.id())) {
      functionsToMakeAsync.set(containingFunction.id(), containingFunction);
    }

    // Step 6: Add await before function call
    const callStart = functionCall.range().start.index;
    edits.push({
      startPos: callStart,
      endPos: callStart,
      insertedText: 'await ',
    });
  }

  // Step 7: Add async keyword to functions that need it
  for (const func of functionsToMakeAsync.values()) {
    if (func.is('arrow_function')) {
      // Arrow function: () => {} -> async () => {}
      // Insert async before the parameters
      const funcStart = func.range().start.index;
      edits.push({
        startPos: funcStart,
        endPos: funcStart,
        insertedText: 'async ',
      });
    } else if (func.is('function_declaration') || func.is('function_expression')) {
      // Function declaration/expression: function name() {} -> async function name() {}
      // The "function" keyword is the first child
      const children = func.children();
      const firstChild = children.length > 0 ? children[0] : null;
      if (firstChild && firstChild.text() === 'function') {
        // Insert "async " before "function"
        const funcKeywordStart = firstChild.range().start.index;
        edits.push({
          startPos: funcKeywordStart,
          endPos: funcKeywordStart,
          insertedText: 'async ',
        });
      } else {
        // Fallback: insert before function start
        const funcStart = func.range().start.index;
        edits.push({
          startPos: funcStart,
          endPos: funcStart,
          insertedText: 'async ',
        });
      }
    }
  }

  if (edits.length === 0) {
    return null; // No changes needed
  }

  // Sort edits by position (reverse order to avoid offset issues)
  edits.sort((a, b) => b.startPos - a.startPos);

  return rootNode.commitEdits(edits);
};

/**
 * Find the containing test function (test/it callback) for a given node
 */
function findContainingTestFunction(node: SgNode<TSX>): SgNode<TSX> | null {
  // Walk up the AST to find the containing function
  let current: SgNode<TSX> | null = node;

  while (current) {
    // Check if current node is a function
    if (
      current.is('arrow_function') ||
      current.is('function_declaration') ||
      current.is('function_expression')
    ) {
      // Check if this function is a test callback
      // The function is typically the second argument of a test/it call
      const parent = current.parent();
      if (parent) {
        // Parent could be arguments node
        if (parent.is('arguments')) {
          const grandParent = parent.parent();
          if (grandParent && grandParent.is('call_expression')) {
            const funcNode = grandParent.field('function');
            if (funcNode) {
              const funcText = funcNode.text();
              // Match test, it, describe
              if (/^(test|it|describe)$/.test(funcText)) {
                return current;
              }
              // Handle test.skip and it.skip (member expressions)
              if (funcNode.is('member_expression')) {
                try {
                  const object = funcNode.field('object');
                  const property = funcNode.field('property');
                  if (object && property) {
                    const objText = object.text();
                    const propText = property.text();
                    if ((objText === 'test' || objText === 'it') && propText === 'skip') {
                      return current;
                    }
                  }
                } catch {
                  // field() might not be available for this node type, skip
                }
              }
            }
          }
        }
        // Parent could be call_expression directly (less common)
        if (parent.is('call_expression')) {
          const funcNode = parent.field('function');
          if (funcNode) {
            const funcText = funcNode.text();
            if (/^(test|it|describe)$/.test(funcText)) {
              return current;
            }
            if (funcNode.is('member_expression')) {
              try {
                const object = funcNode.field('object');
                const property = funcNode.field('property');
                if (object && property) {
                  const objText = object.text();
                  const propText = property.text();
                  if ((objText === 'test' || objText === 'it') && propText === 'skip') {
                    return current;
                  }
                }
              } catch {
                // field() might not be available for this node type, skip
              }
            }
          }
        }
      }
    }

    current = current.parent();
  }

  return null;
}

export default transform;
