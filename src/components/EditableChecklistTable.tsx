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

const getCategoryIcon = (category: ChecklistCategory) => {
  switch (category) {
    case 'Critical':
      return '🔴';
    case 'Important':
      return '🟡';
    case 'Optional':
      return '🟢';
    default:
      return '⚪';
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
    <View style={styles.container}> 
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Setup Checklist</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        {!showAddForm && (
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.highlight }]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.headerButtonIcon}>+</Text>
            <Text style={[styles.headerButtonText, { color: colors.background }]}>Add Item</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.tableContainer, { backgroundColor: colors.surface, borderColor: 'rgba(0, 212, 212, 0.15)' }]}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: 'rgba(0, 212, 212, 0.1)' }]}>
            <Text style={[styles.headerCell, styles.itemColumn, { color: colors.text }]}>Item Name</Text>
            <Text style={[styles.headerCell, styles.descColumn, { color: colors.text }]}>Description</Text>
            <Text style={[styles.headerCell, styles.weightColumn, { color: colors.text }]}>Weight</Text>
            <Text style={[styles.headerCell, styles.categoryColumn, { color: colors.text }]}>Category</Text>
            <Text style={[styles.headerCell, styles.actionsColumn, { color: colors.text }]}>Actions</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.tableRow,
                { 
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 212, 212, 0.03)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.05)'
                }
              ]}
            >
              {editingId === item.id ? (
                <>
                  <View style={styles.itemColumn}>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                      value={editData.label}
                      onChangeText={(text) => setEditData({ ...editData, label: text })}
                      placeholder="Item name"
                      placeholderTextColor={colors.subtext}
                    />
                  </View>
                  <View style={styles.descColumn}>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                      value={editData.description}
                      onChangeText={(text) => setEditData({ ...editData, description: text })}
                      placeholder="Description"
                      placeholderTextColor={colors.subtext}
                    />
                  </View>
                  <View style={styles.weightColumn}>
                    <TextInput
                      style={[styles.input, styles.weightInput, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                      value={String(editData.weight)}
                      onChangeText={(text) => setEditData({ ...editData, weight: Number(text) })}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.subtext}
                    />
                  </View>
                  <View style={[styles.categoryColumn, styles.centerContent]}>
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
                        { backgroundColor: getCategoryColor(editData.category || 'Important', colors) }
                      ]}
                    >
                      <Text style={styles.categoryIcon}>{getCategoryIcon(editData.category || 'Important')}</Text>
                      <Text style={[styles.categoryText, { color: colors.background }]}>{editData.category}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.actionsColumn, styles.centerContent]}>
                    <TouchableOpacity 
                      onPress={handleSaveEdit} 
                      style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.profitEnd }]}
                    >
                      <Text style={styles.actionIcon}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setEditingId(null)} 
                      style={[styles.actionButton, styles.cancelButton, { backgroundColor: colors.neutral }]}
                    >
                      <Text style={[styles.actionIcon, { color: colors.text }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.itemColumn}>
                    <Text style={[styles.cellText, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <View style={styles.descColumn}>
                    <Text style={[styles.cellText, styles.descText, { color: colors.subtext }]}>{item.description || '—'}</Text>
                  </View>
                  <View style={[styles.weightColumn, styles.centerContent]}>
                    <View style={[styles.weightBadge, { backgroundColor: 'rgba(0, 212, 212, 0.15)' }]}>
                      <Text style={[styles.weightText, { color: colors.highlight }]}>{item.weight}</Text>
                    </View>
                  </View>
                  <View style={[styles.categoryColumn, styles.centerContent]}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(item.category, colors) }
                      ]}
                    >
                      <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
                      <Text style={[styles.categoryText, { color: colors.background }]}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={[styles.actionsColumn, styles.centerContent]}>
                    <TouchableOpacity 
                      onPress={() => handleEdit(item)} 
                      style={[styles.actionButton, { backgroundColor: 'rgba(0, 212, 212, 0.15)' }]}
                    >
                      <Text style={styles.actionIcon}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Delete Item',
                          `Are you sure you want to delete "${item.label}"?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => onDeleteItem(item.id) }
                          ]
                        );
                      }}
                      style={[styles.actionButton, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}
                    >
                      <Text style={[styles.actionIcon, { color: colors.lossEnd }]}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}

          {/* Add New Item Form */}
          {showAddForm && (
            <View style={[styles.tableRow, styles.addRow, { backgroundColor: 'rgba(0, 212, 212, 0.05)', borderBottomColor: colors.highlight }]}>
              <View style={styles.itemColumn}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                  placeholder="Item name"
                  value={newItem.label}
                  onChangeText={(text) => setNewItem({ ...newItem, label: text })}
                  placeholderTextColor={colors.subtext}
                />
              </View>
              <View style={styles.descColumn}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                  placeholder="Description (optional)"
                  value={newItem.description}
                  onChangeText={(text) => setNewItem({ ...newItem, description: text })}
                  placeholderTextColor={colors.subtext}
                />
              </View>
              <View style={styles.weightColumn}>
                <TextInput
                  style={[styles.input, styles.weightInput, { backgroundColor: colors.neutral, color: colors.text, borderColor: colors.highlight }]}
                  placeholder="Weight"
                  value={newItem.weight}
                  onChangeText={(text) => setNewItem({ ...newItem, weight: text })}
                  keyboardType="numeric"
                  placeholderTextColor={colors.subtext}
                />
              </View>
              <View style={[styles.categoryColumn, styles.centerContent]}>
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
                    { backgroundColor: getCategoryColor(newItem.category, colors) }
                  ]}
                >
                  <Text style={styles.categoryIcon}>{getCategoryIcon(newItem.category)}</Text>
                  <Text style={[styles.categoryText, { color: colors.background }]}>{newItem.category}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.actionsColumn, styles.centerContent]}>
                <TouchableOpacity 
                  onPress={handleAddItem} 
                  style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.profitEnd }]}
                >
                  <Text style={styles.actionIcon}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddForm(false);
                    setNewItem({ label: '', description: '', weight: '', category: 'Important' });
                  }}
                  style={[styles.actionButton, styles.cancelButton, { backgroundColor: colors.neutral }]}
                >
                  <Text style={[styles.actionIcon, { color: colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Empty State */}
          {items.length === 0 && !showAddForm && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Checklist Items</Text>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                Add items to create your trading setup checklist
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: 'rgba(0, 212, 212, 0.05)', borderColor: 'rgba(0, 212, 212, 0.15)' }]}>
        <Text style={[styles.legendTitle, { color: colors.subtext }]}>Categories:</Text>
        <View style={styles.legendItems}>
          {CATEGORIES.map((cat) => (
            <View key={cat} style={styles.legendItem}>
              <Text style={styles.legendIcon}>{getCategoryIcon(cat)}</Text>
              <Text style={[styles.legendText, { color: colors.text }]}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  headerButtonIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    minWidth: 800,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 212, 212, 0.3)',
  },
  headerCell: {
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  addRow: {
    borderBottomWidth: 2,
  },
  itemColumn: {
    width: 180,
    paddingRight: 12,
  },
  descColumn: {
    width: 240,
    paddingRight: 12,
  },
  weightColumn: {
    width: 100,
    paddingRight: 12,
  },
  categoryColumn: {
    width: 140,
    paddingRight: 12,
  },
  actionsColumn: {
    width: 120,
    flexDirection: 'row',
    gap: 8,
  },
  centerContent: {
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  input: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    borderWidth: 1,
  },
  weightInput: {
    textAlign: 'center',
  },
  weightBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weightText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    // Specific styles for save button
  },
  cancelButton: {
    // Specific styles for cancel button
  },
  actionIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIcon: {
    fontSize: 14,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});