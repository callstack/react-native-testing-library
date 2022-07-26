import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export function LoginScreen() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  if (isLoggedIn) {
    return (
      <View>
        <Text>Welcome {username}!</Text>
      </View>
    );
  }

  const handleSignIn = () => {
    // Simulate async operation
    setTimeout(() => {
      const hasValidCredentials = username === 'admin' && password === 'admin1';
      if (hasValidCredentials) {
        setIsLoggedIn(true);
        setError(undefined);
      } else {
        setError('Incorrect username or password!');
      }
    }, 500);
  };

  return (
    <View>
      <Text>Sign in to Admin Panel</Text>

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
