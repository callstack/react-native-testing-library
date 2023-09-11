import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR as receivedColor } from 'jest-matcher-utils';
import { checkHostElement, printElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: ReactTestInstance,
  element: ReactTestInstance | null
) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toContainElement, this);
  }

  let matches = [];

  if (element) {
    matches = container.findAll((node) => {
      return (
        node.type === element.type && this.equals(node.props, element.props)
      );
    });
  }

  return {
    pass: Boolean(matches.length),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element'
        ),
        '',
        receivedColor(`${printElement(container)} ${
          this.isNot ? '\n\ncontains:\n\n' : '\n\ndoes not contain:\n\n'
        } ${printElement(element)}
        `),
      ].join('\n');
    },
  };
}
