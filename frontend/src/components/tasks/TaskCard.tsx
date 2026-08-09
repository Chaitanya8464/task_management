import Link from "next/link";

import {
  CalendarDays,
  MessageCircle,
  MoreHorizontal,
  User,
} from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "Urgent" | "High" | "Medium" | "Low" | "No Priority";
  status: "To Do" | "Doing" | "Completed" | "On Hold";
  assignee: string;
  dueDate: string;
  comments: number;
}

interface TaskCardProps {
  task: Task;
}

const priorityStyles = {
  Urgent: "bg-red-50 text-red-600",
  High: "bg-orange-50 text-orange-600",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-blue-50 text-blue-600",
  "No Priority": "bg-zinc-100 text-zinc-500",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow"
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-zinc-900">
          {task.title}
        </h3>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="shrink-0 rounded-md p-1 text-zinc-400 opacity-0 transition hover:bg-zinc-100 group-hover:opacity-100"
          aria-label="Task options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
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
          className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${
            priorityStyles[task.priority]
          }`}
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
    </Link>
  );
}