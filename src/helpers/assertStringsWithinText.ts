import { ReactTestRendererNode } from 'react-test-renderer';

export const assertStringsWithinText = (
  rendererJSON: ReactTestRendererNode | null | ReactTestRendererNode[]
) => {
  if (!rendererJSON) return;

  if (Array.isArray(rendererJSON)) {
    rendererJSON.forEach(assertStringsWithinText);
    return;
  }

  if (typeof rendererJSON === 'string') {
    return;
  }

  if (rendererJSON.type !== 'Text') {
    if (rendererJSON.children?.some((child) => typeof child === 'string')) {
      throw new Error(
        'Text strings must be rendered within a host Text component.'
      );
    }

    if (rendererJSON.children) {
      rendererJSON.children.forEach(assertStringsWithinText);
    }
  }
};
