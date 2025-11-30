import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
} from "react-native";

export interface TradingAccount {
  id: string;
  name: string;
  startingBalance: number;
  currentBalance: number;
}

interface AccountModalProps {
  visible: boolean;
  accounts: TradingAccount[];
  selectedAccountId: string;
  onSelect: (id: string) => void;
  onAddAccount: () => void;
  onClose: () => void;
}

export default function AccountModal({
  visible,
  accounts,
  selectedAccountId,
  onSelect,
  onAddAccount,
  onClose,
}: AccountModalProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Select Trading Account</Text>
              <Text style={styles.subtitle}>{accounts.length} accounts available</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Accounts List */}
          <ScrollView
            style={styles.accountsList}
            showsVerticalScrollIndicator={false}
          >
            {accounts.map((account) => {
              const isSelected = selectedAccountId === account.id;
              const balanceChange = account.currentBalance - account.startingBalance;
              const changePercentage = ((balanceChange / account.startingBalance) * 100).toFixed(2);
              const isProfit = balanceChange >= 0;

              return (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountCard,
                    isSelected && styles.accountCardSelected,
                  ]}
                  onPress={() => {
                    onSelect(account.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.accountCardHeader}>
                    <View style={styles.accountCardLeft}>
                      <View style={[
                        styles.accountAvatar,
                        isSelected && { backgroundColor: '#00d4d4' }
                      ]}>
                        <Text style={styles.accountAvatarText}>
                          {account.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.accountInfo}>
                        <Text style={[
                          styles.accountName,
                          isSelected && styles.accountNameSelected
                        ]}>
                          {account.name}
                        </Text>
                        <Text style={styles.accountId}>ID: {account.id}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.accountCardBody}>
                    <View style={styles.balanceRow}>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={[
                          styles.balanceValue,
                          isSelected && { color: '#00d4d4' }
                        ]}>
                          ${account.currentBalance.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceLabel}>Starting</Text>
                        <Text style={styles.balanceValueSecondary}>
                          ${account.startingBalance.toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    <View style={[
                      styles.performanceBadge,
                      { backgroundColor: isProfit ? '#4caf5020' : '#f4433620' }
                    ]}>
                      <Text style={[
                        styles.performanceText,
                        { color: isProfit ? '#4caf50' : '#f44336' }
                      ]}>
                        {isProfit ? '↑' : '↓'} {isProfit ? '+' : ''}{changePercentage}% ({isProfit ? '+' : ''}${balanceChange.toLocaleString()})
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Account Card */}
            <TouchableOpacity
              style={styles.addAccountCard}
              onPress={() => {
                onAddAccount();
                onClose();
              }}
            >
              <View style={styles.addAccountIcon}>
                <Text style={styles.addAccountIconText}>+</Text>
              </View>
              <View style={styles.addAccountInfo}>
                <Text style={styles.addAccountTitle}>Create New Account</Text>
                <Text style={styles.addAccountSubtitle}>
                  Add a demo or live trading account
                </Text>
              </View>
              <Text style={styles.addAccountArrow}>→</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={onClose}>
              <Text style={styles.footerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#0d0d0d",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(0, 212, 212, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#aaa",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },
  accountsList: {
    padding: 16,
  },
  accountCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  accountCardSelected: {
    borderColor: "#00d4d4",
    backgroundColor: "rgba(0, 212, 212, 0.05)",
  },
  accountCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  accountCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  accountAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  accountNameSelected: {
    color: "#00d4d4",
  },
  accountId: {
    fontSize: 11,
    color: "#666",
    fontFamily: "monospace",
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00d4d4",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadgeText: {
    color: "#0d0d0d",
    fontSize: 14,
    fontWeight: "700",
  },
  accountCardBody: {
    gap: 10,
  },
  balanceRow: {
    flexDirection: "row",
    gap: 16,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  balanceValueSecondary: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  performanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  performanceText: {
    fontSize: 12,
    fontWeight: "700",
  },
  addAccountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#00d4d4",
    borderStyle: "dashed",
  },
  addAccountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#00d4d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addAccountIconText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0d0d0d",
  },
  addAccountInfo: {
    flex: 1,
  },
  addAccountTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00d4d4",
    marginBottom: 2,
  },
  addAccountSubtitle: {
    fontSize: 12,
    color: "#aaa",
  },
  addAccountArrow: {
    fontSize: 20,
    color: "#00d4d4",
    fontWeight: "700",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  footerButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});