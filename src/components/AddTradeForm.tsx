import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Trade } from '../types';
import { ThemeMode } from '../theme/theme';
import ImageUploader from './ImageUploader';
import { useTheme } from './ThemeProvider';

interface AddTradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  theme?: ThemeMode;
}

export default function AddTradeForm({ onSubmit, onClose }: AddTradeFormProps) {
  const [pair, setPair] = React.useState('GBPUSD');
  const [direction, setDirection] = React.useState<'Buy' | 'Sell'>('Buy');
  const [session, setSession] = React.useState<'London' | 'NY' | 'Asia'>('London');
  const [entryPrice, setEntryPrice] = React.useState('');
  const [stopLoss, setStopLoss] = React.useState('');
  const [takeProfit, setTakeProfit] = React.useState('');
  const [result, setResult] = React.useState<'Win' | 'Loss' | 'Break-even' | undefined>();
  const [emotionalRating, setEmotionalRating] = React.useState(5);
  const [ruleDeviation, setRuleDeviation] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [screenshots, setScreenshots] = React.useState<string[]>([]);

  const { colors } = useTheme();
  const bgColor = colors.background;
  const cardBgColor = colors.card ?? colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.subtext;
  const inputBgColor = colors.neutral;

  // Calculate R:R
  const calculateRR = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return 0;
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return risk > 0 ? reward / risk : 0;
  };

  const handleSubmit = () => {
    if (!entryPrice || !stopLoss || !takeProfit) {
      Alert.alert('Error', 'Please fill in all price fields');
      return;
    }

    const rr = calculateRR();

    onSubmit({
      userId: 'current-user', // Replace with actual user ID
      pair,
      direction,
      session,
      entryPrice: parseFloat(entryPrice),
      stopLoss: parseFloat(stopLoss),
      takeProfit: parseFloat(takeProfit),
      result,
      riskToReward: rr,
      confluenceScore: 0, // Will be calculated from checklist
      grade: 'B',
      setupType: 'SMC',
      emotionalRating,
      ruleDeviation,
      screenshots,
      notes,
    });

    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Add Trade</Text>

          {/* Pair & Direction */}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: secondaryTextColor }]}>Pair</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                value={pair}
                onChangeText={setPair}
                placeholderTextColor={secondaryTextColor}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: secondaryTextColor }]}>Direction</Text>
              <View style={styles.buttonGroup}>
                {(['Buy', 'Sell'] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          direction === d ? colors.highlight : inputBgColor,
                      },
                    ]}
                    onPress={() => setDirection(d)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: direction === d ? '#000' : textColor },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Session */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Session</Text>
            <View style={styles.buttonGroup}>
              {(['London', 'NY', 'Asia'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                    style={[
                    styles.button,
                    {
                      backgroundColor: session === s ? colors.highlight : inputBgColor,
                    },
                  ]}
                  onPress={() => setSession(s)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: session === s ? '#000' : textColor },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prices */}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: secondaryTextColor }]}>Entry</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                placeholder="0.0000"
                placeholderTextColor={secondaryTextColor}
                value={entryPrice}
                onChangeText={setEntryPrice}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: secondaryTextColor }]}>SL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                placeholder="0.0000"
                placeholderTextColor={secondaryTextColor}
                value={stopLoss}
                onChangeText={setStopLoss}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: secondaryTextColor }]}>TP</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                placeholder="0.0000"
                placeholderTextColor={secondaryTextColor}
                value={takeProfit}
                onChangeText={setTakeProfit}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* R:R Display */}
          <View
              style={[
                styles.rrBox,
                { backgroundColor: inputBgColor, borderColor: colors.highlight },
              ]}
          >
            <Text style={[styles.rrLabel, { color: secondaryTextColor }]}>Risk:Reward</Text>
            <Text style={[styles.rrValue, { color: colors.highlight }]}> 
              1:{calculateRR().toFixed(2)}
            </Text>
          </View>

          {/* Result */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Result</Text>
            <View style={styles.buttonGroup}>
              {(['Win', 'Loss', 'Break-even'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        result === r
                                  ? r === 'Win'
                                    ? colors.profitEnd
                                    : r === 'Loss'
                                    ? colors.lossEnd
                                    : colors.breakEven
                                  : inputBgColor,
                    },
                  ]}
                  onPress={() => setResult(r)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: result === r ? '#fff' : textColor },
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Emotional Rating */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>
              Emotional Rating: {emotionalRating}/10
            </Text>
            <View style={styles.sliderContainer}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.sliderButton,
                    {
                      backgroundColor:
                        emotionalRating === i ? colors.highlight : inputBgColor,
                    },
                  ]}
                  onPress={() => setEmotionalRating(i)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      { color: emotionalRating === i ? '#000' : textColor },
                    ]}
                  >
                    {i}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Notes</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: inputBgColor, color: textColor },
              ]}
              placeholder="Add trade notes..."
              placeholderTextColor={secondaryTextColor}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Screenshots */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>Screenshots</Text>
            {/* ImageUploader handles web/native selection and returns URIs */}
            <ImageUploader
              screenshots={screenshots}
              onAdd={(uri: string) => setScreenshots((s) => [...s, uri])}
              onRemove={(uri: string) => setScreenshots((s) => s.filter((x) => x !== uri))}
            />
          </View>

          {/* Rule Deviation */}
          <TouchableOpacity
            style={[styles.checkboxContainer, { backgroundColor: inputBgColor }]}
            onPress={() => setRuleDeviation(!ruleDeviation)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: ruleDeviation ? '#00d4d4' : 'transparent',
                  borderColor: ruleDeviation ? '#00d4d4' : secondaryTextColor,
                },
              ]}
            >
                  {ruleDeviation && <Text style={[styles.checkmark, { color: colors.surface }]}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: textColor }]}>
              Rule Deviation
            </Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.highlight }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Trade</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: inputBgColor }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: textColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rrBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  rrLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  rrValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  sliderButton: {
    width: '18%',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#000',
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
