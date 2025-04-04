import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { theme } from '../constants/Theme';
import { Award, Pin, Heart, Share2 } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description?: string;
    date: string;
    type: string;
    image?: string;
    pinned: boolean;
    likes: string[];
  };
  onPress: () => void;
  onTogglePinned: () => void;
  onToggleLike: () => void;
}

export default function AchievementCard({
  achievement,
  onPress,
  onTogglePinned,
  onToggleLike,
}: AchievementCardProps) {
  const { user } = useAuthStore();
  const isLiked = user ? achievement.likes.includes(user.id) : false;
  
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
    >
      {achievement.image && (
        <Image 
          source={{ uri: achievement.image }}
          style={styles.image}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Award size={20} color={theme.colors.primary} />
            <Text style={styles.title}>{achievement.title}</Text>
          </View>
          
          <Pressable
            style={[
              styles.iconButton,
              achievement.pinned && styles.activeIconButton
            ]}
            onPress={onTogglePinned}
          >
            <Pin 
              size={18} 
              color={achievement.pinned ? '#fff' : theme.colors.textLight} 
            />
          </Pressable>
        </View>
        
        {achievement.description && (
          <Text style={styles.description}>{achievement.description}</Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(achievement.date).toLocaleDateString()}
          </Text>
          
          <View style={styles.actions}>
            <Pressable
              style={[
                styles.iconButton,
                isLiked && styles.activeIconButton
              ]}
              onPress={onToggleLike}
            >
              <Heart 
                size={18} 
                color={isLiked ? '#fff' : theme.colors.textLight} 
              />
            </Pressable>
            
            <Pressable style={styles.iconButton}>
              <Share2 size={18} color={theme.colors.textLight} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  activeIconButton: {
    backgroundColor: theme.colors.primary,
  },
}); 