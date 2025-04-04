import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/Theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar = ({
  progress,
  height = 8,
  color = theme.colors.primary,
  backgroundColor = theme.colors.border,
  showPercentage = false,
  label,
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height, backgroundColor }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  progressContainer: {
    width: '100%',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  percentage: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
});

export default ProgressBar;