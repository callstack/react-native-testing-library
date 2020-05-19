import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

/* eslint-disable no-console */
const KEY = '@storage_key';

export default function StorageView() {
  const [count, setCount] = useState('0');

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem(KEY, `${value}`);
    } catch (error) {
      console.error(error);
    }
  };

  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem(KEY);
      return value ? Number.parseInt(value, 10) : 0;
    } catch (error) {
      console.error(error);
    }
  };

  const populate = async () => {
    const value = await readData();
    setCount(() => value);
  };

  return (
    <View>
      <Button title="Increment counter" onPress={() => storeData(count + 1)} />
      <Text>Counter {count}</Text>
      <Button title="Populate" onPress={populate} />
    </View>
  );
}
