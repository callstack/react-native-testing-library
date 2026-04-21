import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '..';
import { _console, logger } from '../helpers/logger';
import { testGateReact19_2 } from '../test-utils/react-version-gates';

function MaybeSuspend({
  children,
  promise,
  suspend,
}: {
  children: React.ReactNode;
  promise: Promise<unknown>;
  suspend: boolean;
}) {
  if (suspend) {
    React.use(promise);
  }

  return children;
}

function TestSuspenseWrapper({
  children,
  promise,
  suspend,
}: {
  children: React.ReactNode;
  promise: Promise<unknown>;
  suspend: boolean;
}) {
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <MaybeSuspend promise={promise} suspend={suspend}>
        {children}
      </MaybeSuspend>
    </React.Suspense>
  );
}

test('renders a simple component', async () => {
  const TestComponent = () => (
    <View testID="container">
      <Text>Hello World</Text>
    </View>
  );

  await render(<TestComponent />);

  expect(screen.getByTestId('container')).toBeOnTheScreen();
  expect(screen.getByText('Hello World')).toBeOnTheScreen();
});

beforeEach(() => {
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('does not warn when no options are passed', async () => {
  const TestComponent = () => <Text testID="test">Test</Text>;

  await render(<TestComponent />);

  expect(_console.warn).not.toHaveBeenCalled();
});

test('supports null options', async () => {
  const TestComponent = () => <Text testID="test">Test</Text>;

  await render(<TestComponent />, null as any);

  expect(screen.getByTestId('test')).toBeOnTheScreen();
  expect(_console.warn).not.toHaveBeenCalled();
});

test('does not warn when only valid options are passed', async () => {
  const TestComponent = () => <Text testID="test">Test</Text>;
  const Wrapper = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;

  await render(<TestComponent />, { wrapper: Wrapper });

  expect(_console.warn).not.toHaveBeenCalled();
});

test('warns when unknown option is passed', async () => {
  const TestComponent = () => <Text testID="test">Test</Text>;

  await render(<TestComponent />, { unknownOption: 'value' } as any);

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toContain(
    'Unknown option(s) passed to render: unknownOption',
  );
});

describe('render options', () => {
  test('renders component with wrapper option', async () => {
    const TestComponent = () => <Text testID="inner">Inner Content</Text>;
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <View testID="wrapper">{children}</View>
    );

    await render(<TestComponent />, { wrapper: Wrapper });

    expect(screen.getByTestId('wrapper')).toBeOnTheScreen();
    expect(screen.getByTestId('inner')).toBeOnTheScreen();
    expect(screen.getByText('Inner Content')).toBeOnTheScreen();
  });
});

describe('hidden instance props', () => {
  testGateReact19_2('renders Activity hidden and then visible', async () => {
    await render(
      <React.Activity mode="hidden">
        <View testID="activity-target">
          <Text>Ready</Text>
        </View>
      </React.Activity>,
    );

    expect(screen.queryByTestId('activity-target')).not.toBeOnTheScreen();
    expect(
      screen.getByTestId('activity-target', { includeHiddenElements: true }).props.style,
    ).toEqual({
      display: 'none',
    });
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "display": "none",
          }
        }
        testID="activity-target"
      >
        <Text>
          Ready
        </Text>
      </View>
    `);

    await screen.rerender(
      <React.Activity mode="visible">
        <View testID="activity-target">
          <Text>Ready</Text>
        </View>
      </React.Activity>,
    );

    expect(screen.getByTestId('activity-target')).toBeOnTheScreen();
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <View
        testID="activity-target"
      >
        <Text>
          Ready
        </Text>
      </View>
    `);
  });

  test('does not retain hidden UI when the component suspends on initial render', async () => {
    const promise = new Promise<unknown>(() => {});

    await render(
      <TestSuspenseWrapper promise={promise} suspend>
        <View testID="hidden-target">
          <Text>Ready</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Loading...')).toBeOnTheScreen();
    expect(screen.queryByTestId('hidden-target')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('hidden-target', { includeHiddenElements: true })).toBeNull();
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <Text>
        Loading...
      </Text>
    `);
  });

  test('sets hidden suspended elements with no style to display none', async () => {
    const promise = new Promise<unknown>(() => {});

    await render(
      <TestSuspenseWrapper promise={promise} suspend={false}>
        <View testID="hidden-target">
          <Text>Ready</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Ready')).toBeOnTheScreen();

    await screen.rerender(
      <TestSuspenseWrapper promise={promise} suspend>
        <View testID="hidden-target">
          <Text>Ready</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Loading...')).toBeOnTheScreen();
    expect(
      screen.getByTestId('hidden-target', { includeHiddenElements: true }).props.style,
    ).toEqual({
      display: 'none',
    });
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <>
        <View
          style={
            {
              "display": "none",
            }
          }
          testID="hidden-target"
        >
          <Text>
            Ready
          </Text>
        </View>
        <Text>
          Loading...
        </Text>
      </>
    `);
  });

  test('appends display none when suspending an element with existing style', async () => {
    const promise = new Promise<unknown>(() => {});

    await render(
      <TestSuspenseWrapper promise={promise} suspend={false}>
        <View style={{ opacity: 0.5 }} testID="hidden-target">
          <Text>Ready</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Ready')).toBeOnTheScreen();

    await screen.rerender(
      <TestSuspenseWrapper promise={promise} suspend>
        <View style={{ opacity: 0.5 }} testID="hidden-target">
          <Text>Ready</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Loading...')).toBeOnTheScreen();
    expect(
      screen.getByTestId('hidden-target', { includeHiddenElements: true }).props.style,
    ).toEqual([{ opacity: 0.5 }, { display: 'none' }]);
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <>
        <View
          style={
            [
              {
                "opacity": 0.5,
              },
              {
                "display": "none",
              },
            ]
          }
          testID="hidden-target"
        >
          <Text>
            Ready
          </Text>
        </View>
        <Text>
          Loading...
        </Text>
      </>
    `);
  });

  test('applies hidden styles to multiple direct child views when suspending', async () => {
    const promise = new Promise<unknown>(() => {});

    await render(
      <TestSuspenseWrapper promise={promise} suspend={false}>
        <View testID="hidden-target-1">
          <Text>First</Text>
        </View>
        <View style={{ opacity: 0.5 }} testID="hidden-target-2">
          <Text>Second</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('First')).toBeOnTheScreen();
    expect(screen.getByText('Second')).toBeOnTheScreen();

    await screen.rerender(
      <TestSuspenseWrapper promise={promise} suspend>
        <View testID="hidden-target-1">
          <Text>First</Text>
        </View>
        <View style={{ opacity: 0.5 }} testID="hidden-target-2">
          <Text>Second</Text>
        </View>
      </TestSuspenseWrapper>,
    );

    expect(screen.getByText('Loading...')).toBeOnTheScreen();
    expect(
      screen.getByTestId('hidden-target-1', { includeHiddenElements: true }).props.style,
    ).toEqual({
      display: 'none',
    });
    expect(
      screen.getByTestId('hidden-target-2', { includeHiddenElements: true }).props.style,
    ).toEqual([{ opacity: 0.5 }, { display: 'none' }]);
    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <>
        <View
          style={
            {
              "display": "none",
            }
          }
          testID="hidden-target-1"
        >
          <Text>
            First
          </Text>
        </View>
        <View
          style={
            [
              {
                "opacity": 0.5,
              },
              {
                "display": "none",
              },
            ]
          }
          testID="hidden-target-2"
        >
          <Text>
            Second
          </Text>
        </View>
        <Text>
          Loading...
        </Text>
      </>
    `);
  });
});

