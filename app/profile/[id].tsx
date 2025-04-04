import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useAchievementStore } from '@/store/achievement-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import AchievementCard from '@/components/AchievementCard';
import Button from '@/components/Button';
import { Edit2, Award, UserCheck, MapPin, Briefcase, Calendar } from 'lucide-react-native';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { achievements, toggleLike } = useAchievementStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  // Mock users for demo purposes
  const mockUsers = [
    {
      id: '1',
      username: 'johndoe',
      email: 'john@example.com',
      name: 'John Doe',
      bio: 'Software Engineer passionate about mobile development',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      profession: 'Software Engineer',
      skills: ['React Native', 'JavaScript', 'TypeScript'],
      connections: ['2'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'janedoe',
      email: 'jane@example.com',
      name: 'Jane Doe',
      bio: 'UX Designer with 5 years of experience',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      profession: 'UX Designer',
      skills: ['UI/UX', 'Figma', 'User Research'],
      connections: ['1'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'mikebrown',
      email: 'mike@example.com',
      name: 'Mike Brown',
      bio: 'Product Manager at Tech Co.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      profession: 'Product Manager',
      skills: ['Product Strategy', 'Agile', 'Market Research'],
      connections: [],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    }
  ];
  
  const profileUser = mockUsers.find(u => u.id === id) || currentUser;
  
  if (!profileUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: activeTheme === 'dark' ? '#111827' : theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>User not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </SafeAreaView>
    );
  }
  
  const isOwnProfile = currentUser?.id === profileUser.id;
  const isConnected = currentUser?.connections.includes(profileUser.id);
  
  // Get user's public achievements
  const userAchievements = achievements
    .filter(a => a.userId === profileUser.id && (a.isPublic || isOwnProfile))
    .sort((a, b) => {
      // Pinned first, then by date
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
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
      <Stack.Screen 
        options={{
          title: profileUser.name,
          headerRight: () => (
            isOwnProfile ? (
              <Button
                title="Edit"
                variant="ghost"
                size="small"
                icon={<Edit2 size={18} color={theme.colors.primary} />}
                onPress={() => router.push('/profile/edit')}
                style={styles.headerButton}
                textStyle={{ display: 'none' }}
              />
            ) : null
          )
        }}
      />
      
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content}>
          <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
            <View style={styles.profileImageContainer}>
              {profileUser.profileImage ? (
                <Image 
                  source={{ uri: profileUser.profileImage }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.profileImagePlaceholderText}>
                    {profileUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{profileUser.name}</Text>
              <Text style={[styles.profileUsername, { color: colors.textLight }]}>@{profileUser.username}</Text>
              
              {profileUser.profession && (
                <View style={styles.professionContainer}>
                  <Briefcase size={16} color={colors.textLight} />
                  <Text style={[styles.professionText, { color: colors.text }]}>
                    {profileUser.profession}
                  </Text>
                </View>
              )}
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{userAchievements.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>Achievements</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{profileUser.connections.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.textLight }]}>Connections</Text>
                </View>
              </View>
            </View>
          </View>
          
          {profileUser.bio && (
            <View style={[styles.bioSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.bioText, { color: colors.text }]}>{profileUser.bio}</Text>
            </View>
          )}
          
          {!isOwnProfile && (
            <View style={styles.actionSection}>
              <Button
                title={isConnected ? "Connected" : "Connect"}
                variant={isConnected ? "outline" : "primary"}
                icon={<UserCheck size={20} color={isConnected ? theme.colors.primary : "#fff"} />}
                style={styles.actionButton}
              />
            </View>
          )}
          
          {profileUser.skills && profileUser.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {profileUser.skills.map((skill, index) => (
                  <View 
                    key={index} 
                    style={[styles.skillChip, { backgroundColor: `${theme.colors.primary}20` }]}
                  >
                    <Text style={[styles.skillText, { color: theme.colors.primary }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.achievementsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
            
            {userAchievements.length === 0 ? (
              <Text style={[styles.noAchievementsText, { color: colors.textLight }]}>
                {isOwnProfile 
                  ? "You haven't added any achievements yet." 
                  : "This user hasn't shared any achievements yet."}
              </Text>
            ) : (
              userAchievements.map(achievement => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  onPress={() => router.push(`/achievements/${achievement.id}`)}
                  onToggleLike={() => currentUser && toggleLike(achievement.id, currentUser.id)}
                  showSocialInfo={true}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: theme.spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  profileUsername: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.sm,
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  professionText: {
    fontSize: theme.typography.fontSizes.md,
    marginLeft: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  statItem: {
    marginRight: theme.spacing.xl,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
  },
  bioSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
  },
  bioText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 24,
  },
  actionSection: {
    padding: theme.spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
  skillsSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  skillText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  achievementsSection: {
    padding: theme.spacing.lg,
  },
  noAchievementsText: {
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
    fontSize: theme.typography.fontSizes.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  button: {
    alignSelf: 'center',
  },
});