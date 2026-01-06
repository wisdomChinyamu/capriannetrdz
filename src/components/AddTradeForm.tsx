import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Trade, ChecklistItem, Strategy, TradingAccount } from "../types";
import { ThemeMode } from "../theme/theme";
import ImageUploader from "./ImageUploader";
import ConfirmModal from "./ConfirmModal";
import { useTheme } from "./ThemeProvider";
import AccountDropdown from "./AccountDropdown";
import { useAppContext } from "../hooks/useAppContext";

type LabeledScreenshot = { uri: string; label?: string };

interface AddTradeFormProps {
  onSubmit: (trade: Omit<Trade, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
  theme?: ThemeMode;
  checklistItems?: ChecklistItem[];
  onChecklistItemToggle?: (itemId: string) => void;
  selectedChecklistItems?: string[];
  strategies?: Strategy[];
  selectedStrategyId?: string | null;
  onStrategySelect?: (strategyId: string) => void;
  confluenceScore?: number | null;
  accounts?: TradingAccount[]; // Add accounts prop
  selectedAccountId?: string; // Add selectedAccountId prop
  onAccountSelect?: (accountId: string) => void; // Add onAccountSelect prop
  onAddAccount?: () => void;
  confirmBeforeSave?: boolean;
}

export default function AddTradeForm({
  onSubmit,
  onClose,
  checklistItems = [],
  onChecklistItemToggle,
  selectedChecklistItems = [],
  strategies = [],
  selectedStrategyId = null,
  onStrategySelect,
  confluenceScore = null,
  accounts = [], // Add accounts prop
  selectedAccountId, // Add selectedAccountId prop
  onAccountSelect, // Add onAccountSelect prop
  onAddAccount,
  confirmBeforeSave = false,
}: AddTradeFormProps) {
  const { state } = useAppContext();
  const [pair, setPair] = React.useState("GBPUSD");
  const [direction, setDirection] = React.useState<"Buy" | "Sell">("Buy");
  const [session, setSession] = React.useState<"London" | "NY" | "Asia">(
    "London"
  );
  const [entryPrice, setEntryPrice] = React.useState("");
  const [stopLoss, setStopLoss] = React.useState("");
  const [takeProfit, setTakeProfit] = React.useState("");
  const [actualExit, setActualExit] = React.useState("");
  const [riskAmount, setRiskAmount] = React.useState("");
  const [riskPercentage, setRiskPercentage] = React.useState("");
  const [riskInputMode, setRiskInputMode] = React.useState<
    "percentage" | "amount"
  >("percentage");
  const [result, setResult] = React.useState<
    "Win" | "Loss" | "Break-even" | undefined
  >();
  const [emotionalRating, setEmotionalRating] = React.useState(5);
  const [ruleDeviation, setRuleDeviation] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [screenshots, setScreenshots] = React.useState<LabeledScreenshot[]>([]);
  const [tradeDate, setTradeDate] = React.useState<Date>(new Date());
  const [tradeTimeText, setTradeTimeText] = React.useState<string>("");
  const [tradeDateDigits, setTradeDateDigits] = React.useState<string>("");
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [dateInputSupported, setDateInputSupported] = React.useState(true);
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedDay, setSelectedDay] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      try {
        const input = document.createElement("input");
        input.setAttribute("type", "date");
        setDateInputSupported(input.type === "date");
      } catch (e) {
        setDateInputSupported(false);
      }
    }
  }, []);

  React.useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const y = selectedYear;
      const m = selectedMonth;
      const d = selectedDay;
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed.getTime())) {
        setTradeDate(parsed);
        setTradeDateDigits(`${y}${m}${d}`);
      }
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // Helpers for web dropdowns
  const webToday = typeof window !== "undefined" ? new Date() : new Date();
  const webCurrentYear = webToday.getFullYear();
  const years = Array.from({ length: webCurrentYear - 1900 + 1 }, (_, i) =>
    (1900 + i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const days = (() => {
    const y = selectedYear ? parseInt(selectedYear, 10) : webCurrentYear;
    const m = selectedMonth ? parseInt(selectedMonth, 10) : 1;
    const max = daysInMonth(y, m);
    return Array.from({ length: max }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  })();

  const { colors } = useTheme();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingTrade, setPendingTrade] = React.useState<any | null>(null);

  const calculateRR = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return 0;

    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    // Validate numeric inputs
    if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return 0;

    // Prefer actualExit when provided
    if (actualExit) {
      const ax = parseFloat(actualExit);
      if (!isNaN(ax)) {
        const stopDistance = Math.abs(entry - sl);
        if (stopDistance > 0) {
          const exitDistance = Math.abs(ax - entry);
          return Number((exitDistance / stopDistance).toFixed(2));
        }
      }
    }

    // Calculate risk and reward
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);

    // Avoid division by zero
    return risk > 0 ? Number((reward / risk).toFixed(2)) : 0;
  };

  const rr = calculateRR();

  const handleSubmit = async () => {
    if (!entryPrice || !stopLoss || !takeProfit) {
      Alert.alert("Error", "Please fill in all price fields");
      return;
    }

    // Check if user is authenticated
    if (!state.user) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    // Validate numeric inputs
    const entryPriceNum = parseFloat(entryPrice);
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit);
    const riskAmountNum = riskAmount ? parseFloat(riskAmount) : undefined;

    if (isNaN(entryPriceNum) || isNaN(stopLossNum) || isNaN(takeProfitNum)) {
      Alert.alert("Error", "Please enter valid numbers for price fields");
      return;
    }

    if (riskAmountNum !== undefined && isNaN(riskAmountNum)) {
      Alert.alert("Error", "Please enter a valid number for risk amount");
      return;
    }

    // Calculate grade based on confluence score
    let grade: "A+" | "A" | "B" | "C" | "D" = "D";
    if (confluenceScore !== null) {
      if (confluenceScore >= 90) grade = "A+";
      else if (confluenceScore >= 80) grade = "A";
      else if (confluenceScore >= 70) grade = "B";
      else if (confluenceScore >= 60) grade = "C";
    }

    try {
      // Build trade timestamp combining date + time text (if provided). If user left blank, default to now.
      let tradeTimestamp: Date;
      // Prefer manually entered date digits (web fallback)
      if (tradeDateDigits) {
        if (tradeDateDigits.length < 8) {
          Alert.alert(
            "Incomplete date",
            "Please complete the date as YYYY-MM-DD before continuing."
          );
          return;
        }
        const y = tradeDateDigits.slice(0, 4);
        const m = tradeDateDigits.slice(4, 6);
        const d = tradeDateDigits.slice(6, 8);
        const parsed = new Date(`${y}-${m}-${d}`);
        if (!isNaN(parsed.getTime())) tradeTimestamp = parsed;
        else {
          Alert.alert(
            "Invalid date",
            "Please enter a valid date in YYYY-MM-DD format."
          );
          return;
        }
      } else {
        tradeTimestamp = new Date(tradeDate || new Date());
      }

      // Enforce allowed date range: min 1900-01-01, max today
      const today = new Date();
      const minDate = new Date("1900-01-01");
      if (tradeTimestamp > today) {
        Alert.alert("Invalid date", "Date cannot be in the future.");
        return;
      }
      if (tradeTimestamp < minDate) {
        Alert.alert("Invalid date", "Date cannot be before 1900-01-01.");
        return;
      }

      try {
        if (tradeTimeText && tradeTimeText.includes(":")) {
          const [hh, mm] = tradeTimeText.split(":").map((s) => parseInt(s, 10));
          if (!isNaN(hh) && !isNaN(mm)) {
            tradeTimestamp.setHours(hh, mm, 0, 0);
          }
        }
      } catch (e) {
        // keep default tradeDate if parsing fails
      }
      const tradeData = {
        userId: state.user.uid,
        pair,
        direction,
        session,
        entryPrice: entryPriceNum,
        stopLoss: stopLossNum,
        takeProfit: takeProfitNum,
        result,
        riskToReward: rr,
        confluenceScore: confluenceScore || 0,
        grade,
        setupType: selectedStrategyId
          ? strategies.find((s) => s.id === selectedStrategyId)?.name || "SMC"
          : "SMC",
        emotionalRating,
        ruleDeviation,
        screenshots,
        notes,
        ...(selectedStrategyId && { strategyId: selectedStrategyId }),
        ...(selectedChecklistItems.length > 0 && {
          checklist: selectedChecklistItems,
        }),
        ...(riskAmountNum !== undefined && { riskAmount: riskAmountNum }),
        ...(selectedAccountId && { accountId: selectedAccountId }),
        ...(actualExit !== "" && { actualExit: parseFloat(actualExit) }),
        tradeTime: tradeTimestamp,
      };

      if (confirmBeforeSave) {
        setPendingTrade(tradeData);
        setShowConfirmation(true);
        return;
      }

      await onSubmit(tradeData);

      onClose();
    } catch (error: any) {
      console.error("Error submitting trade:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit trade. Please try again."
      );
    }
  };

  const confirmAndSaveTrade = async () => {
    if (!pendingTrade) return;
    try {
      await onSubmit(pendingTrade);
      setShowConfirmation(false);
      setPendingTrade(null);
      onClose();
    } catch (err: any) {
      console.error("Error saving trade from confirmation:", err);
      Alert.alert("Error", err?.message || "Failed to save trade.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Add New Trade
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtext }]}>
                Record your setup
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Live R:R Display */}
          {entryPrice && stopLoss && takeProfit ? (
            <View
              style={[
                styles.rrHero,
                { borderColor: rr >= 2 ? colors.profitEnd : colors.highlight },
              ]}
            >
              <Text style={[styles.rrLabel, { color: colors.subtext }]}>
                Risk:Reward
              </Text>
              <Text
                style={[
                  styles.rrValue,
                  { color: rr >= 2 ? colors.profitEnd : colors.highlight },
                ]}
              >
                {`1:${rr.toFixed(2)}`}
              </Text>
              <View
                style={[
                  styles.rrBadge,
                  {
                    backgroundColor:
                      rr >= 3
                        ? "#4caf5020"
                        : rr >= 2
                        ? "#4caf5020"
                        : "#00d4d420",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rrBadgeText,
                    { color: rr >= 2 ? colors.profitEnd : colors.highlight },
                  ]}
                >
                  {rr >= 3 ? "🔥 Excellent" : rr >= 2 ? "✓ Good" : "⚠️ Fair"}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Confluence Score Display */}
          {confluenceScore !== null && (
            <View
              style={[
                styles.confluenceCard,
                { backgroundColor: colors.neutral },
              ]}
            >
              <Text style={[styles.confluenceLabel, { color: colors.subtext }]}>
                Confluence Score
              </Text>
              <Text
                style={[styles.confluenceValue, { color: colors.highlight }]}
              >
                {confluenceScore.toFixed(0)}%
              </Text>
              <View style={styles.confluenceIndicator}>
                <View
                  style={[
                    styles.confluenceBar,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.confluenceFill,
                      {
                        width: `${confluenceScore}%`,
                        backgroundColor:
                          confluenceScore >= 80
                            ? colors.profitEnd
                            : confluenceScore >= 60
                            ? colors.highlight
                            : confluenceScore >= 40
                            ? "#ffa500"
                            : colors.lossEnd,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Account Selection - Add this new section */}
          {accounts.length > 0 && onAccountSelect && (
            <AccountDropdown
              accounts={accounts}
              selectedAccountId={selectedAccountId || accounts[0]?.id || ""}
              onSelect={onAccountSelect}
              onAddAccount={onAddAccount || (() => {})}
            />
          )}
          {/* Pair Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Currency Pair
            </Text>
            <View style={styles.pairInput}>
              <Text style={styles.pairIcon}>💱</Text>
              <TextInput
                style={[styles.pairTextInput, { color: colors.text }]}
                value={pair}
                onChangeText={setPair}
                placeholder="GBPUSD"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>

          {/* Direction */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Direction
            </Text>
            <View style={styles.directionButtons}>
              {(["Buy", "Sell"] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.directionButton,
                    direction === d &&
                      d === "Buy" && {
                        backgroundColor: colors.profitEnd,
                        borderColor: colors.profitEnd,
                      },
                    direction === d &&
                      d === "Sell" && {
                        backgroundColor: colors.lossEnd,
                        borderColor: colors.lossEnd,
                      },
                    direction !== d && { borderColor: colors.neutral },
                  ]}
                  onPress={() => setDirection(d)}
                >
                  <Text style={styles.directionIcon}>
                    {d === "Buy" ? "↑" : "↓"}
                  </Text>
                  <Text
                    style={[
                      styles.directionText,
                      { color: direction === d ? "#fff" : colors.text },
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Session */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trading Session
            </Text>
            <View style={styles.sessionButtons}>
              {(["London", "NY", "Asia"] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.sessionButton,
                    {
                      borderColor:
                        session === s ? colors.highlight : colors.neutral,
                    },
                    session === s && {
                      backgroundColor: `${colors.highlight}20`,
                    },
                  ]}
                  onPress={() => setSession(s)}
                >
                  <Text style={styles.sessionEmoji}>
                    {s === "London" ? "🇬🇧" : s === "NY" ? "🇺🇸" : "🌏"}
                  </Text>
                  <Text
                    style={[
                      styles.sessionText,
                      { color: session === s ? colors.highlight : colors.text },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Strategy Selection */}
          {strategies.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Strategy Template
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.strategyGroup}>
                  {strategies.map((strategy) => (
                    <TouchableOpacity
                      key={strategy.id}
                      style={[
                        styles.strategyCard,
                        selectedStrategyId === strategy.id &&
                          styles.strategyCardActive,
                        { backgroundColor: colors.neutral },
                      ]}
                      onPress={() =>
                        onStrategySelect && onStrategySelect(strategy.id)
                      }
                    >
                      <View style={styles.strategyIcon}>
                        <Text style={styles.strategyIconText}>📋</Text>
                      </View>
                      <Text
                        style={[
                          styles.strategyName,
                          selectedStrategyId === strategy.id && {
                            color: colors.highlight,
                          },
                          { color: colors.text },
                        ]}
                      >
                        {strategy.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Price Inputs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Price Levels
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceIcon}>📍</Text>
              <View style={styles.priceInputGroup}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  Entry
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.neutral, color: colors.text },
                  ]}
                  placeholder="0.00000"
                  placeholderTextColor={colors.subtext}
                  value={entryPrice}
                  onChangeText={(text) => {
                    // Allow only numeric input with decimal point
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setEntryPrice(text);
                    }
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceIcon}>🛑</Text>
              <View style={styles.priceInputGroup}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  Stop Loss
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.neutral, color: colors.text },
                  ]}
                  placeholder="0.00000"
                  placeholderTextColor={colors.subtext}
                  value={stopLoss}
                  onChangeText={(text) => {
                    // Allow only numeric input with decimal point
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setStopLoss(text);
                    }
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceIcon}>🎯</Text>
              <View style={styles.priceInputGroup}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  Take Profit
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.neutral, color: colors.text },
                  ]}
                  placeholder="0.00000"
                  placeholderTextColor={colors.subtext}
                  value={takeProfit}
                  onChangeText={(text) => {
                    // Allow only numeric input with decimal point
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setTakeProfit(text);
                    }
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceIcon}>✓</Text>
              <View style={styles.priceInputGroup}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  Actual Exit (optional)
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.neutral, color: colors.text },
                  ]}
                  placeholder="0.00000"
                  placeholderTextColor={colors.subtext}
                  value={actualExit}
                  onChangeText={(text) => {
                    if (text === "" || /^\d*\.?\d*$/.test(text)) {
                      setActualExit(text);
                    }
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceIcon}>💰</Text>
              <View style={styles.priceInputGroup}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  Risk Amount
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}
                    >
                      <TouchableOpacity
                        onPress={() => setRiskInputMode("percentage")}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor:
                            riskInputMode === "percentage"
                              ? colors.highlight
                              : colors.neutral,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              riskInputMode === "percentage"
                                ? "#0d0d0d"
                                : colors.text,
                          }}
                        >
                          % Percent
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setRiskInputMode("amount")}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor:
                            riskInputMode === "amount"
                              ? colors.highlight
                              : colors.neutral,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              riskInputMode === "amount"
                                ? "#0d0d0d"
                                : colors.text,
                          }}
                        >
                          $ Amount
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {riskInputMode === "percentage" ? (
                      <View style={styles.priceInput}>
                        <TextInput
                          style={{ color: colors.text, flex: 1 }}
                          placeholder="0.00"
                          placeholderTextColor={colors.subtext}
                          value={riskPercentage}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9.]/g, "");
                            if (cleaned === "") {
                              setRiskPercentage("");
                              setRiskAmount("");
                              return;
                            }
                            if (!/^\d*\.?\d*$/.test(cleaned)) return;
                            setRiskPercentage(cleaned);
                            // compute risk amount based on selected account
                            const acc =
                              accounts.find(
                                (a) => a.id === selectedAccountId
                              ) || accounts[0];
                            const base = acc
                              ? Number(
                                  acc.currentBalance || acc.startingBalance || 0
                                )
                              : 0;
                            const pct = parseFloat(cleaned) || 0;
                            if (base > 0) {
                              const amt = (base * pct) / 100;
                              setRiskAmount(String(parseFloat(amt.toFixed(2))));
                            }
                          }}
                          keyboardType="decimal-pad"
                        />
                        <Text style={{ color: colors.subtext, marginLeft: 8 }}>
                          %
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.priceInput}>
                        <TextInput
                          style={{ color: colors.text, flex: 1 }}
                          placeholder="0.00"
                          placeholderTextColor={colors.subtext}
                          value={riskAmount}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9.]/g, "");
                            if (cleaned === "") {
                              setRiskAmount("");
                              setRiskPercentage("");
                              return;
                            }
                            if (!/^\d*\.?\d*$/.test(cleaned)) return;
                            setRiskAmount(cleaned);
                            const acc =
                              accounts.find(
                                (a) => a.id === selectedAccountId
                              ) || accounts[0];
                            const base = acc
                              ? Number(
                                  acc.currentBalance || acc.startingBalance || 0
                                )
                              : 0;
                            const amt = parseFloat(cleaned) || 0;
                            if (base > 0) {
                              const pct = (amt / base) * 100;
                              setRiskPercentage(
                                String(parseFloat(pct.toFixed(3)))
                              );
                            }
                          }}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Result */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trade Result
            </Text>
            <View style={styles.resultButtons}>
              {(["Win", "Loss", "Break-even"] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.resultButton,
                    result === r &&
                      r === "Win" && { backgroundColor: colors.profitEnd },
                    result === r &&
                      r === "Loss" && { backgroundColor: colors.lossEnd },
                    result === r &&
                      r === "Break-even" && {
                        backgroundColor: colors.breakEven,
                      },
                    result !== r && {
                      backgroundColor: colors.neutral,
                      borderColor: colors.neutral,
                    },
                  ]}
                  onPress={() => setResult(r)}
                >
                  <Text style={styles.resultIcon}>
                    {r === "Win" ? "✓" : r === "Loss" ? "✗" : "—"}
                  </Text>
                  <Text
                    style={[
                      styles.resultText,
                      { color: result === r ? "#fff" : colors.text },
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Checklist Items */}
          {checklistItems.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Checklist
              </Text>
              <View style={styles.checklistContainer}>
                {checklistItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checklistItem}
                    onPress={() =>
                      onChecklistItemToggle && onChecklistItemToggle(item.id)
                    }
                  >
                    <View
                      style={[
                        styles.checklistCheckbox,
                        selectedChecklistItems.includes(item.id) &&
                          styles.checked,
                        { borderColor: colors.neutral },
                      ]}
                    >
                      {selectedChecklistItems.includes(item.id) && (
                        <Text style={styles.checklistCheckmark}>✓</Text>
                      )}
                    </View>
                    <View style={styles.checklistItemText}>
                      <Text
                        style={[
                          styles.checklistItemLabel,
                          { color: colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={[
                          styles.checklistItemDescription,
                          { color: colors.subtext },
                        ]}
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Emotional Rating */}
          <View style={styles.section}>
            <View style={styles.emotionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Emotional State
              </Text>
              <View style={styles.emotionBadge}>
                <Text style={styles.emotionValue}>{emotionalRating}/10</Text>
              </View>
            </View>
            <View style={styles.emotionSlider}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.emotionDot,
                    {
                      backgroundColor:
                        emotionalRating >= i ? "#ffa500" : colors.neutral,
                    },
                  ]}
                  onPress={() => setEmotionalRating(i)}
                >
                  <Text
                    style={[
                      styles.emotionNumber,
                      { opacity: emotionalRating >= i ? 1 : 0.5 },
                    ]}
                  >
                    {i}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.emotionLabels}>
              <Text style={[styles.emotionLabel, { color: colors.subtext }]}>
                Fearful
              </Text>
              <Text style={[styles.emotionLabel, { color: colors.subtext }]}>
                Confident
              </Text>
            </View>
          </View>

          {/* Rule Deviation */}
          <TouchableOpacity
            style={[styles.deviationCard, { backgroundColor: colors.neutral }]}
            onPress={() => setRuleDeviation(!ruleDeviation)}
          >
            <View style={styles.deviationLeft}>
              <View
                style={[
                  styles.deviationIcon,
                  {
                    backgroundColor: ruleDeviation ? "#f4433620" : "#4caf5020",
                  },
                ]}
              >
                <Text style={styles.deviationIconText}>
                  {ruleDeviation ? "⚠️" : "✓"}
                </Text>
              </View>
              <View style={styles.deviationInfo}>
                <Text style={[styles.deviationTitle, { color: colors.text }]}>
                  Rule Deviation
                </Text>
                <Text
                  style={[styles.deviationSubtitle, { color: colors.subtext }]}
                >
                  {ruleDeviation ? "Rules were broken" : "Following the plan"}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: ruleDeviation
                    ? colors.lossEnd
                    : colors.neutral,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  { transform: [{ translateX: ruleDeviation ? 16 : 0 }] },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trade Notes
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: colors.neutral,
                  color: colors.text,
                  borderColor: colors.highlight,
                },
              ]}
              placeholder="Observations, lessons learned, market conditions..."
              placeholderTextColor={colors.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Screenshots */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Chart Screenshots
            </Text>
            <ImageUploader
              screenshots={screenshots}
              onAdd={(uri: string) =>
                setScreenshots((s) => [...s, { uri, label: "Other" }])
              }
              onRemove={(uri: string) =>
                setScreenshots((s) => s.filter((x) => x.uri !== uri))
              }
              onUpdateLabel={(uri: string, label: string) =>
                setScreenshots((s) =>
                  s.map((x) => (x.uri === uri ? { ...x, label } : x))
                )
              }
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.highlight },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitIcon}>✓</Text>
              <Text style={styles.submitText}>Add Trade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.neutral }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          {/* Trade date/time - placed near actions so it's optional and non-intrusive */}
          <View style={[styles.section, { marginTop: 12 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Entry Date & Time (optional)
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {Platform.OS === "web" ? (
                <>
                  {dateInputSupported ? (
                    <>
                      {/* Native HTML date input for browsers that support it */}
                      {/* @ts-ignore - using input element for web */}
                      <input
                        type="date"
                        min="1900-01-01"
                        max={new Date().toISOString().slice(0, 10)}
                        value={
                          tradeDate && !isNaN(tradeDate.getTime())
                            ? tradeDate.toISOString().slice(0, 10)
                            : ""
                        }
                        onChange={(e: any) => {
                          const v = e?.target?.value;
                          if (!v) return setTradeDate(new Date());
                          const parsed = new Date(v);
                          if (!isNaN(parsed.getTime())) {
                            setTradeDate(parsed);
                            setTradeDateDigits(v.replace(/-/g, ""));
                          }
                        }}
                        style={{
                          flex: 1,
                          marginRight: 8,
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: colors.surface,
                          color: colors.text,
                          border: `1px solid ${colors.neutral}`,
                          fontSize: 15,
                          boxSizing: "border-box",
                        }}
                      />
                      <TextInput
                        style={[
                          styles.priceInput,
                          {
                            width: 120,
                            color: tradeTimeText ? colors.text : colors.subtext,
                            fontWeight: tradeTimeText ? "600" : "400",
                          },
                        ]}
                        value={tradeTimeText}
                        onChangeText={(t) => setTradeTimeText(t)}
                        placeholder="HH:MM"
                        placeholderTextColor={colors.subtext}
                      />
                      <Text style={[{ color: colors.subtext, marginTop: 6 }]}>
                        Example: {new Date().toISOString().slice(0, 10)}
                      </Text>
                    </>
                  ) : (
                    <>
                      {/* Dropdown fallback: Year - Month - Day */}
                      {/* @ts-ignore - using select for web fallback */}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <select
                          value={selectedYear}
                          onChange={(e: any) => setSelectedYear(e.target.value)}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: colors.surface,
                            color: colors.text,
                            border: `1px solid ${colors.neutral}`,
                            fontSize: 15,
                          }}
                        >
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <span style={{ color: colors.subtext }}>-</span>
                        <select
                          value={selectedMonth}
                          onChange={(e: any) =>
                            setSelectedMonth(e.target.value)
                          }
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: colors.surface,
                            color: colors.text,
                            border: `1px solid ${colors.neutral}`,
                            fontSize: 15,
                          }}
                        >
                          <option value="">Month</option>
                          {months.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <span style={{ color: colors.subtext }}>-</span>
                        <select
                          value={selectedDay}
                          onChange={(e: any) => setSelectedDay(e.target.value)}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: colors.surface,
                            color: colors.text,
                            border: `1px solid ${colors.neutral}`,
                            fontSize: 15,
                          }}
                        >
                          <option value="">Day</option>
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <TextInput
                        style={[
                          styles.priceInput,
                          {
                            width: 120,
                            marginLeft: 8,
                            color: tradeTimeText ? colors.text : colors.subtext,
                            fontWeight: tradeTimeText ? "600" : "400",
                          },
                        ]}
                        value={tradeTimeText}
                        onChangeText={(t) => setTradeTimeText(t)}
                        placeholder="HH:MM"
                        placeholderTextColor={colors.subtext}
                      />
                      <Text style={[{ color: colors.subtext, marginTop: 6 }]}>
                        Example: {new Date().toISOString().slice(0, 10)}
                      </Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.priceInput,
                      { flex: 1, marginRight: 8, justifyContent: "center" },
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={{
                        color:
                          tradeDate && !isNaN(tradeDate.getTime())
                            ? colors.text
                            : colors.subtext,
                        fontWeight:
                          tradeDate && !isNaN(tradeDate.getTime())
                            ? "600"
                            : "400",
                      }}
                    >
                      {tradeDate && !isNaN(tradeDate.getTime())
                        ? tradeDate.toISOString().slice(0, 10)
                        : "Select date"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priceInput,
                      { width: 120, justifyContent: "center" },
                    ]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text
                      style={{
                        color: tradeTimeText ? colors.text : colors.subtext,
                        fontWeight: tradeTimeText ? "600" : "400",
                      }}
                    >
                      {tradeTimeText || "Select time"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={tradeDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={(event: any, selectedDate?: Date) => {
                  // On Android the picker closes automatically so hide unless ios
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setTradeDate(selectedDate);
                  }
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={tradeDate || new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                is24Hour={true}
                onChange={(event: any, selectedDate?: Date) => {
                  setShowTimePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setTradeDate(selectedDate);
                    const hh = selectedDate
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const mm = selectedDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    setTradeTimeText(`${hh}:${mm}`);
                  }
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <ConfirmModal
        visible={showConfirmation}
        title={"Confirm Trade"}
        confirmText={"Save"}
        cancelText={"Cancel"}
        onConfirm={confirmAndSaveTrade}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingTrade(null);
        }}
      >
        {pendingTrade ? (
          <View>
            <Text style={{ fontWeight: "800", fontSize: 16, marginBottom: 8 }}>
              {pendingTrade.pair} • {pendingTrade.direction}
            </Text>
            <Text style={{ marginBottom: 6 }}>
              Entry: {pendingTrade.entryPrice} • SL: {pendingTrade.stopLoss} • TP: {pendingTrade.takeProfit}
            </Text>
            <Text style={{ marginBottom: 6 }}>
              Account: {pendingTrade.accountId || "—"}
            </Text>
            <Text>R:R: {pendingTrade.riskToReward}</Text>
          </View>
        ) : null}
      </ConfirmModal>
    </KeyboardAvoidingView>
  );
}

function formatDateMask(digits: string) {
  // digits is up to 8 characters YYYYMMDD
  const padded = (digits || "").padEnd(8, "_");
  const y = padded
    .slice(0, 4)
    .split("")
    .map((c) => (c === "_" ? "_" : c))
    .join("");
  const m = padded
    .slice(4, 6)
    .split("")
    .map((c) => (c === "_" ? "_" : c))
    .join("");
  const d = padded
    .slice(6, 8)
    .split("")
    .map((c) => (c === "_" ? "_" : c))
    .join("");
  return `${y}-${m}-${d}`;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "#f5f5f5",
    fontWeight: "700",
  },
  rrHero: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
  },
  rrLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  rrValue: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
  },
  rrBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rrBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  confluenceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  confluenceLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  confluenceValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  confluenceIndicator: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  confluenceBar: {
    height: "100%",
    borderRadius: 3,
  },
  confluenceFill: {
    height: "100%",
    borderRadius: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  pairInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#00d4d4",
  },
  pairIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  pairTextInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
  },
  directionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  directionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 2,
    gap: 8,
  },
  directionIcon: {
    fontSize: 20,
    color: "#fff",
  },
  directionText: {
    fontSize: 15,
    fontWeight: "700",
  },
  sessionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  sessionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    gap: 6,
  },
  sessionEmoji: {
    fontSize: 24,
  },
  sessionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  strategyGroup: {
    flexDirection: "row",
    gap: 12,
  },
  strategyCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
    gap: 8,
  },
  strategyCardActive: {
    borderWidth: 2,
  },
  strategyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00d4d420",
    justifyContent: "center",
    alignItems: "center",
  },
  strategyIconText: {
    fontSize: 16,
  },
  strategyName: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  priceIcon: {
    fontSize: 20,
  },
  priceInputGroup: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  priceInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontWeight: "600",
  },
  resultButtons: {
    flexDirection: "row",
    gap: 12,
  },
  resultButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    gap: 6,
  },
  resultIcon: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  resultText: {
    fontSize: 13,
    fontWeight: "700",
  },
  checklistContainer: {
    gap: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  checklistCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checked: {
    backgroundColor: "#00d4d4",
    borderColor: "#00d4d4",
  },
  checklistCheckmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checklistItemText: {
    flex: 1,
  },
  checklistItemLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  checklistItemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  emotionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emotionBadge: {
    backgroundColor: "#ffa50020",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  emotionValue: {
    color: "#ffa500",
    fontSize: 13,
    fontWeight: "700",
  },
  emotionSlider: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  emotionDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emotionNumber: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  emotionLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emotionLabel: {
    fontSize: 11,
    fontStyle: "italic",
  },
  deviationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  deviationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  deviationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  deviationIconText: {
    fontSize: 18,
  },
  deviationInfo: {
    flex: 1,
  },
  deviationTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  deviationSubtitle: {
    fontSize: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  notesInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 10,
    gap: 8,
  },
  submitIcon: {
    fontSize: 18,
    color: "#0d0d0d",
  },
  submitText: {
    color: "#0d0d0d",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
