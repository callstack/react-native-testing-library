import { atom, createStore } from 'jotai';
import { Task } from './types';

export const tasksAtom = atom<Task[]>([]);
export const newTaskTitleAtom = atom('');

// Available for use outside React components
export const store = createStore();

// Selectors
export function getAllTasks(): Task[] {
  return store.get(tasksAtom);
}

// Actions
export function addTask(task: Task) {
  store.set(tasksAtom, [...getAllTasks(), task]);
}
