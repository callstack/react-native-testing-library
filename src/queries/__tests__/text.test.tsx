import * as React from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getDefaultNormalizer, render, within } from '../..';

test('byText matches simple text', () => {
  const { getByText } = render(<Text testID="text">Hello World</Text>);
  expect(getByText('Hello World').props.testID).toBe('text');
});

test('byText matches inner nested text', () => {
  const { getByText } = render(
    <Text testID="outer">
      <Text testID="inner">Hello World</Text>
    </Text>
  );
  expect(getByText('Hello World').props.testID).toBe('inner');
});

test('byText matches accross multiple texts', () => {
  const { getByText } = render(
    <Text testID="outer">
      <Text testID="inner-1">Hello</Text> <Text testID="inner-2">World</Text>
    </Text>
  );
  expect(getByText('Hello World').props.testID).toBe('outer');
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
  const { getByText, queryByText } = render(<Banana />);
  const button = getByText(/change/i);

  expect(button.props.children).toBe('Change freshness!');

  const sameButton = getByText('not fresh');

  expect(sameButton.props.children).toBe('not fresh');
  expect(() => getByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent'
  );

  const zeroText = getByText('0');

  expect(queryByText(/change/i)).toBe(button);
  expect(queryByText('InExistent')).toBeNull();
  expect(() => queryByText(/fresh/)).toThrow(
    'Found multiple elements with text: /fresh/'
  );
  expect(queryByText('0')).toBe(zeroText);
});

test('getByText, queryByText with children as Array', () => {
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

  const { getByText } = render(<BananaStore />);

  const threeBananaBunch = getByText('There are 3 bananas in the bunch');
  expect(threeBananaBunch.props.children).toEqual([
    'There are ',
    3,
    ' bananas in the bunch',
  ]);
});

test('getAllByText, queryAllByText', () => {
  const { getAllByText, queryAllByText } = render(<Banana />);
  const buttons = getAllByText(/fresh/i);

  expect(buttons).toHaveLength(3);
  expect(() => getAllByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent'
  );

  expect(queryAllByText(/fresh/i)).toEqual(buttons);
  expect(queryAllByText('InExistent')).toHaveLength(0);
});

test('findByText queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const { rerender, findByText, findAllByText } = render(<View />);
  await expect(findByText('Some Text', {}, options)).rejects.toBeTruthy();
  await expect(findAllByText('Some Text', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View>
          <Text>Some Text</Text>
        </View>
      ),
    20
  );

  await expect(findByText('Some Text')).resolves.toBeTruthy();
  await expect(findAllByText('Some Text')).resolves.toHaveLength(1);
}, 20000);

test('getByText works properly with custom text component', () => {
  function BoldText({ children }: ChildrenProps) {
    return <Text>{children}</Text>;
  }

  expect(
    render(
      <Text>
        <BoldText>Hello</BoldText>
      </Text>
    ).getByText('Hello')
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
      </MyText>
    ).getByText('Hello')
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at start', () => {
  expect(
    render(
      <Text>
        <Image source={{}} />
        Hello
      </Text>
    ).queryByText('Hello')
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at end', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>
    ).queryByText('Hello')
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> in middle', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
        World
      </Text>
    ).queryByText('HelloWorld')
  ).toBeTruthy();
});

test('queryByText not found', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>
    ).queryByText('SomethingElse')
  ).toBeFalsy();
});

test('*ByText matches text across multiple nested Text', () => {
  const { getByText } = render(
    <Text nativeID="1">
      Hello{' '}
      <Text nativeID="2">
        World
        <Text>!{true}</Text>
      </Text>
    </Text>
  );

  expect(getByText('Hello World!')).toBeTruthy();
});

test('queryByText with nested Text components return the closest Text', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      <Text nativeID="2">My text</Text>
    </Text>
  );

  const { queryByText } = render(<NestedTexts />);
  expect(queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryByText with nested Text components each with text return the lowest one', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text</Text>
    </Text>
  );

  const { queryByText } = render(<NestedTexts />);

  expect(queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryByText nested deep <CustomText> in <Text>', () => {
  const CustomText = ({ children }: ChildrenProps) => {
    return <Text>{children}</Text>;
  };

  expect(
    render(
      <Text>
        <CustomText>Hello</CustomText> <CustomText>World!</CustomText>
      </Text>
    ).getByText('Hello World!')
  ).toBeTruthy();
});

test('queryByText with nested Text components: not-exact text match returns the most deeply nested common component', () => {
  const { queryByText: queryByTextFirstCase } = render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My </Text>
      <Text nativeID="3">text</Text>
    </Text>
  );

  const { queryByText: queryByTextSecondCase } = render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text for test</Text>
    </Text>
  );

  expect(queryByTextFirstCase('My text')).toBe(null);
  expect(
    queryByTextSecondCase('My text', { exact: false })?.props.nativeID
  ).toBe('2');
});

test('queryAllByText does not match several times the same text', () => {
  const allMatched = render(
    <Text nativeID="1">
      Start
      <Text nativeID="2">This is a long text</Text>
    </Text>
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
    </Text>
  ).queryAllByText('long text', { exact: false });
  expect(allMatched.length).toBe(2);
  expect(allMatched.map((node) => node.props.nativeID)).toEqual(['2', '3']);
});

