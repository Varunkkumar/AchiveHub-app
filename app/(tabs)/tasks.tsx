import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/store/task-store';
import { useStatsStore } from '@/store/stats-store';
import { theme } from '../../constants/Theme';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { Plus, ListTodo, Filter } from 'lucide-react-native';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, categories, toggleTaskCompletion } = useTaskStore();
  const { recordTaskCompleted } = useStatsStore();
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (categoryFilter && task.categoryId !== categoryFilter) return false;
    return true;
  });
  
  // Sort tasks: incomplete first, then by due date, then by creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Tasks with due dates come before tasks without due dates
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally, sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      recordTaskCompleted();
    }
    toggleTaskCompletion(taskId);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Button
          title="New Task"
          onPress={() => router.push('/tasks/new')}
          icon={<Plus size={18} color="#fff" />}
          size="small"
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
            style={[styles.filterChip, filter === 'active' && styles.activeFilterChip]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
              Active
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.filterChip, filter === 'completed' && styles.activeFilterChip]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
              Completed
            </Text>
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable
            style={[styles.filterChip, !categoryFilter && styles.activeFilterChip]}
            onPress={() => setCategoryFilter(null)}
          >
            <Text style={[styles.filterText, !categoryFilter && styles.activeFilterText]}>
              All Categories
            </Text>
          </Pressable>
          
          {categories.map(category => (
            <Pressable
              key={category.id}
              style={[
                styles.filterChip, 
                categoryFilter === category.id && styles.activeFilterChip,
                { borderColor: category.color }
              ]}
              onPress={() => setCategoryFilter(category.id)}
            >
              <Text 
                style={[
                  styles.filterText, 
                  categoryFilter === category.id && styles.activeFilterText,
                  categoryFilter === category.id ? { color: '#fff' } : { color: category.color }
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo size={64} color={theme.colors.textLight} />}
          title="No tasks found"
          message={
            filter !== 'all' || categoryFilter
              ? "Try changing your filters to see more tasks"
              : "Tap the + button to create your first task"
          }
        />
      ) : (
        <ScrollView 
          style={styles.tasksList}
          contentContainerStyle={styles.tasksContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedTasks.map(task => {
            const category = categories.find(c => c.id === task.categoryId);
            if (!category) return null;
            
            return (
              <TaskCard 
                key={task.id}
                task={task}
                category={category}
                onPress={() => router.push(`/tasks/${task.id}`)}
                onToggleComplete={() => handleToggleComplete(task.id)}
              />
            );
          })}
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
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    padding: theme.spacing.lg,
  },
});