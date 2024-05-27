import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

type Props = {
  onLoginSuccess: (user: string) => void;
};

export function LoginForm({ onLoginSuccess }: Props) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    const user = await authUser(username, password);
    setIsLoading(false);

    if (user) {
      setError(undefined);
      onLoginSuccess(user);
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Sign in to Example App
      </Text>

      <Text style={styles.textLabel}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        accessibilityLabel="Username"
        autoCapitalize="none"
        style={styles.textInput}
      />

      <Text style={styles.textLabel}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        secureTextEntry={true}
        style={styles.textInput}
      />

      {error && (
        <Text accessibilityRole="alert" style={styles.validator}>
          {error}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={isLoading}
        onPress={handleSignIn}
        style={styles.button}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Pressable>
    </View>
  );
}

/**
 * Fake authentication function according to our abilities.
 * @param username The username to authenticate.
 * @param password The password to authenticate.
 * @returns username if the username and password are correct, null otherwise.
 */
function authUser(username: string, password: string): Promise<string | null> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const hasValidCredentials = username === 'admin' && password === 'admin1';
      resolve(hasValidCredentials ? username : null);
    }, 250),
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 24,
    marginTop: 8,
    marginBottom: 40,
  },
  textLabel: {
    fontSize: 16,
    color: theme.colors.label,
  },
  textInput: {
    fontSize: 20,
    padding: 8,
    marginVertical: 8,
    borderColor: theme.colors.text,
    borderWidth: 1,
  },
  button: {
    backgroundColor: theme.colors.button,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 56,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.buttonText,
  },
  validator: {
    color: theme.colors.validator,
    fontSize: 18,
    marginTop: 8,
  },
});
