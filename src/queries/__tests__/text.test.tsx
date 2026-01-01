import * as React from 'react';
import { Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { getDefaultNormalizer, render, screen, within } from '../..';

test('byText matches simple text', () => {
  render(<Text testID="text">Hello World</Text>);
  expect(screen.getByText('Hello World').props.testID).toBe('text');
});

test('byText matches inner nested text', () => {
  render(
    <Text testID="outer">
      <Text testID="inner">Hello World</Text>
    </Text>,
  );
  expect(screen.getByText('Hello World').props.testID).toBe('inner');
});

test('byText matches across multiple texts', () => {
  render(
    <Text testID="outer">
      <Text testID="inner-1">Hello</Text> <Text testID="inner-2">World</Text>
    </Text>,
  );
  expect(screen.getByText('Hello World').props.testID).toBe('outer');
});

type MyButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
};
const MyButton = ({ children, onPress }: MyButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{children}</Text>
  </TouchableOpacity>
);

const Banana = () => {
  const test = 0;
  return (
    <View>
      <Text>Is the banana fresh?</Text>
      <Text testID="bananaFresh">not fresh</Text>

      <MyButton onPress={jest.fn()}>Change freshness!</MyButton>
      <Text testID="duplicateText">First Text</Text>
      <Text testID="duplicateText">Second Text</Text>
      <Text>{test}</Text>
    </View>
  );
};

type ChildrenProps = { children: React.ReactNode };

test('getByText, queryByText', () => {
  render(<Banana />);
  const button = screen.getByText(/change/i);

  expect(button).toHaveTextContent('Change freshness!');

  const sameButton = screen.getByText('not fresh');

  expect(sameButton).toHaveTextContent('not fresh');
  expect(() => screen.getByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent',
  );

  const zeroText = screen.getByText('0');

  expect(screen.queryByText(/change/i)).toBe(button);
  expect(screen.queryByText('InExistent')).toBeNull();
  expect(() => screen.queryByText(/fresh/)).toThrow('Found multiple elements with text: /fresh/');
  expect(screen.queryByText('0')).toBe(zeroText);
});

test('getByText, screen.queryByText with children as Array', () => {
  type BananaCounterProps = { numBananas: number };
  const BananaCounter = ({ numBananas }: BananaCounterProps) => (
    <Text>There are {numBananas} bananas in the bunch</Text>
  );

  const BananaStore = () => (
    <View>
      <BananaCounter numBananas={3} />
      <BananaCounter numBananas={6} />
      <BananaCounter numBananas={5} />
    </View>
  );

  render(<BananaStore />);

  const threeBananaBunch = screen.getByText('There are 3 bananas in the bunch');
  expect(threeBananaBunch).toHaveTextContent('There are 3 bananas in the bunch');
});

test('getAllByText, queryAllByText', () => {
  render(<Banana />);
  const buttons = screen.getAllByText(/fresh/i);

  expect(buttons).toHaveLength(3);
  expect(() => screen.getAllByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent',
  );

  expect(screen.queryAllByText(/fresh/i)).toEqual(buttons);
  expect(screen.queryAllByText('InExistent')).toHaveLength(0);
});

test('findByText queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  render(<View />);
  await expect(screen.findByText('Some Text', {}, options)).rejects.toBeTruthy();
  await expect(screen.findAllByText('Some Text', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      screen.rerender(
        <View>
          <Text>Some Text</Text>
        </View>,
      ),
    20,
  );

  await expect(screen.findByText('Some Text')).resolves.toBeTruthy();
  await expect(screen.findAllByText('Some Text')).resolves.toHaveLength(1);
}, 20000);

test('getByText works properly with custom text component', () => {
  function BoldText({ children }: ChildrenProps) {
    return <Text>{children}</Text>;
  }

  expect(
    render(
      <Text>
        <BoldText>Hello</BoldText>
      </Text>,
    ).getByText('Hello'),
  ).toBeTruthy();
});

