import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trade } from '../types';
import { useTheme } from './ThemeProvider';

interface TradeCardProps {
  trade: Trade;
  onPress?: () => void;
}

export default function TradeCard({ trade, onPress }: TradeCardProps) {
  const { colors } = useTheme();
  const resultColor = trade.result === 'Win' ? colors.profitEnd : trade.result === 'Loss' ? colors.lossEnd : colors.breakEven;
  const bgColor = colors.card ?? colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.subtext;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.pairSection}>
          <Text style={[styles.pair, { color: textColor }]}>{trade.pair}</Text>
          <Text style={[styles.direction, { color: secondaryTextColor }]}>
            {trade.direction}
          </Text>
        </View>
        <View
          style={[
            styles.resultBadge,
            {
              backgroundColor: resultColor,
              opacity: 0.2,
            },
          ]}
        >
          <Text style={[styles.resultText, { color: resultColor }]}>
            {trade.result || 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>R:R</Text>
            <Text style={[styles.value, { color: textColor }]}>{trade.riskToReward.toFixed(2)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Score</Text>
            <Text style={[styles.value, { color: textColor }]}>{trade.confluenceScore}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Grade</Text>
            <Text style={[styles.value, { color: textColor }]}>{trade.grade}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.setup, { color: secondaryTextColor }]}>
            {trade.setupType}
          </Text>
          <Text style={[styles.date, { color: secondaryTextColor }]}>
            {trade.createdAt.toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pairSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pair: {
    fontSize: 16,
    fontWeight: '700',
  },
  direction: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  setup: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
  },
});
