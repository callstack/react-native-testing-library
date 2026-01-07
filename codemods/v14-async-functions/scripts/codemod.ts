import type { Transform } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { Edit, SgNode } from '@codemod.com/jssg-types/main';

const FUNCTIONS_TO_MAKE_ASYNC = new Set(['render', 'renderHook', 'act', 'fireEvent']);
const FIRE_EVENT_METHODS_TO_MAKE_ASYNC = new Set(['press', 'changeText', 'scroll']);
const SCREEN_METHODS_TO_MAKE_ASYNC = new Set(['rerender', 'unmount']);
const RESULT_METHODS_TO_MAKE_ASYNC = new Set(['rerender', 'unmount']);
const ASYNC_FUNCTIONS_TO_RENAME = new Map([
  ['renderAsync', 'render'],
  ['renderHookAsync', 'renderHook'],
  ['fireEventAsync', 'fireEvent'],
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

  const customRenderFunctionsSet = parseCustomRenderFunctionsFromOptions(options);
  const rntlImports = findRNTLImportStatements(rootNode);

  if (rntlImports.length === 0 && customRenderFunctionsSet.size === 0) {
    return null;
  }

  const { importedFunctions, specifiersToRemove } = extractImportedFunctionNames(
    rntlImports,
    edits,
  );
  removeDuplicateImportSpecifiers(specifiersToRemove, rootNode, edits);

  let finalCustomRenderFunctionsSet = customRenderFunctionsSet;
  if (finalCustomRenderFunctionsSet.size === 0 && importedFunctions.has('render')) {
    const autoDetectedCustomRenders = findAutoDetectedCustomRenderFunctions(
      rootNode,
      importedFunctions,
    );
    if (autoDetectedCustomRenders.size > 1) {
      finalCustomRenderFunctionsSet = autoDetectedCustomRenders;
    }
  }

  const importedAsyncVariants = new Set<string>();
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
          if (ASYNC_FUNCTIONS_TO_RENAME.has(funcName)) {
            importedAsyncVariants.add(funcName);
          }
        }
      }
    }
  }

  if (importedFunctions.size === 0 && finalCustomRenderFunctionsSet.size === 0) {
    return null;
  }

  renameAsyncVariantsInUsages(rootNode, edits);

  const functionCalls: SgNode<TSX>[] = [];
  functionCalls.push(...findDirectFunctionCalls(rootNode, importedFunctions));

  for (const asyncName of importedAsyncVariants) {
    const syncName = ASYNC_FUNCTIONS_TO_RENAME.get(asyncName)!;
    const asyncCalls = rootNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'identifier',
          regex: `^${asyncName}$`,
        },
      },
    });
    functionCalls.push(...asyncCalls);
    if (!importedFunctions.has(syncName)) {
      importedFunctions.add(syncName);
    }
  }
  functionCalls.push(...findFireEventMethodCalls(rootNode, importedFunctions, rntlImports));
  functionCalls.push(...findScreenMethodCalls(rootNode));

  const { allVariables, renamedMethodVariables } = trackVariablesAssignedFromRenderAndRenderHook(
    rootNode,
    importedFunctions,
  );
  functionCalls.push(...findResultMethodCalls(rootNode, allVariables, renamedMethodVariables));

  if (functionCalls.length === 0 && finalCustomRenderFunctionsSet.size === 0) {
    if (edits.length === 0) {
      return null;
    }
  }

  const functionsToMakeAsync = new Map<number, SgNode<TSX>>();
  const customRenderFunctionsToMakeAsync = new Map<number, SgNode<TSX>>();

  if (finalCustomRenderFunctionsSet.size > 0 && importedFunctions.size > 0) {
    const customRenderFunctionDefinitions = findCustomRenderFunctionDefinitions(
      rootNode,
      finalCustomRenderFunctionsSet,
    );
    for (const funcDef of customRenderFunctionDefinitions) {
      transformRNTLCallsInsideCustomRender(
        funcDef,
        importedFunctions,
        edits,
        customRenderFunctionsToMakeAsync,
        rootNode,
      );
    }
  }

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

  if (finalCustomRenderFunctionsSet.size > 0) {
    const customRenderCalls = findCustomRenderFunctionCalls(
      rootNode,
      finalCustomRenderFunctionsSet,
    );
    for (const callExpr of customRenderCalls) {
      const containingFunction = findContainingTestFunction(callExpr);
      if (containingFunction) {
        if (isCallAlreadyAwaited(callExpr)) {
          continue;
        }

        if (
          !isFunctionAlreadyAsync(containingFunction) &&
          !functionsToMakeAsync.has(containingFunction.id())
        ) {
          functionsToMakeAsync.set(containingFunction.id(), containingFunction);
        }

        addAwaitBeforeCall(callExpr, edits);
      }
    }
  }

  for (const func of functionsToMakeAsync.values()) {
    addAsyncKeywordToFunction(func, edits);
  }

  for (const func of customRenderFunctionsToMakeAsync.values()) {
    addAsyncKeywordToFunction(func, edits);
  }

  if (edits.length === 0) {
    return null;
  }

  edits.sort((a, b) => b.startPos - a.startPos);

  return rootNode.commitEdits(edits);
}

