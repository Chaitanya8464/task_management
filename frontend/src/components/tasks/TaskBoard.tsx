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
  /* =========================================================
     GROUP TASKS BY STATUS
  ========================================================= */

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
        w-full
        min-w-0
        overflow-x-auto
        overflow-y-visible
        pb-2
      "
    >
      {/* =======================================================
          BOARD

          Figma:
          - Four columns horizontally
          - Compact spacing
          - Columns retain their width
          - Horizontal scroll on smaller screens
      ======================================================= */}

      <div
        className="
          flex
          min-w-max
          items-start
          gap-3
        "
      >
        {/* =====================================================
            TO DO
        ===================================================== */}

        <div
          className="
            w-[260px]
            shrink-0
            md:w-[250px]
            xl:w-[255px]
          "
        >
          <TaskColumn
            title="To Do"
            tasks={todo}
            color="bg-zinc-400"
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        </div>

        {/* =====================================================
            DOING
        ===================================================== */}

        <div
          className="
            w-[260px]
            shrink-0
            md:w-[250px]
            xl:w-[255px]
          "
        >
          <TaskColumn
            title="Doing"
            tasks={doing}
            color="bg-blue-500"
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        </div>

        {/* =====================================================
            COMPLETED
        ===================================================== */}

        <div
          className="
            w-[260px]
            shrink-0
            md:w-[250px]
            xl:w-[255px]
          "
        >
          <TaskColumn
            title="Completed"
            tasks={completed}
            color="bg-emerald-500"
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        </div>

        {/* =====================================================
            ON HOLD
        ===================================================== */}

        <div
          className="
            w-[260px]
            shrink-0
            md:w-[250px]
            xl:w-[255px]
          "
        >
          <TaskColumn
            title="On Hold"
            tasks={onHold}
            color="bg-orange-500"
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
          />
        </div>
      </div>
    </div>
  );
}