import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../App';

/**
 * A good place to start is having a tests that your component renders correctly.
 */
test('renders correctly', () => {
  // Idiom: no need to capture render output, as we will use `screen` for queries.
  render(<App />);

  // Idiom: `getBy*` queries are predicates by themselves, but we will use it with `expect().toBeOnTheScreen()`
  // to clarify our intent.
  expect(
    screen.getByRole('header', { name: 'Sign in to Example App' })
  ).toBeOnTheScreen();
});

/**
 * Hint: It's best when your tests are similar to what a manual test scenarions would look like,
 * i.e. a series of actions taken by the user, followed by a series of assertions verified from
 * his point of view.
 */
test('User can sign in successully with correct credentials', async () => {
  // Idiom: no need to capture render output, as we will use `screen` for queries.
  render(<App />);

  // Idiom: `getBy*` queries are predicates by themselves, but we will use it with `expect().toBeOnTheScreen()`
  // to clarify our intent.
  expect(
    screen.getByRole('header', { name: 'Sign in to Example App' })
  ).toBeOnTheScreen();

  // Hint: we can use `getByLabelText` to find our text inputs using their labels.
  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'admin1');

  // Hint: we can use `getByRole` to find our button with given text.
  fireEvent.press(screen.getByRole('button', { name: 'Sign In' }));

  // Idiom: since pressing button triggers async operation we need to use `findBy*` query to wait
  // for the action to complete.
  // Hint: subsequent queries do not need to use `findBy*`, because they are used after the async action
  // already finished
  expect(
    await screen.findByRole('header', { name: 'Welcome admin!' })
  ).toBeOnTheScreen();

  // Idiom: use `queryBy*` with `expect().not.toBeOnTheScreen()` to assess that element is not present.
  expect(
    screen.queryByRole('header', { name: 'Sign in to Example App' })
  ).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Username')).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Password')).not.toBeOnTheScreen();
});

/**
 * Another test case based on manual test scenario.
 *
 * Hint: Try to tests what a user would see and do, instead of assering internal component state
 * that is not directly reflected in the UI.
 *
 * For this reason prefer quries that correspond to things directly observable by the user like:
 * `getByRole`, `getByText`, `getByLabelText`, `getByPlaceholderText, `getByDisplayValue`, etc.
 * over `getByTestId` which is not directly observable by the user.
 *
 * Note: that some times you will have to resort to `getByTestId`, but treat it as a last resort.
 */
test('User will see errors for incorrect credentials', async () => {
  render(<App />);

  expect(
    screen.getByRole('header', { name: 'Sign in to Example App' })
  ).toBeOnTheScreen();

  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'qwerty123');
  fireEvent.press(screen.getByRole('button', { name: 'Sign In' }));

  // Hint: you can use custom Jest Native matcher to check text content.
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Incorrect username or password'
  );

  expect(
    screen.getByRole('header', { name: 'Sign in to Example App' })
  ).toBeOnTheScreen();
  expect(screen.getByLabelText('Username')).toBeOnTheScreen();
  expect(screen.getByLabelText('Password')).toBeOnTheScreen();
});

/**
 * Do not be afraid to write longer test scenarios, with repeating act and assert statements.
 */
test('User can sign in after incorrect attempt', async () => {
  render(<App />);

  expect(
    screen.getByRole('header', { name: 'Sign in to Example App' })
  ).toBeOnTheScreen();

  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'qwerty123');
  fireEvent.press(screen.getByRole('button', { name: 'Sign In' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Incorrect username or password'
  );

  fireEvent.changeText(screen.getByLabelText('Password'), 'admin1');
  fireEvent.press(screen.getByRole('button', { name: 'Sign In' }));

  expect(await screen.findByText('Welcome admin!')).toBeOnTheScreen();
  expect(
    screen.queryByRole('header', { name: 'Sign in to Example App' })
  ).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Username')).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Password')).not.toBeOnTheScreen();
});
