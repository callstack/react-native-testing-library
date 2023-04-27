export interface TextRange {
  start: number;
  end: number;
}

export function getTextRange(text: string): TextRange {
  return {
    start: text.length,
    end: text.length,
  };
}
