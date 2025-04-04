import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/store/task-store';
import { theme } from '../../constants/Theme';
import { formatDate, formatTime } from '@/utils/date-utils';
import Button from '@/components/Button';
import { Calendar, Clock, Flag, Trash2, Edit2 } from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, categories, deleteTask, toggleTaskCompletion } = useTaskStore();
  
  const task = tasks.find(t => t.id === id);
  const category = task ? categories.find(c => c.id === task.categoryId) : null;
  
  if (!task || !category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </SafeAreaView>
    );
  }
  
  const priorityColors = {
    low: theme.colors.info,
    medium: theme.colors.warning,
    high: theme.colors.error,
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteTask(task.id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Task Details",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                variant="ghost"
                size="small"
                icon={<Edit2 size={18} color={theme.colors.primary} />}
                onPress={() => router.push(`/tasks/edit/${task.id}`)}
                style={styles.headerButton}
                textStyle={{ display: 'none' }}
              />
              <Button
                title="Delete"
                variant="ghost"
                size="small"
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
              <Text style={styles.title}>{task.title}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: `${category.color}20` }]}>
                <Text style={[styles.categoryText, { color: category.color }]}>
                  {category.name}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={[
                styles.statusBadge, 
                task.completed ? styles.completedBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  task.completed ? styles.completedText : styles.pendingText
                ]}>
                  {task.completed ? "Completed" : "Pending"}
                </Text>
              </View>
            </View>
          </View>
          
          {task.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          ) : null}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color={theme.colors.textLight} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValue}>
                  {formatDate(task.createdAt)} at {formatTime(task.createdAt)}
                </Text>
              </View>
            </View>
            
            {task.dueDate && (
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Clock size={20} color={theme.colors.textLight} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(task.dueDate)} at {formatTime(task.dueDate)}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Flag size={20} color={priorityColors[task.priority]} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Priority</Text>
                <Text style={[styles.detailValue, { color: priorityColors[task.priority] }]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            onPress={() => toggleTaskCompletion(task.id)}
            variant={task.completed ? "outline" : "primary"}
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
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  completedBadge: {
    backgroundColor: `${theme.colors.success}20`,
  },
  pendingBadge: {
    backgroundColor: `${theme.colors.info}20`,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  completedText: {
    color: theme.colors.success,
  },
  pendingText: {
    color: theme.colors.info,
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
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 24,
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