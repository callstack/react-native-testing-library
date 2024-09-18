import { User } from '../types';

export default async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=25');
  if (!res.ok) {
    throw new Error(`Error fetching contacts`);
  }
  const json = await res.json();
  return json.results;
};
