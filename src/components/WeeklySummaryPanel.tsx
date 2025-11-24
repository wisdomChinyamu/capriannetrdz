import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "./ThemeProvider";
import { Trade } from "../types";

interface WeeklySummaryPanelProps {
  trades: Trade[];
}

function getWeekRanges(
  year: number,
  month: number
): { start: Date; end: Date }[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: { start: Date; end: Date }[] = [];
  let day = 1;
  while (day <= daysInMonth) {
    const start = new Date(year, month, day);
    const end = new Date(year, month, Math.min(day + 6, daysInMonth));
    weeks.push({ start, end });
    day += 7;
  }
  return weeks;
}

export default function WeeklySummaryPanel({
  trades,
}: WeeklySummaryPanelProps) {
  const { colors } = useTheme();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const weekRanges = getWeekRanges(year, month);

  // Group trades by week
        const weeklyStats = weekRanges.map((range, idx) => {
          const tradesInWeek = trades.filter((t) => {
            const d = new Date(t.createdAt);
            return d >= range.start && d <= range.end;
          });
          // Calculate PnL based on result field
          const totalPnL = tradesInWeek.reduce((sum, t) => {
            if (t.result === 'Win') return sum + 1;
            if (t.result === 'Loss') return sum - 1;
            return sum;
          }, 0);
          return {
            week: idx + 1,
            days: tradesInWeek.length,
            totalPnL,
          };
        });

  return (
    <View style={styles.panel}>
      <Text style={[styles.title, { color: colors.text }]}>Weekly Summary</Text>
      {weeklyStats.map((w) => (
        <View
          key={w.week}
          style={[
            styles.weekBox,
            {
              backgroundColor:
                w.totalPnL > 0
                  ? colors.profitEnd
                  : w.totalPnL < 0
                  ? colors.lossEnd
                  : colors.neutral,
            },
          ]}
        >
          <Text style={[styles.weekLabel, { color: colors.text }]}>
            Week {w.week}
          </Text>
          <Text style={[styles.weekPnL, { color: colors.text }]}>
            {w.totalPnL >= 0
              ? `$${w.totalPnL.toLocaleString()}`
              : `-$${Math.abs(w.totalPnL).toLocaleString()}`}
          </Text>
          <Text style={[styles.weekDays, { color: colors.subtext }]}>
            {w.days} days
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 12,
    minWidth: 180,
    maxWidth: 260,
    borderRadius: 12,
    backgroundColor: "#181c20",
    marginLeft: Platform.OS === "web" ? 24 : 0,
    marginTop: Platform.OS !== "web" ? 16 : 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  weekBox: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  weekLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  weekPnL: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  weekDays: {
    fontSize: 12,
    fontWeight: "500",
  },
});
