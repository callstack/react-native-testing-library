import * as React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  Pressable,
  Button as RNButton,
} from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with role: "${value}"`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with role: "${value}"`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity accessibilityRole="button">
    <Typography accessibilityRole="link">{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityRole="link">Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByRole, queryByRole, findByRole', async () => {
  const { getByRole, queryByRole, findByRole } = render(<Section />);

  expect(getByRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByRole(/button/g);
  expect(button?.props.accessibilityRole).toEqual('button');

  expect(() => getByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );

  expect(queryByRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('link')
  );
  expect(() => queryByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('link')
  );

  const asyncButton = await findByRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(findByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
  await expect(findByRole('link')).rejects.toThrow(
    getMultipleInstancesFoundMessage('link')
  );
});

test('getAllByRole, queryAllByRole, findAllByRole', async () => {
  const { getAllByRole, queryAllByRole, findAllByRole } = render(<Section />);

  expect(getAllByRole('link')).toHaveLength(2);
  expect(queryAllByRole(/ink/g)).toHaveLength(2);

  expect(() => getAllByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
  expect(queryAllByRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByRole('link')).resolves.toHaveLength(2);
  await expect(findAllByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
});

describe('supports name option', () => {
  test('returns an element that has the corresponding role and a children with the name', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role when several children include the name', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
        <Text>Save</Text>
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role and a children with a matching accessibilityLabel', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text accessibilityLabel="Save" />
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role and a matching accessibilityLabel', () => {
    const { getByRole } = render(
      <TouchableOpacity
        accessibilityRole="button"
        testID="target-button"
        accessibilityLabel="Save"
      ></TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element when the direct child is text', () => {
    const { getByRole, getByTestId } = render(
      <Text accessibilityRole="header" testID="target-header">
        About
      </Text>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(
      getByTestId('target-header')
    );
    expect(getByRole('header', { name: 'About' }).props.testID).toBe(
      'target-header'
    );
  });

  test('returns an element with nested Text as children', () => {
    const { getByRole, getByTestId } = render(
      <Text accessibilityRole="header" testID="parent">
        <Text testID="child">About</Text>
      </Text>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(getByTestId('parent'));
    expect(getByRole('header', { name: 'About' }).props.testID).toBe('parent');
  });

  test('returns a header with an accessibilityLabel', () => {
    const { getByRole, getByTestId } = render(
      <Text
        accessibilityRole="header"
        testID="target-header"
        accessibilityLabel="About"
      />
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(
      getByTestId('target-header')
    );
    expect(getByRole('header', { name: 'About' }).props.testID).toBe(
      'target-header'
    );
  });
});

describe('supports accessibility states', () => {
  describe('disabled', () => {
    test('returns a disabled element when required', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
        />
      );

      expect(getByRole('button', { disabled: true })).toBeTruthy();
      expect(queryByRole('button', { disabled: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      const { getByRole } = render(
        <>
          <TouchableOpacity
            testID="correct"
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="wrong" accessibilityRole="button">
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      );

      expect(
        getByRole('button', { name: 'Save', disabled: true }).props.testID
      ).toBe('correct');
    });

    test('returns an implicitly enabled element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity accessibilityRole="button"></TouchableOpacity>
      );

      expect(getByRole('button', { disabled: false })).toBeTruthy();
      expect(queryByRole('button', { disabled: true })).toBe(null);
    });

    test('returns an explicitly enabled element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: false }}
        ></TouchableOpacity>
      );

      expect(getByRole('button', { disabled: false })).toBeTruthy();
      expect(queryByRole('button', { disabled: true })).toBe(null);
    });

    test('does not return disabled elements when querying for non disabled', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
        ></TouchableOpacity>
      );

      expect(queryByRole('button', { disabled: false })).toBe(null);
    });

    test('returns elements using the built-in disabled prop', () => {
      const { getByRole } = render(
        <>
          <Pressable disabled accessibilityRole="button">
            <Text>Pressable</Text>
          </Pressable>

          <TouchableWithoutFeedback disabled accessibilityRole="button">
            <View>
              <Text>TouchableWithoutFeedback</Text>
            </View>
          </TouchableWithoutFeedback>
          <RNButton disabled onPress={() => {}} title="RNButton" />
        </>
      );

      expect(
        getByRole('button', { name: 'Pressable', disabled: true })
      ).toBeTruthy();

      expect(
        getByRole('button', {
          name: 'TouchableWithoutFeedback',
          disabled: true,
        })
      ).toBeTruthy();

      expect(
        getByRole('button', { name: 'RNButton', disabled: true })
      ).toBeTruthy();
    });
  });

  describe('selected', () => {
    test('returns a selected element when required', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
        />
      );

      expect(getByRole('tab', { selected: true })).toBeTruthy();
      expect(queryByRole('tab', { selected: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      const { getByRole } = render(
        <>
          <TouchableOpacity
            testID="correct"
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="wrong" accessibilityRole="tab">
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      );

      expect(
        getByRole('tab', { name: 'Save', selected: true }).props.testID
      ).toBe('correct');
    });

    test('returns an implicitly non selected element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity accessibilityRole="tab"></TouchableOpacity>
      );

      expect(getByRole('tab', { selected: false })).toBeTruthy();
      expect(queryByRole('tab', { selected: true })).toBe(null);
    });

    test('returns an explicitly non selected element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: false }}
        ></TouchableOpacity>
      );

      expect(getByRole('tab', { selected: false })).toBeTruthy();
      expect(queryByRole('tab', { selected: true })).toBe(null);
    });

    test('does not return selected elements when querying for non selected', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
        ></TouchableOpacity>
      );

      expect(queryByRole('tab', { selected: false })).toBe(null);
    });
  });

  describe('checked', () => {
    test('returns a checked element when required', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: true }}
        />
      );

      expect(getByRole('checkbox', { checked: true })).toBeTruthy();
      expect(queryByRole('checkbox', { checked: false })).toBe(null);
      expect(queryByRole('checkbox', { checked: 'mixed' })).toBe(null);
    });

    it('returns `mixed` checkboxes', () => {
      const { queryByRole, getByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: 'mixed' }}
        />
      );

      expect(getByRole('checkbox', { checked: 'mixed' })).toBeTruthy();
      expect(queryByRole('checkbox', { checked: true })).toBe(null);
      expect(queryByRole('checkbox', { checked: false })).toBe(null);
    });

    it('does not return mixed checkboxes when querying for checked: true', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: 'mixed' }}
        />
      );

      expect(queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      const { getByRole } = render(
        <>
          <TouchableOpacity
            testID="correct"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: true }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="wrong" accessibilityRole="checkbox">
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      );

      expect(
        getByRole('checkbox', { name: 'Save', checked: true }).props.testID
      ).toBe('correct');
    });

    test('does not return return as non checked an element with checked: undefined', () => {
      const { queryByRole } = render(
        <TouchableOpacity accessibilityRole="checkbox"></TouchableOpacity>
      );

      expect(queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('returns an explicitly non checked element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: false }}
        ></TouchableOpacity>
      );

      expect(getByRole('checkbox', { checked: false })).toBeTruthy();
      expect(queryByRole('checkbox', { checked: true })).toBe(null);
    });

    test('does not return checked elements when querying for non checked', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: true }}
        ></TouchableOpacity>
      );

      expect(queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('does not return mixed elements when querying for non checked', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: 'mixed' }}
        ></TouchableOpacity>
      );

      expect(queryByRole('checkbox', { checked: false })).toBe(null);
    });
  });

  describe('busy', () => {
    test('returns a busy element when required', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ busy: true }}
        />
      );

      expect(getByRole('button', { busy: true })).toBeTruthy();
      expect(queryByRole('button', { busy: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      const { getByRole } = render(
        <>
          <TouchableOpacity
            testID="correct"
            accessibilityRole="button"
            accessibilityState={{ busy: true }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="wrong" accessibilityRole="button">
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      );

      expect(
        getByRole('button', { name: 'Save', busy: true }).props.testID
      ).toBe('correct');
    });

    test('returns an implicitly non busy element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity accessibilityRole="button"></TouchableOpacity>
      );

      expect(getByRole('button', { busy: false })).toBeTruthy();
      expect(queryByRole('button', { busy: true })).toBe(null);
    });

    test('returns an explicitly non busy element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ busy: false }}
        ></TouchableOpacity>
      );

      expect(getByRole('button', { busy: false })).toBeTruthy();
      expect(queryByRole('button', { busy: true })).toBe(null);
    });

    test('does not return busy elements when querying for non busy', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: true }}
        ></TouchableOpacity>
      );

      expect(queryByRole('button', { selected: false })).toBe(null);
    });
  });

  describe('expanded', () => {
    test('returns a expanded element when required', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: true }}
        />
      );

      expect(getByRole('button', { expanded: true })).toBeTruthy();
      expect(queryByRole('button', { expanded: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      const { getByRole } = render(
        <>
          <TouchableOpacity
            testID="correct"
            accessibilityRole="button"
            accessibilityState={{ expanded: true }}
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="wrong" accessibilityRole="button">
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      );

      expect(
        getByRole('button', { name: 'Save', expanded: true }).props.testID
      ).toBe('correct');
    });

    test('does not return return as non expanded an element with expanded: undefined', () => {
      const { queryByRole } = render(
        <TouchableOpacity accessibilityRole="button"></TouchableOpacity>
      );

      expect(queryByRole('button', { expanded: false })).toBe(null);
    });

    test('returns an explicitly non expanded element', () => {
      const { getByRole, queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: false }}
        ></TouchableOpacity>
      );

      expect(getByRole('button', { expanded: false })).toBeTruthy();
      expect(queryByRole('button', { expanded: true })).toBe(null);
    });

    test('does not return expanded elements when querying for non expanded', () => {
      const { queryByRole } = render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: true }}
        ></TouchableOpacity>
      );

      expect(queryByRole('button', { expanded: false })).toBe(null);
    });
  });

  test('ignores non queried accessibilityState', () => {
    const { getByRole, queryByRole } = render(
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{
          disabled: true,
          // set `selected`, but don't query it
          selected: true,
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    );

    expect(
      getByRole('button', {
        name: 'Save',
        disabled: true,
      })
    ).toBeTruthy();
    expect(
      queryByRole('button', {
        name: 'Save',
        disabled: false,
      })
    ).toBe(null);
  });

  test('matches an element combining all the options', () => {
    const { getByRole } = render(
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{
          disabled: true,
          selected: true,
          checked: true,
          busy: true,
          expanded: true,
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    );

    expect(
      getByRole('button', {
        name: 'Save',
        disabled: true,
        selected: true,
        checked: true,
        busy: true,
        expanded: true,
      })
    ).toBeTruthy();
  });
});

