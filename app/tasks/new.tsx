import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/store/task-store';
import { useStatsStore } from '@/store/stats-store';
import { theme } from '../../constants/Theme';
import Button from '@/components/Button';
import { Calendar, Clock, Flag } from 'lucide-react-native';
import { TaskPriority } from '@/types/task';

export default function NewTaskScreen() {
  const router = useRouter();
  const { categories, addTask } = useTaskStore();
  const { recordTaskCreated } = useStatsStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  
  const handleSubmit = () => {
    if (!title.trim()) {
      // Show error
      return;
    }
    
    addTask({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      priority,
      dueDate: dueDate || undefined,
      completed: false,
    });
    
    recordTaskCreated();
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "New Task" }} />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor={theme.colors.textLight}
              multiline
              numberOfLines={Platform.OS === 'ios' ? 0 : 4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    categoryId === category.id && styles.selectedCategoryChip,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setCategoryId(category.id)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      categoryId === category.id && styles.selectedCategoryText,
                      { color: categoryId === category.id ? '#fff' : category.color }
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              <Pressable
                style={[
                  styles.priorityChip,
                  priority === 'low' && styles.selectedPriorityChip,
                  { borderColor: theme.colors.info }
                ]}
                onPress={() => setPriority('low')}
              >
                <Flag size={16} color={priority === 'low' ? '#fff' : theme.colors.info} />
                <Text 
                  style={[
                    styles.priorityText,
                    priority === 'low' && styles.selectedPriorityText,
                    { color: priority === 'low' ? '#fff' : theme.colors.info }
                  ]}
                >
                  Low
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.priorityChip,
                  priority === 'medium' && styles.selectedPriorityChip,
                  { borderColor: theme.colors.warning }
                ]}
                onPress={() => setPriority('medium')}
              >
                <Flag size={16} color={priority === 'medium' ? '#fff' : theme.colors.warning} />
                <Text 
                  style={[
                    styles.priorityText,
                    priority === 'medium' && styles.selectedPriorityText,
                    { color: priority === 'medium' ? '#fff' : theme.colors.warning }
                  ]}
                >
                  Medium
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.priorityChip,
                  priority === 'high' && styles.selectedPriorityChip,
                  { borderColor: theme.colors.error }
                ]}
                onPress={() => setPriority('high')}
              >
                <Flag size={16} color={priority === 'high' ? '#fff' : theme.colors.error} />
                <Text 
                  style={[
                    styles.priorityText,
                    priority === 'high' && styles.selectedPriorityText,
                    { color: priority === 'high' ? '#fff' : theme.colors.error }
                  ]}
                >
                  High
                </Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <Pressable 
              style={styles.datePickerButton}
              onPress={() => {
                // In a real app, you would show a date picker here
                // For this example, we'll just set a dummy date
                setDueDate(new Date().toISOString());
              }}
            >
              <Calendar size={20} color={theme.colors.textLight} />
              <Text style={styles.datePickerText}>
                {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select date'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Create Task"
            onPress={handleSubmit}
            style={styles.footerButton}
            disabled={!title.trim()}
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
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    justifyContent: 'center',
  },
  selectedPriorityChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  priorityText: {
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  selectedPriorityText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  datePickerText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});