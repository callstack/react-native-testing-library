import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '../theme';

export default function Home() {
  const router = useRouter();

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
    color: theme.colors.black,
  },
  subTitle: {
    fontSize: 14,
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
    textAlign: 'center',
  },
});

type Recipe = {
  id: number;
  title: string;
  path: string;
};

const recipes: Recipe[] = [
  { id: 1, title: 'Welcome Screen with Custom Render', path: 'custom-render/' },
  { id: 2, title: 'Task List with Jotai', path: 'state-management/jotai/' },
  { id: 3, title: 'Phone book with\na Variety of Net. Req. Methods', path: 'network-requests/' },
];
