import * as React from 'react';

export type User = { name: string };
export const UserProvider = React.createContext<User | null>(null);

export function useUser() {
  return React.useContext(UserProvider);
}