describe('error messages', () => {
  test('gives a descriptive error message when querying with a role', () => {
    const { getByRole } = render(<View />);

    expect(() => getByRole('button')).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button"

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and a name', () => {
    const { getByRole } = render(<View />);

    expect(() => getByRole('button', { name: 'Save' }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save"

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role, a name and accessibility state', () => {
    const { getByRole } = render(<View />);

    expect(() => getByRole('button', { name: 'Save', disabled: true }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save", disabled state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role, a name and several accessibility state', () => {
    const { getByRole } = render(<View />);

    expect(() =>
      getByRole('button', { name: 'Save', disabled: true, selected: true })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save", disabled state: true, selected state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and an accessibility state', () => {
    const { getByRole } = render(<View />);

    expect(() => getByRole('button', { disabled: true }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", disabled state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and an accessibility value', () => {
    const { getByRole } = render(<View />);

    expect(() => getByRole('adjustable', { value: { min: 1 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", min value: 1

      <View />"
    `);

    expect(() =>
      getByRole('adjustable', {
        value: { min: 1, max: 2, now: 1, text: /hello/ },
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", min value: 1, max value: 2, now value: 1, text value: /hello/

      <View />"
    `);
  });
});

test('byRole queries support hidden option', () => {
  const { getByRole, queryByRole } = render(
    <Pressable accessibilityRole="button" style={{ display: 'none' }}>
      <Text>Hidden from accessibility</Text>
    </Pressable>
  );

  expect(getByRole('button', { includeHiddenElements: true })).toBeTruthy();

  expect(queryByRole('button')).toBeFalsy();
  expect(queryByRole('button', { includeHiddenElements: false })).toBeFalsy();
  expect(() => getByRole('button', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "button"

    <View
      accessibilityRole="button"
      style={
        {
          "display": "none",
        }
      }
    >
      <Text>
        Hidden from accessibility
      </Text>
    </View>"
  `);
});

describe('matches only accessible elements', () => {
  test('matches elements with accessible={true}', () => {
    const { queryByRole } = render(
      <View accessibilityRole="menu" accessible={true}>
        <Text>Action</Text>
      </View>
    );
    expect(queryByRole('menu', { name: 'Action' })).toBeTruthy();
  });

  test('ignores elements with accessible={false}', () => {
    const { queryByRole } = render(
      <Pressable accessibilityRole="button" accessible={false}>
        <Text>Action</Text>
      </Pressable>
    );
    expect(queryByRole('button', { name: 'Action' })).toBeFalsy();
  });

  test('ignores elements with accessible={undefined} and that are implicitely not accessible', () => {
    const { queryByRole } = render(
      <View accessibilityRole="menu">
        <Text>Action</Text>
      </View>
    );
    expect(queryByRole('menu', { name: 'Action' })).toBeFalsy();
  });
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<View accessibilityRole="button" key="3" />);

  expect(() => view.getByRole('link')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  expect(() => view.getAllByRole('link')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  await expect(view.findByRole('link')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  await expect(view.findAllByRole('link')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);
});
