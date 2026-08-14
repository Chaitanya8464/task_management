"use client";

import { Plus } from "lucide-react";
import {
  DragEvent,
  useState,
} from "react";

import TaskCard, {
  Task,
} from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;

  onEdit?: (task: Task) => void;

  onDelete?: (task: Task) => void;

  onStatusChange?: (
    task: Task,
    status: Task["status"],
  ) => void;
}

const statusMap: Record<
  string,
  Task["status"]
> = {
  "To Do": "To Do",
  Doing: "Doing",
  Completed: "Completed",
  "On Hold": "On Hold",
};

export default function TaskColumn({
  title,
  tasks,
  color,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskColumnProps) {
  const [isDragOver, setIsDragOver] =
    useState(false);

  // ==========================================
  // Drag Over
  // ==========================================

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setIsDragOver(true);
  };

  // ==========================================
  // Drag Leave
  // ==========================================

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    /*
     * Only remove the highlight when the
     * pointer leaves the actual column.
     */
    if (
      event.currentTarget ===
      event.target
    ) {
      setIsDragOver(false);
    }
  };

  // ==========================================
  // Drop
  // ==========================================

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragOver(false);

    const taskJson =
      event.dataTransfer.getData(
        "application/taskflow-task",
      );

    if (!taskJson) {
      return;
    }

    try {
      const task: Task =
        JSON.parse(taskJson);

      const newStatus =
        statusMap[title];

      if (!newStatus) {
        return;
      }

      /*
       * Don't make an unnecessary API request
       * when the task is dropped into its
       * existing column.
       */
      if (
        task.status === newStatus
      ) {
        return;
      }

      onStatusChange?.(
        task,
        newStatus,
      );
    } catch (error) {
      console.error(
        "Invalid dragged task:",
        error,
      );
    }
  };

  return (
    <section
      className={`
        min-w-0
        rounded-lg
        transition
        ${
          isDragOver
            ? `
              bg-violet-50/70
              ring-2
              ring-violet-300
              dark:bg-violet-950/20
              dark:ring-violet-700
            `
            : ""
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ======================================
          Column Header
      ======================================= */}

      <div
        className="
          mb-3
          flex
          min-w-0
          items-center
          justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          {/* Status dot */}

          <span
            className={`
              h-2
              w-2
              shrink-0
              rounded-full
              ${color}
            `}
          />

          {/* Column title */}

          <h2
            className="
              truncate
              text-xs
              font-semibold
              text-zinc-700
              dark:text-zinc-300
            "
          >
            {title}
          </h2>

          {/* Count */}

          <span
            className="
              shrink-0
              text-xs
              text-zinc-400
              dark:text-zinc-500
            "
          >
            {tasks.length}
          </span>
        </div>

        {/* Add button */}

        <button
          type="button"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-md
            text-zinc-400
            transition
            hover:bg-zinc-100
            hover:text-zinc-700
            active:bg-zinc-200
            dark:text-zinc-500
            dark:hover:bg-zinc-800
            dark:hover:text-zinc-200
            dark:active:bg-zinc-700
          "
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ======================================
          Cards
      ======================================= */}

      <div
        className={`
          flex
          min-h-[90px]
          min-w-0
          flex-col
          gap-2
          rounded-lg
          transition
          ${
            isDragOver
              ? `
                border
                border-dashed
                border-violet-400
                p-2
              `
              : ""
          }
        `}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        ))}

        {/* Empty column */}

        {tasks.length === 0 && (
          <div
            className="
              flex
              min-h-[74px]
              w-full
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              border-zinc-200
              px-3
              text-center
              text-[10px]
              text-zinc-400
              dark:border-zinc-800
              dark:text-zinc-600
            "
          >
            {isDragOver
              ? "Drop task here"
              : "No tasks"}
          </div>
        )}
      </div>
    </section>
  );
}