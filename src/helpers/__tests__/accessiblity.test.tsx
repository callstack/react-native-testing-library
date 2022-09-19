import React from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { render, fireEvent, isInaccessible } from '../..';
import { sleep } from '../../__tests__/timerUtils';

test('returns false for accessible elements', () => {
  expect(
    isInaccessible(render(<View testID="subject" />).getByTestId('subject'))
  ).toBe(false);

  expect(
    isInaccessible(
      render(<Text testID="subject">Hello</Text>).getByTestId('subject')
    )
  ).toBe(false);

  expect(
    isInaccessible(
      render(<TextInput testID="subject" />).getByTestId('subject')
    )
  ).toBe(false);
});

test('detects elements with importantForAccessibility="no" prop', () => {
  const view = render(<View testID="subject" importantForAccessibility="no" />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with importantForAccessibility="no-hide-descendants" prop', () => {
  const view = render(
    <View testID="subject" importantForAccessibility="no-hide-descendants" />
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects nested elements with importantForAccessibility="no-hide-descendants" prop', () => {
  const view = render(
    <View importantForAccessibility="no-hide-descendants">
      <View testID="subject" />
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with accessibilityElementsHidden prop', () => {
  const view = render(<View testID="subject" accessibilityElementsHidden />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects nested elements with accessibilityElementsHidden prop', () => {
  const view = render(
    <View accessibilityElementsHidden>
      <View testID="subject" />
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects deeply nested elements with accessibilityElementsHidden prop', () => {
  const view = render(
    <View accessibilityElementsHidden>
      <View>
        <View>
          <View testID="subject" />
        </View>
      </View>
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with display=none', () => {
  const view = render(<View testID="subject" style={{ display: 'none' }} />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects nested elements with display=none', () => {
  const view = render(
    <View style={{ display: 'none' }}>
      <View testID="subject" />
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects deeply nested elements with display=none', () => {
  const view = render(
    <View style={{ display: 'none' }}>
      <View>
        <View>
          <View testID="subject" />
        </View>
      </View>
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with display=none with complex style', () => {
  const view = render(
    <View
      testID="subject"
      style={[{ display: 'flex' }, [{ display: 'flex' }], { display: 'none' }]}
    />
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('is not trigged by opacity = 0', () => {
  const view = render(<View testID="subject" style={{ opacity: 0 }} />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(false);
});

function ModalContainer() {
  const [visible, setVisible] = React.useState(true);

  return (
    <Modal visible={visible}>
      <Pressable onPress={() => setVisible(false)}>
        <Text>Hide me</Text>
      </Pressable>
      <View testID="subject" />
    </Modal>
  );
}

test('detects elements in invisible modal', async () => {
  const view = render(<ModalContainer />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(false);
  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Modal
      hardwareAccelerated={false}
      visible={true}
    >
      <View
        accessible={true}
        collapsable={false}
        focusable={true}
        onBlur={[Function]}
        onClick={[Function]}
        onFocus={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
      >
        <Text>
          Hide me
        </Text>
      </View>
      <View
        testID="subject"
      />
    </Modal>
  `);

  await sleep(1000);
  fireEvent.press(view.getByText('Hide me'));

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Modal
      hardwareAccelerated={false}
      visible={false}
    />
  `);
  expect(isInaccessible(view.queryByTestId('subject'))).toBe(true);

  await sleep(1000);
  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Modal
      hardwareAccelerated={false}
      visible={false}
    />
  `);
});

// test('detects siblings elements to visible modal', () => {
//   const view = render(
//     <View>
//       <Modal visible>
//         <Text>Modal</Text>
//       </Modal>
//       <View testID="subject" />
//     </View>
//   );
//   expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
// });

// test('detects descendants of siblings elements to visible modal', () => {
//   const view = render(
//     <View>
//       <Modal visible>
//         <Text>Modal</Text>
//       </Modal>
//       <View>
//         <View testID="subject" />
//       </View>
//     </View>
//   );
//   expect(view.toJSON()).toMatchInlineSnapshot(`
//     <View>
//       <Modal
//         hardwareAccelerated={false}
//         visible={true}
//       >
//         <Text>
//           Modal
//         </Text>
//       </Modal>
//       <View>
//         <View
//           testID="subject"
//         />
//       </View>
//     </View>
//   `);

//   expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
// });
