export type NormalizerFn = (textToNormalize: string) => string;
export type TextMatch = string | RegExp;

export function matches(
  matcher: TextMatch,
  text: string,
  normalizer: NormalizerFn = getDefaultNormalizer(),
  exact: boolean = true
): boolean {
  if (typeof text !== 'string') {
    return false;
  }

  const normalizedText = normalizer(text);
  if (typeof matcher === 'string') {
    const normalizedMatcher = normalizer(matcher);
    return exact
      ? normalizedText === normalizedMatcher
      : normalizedText.toLowerCase().includes(normalizedMatcher.toLowerCase());
  } else {
    return matcher.test(normalizedText);
  }
}

type NormalizerConfig = {
  trim?: boolean;
  collapseWhitespace?: boolean;
};

export function getDefaultNormalizer({
  trim = true,
  collapseWhitespace = true,
}: NormalizerConfig = {}): NormalizerFn {
  return (text: string) => {
    let normalizedText = text;
    normalizedText = trim ? normalizedText.trim() : normalizedText;
    normalizedText = collapseWhitespace
      ? normalizedText.replace(/\s+/g, ' ')
      : normalizedText;
    return normalizedText;
  };
}
