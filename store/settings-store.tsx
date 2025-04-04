import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Appearance } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: ThemeType;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  showCompletedTasks: boolean;
  notificationsEnabled: boolean;
  
  setTheme: (theme: ThemeType) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  setFirstDayOfWeek: (day: 0 | 1) => void;
  setShowCompletedTasks: (show: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  getActiveTheme: () => 'light' | 'dark';
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      reminderEnabled: true,
      reminderTime: '20:00',
      firstDayOfWeek: 1, // Monday
      showCompletedTasks: true,
      notificationsEnabled: true,
      
      setTheme: (theme) => set({ theme }),
      setReminderEnabled: (reminderEnabled) => set({ reminderEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setFirstDayOfWeek: (firstDayOfWeek) => set({ firstDayOfWeek }),
      setShowCompletedTasks: (showCompletedTasks) => set({ showCompletedTasks }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      
      getActiveTheme: () => {
        const { theme } = get();
        
        if (theme === 'system') {
          // Get system theme
          if (Platform.OS === 'web') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
              ? 'dark' 
              : 'light';
          } else {
            // For mobile, use Appearance API
            try {
              const colorScheme = Appearance.getColorScheme();
              return colorScheme === 'dark' ? 'dark' : 'light';
            } catch (error) {
              console.warn('Error getting system theme:', error);
              return 'light'; // Default to light if there's an error
            }
          }
        }
        
        return theme;
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these settings
        theme: state.theme,
        reminderEnabled: state.reminderEnabled,
        reminderTime: state.reminderTime,
        firstDayOfWeek: state.firstDayOfWeek,
        showCompletedTasks: state.showCompletedTasks,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);