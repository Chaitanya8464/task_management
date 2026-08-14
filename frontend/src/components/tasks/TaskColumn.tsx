import { Plus } from "lucide-react";
import TaskCard, { Task } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskColumn({
  title,
  tasks,
  color,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  return (
    <section className="min-w-0">
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${color}`}
          />

          <h2 className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            {title}
          </h2>

          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Add task to ${title}`}
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex min-h-[80px] flex-col gap-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
            No tasks
          </div>
        )}
      </div>
    </section>
  );
}