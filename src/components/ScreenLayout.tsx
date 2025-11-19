import React from 'react';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { useTheme } from './ThemeProvider';

export default function ScreenLayout({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 16,
  },
});
