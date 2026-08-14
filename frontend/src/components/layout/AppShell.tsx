"use client";

import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      className="
        flex min-h-screen
        bg-white text-zinc-900
        transition-colors
        dark:bg-zinc-950
        dark:text-zinc-100
      "
    >
      {/* =========================================
          Desktop Sidebar
      ========================================= */}

      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* =========================================
          Mobile Sidebar Overlay
      ========================================= */}

      {sidebarOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/40
            md:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-hidden="true"
        />
      )}

      {/* =========================================
          Mobile Sidebar
      ========================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[280px]
          transform
          transition-transform duration-200
          md:hidden
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="relative h-full">
          <Sidebar />

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close sidebar"
            className="
              absolute right-3 top-3
              flex h-8 w-8
              items-center justify-center
              rounded-md
              border border-zinc-200
              bg-white
              text-zinc-600
              shadow-sm
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-300
              dark:hover:bg-zinc-800
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* =========================================
          Main Application
      ========================================= */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* =======================================
            Top Bar
        ======================================= */}

        <header
          className="
            flex h-12 shrink-0
            items-center
            justify-between
            border-b
            border-zinc-200
            bg-white
            px-3
            sm:px-4
            transition-colors
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >
          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-md
              text-zinc-600
              transition
              hover:bg-zinc-100
              dark:text-zinc-300
              dark:hover:bg-zinc-800
              md:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Appearance */}

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* =======================================
            Page Content
        ======================================= */}

        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}