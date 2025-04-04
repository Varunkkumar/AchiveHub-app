import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import { Home, Award, CheckSquare, Calendar, Settings, Users } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Mark initial render as complete after component mounts
  useEffect(() => {
    setIsInitialRender(false);
  }, []);
  
  // If not authenticated, redirect to login, but skip on first render
  useEffect(() => {
    if (!isAuthenticated && !isInitialRender) {
      // Use setTimeout to ensure navigation happens after component is mounted
      const timer = setTimeout(() => {
        router.replace('/');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitialRender]);
  
  // If not authenticated, don't render tabs
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Get colors based on theme
  const colors = activeTheme === 'dark' ? {
    background: '#111827',
    card: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textLight: '#9ca3af',
  } : {
    background: theme.colors.background,
    card: theme.colors.card,
    border: theme.colors.border,
    text: theme.colors.text,
    textLight: theme.colors.textLight,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: { 
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerTitleStyle: {
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'AchieveHub',
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
          headerTitle: 'Achievements',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
          headerTitle: 'Tasks',
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'Habits',
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: 'My Network',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}