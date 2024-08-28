import axios from 'axios';
import { User } from '../types';

export default async (): Promise<User[]> => {
  const res = await axios.get('https://randomuser.me/api/?results=10');
  return res.data.results;
};
