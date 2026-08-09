"use client";

import { useState } from "react";
import {
  Filter,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";

import TaskFilters, {
  TaskFilterState,
} from "@/components/tasks/TaskFilters";

import AppShell from "@/components/layout/AppShell";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskList from "@/components/tasks/TaskList";
import { tasks } from "@/components/tasks/task-data";

export default function TasksPage() {
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilterState>({
    status: "All",
    priority: "All",
    assignee: "All",
    });
  const filteredTasks = tasks.filter((task) => {
  const query = search.toLowerCase().trim();

  const matchesSearch =
    !query ||
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query) ||
    task.assignee.toLowerCase().includes(query) ||
    task.priority.toLowerCase().includes(query) ||
    task.status.toLowerCase().includes(query);

  const matchesStatus =
    filters.status === "All" ||
    task.status === filters.status;

  const matchesPriority =
    filters.priority === "All" ||
    task.priority === filters.priority;

  const matchesAssignee =
    filters.assignee === "All" ||
    task.assignee === filters.assignee;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPriority &&
    matchesAssignee
  );
});

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

          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
          >
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            {/* Filter */}
          <TaskFilters
  filters={filters}
  onChange={setFilters}
/>

            {/* Fields */}
            <button
              type="button"
              className="hidden h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-xs text-zinc-600 hover:bg-zinc-50 sm:flex"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Fields
            </button>
          </div>

          {/* View switcher */}
          <div className="flex items-center rounded-md border border-zinc-200 p-1">
            <button
              type="button"
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
              type="button"
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

        {/* Task content */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          {filteredTasks.length === 0 ? (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700">
                  No tasks found
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Try changing your search.
                </p>
              </div>
            </div>
          ) : view === "board" ? (
            <TaskBoard tasks={filteredTasks} />
          ) : (
            <TaskList tasks={filteredTasks} />
          )}
        </div>
      </div>
    </AppShell>
  );
}