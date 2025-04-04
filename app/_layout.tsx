import React, { useEffect } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { Platform } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  const router = useRouter();
  const segments = useSegments();

  // Handle authentication state changes
  useEffect(() => {
    // Skip navigation on first render to avoid the "navigate before mounting" error
    if (!segments || segments.length === 0) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inProtectedRoute = segments[0] === 'profile' || 
                             segments[0] === 'achievements' || 
                             segments[0] === 'tasks' || 
                             segments[0] === 'habits';
    
    if (!isAuthenticated && (inAuthGroup || inProtectedRoute)) {
      // Redirect to the login page if not authenticated and trying to access protected routes
      // Use setTimeout to ensure navigation happens after component is mounted
      const timer = setTimeout(() => {
        router.replace('/');
      }, 0);
      
      return () => clearTimeout(timer);
    } else if (isAuthenticated && segments[0] === '' && segments.length === 1) {
      // If authenticated and on the login page, redirect to the main app
      // Use setTimeout to ensure navigation happens after component is mounted
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, segments, router]);

  return (
    <SafeAreaProvider>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      {/* Use Slot instead of Stack to ensure the Root Layout is properly mounted */}
      <Slot />
    </SafeAreaProvider>
  );
}