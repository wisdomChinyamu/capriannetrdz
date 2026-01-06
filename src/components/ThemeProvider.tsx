import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Platform, Text, TextInput } from "react-native";
import themes, { ThemeMode } from "../theme/theme";
import {
  useFonts as useInterFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import * as Font from "expo-font";

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: typeof themes.dark;
  fontFamily: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initial = "dark" as ThemeMode,
}: {
  children: ReactNode;
  initial?: ThemeMode;
}) => {
  const [mode, setMode] = useState<ThemeMode>(initial);

  // Try to load Inter for native platforms via expo-google-fonts. For iOS prefer SF Pro Display.
  const [fontsLoaded] = useInterFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const webFontFamily =
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
  const iosSystemFont =
    "SF Pro Display, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI'";

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const id = "app-global-font-inter";
        if (!document.getElementById(id)) {
          const style = document.createElement("style");
          style.id = id;
          style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;700;800;900&display=swap');\nhtml, body, #root, * { font-family: ${webFontFamily} !important; }\nsvg text, canvas, .chart, .recharts, .rv-xy-plot, .vx-label { font-family: ${webFontFamily} !important; }`;
          document.head.appendChild(style);
        }
      } catch (e) {
        console.warn("Could not inject Inter font stylesheet", e);
      }
    }

    // Ensure Text defaultProps use the correct font on native platforms
    const defaultFont =
      Platform.OS === "ios"
        ? iosSystemFont
        : fontsLoaded
        ? "Inter_400Regular"
        : webFontFamily;
    try {
      // @ts-ignore - defaultProps may be undefined
      if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
      // merge existing style if present
      const existing = (Text as any).defaultProps.style || {};
      (Text as any).defaultProps.style = {
        ...existing,
        fontFamily: defaultFont,
      };

      if ((TextInput as any).defaultProps == null)
        (TextInput as any).defaultProps = {};
      const existingInput = (TextInput as any).defaultProps.style || {};
      (TextInput as any).defaultProps.style = {
        ...existingInput,
        fontFamily: defaultFont,
      };
    } catch (e) {
      // ignore if running in environments where defaultProps is not writable
    }
  }, [fontsLoaded]);

  const value: ThemeContextType = {
    mode,
    setMode,
    colors: themes[mode],
    fontFamily:
      Platform.OS === "ios"
        ? iosSystemFont
        : fontsLoaded
        ? "Inter_400Regular"
        : webFontFamily,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeProvider;
