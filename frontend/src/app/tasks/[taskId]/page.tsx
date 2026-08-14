"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Send,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import { ApiTask, getTask, updateTask } from "@/lib/api";

type TaskStatus =
  | "TODO"
  | "DOING"
  | "COMPLETED"
  | "ON_HOLD";

type TaskPriority =
  | "URGENT"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NO_PRIORITY";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

const priorityLabels: Record<TaskPriority, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NO_PRIORITY: "No Priority",
};

const priorityStyles: Record<TaskPriority, string> = {
  URGENT:
    "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  HIGH:
    "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  MEDIUM:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  LOW:
    "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  NO_PRIORITY:
    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId;

  const [task, setTask] = useState<ApiTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    async function loadTask() {
      try {
        setLoading(true);
        setError("");

        const data = await getTask(taskId);

        setTask(data);
      } catch (error) {
        console.error("Failed to load task:", error);
        setError("Unable to load this task.");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId]);

  const handleStatusChange = async (
    status: TaskStatus,
  ) => {
    if (!task) return;

    try {
      setIsUpdating(true);

      const updatedTask = await updateTask(
        task.id,
        { status },
      );

      setTask(updatedTask);
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error,
      );

      setError(
        "Unable to update the task status.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (
    priority: TaskPriority,
  ) => {
    if (!task) return;

    try {
      setIsUpdating(true);

      const updatedTask = await updateTask(
        task.id,
        { priority },
      );

      setTask(updatedTask);
    } catch (error) {
      console.error(
        "Failed to update task priority:",
        error,
      );

      setError(
        "Unable to update the task priority.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (
    date: string | null | undefined,
  ) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading task...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error && !task) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>

            <Link
              href="/tasks"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Tasks
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!task) {
    return null;
  }

  const subtasks = Array.isArray(task.subtasks)
    ? task.subtasks
    : [];

  const comments = Array.isArray(task.comments)
    ? task.comments
    : [];

  return (
    <AppShell>
      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="flex min-h-16 items-center justify-between border-b border-zinc-200 px-4 sm:px-6 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Link
              href="/tasks"
              aria-label="Back to tasks"
              className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <p className="text-[10px] text-zinc-400">
                Tasks / Task Details
              </p>

              <h1 className="max-w-[500px] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {task.title}
              </h1>
            </div>
          </div>

          <button
            type="button"
            aria-label="Task actions"
            className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </header>

        {/* Error banner */}
        {error && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-400 sm:px-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            {/* Main */}
            <section className="space-y-5">
              {/* Task information */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                      priorityStyles[
                        task.priority
                      ]
                    }`}
                  >
                    {priorityLabels[
                      task.priority
                    ]}
                  </span>

                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {statusLabels[task.status]}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {task.title}
                </h2>

                {task.description ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm italic text-zinc-400">
                    No description provided.
                  </p>
                )}
              </div>

              {/* Subtasks */}
              <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Subtasks
                    </h3>

                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      Break this task into smaller steps.
                    </p>
                  </div>
                </div>

                {subtasks.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-xs text-zinc-400">
                      No subtasks yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {subtasks.map(
                      (
                        subtask: any,
                        index: number,
                      ) => (
                        <div
                          key={
                            subtask.id ??
                            index
                          }
                          className="flex items-center gap-3 px-5 py-3"
                        >
                          {subtask.completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                          )}

                          <span
                            className={`text-xs ${
                              subtask.completed
                                ? "text-zinc-400 line-through"
                                : "text-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            {subtask.title ??
                              "Untitled subtask"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Updates
                  </h3>

                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    Activity and comments for this task.
                  </p>
                </div>

                {comments.length === 0 ? (
                  <div className="p-5">
                    <p className="text-xs text-zinc-400">
                      No comments yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5 p-5">
                    {comments.map(
                      (
                        comment: any,
                        index: number,
                      ) => (
                        <Activity
                          key={
                            comment.id ??
                            index
                          }
                          name={
                            comment.user
                              ?.name ??
                            "User"
                          }
                          text={
                            comment.content ??
                            ""
                          }
                          time={
                            comment.createdAt
                              ? new Date(
                                  comment.createdAt,
                                ).toLocaleString()
                              : ""
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                {/* Comment UI placeholder */}
                <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
                  <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <textarea
                      placeholder="Write an update..."
                      rows={3}
                      disabled
                      className="w-full resize-none rounded-lg bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
                    />

                    <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
                      <button
                        type="button"
                        disabled
                        className="rounded-md p-1.5 text-zinc-300 dark:text-zinc-600"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-[10px] font-medium text-white opacity-50 dark:bg-white dark:text-black"
                      >
                        <Send className="h-3 w-3" />
                        Comment
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-[9px] text-zinc-400">
                    Comments will be enabled in the comments phase.
                  </p>
                </div>
              </div>
            </section>

            {/* Details sidebar */}
            <aside className="h-fit rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Details
                </h3>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* Status */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Circle className="h-4 w-4 text-zinc-400" />

                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Status
                    </span>
                  </div>

                  <select
                    value={task.status}
                    disabled={isUpdating}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target
                          .value as TaskStatus,
                      )
                    }
                    className="max-w-[130px] rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    <option value="TODO">
                      To Do
                    </option>

                    <option value="DOING">
                      Doing
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="ON_HOLD">
                      On Hold
                    </option>
                  </select>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-zinc-400" />

                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Priority
                    </span>
                  </div>

                  <select
                    value={task.priority}
                    disabled={isUpdating}
                    onChange={(event) =>
                      handlePriorityChange(
                        event.target
                          .value as TaskPriority,
                      )
                    }
                    className="max-w-[130px] rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    <option value="NO_PRIORITY">
                      No Priority
                    </option>

                    <option value="URGENT">
                      Urgent
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="LOW">
                      Low
                    </option>
                  </select>
                </div>

                {/* Assignee */}
                <DetailRow
                  icon={
                    <User className="h-4 w-4" />
                  }
                  label="Assignee"
                  value={
                    task.assignee?.name ??
                    "Unassigned"
                  }
                />

                {/* Due date */}
                <DetailRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Due Date"
                  value={formatDate(
                    task.dueDate,
                  )}
                />

                {/* Comments */}
                <DetailRow
                  icon={
                    <MessageCircle className="h-4 w-4" />
                  }
                  label="Comments"
                  value={String(
                    comments.length,
                  )}
                />

                {/* Task ID */}
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
    </AppShell>
  );
}

interface ActivityProps {
  name: string;
  text: string;
  time: string;
}

function Activity({
  name,
  text,
  time,
}: ActivityProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <User className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
      </div>

      <div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300">
          <span className="font-medium">
            {name}
          </span>{" "}
          {text}
        </p>

        <p className="mt-1 text-[10px] text-zinc-400">
          {time}
        </p>
      </div>
    </div>
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

      <span className="max-w-[150px] truncate text-right text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
    </div>
  );
}