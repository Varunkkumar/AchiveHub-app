import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAchievementStore } from '@/store/achievement-store';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import AchievementCard from '@/components/AchievementCard';
import EmptyState from '@/components/EmptyState';
import { Award, Plus, Search, Medal, Flag, Star } from 'lucide-react-native';

export default function AchievementsScreen() {
  const router = useRouter();
  const { achievements, togglePinned, toggleLike } = useAchievementStore();
  const { user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  if (!user) {
    return null;
  }
  
  // Get user's achievements
  const userAchievements = achievements
    .filter(a => a.userId === user.id)
    .sort((a, b) => {
      // Pinned first, then by date
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  // Apply search filter
  const filteredAchievements = userAchievements.filter(a => {
    const matchesSearch = searchQuery 
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesType = filterType 
      ? a.type === filterType
      : true;
      
    return matchesSearch && matchesType;
  });
  
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
        <Text style={[styles.title, { color: colors.text }]}>Achievements</Text>
        <Pressable 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/achievements/new')}
        >
          <Plus size={24} color="#fff" />
        </Pressable>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search achievements..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === null && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(null)}
          >
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === null && styles.activeFilterText
              ]}
            >
              All
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === 'award' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(filterType === 'award' ? null : 'award')}
          >
            <Award 
              size={16} 
              color={filterType === 'award' ? '#fff' : colors.textLight} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === 'award' && styles.activeFilterText
              ]}
            >
              Awards
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === 'participation' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(filterType === 'participation' ? null : 'participation')}
          >
            <Medal 
              size={16} 
              color={filterType === 'participation' ? '#fff' : colors.textLight} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === 'participation' && styles.activeFilterText
              ]}
            >
              Participation
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === 'completion' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(filterType === 'completion' ? null : 'completion')}
          >
            <Flag 
              size={16} 
              color={filterType === 'completion' ? '#fff' : colors.textLight} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === 'completion' && styles.activeFilterText
              ]}
            >
              Completion
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === 'milestone' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(filterType === 'milestone' ? null : 'milestone')}
          >
            <Star 
              size={16} 
              color={filterType === 'milestone' ? '#fff' : colors.textLight} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === 'milestone' && styles.activeFilterText
              ]}
            >
              Milestones
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filterType === 'personal' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
            ]}
            onPress={() => setFilterType(filterType === 'personal' ? null : 'personal')}
          >
            <Star 
              size={16} 
              color={filterType === 'personal' ? '#fff' : colors.textLight} 
            />
            <Text 
              style={[
                styles.filterText,
                { color: colors.textLight },
                filterType === 'personal' && styles.activeFilterText
              ]}
            >
              Personal
            </Text>
          </Pressable>
        </ScrollView>
      </View>
      
      {filteredAchievements.length === 0 ? (
        <EmptyState
          icon={<Award size={64} color={colors.textLight} />}
          title={searchQuery || filterType ? "No matching achievements" : "No achievements yet"}
          message={
            searchQuery || filterType 
              ? "Try a different search term or filter" 
              : "Add your first achievement by tapping the + button"
          }
        />
      ) : (
        <FlatList
          data={filteredAchievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AchievementCard
              achievement={item}
              onPress={() => router.push(`/achievements/${item.id}`)}
              onTogglePinned={() => togglePinned(item.id)}
              onToggleLike={() => toggleLike(item.id, user.id)}
            />
          )}
          contentContainerStyle={styles.achievementsList}
          showsVerticalScrollIndicator={false}
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
  achievementsList: {
    padding: theme.spacing.lg,
  },
}); 