import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
};

export default function Toast({ message, type = 'info', visible }: ToastProps) {
  const bg = type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#333';
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: bg, opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 9999,
    maxWidth: Math.min(Dimensions.get('window').width - 40, 520),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
