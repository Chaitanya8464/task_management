"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { createTask } from "@/lib/api";
import { Task } from "./TaskCard";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
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

function mapPriorityToApi(priority: Task["priority"]) {
  const priorityMap = {
    Urgent: "URGENT",
    High: "HIGH",
    Medium: "MEDIUM",
    Low: "LOW",
    "No Priority": "NO_PRIORITY",
  } as const;

  return priorityMap[priority];
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] =
    useState<Task["status"]>("To Do");

  const [priority, setPriority] =
    useState<Task["priority"]>("No Priority");

  const [assignee, setAssignee] =
    useState("Unassigned");

  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setPriority("No Priority");
    setAssignee("Unassigned");
    setDueDate("");
    setError("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    const storedWorkspace =
      localStorage.getItem("taskflow_workspace");

    if (!storedWorkspace) {
      setError("Workspace not found. Please login again.");
      return;
    }

    let workspace;

    try {
      workspace = JSON.parse(storedWorkspace);
    } catch {
      setError(
        "Invalid workspace information. Please login again.",
      );
      return;
    }

    if (!workspace?.id) {
      setError(
        "Workspace ID is missing. Please login again.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const createdTask = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status: mapStatusToApi(status),
        priority: mapPriorityToApi(priority),
        dueDate: dueDate
          ? new Date(
              `${dueDate}T00:00:00`,
            ).toISOString()
          : undefined,
        workspaceId: workspace.id,
      });

      const newTask: Task = {
        id: createdTask.id,
        title: createdTask.title,
        description:
          createdTask.description ?? undefined,
        status,
        priority,
        assignee:
          createdTask.assignee?.name ?? "Unassigned",
        dueDate: createdTask.dueDate
          ? new Date(
              createdTask.dueDate,
            ).toLocaleDateString()
          : "No due date",
        comments:
          createdTask.comments?.length ?? 0,
      };

      onAdd(newTask);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);

      setError(
        "Unable to create task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 dark:bg-black/70">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Create Task
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Add a new task to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
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
                htmlFor="task-title"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>

              <input
                id="task-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter task title"
                autoFocus
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-violet-500 dark:focus:ring-violet-950 disabled:dark:bg-zinc-800"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="task-description"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the task..."
                rows={3}
                disabled={isSubmitting}
                className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-violet-500 dark:focus:ring-violet-950 disabled:dark:bg-zinc-800"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-status"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as Task["status"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none focus:border-violet-400 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 disabled:dark:bg-zinc-800"
                >
                  <option value="To Do">To Do</option>
                  <option value="Doing">Doing</option>
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
                  htmlFor="task-priority"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as Task["priority"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none focus:border-violet-400 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 disabled:dark:bg-zinc-800"
                >
                  <option value="No Priority">
                    No Priority
                  </option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Assignee + Due date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-assignee"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Assignee
                </label>

                <select
                  id="task-assignee"
                  value={assignee}
                  onChange={(event) =>
                    setAssignee(event.target.value)
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none focus:border-violet-400 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 disabled:dark:bg-zinc-800"
                >
                  <option>Unassigned</option>
                  <option>John</option>
                  <option>Sarah</option>
                  <option>Mike</option>
                  <option>Alex</option>
                  <option>David</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Due Date
                </label>

                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(event.target.value)
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none focus:border-violet-400 disabled:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 disabled:dark:bg-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}