import * as React from 'react';
import { createContext, useContext, useRef } from 'react';
import { createStore, StateCreator, StoreApi, useStore } from 'zustand';
import { Task } from './types';

export interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
}

export const tasksStoreCreator: StateCreator<TasksState> = (set) => ({
  tasks: [],
  addTask: (task: Task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  deleteTask: (id: string) => {
    set((state) => ({ tasks: state.tasks.filter((todo) => todo.id !== id) }));
  },
  toggleTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }));
  },
  clearCompleted: () => {
    set((state) => ({ tasks: state.tasks.filter((task) => !task.completed) }));
  },
});

// Use store with context
// See: https://docs.pmnd.rs/zustand/guides/testing#testing-components

export type TasksStoreApi = StoreApi<TasksState>;

const TasksStoreContext = createContext<TasksStoreApi | undefined>(undefined);

export interface TasksStoreProviderProps extends React.PropsWithChildren {
  // Optionally pass a pre-created store (for testing)
  store?: TasksStoreApi;
}

export function TasksStoreProvider({ store, children }: TasksStoreProviderProps) {
  const storeRef = useRef<TasksStoreApi>();
  if (!storeRef.current) {
    // Inject passed store or create a new one
    storeRef.current = store ?? createStore(tasksStoreCreator);
  }

  return (
    <TasksStoreContext.Provider value={storeRef.current}>{children}</TasksStoreContext.Provider>
  );
}

export type UseTasksStoreContextSelector<T> = (store: TasksState) => T;

export function useTasksStore<T>(selector: UseTasksStoreContextSelector<T>) {
  const store = useContext(TasksStoreContext);
  if (!store) {
    throw new Error('useTasksStore must be used within TasksStoreProvider');
  }

  return useStore(store, selector);
}
