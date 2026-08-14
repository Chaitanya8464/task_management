"use client";

import { Plus } from "lucide-react";
import {
  DragEvent,
  useState,
} from "react";

import TaskCard, { Task } from "./TaskCard";

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

  const [isDropping, setIsDropping] =
    useState(false);

  const targetStatus = statusMap[title];

  // ==========================================
  // DRAG OVER
  // ==========================================

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";

    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  // ==========================================
  // DRAG LEAVE
  // ==========================================

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    /*
     * Don't remove the highlight when moving
     * between children inside the column.
     */
    const relatedTarget =
      event.relatedTarget as Node | null;

    if (
      relatedTarget &&
      event.currentTarget.contains(
        relatedTarget,
      )
    ) {
      return;
    }

    setIsDragOver(false);
  };

  // ==========================================
  // DROP
  // ==========================================

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragOver(false);
    setIsDropping(true);

    window.setTimeout(() => {
      setIsDropping(false);
    }, 250);

    if (!targetStatus) {
      return;
    }

    const taskJson =
      event.dataTransfer.getData(
        "application/taskflow-task",
      );

    if (!taskJson) {
      return;
    }

    try {
      const draggedTask: Task =
        JSON.parse(taskJson);

      /*
       * Don't call the API if the task is
       * already in this column.
       */
      if (
        draggedTask.status === targetStatus
      ) {
        return;
      }

      onStatusChange?.(
        draggedTask,
        targetStatus,
      );
    } catch (error) {
      console.error(
        "Failed to read dragged task:",
        error,
      );
    }
  };

  return (
    <section
      className={`
        min-w-0
        rounded-xl
        transition-all
        duration-150
        ${
          isDragOver
            ? `
              bg-violet-50/80
              ring-2
              ring-violet-300
              ring-inset
              dark:bg-violet-950/20
              dark:ring-violet-700
            `
            : ""
        }
        ${
          isDropping
            ? "scale-[0.995]"
            : ""
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ======================================
          COLUMN HEADER
      ======================================= */}

      <div
        className="
          mb-3
          flex
          min-w-0
          items-center
          justify-between
          px-1
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

          {/* Title */}

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

        {/* Add task */}

        <button
          type="button"
          aria-label={`Add task to ${title}`}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-md
            text-zinc-400
            transition
            hover:bg-zinc-100
            hover:text-zinc-700
            active:scale-95
            dark:text-zinc-500
            dark:hover:bg-zinc-800
            dark:hover:text-zinc-200
          "
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ======================================
          TASK LIST
      ======================================= */}

      <div
        className={`
          min-h-[90px]
          min-w-0
          rounded-lg
          transition
          ${
            isDragOver
              ? `
                border
                border-dashed
                border-violet-400
                bg-violet-50/40
                p-2
                dark:border-violet-700
                dark:bg-violet-950/10
              `
              : ""
          }
        `}
      >
        <div className="flex min-w-0 flex-col gap-2">
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
        </div>

        {/* Empty state */}

        {tasks.length === 0 && (
          <div
            className={`
              flex
              min-h-[74px]
              w-full
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              px-3
              text-center
              text-[10px]
              transition
              ${
                isDragOver
                  ? `
                    border-violet-400
                    text-violet-500
                    dark:border-violet-700
                    dark:text-violet-400
                  `
                  : `
                    border-zinc-200
                    text-zinc-400
                    dark:border-zinc-800
                    dark:text-zinc-600
                  `
              }
            `}
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