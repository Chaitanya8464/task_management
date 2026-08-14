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
  Send,
  Trash2,
  User,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ApiTaskDetails,
  createComment,
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

  // =====================================================
  // Subtask states
  // =====================================================

  const [newSubtask, setNewSubtask] =
    useState("");

  const [isSubtaskInputOpen, setIsSubtaskInputOpen] =
    useState(false);

  const [isAddingSubtask, setIsAddingSubtask] =
    useState(false);

  const [subtaskError, setSubtaskError] =
    useState("");

  // =====================================================
  // Comment states
  // =====================================================

  const [newComment, setNewComment] =
    useState("");

  const [isAddingComment, setIsAddingComment] =
    useState(false);

  const [commentError, setCommentError] =
    useState("");

  // =====================================================
  // Load task
  // =====================================================

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

  // =====================================================
  // Add subtask
  // =====================================================

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

      setIsSubtaskInputOpen(true);
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

  // =====================================================
  // Toggle subtask completion
  // =====================================================

  const handleToggleSubtask = async (
    subtaskId: string,
    completed: boolean,
  ) => {
    if (!task) {
      return;
    }

    const previousTask = task;

    // Optimistic update
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

      // Roll back if API fails
      setTask(previousTask);

      setSubtaskError(
        "Unable to update subtask. Please try again.",
      );
    }
  };

  // =====================================================
  // Delete subtask
  // =====================================================

  const handleDeleteSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this subtask?",
    );

    if (!confirmed) {
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

  // =====================================================
  // Add comment
  // =====================================================

  const handleAddComment = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const content = newComment.trim();

    if (!content || !task) {
      return;
    }

    try {
      setIsAddingComment(true);
      setCommentError("");

      /*
       * Get logged-in user from localStorage.
       *
       * Your guest user ID is:
       * e5967057-eec5-4f77-9887-adad44fc3429
       */

      const storedUser =
        localStorage.getItem("taskflow_user");

      let userId =
        "e5967057-eec5-4f77-9887-adad44fc3429";

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          if (user?.id) {
            userId = user.id;
          }
        } catch {
          console.warn(
            "Could not parse stored user. Using guest user.",
          );
        }
      }

      const created =
        await createComment(
          task.id,
          {
            content,
            userId,
          },
        );

      setTask((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          comments: [
            ...current.comments,
            created,
          ],
        };
      });

      setNewComment("");
    } catch (error) {
      console.error(
        "Failed to create comment:",
        error,
      );

      setCommentError(
        "Unable to add comment. Please try again.",
      );
    } finally {
      setIsAddingComment(false);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

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

  // =====================================================
  // Error
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

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

            {/* =====================================================
                Subtasks
            ===================================================== */}

            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">

                <div>
                  <h3 className="text-sm font-semibold">
                    Subtasks
                  </h3>

                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {completedSubtasks} of{" "}
                    {task.subtasks.length}{" "}
                    completed
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubtaskInputOpen(
                      (current) => !current,
                    );

                    setSubtaskError("");
                  }}
                  className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-3 w-3" />

                  {isSubtaskInputOpen
                    ? "Close"
                    : "Add"}
                </button>

              </div>

              {/* Add Subtask Form */}

              {isSubtaskInputOpen && (
                <form
                  onSubmit={handleAddSubtask}
                  className="border-b border-zinc-100 p-4 dark:border-zinc-800"
                >

                  <div className="flex gap-2">

                    <input
                      autoFocus
                      value={newSubtask}
                      onChange={(event) =>
                        setNewSubtask(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Escape" &&
                          !isAddingSubtask
                        ) {
                          setIsSubtaskInputOpen(
                            false,
                          );

                          setNewSubtask("");

                          setSubtaskError("");
                        }
                      }}
                      placeholder="Enter subtask title..."
                      disabled={isAddingSubtask}
                      className="h-9 min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 dark:focus:ring-violet-950"
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
              )}

              {/* Subtask List */}

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
                        className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      >

                        {/* Toggle */}

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

                        {/* Delete */}

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

              {subtaskError &&
                !isSubtaskInputOpen && (
                  <p className="border-t border-zinc-100 px-5 py-2 text-[10px] text-red-500 dark:border-zinc-800">
                    {subtaskError}
                  </p>
                )}

            </div>

            {/* =====================================================
                Updates / Comments
            ===================================================== */}

            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

              {/* Updates Header */}

              <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">

                <h3 className="text-sm font-semibold">
                  Updates
                </h3>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  Activity and comments for this task.
                </p>

              </div>

              {/* Existing Comments */}

              <div className="p-5">

                {task.comments.length === 0 ? (

                  <div className="py-4 text-center">
                    <MessageCircle className="mx-auto h-5 w-5 text-zinc-300 dark:text-zinc-700" />

                    <p className="mt-2 text-xs text-zinc-400">
                      No comments yet.
                    </p>
                  </div>

                ) : (

                  <div className="space-y-5">

                    {task.comments.map(
                      (comment) => (

                        <div
                          key={comment.id}
                          className="flex gap-3"
                        >

                          {/* Avatar */}

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">

                            <User className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />

                          </div>

                          {/* Comment content */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                {comment.user?.name ||
                                  "User"}
                              </p>

                              <span className="text-[10px] text-zinc-400">
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleString()}
                              </span>

                            </div>

                            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                              {comment.content}
                            </p>

                          </div>

                        </div>

                      ),
                    )}

                  </div>

                )}

              </div>

              {/* =====================================================
                  Add Comment Form
              ===================================================== */}

              <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">

                <form
                  onSubmit={handleAddComment}
                  className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                >

                  <textarea
                    value={newComment}
                    onChange={(event) =>
                      setNewComment(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {

                      /*
                       * Enter = submit
                       * Shift + Enter = new line
                       */

                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (
                          newComment.trim() &&
                          !isAddingComment
                        ) {
                          event.currentTarget.form?.requestSubmit();
                        }
                      }

                    }}
                    placeholder="Write an update..."
                    rows={3}
                    disabled={isAddingComment}
                    className="w-full resize-none rounded-lg bg-transparent px-3 py-2.5 text-xs text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100"
                  />

                  {/* Error */}

                  {commentError && (
                    <p className="px-3 pb-2 text-[10px] text-red-500">
                      {commentError}
                    </p>
                  )}

                  {/* Form footer */}

                  <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">

                    <span className="text-[10px] text-zinc-400">
                      Enter to comment · Shift + Enter for new line
                    </span>

                    <button
                      type="submit"
                      disabled={
                        !newComment.trim() ||
                        isAddingComment
                      }
                      className="flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >

                      <Send className="h-3 w-3" />

                      {isAddingComment
                        ? "Posting..."
                        : "Comment"}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </section>

          {/* =====================================================
              Details Sidebar
          ===================================================== */}

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