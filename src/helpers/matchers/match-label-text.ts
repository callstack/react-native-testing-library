import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { computeAriaLabel, computeAriaLabelledBy } from '../accessibility';
import { findAll } from '../find-all';
import { matchTextContent } from './match-text-content';

export function matchLabelText(
  root: HostElement,
  element: HostElement,
  expectedText: TextMatch,
  options: TextMatchOptions = {},
) {
  return (
    matchAccessibilityLabel(element, expectedText, options) ||
    matchAccessibilityLabelledBy(root, computeAriaLabelledBy(element), expectedText, options)
  );
}

function matchAccessibilityLabel(
  element: HostElement,
  expectedLabel: TextMatch,
  options: TextMatchOptions,
) {
  return matches(expectedLabel, computeAriaLabel(element), options.normalizer, options.exact);
}

function matchAccessibilityLabelledBy(
  root: HostElement,
  nativeId: string | undefined,
  text: TextMatch,
  options: TextMatchOptions,
) {
  if (!nativeId) {
    return false;
  }

  return (
    findAll(
      root,
      (node) => node.props.nativeID === nativeId && matchTextContent(node, text, options),
    ).length > 0
  );
}
