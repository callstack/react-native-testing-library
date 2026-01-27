import type { Transform } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { Edit, SgNode } from '@codemod.com/jssg-types/main';

const FUNCTIONS_TO_RENAME = new Map([
  ['render', 'renderAsync'],
  ['renderHook', 'renderHookAsync'],
  ['fireEvent', 'fireEventAsync'],
]);

const FIRE_EVENT_METHODS_TO_MAKE_ASYNC = new Set(['press', 'changeText', 'scroll']);
const SCREEN_METHODS_TO_RENAME = new Map([
  ['rerender', 'rerenderAsync'],
  ['update', 'rerenderAsync'],
  ['unmount', 'unmountAsync'],
]);
const RESULT_METHODS_TO_RENAME = new Map([
  ['rerender', 'rerenderAsync'],
  ['update', 'rerenderAsync'],
  ['unmount', 'unmountAsync'],
]);
const TEST_FUNCTION_NAMES = new Set([
  'test',
  'it',
  'beforeEach',
  'afterEach',
  'beforeAll',
  'afterAll',
]);
const TEST_FUNCTION_PREFIXES = new Set(['test', 'it']);
const TEST_MODIFIERS = new Set(['skip', 'only']);
const TEST_EACH_METHOD = 'each';

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

  // Collect function calls that will be renamed, BEFORE renaming
  // We need to find calls to the OLD names (render, renderHook, fireEvent) 
  // that are in importedFunctions, as these will be renamed to async variants
  const functionCalls: SgNode<TSX>[] = [];
  functionCalls.push(...findDirectFunctionCallsThatWillBeRenamed(rootNode, importedFunctions));
  functionCalls.push(...findFireEventMethodCallsThatWillBeRenamed(rootNode, importedFunctions));
  const screenMethodCalls = findScreenMethodCallsThatWillBeRenamed(rootNode);
  functionCalls.push(...screenMethodCalls);

  // Track variables assigned from render/renderAsync/renderHook/renderHookAsync
  const { allVariables, renamedMethodVariables, destructuringPatterns, assignmentVariablesToRename } = trackVariablesAssignedFromRenderAndRenderHook(
    rootNode,
    importedFunctions,
  );
  const resultMethodCalls = findResultMethodCalls(rootNode, allVariables, renamedMethodVariables);
  functionCalls.push(...resultMethodCalls);

  // Now rename the functions
  renameFunctionsInUsages(rootNode, importedFunctions, edits);
  renameScreenMethodsInUsages(rootNode, screenMethodCalls, edits);
  renameResultMethodsInDestructuringPatterns(rootNode, destructuringPatterns, edits);
  renameAssignmentVariableDeclarations(rootNode, assignmentVariablesToRename, edits);
  renameResultMethodsInUsages(rootNode, resultMethodCalls, edits, renamedMethodVariables);

  // Add await to the calls we found
  const functionsToMakeAsync = new Map<number, SgNode<TSX>>();

  for (const functionCall of functionCalls) {
    if (isCallAlreadyAwaited(functionCall)) {
      continue;
    }

    const containingFunction = findContainingTestFunction(functionCall);
    if (!containingFunction) {
      continue;
    }

    if (
      !isFunctionAlreadyAsync(containingFunction) &&
      !functionsToMakeAsync.has(containingFunction.id())
    ) {
      functionsToMakeAsync.set(containingFunction.id(), containingFunction);
    }

    addAwaitBeforeCall(functionCall, edits);
  }

  for (const func of functionsToMakeAsync.values()) {
    addAsyncKeywordToFunction(func, edits);
  }

  if (edits.length === 0) {
    return null;
  }

  // Sort edits: descending by startPos, but insertion edits (startPos == endPos) 
  // come before replacement edits at the same position
  edits.sort((a, b) => {
    if (a.startPos !== b.startPos) {
      return b.startPos - a.startPos;
    }
    // If same startPos, insertion edits (startPos == endPos) come first
    const aIsInsertion = a.startPos === a.endPos;
    const bIsInsertion = b.startPos === b.endPos;
    if (aIsInsertion && !bIsInsertion) {
      return -1; // a comes before b
    }
    if (!aIsInsertion && bIsInsertion) {
      return 1; // b comes before a
    }
    return 0;
  });

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

