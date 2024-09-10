import React from 'react';
import { Image, View } from 'react-native';
import { render, screen } from '../..';

const Banana = () => (
  <View>
    <Image alt="Image of a fresh banana" />
    <Image alt="Image of a brown banana" />
  </View>
);

test('it can locate an image by alt text', () => {
  render(
    <View>
      <Image alt="alt text" />
      <Image alt="other text" />
    </View>,
  );

  expect(screen.getByAltText('alt text')).toBeTruthy();
  expect(screen.getByAltText('other text')).toBeTruthy();

  expect(screen.getAllByAltText('alt text')).toHaveLength(1);
  expect(screen.getAllByAltText('other text')).toHaveLength(1);
});

test('supports a regex matcher', () => {
  render(
    <View>
      <Image alt="alt text" />
      <Image alt="other text" />
    </View>,
  );

  expect(screen.getByAltText(/alt/)).toBeTruthy();
  expect(screen.getAllByAltText(/alt/)).toHaveLength(1);
  expect(screen.getAllByAltText(/text/)).toHaveLength(2);
});

test('getByAltText, queryByAltText', () => {
  render(<Banana />);
  const component = screen.getByAltText(/fresh banana/);

  expect(() => screen.getByAltText('InExistent')).toThrow(
    'Unable to find an element with alt text: InExistent',
  );

  expect(screen.getByAltText(/fresh banana/)).toBe(component);
  expect(screen.queryByAltText('InExistent')).toBeNull();

  expect(() => screen.getByAltText(/banana/)).toThrow(
    'Found multiple elements with alt text: /banana/',
  );
  expect(() => screen.queryByAltText(/banana/)).toThrow(
    'Found multiple elements with alt text: /banana/',
  );
});

test('getAllByAltText, queryAllByAltText', () => {
  render(<Banana />);
  const imageElements = screen.getAllByAltText(/banana/);

  expect(imageElements.length).toBe(2);
  expect(imageElements[0].props.alt).toBe('Image of a fresh banana');
  expect(imageElements[1].props.alt).toBe('Image of a brown banana');

  const queriedImageElements = screen.queryAllByAltText(/banana/);

  expect(queriedImageElements.length).toBe(2);
  expect(queriedImageElements[0]).toBe(imageElements[0]);
  expect(queriedImageElements[1]).toBe(imageElements[1]);
});

test('findByAltText and findAllByAltText work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  render(<View />);
  await expect(screen.findByAltText('alt text', {}, options)).rejects.toBeTruthy();
  await expect(screen.findAllByAltText('alt text', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      screen.rerender(
        <View>
          <Image alt="alt text" />
        </View>,
      ),
    20,
  );

  await expect(screen.findByAltText('alt text')).resolves.toBeTruthy();
  await expect(screen.findAllByAltText('alt text')).resolves.toHaveLength(1);
}, 20000);

test('byAltText queries support hidden option', () => {
  render(<Image style={{ display: 'none' }} alt="hidden" />);

  expect(screen.getByAltText('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByAltText('hidden')).toBeFalsy();
  expect(screen.queryByAltText('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByAltText('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with alt text: hidden

    <Image
      alt="hidden"
      style={
        {
          "display": "none",
        }
      }
    />"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<Image alt="alt text" key="3" />);

  expect(() => screen.getByAltText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with alt text: FOO

    <Image
      alt="alt text"
    />"
  `);

  expect(() => screen.getAllByAltText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with alt text: FOO

    <Image
      alt="alt text"
    />"
  `);

  await expect(screen.findByAltText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with alt text: FOO

    <Image
      alt="alt text"
    />"
  `);

  await expect(screen.findAllByAltText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with alt text: FOO

    <Image
      alt="alt text"
    />"
  `);
});
