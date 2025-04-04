import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  Platform
} from 'react-native';
import { theme } from '../constants/Theme';
import { useSettingsStore } from '@/store/settings-store';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  // Get colors based on theme
  const colors = activeTheme === 'dark' ? {
    primary: theme.colors.primaryLight,
    secondary: theme.colors.secondaryLight,
    text: theme.colors.textDark,
    border: theme.colors.borderDark,
  } : {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    text: theme.colors.text,
    border: theme.colors.border,
  };

  // Determine button styles based on variant and size
  const getButtonStyles = () => {
    let buttonStyle: ViewStyle = {};
    let textStyleObj: TextStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
        textStyleObj = { color: '#fff' };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
        textStyleObj = { color: '#fff' };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1,
        };
        textStyleObj = { color: colors.primary };
        break;
      case 'ghost':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
        textStyleObj = { color: colors.primary };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'sm':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
        };
        textStyleObj = {
          ...textStyleObj,
          fontSize: theme.typography.fontSizes.sm,
        };
        break;
      case 'md':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
        };
        textStyleObj = {
          ...textStyleObj,
          fontSize: theme.typography.fontSizes.md,
        };
        break;
      case 'lg':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
        };
        textStyleObj = {
          ...textStyleObj,
          fontSize: theme.typography.fontSizes.lg,
        };
        break;
    }
    
    // Disabled styles
    if (disabled || loading) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.6,
      };
    }
    
    return { buttonStyle, textStyleObj };
  };
  
  const { buttonStyle, textStyleObj } = getButtonStyles();
  
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#fff'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text 
            style={[
              styles.text, 
              textStyleObj, 
              icon && (iconPosition === 'left' ? styles.textWithLeftIcon : styles.textWithRightIcon),
              textStyle
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  text: {
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: theme.spacing.sm,
  },
  textWithRightIcon: {
    marginRight: theme.spacing.sm,
  },
});

export default Button;