import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import Button from '@/components/Button';
import { 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  Calendar, 
  CheckSquare, 
  LogOut, 
  User, 
  ChevronRight,
  Monitor,
  Shield,
  HelpCircle,
  Info
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { 
    theme: themePreference, 
    reminderEnabled, 
    notificationsEnabled, 
    showCompletedTasks,
    firstDayOfWeek,
    setTheme,
    setReminderEnabled,
    setNotificationsEnabled,
    setShowCompletedTasks,
    setFirstDayOfWeek,
    getActiveTheme
  } = useSettingsStore();
  
  const activeTheme = getActiveTheme();
  
  const handleLogout = useCallback(() => {
    logout();
    // Use setTimeout to ensure navigation happens after component is mounted
    setTimeout(() => {
      router.replace('/');
    }, 0);
  }, [logout, router]);
  
  const handleViewProfile = useCallback(() => {
    if (user) {
      // Use setTimeout to ensure navigation happens after component is mounted
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 0);
    }
  }, [user, router]);
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Pressable 
            style={styles.profileButton}
            onPress={handleViewProfile}
            accessibilityLabel="View your profile"
            testID="profile-button"
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileImageContainer}>
                {user?.profileImage ? (
                  <Image 
                    source={{ uri: user.profileImage }} 
                    style={styles.profileImage}
                    accessibilityLabel={`${user.name}'s profile picture`}
                  />
                ) : (
                  <User size={24} color={theme.colors.primary} />
                )}
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {user?.name || 'Your Profile'}
                </Text>
                <Text style={[styles.profileUsername, { color: colors.textLight }]}>
                  @{user?.username || 'username'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </Pressable>
        </View>
        
        {/* Appearance Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Sun size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Light Theme</Text>
            </View>
            <Switch
              value={themePreference === 'light'}
              onValueChange={(value) => value && setTheme('light')}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={themePreference === 'light' ? theme.colors.primary : colors.textLight}
              testID="light-theme-switch"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Moon size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Theme</Text>
            </View>
            <Switch
              value={themePreference === 'dark'}
              onValueChange={(value) => value && setTheme('dark')}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={themePreference === 'dark' ? theme.colors.primary : colors.textLight}
              testID="dark-theme-switch"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Monitor size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>System Theme</Text>
            </View>
            <Switch
              value={themePreference === 'system'}
              onValueChange={(value) => value && setTheme('system')}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={themePreference === 'system' ? theme.colors.primary : colors.textLight}
              testID="system-theme-switch"
            />
          </View>
        </View>
        
        {/* Notifications Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={notificationsEnabled ? theme.colors.primary : colors.textLight}
              testID="notifications-switch"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Clock size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Reminders</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={reminderEnabled ? theme.colors.primary : colors.textLight}
              testID="reminders-switch"
            />
          </View>
        </View>
        
        {/* Preferences Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Calendar size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Week Starts on Monday</Text>
            </View>
            <Switch
              value={firstDayOfWeek === 1}
              onValueChange={(value) => setFirstDayOfWeek(value ? 1 : 0)}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={firstDayOfWeek === 1 ? theme.colors.primary : colors.textLight}
              testID="week-start-switch"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <CheckSquare size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Show Completed Tasks</Text>
            </View>
            <Switch
              value={showCompletedTasks}
              onValueChange={setShowCompletedTasks}
              trackColor={{ false: colors.border, true: `${theme.colors.primary}80` }}
              thumbColor={showCompletedTasks ? theme.colors.primary : colors.textLight}
              testID="completed-tasks-switch"
            />
          </View>
        </View>
        
        {/* Help & Support Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Help & Support</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Help Center</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Shield size={20} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Info size={20} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>About</Text>
            </View>
            <ChevronRight size={18} color={colors.textLight} />
          </Pressable>
        </View>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            icon={<LogOut size={20} color={theme.colors.error} />}
            style={styles.logoutButton}
            textStyle={{ color: theme.colors.error }}
            testID="logout-button"
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textLight }]}>
            AchieveHub v1.0.0
          </Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: theme.typography.fontSizes.md,
    marginLeft: theme.spacing.md,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileTextContainer: {
    marginLeft: theme.spacing.md,
  },
  profileName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  profileUsername: {
    fontSize: theme.typography.fontSizes.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: theme.typography.fontSizes.md,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    marginTop: theme.spacing.sm,
  },
  versionContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  versionText: {
    fontSize: theme.typography.fontSizes.sm,
  },
});