"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AddTaskModal from "@/app/tasks/AddTaskModal";

import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import {
  ApiProject,
  ApiTask,
  TaskPriority,
  TaskStatus,
  deleteTask,
  getProject,
  updateTask,
} from "@/lib/api";

// =====================================================
// Priority Config
// =====================================================

const priorityConfig: Record<
  TaskPriority,
  {
    label: string;
    className: string;
  }
> = {
  URGENT: {
    label: "Urgent",
    className:
      "text-rose-600 dark:text-rose-400",
  },

  HIGH: {
    label: "High",
    className:
      "text-red-500 dark:text-red-400",
  },

  MEDIUM: {
    label: "Medium",
    className:
      "text-orange-500 dark:text-orange-400",
  },

  LOW: {
    label: "Low",
    className:
      "text-blue-500 dark:text-blue-400",
  },

  NO_PRIORITY: {
    label: "No Priority",
    className:
      "text-zinc-400 dark:text-zinc-500",
  },
};

// =====================================================
// Status Config
// =====================================================

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  TODO: {
    label: "To Do",
    className:
      "text-zinc-600 dark:text-zinc-300",
  },

  DOING: {
    label: "In Progress",
    className:
      "text-blue-600 dark:text-blue-400",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "text-emerald-600 dark:text-emerald-400",
  },

  ON_HOLD: {
    label: "On Hold",
    className:
      "text-amber-600 dark:text-amber-400",
  },
};

// =====================================================
// Page
// =====================================================

