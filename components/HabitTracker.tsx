import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../constants/Theme';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { Check } from 'lucide-react-native';

interface HabitTrackerProps {
  dates: Date[];
  completedDates: string[];
  onToggle: (date: string) => void;
}

export const HabitTracker = ({ dates, completedDates, onToggle }: HabitTrackerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {dates.map((date, index) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const isCompleted = completedDates.some(d => 
            isSameDay(parseISO(d), date)
          );
          const isCurrentDay = isToday(date);
          
          return (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.dayLabel}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[styles.dateLabel, isCurrentDay && styles.currentDate]}>
                {format(date, 'd')}
              </Text>
              <Pressable
                style={[
                  styles.checkCircle,
                  isCompleted && styles.completedCircle,
                  isCurrentDay && styles.currentDayCircle,
                ]}
                onPress={() => onToggle(dateKey)}
              >
                {isCompleted && <Check size={16} color="#fff" />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
    width: 40,
  },
  dayLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  currentDate: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.bold,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  currentDayCircle: {
    borderColor: theme.colors.primary,
  },
});

export default HabitTracker;