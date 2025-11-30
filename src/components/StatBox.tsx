import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from './ThemeProvider';

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  highlight?: boolean;
}

export default function StatBox({ 
  label, 
  value, 
  unit, 
  color,
  icon,
  trend,
  size = 'medium',
  highlight = false,
}: StatBoxProps) {
  const { colors } = useTheme();
  const bgColor = colors.card ?? colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.subtext;
  const accentColor = color ?? colors.highlight;

  // Trend indicators
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'neutral':
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.profitEnd;
      case 'down':
        return colors.lossEnd;
      default:
        return colors.subtext;
    }
  };

  // Size configurations
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: 70,
          valueSize: 20,
          labelSize: 11,
          unitSize: 11,
        };
      case 'large':
        return {
          minHeight: 100,
          valueSize: 32,
          labelSize: 13,
          unitSize: 14,
        };
      default:
        return {
          minHeight: 85,
          valueSize: 26,
          labelSize: 12,
          unitSize: 12,
        };
    }
  };

  const sizeConfig = getSizeStyles();

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: bgColor,
          minHeight: sizeConfig.minHeight,
          borderWidth: highlight ? 2 : 0,
          borderColor: highlight ? `${accentColor}40` : 'transparent',
          shadowColor: highlight ? accentColor : '#000',
          shadowOffset: { width: 0, height: highlight ? 6 : 3 },
          shadowOpacity: highlight ? 0.25 : 0.1,
          shadowRadius: highlight ? 12 : 6,
        },
      ]}
    >
      {/* Header with label and optional icon */}
      <View style={styles.header}>
        <Text
          style={[
            styles.label,
            {
              color: secondaryTextColor,
              fontSize: sizeConfig.labelSize,
            },
          ]}
        >
          {label.toUpperCase()}
        </Text>
        {icon && (
          <Text style={[styles.icon, { color: accentColor }]}>{icon}</Text>
        )}
      </View>

      {/* Value section */}
      <View style={styles.valueContainer}>
        <View style={styles.valueRow}>
          <Text
            style={[
              styles.value,
              {
                color: accentColor,
                fontSize: sizeConfig.valueSize,
                fontWeight: '900',
              },
            ]}
          >
            {value}
          </Text>
          {unit && (
            <Text
              style={[
                styles.unit,
                {
                  color: secondaryTextColor,
                  fontSize: sizeConfig.unitSize,
                },
              ]}
            >
              {unit}
            </Text>
          )}
        </View>

        {/* Trend indicator */}
        {trend && (
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: `${getTrendColor()}20` },
            ]}
          >
            <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
              {getTrendIcon()}
            </Text>
          </View>
        )}
      </View>

      {/* Decorative accent line */}
      {highlight && (
        <View
          style={[
            styles.accentLine,
            {
              backgroundColor: accentColor,
              opacity: 0.6,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 16,
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    fontSize: 18,
    opacity: 0.8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flex: 1,
  },
  value: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});