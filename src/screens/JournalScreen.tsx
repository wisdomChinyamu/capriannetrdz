import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../hooks/useAppContext';

export default function JournalScreen({ navigation }: any) {
  const { state } = useAppContext();
  const [filterPair, setFilterPair] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const filteredTrades = state.trades.filter((trade) => {
    if (filterPair && !trade.pair.includes(filterPair)) return false;
    if (filterResult && trade.result !== filterResult) return false;
    return true;
  });

  const renderTradeCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.tradeCard}
      onPress={() => navigation.navigate('Journal', { screen: 'TradeDetail', params: { trade: item } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.pair}>{item.pair}</Text>
        <Text
          style={[
            styles.result,
            item.result === 'Win' && styles.resultWin,
            item.result === 'Loss' && styles.resultLoss,
          ]}
        >
          {item.result || 'Pending'}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detail}>{item.direction} | {item.session}</Text>
        <Text style={styles.detail}>R:R 1:{item.riskToReward.toFixed(2)}</Text>
        <Text style={styles.detail}>Grade: {item.grade}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter by pair..."
          placeholderTextColor="#666"
          value={filterPair}
          onChangeText={setFilterPair}
        />
        <View style={styles.resultFilterGroup}>
          {['Win', 'Loss', 'Break-even', 'All'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.filterButton,
                (filterResult === (r === 'All' ? '' : r)) && styles.filterButtonActive,
              ]}
              onPress={() => setFilterResult(r === 'All' ? '' : r)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  (filterResult === (r === 'All' ? '' : r)) && styles.filterButtonTextActive,
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTrades}
        keyExtractor={(item) => item.id}
        renderItem={renderTradeCard}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00d4d4',
    borderRadius: 8,
    color: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
  },
  resultFilterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#00d4d4',
    borderColor: '#00d4d4',
  },
  filterButtonText: {
    color: '#f5f5f5',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#0d0d0d',
  },
  listContent: {
    paddingBottom: 20,
  },
  tradeCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00d4d4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pair: {
    color: '#f5f5f5',
    fontSize: 16,
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
  cardBody: {
    gap: 4,
  },
  detail: {
    color: '#00d4d4',
    fontSize: 12,
  },
});