function findDirectFunctionCallsThatWillBeRenamed(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): SgNode<TSX>[] {
  const functionCalls: SgNode<TSX>[] = [];

  for (const funcName of importedFunctions) {
    if (!FUNCTIONS_TO_RENAME.has(funcName)) {
      continue;
    }
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

  return functionCalls;
}

function findFireEventMethodCallsThatWillBeRenamed(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): SgNode<TSX>[] {
  const functionCalls: SgNode<TSX>[] = [];

  if (!importedFunctions.has('fireEvent')) {
    return functionCalls;
  }

  const fireEventMethodCalls = rootNode.findAll({
    rule: {
      kind: 'call_expression',
      has: {
        field: 'function',
        kind: 'member_expression',
      },
    },
  });

  for (const call of fireEventMethodCalls) {
    const funcNode = call.field('function');
    if (funcNode && funcNode.is('member_expression')) {
      try {
        const object = funcNode.field('object');
        const property = funcNode.field('property');
        if (object && property) {
          const objText = object.text();
          const propText = property.text();
          if (objText === 'fireEvent' && FIRE_EVENT_METHODS_TO_MAKE_ASYNC.has(propText)) {
            functionCalls.push(call);
          }
        }
      } catch {
        // Skip nodes where field() is not available or AST structure doesn't match expectations.
        // This is expected for malformed or edge-case AST structures and should be silently ignored.
      }
    }
  }

  return functionCalls;
}

function findScreenMethodCallsThatWillBeRenamed(rootNode: SgNode<TSX>): SgNode<TSX>[] {
  const functionCalls: SgNode<TSX>[] = [];
  const screenMethodCalls = rootNode.findAll({
    rule: {
      kind: 'call_expression',
      has: {
        field: 'function',
        kind: 'member_expression',
      },
    },
  });

  for (const call of screenMethodCalls) {
    const funcNode = call.field('function');
    if (funcNode && funcNode.is('member_expression')) {
      try {
        const object = funcNode.field('object');
        const property = funcNode.field('property');
        if (object && property) {
          const objText = object.text();
          const propText = property.text();
          if (objText === 'screen' && SCREEN_METHODS_TO_RENAME.has(propText)) {
            functionCalls.push(call);
          }
        }
      } catch {
        // Skip nodes where field() is not available or AST structure doesn't match expectations.
        // This is expected for malformed or edge-case AST structures and should be silently ignored.
      }
    }
  }

  return functionCalls;
}

function renameScreenMethodsInUsages(
  rootNode: SgNode<TSX>,
  screenMethodCalls: SgNode<TSX>[],
  edits: Edit[],
): void {
  for (const call of screenMethodCalls) {
    const funcNode = call.field('function');
    if (funcNode && funcNode.is('member_expression')) {
      try {
        const property = funcNode.field('property');
        if (property) {
          const propText = property.text();
          if (SCREEN_METHODS_TO_RENAME.has(propText)) {
            const newName = SCREEN_METHODS_TO_RENAME.get(propText)!;
            const propertyRange = property.range();
            edits.push({
              startPos: propertyRange.start.index,
              endPos: propertyRange.end.index,
              insertedText: newName,
            });
          }
        }
      } catch {
        // Skip nodes where field() is not available or AST structure doesn't match expectations.
        // This is expected for malformed or edge-case AST structures and should be silently ignored.
      }
    }
  }
}

/**
 * Tracks variables assigned from render()/renderAsync() and renderHook()/renderHookAsync() calls to identify result objects.
 * This helps identify calls like `renderer.rerender()`, `renderer.unmount()`, `result.rerender()`, etc.
 * that need to be made async.
 *
 * Handles various assignment patterns:
 * - Direct assignment: `const renderer = render(...)` or `const result = renderHook(...)`
 * - Destructured assignment: `const { rerender } = render(...)` or `const { rerender } = renderHook(...)`
 * - Renamed destructuring: `const { rerender: rerenderHook } = renderHook(...)` (renderHook only)
 * - Assignment expressions: `renderer = render(...)` or `result = renderHook(...)`
 *
 * @param rootNode - The root AST node to search within
 * @param importedFunctions - Set of imported function names (should include 'render' and/or 'renderHook')
 * @returns Object containing:
 *   - allVariables: Set of all variable names representing render/renderHook results
 *   - renamedMethodVariables: Set of renamed method variables (e.g., rerenderHook from renderHook)
 */
function trackVariablesAssignedFromRenderAndRenderHook(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): {
  allVariables: Set<string>;
  renamedMethodVariables: Set<string>;
  destructuringPatterns: Array<{ key: SgNode<TSX>; keyName: string }>;
  assignmentVariablesToRename: Set<string>;
} {
  const allVariables = new Set<string>();
  const renamedMethodVariables = new Set<string>();
  const destructuringPatterns: Array<{ key: SgNode<TSX>; keyName: string }> = [];
  const assignmentVariablesToRename = new Set<string>();

  // Track variables from both render/renderAsync and renderHook/renderHookAsync calls
  // We track both sync and async variants because:
  // - render/renderHook will be renamed to renderAsync/renderHookAsync
  // - renderAsync/renderHookAsync might already exist in the code
  const functionsToTrack: Array<{ name: string; shouldTrack: boolean }> = [];
  
  if (importedFunctions.has('render')) {
    functionsToTrack.push({ name: 'render', shouldTrack: true });
    functionsToTrack.push({ name: 'renderAsync', shouldTrack: true });
  }
  if (importedFunctions.has('renderHook')) {
    functionsToTrack.push({ name: 'renderHook', shouldTrack: true });
    functionsToTrack.push({ name: 'renderHookAsync', shouldTrack: true });
  }

  for (const { name: funcName } of functionsToTrack) {

    const functionCalls = rootNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'identifier',
          regex: `^${funcName}$`,
        },
      },
    });

    for (const functionCall of functionCalls) {
      let parent = functionCall.parent();
      const isAwaited = parent && parent.is('await_expression');

      if (isAwaited) {
        parent = parent.parent();
      }

      if (parent && parent.is('variable_declarator')) {
        const objectPattern = parent.find({
          rule: { kind: 'object_pattern' },
        });
        if (objectPattern) {
          const shorthandProps = objectPattern.findAll({
            rule: { kind: 'shorthand_property_identifier_pattern' },
          });
          for (const prop of shorthandProps) {
            const propName = prop.text();
            if (RESULT_METHODS_TO_RENAME.has(propName)) {
              allVariables.add(propName);
            }
          }
          // Handle renamed destructuring (only for renderHook, but we check for both to be safe)
          const pairPatterns = objectPattern.findAll({
            rule: { kind: 'pair_pattern' },
          });
          for (const pair of pairPatterns) {
            const key = pair.find({
              rule: { kind: 'property_identifier' },
            });
            const value = pair.find({
              rule: { kind: 'identifier' },
            });
            if (key && value) {
              const keyName = key.text();
              const valueName = value.text();
              if (RESULT_METHODS_TO_RENAME.has(keyName)) {
                allVariables.add(valueName);
                renamedMethodVariables.add(valueName);
                destructuringPatterns.push({ key, keyName });
              }
            }
          }
          // Also track shorthand properties that need renaming
          for (const prop of shorthandProps) {
            const propName = prop.text();
            if (RESULT_METHODS_TO_RENAME.has(propName)) {
              destructuringPatterns.push({ key: prop, keyName: propName });
            }
          }
        } else {
          const nameNode = parent.find({
            rule: { kind: 'identifier' },
          });
          if (nameNode) {
            const varName = nameNode.text();
            allVariables.add(varName);
          }
        }
      } else if (parent && parent.is('assignment_expression')) {
        const left = parent.find({
          rule: { kind: 'identifier' },
        });
        if (left) {
          const varName = left.text();
          allVariables.add(varName);
        } else {
          const objectPattern = parent.find({
            rule: { kind: 'object_pattern' },
          });
          if (objectPattern) {
            const shorthandProps = objectPattern.findAll({
              rule: { kind: 'shorthand_property_identifier_pattern' },
            });
            for (const prop of shorthandProps) {
              const propName = prop.text();
              if (RESULT_METHODS_TO_RENAME.has(propName)) {
                allVariables.add(propName);
                // Track that this variable declaration should be renamed
                assignmentVariablesToRename.add(propName);
              }
            }
            // Handle renamed destructuring in assignment expressions
            const pairPatterns = objectPattern.findAll({
              rule: { kind: 'pair_pattern' },
            });
            for (const pair of pairPatterns) {
              const key = pair.find({
                rule: { kind: 'property_identifier' },
              });
              const value = pair.find({
                rule: { kind: 'identifier' },
              });
              if (key && value) {
                const keyName = key.text();
                const valueName = value.text();
                if (RESULT_METHODS_TO_RENAME.has(keyName)) {
                  allVariables.add(valueName);
                  renamedMethodVariables.add(valueName);
                  destructuringPatterns.push({ key, keyName });
                }
              }
            }
            // Also track shorthand properties in assignment expressions
            for (const prop of shorthandProps) {
              const propName = prop.text();
              if (RESULT_METHODS_TO_RENAME.has(propName)) {
                destructuringPatterns.push({ key: prop, keyName: propName });
              }
            }
          }
        }
      }
    }
  }

  return { allVariables, renamedMethodVariables, destructuringPatterns, assignmentVariablesToRename };
}

