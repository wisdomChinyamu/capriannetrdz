import './src/polyfills/crypto';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import { TabNavigator } from './src/navigation/TabNavigator';
import ThemeProvider from './src/components/ThemeProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ThemeProvider initial="dark">
          <NavigationContainer>
            <StatusBar />
            <TabNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
