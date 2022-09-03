import { ReactTestRendererNode } from 'react-test-renderer';

export const assertStringsWithinText = (
  rendererJSON: ReactTestRendererNode | Array<ReactTestRendererNode> | null
) => {
  if (!rendererJSON) return;

  if (Array.isArray(rendererJSON)) {
    rendererJSON.forEach(assertStringsWithinTextForNode);
    return;
  }

  return assertStringsWithinTextForNode(rendererJSON);
};

const assertStringsWithinTextForNode = (node: ReactTestRendererNode) => {
  if (typeof node === 'string') {
    return;
  }

  if (node.type !== 'Text') {
    if (node.children?.some((child) => typeof child === 'string')) {
      throw new Error(
        'Text strings must be rendered within a host Text component.'
      );
    }
  }

  if (node.children) {
    node.children.forEach(assertStringsWithinText);
  }
};
