import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { TradingAccount } from "../types"; // Import from main types file instead of defining locally
import { useTheme } from "./ThemeProvider";

interface AccountDropdownProps {
  accounts: TradingAccount[];
  selectedAccountId: string;
  onSelect: (id: string) => void;
  onAddAccount: () => void;
}

export default function AccountDropdown({
  accounts,
  selectedAccountId,
  onSelect,
  onAddAccount,
}: AccountDropdownProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectedAccount =
    selectedAccountId === "all"
      ? {
          id: "all",
          name: "All Accounts",
          currentBalance: accounts.reduce(
            (s, a) => s + Number(a.currentBalance || 0),
            0
          ),
        }
      : accounts.find((acc) => acc.id === selectedAccountId);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trading Account</Text>

      {/* Selected Account Display */}
      <TouchableOpacity
        style={[
          styles.selectedButton,
          isOpen && styles.selectedButtonOpen,
          { backgroundColor: colors.surface, borderColor: colors.neutral },
        ]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.selectedContent}>
          <View style={styles.accountIcon}>
            <Text style={styles.accountIconText}>💼</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, { color: colors.text }]}>
              {selectedAccount?.name || "Select Account"}
            </Text>
            <Text style={[styles.accountBalance, { color: colors.subtext }]}>
              ${Number(selectedAccount?.currentBalance || 0).toLocaleString()}
            </Text>
          </View>
        </View>
        <Animated.Text
          style={[
            styles.chevron,
            { transform: [{ rotate: rotation }], color: colors.subtext },
          ]}
        >
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {isOpen && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: colors.surface, borderColor: colors.highlight },
          ]}
        >
          <ScrollView
            style={styles.dropdownScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* All Accounts option */}
            <TouchableOpacity
              key="all"
              style={[
                styles.dropdownItem,
                selectedAccountId === "all" && styles.dropdownItemSelected,
                selectedAccountId === "all" && {
                  backgroundColor: `${colors.highlight}20`,
                },
              ]}
              onPress={() => {
                onSelect("all");
                setIsOpen(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownItemContent}>
                <View style={styles.dropdownItemLeft}>
                  <View
                    style={[
                      styles.dropdownAvatar,
                      { backgroundColor: colors.neutral },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownAvatarText,
                        { color: colors.text },
                      ]}
                    >
                      A
                    </Text>
                  </View>
                  <View style={styles.dropdownInfo}>
                    <Text
                      style={[styles.dropdownItemName, { color: colors.text }]}
                    >
                      All Accounts
                    </Text>
                    <Text
                      style={[styles.dropdownItemId, { color: colors.subtext }]}
                    >
                      Combined
                    </Text>
                  </View>
                </View>
                <View style={styles.dropdownItemRight}>
                  <Text
                    style={[styles.dropdownItemBalance, { color: colors.text }]}
                  >
                    $
                    {accounts
                      .reduce((s, a) => s + Number(a.currentBalance || 0), 0)
                      .toLocaleString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {accounts.map((account) => {
              const isSelected = selectedAccountId === account.id;
              const balanceChange =
                account.currentBalance - account.startingBalance;
              const isProfit = balanceChange >= 0;

              return (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(account.id);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownItemContent}>
                    <View style={styles.dropdownItemLeft}>
                      <View
                        style={[
                          styles.dropdownAvatar,
                          isSelected
                            ? { backgroundColor: colors.highlight }
                            : { backgroundColor: colors.neutral },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dropdownAvatarText,
                            {
                              color: isSelected ? colors.surface : colors.text,
                            },
                          ]}
                        >
                          {account.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.dropdownInfo}>
                        <Text
                          style={[
                            styles.dropdownItemName,
                            isSelected && { color: colors.highlight },
                            { color: colors.text },
                          ]}
                        >
                          {account.name}
                        </Text>
                        <Text
                          style={[
                            styles.dropdownItemId,
                            { color: colors.subtext },
                          ]}
                        >
                          ID: {account.id}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dropdownItemRight}>
                      <Text
                        style={[
                          styles.dropdownItemBalance,
                          isSelected && { color: colors.highlight },
                          { color: colors.text },
                        ]}
                      >
                        ${account.currentBalance.toLocaleString()}
                      </Text>
                      <View
                        style={[
                          styles.changeIndicator,
                          {
                            backgroundColor: isProfit
                              ? "#4caf5020"
                              : "#f4433620",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.changeText,
                            { color: isProfit ? "#4caf50" : "#f44336" },
                          ]}
                        >
                          {isProfit ? "↑" : "↓"} $
                          {Math.abs(balanceChange).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Add Account Button */}
            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={() => {
                onAddAccount();
                setIsOpen(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.addAccountIcon}>
                <Text style={styles.addAccountIconText}>+</Text>
              </View>
              <View style={styles.addAccountTextContainer}>
                <Text style={styles.addAccountText}>Add New Account</Text>
                <Text style={styles.addAccountSubtext}>
                  Create demo or live account
                </Text>
              </View>
              <Text style={styles.addAccountArrow}>→</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative",
    zIndex: 1000,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#aaa",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Platform.OS === "web" ? "#f2f2f2" : "#e9e9e9",
    borderRadius: 10,
    padding: 14,
    borderWidth: 0,
  },
  selectedButtonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "transparent",
  },
  selectedContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d6d6d6",
    justifyContent: "center",
    alignItems: "center",
  },
  accountIconText: {
    fontSize: 20,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0d0d0d",
    marginBottom: 2,
  },
  accountBalance: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  chevron: {
    fontSize: 12,
    color: "#444",
    fontWeight: "700",
  },
  dropdown: {
    backgroundColor: "#1a1a1a",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#00d4d4",
    maxHeight: 320,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
      },
    }),
  },
  dropdownScroll: {
    maxHeight: 320,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    position: "relative",
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(0, 212, 212, 0.1)",
  },
  dropdownItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 30,
  },
  dropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  dropdownItemNameSelected: {
    color: "#00d4d4",
  },
  dropdownItemId: {
    fontSize: 10,
    color: "#666",
  },
  dropdownItemRight: {
    alignItems: "flex-end",
  },
  dropdownItemBalance: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  dropdownItemBalanceSelected: {
    color: "#00d4d4",
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#00d4d4",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#0d0d0d",
    fontSize: 12,
    fontWeight: "700",
  },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderTopWidth: 2,
    borderTopColor: "rgba(0, 212, 212, 0.3)",
    backgroundColor: "rgba(0, 212, 212, 0.05)",
  },
  addAccountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00d4d4",
    justifyContent: "center",
    alignItems: "center",
  },
  addAccountIconText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0d0d0d",
  },
  addAccountTextContainer: {
    flex: 1,
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00d4d4",
    marginBottom: 2,
  },
  addAccountSubtext: {
    fontSize: 11,
    color: "#666",
  },
  addAccountArrow: {
    fontSize: 18,
    color: "#00d4d4",
    fontWeight: "700",
  },
});
