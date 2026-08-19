"use client";

import {
  Settings,
  Palette,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsPage() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <main
      className="
        min-h-screen
        bg-white
        text-zinc-900
        dark:bg-zinc-950
        dark:text-zinc-100
      "
    >
      {/* Header */}

      <div
        className="
          border-b
          border-zinc-200
          px-6
          py-5
          dark:border-zinc-800
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              bg-violet-600
              text-white
            "
          >
            <Settings className="h-4 w-4" />
          </div>

          <div>
            <h1 className="text-sm font-semibold">
              Settings
            </h1>

            <p
              className="
                mt-0.5
                text-[11px]
                text-zinc-400
                dark:text-zinc-500
              "
            >
              Manage your TaskFlow preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Appearance */}

        <section>
          <div className="mb-3">
            <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Appearance
            </h2>

            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              Customize how TaskFlow looks on your device.
            </p>
          </div>

          <div
            className="
              overflow-hidden
              rounded-lg
              border
              border-zinc-200
              bg-white
              dark:border-zinc-800
              dark:bg-zinc-900
            "
          >
            {/* Theme */}

            <button
              type="button"
              onClick={toggleTheme}
              className="
                flex
                w-full
                items-center
                justify-between
                px-4
                py-4
                text-left
                transition
                hover:bg-zinc-50
                dark:hover:bg-zinc-800
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    bg-zinc-100
                    text-zinc-600
                    dark:bg-zinc-800
                    dark:text-zinc-300
                  "
                >
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium">
                    Theme
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-zinc-400
                      dark:text-zinc-500
                    "
                  >
                    {theme === "dark"
                      ? "Dark mode"
                      : "Light mode"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                    rounded-md
                    border
                    border-zinc-200
                    px-2
                    py-1
                    text-[10px]
                    font-medium
                    text-zinc-500
                    dark:border-zinc-700
                    dark:text-zinc-400
                  "
                >
                  {theme === "dark"
                    ? "Dark"
                    : "Light"}
                </span>

                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </div>
            </button>

            {/* Divider */}

            <div className="border-t border-zinc-100 dark:border-zinc-800" />

            {/* Color Mode */}

            <button
              type="button"
              onClick={() => {
                // Color Mode is controlled
                // from the sidebar.
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                px-4
                py-4
                text-left
                transition
                hover:bg-zinc-50
                dark:hover:bg-zinc-800
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    bg-zinc-100
                    text-zinc-600
                    dark:bg-zinc-800
                    dark:text-zinc-300
                  "
                >
                  <Palette className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-medium">
                    Color Mode
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-zinc-400
                      dark:text-zinc-500
                    "
                  >
                    Choose your accent color from
                    the sidebar.
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </section>

        {/* Account */}

        <section className="mt-8">
          <div className="mb-3">
            <h2 className="text-xs font-semibold">
              Account
            </h2>

            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              Manage your TaskFlow account.
            </p>
          </div>

          <div
            className="
              rounded-lg
              border
              border-zinc-200
              bg-white
              px-4
              py-4
              dark:border-zinc-800
              dark:bg-zinc-900
            "
          >
            <p className="text-xs font-medium">
              Account settings
            </p>

            <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              Your profile and authentication
              settings can be managed from the
              Profile page.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}