describe('supports TextMatch options', () => {
  test('getByText, getAllByText', () => {
    const { getByText, getAllByText } = render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button
          testID="button"
          title="Button and a detail"
          onPress={jest.fn()}
        />
      </View>
    );

    expect(getByText('details', { exact: false })).toBeTruthy();
    expect(getAllByText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByPlaceholderText, getAllByPlaceholderText', () => {
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <View>
        <TextInput placeholder={'Placeholder with details'} />
        <TextInput placeholder={'Placeholder with a DETAIL'} />
      </View>
    );

    expect(getByPlaceholderText('details', { exact: false })).toBeTruthy();
    expect(getAllByPlaceholderText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByDisplayValue, getAllByDisplayValue', () => {
    const { getByDisplayValue, getAllByDisplayValue } = render(
      <View>
        <TextInput value={'Value with details'} />
        <TextInput value={'Value with a detail'} />
      </View>
    );

    expect(getByDisplayValue('details', { exact: false })).toBeTruthy();
    expect(getAllByDisplayValue('detail', { exact: false })).toHaveLength(2);
  });

  test('getByTestId, getAllByTestId', () => {
    const { getByTestId, getAllByTestId } = render(
      <View>
        <View testID="test" />
        <View testID="tests id" />
      </View>
    );
    expect(getByTestId('id', { exact: false })).toBeTruthy();
    expect(getAllByTestId('test', { exact: false })).toHaveLength(2);
  });

  test('with TextMatch option exact === false text search is NOT case sensitive', () => {
    const { getByText, getAllByText } = render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button
          testID="button"
          title="Button and a DeTAil"
          onPress={jest.fn()}
        />
      </View>
    );

    expect(getByText('DeTaIlS', { exact: false })).toBeTruthy();
    expect(getAllByText('detail', { exact: false })).toHaveLength(2);
  });
});

describe('Supports normalization', () => {
  test('trims and collapses whitespace by default', () => {
    const { getByText } = render(
      <View>
        <Text>{`  Text     and

        whitespace`}</Text>
      </View>
    );

    expect(getByText('Text and whitespace')).toBeTruthy();
  });

  test('trim and collapseWhitespace is customizable by getDefaultNormalizer param', () => {
    const testTextWithWhitespace = `  Text     and

        whitespace`;
    const { getByText } = render(
      <View>
        <Text>{testTextWithWhitespace}</Text>
      </View>
    );

    expect(
      getByText(testTextWithWhitespace, {
        normalizer: getDefaultNormalizer({
          trim: false,
          collapseWhitespace: false,
        }),
      })
    ).toBeTruthy();
  });

  test('normalizer function is customisable', () => {
    const testText = 'A TO REMOVE text';
    const normalizerFn = (textToNormalize: string) =>
      textToNormalize.replace('TO REMOVE ', '');
    const { getByText } = render(
      <View>
        <Text>{testText}</Text>
      </View>
    );

    expect(getByText('A text', { normalizer: normalizerFn })).toBeTruthy();
  });
});

test('getByText and queryByText work properly with text nested in React.Fragment', () => {
  const { getByText, queryByText } = render(
    <Text>
      <>Hello</>
    </Text>
  );
  expect(getByText('Hello')).toBeTruthy();
  expect(queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work properly with text partially nested in React.Fragment', () => {
  const { getByText, queryByText } = render(
    <Text>
      He<>llo</>
    </Text>
  );
  expect(getByText('Hello')).toBeTruthy();
  expect(queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work properly with multiple nested fragments', () => {
  const { getByText, queryByText } = render(
    <Text>
      He
      <>
        l<>l</>o
      </>
    </Text>
  );
  expect(getByText('Hello')).toBeTruthy();
  expect(queryByText('Hello')).not.toBeNull();
});

test('getByText and queryByText work with newlines', () => {
  const textWithNewLines = 'Line 1\nLine 2';
  const { getByText, queryByText } = render(<Text>{textWithNewLines}</Text>);
  expect(getByText(textWithNewLines)).toBeTruthy();
  expect(queryByText(textWithNewLines)).toBeTruthy();
});

test('getByText and queryByText work with tabs', () => {
  const textWithTabs = 'Line 1\tLine 2';
  const { getByText, queryByText } = render(<Text>{textWithTabs}</Text>);
  expect(getByText(textWithTabs)).toBeTruthy();
  expect(queryByText(textWithTabs)).toBeTruthy();
});

test('getByText searches for text within itself', () => {
  const { getByText } = render(<Text testID="subject">Hello</Text>);
  const textNode = within(getByText('Hello'));
  expect(textNode.getByText('Hello')).toBeTruthy();
});

test('getByText searches for text within self host element', () => {
  const { getByTestId } = render(<Text testID="subject">Hello</Text>);
  const textNode = within(getByTestId('subject'));
  expect(textNode.getByText('Hello')).toBeTruthy();
});

test('byText support hidden option', () => {
  const { getByText, queryByText } = render(
    <Text style={{ display: 'none' }}>Hidden from accessibility</Text>
  );

  expect(getByText(/hidden/i, { includeHiddenElements: true })).toBeTruthy();

  expect(queryByText(/hidden/i)).toBeFalsy();
  expect(queryByText(/hidden/i, { includeHiddenElements: false })).toBeFalsy();
  expect(() => getByText(/hidden/i, { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: /hidden/i

    <Text
      style={
        {
          "display": "none",
        }
      }
    >
      Hidden from accessibility
    </Text>"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<View accessibilityViewIsModal key="this is filtered" />);

  expect(() => view.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

  expect(() => view.getAllByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

  await expect(view.findByText(/foo/)).rejects
    .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

  await expect(view.findAllByText(/foo/)).rejects
    .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);
});

test('byText should return host component', () => {
  const { getByText } = render(<Text>hello</Text>);
  expect(getByText('hello').type).toBe('Text');
});
