import { colors } from './colour';
import { Platform } from 'react-native';

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto_medium',
        semibold: 'Roboto_medium',
        bold: 'Roboto_bold',
      },
      default: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
      },
    }),
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

// Helper function to get theme colors based on mode
export const getThemeColors = (mode: 'light' | 'dark') => {
  return {
    background: mode === 'dark' ? colors.backgroundDark : colors.background,
    card: mode === 'dark' ? colors.cardDark : colors.card,
    text: mode === 'dark' ? colors.textDark : colors.text,
    textLight: mode === 'dark' ? colors.textLightDark : colors.textLight,
    border: mode === 'dark' ? colors.borderDark : colors.border,
    primary: mode === 'dark' ? colors.primaryLight : colors.primary,
    secondary: mode === 'dark' ? colors.secondaryLight : colors.secondary,
  };
};