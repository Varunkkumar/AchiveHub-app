import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/Theme';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { Eye, EyeOff, LogIn, Code } from 'lucide-react-native';
import Button from '@/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
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
  
  // Mark initial render as complete after component mounts
  useEffect(() => {
    setIsInitialRender(false);
  }, []);
  
  // Redirect to home if already authenticated, but skip on first render
  useEffect(() => {
    if (isAuthenticated && !isInitialRender) {
      // Use setTimeout to ensure navigation happens after component is mounted
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitialRender]);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }
    
    try {
      const success = await login(email, password, keepLoggedIn);
      if (success) {
        // Navigation will happen in the useEffect above
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleDevLogin = async () => {
    try {
      const success = await login('varun', '123456', true);
      if (success) {
        // Navigation will happen in the useEffect above
      }
    } catch (err) {
      console.error('Dev login error:', err);
      Alert.alert('Error', 'Developer login failed. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.devButton}
            onPress={handleDevLogin}
            accessibilityLabel="Developer login"
          >
            <Code size={16} color={theme.colors.primary} />
            <Text style={styles.devButtonText}>Dev</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1533745848184-3db07256e163?w=500' }} 
              style={styles.logo}
              accessibilityLabel="AchieveHub logo"
            />
            <Text style={[styles.appName, { color: colors.text }]}>AchieveHub</Text>
            <Text style={[styles.tagline, { color: colors.textLight }]}>Track, Share, and Celebrate Your Achievements</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email or Username</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email or username"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-input"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.passwordContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  testID="password-input"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                accessibilityLabel={keepLoggedIn ? "Disable keep me logged in" : "Enable keep me logged in"}
              >
                <View style={[
                  styles.checkbox,
                  keepLoggedIn && styles.checkboxChecked
                ]}>
                  {keepLoggedIn && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>Keep me logged in</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <Button
              title="Log In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              icon={<LogIn size={20} color="#fff" />}
              style={styles.loginButton}
              testID="login-button"
            />
            
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.textLight }]}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.lg,
  },
  errorContainer: {
    backgroundColor: `${theme.colors.error}20`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.sm,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  eyeButton: {
    padding: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: theme.typography.fontWeights.bold,
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSizes.sm,
  },
  forgotPassword: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: theme.typography.fontSizes.md,
    marginRight: theme.spacing.xs,
  },
  registerLink: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  devButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 10,
  },
  devButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: 4,
  },
});