test('getByText works properly with custom text container', () => {
  function MyText({ children }: ChildrenProps) {
    return <Text>{children}</Text>;
  }

  function BoldText({ children }: ChildrenProps) {
    return <Text>{children}</Text>;
  }

  expect(
    render(
      <MyText>
        <BoldText>Hello</BoldText>
      </MyText>,
    ).getByText('Hello'),
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at start', () => {
  expect(
    render(
      <Text>
        <Image source={{}} />
        Hello
      </Text>,
    ).queryByText('Hello'),
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at end', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>,
    ).queryByText('Hello'),
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> in middle', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
        World
      </Text>,
    ).queryByText('HelloWorld'),
  ).toBeTruthy();
});

test('queryByText not found', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>,
    ).queryByText('SomethingElse'),
  ).toBeFalsy();
});

test('*ByText matches text across multiple nested Text', () => {
  render(
    <Text nativeID="1">
      Hello{' '}
      <Text nativeID="2">
        World
        <Text>!{true}</Text>
      </Text>
    </Text>,
  );

  expect(screen.getByText('Hello World!')).toBeTruthy();
});

test('queryByText with nested Text components return the closest Text', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      <Text nativeID="2">My text</Text>
    </Text>
  );

  render(<NestedTexts />);
  expect(screen.queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryByText with nested Text components each with text return the lowest one', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text</Text>
    </Text>
  );

  render(<NestedTexts />);

  expect(screen.queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryByText nested deep <CustomText> in <Text>', () => {
  const CustomText = ({ children }: ChildrenProps) => {
    return <Text>{children}</Text>;
  };

  expect(
    render(
      <Text>
        <CustomText>Hello</CustomText> <CustomText>World!</CustomText>
      </Text>,
    ).getByText('Hello World!'),
  ).toBeTruthy();
});

test('queryByText with nested Text components: not-exact text match returns the most deeply nested common component', () => {
  render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My </Text>
      <Text nativeID="3">text</Text>
    </Text>,
  );

  render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text for test</Text>
    </Text>,
  );

  expect(screen.queryByText('My text')).toBe(null);
  expect(screen.queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryAllByText does not match several times the same text', () => {
  const allMatched = render(
    <Text nativeID="1">
      Start
      <Text nativeID="2">This is a long text</Text>
    </Text>,
  ).queryAllByText('long text', { exact: false });
  expect(allMatched.length).toBe(1);
  expect(allMatched[0].props.nativeID).toBe('2');
});

test('queryAllByText matches all the matching nodes', () => {
  const allMatched = render(
    <Text nativeID="1">
      Start
      <Text nativeID="2">This is a long text</Text>
      <Text nativeID="3">This is another long text</Text>
    </Text>,
  ).queryAllByText('long text', { exact: false });
  expect(allMatched.length).toBe(2);
  expect(allMatched.map((node) => node.props.nativeID)).toEqual(['2', '3']);
});

describe('supports TextMatch options', () => {
  test('getByText, getAllByText', () => {
    render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button testID="button" title="Button and a detail" onPress={jest.fn()} />
      </View>,
    );

    expect(screen.getByText('details', { exact: false })).toBeTruthy();
    expect(screen.getAllByText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByPlaceholderText, getAllByPlaceholderText', () => {
    render(
      <View>
        <TextInput placeholder={'Placeholder with details'} />
        <TextInput placeholder={'Placeholder with a DETAIL'} />
      </View>,
    );

    expect(screen.getByPlaceholderText('details', { exact: false })).toBeTruthy();
    expect(screen.getAllByPlaceholderText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByDisplayValue, getAllByDisplayValue', () => {
    render(
      <View>
        <TextInput value={'Value with details'} />
        <TextInput value={'Value with a detail'} />
      </View>,
    );

    expect(screen.getByDisplayValue('details', { exact: false })).toBeTruthy();
    expect(screen.getAllByDisplayValue('detail', { exact: false })).toHaveLength(2);
  });

  test('getByTestId, getAllByTestId', () => {
    render(
      <View>
        <View testID="test" />
        <View testID="tests id" />
      </View>,
    );
    expect(screen.getByTestId('id', { exact: false })).toBeTruthy();
    expect(screen.getAllByTestId('test', { exact: false })).toHaveLength(2);
  });

  test('with TextMatch option exact === false text search is NOT case sensitive', () => {
    render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button testID="button" title="Button and a DeTAil" onPress={jest.fn()} />
      </View>,
    );

    expect(screen.getByText('DeTaIlS', { exact: false })).toBeTruthy();
    expect(screen.getAllByText('detail', { exact: false })).toHaveLength(2);
  });
});

