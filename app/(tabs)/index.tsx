import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAchievementStore } from '@/store/achievement-store';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import AchievementCard from '@/components/AchievementCard';
import EmptyState from '@/components/EmptyState';
import { Award, Users, Globe } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { getPublicAchievements, toggleLike, togglePinned } = useAchievementStore();
  const { user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  
  if (!user) {
    return null;
  }
  
  // Get public achievements from all users
  const publicAchievements = getPublicAchievements()
    .filter(a => a.userId !== user.id) // Exclude own achievements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Feed</Text>
        <Pressable 
          style={styles.networkButton}
          onPress={() => router.push('/network')}
        >
          <Users size={24} color={theme.colors.primary} />
        </Pressable>
      </View>
      
      {publicAchievements.length === 0 ? (
        <EmptyState
          icon={<Globe size={64} color={colors.textLight} />}
          title="No achievements in your feed"
          message="Connect with more users to see their achievements here"
        />
      ) : (
        <FlatList
          data={publicAchievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AchievementCard
              achievement={item}
              onPress={() => router.push(`/achievements/${item.id}`)}
              onToggleLike={() => toggleLike(item.id, user.id)}
              onTogglePinned={() => togglePinned(item.id)}
            />
          )}
          contentContainerStyle={styles.achievementsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  networkButton: {
    padding: theme.spacing.sm,
  },
  achievementsList: {
    padding: theme.spacing.lg,
  },
});