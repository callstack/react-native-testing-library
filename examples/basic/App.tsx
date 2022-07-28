import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { LoginForm } from './components/LoginForm';
import { Home } from './components/Home';

const App = () => {
  const [user, setUser] = React.useState<string | null>(null);

  return (
    <SafeAreaView>
      {user == null ? (
        <LoginForm onLoginSuccess={setUser} />
      ) : (
        <Home user={user} />
      )}
    </SafeAreaView>
  );
};

export default App;
