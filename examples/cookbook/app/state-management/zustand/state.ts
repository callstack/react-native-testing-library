import { create } from 'zustand';

import { Task } from './types';

type TaskState = {
  tasks: Task[];
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  addTask: (task: Task) => void;
  reset: () => void;
};

const initialState = {
  tasks: [] as Task[],
  newTaskTitle: '',
};

export const useTaskStore = create<TaskState>((set) => ({
  ...initialState,
  setNewTaskTitle: (newTaskTitle) => set({ newTaskTitle }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
      newTaskTitle: '',
    })),
  reset: () => set(initialState),
}));

// Available for use outside React components
export function getAllTasks(): Task[] {
  return useTaskStore.getState().tasks;
}

export function addTask(task: Task) {
  useTaskStore.getState().addTask(task);
}
