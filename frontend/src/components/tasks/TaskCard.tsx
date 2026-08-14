"use client";

import {
  CalendarDays,
  MessageCircle,
  MoreHorizontal,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority:
    | "Urgent"
    | "High"
    | "Medium"
    | "Low"
    | "No Priority";
  status:
    | "To Do"
    | "Doing"
    | "Completed"
    | "On Hold";
  assignee: string;
  dueDate: string;
  comments: number;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const priorityStyles = {
  Urgent: "bg-red-50 text-red-600",
  High: "bg-orange-50 text-orange-600",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-blue-50 text-blue-600",
  "No Priority": "bg-zinc-100 text-zinc-500",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /*
   * Close menu when clicking outside.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsMenuOpen(false);
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
  }, [isMenuOpen]);

  /*
   * Close menu when pressing Escape.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isMenuOpen]);

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(task);
  };

  return (
    <article className="group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow">
      {/* Top */}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-zinc-900">
          {task.title}
        </h3>

        {/* Menu */}

        <div
          ref={menuRef}
          className="relative shrink-0"
        >
          <button
            type="button"
            aria-label={`Task actions for ${task.title}`}
            aria-expanded={isMenuOpen}
            onClick={() =>
              setIsMenuOpen(
                (current) => !current,
              )
            }
            className={`rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 ${
              isMenuOpen
                ? "bg-zinc-100 text-zinc-700"
                : ""
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-30 w-32 rounded-md border border-zinc-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-zinc-600 transition hover:bg-zinc-50"
              >
                <Pencil className="h-3.5 w-3.5" />

                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />

                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-4 text-zinc-400">
          {task.description}
        </p>
      )}

      {/* Priority */}

      <div className="mt-3">
        <span
          className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Bottom metadata */}

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
            <User className="h-3 w-3 text-zinc-500" />
          </div>

          <span className="text-[10px] text-zinc-500">
            {task.assignee}
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span className="flex items-center gap-1 text-[10px]">
            <CalendarDays className="h-3 w-3" />
            {task.dueDate}
          </span>

          <span className="flex items-center gap-1 text-[10px]">
            <MessageCircle className="h-3 w-3" />
            {task.comments}
          </span>
        </div>
      </div>
    </article>
  );
}