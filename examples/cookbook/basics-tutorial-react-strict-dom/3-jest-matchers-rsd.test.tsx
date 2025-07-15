import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { html, css } from 'react-strict-dom';

test('showcase: toBeOnTheScreen', () => {
  render(
    <html.div>
      <html.div data-testid="view" />
    </html.div>,
  );

  expect(screen.getByTestId('view')).toBeOnTheScreen();
  expect(screen.queryByTestId('non-existent')).not.toBeOnTheScreen();
});

test('showcase: toBeIntoHaveTextContentTheDocument', () => {
  render(
    <html.div>
      <html.p data-testid="text">Hello World</html.p>
    </html.div>,
  );

  expect(screen.getByTestId('text')).toHaveTextContent('Hello World');
  expect(screen.getByTestId('text')).toHaveTextContent(/hello/i);
  expect(screen.getByTestId('text')).toHaveTextContent('Hello', { exact: false });
});

test('showcase: toContainElement', () => {
  render(
    <html.div>
      <html.div data-testid="outer">
        <html.div data-testid="inner" />
      </html.div>
      <html.div data-testid="outer-2" />
    </html.div>,
  );

  expect(screen.getByTestId('outer')).toContainElement(screen.getByTestId('inner'));
  expect(screen.getByTestId('outer')).not.toContainElement(screen.getByTestId('outer-2'));
});

test('showcase: toBeEmptyElement', () => {
  render(
    <html.div>
      <html.div data-testid="empty" />
      <html.div data-testid="not-empty">
        <html.p data-testid="text">Hello World</html.p>
      </html.div>
    </html.div>,
  );

  expect(screen.getByTestId('empty')).toBeEmptyElement();
  expect(screen.getByTestId('not-empty')).not.toBeEmptyElement();
});

test('showcase: toHaveDisplayValue', () => {
  render(
    <html.div>
      <html.input data-testid="input" value="Hello" />
    </html.div>,
  );

  expect(screen.getByTestId('input')).toHaveDisplayValue('Hello');
});

test('showcase: toHaveAccessibilityValue', () => {
  render(
    <html.div>
      <html.div
        data-testid="view"
        aria-valuetext="33%"
        aria-valuenow={33}
        aria-valuemax={100}
        aria-valuemin={0}
      />
    </html.div>,
  );

  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ text: '33%' });
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33 });
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33, min: 0, max: 100 });
});

test('showcase: toBeEnabled/toBeDisabled', () => {
  render(
    <html.div>
      <html.div data-testid="enabled" aria-disabled={false} />
      <html.div data-testid="disabled" aria-disabled />
    </html.div>,
  );

  expect(screen.getByTestId('enabled')).toBeEnabled();
  expect(screen.getByTestId('enabled')).not.toBeDisabled();
  expect(screen.getByTestId('disabled')).toBeDisabled();
  expect(screen.getByTestId('disabled')).not.toBeEnabled();
});

test('showcase: toBeSelected', () => {
  render(
    <html.div>
      <html.div data-testid="selected" aria-selected />
      <html.div data-testid="not-selected" />
    </html.div>,
  );

  expect(screen.getByTestId('selected')).toBeSelected();
  expect(screen.getByTestId('not-selected')).not.toBeSelected();
});

test('showcase: toBeBusy', () => {
  render(
    <html.div>
      <html.div data-testid="busy" aria-busy />
      <html.div data-testid="not-busy" />
    </html.div>,
  );

  expect(screen.getByTestId('busy')).toBeBusy();
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
});

test('showcase: toBeExpanded/toBeCollapsed', () => {
  render(
    <html.div>
      <html.div data-testid="expanded" aria-expanded />
      <html.div data-testid="collapsed" aria-expanded={false} />
      <html.div data-testid="default" />
    </html.div>,
  );

  expect(screen.getByTestId('expanded')).toBeExpanded();
  expect(screen.getByTestId('expanded')).not.toBeCollapsed();

  expect(screen.getByTestId('collapsed')).toBeCollapsed();
  expect(screen.getByTestId('collapsed')).not.toBeExpanded();

  expect(screen.getByTestId('default')).not.toBeCollapsed();
  expect(screen.getByTestId('default')).not.toBeExpanded();
});

test('showcase: toBeVisible', () => {
  render(
    <html.div>
      <html.div data-testid="visible" />
      <html.div data-testid="not-visible" style={styles.opacityZero} />
    </html.div>,
  );

  expect(screen.getByTestId('visible')).toBeVisible();
  expect(screen.getByTestId('not-visible')).not.toBeVisible();
});

test('showcase: toHaveStyle', () => {
  render(
    <html.div>
      <html.span data-testid="text" style={styles.fontSize16}>
        Hello World
      </html.span>
    </html.div>,
  );

  expect(screen.getByTestId('text')).toHaveStyle({ fontSize: 16 });
  expect(screen.getByTestId('text')).not.toHaveStyle({ fontSize: 12 });
});

test('showcase: toHaveProp', () => {
  render(
    <html.div>
      <html.p data-testid="text" aria-label="Hello World" />
    </html.div>,
  );

  expect(screen.getByTestId('text')).toHaveProp('accessibilityLabel');
  expect(screen.getByTestId('text')).not.toHaveProp('aria-hidden');

  expect(screen.getByTestId('text')).toHaveProp('accessibilityLabel', 'Hello World');
  expect(screen.getByTestId('text')).not.toHaveProp('accessibilityLabel', 'Goodbye World');
});

const styles = css.create({
  opacityZero: {
    opacity: '0%',
  },
  fontSize16: {
    fontSize: '16px',
  },
});
