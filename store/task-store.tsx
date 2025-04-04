import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskCategory } from '@/types/task';
import { getTodayKey } from '@/utils/date-utils';

interface TaskState {
  tasks: Task[];
  categories: TaskCategory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (category: Omit<TaskCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<TaskCategory, 'id'>>) => void;
  deleteCategory: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      categories: [
        { id: '1', name: 'Work', color: '#3b82f6', icon: 'Briefcase' },
        { id: '2', name: 'Personal', color: '#10b981', icon: 'User' },
        { id: '3', name: 'Shopping', color: '#f97316', icon: 'ShoppingCart' },
        { id: '4', name: 'Health', color: '#ef4444', icon: 'Heart' },
      ],
      
      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      
      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      addCategory: (category) => set((state) => ({
        categories: [
          ...state.categories,
          {
            ...category,
            id: Date.now().toString(),
          },
        ],
      })),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...updates } : category
        ),
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      })),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);