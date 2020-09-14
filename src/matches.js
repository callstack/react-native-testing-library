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

function getDefaultNormalizer({
  trim = true,
  collapseWhitespace = true,
}: NormalizerInput = {}): NormalizerFn {
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
  trim?: boolean,
  collapseWhitespace?: boolean,
  normalizer?: NormalizerFn,
};

function makeNormalizer({
  trim,
  collapseWhitespace,
  normalizer,
}: NormalizerInput = {}): NormalizerFn {
  if (normalizer) {
    if (trim !== undefined || collapseWhitespace !== undefined) {
      throw new Error(
        'trim and collapseWhitespace are not supported with a normalizer. ' +
          'If you want to use the default trim and collapseWhitespace logic in your normalizer, ' +
          'use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer'
      );
    }

    return normalizer;
  } else {
    return getDefaultNormalizer({ trim, collapseWhitespace });
  }
}

export { matches, getDefaultNormalizer, makeNormalizer };
