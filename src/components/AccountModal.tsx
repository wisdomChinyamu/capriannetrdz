import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
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
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Trading Account</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.item,
              selectedAccountId === account.id && styles.selectedItem,
            ]}
            onPress={() => {
              onSelect(account.id);
              onClose();
            }}
          >
            <Text style={styles.itemText}>
              {account.name} (${account.currentBalance.toLocaleString()})
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={onAddAccount}>
          <Text style={styles.addText}>+ Add Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181c20",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 24,
    color: "#fff",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#222",
    marginBottom: 12,
  },
  selectedItem: {
    backgroundColor: "#00d4d4",
  },
  itemText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#444",
    marginBottom: 24,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
  },
});
