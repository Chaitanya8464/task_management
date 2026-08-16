"use client";

import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  deleteProject,
  type ApiProject,
} from "@/lib/api";

interface DeleteProjectDialogProps {
  open: boolean;
  project: ApiProject | null;
  onClose: () => void;
  onDeleted?: (projectId: string) => void;
}

export default function DeleteProjectDialog({
  open,
  project,
  onClose,
  onDeleted,
}: DeleteProjectDialogProps) {
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open || !project) {
    return null;
  }

  const handleDelete = async () => {
  if (submitting) {
    return;
  }

  setSubmitting(true);

  try {
    await deleteProject(project.id);

    onDeleted?.(project.id);

    onClose();
  } catch (error) {
    console.error(
      "Failed to delete project:",
      error,
    );

    window.alert(
      error instanceof Error
        ? error.message
        : "Unable to delete project.",
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/45
        px-4
        backdrop-blur-[2px]
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[400px]
          rounded-xl
          border
          border-zinc-200
          bg-white
          shadow-2xl
          dark:border-zinc-800
          dark:bg-zinc-950
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-200
            px-5
            py-4
            dark:border-zinc-800
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              <AlertTriangle className="h-4 w-4" />
            </div>

            <div>
              <h2
                className="
                  text-[14px]
                  font-semibold
                  text-zinc-900
                  dark:text-zinc-100
                "
              >
                Delete project
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-zinc-400
                "
              >
                This action cannot be
                undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-zinc-400
              hover:bg-zinc-100
              dark:hover:bg-zinc-800
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}

        <div className="px-5 py-5">
          <p
            className="
              text-sm
              leading-6
              text-zinc-600
              dark:text-zinc-400
            "
          >
            Are you sure you want to
            delete{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              "{project.name}"
            </span>
            ?
          </p>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-zinc-400
            "
          >
            Tasks associated with this
            project will not be deleted.
            They will simply become
            unassigned from the project.
          </p>
        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-2
            border-t
            border-zinc-100
            px-5
            py-4
            dark:border-zinc-800
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              h-9
              rounded-md
              px-4
              text-xs
              font-medium
              text-zinc-600
              hover:bg-zinc-100
              dark:text-zinc-400
              dark:hover:bg-zinc-800
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="
              flex
              h-9
              items-center
              gap-2
              rounded-md
              bg-red-600
              px-4
              text-xs
              font-medium
              text-white
              transition
              hover:bg-red-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}

            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}