describe('component rendering', () => {
  test('render accepts RCTText component', async () => {
    await render(React.createElement('RCTText', { testID: 'text' }, 'Hello'));
    expect(screen.getByTestId('text')).toBeOnTheScreen();
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  test('render throws when text string is rendered without Text component', async () => {
    await expect(render(<View>Hello</View>)).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <View> component."`,
    );
  });
});

describe('rerender', () => {
  test('rerender updates component with new props', async () => {
    interface TestComponentProps {
      message: string;
    }
    const TestComponent = ({ message }: TestComponentProps) => (
      <Text testID="message">{message}</Text>
    );

    await render(<TestComponent message="Initial" />);

    expect(screen.getByText('Initial')).toBeOnTheScreen();

    await screen.rerender(<TestComponent message="Updated" />);

    expect(screen.getByText('Updated')).toBeOnTheScreen();
    expect(screen.queryByText('Initial')).not.toBeOnTheScreen();
  });

  test('rerender works with wrapper option', async () => {
    interface TestComponentProps {
      value: number;
    }
    const TestComponent = ({ value }: TestComponentProps) => <Text testID="value">{value}</Text>;
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <View testID="wrapper">{children}</View>
    );

    await render(<TestComponent value={1} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByText('1')).toBeOnTheScreen();

    await screen.rerender(<TestComponent value={2} />);

    expect(screen.getByText('2')).toBeOnTheScreen();
    expect(screen.getByTestId('wrapper')).toBeOnTheScreen();
  });
});

