import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Comment } from '@/types/comment';
import { theme } from '../constants/Theme';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
}

const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
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
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {comment.userProfileImage ? (
            <Image 
              source={{ uri: comment.userProfileImage }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {comment.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              @{comment.username}
            </Text>
            <Text style={[styles.time, { color: colors.textLight }]}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </Text>
          </View>
        </View>
        
        {onDelete && (
          <Pressable 
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </Pressable>
        )}
      </View>
      
      <Text style={[styles.commentText, { color: colors.text }]}>
        {comment.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
  },
  username: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  commentText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 22,
  },
});

export default CommentItem;