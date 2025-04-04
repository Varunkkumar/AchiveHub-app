import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '@/store/habit-store';
import { useStatsStore } from '@/store/stats-store';
import { theme } from '../../constants/Theme';
import HabitCard from '@/components/HabitCard';
import HabitTracker from '@/components/HabitTracker';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { Plus, Activity, Calendar } from 'lucide-react-native';
import { getTodayKey, getNextNDays } from '@/utils/date-utils';

export default function HabitsScreen() {
  const router = useRouter();
  const { habits, toggleHabitCompletion } = useHabitStore();
  const { recordHabitCompleted } = useStatsStore();
  
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  
  // Filter habits based on selected filter
  const filteredHabits = habits.filter(habit => {
    if (filter === 'daily' && habit.frequency !== 'daily') return false;
    if (filter === 'weekly' && habit.frequency !== 'weekly') return false;
    return true;
  });
  
  // Sort habits by streak (descending)
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    return b.currentStreak - a.currentStreak;
  });
  
  const handleToggleHabit = (habitId: string) => {
    const todayKey = getTodayKey();
    const habit = habits.find(h => h.id === habitId);
    
    if (habit && !habit.completedDates.includes(todayKey)) {
      recordHabitCompleted();
    }
    
    toggleHabitCompletion(habitId, todayKey);
  };
  
  // Get next 7 days for the habit tracker
  const next7Days = getNextNDays(7);
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <Button
          title="New Habit"
          onPress={() => router.push('/habits/new')}
          icon={<Plus size={18} color="#fff" />}
          size="sm"
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <Pressable
            style={[styles.filterChip, filter === 'all' && styles.activeFilterChip]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.filterChip, filter === 'daily' && styles.activeFilterChip]}
            onPress={() => setFilter('daily')}
          >
            <Text style={[styles.filterText, filter === 'daily' && styles.activeFilterText]}>
              Daily
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.filterChip, filter === 'weekly' && styles.activeFilterChip]}
            onPress={() => setFilter('weekly')}
          >
            <Text style={[styles.filterText, filter === 'weekly' && styles.activeFilterText]}>
              Weekly
            </Text>
          </Pressable>
        </ScrollView>
      </View>
      
      {sortedHabits.length === 0 ? (
        <EmptyState
          icon={<Activity size={64} color={theme.colors.textLight} />}
          title="No habits found"
          message={
            filter !== 'all'
              ? "Try changing your filter to see more habits"
              : "Tap the + button to create your first habit"
          }
        />
      ) : (
        <ScrollView 
          style={styles.habitsList}
          contentContainerStyle={styles.habitsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trackerCard}>
            <View style={styles.trackerHeader}>
              <Text style={styles.trackerTitle}>This Week</Text>
              <Calendar size={20} color={theme.colors.textLight} />
            </View>
            
            {habits.length > 0 && (
              <HabitTracker
                dates={next7Days}
                completedDates={[]}
                onToggle={() => {}}
              />
            )}
          </View>
          
          {sortedHabits.map(habit => (
            <HabitCard 
              key={habit.id}
              habit={habit}
              onPress={() => router.push(`/habits/${habit.id}`)}
              onToggleComplete={() => handleToggleHabit(habit.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filtersScroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
  habitsList: {
    flex: 1,
  },
  habitsContent: {
    padding: theme.spacing.lg,
  },
  trackerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trackerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
});