/**
 * Finds method calls on render/renderHook result variables (e.g., renderer.rerender(), result.unmount()).
 * Also finds direct calls to renamed method variables (e.g., rerenderHook()).
 *
 * @param rootNode - The root AST node to search within
 * @param allVariables - Set of all variable names from render/renderHook results
 * @param renamedMethodVariables - Set of renamed method variables (e.g., rerenderHook)
 * @returns Array of function call nodes that need to be made async
 */
function findResultMethodCalls(
  rootNode: SgNode<TSX>,
  allVariables: Set<string>,
  renamedMethodVariables: Set<string>,
): SgNode<TSX>[] {
  const functionCalls: SgNode<TSX>[] = [];

  if (allVariables.size > 0) {
    const resultMethodCalls = rootNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'member_expression',
        },
      },
    });

    for (const call of resultMethodCalls) {
      const funcNode = call.field('function');
      if (funcNode && funcNode.is('member_expression')) {
        try {
          const object = funcNode.field('object');
          const property = funcNode.field('property');
          if (object && property) {
            const objText = object.text();
            const propText = property.text();
            if (allVariables.has(objText) && RESULT_METHODS_TO_RENAME.has(propText)) {
              functionCalls.push(call);
            }
          }
        } catch {
          // Skip nodes where field() is not available or AST structure doesn't match expectations.
          // This is expected for malformed or edge-case AST structures and should be silently ignored.
        }
      }
    }

    // Find direct calls to method variables (e.g., rerender(), unmount(), rerenderHook())
    for (const varName of allVariables) {
      if (RESULT_METHODS_TO_RENAME.has(varName) || renamedMethodVariables.has(varName)) {
        const directCalls = rootNode.findAll({
          rule: {
            kind: 'call_expression',
            has: {
              field: 'function',
              kind: 'identifier',
              regex: `^${varName}$`,
            },
          },
        });
        functionCalls.push(...directCalls);
      }
    }
  }

  return functionCalls;
}

