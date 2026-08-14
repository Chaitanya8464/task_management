"use client";

import { Plus } from "lucide-react";
import { DragEvent, useState } from "react";
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

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    /*
     * Only remove the highlight when leaving
     * the actual column.
     */
    if (
      event.currentTarget === event.target
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragOver(false);

    const taskId =
      event.dataTransfer.getData(
        "text/task-id",
      );

    if (!taskId) return;

    const draggedTask = tasks.find(
      (task) => task.id === taskId,
    );

    /*
     * The dragged task may belong to another
     * column, so the parent will identify it.
     *
     * We store the task itself in the browser
     * during drag.
     */
    const taskJson =
      event.dataTransfer.getData(
        "application/taskflow-task",
      );

    if (!taskJson) return;

    try {
      const task: Task =
        JSON.parse(taskJson);

      const newStatus =
        statusMap[title];

      if (
        task.status !== newStatus
      ) {
        onStatusChange?.(
          task,
          newStatus,
        );
      }
    } catch (error) {
      console.error(
        "Invalid dragged task:",
        error,
      );
    }
  };

  return (
    <section
      className={`min-w-0 rounded-lg transition ${
        isDragOver
          ? "bg-violet-50/70 ring-2 ring-violet-300 dark:bg-violet-950/20 dark:ring-violet-700"
          : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${color}`}
          />

          <h2 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {title}
          </h2>

          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div
        className={`flex min-h-[90px] flex-col gap-2 rounded-lg transition ${
          isDragOver
            ? "border border-dashed border-violet-400 p-2"
            : ""
        }`}
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

        {tasks.length === 0 && (
          <div className="flex min-h-[74px] items-center justify-center rounded-lg border border-dashed border-zinc-200 text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
            {isDragOver
              ? "Drop task here"
              : "No tasks"}
          </div>
        )}
      </div>
    </section>
  );
}