import { atom, createStore } from 'jotai';
import { TodoItem } from './types';

export const todosAtom = atom<TodoItem[]>([]);

// Available for use outside react components
export const store = createStore();
export const getTodos = (): TodoItem[] => store.get(todosAtom);
export const addTodo = (newTodo: TodoItem) => {
  const todos = getTodos();
  store.set(todosAtom, [...todos, newTodo]);
};
