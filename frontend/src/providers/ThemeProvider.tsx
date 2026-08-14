"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

const STORAGE_KEY = "taskflow_theme";

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("light");

  const [mounted, setMounted] =
    useState(false);

  // ------------------------------------------
  // Load saved theme
  // ------------------------------------------

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(STORAGE_KEY);

    const initialTheme: Theme =
      savedTheme === "dark"
        ? "dark"
        : savedTheme === "light"
          ? "light"
          : window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
            ? "dark"
            : "light";

    setThemeState(initialTheme);

    document.documentElement.classList.toggle(
      "dark",
      initialTheme === "dark",
    );

    document.documentElement.style.colorScheme =
      initialTheme;

    setMounted(true);
  }, []);

  // ------------------------------------------
  // Apply theme whenever it changes
  // ------------------------------------------

  useEffect(() => {
    if (!mounted) return;

    const root =
      document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark",
    );

    root.style.colorScheme = theme;

    localStorage.setItem(
      STORAGE_KEY,
      theme,
    );
  }, [theme, mounted]);

  // ------------------------------------------
  // Set theme
  // ------------------------------------------

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // ------------------------------------------
  // Toggle theme
  // ------------------------------------------

  const toggleTheme = () => {
    setThemeState((current) =>
      current === "dark"
        ? "light"
        : "dark",
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
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