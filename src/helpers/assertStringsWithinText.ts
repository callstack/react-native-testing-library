import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { filterNodeByType } from './filterNodeByType';

export const assertStringsWithinText = (instance: ReactTestInstance): void => {
  const nodesWithStringChild = instance.findAll((node) =>
    isSomeChildStringOrNumber(node.props.children)
  );
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

const isSomeChildStringOrNumber = (
  children:
    | string
    | number
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
): boolean => {
  if (Array.isArray(children)) {
    return children.some((child) => {
      if (filterNodeByType(child, React.Fragment)) {
        return isSomeChildStringOrNumber(child.props.children);
      }
      return typeof child === 'string' || typeof child === 'number';
    });
  }

  if (children === undefined || children === null) {
    return false;
  }

  if (typeof children === 'string' || typeof children === 'number') {
    return true;
  }

  if (filterNodeByType(children, React.Fragment)) {
    return isSomeChildStringOrNumber(children.props.children);
  }

  return false;
};
