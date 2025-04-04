import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/Theme';
import { useSettingsStore } from '@/store/settings-store';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
}

const EmptyState = ({ icon, title, message }: EmptyStateProps) => {
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  // Get colors based on theme
  const colors = activeTheme === 'dark' ? {
    text: '#f9fafb',
    textLight: '#9ca3af',
  } : {
    text: theme.colors.text,
    textLight: theme.colors.textLight,
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textLight }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default EmptyState;