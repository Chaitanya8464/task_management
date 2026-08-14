"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("system");

  const [resolvedTheme, setResolvedTheme] =
    useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "taskflow-theme",
      ) as Theme | null;

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const actualTheme =
        theme === "system"
          ? getSystemTheme()
          : theme;

      setResolvedTheme(actualTheme);

      document.documentElement.classList.toggle(
        "dark",
        actualTheme === "dark",
      );

      document.documentElement.style.colorScheme =
        actualTheme;
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    mediaQuery.addEventListener(
      "change",
      applyTheme,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        applyTheme,
      );
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    localStorage.setItem(
      "taskflow-theme",
      newTheme,
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
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