describe('Supports normalization', () => {
  test('trims and collapses whitespace by default', () => {
    render(
      <View>
        <Text>{`  Text     and

        whitespace`}</Text>
      </View>,
    );

    expect(screen.getByText('Text and whitespace')).toBeTruthy();
  });

  test('trim and collapseWhitespace is customizable by getDefaultNormalizer param', () => {
    const testTextWithWhitespace = `  Text     and

        whitespace`;
    render(
      <View>
        <Text>{testTextWithWhitespace}</Text>
      </View>,
    );

    expect(
      screen.getByText(testTextWithWhitespace, {
        normalizer: getDefaultNormalizer({
          trim: false,
          collapseWhitespace: false,
        }),
      }),
    ).toBeTruthy();
  });

  test('normalizer function is customisable', () => {
    const testText = 'A TO REMOVE text';
    const normalizerFn = (textToNormalize: string) => textToNormalize.replace('TO REMOVE ', '');
    render(
      <View>
        <Text>{testText}</Text>
      </View>,
    );

    expect(screen.getByText('A text', { normalizer: normalizerFn })).toBeTruthy();
  });
});

test('getByText and queryByText work properly with text nested in React.Fragment', () => {
  render(
    <Text>
      <>Hello</>
    </Text>,
  );
  expect(screen.getByText('Hello')).toBeTruthy();
  expect(screen.queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work properly with text partially nested in React.Fragment', () => {
  render(
    <Text>
      He<>llo</>
    </Text>,
  );
  expect(screen.getByText('Hello')).toBeTruthy();
  expect(screen.queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work properly with multiple nested fragments', () => {
  render(
    <Text>
      He
      <>
        l<>l</>o
      </>
    </Text>,
  );
  expect(screen.getByText('Hello')).toBeTruthy();
  expect(screen.queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work with newlines', () => {
  const textWithNewLines = 'Line 1\nLine 2';
  render(<Text>{textWithNewLines}</Text>);
  expect(screen.getByText(textWithNewLines)).toBeTruthy();
  expect(screen.queryByText(textWithNewLines)).toBeTruthy();
});

test('getByText and queryByText work with tabs', () => {
  const textWithTabs = 'Line 1\tLine 2';
  render(<Text>{textWithTabs}</Text>);
  expect(screen.getByText(textWithTabs)).toBeTruthy();
  expect(screen.queryByText(textWithTabs)).toBeTruthy();
});

test('getByText searches for text within itself', () => {
  render(<Text testID="subject">Hello</Text>);
  const textNode = within(screen.getByText('Hello'));
  expect(textNode.getByText('Hello')).toBeTruthy();
});

test('getByText searches for text within self host element', () => {
  render(<Text testID="subject">Hello</Text>);
  const textNode = within(screen.getByTestId('subject'));
  expect(textNode.getByText('Hello')).toBeTruthy();
});

test('byText support hidden option', () => {
  render(<Text style={{ display: 'none' }}>Hidden from accessibility</Text>);

  expect(screen.getByText(/hidden/i, { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByText(/hidden/i)).toBeFalsy();
  expect(screen.queryByText(/hidden/i, { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByText(/hidden/i, { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /hidden/i

    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
      >
        Hidden from accessibility
      </Text>
    </>"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<View accessibilityViewIsModal key="this is filtered" />);

  expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /foo/

    <>
      <View
        accessibilityViewIsModal={true}
      />
    </>"
  `);

  expect(() => screen.getAllByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /foo/

    <>
      <View
        accessibilityViewIsModal={true}
      />
    </>"
  `);

  await expect(screen.findByText(/foo/)).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /foo/

    <>
      <View
        accessibilityViewIsModal={true}
      />
    </>"
  `);

  await expect(screen.findAllByText(/foo/)).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /foo/

    <>
      <View
        accessibilityViewIsModal={true}
      />
    </>"
  `);
});

test('byText should return host component', () => {
  render(<Text>hello</Text>);
  expect(screen.getByText('hello').type).toBe('Text');
});
