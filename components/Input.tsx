
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme';

interface CustomInputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  icon?: string;
  onIconPress?: () => void;
  isDark?: boolean;
}

export const Input: React.FC<CustomInputProps> = ({ 
  label, 
  icon, 
  onIconPress, 
  isDark = true,
  style,
  ...props 
}) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.slate800 : COLORS.surfaceLight;
  const borderColor = isDark ? COLORS.slate800 : COLORS.slate200;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: isDark ? COLORS.slate200 : COLORS.slate800 }]}>
          {label}
        </Text>
      )}
      <View style={[styles.inputContainer, { backgroundColor: bgColor, borderColor: borderColor }]}>
        <TextInput
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={COLORS.slate400}
          {...props}
        />
        {icon && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
            <Icon name={icon} size={20} color={COLORS.slate400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    minHeight: 40,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 4,
  }
});
