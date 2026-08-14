"use client";

import {
  CalendarDays,
  MessageCircle,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Task } from "./TaskCard";
import { TaskFields } from "./FieldsMenu";

interface TaskListProps {
  tasks: Task[];
  fields: TaskFields;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const priorityStyles = {
  Urgent: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  High: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  Medium:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  Low: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  "No Priority":
    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const statusGroups: Task["status"][] = [
  "To Do",
  "Doing",
  "Completed",
  "On Hold",
];

interface TaskRowActionsProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function TaskRowActions({
  task,
  onEdit,
  onDelete,
}: TaskRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    const menuWidth = 140;
    const menuHeight = 90;
    const gap = 6;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;

    if (left < 8) {
      left = 8;
    }

    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap;
    }

    setMenuPosition({
      top,
      left,
    });
  };

  const handleToggleMenu = () => {
    if (!isOpen) {
      updateMenuPosition();
    }

    setIsOpen((current) => !current);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleViewportChange = () => {
      updateMenuPosition();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);

      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete?.(task);
  };

  return (
    <>
      {/* Three-dot button */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${task.title}`}
        aria-expanded={isOpen}
        onClick={handleToggleMenu}
        className={`rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
          isOpen
            ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            : ""
        }`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* Floating menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-36 rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
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
        </div>
      )}
    </>
  );
}

export default function TaskList({
  tasks,
  fields,
  onEdit,
  onDelete,
}: TaskListProps) {
  return (
    <div className="min-w-0">
      {statusGroups.map((status) => {
        const statusTasks = tasks.filter(
          (task) => task.status === status,
        );

        return (
          <section key={status} className="mb-6">
            {/* Group Header */}
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "To Do"
                    ? "bg-zinc-400"
                    : status === "Doing"
                      ? "bg-blue-500"
                      : status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                }`}
              />

              <h2 className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                {status}
              </h2>

              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {statusTasks.length}
              </span>
            </div>

            {/* Responsive table wrapper */}
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="min-w-[850px]">
                {/* Table Header */}
                <div className="flex items-center border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
                  {/* Task */}
                  <div className="min-w-[260px] flex-1">
                    <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                      Task
                    </span>
                  </div>

                  {/* Priority */}
                  {fields.priority && (
                    <div className="w-[120px] shrink-0">
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Priority
                      </span>
                    </div>
                  )}

                  {/* Members */}
                  {fields.members && (
                    <div className="w-[150px] shrink-0">
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Members
                      </span>
                    </div>
                  )}

                  {/* Due Date */}
                  {fields.dueDate && (
                    <div className="w-[130px] shrink-0">
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Due Date
                      </span>
                    </div>
                  )}

                  {/* Comments */}
                  {fields.comments && (
                    <div className="w-[80px] shrink-0">
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Comments
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="w-[48px] shrink-0" />
                </div>

                {/* Task Rows */}
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center border-b border-zinc-100 bg-white px-4 py-3 last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    {/* Task */}
                    <div className="min-w-[260px] flex-1">
                      <p className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-0.5 truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Priority */}
                    {fields.priority && (
                      <div className="w-[120px] shrink-0">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    )}

                    {/* Member */}
                    {fields.members && (
                      <div className="flex w-[150px] shrink-0 items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <User className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                        </div>

                        <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                          {task.assignee}
                        </span>
                      </div>
                    )}

                    {/* Due Date */}
                    {fields.dueDate && (
                      <div className="flex w-[130px] shrink-0 items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                        <CalendarDays className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                    )}

                    {/* Comments */}
                    {fields.comments && (
                      <div className="flex w-[80px] shrink-0 items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                        <MessageCircle className="h-3 w-3" />
                        {task.comments}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex w-[48px] shrink-0 justify-end">
                      <TaskRowActions
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {statusTasks.length === 0 && (
                  <div className="bg-white px-4 py-6 text-center text-xs text-zinc-400 dark:bg-zinc-950 dark:text-zinc-500">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}