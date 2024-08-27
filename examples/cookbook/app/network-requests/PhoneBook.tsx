import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { User } from './types';
import ContactsList from './components/ContactsList';
import FavoritesList from './components/FavoritesList';
import getAllContacts from './api/getAllContacts';
import getAllFavorites from './api/getAllFavorites';

export default () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [favoritesData, setFavoritesData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const _getAllContacts = async () => {
      const _data = await getAllContacts();
      setUsersData(_data);
    };
    const _getAllFavorites = async () => {
      const _data = await getAllFavorites();
      setFavoritesData(_data);
    };

    const run = async () => {
      try {
        await Promise.all([_getAllContacts(), _getAllFavorites()]);
      } catch (e) {
        setError(e.message);
      }
    };

    void run();
  }, []);

  if (error) {
    return <Text>An error occurred: {error}</Text>;
  }

  return (
    <>
      <FavoritesList users={favoritesData} />
      <ContactsList users={usersData} />
    </>
  );
};
