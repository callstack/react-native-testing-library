import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { matchAccessibleName } from '../helpers/matchers/accessibilityName';
import {
  getAccessibilityLabel,
  getAccessibilityLabelledBy,
} from '../helpers/accessiblity';
import { TextMatch, TextMatchOptions } from '../matches';
import { getTextContent } from '../helpers/text-content';
import { getUnsafeRootElement } from '../helpers/component-tree';
import { checkHostElement, formatMessage } from './utils';

export function getAccessibleName(
  element: ReactTestInstance
): string | undefined {
  const labelTextFromLabel = getAccessibilityLabel(element);
  const labelTextFromLabelledBy = getAccessibilityLabelledBy(element);
  const rootElement = getUnsafeRootElement(element);

  const labelledByElement = labelTextFromLabelledBy
    ? rootElement?.findByProps({
        nativeID: labelTextFromLabelledBy,
      })
    : undefined;

  const nameFromLabel = labelTextFromLabelledBy
    ? labelledByElement && getTextContent(labelledByElement)
    : labelTextFromLabel;

  return nameFromLabel || getTextContent(element) || undefined;
}

export function toHaveAccessibleName(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  expectedName?: TextMatch,
  options?: TextMatchOptions
) {
  checkHostElement(element, toHaveAccessibleName, this);

  const receivedName = getAccessibleName(element);

  return {
    pass: matchAccessibleName(
      element,
      expectedName,
      options?.normalizer,
      options?.exact
    ),
    message: () => {
      return [
        formatMessage(
          matcherHint(
            `${this.isNot ? '.not' : ''}.toHaveAccessibleName`,
            'element',
            ''
          ),
          `Expected element ${
            this.isNot ? 'not to' : 'to'
          } have accessible name`,
          `${expectedName ? expectedName : ''}`,
          'Received',
          receivedName
        ),
      ].join('\n');
    },
  };
}
