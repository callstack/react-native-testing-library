import * as React from 'react';
import { createStore } from 'zustand';
import { tasksStoreCreator, TasksStoreProvider } from './state';
import TaskList from './TaskList';

const store = createStore(tasksStoreCreator);

export default function App() {
  return (
    <TasksStoreProvider store={store}>
      <TaskList />
    </TasksStoreProvider>
  );
}
