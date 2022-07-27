import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type Props = {
  onLoginSuccess: (user: string) => void;
};

export function LoginForm({ onLoginSuccess }: Props) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  const handleSignIn = () => {
    // Simulate API call using async operation
    setTimeout(() => {
      const hasValidCredentials = username === 'admin' && password === 'admin1';
      if (hasValidCredentials) {
        onLoginSuccess(username);
        setError(undefined);
      } else {
        setError('Incorrect username or password!');
      }
    }, 500);
  };

  return (
    <View>
      <Text>Sign in to Example App</Text>

      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} accessibilityLabel="Username" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} accessibilityLabel="Password" />

      {error && <Text accessibilityLabel="Error">{error}</Text>}

      <TouchableOpacity onPress={handleSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
