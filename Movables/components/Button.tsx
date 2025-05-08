import React from 'react';
import { Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  backgroundColor?: string;
  label: string;
  onPress: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
  customStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Button = ({
  backgroundColor,
  label,
  onPress,
  width,
  height,
  disabled = false,
  customStyle,
  labelStyle,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        backgroundColor && { backgroundColor },
        width !== undefined && width > 0 ? { width } : undefined,
        height !== undefined && height > 0 ? { height } : undefined,
        customStyle,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    height: 50,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9EB7B8',
  },
  label: {
    fontSize: 17,
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