export default function ProjectDetailPage() {
  const router = useRouter();

  const params = useParams();

  const projectId =
    typeof params?.projectId === "string"
      ? params.projectId
      : Array.isArray(params?.projectId)
        ? params.projectId[0]
        : "";

  // =====================================================
  // State
  // =====================================================

  const [project, setProject] =
    useState<ApiProject | null>(null);

  const [addTaskOpen, setAddTaskOpen] =
  useState(false);

  const [tasks, setTasks] =
    useState<ApiTask[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [taskMenu, setTaskMenu] =
    useState<string | null>(null);

  const [updatingTask, setUpdatingTask] =
    useState<string | null>(null);

  const [deletingTask, setDeletingTask] =
    useState<string | null>(null);

  // =====================================================
  // Load Project
  // =====================================================

  const loadProject = useCallback(
    async () => {
      if (!projectId) {
        setError(
          "Project ID is missing.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getProject(projectId);

        setProject(data);
        setTasks(data.tasks ?? []);
      } catch (err) {
        console.error(
          "Failed to load project:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project.",
        );
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // =====================================================
  // Close Task Menu
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      const menu =
        document.querySelector(
          "[data-task-menu]",
        );

      if (
        menu &&
        menu.contains(target)
      ) {
        return;
      }

      setTaskMenu(null);
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
  }, []);

  // =====================================================
  // Change Task Status
  // =====================================================

  const handleStatusChange = async (
    task: ApiTask,
    status: TaskStatus,
  ) => {
    if (task.status === status) {
      setTaskMenu(null);
      return;
    }

    try {
      setUpdatingTask(task.id);

      const updated =
        await updateTask(task.id, {
          status,
        });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? {
                ...item,
                ...updated,
              }
            : item,
        ),
      );

      setTaskMenu(null);
    } catch (err) {
      console.error(
        "Failed to update task:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update task.",
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  // =====================================================
  // Delete Task
  // =====================================================

  const handleDeleteTask = async (
    task: ApiTask,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${task.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTask(task.id);

      await deleteTask(task.id);

      setTasks((current) =>
        current.filter(
          (item) =>
            item.id !== task.id,
        ),
      );

      setTaskMenu(null);
    } catch (err) {
      console.error(
        "Failed to delete task:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete task.",
      );
    } finally {
      setDeletingTask(null);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading project...
          </div>
        </div>
      </AppShell>
    );
  }

  // =====================================================
  // Error / Project Not Found
  // =====================================================

  if (error || !project) {
    return (
      <AppShell>
        <div className="min-h-screen bg-white px-4 py-8 dark:bg-zinc-950 sm:px-6">
          <button
            type="button"
            onClick={() =>
              router.push("/projects")
            }
            className="
              mb-6
              flex
              items-center
              gap-2
              text-xs
              text-zinc-500
              transition
              hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:text-zinc-100
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>

          <div
            className="
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-4
              text-sm
              text-red-600
              dark:border-red-900/50
              dark:bg-red-950/20
              dark:text-red-400
            "
          >
            {error ||
              "Project not found."}
          </div>
        </div>
      </AppShell>
    );
  }

  // =====================================================
  // Statistics
  // =====================================================

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "COMPLETED",
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "DOING",
    ).length;

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "TODO",
    ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100,
        );

  // =====================================================
  // Render
  // =====================================================

  return (
    <AppShell>
      <div
        className="
          min-h-screen
          bg-white
          text-zinc-900
          dark:bg-zinc-950
          dark:text-zinc-100
        "
      >
        {/* =================================================
            Top Navigation
        ================================================= */}

        <div
          className="
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div
            className="
              flex
              min-h-[60px]
              items-center
              px-4
              sm:px-6
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/projects",
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-md
                px-2
                py-1.5
                text-xs
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-900
                dark:text-zinc-400
                dark:hover:bg-zinc-900
                dark:hover:text-zinc-100
              "
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Projects
            </button>
          </div>
        </div>

        {/* =================================================
            Project Header
        ================================================= */}

        <div
          className="
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div
            className="
              mx-auto
              max-w-[1200px]
              px-4
              py-6
              sm:px-6
              lg:px-8
            "
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* Project Information */}

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    Project
                  </span>

                  <span className="text-zinc-300 dark:text-zinc-700">
                    /
                  </span>

                  <PriorityBadge
                    priority={
                      project.priority
                    }
                  />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {project.name}
                </h1>

                {project.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {
                      project.description
                    }
                  </p>
                )}
              </div>

              {/* Project Metadata */}

              <div className="flex flex-wrap items-center gap-3">
                <InfoCard
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Due date"
                  value={formatDate(
                    project.dueDate,
                  )}
                />

                <InfoCard
                  icon={
                    <Users className="h-4 w-4" />
                  }
                  label="Tasks"
                  value={`${totalTasks}`}
                />

                <InfoCard
                  icon={
                    <CheckCircle2 className="h-4 w-4" />
                  }
                  label="Progress"
                  value={`${progress}%`}
                />
              </div>
            </div>

            {/* Lead */}

            <div className="mt-5 flex items-center gap-3">
              <Avatar
                name={
                  project.lead?.name ||
                  "No lead"
                }
                avatar={
                  project.lead?.avatar
                }
              />

              <div>
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                  Project lead
                </p>

                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {project.lead?.name ||
                    "No lead assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            Main Content
        ================================================= */}

        <main
          className="
            mx-auto
            max-w-[1200px]
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >
          {/* Error */}

          {error && (
            <div
              className="
                mb-5
                rounded-md
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                text-red-600
                dark:border-red-900/50
                dark:bg-red-950/20
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              Stats
          ================================================= */}

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Total tasks"
              value={totalTasks}
            />

            <StatCard
              label="To do"
              value={todoTasks}
            />

            <StatCard
              label="In progress"
              value={inProgressTasks}
            />

            <StatCard
              label="Completed"
              value={completedTasks}
            />
          </div>

          {/* =================================================
              Progress
          ================================================= */}

          <div
            className="
              mb-6
              rounded-lg
              border
              border-zinc-200
              bg-white
              p-4
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">
                  Project progress
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  {completedTasks} of{" "}
                  {totalTasks} tasks
                  completed
                </p>
              </div>

              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {progress}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="
                  h-full
                  rounded-full
                  bg-violet-600
                  transition-all
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              Tasks Header
          ================================================= */}

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2 className="text-sm font-semibold">
                Tasks
              </h2>

              <p className="mt-0.5 text-[10px] text-zinc-400">
                Tasks belonging to this
                project
              </p>
            </div>

            <button
  type="button"
  onClick={() =>
    setAddTaskOpen(true)
  }
  className="
    flex
    h-8
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
    active:scale-[0.98]
    dark:bg-white
    dark:text-black
    dark:hover:bg-zinc-200
  "
>
  <Plus className="h-3.5 w-3.5" />
  Add Task
</button>
          </div>

          {/* =================================================
              Tasks Table
          ================================================= */}

          <div
            className="
              overflow-visible
              rounded-lg
              border
              border-zinc-200
              dark:border-zinc-800
            "
          >
            {tasks.length === 0 ? (
              <EmptyTasks />
            ) : (
              <div>
                {/* Header */}

                <div
                  className="
                    hidden
                    grid-cols-[minmax(240px,1fr)_150px_140px_140px_48px]
                    border-b
                    border-zinc-200
                    bg-zinc-50/70
                    px-3
                    py-3
                    text-[10px]
                    font-medium
                    text-zinc-400
                    dark:border-zinc-800
                    dark:bg-zinc-900/60
                    sm:grid
                  "
                >
                  <span>Task</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Due date</span>
                  <span />
                </div>

                {/* Rows */}

                {tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    menuOpen={
                      taskMenu ===
                      task.id
                    }
                    updating={
                      updatingTask ===
                      task.id
                    }
                    deleting={
                      deletingTask ===
                      task.id
                    }
                    onMenu={() =>
                      setTaskMenu(
                        taskMenu ===
                          task.id
                          ? null
                          : task.id,
                      )
                    }
                    onStatusChange={(
                      status,
                    ) =>
                      handleStatusChange(
                        task,
                        status,
                      )
                    }
                    onDelete={() =>
                      handleDeleteTask(
                        task,
                      )
                    }
                    onOpen={() =>
                      router.push(
                        `/tasks/${task.id}`,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        
      </div>
      <AddTaskModal
  open={addTaskOpen}
  onClose={() =>
    setAddTaskOpen(false)
  }
  workspaceId={project.workspaceId}
  projectId={project.id}
  onCreated={(task) => {
    setTasks((current) => [
      task,
      ...current,
    ]);

    setAddTaskOpen(false);
  }}
/>
    </AppShell>
  );
}

// =====================================================
// Task Row
// =====================================================

function TaskRow({
  task,
  menuOpen,
  updating,
  deleting,
  onMenu,
  onStatusChange,
  onDelete,
  onOpen,
}: {
  task: ApiTask;
  menuOpen: boolean;
  updating: boolean;
  deleting: boolean;
  onMenu: () => void;
  onStatusChange: (
    status: TaskStatus,
  ) => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="
        relative
        border-b
        border-zinc-100
        last:border-0
        hover:bg-zinc-50
        dark:border-zinc-800
        dark:hover:bg-zinc-900/60
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-3
          px-3
          py-3.5
          sm:grid-cols-[minmax(240px,1fr)_150px_140px_140px_48px]
          sm:items-center
          sm:gap-0
        "
      >
        {/* Task */}

        <div className="min-w-0">
          <button
            type="button"
            onClick={onOpen}
            className="
              max-w-full
              truncate
              text-left
              text-xs
              font-medium
              text-zinc-800
              transition
              hover:text-violet-600
              dark:text-zinc-200
              dark:hover:text-violet-400
            "
          >
            {task.title}
          </button>

          {task.description && (
            <p className="mt-0.5 max-w-[450px] truncate text-[10px] text-zinc-400">
              {task.description}
            </p>
          )}

          {/* Mobile metadata */}

          <div className="mt-2 flex flex-wrap items-center gap-3 sm:hidden">
            <StatusBadge
              status={task.status}
            />

            <PriorityBadge
              priority={task.priority}
            />

            <span className="text-[10px] text-zinc-400">
              {formatDate(
                task.dueDate,
              )}
            </span>
          </div>
        </div>

        {/* Status */}

        <div className="hidden sm:block">
          <StatusBadge
            status={task.status}
          />
        </div>

        {/* Priority */}

        <div className="hidden sm:block">
          <PriorityBadge
            priority={task.priority}
          />
        </div>

        {/* Due date */}

        <div className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
          {formatDate(
            task.dueDate,
          )}
        </div>

        {/* Actions */}

        <div className="absolute right-3 top-3.5 sm:relative sm:right-auto sm:top-auto sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Task actions"
            className="
              rounded-md
              p-1.5
              text-zinc-400
              transition
              hover:bg-zinc-100
              hover:text-zinc-700
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-200
            "
          >
            {updating ||
            deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </button>

          {menuOpen && (
            <TaskMenu
              task={task}
              deleting={deleting}
              onOpen={onOpen}
              onStatusChange={
                onStatusChange
              }
              onDelete={onDelete}
            />
          )}
        </div>
      </div>

      {/* Assignee */}

      {task.assignee && (
        <div className="px-3 pb-3 sm:hidden">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Avatar
              name={
                task.assignee.name
              }
              avatar={
                task.assignee.avatar
              }
              size="small"
            />

            {task.assignee.name}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// Task Menu
// =====================================================

function TaskMenu({
  task,
  deleting,
  onOpen,
  onStatusChange,
  onDelete,
}: {
  task: ApiTask;
  deleting: boolean;
  onOpen: () => void;
  onStatusChange: (
    status: TaskStatus,
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div
      data-task-menu
      className="
        absolute
        right-0
        top-9
        z-[80]
        w-48
        rounded-lg
        border
        border-zinc-200
        bg-white
        p-1
        shadow-xl
        dark:border-zinc-800
        dark:bg-zinc-900
      "
    >
      <button
        type="button"
        onClick={onOpen}
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-md
          px-2.5
          py-2
          text-left
          text-xs
          hover:bg-zinc-100
          dark:hover:bg-zinc-800
        "
      >
        <Pencil className="h-3.5 w-3.5" />
        Open task
      </button>

      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

      <p className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-zinc-400">
        Change status
      </p>

      {(
        [
          "TODO",
          "DOING",
          "COMPLETED",
          "ON_HOLD",
        ] as TaskStatus[]
      ).map((status) => (
        <button
          key={status}
          type="button"
          onClick={() =>
            onStatusChange(status)
          }
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-md
            px-2.5
            py-2
            text-left
            text-xs
            hover:bg-zinc-100
            dark:hover:bg-zinc-800
          "
        >
          <span
            className={
              statusConfig[
                status
              ].className
            }
          >
            {
              statusConfig[
                status
              ].label
            }
          </span>

          {task.status ===
            status && (
            <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
          )}
        </button>
      ))}

      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

      <button
        type="button"
        disabled={deleting}
        onClick={onDelete}
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-md
          px-2.5
          py-2
          text-left
          text-xs
          text-red-500
          hover:bg-red-50
          disabled:opacity-50
          dark:hover:bg-red-950/30
        "
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}

        Delete task
      </button>
    </div>
  );
}

// =====================================================
// Empty Tasks
// =====================================================

function EmptyTasks() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
      <div
        className="
          mb-3
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-zinc-100
          dark:bg-zinc-900
        "
      >
        <CheckCircle2 className="h-5 w-5 text-zinc-400" />
      </div>

      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
        No tasks yet
      </p>

      <p className="mt-1 max-w-xs text-xs text-zinc-400">
        Add tasks to this project to
        start tracking your work.
      </p>
    </div>
  );
}

// =====================================================
// Stat Card
// =====================================================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-zinc-200
        bg-white
        px-4
        py-3
        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      <p className="text-[10px] text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// Info Card
// =====================================================

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        min-w-[100px]
        items-center
        gap-2
        rounded-md
        border
        border-zinc-200
        px-3
        py-2
        dark:border-zinc-800
      "
    >
      <span className="text-zinc-400">
        {icon}
      </span>

      <div>
        <p className="text-[9px] text-zinc-400">
          {label}
        </p>

        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// Priority Badge
// =====================================================

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  const config =
    priorityConfig[priority];

  return (
    <div
      className={`flex items-center gap-1.5 ${config.className}`}
    >
      <span className="text-[10px]">
        {priority === "URGENT"
          ? "▲"
          : priority === "HIGH"
            ? "▰"
            : priority === "MEDIUM"
              ? "◒"
              : "·"}
      </span>

      <span className="text-xs">
        {config.label}
      </span>
    </div>
  );
}

// =====================================================
// Status Badge
// =====================================================

function StatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  const config =
    statusConfig[status];

  return (
    <div
      className={`flex items-center gap-1.5 ${config.className}`}
    >
      {status === "COMPLETED" ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : status === "DOING" ? (
        <Clock3 className="h-3.5 w-3.5" />
      ) : status === "ON_HOLD" ? (
        <Circle className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}

      <span className="text-xs">
        {config.label}
      </span>
    </div>
  );
}

// =====================================================
// Avatar
// =====================================================

function Avatar({
  name,
  avatar,
  size = "normal",
}: {
  name: string;
  avatar?: string | null;
  size?: "small" | "normal";
}) {
  const sizeClass =
    size === "small"
      ? "h-5 w-5 text-[8px]"
      : "h-8 w-8 text-[10px]";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClass}
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-zinc-100
        font-medium
        text-zinc-600
        dark:bg-zinc-800
        dark:text-zinc-300
      `}
    >
      {name
        .split(" ")
        .map(
          (part) =>
            part[0],
        )
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
}

// =====================================================
// Date
// =====================================================

function formatDate(
  date?: string | null,
) {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}