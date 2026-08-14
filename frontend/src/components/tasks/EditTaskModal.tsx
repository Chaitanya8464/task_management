"use client";

import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { updateTask } from "@/lib/api";
import { Task } from "./TaskCard";

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated: (task: Task) => void;
}

function mapStatusToApi(status: Task["status"]) {
  const statusMap = {
    "To Do": "TODO",
    Doing: "DOING",
    Completed: "COMPLETED",
    "On Hold": "ON_HOLD",
  } as const;

  return statusMap[status];
}

function mapPriorityToApi(
  priority: Task["priority"],
) {
  const priorityMap = {
    Urgent: "URGENT",
    High: "HIGH",
    Medium: "MEDIUM",
    Low: "LOW",
    "No Priority": "NO_PRIORITY",
  } as const;

  return priorityMap[priority];
}

export default function EditTaskModal({
  isOpen,
  task,
  onClose,
  onUpdated,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [status, setStatus] =
    useState<Task["status"]>("To Do");
  const [priority, setPriority] =
    useState<Task["priority"]>("No Priority");
  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(task.priority);

    setDueDate(
      task.dueDate !== "No due date"
        ? task.dueDate
        : "",
    );

    setError("");
  }, [task]);

  if (!isOpen || !task) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const updatedTask = await updateTask(
        task.id,
        {
          title: title.trim(),
          description:
            description.trim() || undefined,
          status: mapStatusToApi(status),
          priority: mapPriorityToApi(priority),
          dueDate: dueDate
            ? new Date(
                `${dueDate}T00:00:00`,
              ).toISOString()
            : undefined,
        },
      );

      const updatedUiTask: Task = {
        id: updatedTask.id,
        title: updatedTask.title,
        description:
          updatedTask.description ?? undefined,
        status,
        priority,
        assignee:
          updatedTask.assignee?.name ??
          task.assignee ??
          "Unassigned",
        dueDate: updatedTask.dueDate
          ? new Date(
              updatedTask.dueDate,
            ).toLocaleDateString()
          : "No due date",
        comments:
          updatedTask.comments?.length ?? 0,
      };

      onUpdated(updatedUiTask);
      onClose();
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setError(
        "Unable to update task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-zinc-100 p-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Edit Task
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400">
              Update the task details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >
          <div className="space-y-4">
            {/* Title */}

            <div>
              <label
                htmlFor="edit-task-title"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Title
              </label>

              <input
                id="edit-task-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="edit-task-description"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Description
              </label>

              <textarea
                id="edit-task-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                rows={3}
                disabled={isSubmitting}
                className="w-full resize-none rounded-md border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Status + Priority */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-task-status"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Status
                </label>

                <select
                  id="edit-task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as Task["status"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                >
                  <option value="To Do">
                    To Do
                  </option>
                  <option value="Doing">
                    Doing
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="On Hold">
                    On Hold
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-task-priority"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Priority
                </label>

                <select
                  id="edit-task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as Task["priority"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                >
                  <option value="No Priority">
                    No Priority
                  </option>
                  <option value="Urgent">
                    Urgent
                  </option>
                  <option value="High">
                    High
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>
            </div>

            {/* Due Date */}

            <div>
              <label
                htmlFor="edit-task-due-date"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Due Date
              </label>

              <input
                id="edit-task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Error */}

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !title.trim() ||
                isSubmitting
              }
              className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}