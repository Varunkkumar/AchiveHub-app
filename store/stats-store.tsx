import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '@/utils/date-utils';

interface DailyStats {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  habitsCompleted: number;
}

interface StatsState {
  dailyStats: Record<string, DailyStats>;
  
  recordTaskCompleted: () => void;
  recordTaskCreated: () => void;
  recordHabitCompleted: () => void;
  getWeeklyTasksCompleted: () => number;
  getWeeklyHabitsCompleted: () => number;
  getCompletionRate: () => number;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      dailyStats: {},
      
      recordTaskCompleted: () => set((state) => {
        const today = getTodayKey();
        const currentStats = state.dailyStats[today] || {
          date: today,
          tasksCompleted: 0,
          tasksCreated: 0,
          habitsCompleted: 0,
        };
        
        return {
          dailyStats: {
            ...state.dailyStats,
            [today]: {
              ...currentStats,
              tasksCompleted: currentStats.tasksCompleted + 1,
            },
          },
        };
      }),
      
      recordTaskCreated: () => set((state) => {
        const today = getTodayKey();
        const currentStats = state.dailyStats[today] || {
          date: today,
          tasksCompleted: 0,
          tasksCreated: 0,
          habitsCompleted: 0,
        };
        
        return {
          dailyStats: {
            ...state.dailyStats,
            [today]: {
              ...currentStats,
              tasksCreated: currentStats.tasksCreated + 1,
            },
          },
        };
      }),
      
      recordHabitCompleted: () => set((state) => {
        const today = getTodayKey();
        const currentStats = state.dailyStats[today] || {
          date: today,
          tasksCompleted: 0,
          tasksCreated: 0,
          habitsCompleted: 0,
        };
        
        return {
          dailyStats: {
            ...state.dailyStats,
            [today]: {
              ...currentStats,
              habitsCompleted: currentStats.habitsCompleted + 1,
            },
          },
        };
      }),
      
      getWeeklyTasksCompleted: () => {
        const stats = get().dailyStats;
        const today = new Date();
        let total = 0;
        
        // Check the last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const key = getTodayKey();
          
          if (stats[key]) {
            total += stats[key].tasksCompleted;
          }
        }
        
        return total;
      },
      
      getWeeklyHabitsCompleted: () => {
        const stats = get().dailyStats;
        const today = new Date();
        let total = 0;
        
        // Check the last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const key = getTodayKey();
          
          if (stats[key]) {
            total += stats[key].habitsCompleted;
          }
        }
        
        return total;
      },
      
      getCompletionRate: () => {
        const stats = get().dailyStats;
        const today = new Date();
        let totalCreated = 0;
        let totalCompleted = 0;
        
        // Check the last 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const key = getTodayKey();
          
          if (stats[key]) {
            totalCreated += stats[key].tasksCreated;
            totalCompleted += stats[key].tasksCompleted;
          }
        }
        
        return totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 0;
      },
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);