import { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import {
  getAccessibilityLabel,
  getAccessibilityLabelledBy,
} from '../accessiblity';
import { findAll } from '../find-all';
import { matchTextContent } from './match-text-content';

export function matchLabelText(
  root: ReactTestInstance,
  element: ReactTestInstance,
  expectedText: TextMatch,
  options: TextMatchOptions = {}
) {
  return (
    matchAccessibilityLabel(element, expectedText, options) ||
    matchAccessibilityLabelledBy(
      root,
      getAccessibilityLabelledBy(element),
      expectedText,
      options
    )
  );
}

function matchAccessibilityLabel(
  element: ReactTestInstance,
  extpectedLabel: TextMatch,
  options: TextMatchOptions
) {
  return matches(
    extpectedLabel,
    getAccessibilityLabel(element),
    options.normalizer,
    options.exact
  );
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
      (node) =>
        node.props.nativeID === nativeId &&
        matchTextContent(node, text, options)
    ).length > 0
  );
}
