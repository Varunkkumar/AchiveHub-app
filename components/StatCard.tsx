import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/Theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = theme.colors.primary 
}: StatCardProps) => {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  iconContainer: {
    marginLeft: theme.spacing.md,
  },
});

export default StatCard;