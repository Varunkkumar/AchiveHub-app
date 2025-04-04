import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable,
  Platform,
  Image,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import Button from '@/components/Button';
import { Camera, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  if (!user) {
    router.replace('/');
    return null;
  }
  
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [profession, setProfession] = useState(user.profession || '');
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    
    setNewSkill('');
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    
    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      profession: profession.trim(),
      profileImage,
      skills,
    });
    
    router.back();
  };
  
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
  
  return (
    <>
      <Stack.Screen options={{ title: "Edit Profile" }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.profileImageSection}>
            {profileImage ? (
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.profileImage}
                />
                <Pressable 
                  style={styles.changeImageButton}
                  onPress={handlePickImage}
                >
                  <Camera size={20} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <Pressable 
                style={[styles.addImageButton, { borderColor: colors.border }]}
                onPress={handlePickImage}
              >
                <Plus size={32} color={colors.textLight} />
                <Text style={[styles.addImageText, { color: colors.textLight }]}>
                  Add Profile Photo
                </Text>
              </Pressable>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={Platform.OS === 'ios' ? 0 : 4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Profession</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={profession}
              onChangeText={setProfession}
              placeholder="Your profession"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View 
                  key={index} 
                  style={[styles.skillChip, { backgroundColor: `${theme.colors.primary}20` }]}
                >
                  <Text style={[styles.skillText, { color: theme.colors.primary }]}>{skill}</Text>
                  <Pressable 
                    style={styles.removeSkillButton}
                    onPress={() => handleRemoveSkill(skill)}
                  >
                    <X size={14} color={theme.colors.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
            
            <View style={[styles.addSkillContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.addSkillInput, { color: colors.text }]}
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Add a skill"
                placeholderTextColor={colors.textLight}
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
              <Pressable 
                style={[
                  styles.addSkillButton, 
                  { opacity: newSkill.trim() ? 1 : 0.5 }
                ]}
                onPress={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                <Plus size={20} color={theme.colors.primary} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
        
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.footerButton}
            disabled={!name.trim()}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  skillText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginRight: theme.spacing.xs,
  },
  removeSkillButton: {
    padding: 2,
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
  },
  addSkillInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  addSkillButton: {
    padding: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});