function renameResultMethodsInDestructuringPatterns(
  rootNode: SgNode<TSX>,
  destructuringPatterns: Array<{ key: SgNode<TSX>; keyName: string }>,
  edits: Edit[],
): void {
  for (const { key, keyName } of destructuringPatterns) {
    if (RESULT_METHODS_TO_RENAME.has(keyName)) {
      const newName = RESULT_METHODS_TO_RENAME.get(keyName)!;
      const keyRange = key.range();
      edits.push({
        startPos: keyRange.start.index,
        endPos: keyRange.end.index,
        insertedText: newName,
      });
    }
  }
}

function renameAssignmentVariableDeclarations(
  rootNode: SgNode<TSX>,
  assignmentVariablesToRename: Set<string>,
  edits: Edit[],
): void {
  for (const varName of assignmentVariablesToRename) {
    if (!RESULT_METHODS_TO_RENAME.has(varName)) {
      continue;
    }
    const newName = RESULT_METHODS_TO_RENAME.get(varName)!;
    
    // Find variable declarations (let, const, var) that declare these variables
    const variableDeclarations = rootNode.findAll({
      rule: {
        any: [
          { kind: 'lexical_declaration' },
          { kind: 'variable_declaration' },
        ],
      },
    });
    
    for (const varDecl of variableDeclarations) {
      const declarators = varDecl.findAll({
        rule: { kind: 'variable_declarator' },
      });
      
      for (const declarator of declarators) {
        const nameNode = declarator.find({
          rule: { kind: 'identifier' },
        });
        // Only rename if this variable is in our set (meaning it's used in assignment destructuring)
        if (nameNode && nameNode.text() === varName) {
          const nameRange = nameNode.range();
          edits.push({
            startPos: nameRange.start.index,
            endPos: nameRange.end.index,
            insertedText: newName,
          });
        }
      }
    }
  }
}

