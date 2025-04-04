import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '@/store/habit-store';
import { theme } from '../../constants/Theme';
import { formatDate, getNextNDays } from '@/utils/date-utils';
import Button from '@/components/Button';
import HabitTracker from '@/components/HabitTracker';
import ProgressBar from '@/components/ProgressBar';
import { Calendar, Repeat, Flame, Trash2, Edit2 } from 'lucide-react-native';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { habits, deleteHabit, toggleHabitCompletion } = useHabitStore();
  
  const habit = habits.find(h => h.id === id);
  
  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </SafeAreaView>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  // Get next 7 days for the habit tracker
  const next7Days = getNextNDays(7);
  
  // Calculate completion rate for the last 30 days
  const last30Days = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last30Days.push(formatDate(date));
  }
  
  const completionRate = habit.completedDates.filter(date => {
    const dateObj = new Date(date);
    const dateStr = formatDate(dateObj);
    return last30Days.includes(dateStr);
  }).length / 30 * 100;
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Habit Details",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                variant="ghost"
                size="sm"
                icon={<Edit2 size={18} color={theme.colors.primary} />}
                onPress={() => router.push(`/habits/edit/${habit.id}`)}
                style={styles.headerButton}
                textStyle={{ display: 'none' }}
              />
              <Button
                title="Delete"
                variant="ghost"
                size="sm"
                icon={<Trash2 size={18} color={theme.colors.error} />}
                onPress={handleDelete}
                style={styles.headerButton}
                textStyle={{ display: 'none' }}
              />
            </View>
          )
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{habit.name}</Text>
              <View style={[styles.habitBadge, { backgroundColor: `${habit.color}20` }]}>
                <Text style={[styles.habitBadgeText, { color: habit.color }]}>
                  {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
                </Text>
              </View>
            </View>
            
            {habit.description ? (
              <Text style={styles.description}>{habit.description}</Text>
            ) : null}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <HabitTracker
              dates={next7Days}
              completedDates={habit.completedDates}
              onToggle={(date) => toggleHabitCompletion(habit.id, date)}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.secondary}20` }]}>
                  <Flame size={24} color={theme.colors.secondary} />
                </View>
                <Text style={styles.statValue}>{habit.currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Flame size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{habit.longestStreak}</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.success}20` }]}>
                  <Calendar size={24} color={theme.colors.success} />
                </View>
                <Text style={styles.statValue}>{habit.completedDates.length}</Text>
                <Text style={styles.statLabel}>Total Completions</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>30-Day Completion Rate</Text>
              <ProgressBar progress={completionRate} showPercentage color={habit.color} />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color={theme.colors.textLight} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValue}>
                  {formatDate(habit.createdAt)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Repeat size={20} color={theme.colors.textLight} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>
                  {habit.frequency === 'daily' ? 'Every day' : 'Specific days of week'}
                </Text>
                {habit.frequency === 'weekly' && habit.daysOfWeek && (
                  <Text style={styles.detailSubvalue}>
                    {habit.daysOfWeek.map(day => {
                      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      return days[day];
                    }).join(', ')}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Track Today"
            onPress={() => toggleHabitCompletion(habit.id, new Date().toISOString().split('T')[0])}
            style={styles.footerButton}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
  },
  habitBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  habitBadgeText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: theme.spacing.md,
  },
  progressLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  detailSubvalue: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  button: {
    alignSelf: 'center',
  },
});