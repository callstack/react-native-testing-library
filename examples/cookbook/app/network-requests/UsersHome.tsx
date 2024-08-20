import React, { useEffect, useState } from 'react';
import { User } from './types';
import UserList from './components/UserList';

export default () => {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    const run = async () => {
      const _data = await getUsersWithFetch();
      setData(_data);
    };

    void run();
  }, []);

  return (
    <>
      {/*Todo: maybe this should be a phone book app with all contacts, catch up suggestions at the top woth avatar*/}
      {/*add phonbe number to user maybe?*/}
      {/* TODO: Add Catch up with... UserSuggestionsList with avatar horizontally in top that will utilize axios for example*/}
      {/*maybe add one example of react query?*/}
      <UserList users={data} />
    </>
  );
};

const getUsersWithFetch = async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=25');
  const json = await res.json();
  return json.results;
};
