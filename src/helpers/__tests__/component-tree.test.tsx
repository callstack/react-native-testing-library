import React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';
import { getContainerElement, getHostSiblings } from '../component-tree';

function MultipleHostChildren() {
  return (
    <>
      <View testID="child1" />
      <View testID="child2" />
      <View testID="child3" />
    </>
  );
}

describe('getHostSiblings()', () => {
  it('returns host siblings for host component', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="siblingBefore" />
          <View testID="subject" />
          <View testID="siblingAfter" />
          <MultipleHostChildren />
        </View>
      </View>,
    );

    const hostSiblings = getHostSiblings(screen.getByTestId('subject'));
    expect(hostSiblings).toEqual([
      screen.getByTestId('siblingBefore'),
      screen.getByTestId('siblingAfter'),
      screen.getByTestId('child1'),
      screen.getByTestId('child2'),
      screen.getByTestId('child3'),
    ]);
  });
});

describe('getRootElement()', () => {
  it('returns container for mounted view', () => {
    render(
      <View>
        <View testID="view" />
      </View>,
    );

    const view = screen.getByTestId('view');
    expect(getContainerElement(view)).toEqual(screen.container);
  });
});
