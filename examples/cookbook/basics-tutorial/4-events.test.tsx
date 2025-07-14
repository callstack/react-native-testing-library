/*
 * React Native Testing Library Tutorial - Chapter 4: Events
 *
 * This chapter covers how to test user interactions and events in React Native apps.
 * Events are actions that users perform, such as pressing buttons, typing text,
 * scrolling, and more. Testing these interactions ensures your app responds
 * correctly to user input.
 *
 * Key concepts covered:
 * - Setting up userEvent for realistic event simulation
 * - Testing press events (onPress handlers)
 * - Testing text input events (onChangeText handlers)
 * - Testing event sequences and state changes
 * - Testing error states triggered by events
 */

import * as React from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

/*
 * Example 1: Basic Counter Component with Press Events
 *
 * This component demonstrates the most common event in React Native apps:
 * press events. The Counter increments its state when the button is pressed.
 */
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Text>{count}</Text>
      {/*
       * Using role="button" makes this element easily queryable and
       * accessible. The onPress handler updates the state.
       */}
      <Pressable role="button" onPress={() => setCount(count + 1)}>
        <Text>Increment</Text>
      </Pressable>
    </View>
  );
}

/*
 * Test 1: Testing Press Events
 *
 * This test demonstrates how to:
 * 1. Set up userEvent for realistic event simulation
 * 2. Query for interactive elements using roles
 * 3. Simulate press events
 * 4. Assert state changes after events
 */
test('Counter should increment the count when the button is pressed', async () => {
  // Step 1: Set up userEvent - this creates a user simulation instance
  // userEvent provides more realistic event simulation than fireEvent
  const user = userEvent.setup();

  // Step 2: Render the component
  render(<Counter />);

  // Step 3: Assert initial state
  expect(screen.getByText('0')).toBeOnTheScreen();

  // Step 4: Query for the interactive element
  // Using role and name makes tests more accessible and maintainable
  const button = screen.getByRole('button', { name: 'Increment' });
  expect(button).toBeOnTheScreen();

  // Step 5: Simulate the press event
  // Note: userEvent methods are async, so we need to await them
  await user.press(button);

  // Step 6: Assert the state change
  expect(screen.getByText('1')).toBeOnTheScreen();
});

/*
 * Example 2: LoginForm Component with Multiple Event Types
 *
 * This component demonstrates more complex event interactions:
 * - Text input events (typing)
 * - Multiple press events
 * - State-dependent UI changes
 * - Error handling
 */
function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [state, setState] = React.useState('idle');

  const handleLogin = () => {
    // Simple validation logic for demonstration
    if (email === 'test@test.com' && password === 'password') {
      setState('success');
    } else {
      setState('error');
    }
  };

  // Success state - shows different UI
  if (state === 'success') {
    return (
      <View>
        {/* Using role="heading" makes this easily queryable */}
        <Text role="heading">Login successful</Text>
      </View>
    );
  }

  // Default/error state - shows form
  return (
    <View>
      {/* TextInput components for user input */}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} />

      {/* Error message - only shown when state is 'error' */}
      {state === 'error' && (
        <Text accessible role="alert">
          Invalid credentials
        </Text>
      )}

      <Pressable role="button" onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

/*
 * Test 2: Testing Text Input Events (Happy Path)
 *
 * This test demonstrates how to:
 * 1. Test text input events using user.type()
 * 2. Test sequences of events (type → type → press)
 * 3. Test state changes that affect UI rendering
 * 4. Query elements by placeholder text
 */
test('should login with valid credentials', async () => {
  // Set up userEvent for realistic interaction simulation
  const user = userEvent.setup();
  render(<LoginForm />);

  // Step 1: Type in the email field
  // user.type() simulates realistic typing with proper events
  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');

  // Step 2: Type in the password field
  await user.type(screen.getByPlaceholderText('Password'), 'password');

  // Step 3: Press the login button
  await user.press(screen.getByRole('button', { name: 'Login' }));

  // Step 4: Assert the success state
  // The UI should now show the success message
  expect(screen.getByRole('heading', { name: 'Login successful' })).toBeOnTheScreen();
});

/*
 * Test 3: Testing Error States Triggered by Events
 *
 * This test demonstrates how to:
 * 1. Test error conditions triggered by user events
 * 2. Test that error messages appear correctly
 * 3. Use accessibility roles for better queries (role="alert")
 * 4. Test the same event sequence with different inputs
 */
test('should show error message with invalid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  // Same event sequence as the success test, but with invalid credentials
  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
  await user.type(screen.getByPlaceholderText('Password'), 'wrong-password');
  await user.press(screen.getByRole('button', { name: 'Login' }));

  // Assert that the error message appears
  // Using role="alert" makes this accessible and easy to query
  expect(screen.getByRole('alert', { name: 'Invalid credentials' })).toBeOnTheScreen();
});

/*
 * Key Takeaways for Event Testing:
 *
 * 1. Always use userEvent.setup() for realistic event simulation
 * 2. userEvent methods are async - always await them
 * 3. Use accessibility roles (button, alert, heading) for better queries
 * 4. Test both happy paths and error conditions
 * 5. Test event sequences, not just individual events
 * 6. Assert state changes after events
 * 7. Use descriptive test names that explain the user interaction
 *
 * Common userEvent methods:
 * - user.press(element) - simulates press events
 * - user.type(element, text) - simulates typing
 * - user.clear(element) - clears input fields
 * - user.longPress(element) - simulates long press
 * - user.scrollTo(element, options) - simulates scrolling
 */
