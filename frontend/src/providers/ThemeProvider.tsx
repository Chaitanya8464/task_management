"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

export type ColorTheme =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

const THEME_STORAGE_KEY = "taskflow_theme";
const COLOR_STORAGE_KEY = "taskflow_color_theme";

const colorThemes: ColorTheme[] = [
  "amber",
  "blue",
  "pink",
  "rose",
  "emerald",
  "black",
];

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("light");

  const [colorTheme, setColorThemeState] =
    useState<ColorTheme>("blue");

  const [mounted, setMounted] =
    useState(false);

  // ==========================================
  // Load saved settings
  // ==========================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        THEME_STORAGE_KEY,
      );

    const savedColor =
      localStorage.getItem(
        COLOR_STORAGE_KEY,
      );

    const initialTheme: Theme =
      savedTheme === "dark"
        ? "dark"
        : "light";

    const initialColor: ColorTheme =
      colorThemes.includes(
        savedColor as ColorTheme,
      )
        ? (savedColor as ColorTheme)
        : "blue";

    setThemeState(initialTheme);
    setColorThemeState(initialColor);

    applyTheme(initialTheme);
    applyColorTheme(initialColor);

    setMounted(true);
  }, []);

  // ==========================================
  // Apply light / dark mode
  // ==========================================

  useEffect(() => {
    if (!mounted) return;

    applyTheme(theme);

    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme,
    );
  }, [theme, mounted]);

  // ==========================================
  // Apply accent color
  // ==========================================

  useEffect(() => {
    if (!mounted) return;

    applyColorTheme(colorTheme);

    localStorage.setItem(
      COLOR_STORAGE_KEY,
      colorTheme,
    );
  }, [colorTheme, mounted]);

  // ==========================================
  // Theme helpers
  // ==========================================

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) =>
      current === "dark"
        ? "light"
        : "dark",
    );
  };

  const setColorTheme = (
    newColor: ColorTheme,
  ) => {
    setColorThemeState(newColor);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,

        colorTheme,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ==========================================
// Apply Light / Dark
// ==========================================

function applyTheme(theme: Theme) {
  const root =
    document.documentElement;

  root.classList.toggle(
    "dark",
    theme === "dark",
  );

  root.style.colorScheme = theme;
}

// ==========================================
// Apply Color Theme
// ==========================================

function applyColorTheme(
  colorTheme: ColorTheme,
) {
  const root =
    document.documentElement;

 root.setAttribute(
  "data-accent",
  colorTheme,
);
}

// ==========================================
// Hook
// ==========================================

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}