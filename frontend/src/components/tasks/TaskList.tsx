import { CalendarDays, MessageCircle, User } from "lucide-react";
import { Task } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
}

const priorityStyles = {
  Urgent: "bg-red-50 text-red-600",
  High: "bg-orange-50 text-orange-600",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-blue-50 text-blue-600",
  "No Priority": "bg-zinc-100 text-zinc-500",
};

const statusGroups: Task["status"][] = [
  "To Do",
  "Doing",
  "Completed",
];

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {statusGroups.map((status) => {
          const statusTasks = tasks.filter(
            (task) => task.status === status,
          );

          return (
            <section key={status} className="mb-6">
              {/* Group header */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "To Do"
                      ? "bg-zinc-400"
                      : status === "Doing"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                  }`}
                />

                <h2 className="text-xs font-semibold text-zinc-700">
                  {status}
                </h2>

                <span className="text-xs text-zinc-400">
                  {statusTasks.length}
                </span>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-lg border border-zinc-200">
                {/* Header */}
                <div className="grid grid-cols-[minmax(220px,1fr)_120px_150px_130px] border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
                  <span className="text-[10px] font-medium text-zinc-400">
                    Task
                  </span>

                  <span className="text-[10px] font-medium text-zinc-400">
                    Priority
                  </span>

                  <span className="text-[10px] font-medium text-zinc-400">
                    Members
                  </span>

                  <span className="text-[10px] font-medium text-zinc-400">
                    Due Date
                  </span>
                </div>

                {/* Rows */}
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-[minmax(220px,1fr)_120px_150px_130px] items-center border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50"
                  >
                    {/* Task */}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-800">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Priority */}
                    <div>
                      <span
                        className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Member */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
                        <User className="h-3 w-3 text-zinc-500" />
                      </div>

                      <span className="text-[10px] text-zinc-500">
                        {task.assignee}
                      </span>
                    </div>

                    {/* Due date */}
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <CalendarDays className="h-3 w-3" />
                      {task.dueDate}

                      <MessageCircle className="ml-2 h-3 w-3" />
                      {task.comments}
                    </div>
                  </div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-zinc-400">
                    No tasks
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}