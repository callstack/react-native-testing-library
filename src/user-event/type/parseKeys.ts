const knownKeys = new Set(['Enter', 'Backspace']);

export function parseKeys(text: string) {
  const result = [];

  let remainingText = text;
  while (remainingText) {
    const [token, rest] = getNextToken(remainingText);
    if (token.length > 1 && !knownKeys.has(token)) {
      throw new Error(`Unknown key "${token}" in "${text}"`);
    }

    result.push(token);
    remainingText = rest;
  }

  return result;
}

function getNextToken(text: string): [string, string] {
  // Detect `{{` => escaped `{`
  if (text[0] === '{' && text[1] === '{') {
    return ['{', text.slice(2)];
  }

  // Detect `{key}` => special key
  if (text[0] === '{') {
    const endIndex = text.indexOf('}');
    if (endIndex === -1) {
      throw new Error(`Invalid key sequence "${text}"`);
    }

    return [text.slice(1, endIndex), text.slice(endIndex + 1)];
  }

  if (text[0] === '\n') {
    return ['Enter', text.slice(1)];
  }

  return [text[0], text.slice(1)];
}
