import React from 'react';
import { Platform, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { uploadTradeImage } from '../services/supabaseImageService';
import { useTheme } from './ThemeProvider';

type ImageUploaderProps = {
  screenshots: string[];
  onAdd: (localUri: string, file?: File) => void;
  onRemove: (uri: string) => void;
};

export default function ImageUploader({ screenshots, onAdd, onRemove }: ImageUploaderProps) {
  const { colors } = useTheme();
  const handleWebPicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file: File = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onAdd(url, file);
    };
    input.click();
  };

  const handleNative = async () => {
    try {
      // Use Expo ImagePicker if available (soft fallback)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ImagePicker = require('expo-image-picker');
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!res.cancelled) {
        onAdd(res.uri);
      }
    } catch (err) {
      console.warn('Image picker not available', err);
    }
  };

  return (
    <View>
      <View style={styles.row}>
        {screenshots.map((s) => (
          <View key={s} style={styles.thumbWrap}>
            <Image source={{ uri: s }} style={[styles.thumb, { backgroundColor: colors.surface }]} />
            <TouchableOpacity style={[styles.remove, { backgroundColor: colors.lossEnd }]} onPress={() => onRemove(s)}>
              <Text style={[styles.removeText, { color: colors.surface }]}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.highlight }]}
        onPress={() => (Platform.OS === 'web' ? handleWebPicker() : handleNative())}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Upload Screenshot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  thumbWrap: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  remove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontWeight: '700' },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { fontWeight: '700' },
});
