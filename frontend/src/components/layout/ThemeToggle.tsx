"use client";

import {
  Check,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";

import { useState } from "react";

import {
  useTheme,
  type AccentColor,
  type ThemeMode,
} from "@/providers/ThemeProvider";

const accents: {
  id: AccentColor;
  label: string;
  className: string;
}[] = [
  {
    id: "amber",
    label: "Amber",
    className: "bg-amber-500",
  },
  {
    id: "blue",
    label: "Blue",
    className: "bg-blue-500",
  },
  {
    id: "pink",
    label: "Pink",
    className: "bg-pink-500",
  },
  {
    id: "rose",
    label: "Rose",
    className: "bg-rose-500",
  },
  {
    id: "emerald",
    label: "Emerald",
    className: "bg-emerald-500",
  },
  {
    id: "black",
    label: "Black",
    className:
      "bg-zinc-950 dark:bg-white",
  },
];

export default function ThemeToggle() {
  const {
    theme,
    accent,
    setTheme,
    setAccent,
  } = useTheme();

  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-label="Open appearance settings"
        aria-expanded={open}
        className="
          flex h-8 items-center gap-2
          rounded-md
          border border-zinc-200
          bg-white
          px-2.5
          text-xs font-medium
          text-zinc-700
          shadow-sm
          transition
          hover:bg-zinc-50
          dark:border-zinc-800
          dark:bg-zinc-900
          dark:text-zinc-200
          dark:hover:bg-zinc-800
        "
      >
        {theme === "dark" ? (
          <Moon size={14} />
        ) : (
          <Sun size={14} />
        )}

        <span>Appearance</span>

        <ChevronDown size={13} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close appearance menu"
            className="
              fixed inset-0
              z-40
              cursor-default
            "
            onClick={() =>
              setOpen(false)
            }
          />

          <div
            className="
              absolute right-0 z-50 mt-2
              w-64
              rounded-xl
              border border-zinc-200
              bg-white
              p-3
              shadow-xl
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            {/* Theme */}

            <div className="mb-3">
              <p
                className="
                  px-1
                  text-xs
                  font-semibold
                  text-zinc-900
                  dark:text-zinc-100
                "
              >
                Theme
              </p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  ["light", "dark"] as ThemeMode[]
                ).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setTheme(mode)
                    }
                    className={`
                      flex items-center
                      justify-center gap-2
                      rounded-lg
                      border
                      px-3 py-2
                      text-xs
                      font-medium
                      capitalize
                      transition

                      ${
                        theme === mode
                          ? `
                            border-zinc-900
                            bg-zinc-900
                            text-white
                            dark:border-white
                            dark:bg-white
                            dark:text-zinc-950
                          `
                          : `
                            border-zinc-200
                            text-zinc-600
                            hover:bg-zinc-50
                            dark:border-zinc-800
                            dark:text-zinc-300
                            dark:hover:bg-zinc-900
                          `
                      }
                    `}
                  >
                    {mode === "light" ? (
                      <Sun size={14} />
                    ) : (
                      <Moon size={14} />
                    )}

                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Mode */}

            <div
              className="
                border-t
                border-zinc-100
                pt-3
                dark:border-zinc-800
              "
            >
              <p
                className="
                  px-1
                  text-xs
                  font-semibold
                  text-zinc-900
                  dark:text-zinc-100
                "
              >
                Color Mode
              </p>

              <div className="mt-2 space-y-1">
                {accents.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setAccent(item.id)
                    }
                    className="
                      flex w-full
                      items-center
                      justify-between
                      rounded-lg
                      px-2.5 py-2
                      text-left
                      text-xs
                      text-zinc-700
                      transition
                      hover:bg-zinc-100
                      dark:text-zinc-200
                      dark:hover:bg-zinc-900
                    "
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`
                          h-3.5 w-3.5
                          rounded-full
                          border
                          border-black/10
                          ${item.className}
                        `}
                      />

                      {item.label}
                    </span>

                    {accent === item.id && (
                      <Check size={14} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}