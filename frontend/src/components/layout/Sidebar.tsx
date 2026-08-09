"use client";

import {
  CheckSquare,
  FolderKanban,
  Settings,
  UserCircle,
  Plus,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden h-screen w-[240px] shrink-0 border-r border-zinc-200 bg-white md:flex md:flex-col">
      {/* Workspace */}
      <div className="flex h-16 items-center border-b border-zinc-100 px-4">
        <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-xs font-bold text-white">
              T
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900">
                TaskFlow
              </p>

              <p className="text-[10px] text-zinc-400">
                Workspace
              </p>
            </div>
          </div>

          <ChevronsUpDown className="h-4 w-4 text-zinc-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
          Workspace
        </p>

        <Link
          href="/tasks"
          className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
            isActive("/tasks")
              ? "bg-zinc-100 font-medium text-zinc-900"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Tasks
        </Link>

        <Link
          href="/projects"
          className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
            isActive("/projects")
              ? "bg-zinc-100 font-medium text-zinc-900"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          Projects
        </Link>
      </nav>

      {/* Bottom navigation */}
      <div className="border-t border-zinc-100 p-3">
        <Link
          href="/profile"
          className="mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <UserCircle className="h-4 w-4" />
          Profile
        </Link>

        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
          <Plus className="h-3.5 w-3.5" />
          Invite members
        </button>
      </div>
    </aside>
  );
}