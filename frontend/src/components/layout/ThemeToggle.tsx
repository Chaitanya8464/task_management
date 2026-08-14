"use client";

import {
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme();

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  // ------------------------------------------
  // Close when clicking outside
  // ------------------------------------------

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open]);

  const appearanceLabel =
    theme === "dark"
      ? "Dark"
      : "Light";

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}

        <span>
          Appearance
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 w-44 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          role="menu"
        >
          <p className="px-2.5 py-2 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
            Appearance
          </p>

          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            role="menuitem"
          >
            <Sun className="h-3.5 w-3.5" />

            <span className="flex-1 text-left">
              Light
            </span>

            {theme === "light" && (
              <span className="text-violet-600">
                ✓
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            role="menuitem"
          >
            <Moon className="h-3.5 w-3.5" />

            <span className="flex-1 text-left">
              Dark
            </span>

            {theme === "dark" && (
              <span className="text-violet-600">
                ✓
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}