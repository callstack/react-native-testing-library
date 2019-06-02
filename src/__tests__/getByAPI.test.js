// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '..';

const BUTTON_ID = 'button_id';
const TEXT_ID = 'text_id';
const BUTTON_STYLE = { textTransform: 'uppercase' };
const TEXT_LABEL = 'cool text';
const NO_MATCHES_TEXT = 'not-existent-element';

const NO_INSTANCES_FOUND = 'No instances found';
const FOUND_TWO_INSTANCES = 'Expected 1 but found 2 instances';

const Typography = ({ children, ...rest }) => {
  return <Text {...rest}>{children}</Text>;
};

class Button extends React.Component<*> {
  render() {
    return (
      <TouchableOpacity testID={BUTTON_ID} style={BUTTON_STYLE}>
        <Typography testID={TEXT_ID}>{this.props.children}</Typography>
      </TouchableOpacity>
    );
  }
}

function Section() {
  return (
    <>
      <Typography testID={TEXT_ID}>Title</Typography>
      <Button>{TEXT_LABEL}</Button>
    </>
  );
}

test('getBy, queryBy', () => {
  const { getBy, queryBy } = render(<Section />);

  expect(getBy({ testID: BUTTON_ID }).props.testID).toEqual(BUTTON_ID);
  const button = getBy({ testID: /button/g });
  expect(button && button.props.testID).toEqual(BUTTON_ID);
  expect(
    getBy({ testID: BUTTON_ID, type: TouchableOpacity }).props.testID
  ).toEqual(BUTTON_ID);
  expect(() => getBy({ testID: BUTTON_ID, type: Text })).toThrow(
    NO_INSTANCES_FOUND
  );
  expect(
    getBy({
      testID: BUTTON_ID,
      props: { style: { textTransform: 'uppercase' } },
    }).props.testID
  ).toEqual(BUTTON_ID);
  expect(() => getBy({ testID: NO_MATCHES_TEXT })).toThrow(NO_INSTANCES_FOUND);
  expect(queryBy({ testID: NO_MATCHES_TEXT })).toBeNull();

  expect(() => getBy({ testID: TEXT_ID })).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryBy({ testID: TEXT_ID })).toThrow(FOUND_TWO_INSTANCES);
});

test('getAllBy, queryAllBy', () => {
  const { getAllBy, queryAllBy } = render(<Section />);

  const texts = getAllBy({ testID: TEXT_ID, type: Text });
  expect(texts).toHaveLength(2);
  const buttons = getAllBy({ testID: BUTTON_ID, type: TouchableOpacity });
  expect(buttons).toHaveLength(1);
  expect(queryAllBy({ testID: /id/g })).toEqual(
    expect.arrayContaining([...texts, ...buttons])
  );
  expect(() => getAllBy({ testID: NO_MATCHES_TEXT })).toThrow(
    NO_INSTANCES_FOUND
  );
  expect(queryAllBy({ testID: NO_MATCHES_TEXT })).toEqual([]);
});
