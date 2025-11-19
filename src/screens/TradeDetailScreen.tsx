import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TradeDetailScreen({ route }: any) {
  const trade = route?.params?.trade;

  if (!trade) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trade not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.pair}>{trade.pair}</Text>
        <Text
          style={[
            styles.result,
            trade.result === 'Win' && styles.resultWin,
            trade.result === 'Loss' && styles.resultLoss,
          ]}
        >
          {trade.result || 'Pending'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Direction:</Text>
          <Text style={styles.value}>{trade.direction}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Session:</Text>
          <Text style={styles.value}>{trade.session}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Setup Type:</Text>
          <Text style={styles.value}>{trade.setupType}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Entry:</Text>
          <Text style={styles.value}>{trade.entryPrice}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stop Loss:</Text>
          <Text style={styles.value}>{trade.stopLoss}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Take Profit:</Text>
          <Text style={styles.value}>{trade.takeProfit}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Risk:Reward:</Text>
          <Text style={styles.value}>1:{trade.riskToReward.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Grade:</Text>
          <Text style={styles.value}>{trade.grade}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Confluence Score:</Text>
          <Text style={styles.value}>{trade.confluenceScore.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Emotional Rating:</Text>
          <Text style={styles.value}>{trade.emotionalRating}/10</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rule Deviation:</Text>
          <Text style={styles.value}>{trade.ruleDeviation ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      {trade.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{trade.notes}</Text>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00d4d4',
  },
  pair: {
    color: '#f5f5f5',
    fontSize: 24,
    fontWeight: '700',
  },
  result: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#0d0d0d',
  },
  resultWin: {
    backgroundColor: '#4caf50',
  },
  resultLoss: {
    backgroundColor: '#f44336',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00d4d4',
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    color: '#00d4d4',
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: '#f5f5f5',
    fontSize: 12,
    fontWeight: '600',
  },
  notes: {
    color: '#f5f5f5',
    fontSize: 12,
    lineHeight: 18,
  },
});
