"use client";

import {
  CheckSquare,
  FolderKanban,
  UserCircle,
  Settings,
  UserPlus,
  ChevronUp,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isTasksActive =
    pathname === "/tasks" ||
    pathname.startsWith("/tasks/");

  const isProjectsActive =
    pathname === "/projects" ||
    pathname.startsWith("/projects/");

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-zinc-200 bg-white text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Workspace Header */}
      <div className="flex h-[72px] items-center justify-between border-b border-zinc-100 px-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
            T
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              TaskFlow
            </p>

            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Workspace
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Workspace menu"
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
          Workspace
        </p>

        <nav className="space-y-1">
          <Link
            href="/tasks"
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
              isTasksActive
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <CheckSquare className="h-4 w-4 shrink-0" />
            <span>Tasks</span>
          </Link>

          <Link
            href="/projects"
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
              isProjectsActive
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <FolderKanban className="h-4 w-4 shrink-0" />
            <span>Projects</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
        <nav className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <UserCircle className="h-4 w-4 shrink-0" />
            <span>Profile</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </Link>

          <button
            type="button"
            className="mt-2 flex w-full items-center gap-3 rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            <span>Invite members</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}