import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { experiments } from './src/experiments';
import { MainScreen } from './src/MainScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="main" component={MainScreen} options={{ title: 'Experiments' }} />
        {experiments.map((exp) => (
          <Stack.Screen
            key={exp.key}
            name={exp.key}
            component={exp.component}
            options={{ title: exp.title }}
          />
        ))}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
