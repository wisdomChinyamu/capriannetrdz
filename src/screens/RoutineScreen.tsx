import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { useAppContext } from '../hooks/useAppContext';
import { useTheme } from '../components/ThemeProvider';
import EditableChecklistTable from '../components/EditableChecklistTable';
import { ChecklistItem, ChecklistCategory } from '../types';

// Tab configuration with icons and descriptions
const tabConfig: Record<ChecklistCategory, { 
  icon: string; 
  color: string;
  description: string;
}> = {
  Critical: {
    icon: '🔴',
    color: '#ef5350',
    description: 'Must-check items before execution',
  },
  Important: {
    icon: '🟡',
    color: '#ffa726',
    description: 'High-priority validation points',
  },
  Optional: {
    icon: '🔵',
    color: '#42a5f5',
    description: 'Additional confirmation factors',
  },
};

export default function RoutineScreen() {
  const { colors } = useTheme();
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

  const activeConfig = tabConfig[activeTab];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Trading Routine
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Systematic execution checklist
          </Text>
        </View>
        <View style={[styles.headerBadge, { backgroundColor: `${colors.highlight}20` }]}>
          <Text style={[styles.headerBadgeText, { color: colors.highlight }]}>
            ✅
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        {state.checklistTemplate && (
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.highlight }]}>
                {state.checklistTemplate.items.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Total Items
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.neutral }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tabConfig.Critical.color }]}>
                {state.checklistTemplate.items.filter(i => i.category === 'Critical').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Critical
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.neutral }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tabConfig.Important.color }]}>
                {state.checklistTemplate.items.filter(i => i.category === 'Important').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Important
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.neutral }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tabConfig.Optional.color }]}>
                {state.checklistTemplate.items.filter(i => i.category === 'Optional').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Optional
              </Text>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {(['Critical', 'Important', 'Optional'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const config = tabConfig[tab];
            const itemCount = state.checklistTemplate?.items.filter(
              i => i.category === tab
            ).length || 0;

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive 
                      ? `${config.color}20`
                      : colors.surface,
                    borderColor: isActive ? config.color : `${colors.text}20`,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text style={styles.tabIcon}>{config.icon}</Text>
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive ? config.color : colors.text,
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                  {itemCount > 0 && (
                    <View
                      style={[
                        styles.countBadge,
                        {
                          backgroundColor: isActive 
                            ? config.color 
                            : colors.neutral,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.countText,
                          { color: isActive ? '#fff' : colors.text },
                        ]}
                      >
                        {itemCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Tab Description */}
        <View
          style={[
            styles.descriptionCard,
            {
              backgroundColor: `${activeConfig.color}10`,
              borderLeftColor: activeConfig.color,
              borderLeftWidth: 4,
            },
          ]}
        >
          <Text style={[styles.descriptionText, { color: colors.text }]}>
            {activeConfig.icon} {activeConfig.description}
          </Text>
        </View>

        {/* Checklist Content */}
        {state.checklistTemplate ? (
          filteredItems.length > 0 ? (
            <View style={[styles.checklistContainer, { backgroundColor: colors.card }]}>
              <View style={styles.checklistHeader}>
                <Text style={[styles.checklistTitle, { color: colors.text }]}>
                  {activeTab} Checklist
                </Text>
                <View style={[styles.itemCountBadge, { backgroundColor: `${activeConfig.color}20` }]}>
                  <Text style={[styles.itemCountText, { color: activeConfig.color }]}>
                    {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </View>
              <EditableChecklistTable
                items={filteredItems}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyIcon, { color: colors.subtext }]}>
                {activeConfig.icon}
              </Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No {activeTab} Items
              </Text>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                Add items to your {activeTab.toLowerCase()} checklist to ensure
                consistent trade execution
              </Text>
            </View>
          )
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyIcon, { color: colors.subtext }]}>
              📋
            </Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Checklist Template
            </Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              Create your first checklist template in Settings to get started
            </Text>
          </View>
        )}

        {/* Trading Phases Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            🎯 Trading Execution Phases
          </Text>
          <View style={styles.phasesList}>
            <View style={styles.phase}>
              <View style={[styles.phaseNumber, { backgroundColor: `${colors.highlight}20` }]}>
                <Text style={[styles.phaseNumberText, { color: colors.highlight }]}>
                  1
                </Text>
              </View>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.text }]}>
                  Pre-Market Analysis
                </Text>
                <Text style={[styles.phaseText, { color: colors.subtext }]}>
                  Directional bias, liquidity marking, sentiment check
                </Text>
              </View>
            </View>
            <View style={styles.phase}>
              <View style={[styles.phaseNumber, { backgroundColor: `${colors.highlight}20` }]}>
                <Text style={[styles.phaseNumberText, { color: colors.highlight }]}>
                  2
                </Text>
              </View>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.text }]}>
                  Execution Validation
                </Text>
                <Text style={[styles.phaseText, { color: colors.subtext }]}>
                  Check all critical items before entry confirmation
                </Text>
              </View>
            </View>
            <View style={styles.phase}>
              <View style={[styles.phaseNumber, { backgroundColor: `${colors.highlight}20` }]}>
                <Text style={[styles.phaseNumberText, { color: colors.highlight }]}>
                  3
                </Text>
              </View>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.text }]}>
                  Post-Trade Review
                </Text>
                <Text style={[styles.phaseText, { color: colors.subtext }]}>
                  Document outcome, emotions, and lessons learned
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: 28,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    opacity: 0.3,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabContent: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  descriptionCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  checklistContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  itemCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  itemCountText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 56,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  phasesList: {
    gap: 16,
  },
  phase: {
    flexDirection: 'row',
    gap: 14,
  },
  phaseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseNumberText: {
    fontSize: 16,
    fontWeight: '900',
  },
  phaseContent: {
    flex: 1,
    gap: 4,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});