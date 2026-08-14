"use client";

import TaskColumn from "./TaskColumn";
import { Task } from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];

  onEdit?: (task: Task) => void;

  onDelete?: (task: Task) => void;

  onStatusChange?: (
    task: Task,
    status: Task["status"],
  ) => void;
}

export default function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskBoardProps) {
  const todo = tasks.filter(
    (task) => task.status === "To Do",
  );

  const doing = tasks.filter(
    (task) => task.status === "Doing",
  );

  const completed = tasks.filter(
    (task) => task.status === "Completed",
  );

  const onHold = tasks.filter(
    (task) => task.status === "On Hold",
  );

  return (
    <div
      className="
        grid
        min-w-0
        grid-cols-1
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {/* ================================
          To Do
      ================================= */}

      <div className="min-w-0">
        <TaskColumn
          title="To Do"
          tasks={todo}
          color="bg-zinc-400"
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* ================================
          Doing
      ================================= */}

      <div className="min-w-0">
        <TaskColumn
          title="Doing"
          tasks={doing}
          color="bg-blue-500"
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* ================================
          Completed
      ================================= */}

      <div className="min-w-0">
        <TaskColumn
          title="Completed"
          tasks={completed}
          color="bg-emerald-500"
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* ================================
          On Hold
      ================================= */}

      <div className="min-w-0">
        <TaskColumn
          title="On Hold"
          tasks={onHold}
          color="bg-orange-500"
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}