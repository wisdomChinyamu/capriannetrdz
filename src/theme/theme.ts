import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light';

export const spacing = (step: number) => 8 * step;

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export const themes = {
  dark: {
    background: '#0d0d0d',
    surface: '#1a1a1a',
    card: '#1a1a1a',
    text: '#f5f5f5',
    subtext: '#aaa',
    highlight: '#00d4d4',
    profitStart: '#1f7a1f',
    profitEnd: '#4caf50',
    lossStart: '#b71c1c',
    lossEnd: '#ef5350',
    neutral: '#2a2a2a',
    breakEven: '#555555',
  },
  light: {
    background: '#f7f7f7',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#101010',
    subtext: '#666',
    highlight: '#0099a8',
    profitStart: '#66bb6a',
    profitEnd: '#a5d6a7',
    lossStart: '#ef5350',
    lossEnd: '#ef9a9a',
    neutral: '#e8e8e8',
    breakEven: '#999999',
  },
};

export const isWeb = Platform.OS === 'web';

export default themes;
