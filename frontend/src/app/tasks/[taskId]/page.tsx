"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import {
  ApiTaskDetails,
  createSubtask,
  deleteSubtask,
  getTaskDetails,
  updateSubtask,
} from "@/lib/api";

const statusLabels: Record<
  ApiTaskDetails["status"],
  string
> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

const priorityLabels: Record<
  ApiTaskDetails["priority"],
  string
> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NO_PRIORITY: "No Priority",
};

export default function TaskDetailsPage() {
  const params = useParams();

  const taskId = String(params.taskId);

  const [task, setTask] =
    useState<ApiTaskDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [newSubtask, setNewSubtask] =
    useState("");

  const [isAddingSubtask, setIsAddingSubtask] =
    useState(false);

  const [subtaskError, setSubtaskError] =
    useState("");

  // Load task
  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTaskDetails(taskId);

        setTask(data);
      } catch (error) {
        console.error(
          "Failed to load task:",
          error,
        );

        setError(
          "Unable to load task details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  // Add subtask
  const handleAddSubtask = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const title = newSubtask.trim();

    if (!title || !task) {
      return;
    }

    try {
      setIsAddingSubtask(true);
      setSubtaskError("");

      const created =
        await createSubtask(
          task.id,
          {
            title,
          },
        );

      setTask((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          subtasks: [
            ...current.subtasks,
            created,
          ],
        };
      });

      setNewSubtask("");
    } catch (error) {
      console.error(
        "Failed to create subtask:",
        error,
      );

      setSubtaskError(
        "Unable to create subtask. Please try again.",
      );
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (
    subtaskId: string,
    completed: boolean,
  ) => {
    if (!task) {
      return;
    }

    const previousTask = task;

    // Optimistic UI update
    setTask((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subtasks:
          current.subtasks.map(
            (subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    completed,
                  }
                : subtask,
          ),
      };
    });

    try {
      setSubtaskError("");

      const updated =
        await updateSubtask(
          task.id,
          subtaskId,
          {
            completed,
          },
        );

      setTask((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          subtasks:
            current.subtasks.map(
              (subtask) =>
                subtask.id === subtaskId
                  ? updated
                  : subtask,
            ),
        };
      });
    } catch (error) {
      console.error(
        "Failed to update subtask:",
        error,
      );

      // Roll back optimistic update
      setTask(previousTask);

      setSubtaskError(
        "Unable to update subtask. Please try again.",
      );
    }
  };

  // Delete subtask
  const handleDeleteSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) {
      return;
    }

    try {
      setSubtaskError("");

      await deleteSubtask(
        task.id,
        subtaskId,
      );

      setTask((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          subtasks:
            current.subtasks.filter(
              (subtask) =>
                subtask.id !== subtaskId,
            ),
        };
      });
    } catch (error) {
      console.error(
        "Failed to delete subtask:",
        error,
      );

      setSubtaskError(
        "Unable to delete subtask. Please try again.",
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-zinc-400">
            Loading task...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !task) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium">
              {error || "Task not found."}
            </p>

            <Link
              href="/tasks"
              className="mt-3 inline-flex text-xs text-violet-600 hover:underline"
            >
              Back to Tasks
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const completedSubtasks =
    task.subtasks.filter(
      (subtask) => subtask.completed,
    ).length;

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}

      <header className="flex min-h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <p className="text-[10px] text-zinc-400">
              Tasks / Task Details
            </p>

            <h1 className="text-sm font-semibold">
              {task.title}
            </h1>
          </div>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Content */}

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main */}

          <section className="space-y-5">
            {/* Task information */}

            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  {priorityLabels[task.priority]}
                </span>

                <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {statusLabels[task.status]}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                {task.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {task.description ||
                  "No description provided."}
              </p>
            </div>

            {/* Subtasks */}

            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold">
                    Subtasks
                  </h3>

                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {completedSubtasks} of{" "}
                    {task.subtasks.length} completed
                  </p>
                </div>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {task.subtasks.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-zinc-400">
                    No subtasks yet.
                  </div>
                ) : (
                  task.subtasks.map(
                    (subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center justify-between gap-3 px-5 py-3"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSubtask(
                              subtask.id,
                              !subtask.completed,
                            )
                          }
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          {subtask.completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                          )}

                          <span
                            className={`truncate text-xs ${
                              subtask.completed
                                ? "text-zinc-400 line-through"
                                : "text-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteSubtask(
                              subtask.id,
                            )
                          }
                          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                          aria-label={`Delete subtask ${subtask.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ),
                  )
                )}
              </div>

              {/* Add subtask */}

              <form
                onSubmit={handleAddSubtask}
                className="border-t border-zinc-100 p-4 dark:border-zinc-800"
              >
                <div className="flex gap-2">
                  <input
                    value={newSubtask}
                    onChange={(event) =>
                      setNewSubtask(
                        event.target.value,
                      )
                    }
                    placeholder="Add a subtask..."
                    disabled={isAddingSubtask}
                    className="h-9 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-950"
                  />

                  <button
                    type="submit"
                    disabled={
                      !newSubtask.trim() ||
                      isAddingSubtask
                    }
                    className="flex h-9 items-center gap-1.5 rounded-md bg-black px-3 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    <Plus className="h-3.5 w-3.5" />

                    {isAddingSubtask
                      ? "Adding..."
                      : "Add"}
                  </button>
                </div>

                {subtaskError && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {subtaskError}
                  </p>
                )}
              </form>
            </div>

            {/* Updates */}

            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">
                  Updates
                </h3>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  Activity and comments for this
                  task.
                </p>
              </div>

              <div className="p-5">
                {task.comments.length === 0 ? (
                  <p className="text-xs text-zinc-400">
                    No comments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {task.comments.map(
                      (comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <User className="h-3.5 w-3.5 text-zinc-500" />
                          </div>

                          <div>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300">
                              <span className="font-medium">
                                {comment.user
                                  ?.name ||
                                  "User"}
                              </span>
                            </p>

                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {comment.content}
                            </p>

                            <p className="mt-1 text-[10px] text-zinc-400">
                              {new Date(
                                comment.createdAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Details sidebar */}

          <aside className="h-fit rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <h3 className="text-sm font-semibold">
                Details
              </h3>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <DetailRow
                icon={
                  <Circle className="h-4 w-4" />
                }
                label="Status"
                value={
                  statusLabels[task.status]
                }
              />

              <DetailRow
                icon={
                  <Clock3 className="h-4 w-4" />
                }
                label="Priority"
                value={
                  priorityLabels[
                    task.priority
                  ]
                }
              />

              <DetailRow
                icon={
                  <User className="h-4 w-4" />
                }
                label="Assignee"
                value={
                  task.assignee?.name ||
                  "Unassigned"
                }
              />

              <DetailRow
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Due Date"
                value={
                  task.dueDate
                    ? new Date(
                        task.dueDate,
                      ).toLocaleDateString()
                    : "No date"
                }
              />

              <DetailRow
                icon={
                  <MessageCircle className="h-4 w-4" />
                }
                label="Comments"
                value={String(
                  task.comments.length,
                )}
              />

              <DetailRow
                icon={
                  <CheckCircle2 className="h-4 w-4" />
                }
                label="Task ID"
                value={task.id}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 text-zinc-400">
        {icon}

        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>

      <span className="max-w-[160px] truncate text-right text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
    </div>
  );
}