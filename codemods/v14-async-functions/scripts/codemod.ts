import type { Transform } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { Edit, SgNode } from '@codemod.com/jssg-types/main';

// Functions that should be transformed to async
const FUNCTIONS_TO_TRANSFORM = new Set(['render', 'renderHook', 'act', 'fireEvent']);

// fireEvent methods that should be transformed to async
const FIRE_EVENT_METHODS = new Set(['press', 'changeText', 'scroll']);

// Screen methods that should be transformed to async
const SCREEN_METHODS = new Set(['rerender', 'unmount']);

// Renderer methods that should be transformed to async (methods on render() return value)
const RENDERER_METHODS = new Set(['rerender', 'unmount']);

// Variants that should be skipped (they're already async or have different behavior)
const SKIP_VARIANTS = new Set(['unsafe_renderHookSync', 'unsafe_act']);

// Async variants that should be renamed to their sync names (they're already async)
const ASYNC_VARIANTS_TO_RENAME = new Map([
  ['renderAsync', 'render'],
  ['renderHookAsync', 'renderHook'],
  ['fireEventAsync', 'fireEvent'],
]);

const transform: Transform<TSX> = async (root, options) => {
  const rootNode = root.root();

  // Parse custom render functions from workflow parameters or environment variable
  // Priority: 1. --param customRenderFunctions=... 2. CUSTOM_RENDER_FUNCTIONS env var
  // Format: "renderWithProviders,renderWithTheme,renderCustom"
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

  // If we have custom render functions to process, we should still process the file
  // even if it doesn't have RNTL imports (it might call custom render functions)
  if (rntlImports.length === 0 && customRenderFunctionsSet.size === 0) {
    return null; // No RNTL imports and no custom render functions, skip this file
  }

  // Track which functions are imported using a Set
  const importedFunctions = new Set<string>();
  
  // Track which async variant specifiers need to be removed (because target name already exists)
  const specifiersToRemove: Array<{ specifier: SgNode<TSX>; importStmt: SgNode<TSX> }> = [];
  
  // Initialize edits array for collecting transformations
  const edits: Edit[] = [];
  
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
      
      // First pass: collect all imported names to detect duplicates
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
      
      // Second pass: process each specifier
      for (const specifier of specifiers) {
        const identifier = specifier.find({
          rule: { kind: 'identifier' },
        });
        if (identifier) {
          const funcName = identifier.text();
          // Check if this is an async variant that needs to be renamed
          if (ASYNC_VARIANTS_TO_RENAME.has(funcName)) {
            const newName = ASYNC_VARIANTS_TO_RENAME.get(funcName)!;
            // Check if the target name is already imported
            if (importedNames.has(newName)) {
              // Target name already exists - mark this specifier for removal
              // The renaming logic below will rename all usages of the async variant to the sync name
              specifiersToRemove.push({ specifier, importStmt });
              // Track the target name as imported (since it already exists)
              importedFunctions.add(newName);
            } else {
              // Target name doesn't exist, rename the async variant in the import
              const identifierRange = identifier.range();
              edits.push({
                startPos: identifierRange.start.index,
                endPos: identifierRange.end.index,
                insertedText: newName,
              });
              // Track the renamed function as imported
              importedFunctions.add(newName);
            }
          } else if (FUNCTIONS_TO_TRANSFORM.has(funcName)) {
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

  // Remove duplicate specifiers (async variants whose target name already exists)
  // Sort by position in reverse order to avoid offset issues
  specifiersToRemove.sort((a, b) => b.specifier.range().start.index - a.specifier.range().start.index);
  
  for (const { specifier } of specifiersToRemove) {
    const specifierRange = specifier.range();
    const parent = specifier.parent();
    
    if (parent && parent.is('named_imports')) {
      const fullText = rootNode.text();
      const specifierEnd = specifierRange.end.index;
      
      // Check for trailing comma and whitespace
      const textAfter = fullText.substring(specifierEnd);
      const trailingCommaMatch = textAfter.match(/^\s*,\s*/);
      
      if (trailingCommaMatch) {
        // Remove specifier and trailing comma/whitespace
        edits.push({
          startPos: specifierRange.start.index,
          endPos: specifierEnd + trailingCommaMatch[0].length,
          insertedText: '',
        });
      } else {
        // Check for leading comma and whitespace before this specifier
        const textBefore = fullText.substring(0, specifierRange.start.index);
        const leadingCommaMatch = textBefore.match(/,\s*$/);
        
        if (leadingCommaMatch) {
          // Remove leading comma/whitespace and specifier
          edits.push({
            startPos: specifierRange.start.index - leadingCommaMatch[0].length,
            endPos: specifierEnd,
            insertedText: '',
          });
        } else {
          // Edge case: single specifier or malformed import (shouldn't happen normally)
          // Just remove the specifier itself
          edits.push({
            startPos: specifierRange.start.index,
            endPos: specifierEnd,
            insertedText: '',
          });
        }
      }
    }
  }

  // If we have custom render functions to process, continue even if no RNTL functions are imported
  // (the file might only call custom render functions)
  if (importedFunctions.size === 0 && customRenderFunctionsSet.size === 0) {
    return null; // None of the target functions are imported and no custom render functions, skip
  }

  // Step 1.5: Rename all usages of async variants (renderAsync -> render, etc.)
  // Find all calls to async variants and rename them throughout the file
  for (const [asyncName, syncName] of ASYNC_VARIANTS_TO_RENAME.entries()) {
    // Find all identifier usages of the async variant
    const asyncIdentifiers = rootNode.findAll({
      rule: {
        kind: 'identifier',
        regex: `^${asyncName}$`,
      },
    });
    
    for (const identifier of asyncIdentifiers) {
      // Skip if it's already in an import (we handled that above)
      const parent = identifier.parent();
      if (parent && parent.is('import_specifier')) {
        continue;
      }
      // Rename the usage - these are already async so they don't need await
      const identifierRange = identifier.range();
      edits.push({
        startPos: identifierRange.start.index,
        endPos: identifierRange.end.index,
        insertedText: syncName,
      });
    }
    
    // Also handle member expressions like fireEventAsync.press -> fireEvent.press
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

  // Step 2: Find all call expressions for imported functions
  const functionCalls: SgNode<TSX>[] = [];

  // Find standalone function calls (render, act, renderHook, fireEvent)
  // Note: renderAsync, renderHookAsync, fireEventAsync are already renamed above
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

  // Find fireEvent method calls (fireEvent.press, fireEvent.changeText, fireEvent.scroll)
  // Also check for fireEventAsync variants that will be renamed
  const fireEventNames = new Set<string>();
  if (importedFunctions.has('fireEvent')) {
    fireEventNames.add('fireEvent');
  }
  // Also check for async variants that will be renamed to fireEvent
  for (const [asyncName, syncName] of ASYNC_VARIANTS_TO_RENAME.entries()) {
    if (syncName === 'fireEvent') {
      // Check if this async variant was imported (even if it will be removed)
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
            // Check if it's fireEvent.methodName or fireEventAsync.methodName where methodName is one of our target methods
            if (fireEventNames.has(objText) && FIRE_EVENT_METHODS.has(propText)) {
              functionCalls.push(call);
            }
          }
        } catch {
          // field() might not be available for this node type, skip
        }
      }
    }
  }

  // Find screen method calls (screen.rerender, screen.unmount)
  // Check if screen is imported or available
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
          // Check if it's screen.methodName where methodName is rerender or unmount
          if (objText === 'screen' && SCREEN_METHODS.has(propText)) {
            functionCalls.push(call);
          }
        }
      } catch {
        // field() might not be available for this node type, skip
      }
    }
  }

  // Find renderer method calls (renderer.rerender, renderer.unmount)
  // Track variables that are assigned the result of render() calls
  const rendererVariables = new Set<string>();
  
  // Find all render() calls and track what they're assigned to
  if (importedFunctions.has('render')) {
    const renderCalls = rootNode.findAll({
      rule: {
        kind: 'call_expression',
        has: {
          field: 'function',
          kind: 'identifier',
          regex: '^render$',
        },
      },
    });

    for (const renderCall of renderCalls) {
      // Check if this render() call is assigned to a variable
      // Handle both: const renderer = render(...) and const renderer = await render(...)
      let parent = renderCall.parent();
      const isAwaited = parent && parent.is('await_expression');
      
      // If awaited, get the await expression's parent
      if (isAwaited) {
        parent = parent.parent();
      }
      
      if (parent && parent.is('variable_declarator')) {
        // Handle: const renderer = render(...) or const { rerender, unmount } = render(...)
        // Try to find object_pattern first (destructuring)
        const objectPattern = parent.find({
          rule: { kind: 'object_pattern' },
        });
        if (objectPattern) {
          // Destructuring: const { rerender, unmount } = ...
          const shorthandProps = objectPattern.findAll({
            rule: { kind: 'shorthand_property_identifier_pattern' },
          });
          for (const prop of shorthandProps) {
            // The shorthand_property_identifier_pattern IS the identifier
            const propName = prop.text();
            if (RENDERER_METHODS.has(propName)) {
              rendererVariables.add(propName);
            }
          }
        } else {
          // Simple variable assignment: const renderer = ...
          const nameNode = parent.find({
            rule: { kind: 'identifier' },
          });
          if (nameNode) {
            const varName = nameNode.text();
            rendererVariables.add(varName);
          }
        }
      } else if (parent && parent.is('assignment_expression')) {
        // Handle: renderer = render(...) or renderer = await render(...)
        const left = parent.find({
          rule: { kind: 'identifier' },
        });
        if (left) {
          const varName = left.text();
          rendererVariables.add(varName);
        } else {
          // Handle destructuring assignment: { rerender } = render(...)
          const objectPattern = parent.find({
            rule: { kind: 'object_pattern' },
          });
          if (objectPattern) {
            const shorthandProps = objectPattern.findAll({
              rule: { kind: 'shorthand_property_identifier_pattern' },
            });
            for (const prop of shorthandProps) {
              // The shorthand_property_identifier_pattern IS the identifier
              const propName = prop.text();
              if (RENDERER_METHODS.has(propName)) {
                rendererVariables.add(propName);
              }
            }
          }
        }
      }
    }

    // Now find calls to .rerender() or .unmount() on these variables
    // Handle both: renderer.rerender() and rerender() (when destructured)
    if (rendererVariables.size > 0) {
      // Find member expression calls: renderer.rerender()
      const rendererMethodCalls = rootNode.findAll({
        rule: {
          kind: 'call_expression',
          has: {
            field: 'function',
            kind: 'member_expression',
          },
        },
      });

      for (const call of rendererMethodCalls) {
        const funcNode = call.field('function');
        if (funcNode && funcNode.is('member_expression')) {
          try {
            const object = funcNode.field('object');
            const property = funcNode.field('property');
            if (object && property) {
              const objText = object.text();
              const propText = property.text();
              // Check if it's rendererVariable.methodName where methodName is rerender or unmount
              if (rendererVariables.has(objText) && RENDERER_METHODS.has(propText)) {
                functionCalls.push(call);
              }
            }
          } catch {
            // field() might not be available for this node type, skip
          }
        }
      }

      // Find direct identifier calls: rerender() and unmount() (when destructured)
      for (const varName of rendererVariables) {
        if (RENDERER_METHODS.has(varName)) {
          // This is a destructured method name (rerender or unmount)
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
  }

  if (functionCalls.length === 0 && customRenderFunctionsSet.size === 0) {
    // If we have rename edits (from async variants), we should still return them
    if (edits.length === 0) {
      return null; // No function calls found and no custom render functions to process
    }
  }

  const functionsToMakeAsync = new Map<number, SgNode<TSX>>(); // Use Map with node ID to ensure uniqueness
  const customRenderFunctionsToMakeAsync = new Map<number, SgNode<TSX>>(); // Track custom render functions that need to be async

  // Step 2.5: Find and process custom render function definitions
  // Note: This only processes definitions. Calls to custom render functions are handled in Step 3.5
  // We need importedFunctions to be populated to find RNTL calls inside custom render functions
  // If there are no RNTL imports but we have custom render functions, we still want to process
  // calls to custom render functions in tests (Step 3.5), but we can't process their definitions
  if (customRenderFunctionsSet.size > 0 && importedFunctions.size > 0) {
    // Find function declarations
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
          // Found a custom render function declaration
          processCustomRenderFunction(
            funcDecl,
            importedFunctions,
            edits,
            customRenderFunctionsToMakeAsync,
            rootNode,
          );
        }
      }
    }

    // Find arrow functions and function expressions (const renderWithX = () => {} or const renderWithX = function() {})
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
            // Check if it's an arrow function or function expression
            const init = declarator.find({
              rule: {
                any: [{ kind: 'arrow_function' }, { kind: 'function_expression' }],
              },
            });
            if (init) {
              // Found a custom render function (arrow or expression)
              processCustomRenderFunction(
                init,
                importedFunctions,
                edits,
                customRenderFunctionsToMakeAsync,
                rootNode,
              );
            }
          }
        }
      }
    }
  }

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

    // Step 4: Find the containing function (test/it/hook callback)
    const containingFunction = findContainingTestFunction(functionCall);
    if (!containingFunction) {
      // Not inside a test function or hook, skip (could be a helper function)
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

  // Step 3.5: Transform calls to custom render functions in tests
  if (customRenderFunctionsSet.size > 0) {
    const allCallExpressions = rootNode.findAll({
      rule: { kind: 'call_expression' },
    });
    let foundCustomCalls = 0;
    for (const callExpr of allCallExpressions) {
      const funcNode = callExpr.field('function');
      if (!funcNode) continue;

      let calledFunctionName: string | null = null;
      if (funcNode.is('identifier')) {
        calledFunctionName = funcNode.text();
      } else if (funcNode.is('member_expression')) {
        // Skip member expressions (e.g., obj.renderWithX())
        continue;
      }

      if (calledFunctionName && customRenderFunctionsSet.has(calledFunctionName)) {
        foundCustomCalls++;
        // Check if this call is inside a test function
        const containingFunction = findContainingTestFunction(callExpr);
        if (containingFunction) {
          // Skip if already awaited
          const parent = callExpr.parent();
          if (parent && parent.is('await_expression')) {
            continue;
          }

          // Track that the test function needs to be async
          let isAsync = false;
          if (containingFunction.is('arrow_function')) {
            const children = containingFunction.children();
            isAsync = children.some((child) => child.text() === 'async');
          } else {
            const funcStart = containingFunction.range().start.index;
            const textBefore = rootNode.text().substring(Math.max(0, funcStart - 10), funcStart);
            isAsync = textBefore.trim().endsWith('async');
          }

          if (!isAsync && !functionsToMakeAsync.has(containingFunction.id())) {
            functionsToMakeAsync.set(containingFunction.id(), containingFunction);
          }

          // Add await before the call
          const callStart = callExpr.range().start.index;
          edits.push({
            startPos: callStart,
            endPos: callStart,
            insertedText: 'await ',
          });
        }
      }
    }
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

  // Step 7.5: Add async keyword to custom render functions that need it
  for (const func of customRenderFunctionsToMakeAsync.values()) {
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

  if (edits.length === 0) {
    return null; // No changes needed
  }

  // Sort edits by position (reverse order to avoid offset issues)
  edits.sort((a, b) => b.startPos - a.startPos);

  if (edits.length === 0) {
    return null; // No changes needed
  }

  // Sort edits by position (reverse order to avoid offset issues)
  edits.sort((a, b) => b.startPos - a.startPos);

  return rootNode.commitEdits(edits);
};

/**
 * Process a custom render function: find RNTL calls inside it and transform them
 */
function processCustomRenderFunction(
  funcNode: SgNode<TSX>,
  importedFunctions: Set<string>,
  edits: Edit[],
  customRenderFunctionsToMakeAsync: Map<number, SgNode<TSX>>,
  rootNode: SgNode<TSX>,
): void {
  // Find RNTL function calls inside this custom render function
  const rntlCalls: SgNode<TSX>[] = [];


  // Find standalone function calls (render, act, renderHook, fireEvent)
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
    if (calls.length > 0) {
    }
    rntlCalls.push(...calls);
  }

  // Find fireEvent method calls
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
            if (objText === 'fireEvent' && FIRE_EVENT_METHODS.has(propText)) {
              rntlCalls.push(call);
            }
          }
        } catch {
          // Skip if field() is not available
        }
      }
    }
  }


  // Process each RNTL call found inside the custom render function
  let needsAsync = false;
  for (const rntlCall of rntlCalls) {
    // Skip if already awaited
    const parent = rntlCall.parent();
    if (parent && parent.is('await_expression')) {
      continue;
    }

    // Skip variants that should not be transformed
    const functionNode = rntlCall.field('function');
    if (functionNode) {
      const funcName = functionNode.text();
      if (SKIP_VARIANTS.has(funcName)) {
        continue;
      }
    }

    // Add await before the call
    const callStart = rntlCall.range().start.index;
    edits.push({
      startPos: callStart,
      endPos: callStart,
      insertedText: 'await ',
    });
    needsAsync = true;
  }

  // Track that this custom render function needs to be async
  if (needsAsync && !customRenderFunctionsToMakeAsync.has(funcNode.id())) {
    // Check if function is already async
    let isAsync = false;
    if (funcNode.is('arrow_function')) {
      const children = funcNode.children();
      isAsync = children.some((child) => child.text() === 'async');
    } else {
      const funcStart = funcNode.range().start.index;
      const textBefore = rootNode.text().substring(Math.max(0, funcStart - 10), funcStart);
      isAsync = textBefore.trim().endsWith('async');
    }

    if (!isAsync) {
      customRenderFunctionsToMakeAsync.set(funcNode.id(), funcNode);
    }
  }
}

/**
 * Find the containing test function or hook callback (test/it/beforeEach/afterEach/etc.) for a given node
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
              // Match test, it, describe, beforeEach, afterEach, beforeAll, afterAll
              if (/^(test|it|describe|beforeEach|afterEach|beforeAll|afterAll)$/.test(funcText)) {
                return current;
              }
              // Handle test.skip, it.skip, etc. (member expressions)
              if (funcNode.is('member_expression')) {
                try {
                  // @ts-expect-error - field() types are complex, but this works at runtime
                  const object = funcNode.field('object');
                  // @ts-expect-error - field() types are complex, but this works at runtime
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
            if (/^(test|it|describe|beforeEach|afterEach|beforeAll|afterAll)$/.test(funcText)) {
              return current;
            }
            if (funcNode.is('member_expression')) {
              try {
                // @ts-expect-error - field() types are complex, but this works at runtime
                const object = funcNode.field('object');
                // @ts-expect-error - field() types are complex, but this works at runtime
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
