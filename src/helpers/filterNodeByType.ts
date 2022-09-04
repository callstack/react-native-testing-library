import type { ReactTestInstance } from 'react-test-renderer';
import * as React from 'react';

export const filterNodeByType = (
  node: ReactTestInstance | React.ReactElement,
  type: React.ElementType | string
) => node.type === type;
