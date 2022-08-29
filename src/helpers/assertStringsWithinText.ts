import { ReactElement } from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { filterNodeByType } from './filterNodeByType';

export const assertStringsWithinText = (instance: ReactTestInstance): void => {
  const nodesWithStringChild = instance.findAll(hasNodeStringChild);
  nodesWithStringChild.forEach((node) => {
    const isHostTextComponent = filterNodeByType(node, 'Text');
    const isNativeComponent = typeof node.type === 'string';

    if (!isHostTextComponent && isNativeComponent) {
      throw new Error(
        'Text strings must be rendered within a host Text component.'
      );
    }
  });
};

const hasNodeStringChild = (node: ReactTestInstance) => {
  const children: (string | number | ReactElement)[] = node.props.children;

  if (Array.isArray(children)) {
    return children.some((child) => typeof child === 'string');
  }

  return typeof children === 'string';
};
