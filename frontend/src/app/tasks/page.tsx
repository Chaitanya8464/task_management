"use client";

import { useEffect, useState } from "react";
import {
  List,
  Plus,
  Search,
  LayoutGrid,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { updateTask } from "@/lib/api";
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
  // Sorting
  // -----------------------------

  const [sortBy, setSortBy] =
    useState<
      | "default"
      | "due-asc"
      | "due-desc"
      | "priority-high"
      | "priority-low"
      | "title-asc"
      | "title-desc"
    >("default");

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

        const storedWorkspace =
  localStorage.getItem(
    "taskflow_workspace",
  );

if (!storedWorkspace) {
  throw new Error(
    "Workspace session not found.",
  );
}

const workspace =
  JSON.parse(storedWorkspace);

const data = await getTasks(
  workspace.id,
);

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
  // Search + Filters + Sorting
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
        task.assignee === filters.assignee;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });

  const priorityRank: Record<Task["priority"], number> = {
    Urgent: 5,
    High: 4,
    Medium: 3,
    Low: 2,
    "No Priority": 1,
  };

  const parseDueDate = (value: string) => {
    if (value === "No due date") {
      return null;
    }

    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  };

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "priority-high":
          return (
            priorityRank[b.priority] -
            priorityRank[a.priority]
          );

        case "priority-low":
          return (
            priorityRank[a.priority] -
            priorityRank[b.priority]
          );

        case "due-asc": {
          const aDate = parseDueDate(a.dueDate);
          const bDate = parseDueDate(b.dueDate);

          if (aDate === null && bDate === null) return 0;
          if (aDate === null) return 1;
          if (bDate === null) return -1;

          return aDate - bDate;
        }

        case "due-desc": {
          const aDate = parseDueDate(a.dueDate);
          const bDate = parseDueDate(b.dueDate);

          if (aDate === null && bDate === null) return 0;
          if (aDate === null) return 1;
          if (bDate === null) return -1;

          return bDate - aDate;
        }

        default:
          return 0;
      }
    },
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.assignee !== "All" ||
    sortBy !== "default";

  const clearFilters = () => {
    setSearch("");
    setFilters({
      status: "All",
      priority: "All",
      assignee: "All",
    });
    setSortBy("default");
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />

            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              Loading tasks...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  // -----------------------------
  const handleStatusChange = async (
  task: Task,
  newStatus: Task["status"],
) => {
  if (task.status === newStatus) {
    return;
  }

  const statusMap = {
    "To Do": "TODO",
    Doing: "DOING",
    Completed: "COMPLETED",
    "On Hold": "ON_HOLD",
  } as const;

  try {
    const updatedTask = await updateTask(
      task.id,
      {
        status: statusMap[newStatus],
      },
    );

    setTaskList((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? {
              ...currentTask,
              status: newStatus,
            }
          : currentTask,
      ),
    );

    console.log(
      "Task status updated:",
      updatedTask,
    );
  } catch (error) {
    console.error(
      "Failed to update task status:",
      error,
    );
  }
};
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

        <header
          className="
            flex min-h-16 flex-wrap
            items-center justify-between
            gap-3
            border-b border-zinc-200
            px-4 py-3
            dark:border-zinc-800
            sm:px-6
          "
        >
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Tasks
            </h1>

            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Manage your workspace tasks
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddTaskOpen(true)}
            className="
              flex shrink-0 items-center gap-2
              rounded-md bg-black px-3 py-2
              text-xs font-medium text-white
              transition hover:bg-zinc-800
              dark:bg-white dark:text-black dark:hover:bg-zinc-200
            "
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </header>

        {/* Toolbar */}

        <div
          className="
            flex flex-col gap-3
            border-b border-zinc-100
            px-4 py-3
            dark:border-zinc-800
            sm:px-6
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {/* Search */}

            <div className="relative w-full sm:max-w-xs lg:max-w-sm">
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
                className="
                  h-9 w-full rounded-md
                  border border-zinc-200
                  bg-white pl-9 pr-3
                  text-xs text-zinc-800
                  outline-none transition
                  placeholder:text-zinc-400
                  focus:border-zinc-400
                  dark:border-zinc-800
                  dark:bg-zinc-950
                  dark:text-zinc-100
                "
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

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as
                      | "default"
                      | "due-asc"
                      | "due-desc"
                      | "priority-high"
                      | "priority-low"
                      | "title-asc"
                      | "title-desc",
                  )
                }
                className="
                  h-9 w-full appearance-none
                  rounded-md border border-zinc-200
                  bg-white pl-8 pr-8
                  text-xs text-zinc-600
                  outline-none transition
                  focus:border-zinc-400
                  dark:border-zinc-800
                  dark:bg-zinc-950
                  dark:text-zinc-300
                  sm:w-auto
                "
                aria-label="Sort tasks"
              >
                <option value="default">Sort</option>
                <option value="due-asc">
                  Due date: Earliest
                </option>
                <option value="due-desc">
                  Due date: Latest
                </option>
                <option value="priority-high">
                  Priority: High to Low
                </option>
                <option value="priority-low">
                  Priority: Low to High
                </option>
                <option value="title-asc">
                  Title: A to Z
                </option>
                <option value="title-desc">
                  Title: Z to A
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  flex h-9 items-center gap-1.5
                  rounded-md border border-zinc-200
                  px-2.5 text-[10px] font-medium
                  text-zinc-500 transition
                  hover:bg-zinc-50 hover:text-zinc-800
                  dark:border-zinc-800
                  dark:hover:bg-zinc-900
                  dark:hover:text-zinc-200
                "
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          {/* View switcher */}

          <div
            className="
              flex w-full items-center
              rounded-md border border-zinc-200 p-1
              dark:border-zinc-800
              sm:w-auto
            "
          >
            <button
              type="button"
              onClick={() =>
                setView("board")
              }
              className={`flex flex-1 items-center justify-center gap-1 rounded px-3 py-1.5 text-[10px] font-medium transition sm:flex-none ${
                view === "board"
                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
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
              className={`flex flex-1 items-center justify-center gap-1 rounded px-3 py-1.5 text-[10px] font-medium transition sm:flex-none ${
                view === "list"
                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <List className="h-3 w-3" />
              List
            </button>
          </div>
        </div>

        {/* Task content */}

        <div
          className="
            min-w-0 flex-1
            overflow-x-auto overflow-y-auto
            p-3 sm:p-6
          "
        >
          {sortedTasks.length === 0 ? (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  No tasks found
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Try changing your search or filters.
                </p>
              </div>
            </div>
          ) : view === "board" ? (
          <TaskBoard
                tasks={sortedTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
            />
          ) : (
           <TaskList
            tasks={sortedTasks}
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