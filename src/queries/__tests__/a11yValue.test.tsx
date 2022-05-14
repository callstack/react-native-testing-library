import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibilityValue: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibilityValue: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity>
    <Typography accessibilityValue={{ min: 40, max: 60 }}>
      {children}
    </Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityValue={{ max: 60 }}>Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByA11yValue, queryByA11yValue, findByA11yValue', async () => {
  const { getByA11yValue, queryByA11yValue, findByA11yValue } = render(
    <Section />
  );

  expect(getByA11yValue({ min: 40 }).props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  expect(queryByA11yValue({ min: 40 })?.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });

  expect(() => getByA11yValue({ min: 50 })).toThrow(
    getNoInstancesFoundMessage('{"min":50}')
  );
  expect(queryByA11yValue({ min: 50 })).toEqual(null);

  expect(() => getByA11yValue({ max: 60 })).toThrow(
    getMultipleInstancesFoundMessage('{"max":60}')
  );
  expect(() => queryByA11yValue({ max: 60 })).toThrow(
    getMultipleInstancesFoundMessage('{"max":60}')
  );

  const asyncElement = await findByA11yValue({ min: 40 });
  expect(asyncElement.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  await expect(findByA11yValue({ min: 50 })).rejects.toThrow(
    getNoInstancesFoundMessage('{"min":50}')
  );
  await expect(findByA11yValue({ max: 60 })).rejects.toThrow(
    getMultipleInstancesFoundMessage('{"max":60}')
  );
});

test('getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue', async () => {
  const { getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue } = render(
    <Section />
  );

  expect(getAllByA11yValue({ min: 40 })).toHaveLength(1);
  expect(queryAllByA11yValue({ min: 40 })).toHaveLength(1);

  expect(() => getAllByA11yValue({ min: 50 })).toThrow(
    getNoInstancesFoundMessage('{"min":50}')
  );
  expect(queryAllByA11yValue({ min: 50 })).toEqual([]);

  expect(queryAllByA11yValue({ max: 60 })).toHaveLength(2);
  expect(getAllByA11yValue({ max: 60 })).toHaveLength(2);

  await expect(findAllByA11yValue({ min: 40 })).resolves.toHaveLength(1);
  await expect(findAllByA11yValue({ min: 50 })).rejects.toThrow(
    getNoInstancesFoundMessage('{"min":50}')
  );
  await expect(findAllByA11yValue({ max: 60 })).resolves.toHaveLength(2);
});
