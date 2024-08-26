import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import type { ListRenderItem } from '@react-native/virtualized-lists';
import { User } from '../types';

export default ({ users }: { users: User[] }) => {
  const renderItem: ListRenderItem<User> = useCallback(
    ({ item: { name, email, picture, cell }, index }) => {
      const { title, first, last } = name;
      const backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
      return (
        <View style={[{ backgroundColor }, styles.userContainer]}>
          <Image source={{ uri: picture.thumbnail }} style={styles.userImage} />
          <View>
            <Text>
              Name: {title} {first} {last}
            </Text>
            <Text>Email: {email}</Text>
            <Text>Mobile: {cell}</Text>
          </View>
        </View>
      );
    },
    [],
  );

  if (users.length === 0) return <FullScreenLoader />;

  return (
    <View>
      <FlatList<User>
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
      <Text>Users data not quite there yet...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 24,
    marginRight: 16,
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
