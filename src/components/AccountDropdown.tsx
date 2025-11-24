import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

export interface TradingAccount {
  id: string;
  name: string;
  startingBalance: number;
  currentBalance: number;
}

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
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account:</Text>
      <View style={styles.dropdown}>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.item,
              selectedAccountId === account.id && styles.selectedItem,
            ]}
            onPress={() => onSelect(account.id)}
          >
            <Text style={styles.itemText}>
              {account.name} (${account.currentBalance.toLocaleString()})
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={onAddAccount}>
          <Text style={styles.addText}>+ Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "700",
    marginRight: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#222",
  },
  selectedItem: {
    backgroundColor: "#00d4d4",
  },
  itemText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#444",
    marginLeft: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
  },
});
