"use client";

import {
  Filter,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import TaskBoard from "@/components/tasks/TaskBoard";

import TaskList from "@/components/tasks/TaskList";
import { tasks } from "@/components/tasks/task-data";import { useState } from "react";

export default function TasksPage() {
  const [view, setView] = useState<"board" | "list">("board");
    
  return (
    <AppShell>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex min-h-16 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">
              Tasks
            </h1>

            <p className="mt-0.5 text-xs text-zinc-400">
              Manage your workspace tasks
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800">
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-6">
          <div className="flex flex-1 items-center gap-2">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

              <input
                type="text"
                placeholder="Search tasks..."
                className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            {/* Filter */}
            <button className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-xs text-zinc-600 hover:bg-zinc-50">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

            {/* Fields */}
            <button className="hidden h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-xs text-zinc-600 hover:bg-zinc-50 sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Fields
            </button>
          </div>

          {/* View switcher */}
       <div className="flex items-center rounded-md border border-zinc-200 p-1">
  <button
    onClick={() => setView("board")}
    className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-[10px] font-medium transition ${
      view === "board"
        ? "bg-zinc-100 text-zinc-800"
        : "text-zinc-500 hover:bg-zinc-50"
    }`}
  >
    <LayoutGrid className="h-3 w-3" />
    Board
  </button>

  <button
    onClick={() => setView("list")}
    className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-[10px] font-medium transition ${
      view === "list"
        ? "bg-zinc-100 text-zinc-800"
        : "text-zinc-500 hover:bg-zinc-50"
    }`}
  >
    <List className="h-3 w-3" />
    List
  </button>
</div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
  {view === "board" ? (
    <TaskBoard />
  ) : (
    <TaskList tasks={tasks} />
  )}
</div>
      </div>
    </AppShell>
  );
}