import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";
import type { Edit, SgNode } from "@codemod.com/jssg-types/main";

const transform: Transform<TSX> = async (root) => {
  const rootNode = root.root();

  // Step 1: Check if render is imported from @testing-library/react-native
  const renderImports = rootNode.findAll({
    rule: {
      kind: "import_statement",
      has: {
        kind: "string",
        regex: "@testing-library/react-native",
      },
    },
  });

  if (renderImports.length === 0) {
    return null; // No RNTL imports, skip this file
  }

  // Check if 'render' is actually imported
  let hasRenderImport = false;
  for (const importStmt of renderImports) {
    const importClause = importStmt.find({
      rule: { kind: "import_clause" },
    });
    if (!importClause) continue;

    // Check for named imports: import { render, ... } from ...
    const namedImports = importClause.find({
      rule: { kind: "named_imports" },
    });
    if (namedImports) {
      const renderSpecifier = namedImports.find({
        rule: {
          kind: "import_specifier",
          has: {
            kind: "identifier",
            regex: "^render$",
          },
        },
      });
      if (renderSpecifier) {
        hasRenderImport = true;
        break;
      }
    }

    // Check for default import: import render from ...
    const defaultImport = importClause.find({
      rule: {
        kind: "identifier",
        regex: "^render$",
      },
    });
    if (defaultImport) {
      hasRenderImport = true;
      break;
    }

    // Check for namespace import: import * as RNTL from ... (we'll handle render calls via namespace)
    const namespaceImport = importClause.find({
      rule: { kind: "namespace_import" },
    });
    if (namespaceImport) {
      // For namespace imports, we'll check if render is called via the namespace
      // This is handled in the render call matching below
      hasRenderImport = true;
      break;
    }
  }

  if (!hasRenderImport) {
    return null; // render is not imported, skip
  }

  // Step 2: Find all render() call expressions
  // Match: render(...) where render is an identifier
  const renderCalls = rootNode.findAll({
    rule: {
      kind: "call_expression",
      has: {
        field: "function",
        kind: "identifier",
        regex: "^render$",
      },
    },
  });

  if (renderCalls.length === 0) {
    return null; // No render calls found
  }

  const edits: Edit[] = [];
  const functionsToMakeAsync = new Map<number, SgNode<TSX>>(); // Use Map with node ID to ensure uniqueness

  // Step 3: Process each render call
  for (const renderCall of renderCalls) {
    // Skip if already awaited
    const parent = renderCall.parent();
    if (parent && parent.is("await_expression")) {
      continue; // Already awaited, skip
    }

    // Skip if it's renderAsync (different function)
    const functionNode = renderCall.field("function");
    if (functionNode && functionNode.text() === "renderAsync") {
      continue;
    }

    // Verify this render call refers to the imported render from RNTL
    // We do this by checking if there's a render identifier that could refer to the import
    // For simplicity, we'll transform all render() calls and let users verify
    // In a more sophisticated version, we could use semantic analysis to verify the binding

    // Step 4: Find the containing function (test/it callback)
    const containingFunction = findContainingTestFunction(renderCall);
    if (!containingFunction) {
      // Not inside a test function, skip (could be a helper function)
      continue;
    }

    // Step 5: Track functions that need to be made async
    // Check if function is already async
    // For arrow functions, async is a child node; for function declarations, it's before "function"
    let isAsync = false;
    if (containingFunction.is("arrow_function")) {
      // Check if arrow function has async child node by checking children
      const children = containingFunction.children();
      isAsync = children.some(child => child.text() === "async");
    } else {
      // For function declarations/expressions, check text before
      const funcStart = containingFunction.range().start.index;
      const textBefore = rootNode.text().substring(Math.max(0, funcStart - 10), funcStart);
      isAsync = textBefore.trim().endsWith("async");
    }
    
    // Only add if not already async and not already in the map
    if (!isAsync && !functionsToMakeAsync.has(containingFunction.id())) {
      functionsToMakeAsync.set(containingFunction.id(), containingFunction);
    }

    // Step 6: Add await before render call
    const callStart = renderCall.range().start.index;
    edits.push({
      startPos: callStart,
      endPos: callStart,
      insertedText: "await ",
    });
  }

  // Step 7: Add async keyword to functions that need it
  for (const func of functionsToMakeAsync.values()) {
    if (func.is("arrow_function")) {
      // Arrow function: () => {} -> async () => {}
      // Insert async before the parameters
      const funcStart = func.range().start.index;
      edits.push({
        startPos: funcStart,
        endPos: funcStart,
        insertedText: "async ",
      });
    } else if (
      func.is("function_declaration") ||
      func.is("function_expression")
    ) {
      // Function declaration/expression: function name() {} -> async function name() {}
      // The "function" keyword is the first child
      const children = func.children();
      if (children.length > 0 && children[0].text() === "function") {
        // Insert "async " before "function"
        const funcKeywordStart = children[0].range().start.index;
        edits.push({
          startPos: funcKeywordStart,
          endPos: funcKeywordStart,
          insertedText: "async ",
        });
      } else {
        // Fallback: insert before function start
        const funcStart = func.range().start.index;
        edits.push({
          startPos: funcStart,
          endPos: funcStart,
          insertedText: "async ",
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
function findContainingTestFunction(
  node: SgNode<TSX>
): SgNode<TSX> | null {
  // Walk up the AST to find the containing function
  let current: SgNode<TSX> | null = node;

  while (current) {
    // Check if current node is a function
    if (
      current.is("arrow_function") ||
      current.is("function_declaration") ||
      current.is("function_expression")
    ) {
      // Check if this function is a test callback
      // The function is typically the second argument of a test/it call
      const parent = current.parent();
      if (parent) {
        // Parent could be arguments node
        if (parent.is("arguments")) {
          const grandParent = parent.parent();
          if (grandParent && grandParent.is("call_expression")) {
            const funcNode = grandParent.field("function");
            if (funcNode) {
              const funcText = funcNode.text();
              // Match test, it, describe
              if (/^(test|it|describe)$/.test(funcText)) {
                return current;
              }
              // Handle test.skip and it.skip (member expressions)
              if (funcNode.is("member_expression")) {
                const object = funcNode.field("object");
                const property = funcNode.field("property");
                if (object && property) {
                  const objText = object.text();
                  const propText = property.text();
                  if ((objText === "test" || objText === "it") && propText === "skip") {
                    return current;
                  }
                }
              }
            }
          }
        }
        // Parent could be call_expression directly (less common)
        if (parent.is("call_expression")) {
          const funcNode = parent.field("function");
          if (funcNode) {
            const funcText = funcNode.text();
            if (/^(test|it|describe)$/.test(funcText)) {
              return current;
            }
            if (funcNode.is("member_expression")) {
              const object = funcNode.field("object");
              const property = funcNode.field("property");
              if (object && property) {
                const objText = object.text();
                const propText = property.text();
                if ((objText === "test" || objText === "it") && propText === "skip") {
                  return current;
                }
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
