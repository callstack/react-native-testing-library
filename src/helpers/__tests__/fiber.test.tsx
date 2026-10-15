import React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';
import { getComponentName, getCompositeOwnerFibers } from '../fiber';

function Inner() {
  return <View testID="view" />;
}

const Memoized = React.memo(Inner);

describe('getCompositeOwnerFibers()', () => {
  it('returns composites up to the next host element, nearest first', async () => {
    function Outer() {
      return <Memoized />;
    }

    await render(
      <View>
        <Outer />
      </View>,
    );

    const names = getCompositeOwnerFibers(screen.getByTestId('view')).map((fiber) =>
      getComponentName(fiber.type),
    );
    expect(names).toEqual(['View', 'Inner', 'Outer']);
  });
});

describe('getComponentName()', () => {
  it('returns the name of a function component', () => {
    expect(getComponentName(Inner)).toBe('Inner');
  });

  it('prefers displayName', () => {
    function Named() {
      return null;
    }
    Named.displayName = 'CustomName';
    expect(getComponentName(Named)).toBe('CustomName');
  });

  it('unwraps memo() and forwardRef()', () => {
    expect(getComponentName(React.memo(Inner))).toBe('Inner');
    expect(getComponentName(React.forwardRef(Inner))).toBe('Inner');
  });

  it('prefers displayName of the wrapper', () => {
    const Wrapped = React.memo(Inner);
    Wrapped.displayName = 'Wrapped';
    expect(getComponentName(Wrapped)).toBe('Wrapped');
  });

  it('returns null for unnamed or unknown types', () => {
    expect(getComponentName(() => null)).toBeNull();
    expect(getComponentName('View')).toBeNull();
    expect(getComponentName(null)).toBeNull();
    expect(getComponentName({})).toBeNull();
  });
});
