import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { ChecklistItem, ChecklistCategory } from '../types';
import { useTheme } from './ThemeProvider';

interface EditableChecklistTableProps {
  items: ChecklistItem[];
  onAddItem: (item: Omit<ChecklistItem, 'id' | 'createdAt'>) => void;
  onUpdateItem: (item: ChecklistItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const CATEGORIES: ChecklistCategory[] = ['Critical', 'Important', 'Optional'];

const getCategoryColor = (category: ChecklistCategory, colors: any) => {
  switch (category) {
    case 'Critical':
      return colors.lossEnd;
    case 'Important':
      return colors.highlight;
    case 'Optional':
      return colors.profitEnd;
    default:
      return colors.neutral;
  }
};

export default function EditableChecklistTable({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: EditableChecklistTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ChecklistItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    label: '',
    description: '',
    weight: '',
    category: 'Important' as ChecklistCategory,
  });
  const { colors } = useTheme();

  const handleEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editData.label || !editData.weight) {
      Alert.alert('Validation Error', 'Label and weight are required');
      return;
    }
    onUpdateItem({
      id: editingId,
      label: editData.label,
      description: editData.description || '',
      weight: Number(editData.weight),
      category: editData.category || 'Important',
      createdAt: new Date(),
    });
    setEditingId(null);
    setEditData({});
  };

  const handleAddItem = () => {
    if (!newItem.label || !newItem.weight) {
      Alert.alert('Validation Error', 'Label and weight are required');
      return;
    }
    onAddItem({
      label: newItem.label,
      description: newItem.description,
      weight: Number(newItem.weight),
      category: newItem.category,
    });
    setNewItem({ label: '', description: '', weight: '', category: 'Important' });
    setShowAddForm(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.tableContainer, { backgroundColor: colors.card ?? colors.surface, borderColor: colors.highlight }]}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: colors.highlight }]}>
            <Text style={[styles.headerCell, { width: 120, color: colors.background }]}>Item</Text>
            <Text style={[styles.headerCell, { width: 150, color: colors.background }]}>Description</Text>
            <Text style={[styles.headerCell, { width: 80, color: colors.background }]}>Weight</Text>
            <Text style={[styles.headerCell, { width: 100, color: colors.background }]}>Category</Text>
            <Text style={[styles.headerCell, { width: 80, color: colors.background }]}>Actions</Text>
          </View>

          {/* Table Rows */}
          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={[styles.cell, { width: 120 }]}
                    value={editData.label}
                    onChangeText={(text) => setEditData({ ...editData, label: text })}
                    placeholderTextColor={colors.subtext}
                  />
                  <TextInput
                    style={[styles.cell, { width: 150 }]}
                    value={editData.description}
                    onChangeText={(text) => setEditData({ ...editData, description: text })}
                    placeholderTextColor={colors.subtext}
                  />
                  <TextInput
                    style={[styles.cell, { width: 80 }]}
                    value={String(editData.weight)}
                    onChangeText={(text) => setEditData({ ...editData, weight: Number(text) })}
                    keyboardType="numeric"
                    placeholderTextColor={colors.subtext}
                  />
                  <View style={[styles.cell, { width: 100, justifyContent: 'center' }]}>
                    <TouchableOpacity
                      onPress={() => {
                        const nextCategory =
                          CATEGORIES[
                            (CATEGORIES.indexOf(editData.category || 'Important') + 1) %
                              CATEGORIES.length
                          ];
                        setEditData({ ...editData, category: nextCategory });
                      }}
                      style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryColor(editData.category || 'Important', colors) },
                        ]}
                      >
                        <Text style={[styles.categoryText, { color: colors.background }]}>{editData.category}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.cell, { width: 80, flexDirection: 'row', gap: 5 }]}>
                    <TouchableOpacity onPress={handleSaveEdit} style={[styles.actionButton, { backgroundColor: colors.highlight }]}>
                      <Text style={[styles.actionText, { color: colors.background }]}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditingId(null)} style={[styles.actionButton, { backgroundColor: colors.neutral }]}>
                      <Text style={[styles.actionText, { color: colors.text }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.cell, { width: 120, color: colors.text }]}>{item.label}</Text>
                  <Text style={[styles.cell, { width: 150, color: colors.text }]}>{item.description}</Text>
                  <Text style={[styles.cell, { width: 80, color: colors.text }]}>{item.weight}</Text>
                  <View style={[styles.cell, { width: 100, justifyContent: 'center' }]}>
                    <View
                      style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryColor(item.category, colors) },
                        ]}
                      >
                        <Text style={[styles.categoryText, { color: colors.background }]}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={[styles.cell, { width: 80, flexDirection: 'row', gap: 5 }]}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                      <Text style={styles.actionText}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onDeleteItem(item.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}

          {/* Add New Item Form */}
          {showAddForm && (
            <View style={styles.tableRow}>
              <TextInput
                style={[styles.cell, { width: 120 }]}
                placeholder="Item name"
                value={newItem.label}
                onChangeText={(text) => setNewItem({ ...newItem, label: text })}
                placeholderTextColor={colors.subtext}
              />
              <TextInput
                style={[styles.cell, { width: 150 }]}
                placeholder="Description"
                value={newItem.description}
                onChangeText={(text) => setNewItem({ ...newItem, description: text })}
                placeholderTextColor={colors.subtext}
              />
              <TextInput
                style={[styles.cell, { width: 80 }]}
                placeholder="Weight"
                value={newItem.weight}
                onChangeText={(text) => setNewItem({ ...newItem, weight: text })}
                keyboardType="numeric"
                placeholderTextColor={colors.subtext}
              />
              <View style={[styles.cell, { width: 100, justifyContent: 'center' }]}>
                <TouchableOpacity
                  onPress={() => {
                    const nextCategory =
                      CATEGORIES[
                        (CATEGORIES.indexOf(newItem.category) + 1) % CATEGORIES.length
                      ];
                    setNewItem({ ...newItem, category: nextCategory });
                  }}
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(newItem.category, colors) },
                  ]}
                >
                  <Text style={styles.categoryText}>{newItem.category}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.cell, { width: 80, flexDirection: 'row', gap: 5 }]}>
                <TouchableOpacity onPress={handleAddItem} style={styles.actionButton}>
                  <Text style={styles.actionText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddForm(false);
                    setNewItem({ label: '', description: '', weight: '', category: 'Important' });
                  }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Item Button */}
      {!showAddForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add Checklist Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  cell: {
    paddingHorizontal: 8,
    fontSize: 12,
    height: 40,
    justifyContent: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
});
