import React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';
import { findClosestInstance, getContainerInstance, getInstanceSiblings } from '../component-tree';

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
  it('returns host siblings for host component', async () => {
    await render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="siblingBefore" />
          <View testID="subject" />
          <View testID="siblingAfter" />
          <MultipleHostChildren />
        </View>
      </View>,
    );

    const hostSiblings = getInstanceSiblings(screen.getByTestId('subject'));
    expect(hostSiblings).toEqual([
      screen.getByTestId('siblingBefore'),
      screen.getByTestId('siblingAfter'),
      screen.getByTestId('child1'),
      screen.getByTestId('child2'),
      screen.getByTestId('child3'),
    ]);
  });
});

describe('getContainerInstance()', () => {
  it('returns container for mounted view', async () => {
    await render(
      <View>
        <View testID="view" />
      </View>,
    );

    const view = screen.getByTestId('view');
    expect(getContainerInstance(view)).toEqual(screen.container);
  });
});

describe('findClosestInstance()', () => {
  it('returns the element itself when it matches', async () => {
    await render(
      <View testID="parent">
        <View testID="subject" />
      </View>,
    );

    const subject = screen.getByTestId('subject');
    expect(findClosestInstance(subject, () => true)).toBe(subject);
  });

  it('returns the nearest matching ancestor', async () => {
    await render(
      <View testID="grandparent" accessible>
        <View testID="parent" accessible>
          <View testID="subject" />
        </View>
      </View>,
    );

    const ancestor = findClosestInstance(
      screen.getByTestId('subject'),
      (instance) => instance.props.accessible === true,
    );
    expect(ancestor).toBe(screen.getByTestId('parent'));
  });

  it('returns null when nothing matches', async () => {
    await render(
      <View>
        <View testID="subject" />
      </View>,
    );

    expect(findClosestInstance(screen.getByTestId('subject'), () => false)).toBeNull();
  });
});
