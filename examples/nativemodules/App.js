import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import PureNativeModule from './PureNativeModule';

export default function App() {
  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <PureNativeModule />
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
