import * as React from 'react';
import { html } from 'react-strict-dom';
import { render, screen, userEvent } from '@testing-library/react-native';

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
