"use client";

import {
  CalendarDays,
  MessageCircle,
  MoreHorizontal,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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
  onStatusChange?: (
  task: Task,
  status: Task["status"],
) => void;
}

const priorityStyles = {
  Urgent:
    "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  High:
    "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  Medium:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  Low:
    "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  "No Priority":
    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
    onStatusChange,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const buttonRef =
    useRef<HTMLButtonElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const updateMenuPosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect =
      buttonRef.current.getBoundingClientRect();

    const menuWidth = 140;
    const menuHeight = 88;
    const gap = 6;

    let left =
      rect.right - menuWidth;

    let top =
      rect.bottom + gap;

    // Keep menu inside viewport horizontally
    if (left < 8) {
      left = 8;
    }

    if (
      left + menuWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        menuWidth -
        8;
    }

    // If there isn't enough space below,
    // display it above the button.
    if (
      top + menuHeight >
      window.innerHeight - 8
    ) {
      top =
        rect.top -
        menuHeight -
        gap;
    }

    setMenuPosition({
      top,
      left,
    });
  };

  /*
   * Open/close menu.
   */
  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      updateMenuPosition();
    }

    setIsMenuOpen(
      (current) => !current,
    );
  };

  /*
   * Close menu when clicking outside.
   */
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        buttonRef.current?.contains(
          target,
        ) ||
        menuRef.current?.contains(
          target,
        )
      ) {
        return;
      }

      setIsMenuOpen(false);
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleViewportChange = () => {
      updateMenuPosition();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    window.addEventListener(
      "resize",
      handleViewportChange,
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      window.removeEventListener(
        "resize",
        handleViewportChange,
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
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
    <article className="group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-sm font-medium leading-5 text-zinc-900 dark:text-zinc-100">
          {task.title}
        </h3>

        {/* Menu button */}
        <button
          ref={buttonRef}
          type="button"
          aria-label={`Task actions for ${task.title}`}
          aria-expanded={isMenuOpen}
          onClick={handleMenuToggle}
          className={`shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
            isMenuOpen
              ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              : ""
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {/* Floating menu */}
        {isMenuOpen &&
          typeof document !==
            "undefined" &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-[9999] w-36 rounded-md border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
            >
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>,
            document.body,
          )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-4 text-zinc-400 dark:text-zinc-500">
          {task.description}
        </p>
      )}

      {/* Priority */}
     <div className="mt-2">
  <select
    value={task.status}
    onChange={(event) =>
      onStatusChange?.(
        task,
        event.target.value as Task["status"],
      )
    }
    className="h-7 rounded-md border border-zinc-200 bg-white px-2 text-[10px] text-zinc-600 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
  >
    <option value="To Do">To Do</option>
    <option value="Doing">Doing</option>
    <option value="Completed">Completed</option>
    <option value="On Hold">On Hold</option>
  </select>
</div>

      {/* Bottom metadata */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <User className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
          </div>

          <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
            {task.assignee}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-zinc-400 dark:text-zinc-500">
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