"use client";

import { useEffect, useRef, useState } from "react";

import {
  List,
  Plus,
  Search,
  LayoutGrid,
  ArrowUpDown,
  RotateCcw,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskList from "@/components/tasks/TaskList";
import TaskFilters from "@/components/tasks/TaskFilters";
import FieldsMenu from "@/components/tasks/FieldsMenu";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";

import {
  getTasks,
  updateTask,
  ApiTask,
} from "@/lib/api";

import { Task } from "@/components/tasks/TaskCard";

/* =========================================================
   API → UI STATUS
========================================================= */

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

/* =========================================================
   API → UI PRIORITY
========================================================= */

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

/* =========================================================
   API TASK → UI TASK
========================================================= */

function mapApiTaskToUiTask(
  task: ApiTask,
): Task {
  return {
    id: task.id,
    title: task.title,

    description:
      task.description ?? undefined,

    priority:
      mapTaskPriority(task.priority),

    status:
      mapTaskStatus(task.status),

    assignee:
      task.assignee?.name ??
      "Unassigned",

    dueDate: task.dueDate
      ? formatDueDate(task.dueDate)
      : "No due date",

    comments:
      task.comments?.length ?? 0,
  };
}

/* =========================================================
   FIGMA DATE FORMAT
   Example: 12 Sep 2026
========================================================= */

function formatDueDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/* =========================================================
   SORT TYPE
========================================================= */

type SortOption =
  | "default"
  | "due-asc"
  | "due-desc"
  | "priority-high"
  | "priority-low"
  | "title-asc"
  | "title-desc";

/* =========================================================
   PAGE
========================================================= */

export default function TasksPage() {
  /* =======================================================
     TASKS
  ======================================================= */

  const [taskList, setTaskList] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     VIEW
  ======================================================= */

  const [view, setView] =
    useState<"board" | "list">(
      "list",
    );

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [searchOpen, setSearchOpen] =
    useState(false);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [filters, setFilters] =
    useState({
      status: "All",
      priority: "All",
      assignee: "All",
    });

  /* =======================================================
     SORTING
  ======================================================= */

  const [sortBy, setSortBy] =
    useState<SortOption>("default");

  const [sortMenuOpen, setSortMenuOpen] =
    useState(false);
  const sortMenuRef =
  useRef<HTMLDivElement>(null);
  useEffect(() => {
  if (!sortMenuOpen) return;

  const handleOutsideClick = (
    event: MouseEvent,
  ) => {
    const target =
      event.target as Node;

    if (
      sortMenuRef.current &&
      !sortMenuRef.current.contains(
        target,
      )
    ) {
      setSortMenuOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleOutsideClick,
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick,
    );
  };
}, [sortMenuOpen]);
  /* =======================================================
     FIELDS
  ======================================================= */

  const [fields, setFields] =
    useState({
      priority: true,
      members: true,
      dueDate: true,
      comments: true,
    });

  /* =======================================================
     ADD TASK
  ======================================================= */

  const [
    isAddTaskOpen,
    setIsAddTaskOpen,
  ] = useState(false);

  /* =======================================================
     EDIT TASK
  ======================================================= */

  const [
    editingTask,
    setEditingTask,
  ] = useState<Task | null>(null);

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const [
    deletingTask,
    setDeletingTask,
  ] = useState<Task | null>(null);

  /* =======================================================
     LOAD TASKS
  ======================================================= */

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
          JSON.parse(
            storedWorkspace,
          );

        if (!workspace?.id) {
          throw new Error(
            "Invalid workspace session.",
          );
        }

        const data =
          await getTasks(
            workspace.id,
          );

        setTaskList(
          data.map(
            mapApiTaskToUiTask,
          ),
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

  /* =======================================================
     ADD TASK
  ======================================================= */

  const handleAddTask = (
    task: Task,
  ) => {
    setTaskList(
      (currentTasks) => [
        ...currentTasks,
        task,
      ],
    );
  };

  /* =======================================================
     EDIT TASK
  ======================================================= */

  const handleEditTask = (
    task: Task,
  ) => {
    setEditingTask(task);
  };

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const handleDeleteTask = (
    task: Task,
  ) => {
    setDeletingTask(task);
  };

  const handleDeletedTask = (
    taskId: string,
  ) => {
    setTaskList(
      (currentTasks) =>
        currentTasks.filter(
          (task) =>
            task.id !== taskId,
        ),
    );

    setDeletingTask(null);
  };

  /* =======================================================
     UPDATE TASK
  ======================================================= */

  const handleUpdatedTask = (
    updatedTask: Task,
  ) => {
    setTaskList(
      (currentTasks) =>
        currentTasks.map(
          (task) =>
            task.id ===
            updatedTask.id
              ? updatedTask
              : task,
        ),
    );

    setEditingTask(null);
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange = async (
    task: Task,
    newStatus: Task["status"],
  ) => {
    if (
      task.status ===
      newStatus
    ) {
      return;
    }

    const statusMap = {
      "To Do": "TODO",
      Doing: "DOING",
      Completed:
        "COMPLETED",
      "On Hold": "ON_HOLD",
    } as const;

    try {
      const updatedTask =
        await updateTask(
          task.id,
          {
            status:
              statusMap[
                newStatus
              ],
          },
        );

      setTaskList(
        (currentTasks) =>
          currentTasks.map(
            (currentTask) =>
              currentTask.id ===
              task.id
                ? {
                    ...currentTask,
                    status:
                      newStatus,
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

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */

  const filteredTasks =
    taskList.filter(
      (task) => {
        const query =
          search
            .toLowerCase()
            .trim();

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
          filters.status ===
            "All" ||
          task.status ===
            filters.status;

        const matchesPriority =
          filters.priority ===
            "All" ||
          task.priority ===
            filters.priority;

        const matchesAssignee =
          filters.assignee ===
            "All" ||
          task.assignee ===
            filters.assignee;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee
        );
      },
    );

  /* =======================================================
     SORTING
  ======================================================= */

  const priorityRank: Record<
    Task["priority"],
    number
  > = {
    Urgent: 5,
    High: 4,
    Medium: 3,
    Low: 2,
    "No Priority": 1,
  };

  const parseDueDate = (
    value: string,
  ) => {
    if (
      value ===
      "No due date"
    ) {
      return null;
    }

    const time =
      new Date(
        value,
      ).getTime();

    return Number.isNaN(time)
      ? null
      : time;
  };

  const sortedTasks =
    [...filteredTasks].sort(
      (a, b) => {
        switch (sortBy) {
          case "title-asc":
            return a.title.localeCompare(
              b.title,
            );

          case "title-desc":
            return b.title.localeCompare(
              a.title,
            );

          case "priority-high":
            return (
              priorityRank[
                b.priority
              ] -
              priorityRank[
                a.priority
              ]
            );

          case "priority-low":
            return (
              priorityRank[
                a.priority
              ] -
              priorityRank[
                b.priority
              ]
            );

          case "due-asc": {
            const aDate =
              parseDueDate(
                a.dueDate,
              );

            const bDate =
              parseDueDate(
                b.dueDate,
              );

            if (
              aDate === null &&
              bDate === null
            ) {
              return 0;
            }

            if (
              aDate === null
            ) {
              return 1;
            }

            if (
              bDate === null
            ) {
              return -1;
            }

            return (
              aDate - bDate
            );
          }

          case "due-desc": {
            const aDate =
              parseDueDate(
                a.dueDate,
              );

            const bDate =
              parseDueDate(
                b.dueDate,
              );

            if (
              aDate === null &&
              bDate === null
            ) {
              return 0;
            }

            if (
              aDate === null
            ) {
              return 1;
            }

            if (
              bDate === null
            ) {
              return -1;
            }

            return (
              bDate - aDate
            );
          }

          default:
            return 0;
        }
      },
    );

  /* =======================================================
     SORT LABEL
  ======================================================= */

  const getSortLabel = (
    value: SortOption,
  ) => {
    switch (value) {
      case "due-asc":
        return "Due date: Earliest";

      case "due-desc":
        return "Due date: Latest";

      case "priority-high":
        return "Priority: High to Low";

      case "priority-low":
        return "Priority: Low to High";

      case "title-asc":
        return "Title: A to Z";

      case "title-desc":
        return "Title: Z to A";

      default:
        return "Sort";
    }
  };

  /* =======================================================
     SORT OPTIONS
  ======================================================= */

  const sortOptions: {
    value: SortOption;
    label: string;
  }[] = [
    {
      value: "default",
      label: "Default",
    },
    {
      value: "due-asc",
      label: "Due date: Earliest",
    },
    {
      value: "due-desc",
      label: "Due date: Latest",
    },
    {
      value: "priority-high",
      label: "Priority: High to Low",
    },
    {
      value: "priority-low",
      label: "Priority: Low to High",
    },
    {
      value: "title-asc",
      label: "Title: A to Z",
    },
    {
      value: "title-desc",
      label: "Title: Z to A",
    },
  ];

  /* =======================================================
     ACTIVE FILTERS
  ======================================================= */

  const hasActiveFilters =
    search.trim() !== "" ||
    filters.status !== "All" ||
    filters.priority !==
      "All" ||
    filters.assignee !==
      "All" ||
    sortBy !== "default";

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters =
    () => {
      setSearch("");

      setFilters({
        status: "All",
        priority: "All",
        assignee: "All",
      });

      setSortBy("default");
      setSortMenuOpen(false);
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div
              className="
                mx-auto
                h-6
                w-6
                animate-spin
                rounded-full
                border-2
                border-zinc-200
                border-t-zinc-900
                dark:border-zinc-700
                dark:border-t-zinc-100
              "
            />

            <p
              className="
                mt-3
                text-xs
                text-zinc-400
                dark:text-zinc-500
              "
            >
              Loading tasks...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

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
              className="
                mt-3
                rounded-md
                bg-black
                px-3
                py-2
                text-xs
                font-medium
                text-white
                transition
                hover:bg-zinc-800
              "
            >
              Try again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <AppShell>
      <div
        className="
          flex
          min-h-full
          flex-col
          bg-white
          dark:bg-zinc-950
        "
      >
        {/* =================================================
            TASK HEADER
        ================================================= */}

       <header
  className="
    border-b
    border-zinc-200
    dark:border-zinc-800
  "
>
  <div
    className="
      flex
      min-h-[72px]
      flex-col
      gap-3
      px-4
      py-3
      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:px-5
      sm:py-2
    "
  >
    {/* =================================================
        TITLE
    ================================================= */}

    <div className="shrink-0">
      <h1
        className="
          text-[14px]
          font-semibold
          tracking-tight
          text-zinc-900
          dark:text-zinc-100
        "
      >
        Tasks
      </h1>
    </div>

    {/* =================================================
        TOOLBAR
    ================================================= */}

    <div
      className="
         flex
    w-full
    flex-wrap
    items-center
    justify-start
    gap-2
    px-1
    sm:w-auto
    sm:px-0
    sm:justify-end
  "
    >
      {/* =================================================
          SEARCH
      ================================================= */}

      {searchOpen ? (
        <div
          className="
            relative
            h-8
            w-full
            sm:w-[180px]
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-2.5
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-zinc-400
            "
          />

          <input
            autoFocus
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search tasks..."
            className="
              h-full
              w-full
              rounded-md
              border
              border-zinc-200
              bg-white
              pl-8
              pr-8
              text-[11px]
              text-zinc-800
              outline-none
              placeholder:text-zinc-400
              focus:border-zinc-400
              dark:border-zinc-800
              dark:bg-zinc-950
              dark:text-zinc-100
            "
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchOpen(false);
            }}
            aria-label="Close search"
            className="
              absolute
              right-2
              top-1/2
              flex
              h-5
              w-5
              -translate-y-1/2
              items-center
              justify-center
              rounded
              text-zinc-400
              hover:bg-zinc-100
              hover:text-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            setSearchOpen(true)
          }
          aria-label="Search tasks"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-md
            border
            border-zinc-200
            bg-white
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-900
            dark:border-zinc-800
            dark:bg-zinc-950
            dark:text-zinc-400
            dark:hover:bg-zinc-900
            dark:hover:text-zinc-100
          "
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      )}

      {/* =================================================
          FIELDS
      ================================================= */}

      <FieldsMenu
        fields={fields}
        onChange={setFields}
      />

      {/* =================================================
          FILTERS
      ================================================= */}

      <TaskFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* =================================================
          SORT
      ================================================= */}

      <div
        className="relative shrink-0"
        ref={sortMenuRef}
      >
        <button
          type="button"
          onClick={() =>
            setSortMenuOpen(
              (current) => !current,
            )
          }
          aria-label="Sort tasks"
          aria-expanded={sortMenuOpen}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            border
            border-zinc-200
            bg-white
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-900
            dark:border-zinc-800
            dark:bg-zinc-950
            dark:text-zinc-400
            dark:hover:bg-zinc-900
            dark:hover:text-zinc-100
          "
          title={getSortLabel(sortBy)}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>

        {sortMenuOpen && (
          <div
            className="
              absolute
              right-0
              top-[calc(100%+6px)]
              z-[100]
              w-[200px]
              overflow-hidden
              rounded-md
              border
              border-zinc-200
              bg-white
              p-1
              shadow-lg
              dark:border-zinc-700
              dark:bg-zinc-900
            "
          >
            <div
              className="
                px-2.5
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-zinc-400
              "
            >
              Sort by
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800" />

            {sortOptions.map((option) => {
              const selected =
                sortBy === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSortBy(
                      option.value,
                    );
                    setSortMenuOpen(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded
                    px-2.5
                    py-2
                    text-left
                    text-xs
                    ${
                      selected
                        ? `
                          bg-zinc-100
                          font-medium
                          text-zinc-900
                          dark:bg-zinc-800
                          dark:text-zinc-100
                        `
                        : `
                          text-zinc-600
                          hover:bg-zinc-50
                          hover:text-zinc-900
                          dark:text-zinc-300
                          dark:hover:bg-zinc-800
                        `
                    }
                  `}
                >
                  <span className="truncate pr-2">
                    {option.label}
                  </span>

                  {selected && (
                    <Check className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================
          BOARD / LIST TOGGLE
      ================================================= */}

      <div
        className="
          flex
          h-8
          shrink-0
          items-center
          rounded-md
          border
          border-zinc-200
          bg-white
          p-0.5
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >
        {/* LIST */}

        <button
          type="button"
          onClick={() =>
            setView("list")
          }
          aria-label="List view"
          aria-pressed={view === "list"}
          className={`
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded
            transition
            ${
              view === "list"
                ? `
                  bg-zinc-100
                  text-zinc-900
                  dark:bg-zinc-800
                  dark:text-zinc-100
                `
                : `
                  text-zinc-400
                  hover:bg-zinc-50
                  hover:text-zinc-700
                  dark:hover:bg-zinc-900
                  dark:hover:text-zinc-200
                `
            }
          `}
        >
          <List className="h-3.5 w-3.5" />
        </button>

        {/* BOARD */}

        <button
          type="button"
          onClick={() =>
            setView("board")
          }
          aria-label="Board view"
          aria-pressed={view === "board"}
          className={`
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded
            transition
            ${
              view === "board"
                ? `
                  bg-zinc-100
                  text-zinc-900
                  dark:bg-zinc-800
                  dark:text-zinc-100
                `
                : `
                  text-zinc-400
                  hover:bg-zinc-50
                  hover:text-zinc-700
                  dark:hover:bg-zinc-900
                  dark:hover:text-zinc-200
                `
            }
          `}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* =================================================
          ADD TASK
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setIsAddTaskOpen(true)
        }
        className="
          flex
          h-8
          shrink-0
          items-center
          gap-1.5
          rounded-md
          bg-black
          px-3
          text-[11px]
          font-medium
          text-white
          transition
          hover:bg-zinc-800
          active:scale-[0.99]
          dark:bg-white
          dark:text-black
          dark:hover:bg-zinc-200
        "
      >
        <Plus className="h-3.5 w-3.5" />

        <span>Add Task</span>
      </button>
    </div>
  </div>
</header>

        {/* =================================================
            ACTIVE FILTER BAR
        ================================================= */}

        {hasActiveFilters && (
          <div
            className="
              flex
              min-h-[36px]
              items-center
              justify-between
              border-b
              border-zinc-100
              bg-zinc-50/50
              px-4
              py-1.5
              dark:border-zinc-800
              dark:bg-zinc-900/30
              sm:px-5
            "
          >
            <p
              className="
                text-[10px]
                text-zinc-400
                dark:text-zinc-500
              "
            >
              Filters applied
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="
                flex
                items-center
                gap-1.5
                rounded
                px-2
                py-1
                text-[10px]
                font-medium
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-800
                dark:hover:bg-zinc-800
                dark:hover:text-zinc-200
              "
            >
              <RotateCcw className="h-3 w-3" />

              Clear
            </button>
          </div>
        )}

        {/* =================================================
            TASK CONTENT
        ================================================= */}

        <div
         className="
          min-w-0
          flex-1
          overflow-x-hidden
          overflow-y-auto
          p-3
          sm:p-5
  "
        >
          {sortedTasks.length ===
          0 ? (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
              "
            >
              <div className="text-center">
                <p
                  className="
                    text-sm
                    font-medium
                    text-zinc-700
                    dark:text-zinc-200
                  "
                >
                  No tasks found
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-400
                    dark:text-zinc-500
                  "
                >
                  Try changing your
                  search or filters.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="
                      mt-3
                      text-xs
                      font-medium
                      text-zinc-700
                      underline
                      underline-offset-2
                      dark:text-zinc-300
                    "
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : view ===
            "list" ? (
            <TaskList
              tasks={sortedTasks}
              fields={fields}
              onEdit={
                handleEditTask
              }
              onDelete={
                handleDeleteTask
              }
            />
          ) : (
            <TaskBoard
              tasks={sortedTasks}
              onEdit={
                handleEditTask
              }
              onDelete={
                handleDeleteTask
              }
              onStatusChange={
                handleStatusChange
              }
            />
          )}
        </div>
      </div>

      {/* ===================================================
          ADD TASK MODAL
      =================================================== */}

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() =>
          setIsAddTaskOpen(false)
        }
        onAdd={handleAddTask}
      />

      {/* ===================================================
          EDIT TASK MODAL
      =================================================== */}

      <EditTaskModal
        isOpen={
          editingTask !== null
        }
        task={editingTask}
        onClose={() =>
          setEditingTask(null)
        }
        onUpdated={
          handleUpdatedTask
        }
      />

      {/* ===================================================
          DELETE TASK
      =================================================== */}

      <DeleteTaskDialog
        isOpen={
          deletingTask !== null
        }
        task={deletingTask}
        onClose={() =>
          setDeletingTask(null)
        }
        onDeleted={
          handleDeletedTask
        }
      />
    </AppShell>
  );
}