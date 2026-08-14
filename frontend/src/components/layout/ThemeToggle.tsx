"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-md border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Light */}
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        title="Light theme"
        className={`rounded p-1.5 transition ${
          theme === "light"
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      {/* System */}
      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="System theme"
        title="System theme"
        className={`rounded p-1.5 transition ${
          theme === "system"
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>

      {/* Dark */}
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
        title="Dark theme"
        className={`rounded p-1.5 transition ${
          theme === "dark"
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}