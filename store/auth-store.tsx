import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/types/user';

interface AuthStore extends AuthState {
  login: (email: string, password: string, keepLoggedIn: boolean) => Promise<boolean>;
  register: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => void;
  addConnection: (userId: string) => void;
  removeConnection: (userId: string) => void;
  acceptConnection: (userId: string) => void;
  rejectConnection: (userId: string) => void;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'John Doe',
    bio: 'Software Engineer passionate about mobile development',
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    profession: 'Software Engineer',
    skills: ['React Native', 'JavaScript', 'TypeScript'],
    connections: ['2'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
    role: 'user',
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Jane Doe',
    bio: 'UX Designer with 5 years of experience',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    profession: 'UX Designer',
    skills: ['UI/UX', 'Figma', 'User Research'],
    connections: ['1'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
    role: 'user',
  },
  {
    id: '3',
    username: 'mikebrown',
    email: 'mike@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Mike Brown',
    bio: 'Product Manager at Tech Co.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    profession: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'Market Research'],
    connections: [],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
    role: 'user',
  },
  {
    id: '4',
    username: 'varun',
    email: 'varun@example.com',
    password: '123456', // Developer account
    name: 'Varun K Kumar',
    bio: 'Developer and tester for AchieveTrack',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    profession: 'Developer',
    skills: ['React Native', 'Testing', 'UI Design'],
    connections: ['1', '2', '3'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
    role: 'admin',
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password, keepLoggedIn) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (!email || !password) {
            throw new Error('Email/username and password are required');
          }
          
          // Find user by email or username (mock authentication)
          const user = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() || 
                 u.username.toLowerCase() === email.toLowerCase()
          );
          
          if (!user) {
            throw new Error('Invalid email/username or password');
          }
          
          // Verify password (in a real app, you would use proper password hashing)
          if (user.password !== password) {
            throw new Error('Invalid email/username or password');
          }
          
          // Create a copy of the user without the password for security
          const secureUser = { ...user };
          delete secureUser.password;
          
          set({ 
            isAuthenticated: true, 
            user: secureUser,
            isLoading: false,
            error: null
          });
          
          return true;
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred',
            isAuthenticated: false
          });
          return false;
        }
      },
      
      register: async (username, email, password, name) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate inputs
          if (!username || !email || !password || !name) {
            throw new Error('All fields are required');
          }
          
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          
          if (!/\S+@\S+\.\S+/.test(email)) {
            throw new Error('Please enter a valid email address');
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check if email already exists
          if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email already in use');
          }
          
          // Check if username already exists
          if (mockUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Username already taken');
          }
          
          // Create new user
          const newUser: User = {
            id: (mockUsers.length + 1).toString(),
            username,
            email,
            password, // In a real app, this would be hashed
            name,
            bio: '',
            profileImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500',
            connections: [],
            pendingConnections: [],
            createdAt: new Date().toISOString(),
            role: 'user',
          };
          
          // In a real app, you would save this to a database
          mockUsers.push(newUser);
          
          // Create a copy of the user without the password for security
          const secureUser = { ...newUser };
          delete secureUser.password;
          
          set({ 
            isAuthenticated: true, 
            user: secureUser,
            isLoading: false,
            error: null
          });
          
          return true;
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred',
            isAuthenticated: false
          });
          return false;
        }
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null,
          error: null
        });
      },
      
      updateProfile: (updates) => {
        const { user } = get();
        if (!user) return;
        
        // Update the user in the store
        set({
          user: {
            ...user,
            ...updates
          }
        });
        
        // Also update the user in the mock database
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates
          };
        }
      },
      
      addConnection: (userId) => {
        const { user } = get();
        if (!user) return;
        
        // In a real app, this would send a connection request
        // For this demo, we'll just add to pendingConnections
        const targetUser = mockUsers.find(u => u.id === userId);
        if (targetUser) {
          // Avoid duplicate pending connections
          if (!targetUser.pendingConnections.includes(user.id)) {
            targetUser.pendingConnections.push(user.id);
          }
        }
      },
      
      removeConnection: (userId) => {
        const { user } = get();
        if (!user) return;
        
        // Update the current user's connections
        const updatedUser = {
          ...user,
          connections: user.connections.filter(id => id !== userId)
        };
        
        set({ user: updatedUser });
        
        // Also remove from the other user's connections
        const targetUser = mockUsers.find(u => u.id === userId);
        if (targetUser) {
          targetUser.connections = targetUser.connections.filter(id => id !== user.id);
        }
        
        // Update the user in the mock database
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex].connections = updatedUser.connections;
        }
      },
      
      acceptConnection: (userId) => {
        const { user } = get();
        if (!user) return;
        
        // Update the current user
        const updatedUser = {
          ...user,
          connections: [...user.connections, userId],
          pendingConnections: user.pendingConnections.filter(id => id !== userId)
        };
        
        set({ user: updatedUser });
        
        // Also add to the other user's connections
        const targetUser = mockUsers.find(u => u.id === userId);
        if (targetUser) {
          // Avoid duplicate connections
          if (!targetUser.connections.includes(user.id)) {
            targetUser.connections.push(user.id);
          }
        }
        
        // Update the user in the mock database
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex].connections = updatedUser.connections;
          mockUsers[userIndex].pendingConnections = updatedUser.pendingConnections;
        }
      },
      
      rejectConnection: (userId) => {
        const { user } = get();
        if (!user) return;
        
        // Update the current user
        const updatedUser = {
          ...user,
          pendingConnections: user.pendingConnections.filter(id => id !== userId)
        };
        
        set({ user: updatedUser });
        
        // Update the user in the mock database
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex].pendingConnections = updatedUser.pendingConnections;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        // Don't persist loading and error states
      }),
    }
  )
);