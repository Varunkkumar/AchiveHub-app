import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Habit } from '@/types/habit';
import { theme } from '../constants/Theme';
import { getTodayKey } from '@/utils/date-utils';
import { CheckCircle, Circle, Flame } from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onToggleComplete: () => void;
}

export const HabitCard = ({ habit, onPress, onToggleComplete }: HabitCardProps) => {
  const todayKey = getTodayKey();
  const isCompletedToday = habit.completedDates.includes(todayKey);
  
  // Get icon dynamically from the habit's icon property
  const IconComponent = ({ size, color }: { size: number, color: string }) => {
    return <Circle size={size} color={color} />;
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${habit.color}20` }]}>
        <IconComponent size={24} color={habit.color} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{habit.name}</Text>
        
        {habit.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {habit.description}
          </Text>
        ) : null}
        
        <View style={styles.streakContainer}>
          <Flame size={14} color={theme.colors.secondary} />
          <Text style={styles.streakText}>
            {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''} streak
          </Text>
        </View>
      </View>
      
      <Pressable 
        style={styles.checkContainer} 
        onPress={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
      >
        {isCompletedToday ? (
          <CheckCircle size={28} color={theme.colors.success} />
        ) : (
          <Circle size={28} color={theme.colors.border} />
        )}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  streakText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  checkContainer: {
    padding: theme.spacing.xs,
  },
});

export default HabitCard;