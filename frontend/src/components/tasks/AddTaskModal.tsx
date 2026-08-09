"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Task } from "./TaskCard";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<Task["status"]>("To Do");
  const [priority, setPriority] =
    useState<Task["priority"]>("No Priority");
  const [assignee, setAssignee] = useState("John");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee,
      dueDate: dueDate || "No date",
      comments: 0,
    };

    onAdd(newTask);

    setTitle("");
    setDescription("");
    setStatus("To Do");
    setPriority("No Priority");
    setAssignee("John");
    setDueDate("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Create Task
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400">
              Add a new task to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Title
              </label>

              <input
                id="task-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter task title"
                autoFocus
                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="task-description"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Description
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the task..."
                rows={3}
                className="w-full resize-none rounded-md border border-zinc-200 px-3 py-2.5 text-xs outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-status"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as Task["status"],
                    )
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                >
                  <option value="To Do">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as Task["priority"],
                    )
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                >
                  <option value="No Priority">
                    No Priority
                  </option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Assignee + Due date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-assignee"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Assignee
                </label>

                <select
                  id="task-assignee"
                  value={assignee}
                  onChange={(event) =>
                    setAssignee(event.target.value)
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                >
                  <option>John</option>
                  <option>Sarah</option>
                  <option>Mike</option>
                  <option>Alex</option>
                  <option>David</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-1.5 block text-xs font-medium text-zinc-700"
                >
                  Due Date
                </label>

                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(event.target.value)
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}