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
import { useAuthStore } from '@/store/auth-store';
import { theme } from '../constants/Theme';
import Button from '@/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      // Show error
      return;
    }
    
    if (password !== confirmPassword) {
      // Show error
      return;
    }
    
    register({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    
    router.replace('/(tabs)');
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Register" }} />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry
            />
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
            title="Register"
            onPress={handleSubmit}
            style={styles.footerButton}
            disabled={!username.trim() || !email.trim() || !password.trim() || password !== confirmPassword}
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
