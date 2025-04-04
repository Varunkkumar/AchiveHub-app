export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Only used in mock data, would not be included in a real app
    name: string;
    bio?: string;
    profileImage?: string;
    profession?: string;
    skills?: string[];
    connections: string[];
    pendingConnections: string[];
    createdAt: string;
    role: 'user' | 'admin'; // Added role field for user permissions
    // Additional fields that might be useful
    achievements?: string[]; // IDs of achievements
    tasks?: string[]; // IDs of tasks
    habits?: string[]; // IDs of habits
    stats?: {
      totalAchievements: number;
      completedTasks: number;
      streakDays: number;
    };
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
  }