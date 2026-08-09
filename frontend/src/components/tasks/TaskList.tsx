import {
  CalendarDays,
  MessageCircle,
  User,
} from "lucide-react";

import { Task } from "./TaskCard";
import { TaskFields } from "./FieldsMenu";

interface TaskListProps {
  tasks: Task[];
  fields: TaskFields;
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

export default function TaskList({
  tasks,
  fields,
}: TaskListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {statusGroups.map((status) => {
          const statusTasks = tasks.filter(
            (task) => task.status === status
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
                {/* Table Header */}
                <div className="flex items-center border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
                  {/* Task */}
                  <div className="min-w-[260px] flex-1">
                    <span className="text-[10px] font-medium text-zinc-400">
                      Task
                    </span>
                  </div>

                  {/* Priority */}
                  {fields.priority && (
                    <div className="w-[120px]">
                      <span className="text-[10px] font-medium text-zinc-400">
                        Priority
                      </span>
                    </div>
                  )}

                  {/* Members */}
                  {fields.members && (
                    <div className="w-[150px]">
                      <span className="text-[10px] font-medium text-zinc-400">
                        Members
                      </span>
                    </div>
                  )}

                  {/* Due Date */}
                  {fields.dueDate && (
                    <div className="w-[130px]">
                      <span className="text-[10px] font-medium text-zinc-400">
                        Due Date
                      </span>
                    </div>
                  )}

                  {/* Comments */}
                  {fields.comments && (
                    <div className="w-[80px]">
                      <span className="text-[10px] font-medium text-zinc-400">
                        Comments
                      </span>
                    </div>
                  )}
                </div>

                {/* Task Rows */}
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50"
                  >
                    {/* Task */}
                    <div className="min-w-[260px] flex-1">
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
                    {fields.priority && (
                      <div className="w-[120px]">
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
                      <div className="flex w-[150px] items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
                          <User className="h-3 w-3 text-zinc-500" />
                        </div>

                        <span className="truncate text-[10px] text-zinc-500">
                          {task.assignee}
                        </span>
                      </div>
                    )}

                    {/* Due Date */}
                    {fields.dueDate && (
                      <div className="flex w-[130px] items-center gap-2 text-[10px] text-zinc-400">
                        <CalendarDays className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                    )}

                    {/* Comments */}
                    {fields.comments && (
                      <div className="flex w-[80px] items-center gap-2 text-[10px] text-zinc-400">
                        <MessageCircle className="h-3 w-3" />
                        {task.comments}
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty State */}
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