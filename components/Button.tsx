
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress,
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  style,
  disabled
}) => {
  
  const getBackgroundColor = () => {
    if (disabled) return COLORS.slate400;
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'ghost': return 'transparent';
      case 'outline': return 'transparent';
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'ghost' || variant === 'outline') return COLORS.slate500;
    return '#FFFFFF';
  };

  const getBorder = () => {
    if (variant === 'outline') return { borderWidth: 1, borderColor: COLORS.slate200 };
    return {};
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={isLoading || disabled}
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          width: fullWidth ? '100%' : 'auto',
          ...getBorder()
        },
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  }
});
