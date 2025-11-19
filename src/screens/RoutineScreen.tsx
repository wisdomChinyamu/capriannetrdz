import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../hooks/useAppContext';
import EditableChecklistTable from '../components/EditableChecklistTable';
import { ChecklistItem, ChecklistCategory } from '../types';

export default function RoutineScreen() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<ChecklistCategory>('Critical');

  const handleAddItem = (item: Omit<ChecklistItem, 'id' | 'createdAt'>) => {
    if (state.checklistTemplate) {
      // In real app, this would call Firebase service
      console.log('Add item:', item);
    }
  };

  const handleUpdateItem = (item: ChecklistItem) => {
    if (state.checklistTemplate) {
      dispatch({
        type: 'UPDATE_CHECKLIST_ITEM',
        payload: item,
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch({
      type: 'DELETE_CHECKLIST_ITEM',
      payload: itemId,
    });
  };

  const filteredItems = state.checklistTemplate?.items.filter(
    (item) => item.category === activeTab
  ) || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Trading Routine</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['Critical', 'Important', 'Optional'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.replace('-', '\n')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Checklist Table */}
      {state.checklistTemplate ? (
        <EditableChecklistTable
          items={filteredItems}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No checklist template set up yet</Text>
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
  title: {
    color: '#f5f5f5',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#00d4d4',
    borderColor: '#00d4d4',
  },
  tabText: {
    color: '#f5f5f5',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#0d0d0d',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});
