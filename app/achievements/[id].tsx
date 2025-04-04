import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAchievementStore } from '@/store/achievement-store';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import Button from '@/components/Button';
import { formatDate } from '@/utils/date-utils';
import { Award, Medal, Star, Flag, Pin, Heart, MessageCircle, Globe, Lock, Trash2 } from 'lucide-react-native';

export default function AchievementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { achievements, togglePinned, toggleLike, deleteAchievement } = useAchievementStore();
  const { user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const achievement = achievements.find(a => a.id === id);
  
  if (!achievement) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Achievement not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }
  
  const isOwner = user && achievement.userId === user.id;
  const isLiked = user && achievement.likes.includes(user.id);
  
  const handleDelete = () => {
    deleteAchievement(achievement.id);
    router.back();
  };
  
  const handleTogglePinned = () => {
    togglePinned(achievement.id);
  };
  
  const handleToggleLike = () => {
    if (user) {
      toggleLike(achievement.id, user.id);
    }
  };
  
  // Get colors based on theme
  const themeColors = activeTheme === 'dark' ? {
    background: theme.colors.backgroundDark,
    card: theme.colors.cardDark,
    border: theme.colors.borderDark,
    text: theme.colors.textDark,
    textLight: theme.colors.textLightDark,
  } : {
    background: theme.colors.background,
    card: theme.colors.card,
    border: theme.colors.border,
    text: theme.colors.text,
    textLight: theme.colors.textLight,
  };
  
  return (
    <>
      <Stack.Screen options={{ title: achievement.title }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.content}>
          {achievement.image && (
            <Image 
              source={{ uri: achievement.image }} 
              style={styles.image} 
              resizeMode="cover"
            />
          )}
          
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: themeColors.text }]}>{achievement.title}</Text>
                <Text style={[styles.date, { color: themeColors.textLight }]}>
                  {formatDate(achievement.date)}
                </Text>
              </View>
              
              <View style={styles.actions}>
                <Pressable onPress={handleTogglePinned} style={styles.actionButton}>
                  <Pin 
                    size={20} 
                    color={achievement.pinned ? theme.colors.primary : themeColors.textLight} 
                    fill={achievement.pinned ? theme.colors.primary : 'none'} 
                  />
                </Pressable>
                
                <Pressable onPress={handleToggleLike} style={styles.actionButton}>
                  <Heart 
                    size={20} 
                    color={isLiked ? theme.colors.error : themeColors.textLight} 
                    fill={isLiked ? theme.colors.error : 'none'} 
                  />
                </Pressable>
                
                {achievement.isPublic ? (
                  <Globe size={20} color={themeColors.textLight} />
                ) : (
                  <Lock size={20} color={themeColors.textLight} />
                )}
              </View>
            </View>
            
            <Text style={[styles.description, { color: themeColors.text }]}>
              {achievement.description}
            </Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                {achievement.type === 'award' && <Award size={16} color={themeColors.textLight} />}
                {achievement.type === 'participation' && <Medal size={16} color={themeColors.textLight} />}
                {achievement.type === 'completion' && <Flag size={16} color={themeColors.textLight} />}
                {achievement.type === 'milestone' && <Star size={16} color={themeColors.textLight} />}
                {achievement.type === 'personal' && <Star size={16} color={themeColors.textLight} />}
                <Text style={[styles.metaText, { color: themeColors.textLight }]}>
                  {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <MessageCircle size={16} color={themeColors.textLight} />
                <Text style={[styles.metaText, { color: themeColors.textLight }]}>
                  {achievement.likes.length} likes
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {isOwner && (
          <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
            <Button
              title="Edit"
              onPress={() => router.push(`/achievements/edit/${achievement.id}`)}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              variant="danger"
              style={styles.footerButton}
            />
          </View>
        )}
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
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: 200,
  },
  card: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSizes.sm,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.lineHeights.normal,
    marginBottom: theme.spacing.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  metaText: {
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
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