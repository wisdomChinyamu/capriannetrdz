import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../hooks/useAppContext';
import EditableChecklistTable from '../components/EditableChecklistTable';
import { ChecklistItem } from '../types';

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();

  const handleAddItem = (item: Omit<ChecklistItem, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_CHECKLIST_ITEM',
      payload: { ...item, id: `item-${Date.now()}`, createdAt: new Date() },
    });
  };

  const handleUpdateItem = (item: ChecklistItem) => {
    dispatch({
      type: 'UPDATE_CHECKLIST_ITEM',
      payload: item,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch({
      type: 'DELETE_CHECKLIST_ITEM',
      payload: itemId,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      {/* Checklist Template Editor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Edit Checklist Template</Text>
        <Text style={styles.sectionDescription}>
          Customize your SMC-based confluence checklist. Items are organized by category.
        </Text>

        {state.checklistTemplate ? (
          <EditableChecklistTable
            items={state.checklistTemplate.items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ) : (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              // In real app, this would initialize a new checklist
              console.log('Create new checklist');
            }}
          >
            <Text style={styles.createButtonText}>+ Create Default Checklist</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Theme Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Text style={styles.settingValue}>Active</Text>
        </TouchableOpacity>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Manage Firebase Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Export Data (CSV/PDF)</Text>
        </TouchableOpacity>
      </View>

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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#00d4d4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#0d0d0d',
    fontWeight: '700',
    fontSize: 14,
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00d4d4',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  settingValue: {
    color: '#00d4d4',
    fontSize: 12,
    fontWeight: '600',
  },
});
