// @flow
export type NormalizerFn = (textToNormalize: string) => string;

function matches(
  matcher: string | RegExp,
  text: string,
  normalizer: NormalizerFn,
  exact?: boolean = true
) {
  if (typeof text !== 'string') {
    return false;
  }

  const normalizedText = normalizer(text);
  if (typeof matcher === 'string') {
    return exact
      ? normalizedText === matcher
      : normalizedText.toLowerCase().includes(matcher.toLowerCase());
  } else {
    return matcher.test(normalizedText);
  }
}

type NormalizerConfig = {
  trim?: boolean,
  collapseWhitespace?: boolean,
};

function getDefaultNormalizer({
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

type NormalizerInput = {
  normalizer?: NormalizerFn,
};

export { matches, getDefaultNormalizer };
