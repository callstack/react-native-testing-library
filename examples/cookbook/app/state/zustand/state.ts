import { create } from 'zustand';
import { Task } from './types';

export interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
}));
