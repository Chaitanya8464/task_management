import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center justify-end border-b border-zinc-200 bg-white px-4">
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}