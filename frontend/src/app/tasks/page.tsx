"use client";

import { useEffect, useState } from "react";
import {
  List,
  Plus,
  Search,
  LayoutGrid,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskList from "@/components/tasks/TaskList";
import TaskFilters from "@/components/tasks/TaskFilters";
import FieldsMenu from "@/components/tasks/FieldsMenu";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";

import { getTasks, ApiTask } from "@/lib/api";
import { Task } from "@/components/tasks/TaskCard";

function mapTaskStatus(
  status: ApiTask["status"],
): Task["status"] {
  const statusMap: Record<
    ApiTask["status"],
    Task["status"]
  > = {
    TODO: "To Do",
    DOING: "Doing",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
  };

  return statusMap[status];
}

function mapTaskPriority(
  priority: ApiTask["priority"],
): Task["priority"] {
  const priorityMap: Record<
    ApiTask["priority"],
    Task["priority"]
  > = {
    URGENT: "Urgent",
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
    NO_PRIORITY: "No Priority",
  };

  return priorityMap[priority];
}

function mapApiTaskToUiTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description:
      task.description ?? undefined,
    priority: mapTaskPriority(task.priority),
    status: mapTaskStatus(task.status),
    assignee:
      task.assignee?.name ?? "Unassigned",
    dueDate: task.dueDate
      ? new Date(
          task.dueDate,
        ).toLocaleDateString()
      : "No due date",
    comments:
      task.comments?.length ?? 0,
  };
}

export default function TasksPage() {
  // -----------------------------
  // Tasks
  // -----------------------------

  const [taskList, setTaskList] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // -----------------------------
  // View
  // -----------------------------

  const [view, setView] =
    useState<"board" | "list">("board");

  // -----------------------------
  // Search
  // -----------------------------

  const [search, setSearch] =
    useState("");

  // -----------------------------
  // Filters
  // -----------------------------

  const [filters, setFilters] =
    useState({
      status: "All",
      priority: "All",
      assignee: "All",
    });

  // -----------------------------
  // Fields
  // -----------------------------

  const [fields, setFields] =
    useState({
      priority: true,
      members: true,
      dueDate: true,
      comments: true,
    });

  // -----------------------------
  // Add task modal
  // -----------------------------

  const [isAddTaskOpen, setIsAddTaskOpen] =
    useState(false);

  // -----------------------------
  // Edit task modal
  // -----------------------------

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);
  const [deletingTask, setDeletingTask] =
    useState<Task | null>(null);
  // -----------------------------
  // Load tasks
  // -----------------------------

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const data = await getTasks();

        setTaskList(
          data.map(mapApiTaskToUiTask),
        );
      } catch (error) {
        console.error(
          "Failed to load tasks:",
          error,
        );

        setError(
          "Unable to load tasks. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  // -----------------------------
  // Add task
  // -----------------------------

  const handleAddTask = (task: Task) => {
    setTaskList((currentTasks) => [
      ...currentTasks,
      task,
    ]);

    setIsAddTaskOpen(false);
  };


  // -----------------------------
  // Open edit modal
  // -----------------------------

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (task: Task) => {
  setDeletingTask(task);
  };

  const handleDeletedTask = (
    taskId: string,
    ) => {
    setTaskList((currentTasks) =>
        currentTasks.filter(
        (task) => task.id !== taskId,
        ),
    );

    setDeletingTask(null);
    };

  // -----------------------------
  // Update task in UI
  // -----------------------------

  const handleUpdatedTask = (
    updatedTask: Task,
  ) => {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task,
      ),
    );

    setEditingTask(null);
  };

  // -----------------------------
  // Search + Filters
  // -----------------------------

  const filteredTasks =
    taskList.filter((task) => {
      const query =
        search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query) ||
        task.assignee
          .toLowerCase()
          .includes(query) ||
        task.priority
          .toLowerCase()
          .includes(query) ||
        task.status
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        filters.status === "All" ||
        task.status === filters.status;

      const matchesPriority =
        filters.priority === "All" ||
        task.priority === filters.priority;

      const matchesAssignee =
        filters.assignee === "All" ||
        task.assignee ===
          filters.assignee;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />

            <p className="mt-3 text-xs text-zinc-400">
              Loading tasks...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-3 rounded-md bg-black px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              Try again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex min-h-full flex-col">
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
            onClick={() =>
              setIsAddTaskOpen(true)
            }
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </header>

        {/* Toolbar */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-6">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* Search */}

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <TaskFilters
              filters={filters}
              onChange={setFilters}
            />

            <FieldsMenu
              fields={fields}
              onChange={setFields}
            />
          </div>

          {/* View switcher */}

          <div className="flex items-center rounded-md border border-zinc-200 p-1">
            <button
              type="button"
              onClick={() =>
                setView("board")
              }
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
              onClick={() =>
                setView("list")
              }
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
                  Try changing your search or filters.
                </p>
              </div>
            </div>
          ) : view === "board" ? (
          <TaskBoard
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />
          ) : (
           <TaskList
            tasks={filteredTasks}
            fields={fields}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            />
          )}
        </div>
      </div>

      {/* Add Task */}

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() =>
          setIsAddTaskOpen(false)
        }
        onAdd={handleAddTask}
      />

      {/* Edit Task */}

      <EditTaskModal
        isOpen={editingTask !== null}
        task={editingTask}
        onClose={() =>
          setEditingTask(null)
        }
        onUpdated={handleUpdatedTask}
      />
      <DeleteTaskDialog
        isOpen={deletingTask !== null}
        task={deletingTask}
        onClose={() =>
            setDeletingTask(null)
        }
  onDeleted={handleDeletedTask}
/>
    </AppShell>
  );
}