import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task, TaskCategory } from '@/types/task';
import { formatDate } from '@/utils/date-utils';
import { theme } from '../constants/Theme';
import { Check, Calendar, Flag } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  category: TaskCategory;
  onPress: () => void;
  onToggleComplete: () => void;
}

export const TaskCard = ({ task, category, onPress, onToggleComplete }: TaskCardProps) => {
  const priorityColors = {
    low: theme.colors.info,
    medium: theme.colors.warning,
    high: theme.colors.error,
  };

  return (
    <Pressable 
      style={[styles.container, task.completed && styles.completedContainer]} 
      onPress={onPress}
    >
      <Pressable 
        style={[styles.checkbox, task.completed && styles.checkedBox, { borderColor: category.color }]} 
        onPress={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
      >
        {task.completed && <Check size={16} color="#fff" />}
      </Pressable>
      
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedText]}>{task.title}</Text>
        
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        
        <View style={styles.footer}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
          
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Calendar size={14} color={theme.colors.textLight} />
              <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Flag size={14} color={priorityColors[task.priority]} />
            <Text style={[styles.metaText, { color: priorityColors[task.priority] }]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  completedContainer: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  checkedBox: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.textLight,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}10`,
    marginRight: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  metaText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
});

export default TaskCard;