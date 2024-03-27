import * as React from 'react';
import {
  Button as RNButton,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { render, screen } from '../..';

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
  render(<Section />);

  expect(screen.getByRole('button').props.accessibilityRole).toEqual('button');
  const button = screen.queryByRole(/button/);
  expect(button?.props.accessibilityRole).toEqual('button');

  expect(() => screen.getByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );

  expect(screen.queryByRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => screen.getByRole('link')).toThrow(getMultipleInstancesFoundMessage('link'));
  expect(() => screen.queryByRole('link')).toThrow(getMultipleInstancesFoundMessage('link'));

  const asyncButton = await screen.findByRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(screen.findByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  await expect(screen.findByRole('link')).rejects.toThrow(getMultipleInstancesFoundMessage('link'));
});

test('getAllByRole, queryAllByRole, findAllByRole', async () => {
  render(<Section />);

  expect(screen.getAllByRole('link')).toHaveLength(2);
  expect(screen.queryAllByRole(/ink/)).toHaveLength(2);

  expect(() => screen.getAllByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryAllByRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(screen.findAllByRole('link')).resolves.toHaveLength(2);
  await expect(screen.findAllByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
});

test('supports role prop', () => {
  render(
    <>
      <View accessible role="checkbox" />
      <View accessible role="radio" />
      <View accessible role="switch" />
      <View accessible role="tab" />
      <Text role="alert" />
      <Text role="heading" />
      <Text role="searchbox" />
      <Pressable role="button" />
    </>,
  );

  expect(screen.getByRole('checkbox')).toBeTruthy();
  expect(screen.getByRole('radio')).toBeTruthy();
  expect(screen.getByRole('switch')).toBeTruthy();
  expect(screen.getByRole('tab')).toBeTruthy();
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByRole('heading')).toBeTruthy();
  expect(screen.getByRole('searchbox')).toBeTruthy();
  expect(screen.getByRole('button')).toBeTruthy();
});

test('supports default View component "none" role', () => {
  render(<View testID="view" accessible />);
  expect(screen.getByRole('none').props.testID).toBe('view');
});

test('supports default Text component  "text" role', () => {
  render(<Text testID="text" />);
  expect(screen.getByRole('text').props.testID).toBe('text');
});

test('supports default TextInput component "none" role', () => {
  render(<TextInput testID="text-input" />);
  expect(screen.getByRole('none').props.testID).toBe('text-input');
});

describe('supports name option', () => {
  test('returns an element that has the corresponding role and a children with the name', () => {
    render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
      </TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element that has the corresponding role when several children include the name', () => {
    render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
        <Text>Save</Text>
      </TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element that has the corresponding role and a children with a matching accessibilityLabel', () => {
    render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text accessibilityLabel="Save" />
      </TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element that has the corresponding role and a matching accessibilityLabel', () => {
    render(
      <TouchableOpacity
        accessibilityRole="button"
        testID="target-button"
        accessibilityLabel="Save"
      ></TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element that has the corresponding role and a children with a matching aria-label', () => {
    render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text aria-label="Save" />
      </TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element that has the corresponding role and a matching aria-label', () => {
    render(
      <TouchableOpacity
        accessibilityRole="button"
        testID="target-button"
        aria-label="Save"
      ></TouchableOpacity>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('target-button');
  });

  test('returns an element when the direct child is text', () => {
    render(
      <Text accessibilityRole="header" testID="target-header">
        About
      </Text>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('header', { name: 'About' })).toBe(screen.getByTestId('target-header'));
    expect(screen.getByRole('header', { name: 'About' }).props.testID).toBe('target-header');
  });

  test('returns an element with nested Text as children', () => {
    render(
      <Text accessibilityRole="header" testID="parent">
        <Text testID="child">About</Text>
      </Text>,
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('header', { name: 'About' })).toBe(screen.getByTestId('parent'));
    expect(screen.getByRole('header', { name: 'About' }).props.testID).toBe('parent');
  });

  test('returns a header with an accessibilityLabel', () => {
    render(<Text accessibilityRole="header" testID="target-header" accessibilityLabel="About" />);

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(screen.getByRole('header', { name: 'About' })).toBe(screen.getByTestId('target-header'));
    expect(screen.getByRole('header', { name: 'About' }).props.testID).toBe('target-header');
  });
});

describe('supports accessibility states', () => {
  describe('disabled', () => {
    test('returns a disabled element when required', () => {
      render(
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: true }} />,
      );

      expect(screen.getByRole('button', { disabled: true })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      render(
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
        </>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Save',
          disabled: true,
        }).props.testID,
      ).toBe('correct');
    });

    test('returns an implicitly enabled element', () => {
      render(<TouchableOpacity accessibilityRole="button"></TouchableOpacity>);

      expect(screen.getByRole('button', { disabled: false })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: true })).toBe(null);
    });

    test('returns an explicitly enabled element', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: false }}
        ></TouchableOpacity>,
      );

      expect(screen.getByRole('button', { disabled: false })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: true })).toBe(null);
    });

    test('does not return disabled elements when querying for non disabled', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('button', { disabled: false })).toBe(null);
    });

    test('returns elements using the built-in disabled prop', () => {
      render(
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
        </>,
      );

      expect(screen.getByRole('button', { name: 'Pressable', disabled: true })).toBeTruthy();

      expect(
        screen.getByRole('button', {
          name: 'TouchableWithoutFeedback',
          disabled: true,
        }),
      ).toBeTruthy();

      expect(screen.getByRole('button', { name: 'RNButton', disabled: true })).toBeTruthy();
    });

    test('supports aria-disabled={true} prop', () => {
      render(<View accessible accessibilityRole="button" aria-disabled={true} />);
      expect(screen.getByRole('button', { disabled: true })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: false })).toBeNull();
    });

    test('supports aria-disabled={false} prop', () => {
      render(<View accessible accessibilityRole="button" aria-disabled={false} />);
      expect(screen.getByRole('button', { disabled: false })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: true })).toBeNull();
    });

    test('supports default aria-disabled prop', () => {
      render(<View accessible accessibilityRole="button" />);
      expect(screen.getByRole('button', { disabled: false })).toBeTruthy();
      expect(screen.queryByRole('button', { disabled: true })).toBeNull();
    });
  });

  describe('selected', () => {
    test('returns a selected element when required', () => {
      render(<TouchableOpacity accessibilityRole="tab" accessibilityState={{ selected: true }} />);

      expect(screen.getByRole('tab', { selected: true })).toBeTruthy();
      expect(screen.queryByRole('tab', { selected: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      render(
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
        </>,
      );

      expect(screen.getByRole('tab', { name: 'Save', selected: true }).props.testID).toBe(
        'correct',
      );
    });

    test('returns an implicitly non selected element', () => {
      render(<TouchableOpacity accessibilityRole="tab"></TouchableOpacity>);

      expect(screen.getByRole('tab', { selected: false })).toBeTruthy();
      expect(screen.queryByRole('tab', { selected: true })).toBe(null);
    });

    test('returns an explicitly non selected element', () => {
      render(
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: false }}
        ></TouchableOpacity>,
      );

      expect(screen.getByRole('tab', { selected: false })).toBeTruthy();
      expect(screen.queryByRole('tab', { selected: true })).toBe(null);
    });

    test('does not return selected elements when querying for non selected', () => {
      render(
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('tab', { selected: false })).toBe(null);
    });

    test('supports aria-selected={true} prop', () => {
      render(<View accessible accessibilityRole="button" aria-selected={true} />);
      expect(screen.getByRole('button', { selected: true })).toBeTruthy();
      expect(screen.queryByRole('button', { selected: false })).toBeNull();
    });

    test('supports aria-selected={false} prop', () => {
      render(<View accessible accessibilityRole="button" aria-selected={false} />);
      expect(screen.getByRole('button', { selected: false })).toBeTruthy();
      expect(screen.queryByRole('button', { selected: true })).toBeNull();
    });

    test('supports default aria-selected prop', () => {
      render(<View accessible accessibilityRole="button" />);
      expect(screen.getByRole('button', { selected: false })).toBeTruthy();
      expect(screen.queryByRole('button', { selected: true })).toBeNull();
    });
  });

  describe('checked', () => {
    test('returns a checked element when required', () => {
      render(
        <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: true }} />,
      );

      expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy();
      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
      expect(screen.queryByRole('checkbox', { checked: 'mixed' })).toBe(null);
    });

    it('returns `mixed` checkboxes', () => {
      render(
        <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: 'mixed' }} />,
      );

      expect(screen.getByRole('checkbox', { checked: 'mixed' })).toBeTruthy();
      expect(screen.queryByRole('checkbox', { checked: true })).toBe(null);
      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
    });

    it('does not return mixed checkboxes when querying for checked: true', () => {
      render(
        <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: 'mixed' }} />,
      );

      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      render(
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
        </>,
      );

      expect(
        screen.getByRole('checkbox', {
          name: 'Save',
          checked: true,
        }).props.testID,
      ).toBe('correct');
    });

    test('does not return return as non checked an element with checked: undefined', () => {
      render(<TouchableOpacity accessibilityRole="checkbox"></TouchableOpacity>);

      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('returns an explicitly non checked element', () => {
      render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: false }}
        ></TouchableOpacity>,
      );

      expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy();
      expect(screen.queryByRole('checkbox', { checked: true })).toBe(null);
    });

    test('does not return checked elements when querying for non checked', () => {
      render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: true }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('does not return mixed elements when querying for non checked', () => {
      render(
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: 'mixed' }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('checkbox', { checked: false })).toBe(null);
    });

    test('supports aria-checked={true} prop', () => {
      render(<View accessible accessibilityRole="button" aria-checked={true} />);
      expect(screen.getByRole('button', { checked: true })).toBeTruthy();
      expect(screen.queryByRole('button', { checked: false })).toBeNull();
      expect(screen.queryByRole('button', { checked: 'mixed' })).toBeNull();
    });

    test('supports aria-checked={false} prop', () => {
      render(<View accessible accessibilityRole="button" aria-checked={false} />);
      expect(screen.getByRole('button', { checked: false })).toBeTruthy();
      expect(screen.queryByRole('button', { checked: true })).toBeNull();
      expect(screen.queryByRole('button', { checked: 'mixed' })).toBeNull();
    });

    test('supports aria-checked="mixed prop', () => {
      render(<View accessible accessibilityRole="button" aria-checked="mixed" />);
      expect(screen.getByRole('button', { checked: 'mixed' })).toBeTruthy();
      expect(screen.queryByRole('button', { checked: true })).toBeNull();
      expect(screen.queryByRole('button', { checked: false })).toBeNull();
    });

    test('supports default aria-selected prop', () => {
      render(<View accessible accessibilityRole="button" />);
      expect(screen.getByRole('button')).toBeTruthy();
      expect(screen.queryByRole('button', { checked: true })).toBeNull();
      expect(screen.queryByRole('button', { checked: false })).toBeNull();
      expect(screen.queryByRole('button', { checked: 'mixed' })).toBeNull();
    });
  });

  describe('busy', () => {
    test('returns a busy element when required', () => {
      render(<TouchableOpacity accessibilityRole="button" accessibilityState={{ busy: true }} />);

      expect(screen.getByRole('button', { busy: true })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      render(
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
        </>,
      );

      expect(screen.getByRole('button', { name: 'Save', busy: true }).props.testID).toBe('correct');
    });

    test('returns an implicitly non busy element', () => {
      render(<TouchableOpacity accessibilityRole="button"></TouchableOpacity>);

      expect(screen.getByRole('button', { busy: false })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: true })).toBe(null);
    });

    test('returns an explicitly non busy element', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ busy: false }}
        ></TouchableOpacity>,
      );

      expect(screen.getByRole('button', { busy: false })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: true })).toBe(null);
    });

    test('does not return busy elements when querying for non busy', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: true }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('button', { selected: false })).toBe(null);
    });

    test('supports aria-busy={true} prop', () => {
      render(<View accessible accessibilityRole="button" aria-busy={true} />);
      expect(screen.getByRole('button', { busy: true })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: false })).toBeNull();
    });

    test('supports aria-busy={false} prop', () => {
      render(<View accessible accessibilityRole="button" aria-busy={false} />);
      expect(screen.getByRole('button', { busy: false })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: true })).toBeNull();
    });

    test('supports default aria-busy prop', () => {
      render(<View accessible accessibilityRole="button" />);
      expect(screen.getByRole('button', { busy: false })).toBeTruthy();
      expect(screen.queryByRole('button', { busy: true })).toBeNull();
    });
  });

  describe('expanded', () => {
    test('returns a expanded element when required', () => {
      render(
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: true }} />,
      );

      expect(screen.getByRole('button', { expanded: true })).toBeTruthy();
      expect(screen.queryByRole('button', { expanded: false })).toBe(null);
    });

    test('returns the correct element when only one matches all the requirements', () => {
      render(
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
        </>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Save',
          expanded: true,
        }).props.testID,
      ).toBe('correct');
    });

    test('does not return return as non expanded an element with expanded: undefined', () => {
      render(<TouchableOpacity accessibilityRole="button"></TouchableOpacity>);

      expect(screen.queryByRole('button', { expanded: false })).toBe(null);
    });

    test('returns an explicitly non expanded element', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: false }}
        ></TouchableOpacity>,
      );

      expect(screen.getByRole('button', { expanded: false })).toBeTruthy();
      expect(screen.queryByRole('button', { expanded: true })).toBe(null);
    });

    test('does not return expanded elements when querying for non expanded', () => {
      render(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: true }}
        ></TouchableOpacity>,
      );

      expect(screen.queryByRole('button', { expanded: false })).toBe(null);
    });

    test('supports aria-expanded={true} prop', () => {
      render(<View accessible accessibilityRole="button" aria-expanded={true} />);
      expect(screen.getByRole('button', { expanded: true })).toBeTruthy();
      expect(screen.queryByRole('button', { expanded: false })).toBeNull();
    });

    test('supports aria-expanded={false} prop', () => {
      render(<View accessible accessibilityRole="button" aria-expanded={false} />);
      expect(screen.getByRole('button', { expanded: false })).toBeTruthy();
      expect(screen.queryByRole('button', { expanded: true })).toBeNull();
    });

    test('supports default aria-expanded prop', () => {
      render(<View accessible accessibilityRole="button" />);
      expect(screen.getByRole('button')).toBeTruthy();
      expect(screen.queryByRole('button', { expanded: true })).toBeNull();
      expect(screen.queryByRole('button', { expanded: false })).toBeNull();
    });
  });

  test('ignores non queried accessibilityState', () => {
    render(
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{
          disabled: true,
          // set `selected`, but don't query it
          selected: true,
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Save',
        disabled: true,
      }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', {
        name: 'Save',
        disabled: false,
      }),
    ).toBe(null);
  });

  test('matches an element combining all the options', () => {
    render(
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
      </TouchableOpacity>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Save',
        disabled: true,
        selected: true,
        checked: true,
        busy: true,
        expanded: true,
      }),
    ).toBeTruthy();
  });
});

