import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  image?: string;
  pinned: boolean;
  likes: string[];
}

interface AchievementStore {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'pinned' | 'likes'>) => void;
  togglePinned: (id: string) => void;
  toggleLike: (id: string, userId: string) => void;
  deleteAchievement: (id: string) => void;
  getPublicAchievements: () => Achievement[];
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: [],
      
      addAchievement: (achievement) => 
        set((state) => ({
          achievements: [
            ...state.achievements,
            {
              ...achievement,
              id: Math.random().toString(36).substr(2, 9),
              pinned: false,
              likes: [],
            },
          ],
        })),
      
      togglePinned: (id) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id
              ? { ...achievement, pinned: !achievement.pinned }
              : achievement
          ),
        })),
      
      toggleLike: (id, userId) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id
              ? {
                  ...achievement,
                  likes: achievement.likes.includes(userId)
                    ? achievement.likes.filter((likeId) => likeId !== userId)
                    : [...achievement.likes, userId],
                }
              : achievement
          ),
        })),
      
      deleteAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.filter(
            (achievement) => achievement.id !== id
          ),
        })),
      
      getPublicAchievements: () => {
        return get().achievements;
      },
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 