import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Trade, Strategy } from "../types";
import { useTheme } from "./ThemeProvider";

interface Props {
  trades: Trade[];
  strategies?: Strategy[];
}

export default function StrategyWinRateList({ trades, strategies = [] }: Props) {
  const { colors } = useTheme();

  const byStrategy: Record<
    string,
    { id: string; name: string; trades: Trade[] }
  > = {};

  trades.forEach((t) => {
    const id = t.strategyId || "__unassigned";
    if (!byStrategy[id])
      byStrategy[id] = { id, name: "(Unassigned)", trades: [] } as any;
    byStrategy[id].trades.push(t);
  });

  // enrich with names
  Object.keys(byStrategy).forEach((id) => {
    const s = strategies.find((st) => st.id === id);
    if (s) byStrategy[id].name = s.name;
  });

  const items = Object.values(byStrategy)
    .map((b) => {
      const wins = b.trades.filter((t) => t.result === "Win").length;
      const total = b.trades.length;
      return {
        id: b.id,
        name: b.name,
        total,
        wins,
        winRate: total > 0 ? (wins / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.winRate - a.winRate);

  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { borderColor: "rgba(0,212,212,0.1)", backgroundColor: "#1a1a1a" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Strategy Win Rate</Text>
        <Text style={[styles.sub, { color: colors.subtext }]}>By strategy</Text>
      </View>
      <View style={styles.list}>
        {items.map((it) => (
          <View key={it.id} style={styles.row}>
            <View style={styles.left}>
              <Text style={[styles.name, { color: colors.text }]}>{it.name}</Text>
              <Text style={[styles.meta, { color: colors.subtext }]}>
                {it.wins}/{it.total} wins
              </Text>
            </View>
            <View style={styles.right}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.min(it.winRate,100)}%`, backgroundColor: it.winRate>=50?"#4caf50":"#f44336" }]} />
              </View>
              <Text style={[styles.rate, { color: colors.text }]}>{it.winRate.toFixed(0)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  header: { marginBottom: 8 },
  title: { fontWeight: "800", fontSize: 16 },
  sub: { fontSize: 12 },
  list: { gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  left: {},
  right: { width: 140, alignItems: "flex-end" },
  name: { fontWeight: "700", fontSize: 14 },
  meta: { fontSize: 12 },
  barTrack: { width: 120, height: 8, backgroundColor: "#222", borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  barFill: { height: "100%", borderRadius: 4 },
  rate: { fontWeight: "700", fontSize: 13 },
});
