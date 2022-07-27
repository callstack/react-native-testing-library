import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { LoginForm } from './components/LoginForm';
import { Home } from './components/Home';

const App = () => {
  const [user, setUser] = React.useState<string | null>(null);

  if (user == null) {
    return (
      <SafeAreaView>
        <LoginForm onLoginSuccess={setUser} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Home user={user} />
    </SafeAreaView>
  );
};

export default App;
