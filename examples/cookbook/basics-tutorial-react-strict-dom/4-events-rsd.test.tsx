/**
 * ========================================
 * React Native Testing Library Tutorial
 * Chapter 4: Testing Events
 * ========================================
 *
 * This chapter covers how to simulate and test user interactions in React Native
 * applications using React Native Testing Library's userEvent API.
 *
 * Key concepts covered:
 * - Setting up userEvent for realistic user interactions
 * - Testing button press events
 * - Testing text input events
 * - Testing form submissions
 * - Testing state changes triggered by events
 * - Best practices for event testing
 *
 * Note: This example uses React Strict DOM (react-strict-dom) which provides
 * HTML-like components that work across React Native and web platforms.
 */

import * as React from 'react';
import { html } from 'react-strict-dom';
import { render, screen, userEvent } from '@testing-library/react-native';

/**
 * ========================================
 * Example 1: Basic Button Press Events
 * ========================================
 *
 * This example demonstrates how to test button press events that trigger
 * state changes in a component.
 */

function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <html.div>
      <html.p>{count}</html.p>
      <html.button role="button" onClick={() => setCount(count + 1)}>
        Increment
      </html.button>
    </html.div>
  );
}

/**
 * Testing button press events:
 *
 * 1. Setup userEvent - creates a user session for realistic interactions
 * 2. Find the button element using queries
 * 3. Simulate the press event using user.press()
 * 4. Assert the expected state change occurred
 *
 * Key points:
 * - userEvent.setup() creates a user session for the test
 * - user.press() simulates a realistic button press (including focus, press, release)
 * - Always use await when calling userEvent methods (they return promises)
 * - Test both the initial state and the state after the event
 */
test('Counter should increment the count when the button is pressed', async () => {
  // Setup userEvent - this creates a user session for the test
  const user = userEvent.setup();

  // Render the component
  render(<Counter />);

  // Verify initial state
  expect(screen.getByText('0')).toBeOnTheScreen();

  // Find the button element using role and accessible name
  const button = screen.getByRole('button', { name: 'Increment' });
  expect(button).toBeOnTheScreen();

  // Simulate a button press event
  await user.press(button);

  // Verify the state change occurred
  expect(screen.getByText('1')).toBeOnTheScreen();
});

/**
 * ========================================
 * Example 2: Text Input and Form Events
 * ========================================
 *
 * This example demonstrates testing more complex user interactions including:
 * - Text input events
 * - Form submission events
 * - Conditional rendering based on events
 * - Error handling scenarios
 */

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [state, setState] = React.useState('idle');

  const handleLogin = () => {
    if (email === 'test@test.com' && password === 'password') {
      setState('success');
    } else {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <html.div>
        <html.h1>Login successful</html.h1>
      </html.div>
    );
  }
  return (
    <html.div>
      <html.input
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <html.input
        placeholder="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />
      {state === 'error' && <html.p role="alert">Invalid credentials</html.p>}

      <html.button role="button" onClick={handleLogin}>
        Login
      </html.button>
    </html.div>
  );
}

/**
 * Testing text input events and successful form submission:
 *
 * This test demonstrates:
 * - Using user.type() to simulate realistic text input
 * - Finding input elements by placeholder text
 * - Testing form submission with valid data
 * - Verifying conditional rendering after successful submission
 *
 * Key points:
 * - user.type() simulates realistic typing (including focus, keystrokes, blur)
 * - Always await user.type() calls
 * - Use placeholder text, labels, or roles to find input elements
 * - Test the complete user flow from input to submission to result
 */
test('should login with valid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  // Simulate typing in the email field
  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');

  // Simulate typing in the password field
  await user.type(screen.getByPlaceholderText('Password'), 'password');

  // Simulate clicking the login button
  await user.press(screen.getByRole('button', { name: 'Login' }));

  // Verify successful login redirects to success page
  expect(screen.getByRole('heading', { name: 'Login successful' })).toBeOnTheScreen();
});

/**
 * Testing error scenarios:
 *
 * This test demonstrates:
 * - Testing error handling with invalid inputs
 * - Verifying error messages are displayed correctly
 * - Using role="alert" for error messages (accessibility best practice)
 *
 * Key points:
 * - Always test both success and error scenarios
 * - Use role="alert" for error messages to ensure accessibility
 * - Test that error messages have appropriate accessible names
 * - Verify error states don't accidentally trigger success states
 */
test('should show error message with invalid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  // Enter valid email but invalid password
  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
  await user.type(screen.getByPlaceholderText('Password'), 'wrong-password');

  // Attempt to login
  await user.press(screen.getByRole('button', { name: 'Login' }));

  // Verify error message is displayed
  expect(screen.getByRole('alert', { name: 'Invalid credentials' })).toBeOnTheScreen();
});

/**
 * ========================================
 * Best Practices for Event Testing
 * ========================================
 *
 * 1. Always use userEvent.setup() to create a user session
 * 2. Always await userEvent method calls (they return promises)
 * 3. Use realistic user interactions (user.press, user.type) over fireEvent
 * 4. Test both success and error scenarios
 * 5. Find elements using accessible queries (role, label, placeholder)
 * 6. Test the complete user flow, not just individual events
 * 7. Verify state changes and side effects after events
 * 8. Use role="alert" for error messages and test them appropriately
 *
 * ========================================
 * Common userEvent Methods
 * ========================================
 *
 * - user.press(element) - Simulates pressing a button or touchable element
 * - user.type(element, text) - Simulates typing text into an input
 * - user.clear(element) - Clears text from an input
 * - user.selectText(element, options) - Selects text in an input
 * - user.scroll(element, options) - Simulates scrolling gestures
 *
 * For more advanced event testing, see the userEvent documentation.
 */
