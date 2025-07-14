import * as React from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Text>{count}</Text>
      <Pressable role="button" onPress={() => setCount(count + 1)}>
        <Text>Increment</Text>
      </Pressable>
    </View>
  );
}

test('Counter should increment the count when the button is pressed', async () => {
  const user = userEvent.setup();

  render(<Counter />);
  expect(screen.getByText('0')).toBeOnTheScreen();

  const button = screen.getByRole('button', { name: 'Increment' });
  expect(button).toBeOnTheScreen();

  await user.press(button);
  expect(screen.getByText('1')).toBeOnTheScreen();
});

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
      <View>
        <Text role="heading">Login successful</Text>
      </View>
    );
  }
  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
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

test('should login with valid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
  await user.type(screen.getByPlaceholderText('Password'), 'password');
  await user.press(screen.getByRole('button', { name: 'Login' }));

  expect(screen.getByRole('heading', { name: 'Login successful' })).toBeOnTheScreen();
});

test('should show error message with invalid credentials', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByPlaceholderText('Email'), 'test@test.com');
  await user.type(screen.getByPlaceholderText('Password'), 'wrong-password');
  await user.press(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByRole('alert', { name: 'Invalid credentials' })).toBeOnTheScreen();
});
