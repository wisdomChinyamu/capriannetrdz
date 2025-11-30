import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from './ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: number;
}

export default function Card({ 
  children, 
  style, 
  shadow = true,
  variant = 'default',
  padding 
}: CardProps) {
  const { colors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
          ...styles.shadowElevated,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.highlight,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(0, 212, 212, 0.15)',
        };
    }
  };

  return (
    <View 
      style={[
        styles.card,
        getVariantStyle(),
        shadow && variant !== 'flat' && styles.shadow,
        padding !== undefined && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  shadowElevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#00d4d4',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0, 212, 212, 0.2)',
      },
    }),
  },
});