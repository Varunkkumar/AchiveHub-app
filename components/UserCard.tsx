import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { User } from '@/types/user';
import { theme } from '../constants/Theme';
import { ChevronRight } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard = ({ user, onPress }: UserCardProps) => {
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
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
    <Pressable 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.userInfo}>
        {user.profileImage ? (
          <Image 
            source={{ uri: user.profileImage }} 
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.username, { color: colors.textLight }]}>@{user.username}</Text>
          
          {user.profession && (
            <Text style={[styles.profession, { color: colors.textLight }]}>
              {user.profession}
            </Text>
          )}
        </View>
      </View>
      
      <ChevronRight size={20} color={colors.textLight} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  profession: {
    fontSize: theme.typography.fontSizes.sm,
  },
});

export default UserCard;