test('unmount removes component from tree', async () => {
  const TestComponent = () => <Text testID="content">Content</Text>;

  await render(<TestComponent />);

  expect(screen.getByTestId('content')).toBeOnTheScreen();

  await screen.unmount();

  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();
});

test('rerender calls componentDidUpdate and unmount calls componentWillUnmount', async () => {
  interface ClassComponentProps {
    onUpdate?: () => void;
    onUnmount?: () => void;
  }
  class ClassComponent extends React.Component<ClassComponentProps> {
    componentDidUpdate() {
      if (this.props.onUpdate) {
        this.props.onUpdate();
      }
    }

    componentWillUnmount() {
      if (this.props.onUnmount) {
        this.props.onUnmount();
      }
    }

    render() {
      return <Text>Class Component</Text>;
    }
  }

  const onUpdate = jest.fn();
  const onUnmount = jest.fn();
  await render(<ClassComponent onUpdate={onUpdate} onUnmount={onUnmount} />);
  expect(onUpdate).toHaveBeenCalledTimes(0);
  expect(onUnmount).toHaveBeenCalledTimes(0);

  await screen.rerender(<ClassComponent onUpdate={onUpdate} onUnmount={onUnmount} />);
  expect(onUpdate).toHaveBeenCalledTimes(1);
  expect(onUnmount).toHaveBeenCalledTimes(0);

  await screen.unmount();
  expect(onUpdate).toHaveBeenCalledTimes(1);
  expect(onUnmount).toHaveBeenCalledTimes(1);
});

describe('toJSON', () => {
  test('toJSON returns null for empty children', async () => {
    const TestComponent = () => null;

    await render(<TestComponent />);

    expect(screen.toJSON()).toMatchInlineSnapshot(`null`);
  });

  test('toJSON returns single child when only one child exists', async () => {
    const TestComponent = () => (
      <View>
        <Text testID="single">Single Child</Text>
      </View>
    );

    await render(<TestComponent />);

    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <View>
        <Text
          testID="single"
        >
          Single Child
        </Text>
      </View>
    `);
  });

  test('toJSON returns full tree for React fragment with multiple children', async () => {
    const TestComponent = () => (
      <>
        <Text testID="first">First</Text>
        <Text testID="second">Second</Text>
      </>
    );

    await render(<TestComponent />);

    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <>
        <Text
          testID="first"
        >
          First
        </Text>
        <Text
          testID="second"
        >
          Second
        </Text>
      </>
    `);
  });
});

describe('debug', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debug outputs formatted component tree', async () => {
    const TestComponent = () => (
      <View testID="container">
        <Text>Debug Test</Text>
      </View>
    );

    await render(<TestComponent />);

    expect(() => {
      screen.debug();
    }).not.toThrow();
  });

  test('debug accepts options with message', async () => {
    const TestComponent = () => <Text>Test</Text>;

    await render(<TestComponent />);

    expect(() => {
      screen.debug({ message: 'Custom message' });
    }).not.toThrow();
  });
});

describe('result getters', () => {
  test('container getter returns renderer container', async () => {
    const TestComponent = () => <Text testID="content">Content</Text>;

    const result = await render(<TestComponent />);

    expect(result.container).toMatchInlineSnapshot(`
      <>
        <Text
          testID="content"
        >
          Content
        </Text>
      </>
    `);
  });

  test('root getter works correctly', async () => {
    const TestComponent = () => <View testID="test" />;

    const result = await render(<TestComponent />);

    expect(result.root).toMatchInlineSnapshot(`
      <View
        testID="test"
      />
    `);
  });
});

describe('screen integration', () => {
  test('render sets screen queries', async () => {
    const TestComponent = () => (
      <View>
        <Text testID="text1">First Text</Text>
        <Text testID="text2">Second Text</Text>
      </View>
    );

    await render(<TestComponent />);

    expect(screen.getByTestId('text1')).toBeOnTheScreen();
    expect(screen.getByTestId('text2')).toBeOnTheScreen();
    expect(screen.getByText('First Text')).toBeOnTheScreen();
    expect(screen.getByText('Second Text')).toBeOnTheScreen();
  });

  test('screen queries work after rerender', async () => {
    interface TestComponentProps {
      label: string;
    }
    const TestComponent = ({ label }: TestComponentProps) => <Text testID="label">{label}</Text>;

    await render(<TestComponent label="Initial" />);

    expect(screen.getByText('Initial')).toBeOnTheScreen();

    await screen.rerender(<TestComponent label="Updated" />);

    expect(screen.getByText('Updated')).toBeOnTheScreen();
  });
});
