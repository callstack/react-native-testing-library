// @flow
import React from 'react';
import {
  Image,
  Text,
  TextInput,
  Modal,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { render } from '..';

class RNComponents extends React.Component<*> {
  render() {
    return (
      <View>
        <Modal visible>
          <ScrollView>
            <Image />
            <TextInput value="value" />
            <TouchableOpacity onPress={() => {}}>
              <Text>t1</Text>
              <Text>t2</Text>
              <Text>t3</Text>
            </TouchableOpacity>
            <ActivityIndicator show />
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

test('getByName smoke test to see how unstable it gets', () => {
  const { getByName } = render(<RNComponents />);
  expect(() => getByName('Image')).toThrow(); // – doesn't have displayName set properly
  getByName('TextInput');
  expect(() => getByName('Modal')).toThrow(); // – doesn't have displayName set properly
  getByName('View');
  getByName('ScrollView');
  expect(() => getByName('ActivityIndicator')).toThrow(); // – doesn't have displayName set properly
  getByName('TouchableOpacity');
});

test('getAllByName smoke test to see how unstable it gets', () => {
  const { getAllByName } = render(<RNComponents />);

  const [t1, t2, t3] = getAllByName('Text');
  expect(t1.props.children).toBe('t1');
  expect(t2.props.children).toBe('t2');
  expect(t3.props.children).toBe('t3');
});
