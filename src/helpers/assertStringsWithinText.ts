import React, { ReactElement } from 'react';
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
  let nodeHasStringChild = false;

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      nodeHasStringChild = true;
    }
  });

  return nodeHasStringChild;
};
