// @flow
export type NormalizerFn = (textToNormalize: string) => string;

function matches(
  textToMatch: string,
  matcher: string | RegExp,
  normalizer: NormalizerFn,
  exact?: boolean = true
) {
  if (typeof textToMatch !== 'string') {
    return false;
  }

  const normalizedText = normalizer(textToMatch);
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
