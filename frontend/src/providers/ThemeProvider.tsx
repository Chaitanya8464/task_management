"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export type AccentColor =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

interface ThemeContextValue {
  theme: ThemeMode;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

const THEME_KEY = "taskflow-theme";
const ACCENT_KEY = "taskflow-accent";

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemeMode>("light");

  const [accent, setAccentState] =
    useState<AccentColor>("blue");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(THEME_KEY);

    const savedAccent =
      localStorage.getItem(ACCENT_KEY);

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      setThemeState(savedTheme);
    }

    if (
      savedAccent === "amber" ||
      savedAccent === "blue" ||
      savedAccent === "pink" ||
      savedAccent === "rose" ||
      savedAccent === "emerald" ||
      savedAccent === "black"
    ) {
      setAccentState(savedAccent);
    }
  }, []);

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark",
    );

    root.dataset.theme = theme;
    root.dataset.accent = accent;

    localStorage.setItem(
      THEME_KEY,
      theme,
    );

    localStorage.setItem(
      ACCENT_KEY,
      accent,
    );
  }, [theme, accent]);

  const value = useMemo(
    () => ({
      theme,
      accent,

      setTheme: (
        value: ThemeMode,
      ) => {
        setThemeState(value);
      },

      setAccent: (
        value: AccentColor,
      ) => {
        setAccentState(value);
      },
    }),
    [theme, accent],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

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