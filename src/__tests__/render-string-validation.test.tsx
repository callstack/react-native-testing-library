import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fireEvent, render, screen } from '..';

// eslint-disable-next-line no-console
const originalConsoleError = console.error;

const VALIDATION_ERROR =
  'Invariant Violation: Text strings must be rendered within a <Text> component';
const PROFILER_ERROR = 'The above error occurred in the <Profiler> component';

beforeEach(() => {
  // eslint-disable-next-line no-console
  console.error = (errorMessage: string) => {
    if (!errorMessage.includes(PROFILER_ERROR)) {
      originalConsoleError(errorMessage);
    }
  };
});

afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

test('should throw when rendering a string outside a text component', () => {
  expect(() =>
    render(<View>hello</View>, {
      unstable_validateStringsRenderedWithinText: true,
    }),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

test('should throw an error when rerendering with text outside of Text component', () => {
  render(<View />, {
    unstable_validateStringsRenderedWithinText: true,
  });

  expect(() => screen.rerender(<View>hello</View>)).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

const InvalidTextAfterPress = () => {
  const [showText, setShowText] = React.useState(false);

  if (!showText) {
    return (
      <Pressable onPress={() => setShowText(true)}>
        <Text>Show text</Text>
      </Pressable>
    );
  }

  return <View>text rendered outside text component</View>;
};

test('should throw an error when strings are rendered outside Text', () => {
  render(<InvalidTextAfterPress />, {
    unstable_validateStringsRenderedWithinText: true,
  });

  expect(() => fireEvent.press(screen.getByText('Show text'))).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "text rendered outside text component" string within a <View> component.`,
  );
});

test('should not throw for texts nested in fragments', () => {
  expect(() =>
    render(
      <Text>
        <>hello</>
      </Text>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).not.toThrow();
});

test('should not throw if option validateRenderedString is false', () => {
  expect(() => render(<View>hello</View>)).not.toThrow();
});

test(`should throw when one of the children is a text and the parent is not a Text component`, () => {
  expect(() =>
    render(
      <View>
        <Text>hello</Text>
        hello
      </View>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

test(`should throw when a string is rendered within a fragment rendered outside a Text`, () => {
  expect(() =>
    render(
      <View>
        <>hello</>
      </View>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

test('should throw if a number is rendered outside a text', () => {
  expect(() =>
    render(<View>0</View>, { unstable_validateStringsRenderedWithinText: true }),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "0" string within a <View> component.`,
  );
});

const Trans = ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>;

test('should throw with components returning string value not rendered in Text', () => {
  expect(() =>
    render(
      <View>
        <Trans i18nKey="hello" />
      </View>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

test('should not throw with components returning string value rendered in Text', () => {
  expect(() =>
    render(
      <Text>
        <Trans i18nKey="hello" />
      </Text>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).not.toThrow();
});

test('should throw when rendering string in a View in a Text', () => {
  expect(() =>
    render(
      <Text>
        <View>hello</View>
      </Text>,
      { unstable_validateStringsRenderedWithinText: true },
    ),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "hello" string within a <View> component.`,
  );
});

const UseEffectComponent = () => {
  const [showText, setShowText] = React.useState(false);

  React.useEffect(() => {
    setShowText(true);
  }, []);

  if (!showText) {
    return <Text>Text is hidden</Text>;
  }

  return (
    <View>
      <Text>Text is visible</Text>
    </View>
  );
};

test('should render immediate setState in useEffect properly', async () => {
  render(<UseEffectComponent />, { unstable_validateStringsRenderedWithinText: true });

  expect(await screen.findByText('Text is visible')).toBeTruthy();
});

const InvalidUseEffectComponent = () => {
  const [showText, setShowText] = React.useState(false);

  React.useEffect(() => {
    setShowText(true);
  }, []);

  if (!showText) {
    return <Text>Text is hidden</Text>;
  }

  return <View>Text is visible</View>;
};

test('should throw properly for immediate setState in useEffect', () => {
  expect(() =>
    render(<InvalidUseEffectComponent />, { unstable_validateStringsRenderedWithinText: true }),
  ).toThrow(
    `${VALIDATION_ERROR}. Detected attempt to render "Text is visible" string within a <View> component.`,
  );
});
