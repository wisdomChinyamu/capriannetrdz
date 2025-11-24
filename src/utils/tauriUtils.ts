import { Platform } from 'react-native';

let tauriAPI: typeof import('@tauri-apps/api') | null = null;

// Dynamically import Tauri APIs only on desktop platforms
export const initializeTauri = async () => {
  // Check if we're running in a Tauri environment
  const isTauriEnv = window.location.protocol === 'tauri:' || 
                     (window as any).__TAURI__ !== undefined ||
                     Platform.OS === 'windows' || 
                     Platform.OS === 'macos' || 
                     Platform.OS === 'linux';
                     
  if (isTauriEnv) {
    try {
      tauriAPI = await import('@tauri-apps/api');
      console.log('Tauri API initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Tauri API:', error);
    }
  }
};

export const getTauriAPI = () => {
  return tauriAPI;
};

// Utility functions for common Tauri operations
export const isTauri = () => {
  return tauriAPI !== null;
};

export const openTauriDialog = async (options?: any) => {
  if (!tauriAPI) return null;
  
  try {
    const result = await tauriAPI.dialog.open(options);
    return result;
  } catch (error) {
    console.error('Error opening Tauri dialog:', error);
    return null;
  }
};

export const sendTauriEvent = async (event: string, payload?: any) => {
  if (!tauriAPI) return;
  
  try {
    await tauriAPI.event.emit(event, payload);
  } catch (error) {
    console.error('Error sending Tauri event:', error);
  }
};