import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from './MainScreen';
import { experiments } from './experiments';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={MainScreen}
          options={{ title: 'Experiments' }}
        />
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
