/* eslint-disable react-native-a11y/has-valid-accessibility-ignores-invert-colors */
import React, { useEffect } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import theme from '../theme';

void SplashScreen.preventAutoHideAsync();

export default function Home() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const renderItem = ({ item }: { item: Recipe }) => (
    <Pressable role="listitem" style={styles.pressable} onPress={() => router.push(item.path)}>
      <Text style={styles.pressableText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Image
          resizeMode={'contain'}
          source={require('../assets/gradientRNBanner.png')}
          style={styles.banner}
        />
        <Text style={styles.title}>Testing Library</Text>
        <Text style={styles.subTitle}>Cookbook App</Text>
      </View>

      <FlatList<Recipe>
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

/* eslint-disable react-native/no-color-literals */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: theme.colors.black,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: theme.colors.gray,
  },
  banner: {
    height: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  pressable: {
    backgroundColor: '#9b6dff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
  },
  pressableText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
});

type Recipe = {
  id: number;
  title: string;
  path: string;
};

const recipes: Recipe[] = [
  { id: 2, title: 'Welcome Screen with Custom Render', path: 'custom-render/' },
  { id: 1, title: 'Task List with Jotai', path: 'jotai/' },
];
