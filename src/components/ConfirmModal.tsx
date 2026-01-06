import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "./ThemeProvider";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  const { colors } = useTheme();

  // On web, react-native Modal can be inconsistent; render a fixed overlay fallback
  if (Platform.OS === "web") {
    if (!visible) return null;
    return (
      <View
        style={[
          styles.overlay,
          styles.webOverlay, // Apply web-specific styles for fixed positioning
        ]}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {title ? (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          ) : null}
          {children ? (
            <View>{children}</View>
          ) : (
            <Text style={[styles.message, { color: colors.subtext }]}>
              {message}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "transparent", borderColor: colors.subtext },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: colors.subtext }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.lossEnd }]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {title ? (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          ) : null}
          {children ? (
            <View>{children}</View>
          ) : (
            <Text style={[styles.message, { color: colors.subtext }]}>
              {message}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "transparent", borderColor: colors.subtext },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: colors.subtext }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.lossEnd }]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  // Web-specific styles to achieve fixed positioning effect
  webOverlay:
    Platform.OS === "web"
      ? {
          position: "fixed" as "absolute", // Type assertion to avoid TypeScript error
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }
      : {},
  card: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: "700",
  },
  confirmText: {
    fontWeight: "800",
    color: "#0d0d0d",
  },
});
