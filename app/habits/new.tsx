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
import { useHabitStore } from '@/store/habit-store';
import { theme } from '../../constants/Theme';
import Button from '@/components/Button';
import { Calendar, Repeat, Activity } from 'lucide-react-native';
import { colors } from '../../constants/colors';

export default function NewHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabitStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
  const [color, setColor] = useState(colors.primary);
  const [icon, setIcon] = useState('Activity');
  
  const colorOptions = [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.error,
    colors.warning,
    colors.info,
  ];
  
  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };
  
  const handleSubmit = () => {
    if (!name.trim()) {
      // Show error
      return;
    }
    
    addHabit({
      name: name.trim(),
      description: description.trim(),
      frequency,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      color,
      icon,
    });
    
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "New Habit" }} />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter habit description"
              placeholderTextColor={theme.colors.textLight}
              multiline
              numberOfLines={Platform.OS === 'ios' ? 0 : 4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {colorOptions.map((colorOption, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption },
                    color === colorOption && styles.selectedColorOption
                  ]}
                  onPress={() => setColor(colorOption)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              <Pressable
                style={[
                  styles.frequencyOption,
                  frequency === 'daily' && styles.selectedFrequencyOption
                ]}
                onPress={() => setFrequency('daily')}
              >
                <Calendar size={20} color={frequency === 'daily' ? '#fff' : theme.colors.text} />
                <Text 
                  style={[
                    styles.frequencyText,
                    frequency === 'daily' && styles.selectedFrequencyText
                  ]}
                >
                  Daily
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.frequencyOption,
                  frequency === 'weekly' && styles.selectedFrequencyOption
                ]}
                onPress={() => setFrequency('weekly')}
              >
                <Repeat size={20} color={frequency === 'weekly' ? '#fff' : theme.colors.text} />
                <Text 
                  style={[
                    styles.frequencyText,
                    frequency === 'weekly' && styles.selectedFrequencyText
                  ]}
                >
                  Weekly
                </Text>
              </Pressable>
            </View>
          </View>
          
          {frequency === 'weekly' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Days of Week</Text>
              <View style={styles.daysContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.dayOption,
                      daysOfWeek.includes(index) && styles.selectedDayOption
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text 
                      style={[
                        styles.dayText,
                        daysOfWeek.includes(index) && styles.selectedDayText
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Create Habit"
            onPress={handleSubmit}
            style={styles.footerButton}
            disabled={!name.trim() || (frequency === 'weekly' && daysOfWeek.length === 0)}
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
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: theme.colors.text,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  selectedFrequencyOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  frequencyText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  selectedFrequencyText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dayOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  selectedDayOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
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