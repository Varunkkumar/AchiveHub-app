import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';
import { getTodayKey } from '@/utils/date-utils';

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  calculateStreaks: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      
      addHabit: (habit) => set((state) => ({
        habits: [
          ...state.habits,
          {
            ...habit,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completedDates: [],
            currentStreak: 0,
            longestStreak: 0,
          },
        ],
      })),
      
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === id ? { ...habit, ...updates } : habit
        ),
      })),
      
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== id),
      })),
      
      toggleHabitCompletion: (id, date) => {
        set((state) => {
          const habit = state.habits.find((h) => h.id === id);
          if (!habit) return state;
          
          const isCompleted = habit.completedDates.includes(date);
          const updatedCompletedDates = isCompleted
            ? habit.completedDates.filter((d) => d !== date)
            : [...habit.completedDates, date];
          
          return {
            habits: state.habits.map((h) =>
              h.id === id
                ? { ...h, completedDates: updatedCompletedDates }
                : h
            ),
          };
        });
        
        // Recalculate streaks after toggling
        get().calculateStreaks();
      },
      
      calculateStreaks: () => set((state) => {
        const updatedHabits = state.habits.map((habit) => {
          // Sort completed dates
          const sortedDates = [...habit.completedDates].sort();
          if (sortedDates.length === 0) {
            return { ...habit, currentStreak: 0, longestStreak: 0 };
          }
          
          // Calculate current streak
          let currentStreak = 1;
          let longestStreak = 1;
          let maxStreak = 1;
          
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            
            // Check if dates are consecutive
            const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              // Consecutive days
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else if (diffDays > 1) {
              // Streak broken
              currentStreak = 1;
            }
          }
          
          // Check if the current streak is still active (includes today)
          const lastCompletedDate = new Date(sortedDates[sortedDates.length - 1]);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - lastCompletedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            currentStreak = 0;
          }
          
          return {
            ...habit,
            currentStreak,
            longestStreak: Math.max(habit.longestStreak, maxStreak),
          };
        });
        
        return { habits: updatedHabits };
      }),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);