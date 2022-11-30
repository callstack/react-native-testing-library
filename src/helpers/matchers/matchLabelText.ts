import { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { matchTextContent } from './matchTextContent';

export function matchLabelText(
  rootInstance: ReactTestInstance,
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) {
  return (
    matchAccessibilityLabel(node, text, options) ||
    matchAccessibilityLabelledBy(
      rootInstance,
      node.props.accessibilityLabelledBy,
      text,
      options
    )
  );
}

export function matchAccessibilityLabel(
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions
) {
  const { exact, normalizer } = options;
  return matches(text, node.props.accessibilityLabel, normalizer, exact);
}

export function matchAccessibilityLabelledBy(
  rootInstance: ReactTestInstance,
  nativeID: string | undefined,
  text: TextMatch,
  options: TextMatchOptions
) {
  if (!nativeID) {
    return false;
  }

  const { exact, normalizer } = options;
  return rootInstance
    .findAll((node) =>
      matches(nativeID, node.props?.nativeID, normalizer, exact)
    )
    .some((node) => matchTextContent(node, text));
}
