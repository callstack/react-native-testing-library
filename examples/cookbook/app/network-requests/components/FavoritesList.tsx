import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import type { ListRenderItem } from '@react-native/virtualized-lists';
import { User } from '../types';

export default ({ users }: { users: User[] }) => {
  const renderItem: ListRenderItem<User> = useCallback(({ item: { picture } }) => {
    return (
      <View style={styles.userContainer}>
        <Image
          source={{ uri: picture.thumbnail }}
          style={styles.userImage}
          accessibilityLabel={'favorite-contact-avatar'}
        />
      </View>
    );
  }, []);

  if (users.length === 0) return <FullScreenLoader />;

  return (
    <View style={styles.outerContainer}>
      <Text>⭐My Favorites</Text>
      <FlatList<User>
        horizontal
        showsHorizontalScrollIndicator={false}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id.value}`}
      />
    </View>
  );
};
const FullScreenLoader = () => {
  return (
    <View style={styles.loaderContainer}>
      <Text>Figuring out your favorites...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    padding: 8,
  },
  userContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 52,
    height: 52,
    borderRadius: 36,
    borderColor: '#9b6dff',
    borderWidth: 2,
  },
  loaderContainer: { height: 52, justifyContent: 'center', alignItems: 'center' },
});
