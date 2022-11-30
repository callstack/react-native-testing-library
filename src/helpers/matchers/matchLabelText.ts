import { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { findAll } from '../findAll';
import { matchTextContent } from './matchTextContent';

export function matchLabelText(
  root: ReactTestInstance,
  element: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) {
  return (
    matchAccessibilityLabel(element, text, options) ||
    matchAccessibilityLabelledBy(
      root,
      element.props.accessibilityLabelledBy,
      text,
      options
    )
  );
}

function matchAccessibilityLabel(
  element: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions
) {
  const { exact, normalizer } = options;
  return matches(text, element.props.accessibilityLabel, normalizer, exact);
}

function matchAccessibilityLabelledBy(
  root: ReactTestInstance,
  nativeId: string | undefined,
  text: TextMatch,
  options: TextMatchOptions
) {
  if (!nativeId) {
    return false;
  }

  return (
    findAll(
      root,
      (element) =>
        element.props?.nativeID === nativeId &&
        matchTextContent(element, text, options)
    ).length > 0
  );
}
