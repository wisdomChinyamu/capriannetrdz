import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export default function StatBox({ label, value, unit, color }: StatBoxProps) {
  const { colors } = useTheme();
  const bgColor = colors.card ?? colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.subtext;
  const accent = color ?? colors.highlight;

  return (
    <View style={[styles.box, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color: secondaryTextColor }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: accent }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: secondaryTextColor }]}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    padding: 14,
    flex: 1,
    minHeight: 80,
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
});
