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
    <section className="min-w-0 flex-1">
      {/* Column header */}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${color}`}
          />

          <h2 className="text-xs font-semibold text-zinc-700">
            {title}
          </h2>

          <span className="text-xs text-zinc-400">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}