interface CodemodOptions {
  params?: {
    customRenderFunctions?: string | number | boolean;
  };
}

function parseCustomRenderFunctionsFromOptions(options?: CodemodOptions): Set<string> {
  const customRenderFunctionsParam = options?.params?.customRenderFunctions
    ? String(options.params.customRenderFunctions)
    : '';

  const customRenderFunctionsSet = new Set<string>();
  if (customRenderFunctionsParam) {
    customRenderFunctionsParam
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .forEach((name) => customRenderFunctionsSet.add(name));
  }
  return customRenderFunctionsSet;
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
): {
  importedFunctions: Set<string>;
  specifiersToRemove: Array<{ specifier: SgNode<TSX>; importStmt: SgNode<TSX> }>;
} {
  const importedFunctions = new Set<string>();
  const specifiersToRemove: Array<{ specifier: SgNode<TSX>; importStmt: SgNode<TSX> }> = [];

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

      const importedNames = new Set<string>();
      for (const specifier of specifiers) {
        const identifier = specifier.find({
          rule: { kind: 'identifier' },
        });
        if (identifier) {
          const funcName = identifier.text();
          importedNames.add(funcName);
        }
      }

      for (const specifier of specifiers) {
        const identifier = specifier.find({
          rule: { kind: 'identifier' },
        });
        if (identifier) {
          const funcName = identifier.text();
          if (ASYNC_FUNCTIONS_TO_RENAME.has(funcName)) {
            const newName = ASYNC_FUNCTIONS_TO_RENAME.get(funcName)!;
            if (importedNames.has(newName)) {
              specifiersToRemove.push({ specifier, importStmt });
              importedFunctions.add(newName);
            } else {
              const identifierRange = identifier.range();
              edits.push({
                startPos: identifierRange.start.index,
                endPos: identifierRange.end.index,
                insertedText: newName,
              });
              importedFunctions.add(newName);
            }
          } else if (FUNCTIONS_TO_MAKE_ASYNC.has(funcName)) {
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
      if (FUNCTIONS_TO_MAKE_ASYNC.has(funcName)) {
        importedFunctions.add(funcName);
      }
    }

    const namespaceImport = importClause.find({
      rule: { kind: 'namespace_import' },
    });
    if (namespaceImport) {
      FUNCTIONS_TO_MAKE_ASYNC.forEach((func) => importedFunctions.add(func));
      break;
    }
  }

  return { importedFunctions, specifiersToRemove };
}

/**
 * Removes duplicate import specifiers from import statements.
 * Handles complex comma placement scenarios when removing specifiers:
 * - Trailing commas after the specifier
 * - Leading commas before the specifier
 * - Edge cases with single vs multiple specifiers
 *
 * @param specifiersToRemove - Array of specifiers to remove with their import statements
 * @param rootNode - The root AST node (used to get full text for comma detection)
 * @param edits - Array to collect edit operations
 */
function removeDuplicateImportSpecifiers(
  specifiersToRemove: Array<{ specifier: SgNode<TSX>; importStmt: SgNode<TSX> }>,
  rootNode: SgNode<TSX>,
  edits: Edit[],
): void {
  specifiersToRemove.sort(
    (a, b) => b.specifier.range().start.index - a.specifier.range().start.index,
  );

  for (const { specifier } of specifiersToRemove) {
    const specifierRange = specifier.range();
    const parent = specifier.parent();

    if (parent && parent.is('named_imports')) {
      const fullText = rootNode.text();
      const specifierEnd = specifierRange.end.index;

      const textAfter = fullText.substring(specifierEnd);
      const trailingCommaMatch = textAfter.match(/^\s*,\s*/);

      if (trailingCommaMatch) {
        edits.push({
          startPos: specifierRange.start.index,
          endPos: specifierEnd + trailingCommaMatch[0].length,
          insertedText: '',
        });
      } else {
        const textBefore = fullText.substring(0, specifierRange.start.index);
        const leadingCommaMatch = textBefore.match(/,\s*$/);

        if (leadingCommaMatch) {
          edits.push({
            startPos: specifierRange.start.index - leadingCommaMatch[0].length,
            endPos: specifierEnd,
            insertedText: '',
          });
        } else {
          edits.push({
            startPos: specifierRange.start.index,
            endPos: specifierEnd,
            insertedText: '',
          });
        }
      }
    }
  }
}

function renameAsyncVariantsInUsages(rootNode: SgNode<TSX>, edits: Edit[]): void {
  for (const [asyncName, syncName] of ASYNC_FUNCTIONS_TO_RENAME.entries()) {
    const asyncIdentifiers = rootNode.findAll({
      rule: {
        kind: 'identifier',
        regex: `^${asyncName}$`,
      },
    });

    for (const identifier of asyncIdentifiers) {
      const parent = identifier.parent();
      if (parent && parent.is('import_specifier')) {
        continue;
      }
      const identifierRange = identifier.range();
      edits.push({
        startPos: identifierRange.start.index,
        endPos: identifierRange.end.index,
        insertedText: syncName,
      });
    }

    const memberExpressions = rootNode.findAll({
      rule: {
        kind: 'member_expression',
        has: {
          field: 'object',
          kind: 'identifier',
          regex: `^${asyncName}$`,
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
          insertedText: syncName,
        });
      }
    }
  }
}

function findDirectFunctionCalls(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): SgNode<TSX>[] {
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

  return functionCalls;
}

function findFireEventMethodCalls(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
  rntlImports: SgNode<TSX>[],
): SgNode<TSX>[] {
  const functionCalls: SgNode<TSX>[] = [];
  const fireEventNames = new Set<string>();

  if (importedFunctions.has('fireEvent')) {
    fireEventNames.add('fireEvent');
  }

  for (const [asyncName, syncName] of ASYNC_FUNCTIONS_TO_RENAME.entries()) {
    if (syncName === 'fireEvent') {
      const wasImported = rntlImports.some((importStmt) => {
        const importClause = importStmt.find({ rule: { kind: 'import_clause' } });
        if (!importClause) return false;
        const namedImports = importClause.find({ rule: { kind: 'named_imports' } });
        if (!namedImports) return false;
        const specifiers = namedImports.findAll({ rule: { kind: 'import_specifier' } });
        return specifiers.some((spec) => {
          const identifier = spec.find({ rule: { kind: 'identifier' } });
          return identifier && identifier.text() === asyncName;
        });
      });
      if (wasImported) {
        fireEventNames.add(asyncName);
      }
    }
  }

  if (fireEventNames.size > 0) {
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
            if (fireEventNames.has(objText) && FIRE_EVENT_METHODS_TO_MAKE_ASYNC.has(propText)) {
              functionCalls.push(call);
            }
          }
        } catch {
          // Skip nodes where field() is not available or AST structure doesn't match expectations.
          // This is expected for malformed or edge-case AST structures and should be silently ignored.
        }
      }
    }
  }

  return functionCalls;
}

