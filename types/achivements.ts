export type AchievementType = 'award' | 'participation' | 'completion' | 'milestone' | 'personal';

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  type: AchievementType;
  category: string;
  icon: string;
  color: string;
  pinned: boolean;
  isPublic: boolean;
  images?: string[];
  likes: string[]; // Array of user IDs who liked the achievement
  comments: string[]; // Array of comment IDs
  createdAt: string;
}