function renameResultMethodsInUsages(
  rootNode: SgNode<TSX>,
  resultMethodCalls: SgNode<TSX>[],
  edits: Edit[],
  renamedMethodVariables?: Set<string>,
): void {
  for (const call of resultMethodCalls) {
    const funcNode = call.field('function');
    if (funcNode && funcNode.is('member_expression')) {
      try {
        const property = funcNode.field('property');
        if (property) {
          const propText = property.text();
          if (RESULT_METHODS_TO_RENAME.has(propText)) {
            const newName = RESULT_METHODS_TO_RENAME.get(propText)!;
            const propertyRange = property.range();
            edits.push({
              startPos: propertyRange.start.index,
              endPos: propertyRange.end.index,
              insertedText: newName,
            });
          }
        }
      } catch {
        // Skip nodes where field() is not available or AST structure doesn't match expectations.
        // This is expected for malformed or edge-case AST structures and should be silently ignored.
      }
    } else if (funcNode && funcNode.is('identifier')) {
      // Handle direct calls to method variables (e.g., rerender(), rerenderHook())
      const funcText = funcNode.text();
      if (RESULT_METHODS_TO_RENAME.has(funcText)) {
        // Direct method name (e.g., rerender -> rerenderAsync)
        const newName = RESULT_METHODS_TO_RENAME.get(funcText)!;
        const identifierRange = funcNode.range();
        edits.push({
          startPos: identifierRange.start.index,
          endPos: identifierRange.end.index,
          insertedText: newName,
        });
      } else if (renamedMethodVariables && renamedMethodVariables.has(funcText)) {
        // Renamed method variable (e.g., rerenderHook -> rerenderHookAsync)
        // Append "Async" to the variable name
        const newName = `${funcText}Async`;
        const identifierRange = funcNode.range();
        edits.push({
          startPos: identifierRange.start.index,
          endPos: identifierRange.end.index,
          insertedText: newName,
        });
      }
    }
  }
}

function isCallAlreadyAwaited(functionCall: SgNode<TSX>): boolean {
  const parent = functionCall.parent();
  return parent !== null && parent.is('await_expression');
}

function addAwaitBeforeCall(functionCall: SgNode<TSX>, edits: Edit[]): void {
  const callStart = functionCall.range().start.index;
  edits.push({
    startPos: callStart,
    endPos: callStart,
    insertedText: 'await ',
  });
}

/**
 * Checks if a function is already marked as async using AST-based detection.
 * This is more reliable than string matching and handles edge cases better.
 */
function isFunctionAlreadyAsync(func: SgNode<TSX>): boolean {
  if (func.is('arrow_function')) {
    // For arrow functions, check if 'async' is a direct child
    const children = func.children();
    return children.some((child) => child.text() === 'async');
  } else if (func.is('function_declaration') || func.is('function_expression')) {
    // For function declarations/expressions, check for async modifier
    // The async keyword appears before the 'function' keyword
    const children = func.children();
    const functionKeywordIndex = children.findIndex((child) => child.text() === 'function');
    if (functionKeywordIndex > 0) {
      // Check if any child before 'function' is 'async'
      return children.slice(0, functionKeywordIndex).some((child) => child.text() === 'async');
    }
    // Also check if the first child is 'async'
    return children.length > 0 && children[0].text() === 'async';
  }
  return false;
}

function addAsyncKeywordToFunction(func: SgNode<TSX>, edits: Edit[]): void {
  if (func.is('arrow_function')) {
    const funcStart = func.range().start.index;
    edits.push({
      startPos: funcStart,
      endPos: funcStart,
      insertedText: 'async ',
    });
  } else if (func.is('function_declaration') || func.is('function_expression')) {
    const children = func.children();
    const firstChild = children.length > 0 ? children[0] : null;
    if (firstChild && firstChild.text() === 'function') {
      const funcKeywordStart = firstChild.range().start.index;
      edits.push({
        startPos: funcKeywordStart,
        endPos: funcKeywordStart,
        insertedText: 'async ',
      });
    } else {
      const funcStart = func.range().start.index;
      edits.push({
        startPos: funcStart,
        endPos: funcStart,
        insertedText: 'async ',
      });
    }
  }
}

