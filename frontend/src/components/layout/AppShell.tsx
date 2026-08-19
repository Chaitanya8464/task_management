"use client";

import type { ReactNode } from "react";
import { Menu, X, PanelLeft } from "lucide-react";
import { useState } from "react";

import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // Desktop sidebar
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside
        className={`
          hidden
          shrink-0
          md:block
          transition-[width]
          duration-200
          ease-in-out
          ${
            sidebarCollapsed
              ? "w-0 overflow-hidden"
              : "w-[224px]"
          }
        `}
      >
        <Sidebar />
      </aside>

      {/* =================================================
          MOBILE SIDEBAR OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            md:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-hidden="true"
        />
      )}

      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-[260px]
          transform
          transition-transform
          duration-200
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
              absolute
              right-3
              top-3
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              border
              border-zinc-200
              bg-white
              text-zinc-500
              shadow-sm
              hover:bg-zinc-50
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-300
              dark:hover:bg-zinc-800
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN APPLICATION
      ================================================= */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <header
          className="
            flex
            h-14
            shrink-0
            items-center
            border-b
            border-zinc-200
            bg-white
            px-4
            dark:border-zinc-800
            dark:bg-zinc-950
            sm:px-5
          "
        >
          {/* Mobile menu */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-zinc-500
              hover:bg-zinc-100
              md:hidden
              dark:hover:bg-zinc-800
            "
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Desktop sidebar toggle */}

          <button
            type="button"
            onClick={() =>
              setSidebarCollapsed(
                (current) => !current,
              )
            }
            aria-label={
              sidebarCollapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
            aria-expanded={
              !sidebarCollapsed
            }
            className="
              hidden
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-zinc-500
              transition
              hover:bg-zinc-100
              hover:text-zinc-900
              md:flex
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-100
            "
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main
          className="
            min-w-0
            flex-1
            overflow-x-auto
            bg-white
            dark:bg-zinc-950
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}