function findScreenMethodCalls(rootNode: SgNode<TSX>): SgNode<TSX>[] {
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
          if (objText === 'screen' && SCREEN_METHODS_TO_MAKE_ASYNC.has(propText)) {
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

/**
 * Tracks variables assigned from render() and renderHook() calls to identify result objects.
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
} {
  const allVariables = new Set<string>();
  const renamedMethodVariables = new Set<string>();

  // Track variables from both render() and renderHook() calls
  const functionsToTrack = ['render', 'renderHook'] as const;

  for (const funcName of functionsToTrack) {
    if (!importedFunctions.has(funcName)) {
      continue;
    }

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
            if (RESULT_METHODS_TO_MAKE_ASYNC.has(propName)) {
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
              if (RESULT_METHODS_TO_MAKE_ASYNC.has(keyName)) {
                allVariables.add(valueName);
                renamedMethodVariables.add(valueName);
              }
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
              if (RESULT_METHODS_TO_MAKE_ASYNC.has(propName)) {
                allVariables.add(propName);
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
                if (RESULT_METHODS_TO_MAKE_ASYNC.has(keyName)) {
                  allVariables.add(valueName);
                  renamedMethodVariables.add(valueName);
                }
              }
            }
          }
        }
      }
    }
  }

  return { allVariables, renamedMethodVariables };
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
            if (allVariables.has(objText) && RESULT_METHODS_TO_MAKE_ASYNC.has(propText)) {
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
      if (RESULT_METHODS_TO_MAKE_ASYNC.has(varName) || renamedMethodVariables.has(varName)) {
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

/**
 * Automatically detects custom render functions by analyzing the code structure.
 * A custom render function is identified as:
 * - A function/const that starts with 'render' (e.g., renderWithProviders, renderWithTheme)
 * - Called from within test functions
 * - Contains calls to the base render() function from RNTL
 * - Defined at the top level (not nested inside other functions)
 *
 * This helps identify custom render wrappers that should be transformed.
 *
 * @param rootNode - The root AST node to search within
 * @param importedFunctions - Set of imported function names (must include 'render')
 * @returns Set of custom render function names that were auto-detected
 */
function findAutoDetectedCustomRenderFunctions(
  rootNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): Set<string> {
  const customRenderFunctions = new Set<string>();

  if (!importedFunctions.has('render')) {
    return customRenderFunctions;
  }

  const allCallExpressions = rootNode.findAll({
    rule: { kind: 'call_expression' },
  });

  const functionsCalledFromTests = new Set<string>();
  for (const callExpr of allCallExpressions) {
    const funcNode = callExpr.field('function');
    if (!funcNode) continue;

    let calledFunctionName: string | null = null;
    if (funcNode.is('identifier')) {
      calledFunctionName = funcNode.text();
    } else if (funcNode.is('member_expression')) {
      continue;
    }

    if (calledFunctionName) {
      const containingFunction = findContainingTestFunction(callExpr);
      if (containingFunction) {
        functionsCalledFromTests.add(calledFunctionName);
      }
    }
  }

  const functionDeclarations = rootNode.findAll({
    rule: { kind: 'function_declaration' },
  });
  for (const funcDecl of functionDeclarations) {
    const nameNode = funcDecl.find({
      rule: { kind: 'identifier' },
    });
    if (nameNode) {
      const funcName = nameNode.text();
      if (funcName.startsWith('render') && functionsCalledFromTests.has(funcName)) {
        let parent = funcDecl.parent();
        let isTopLevel = false;
        while (parent) {
          if (parent.is('program') || parent.is('module')) {
            isTopLevel = true;
            break;
          }
          if (
            parent.is('statement_block') ||
            parent.is('lexical_declaration') ||
            parent.is('variable_declaration')
          ) {
            const grandParent = parent.parent();
            if (grandParent && (grandParent.is('program') || grandParent.is('module'))) {
              isTopLevel = true;
              break;
            }
          }
          parent = parent.parent();
        }
        if (isTopLevel) {
          const renderCalls = funcDecl.findAll({
            rule: {
              kind: 'call_expression',
              has: {
                field: 'function',
                kind: 'identifier',
                regex: '^render$',
              },
            },
          });
          if (renderCalls.length > 0) {
            customRenderFunctions.add(funcName);
          }
        }
      }
    }
  }

  const variableDeclarations = rootNode.findAll({
    rule: { kind: 'lexical_declaration' },
  });
  for (const varDecl of variableDeclarations) {
    const declarators = varDecl.findAll({
      rule: { kind: 'variable_declarator' },
    });
    for (const declarator of declarators) {
      const nameNode = declarator.find({
        rule: { kind: 'identifier' },
      });
      if (nameNode) {
        const funcName = nameNode.text();
        if (funcName.startsWith('render') && functionsCalledFromTests.has(funcName)) {
          let parent = varDecl.parent();
          let isTopLevel = false;
          while (parent) {
            if (parent.is('program') || parent.is('module')) {
              isTopLevel = true;
              break;
            }
            if (parent.is('statement_block')) {
              const grandParent = parent.parent();
              if (grandParent && (grandParent.is('program') || grandParent.is('module'))) {
                isTopLevel = true;
                break;
              }
            }
            parent = parent.parent();
          }
          if (isTopLevel) {
            const init = declarator.find({
              rule: {
                any: [{ kind: 'arrow_function' }, { kind: 'function_expression' }],
              },
            });
            if (init) {
              const renderCalls = init.findAll({
                rule: {
                  kind: 'call_expression',
                  has: {
                    field: 'function',
                    kind: 'identifier',
                    regex: '^render$',
                  },
                },
              });
              if (renderCalls.length > 0) {
                customRenderFunctions.add(funcName);
              }
            }
          }
        }
      }
    }
  }

  return customRenderFunctions;
}

function findCustomRenderFunctionDefinitions(
  rootNode: SgNode<TSX>,
  customRenderFunctionsSet: Set<string>,
): SgNode<TSX>[] {
  const customRenderFunctions: SgNode<TSX>[] = [];

  const functionDeclarations = rootNode.findAll({
    rule: { kind: 'function_declaration' },
  });
  for (const funcDecl of functionDeclarations) {
    const nameNode = funcDecl.find({
      rule: { kind: 'identifier' },
    });
    if (nameNode) {
      const funcName = nameNode.text();
      if (customRenderFunctionsSet.has(funcName)) {
        customRenderFunctions.push(funcDecl);
      }
    }
  }

  const variableDeclarations = rootNode.findAll({
    rule: { kind: 'lexical_declaration' },
  });
  for (const varDecl of variableDeclarations) {
    const declarators = varDecl.findAll({
      rule: { kind: 'variable_declarator' },
    });
    for (const declarator of declarators) {
      const nameNode = declarator.find({
        rule: { kind: 'identifier' },
      });
      if (nameNode) {
        const funcName = nameNode.text();
        if (customRenderFunctionsSet.has(funcName)) {
          const init = declarator.find({
            rule: {
              any: [{ kind: 'arrow_function' }, { kind: 'function_expression' }],
            },
          });
          if (init) {
            customRenderFunctions.push(init);
          }
        }
      }
    }
  }

  return customRenderFunctions;
}

function findCustomRenderFunctionCalls(
  rootNode: SgNode<TSX>,
  customRenderFunctionsSet: Set<string>,
): SgNode<TSX>[] {
  const customRenderCalls: SgNode<TSX>[] = [];
  const allCallExpressions = rootNode.findAll({
    rule: { kind: 'call_expression' },
  });

  for (const callExpr of allCallExpressions) {
    const funcNode = callExpr.field('function');
    if (!funcNode) continue;

    let calledFunctionName: string | null = null;
    if (funcNode.is('identifier')) {
      calledFunctionName = funcNode.text();
    } else if (funcNode.is('member_expression')) {
      continue;
    }

    if (calledFunctionName && customRenderFunctionsSet.has(calledFunctionName)) {
      customRenderCalls.push(callExpr);
    }
  }

  return customRenderCalls;
}

function findRNTLFunctionCallsInNode(
  funcNode: SgNode<TSX>,
  importedFunctions: Set<string>,
): SgNode<TSX>[] {
  const rntlCalls: SgNode<TSX>[] = [];

  for (const funcName of importedFunctions) {
    const calls = funcNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'identifier',
          regex: `^${funcName}$`,
        },
      },
    });
    rntlCalls.push(...calls);
  }

  if (importedFunctions.has('fireEvent')) {
    const fireEventMethodCalls = funcNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'member_expression',
        },
      },
    });

    for (const call of fireEventMethodCalls) {
      const funcCallNode = call.field('function');
      if (funcCallNode && funcCallNode.is('member_expression')) {
        try {
          const object = funcCallNode.field('object');
          const property = funcCallNode.field('property');
          if (object && property) {
            const objText = object.text();
            const propText = property.text();
            if (objText === 'fireEvent' && FIRE_EVENT_METHODS_TO_MAKE_ASYNC.has(propText)) {
              rntlCalls.push(call);
            }
          }
        } catch {
          // Skip nodes where field() is not available or AST structure doesn't match expectations.
          // This is expected for malformed or edge-case AST structures and should be silently ignored.
        }
      }
    }
  }

  return rntlCalls;
}

function transformRNTLCallsInsideCustomRender(
  funcNode: SgNode<TSX>,
  importedFunctions: Set<string>,
  edits: Edit[],
  customRenderFunctionsToMakeAsync: Map<number, SgNode<TSX>>,
  rootNode: SgNode<TSX>,
): void {
  const rntlCalls = findRNTLFunctionCallsInNode(funcNode, importedFunctions);
  let needsAsync = false;

  for (const rntlCall of rntlCalls) {
    const parent = rntlCall.parent();
    if (parent && parent.is('await_expression')) {
      continue;
    }

    const callStart = rntlCall.range().start.index;
    edits.push({
      startPos: callStart,
      endPos: callStart,
      insertedText: 'await ',
    });
    needsAsync = true;
  }

  if (needsAsync && !customRenderFunctionsToMakeAsync.has(funcNode.id())) {
    const isAsync = isFunctionAlreadyAsync(funcNode);
    if (!isAsync) {
      customRenderFunctionsToMakeAsync.set(funcNode.id(), funcNode);
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