/**
 * Finds the containing test function (test, it, beforeEach, etc.) for a given node.
 * Traverses up the AST tree to find the nearest test function that contains the node.
 *
 * Handles various test patterns:
 * - Direct test functions: test(), it()
 * - Test modifiers: test.skip(), it.only()
 * - Test.each patterns: test.each(), it.each()
 * - Hooks: beforeEach(), afterEach(), beforeAll(), afterAll()
 *
 * @param node - The AST node to find the containing test function for
 * @returns The containing test function node, or null if not found
 */
function findContainingTestFunction(node: SgNode<TSX>): SgNode<TSX> | null {
  let current: SgNode<TSX> | null = node;

  while (current) {
    if (
      current.is('arrow_function') ||
      current.is('function_declaration') ||
      current.is('function_expression')
    ) {
      const parent = current.parent();
      if (parent) {
        if (parent.is('arguments')) {
          const grandParent = parent.parent();
          if (grandParent && grandParent.is('call_expression')) {
            const funcNode = grandParent.field('function');
            if (funcNode) {
              const funcText = funcNode.text();
              if (TEST_FUNCTION_NAMES.has(funcText)) {
                return current;
              }
              if (funcNode.is('member_expression')) {
                try {
                  const object = funcNode.field('object');
                  const property = funcNode.field('property');
                  if (object && property) {
                    const objText = object.text();
                    const propText = property.text();
                    if (TEST_FUNCTION_PREFIXES.has(objText) && TEST_MODIFIERS.has(propText)) {
                      return current;
                    }
                  }
                } catch {
                  // Skip nodes where field() is not available or AST structure doesn't match expectations.
                  // This is expected for malformed or edge-case AST structures and should be silently ignored.
                }
              }
              if (funcNode.is('call_expression')) {
                try {
                  const innerFuncNode = funcNode.field('function');
                  if (innerFuncNode && innerFuncNode.is('member_expression')) {
                    const object = innerFuncNode.field('object');
                    const property = innerFuncNode.field('property');
                    if (object && property) {
                      const objText = object.text();
                      const propText = property.text();
                      if (TEST_FUNCTION_PREFIXES.has(objText) && propText === TEST_EACH_METHOD) {
                        return current;
                      }
                    }
                  }
                } catch {
                  // Skip nodes where field() is not available or AST structure doesn't match expectations.
                  // This is expected for malformed or edge-case AST structures and should be silently ignored.
                }
              }
            }
          }
        }
        if (parent.is('call_expression')) {
          const funcNode = parent.field('function');
          if (funcNode) {
            const funcText = funcNode.text();
            if (TEST_FUNCTION_NAMES.has(funcText)) {
              return current;
            }
            if (funcNode.is('member_expression')) {
              try {
                const object = funcNode.field('object');
                const property = funcNode.field('property');
                if (object && property) {
                  const objText = object.text();
                  const propText = property.text();
                  if (TEST_FUNCTION_PREFIXES.has(objText) && TEST_MODIFIERS.has(propText)) {
                    return current;
                  }
                }
              } catch {
                // Skip nodes where field() is not available or AST structure doesn't match expectations.
                // This is expected for malformed or edge-case AST structures and should be silently ignored.
              }
            }
            if (funcNode.is('call_expression')) {
              try {
                const innerFuncNode = funcNode.field('function');
                if (innerFuncNode && innerFuncNode.is('member_expression')) {
                  const object = innerFuncNode.field('object');
                  const property = innerFuncNode.field('property');
                  if (object && property) {
                    const objText = object.text();
                    const propText = property.text();
                    if (TEST_FUNCTION_PREFIXES.has(objText) && propText === TEST_EACH_METHOD) {
                      return current;
                    }
                  }
                }
              } catch {
                // Skip nodes where field() is not available or AST structure doesn't match expectations.
                // This is expected for malformed or edge-case AST structures and should be silently ignored.
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
