import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAchievementStore } from '../../store/achievement-store';
import { useAuthStore } from '../../store/auth-store';
import { useSettingsStore } from '../../store/settings-store';
import { theme } from '../../constants/Theme';
import { Award, Plus, Calendar, Image as ImageIcon, X } from 'lucide-react-native';

export default function NewAchievementScreen() {
  const router = useRouter();
  const { addAchievement } = useAchievementStore();
  const { user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('award');
  const [image, setImage] = useState<string | undefined>();
  
  if (!user) {
    return null;
  }
  
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
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    addAchievement({
      userId: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      type,
      image,
    });
    
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
      <View style={styles.header}>
        <Pressable 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={colors.text} />
        </Pressable>
        
        <Text style={[styles.title, { color: colors.text }]}>New Achievement</Text>
        
        <Pressable 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Award size={20} color={colors.textLight} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Calendar size={20} color={colors.textLight} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Date"
            placeholderTextColor={colors.textLight}
            value={date}
            onChangeText={setDate}
            type="date"
          />
        </View>
        
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ImageIcon size={20} color={colors.textLight} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Image URL (optional)"
            placeholderTextColor={colors.textLight}
            value={image}
            onChangeText={setImage}
          />
        </View>
        
        <View style={styles.typeContainer}>
          <Text style={[styles.typeLabel, { color: colors.textLight }]}>Type</Text>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeContent}
          >
            {['award', 'participation', 'completion', 'milestone', 'personal'].map((t) => (
              <Pressable
                key={t}
                style={[
                  styles.typeChip,
                  { borderColor: colors.border },
                  type === t && [styles.activeTypeChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
                ]}
                onPress={() => setType(t)}
              >
                <Text 
                  style={[
                    styles.typeText,
                    { color: colors.textLight },
                    type === t && styles.activeTypeText
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  saveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
  },
  textArea: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  typeContainer: {
    marginTop: theme.spacing.md,
  },
  typeLabel: {
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.sm,
  },
  typeContent: {
    paddingRight: theme.spacing.md,
  },
  typeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
  activeTypeChip: {
    backgroundColor: theme.colors.primary,
  },
  typeText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  activeTypeText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.medium,
  },
}); 