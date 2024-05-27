import * as React from 'react';

export type User = { name: string } | null;
export const UserProvider = React.createContext<User | undefined>(undefined);

export function useUser() {
  const user = React.useContext(UserProvider);
  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return user;
}
