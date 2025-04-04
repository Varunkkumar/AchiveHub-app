import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Achievement } from '@/types/achievement';
import { theme } from '../constants/Theme';
import { formatDate } from '@/utils/date-utils';
import { Award, Medal, Star, Flag, Pin, Heart, MessageCircle, Globe, Lock } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

interface AchievementCardProps {
  achievement: Achievement;
  onPress: () => void;
  onTogglePinned?: () => void;
  onToggleLike?: () => void;
  showSocialInfo?: boolean;
}

export const AchievementCard = ({ 
  achievement, 
  onPress, 
  onTogglePinned,
  onToggleLike,
  showSocialInfo = true
}: AchievementCardProps) => {
  const { user } = useAuthStore();
  
  const getIcon = () => {
    switch (achievement.type) {
      case 'award':
        return <Award size={24} color={achievement.color} />;
      case 'participation':
        return <Medal size={24} color={achievement.color} />;
      case 'completion':
        return <Flag size={24} color={achievement.color} />;
      case 'milestone':
      case 'personal':
      default:
        return <Star size={24} color={achievement.color} />;
    }
  };

  const isLiked = user ? achievement.likes.includes(user.id) : false;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${achievement.color}20` }]}>
          {getIcon()}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <View style={styles.metaContainer}>
            <View style={[styles.badge, { backgroundColor: `${achievement.color}20` }]}>
              <Text style={[styles.badgeText, { color: achievement.color }]}>
                {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
              </Text>
            </View>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {achievement.category}
              </Text>
            </View>
            
            <Text style={styles.date}>{formatDate(achievement.date)}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          {achievement.isPublic ? (
            <Globe size={16} color={theme.colors.textLight} />
          ) : (
            <Lock size={16} color={theme.colors.textLight} />
          )}
          
          {achievement.pinned && (
            <Pin size={16} color={theme.colors.secondary} style={styles.pinIcon} />
          )}
        </View>
      </View>
      
      {achievement.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {achievement.description}
        </Text>
      ) : null}
      
      {achievement.images && achievement.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: achievement.images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      
      {showSocialInfo && (
        <View style={styles.footer}>
          <Pressable 
            style={styles.socialAction}
            onPress={onToggleLike}
          >
            <Heart 
              size={18} 
              color={isLiked ? theme.colors.error : theme.colors.textLight} 
              fill={isLiked ? theme.colors.error : 'none'}
            />
            <Text style={styles.socialText}>
              {achievement.likes.length} {achievement.likes.length === 1 ? 'Like' : 'Likes'}
            </Text>
          </Pressable>
          
          <Pressable style={styles.socialAction}>
            <MessageCircle size={18} color={theme.colors.textLight} />
            <Text style={styles.socialText}>
              {achievement.comments.length} {achievement.comments.length === 1 ? 'Comment' : 'Comments'}
            </Text>
          </Pressable>
          
          {onTogglePinned && (
            <Pressable 
              style={styles.socialAction}
              onPress={onTogglePinned}
            >
              <Pin size={18} color={achievement.pinned ? theme.colors.secondary : theme.colors.textLight} />
              <Text style={styles.socialText}>
                {achievement.pinned ? 'Pinned' : 'Pin'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.textLight}10`,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  badgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textLight,
  },
  date: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  socialAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  socialText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
});

export default AchievementCard;