describe('error messages', () => {
  test('gives a descriptive error message when querying with a role', () => {
    render(<View />);

    expect(() => screen.getByRole('button')).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button"

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and a name', () => {
    render(<View />);

    expect(() => screen.getByRole('button', { name: 'Save' })).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save"

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role, a name and accessibility state', () => {
    render(<View />);

    expect(() => screen.getByRole('button', { name: 'Save', disabled: true }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save", disabled state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role, a name and several accessibility state', () => {
    render(<View />);

    expect(() => screen.getByRole('button', { name: 'Save', disabled: true, selected: true }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", name: "Save", disabled state: true, selected state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and an accessibility state', () => {
    render(<View />);

    expect(() => screen.getByRole('button', { disabled: true }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "button", disabled state: true

      <View />"
    `);
  });

  test('gives a descriptive error message when querying with a role and an accessibility value', () => {
    render(<View />);

    expect(() => screen.getByRole('adjustable', { value: { min: 1 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", min value: 1

      <View />"
    `);

    expect(() =>
      screen.getByRole('adjustable', {
        value: { min: 1, max: 2, now: 1, text: /hello/ },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", min value: 1, max value: 2, now value: 1, text value: /hello/

      <View />"
    `);
  });
});

test('byRole queries support hidden option', () => {
  render(
    <Pressable accessibilityRole="button" style={{ display: 'none' }}>
      <Text>Hidden from accessibility</Text>
    </Pressable>,
  );

  expect(screen.getByRole('button', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByRole('button')).toBeFalsy();
  expect(screen.queryByRole('button', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByRole('button', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "button"

    <View
      accessibilityRole="button"
      accessible={true}
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
    render(
      <View accessibilityRole="menu" accessible={true}>
        <Text>Action</Text>
      </View>,
    );
    expect(screen.queryByRole('menu', { name: 'Action' })).toBeTruthy();
  });

  test('ignores elements with accessible={false}', () => {
    render(
      <Pressable accessibilityRole="button" accessible={false}>
        <Text>Action</Text>
      </Pressable>,
    );
    expect(screen.queryByRole('button', { name: 'Action' })).toBeFalsy();
  });

  test('ignores elements with accessible={undefined} and that are implicitely not accessible', () => {
    render(
      <View accessibilityRole="menu">
        <Text>Action</Text>
      </View>,
    );
    expect(screen.queryByRole('menu', { name: 'Action' })).toBeFalsy();
  });
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<View accessibilityRole="button" key="3" />);

  expect(() => screen.getByRole('link')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  expect(() => screen.getAllByRole('link')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  await expect(screen.findByRole('link')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);

  await expect(screen.findAllByRole('link')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with role: "link"

    <View
      accessibilityRole="button"
    />"
  `);
});
