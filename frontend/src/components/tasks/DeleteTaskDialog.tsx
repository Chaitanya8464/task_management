"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { deleteTask } from "@/lib/api";
import { Task } from "./TaskCard";

interface DeleteTaskDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onDeleted: (taskId: string) => void;
}

export default function DeleteTaskDialog({
  isOpen,
  task,
  onClose,
  onDeleted,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !task) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError("");

      await deleteTask(task.id);

      onDeleted(task.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);

      setError(
        "Unable to delete task. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px] dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-3">
            {/* Warning icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
            </div>

            <div>
              <h2
                id="delete-task-title"
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Delete task?
              </h2>

              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  "{task.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete dialog"
            className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-zinc-100 p-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
}