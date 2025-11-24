import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TradingAccount } from "./AccountDropdown";

interface AccountDetailsPanelProps {
  account: TradingAccount;
}

export default function AccountDetailsPanel({
  account,
}: AccountDetailsPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{account.name}</Text>
      <Text style={styles.label}>
        Starting Balance:{" "}
        <Text style={styles.value}>
          ${account.startingBalance.toLocaleString()}
        </Text>
      </Text>
      <Text style={styles.label}>
        Current Balance:{" "}
        <Text style={styles.value}>
          ${account.currentBalance.toLocaleString()}
        </Text>
      </Text>
      {/* Add deposit/withdrawal history, date, etc. here */}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#181c20",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#ccc",
  },
  value: {
    color: "#00d4d4",
    fontWeight: "700",
  },
});
