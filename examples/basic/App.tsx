import * as React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from './components/LoginForm';
import { Home } from './components/Home';

const App = () => {
  const [user, setUser] = React.useState<string | null>(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {user == null ? <LoginForm onLoginSuccess={setUser} /> : <Home user={user} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
