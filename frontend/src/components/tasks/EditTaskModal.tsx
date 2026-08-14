"use client";

import { X } from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  getWorkspaceMembers,
  updateTask,
  WorkspaceMember,
} from "@/lib/api";
import { Task } from "./TaskCard";

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated: (task: Task) => void;
}

function mapStatusToApi(status: Task["status"]) {
  const statusMap = {
    "To Do": "TODO",
    Doing: "DOING",
    Completed: "COMPLETED",
    "On Hold": "ON_HOLD",
  } as const;

  return statusMap[status];
}

function mapPriorityToApi(
  priority: Task["priority"],
) {
  const priorityMap = {
    Urgent: "URGENT",
    High: "HIGH",
    Medium: "MEDIUM",
    Low: "LOW",
    "No Priority": "NO_PRIORITY",
  } as const;

  return priorityMap[priority];
}

function getDateInputValue(
  dueDate?: string | null,
) {
  if (!dueDate || dueDate === "No due date") {
    return "";
  }

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default function EditTaskModal({
  isOpen,
  task,
  onClose,
  onUpdated,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<Task["status"]>("To Do");

  const [priority, setPriority] =
    useState<Task["priority"]>("No Priority");

  const [assigneeId, setAssigneeId] =
    useState("");

  const [members, setMembers] = useState<
    WorkspaceMember[]
  >([]);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * Load task data whenever a task is selected.
   */
  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(priorityFromTask(task));
    setDueDate(getDateInputValue(task.dueDate));

    setError("");
  }, [task]);

  /*
   * Load workspace members when modal opens.
   */
  useEffect(() => {
    if (!isOpen || !task) return;

    const loadMembers = async () => {
      try {
        setLoadingMembers(true);

        const storedWorkspace =
          localStorage.getItem(
            "taskflow_workspace",
          );

        if (!storedWorkspace) {
          setError(
            "Workspace not found. Please login again.",
          );
          return;
        }

        const workspace =
          JSON.parse(storedWorkspace);

        if (!workspace?.id) {
          setError(
            "Workspace ID is missing. Please login again.",
          );
          return;
        }

        const data =
          await getWorkspaceMembers(
            workspace.id,
          );

        setMembers(data);

        /*
         * Match the current task's assignee
         * against the actual workspace member.
         */
        const currentMember = data.find(
          (member) =>
            member.user.name === task.assignee,
        );

        if (currentMember) {
          setAssigneeId(
            currentMember.userId,
          );
        } else {
          setAssigneeId("");
        }
      } catch (error) {
        console.error(
          "Failed to load workspace members:",
          error,
        );

        setMembers([]);

        setError(
          "Unable to load workspace members.",
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, [isOpen, task]);

  if (!isOpen || !task) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const updatedTask =
        await updateTask(task.id, {
          title: title.trim(),

          description:
            description.trim() || undefined,

          status: mapStatusToApi(status),

          priority:
            mapPriorityToApi(priority),

          dueDate: dueDate
            ? new Date(
                `${dueDate}T00:00:00`,
              ).toISOString()
            : undefined,

          ...(assigneeId
            ? { assigneeId }
            : {}),
        });

      const updatedUiTask: Task = {
        id: updatedTask.id,

        title: updatedTask.title,

        description:
          updatedTask.description ??
          undefined,

        status,

        priority,

        assignee:
          updatedTask.assignee?.name ??
          "Unassigned",

        dueDate: updatedTask.dueDate
          ? new Date(
              updatedTask.dueDate,
            ).toLocaleDateString()
          : "No due date",

        comments:
          updatedTask.comments?.length ?? 0,
      };

      onUpdated(updatedUiTask);
      onClose();
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setError(
        "Unable to update task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px] dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
          <div>
            <h2
              id="edit-task-title"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Edit Task
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Update the task details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit task modal"
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="edit-task-title-input"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>

              <input
                id="edit-task-title-input"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="edit-task-description"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>

              <textarea
                id="edit-task-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                rows={3}
                disabled={isSubmitting}
                className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-task-status"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Status
                </label>

                <select
                  id="edit-task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as Task["status"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="To Do">
                    To Do
                  </option>
                  <option value="Doing">
                    Doing
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="On Hold">
                    On Hold
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-task-priority"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Priority
                </label>

                <select
                  id="edit-task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value as Task["priority"],
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="No Priority">
                    No Priority
                  </option>
                  <option value="Urgent">
                    Urgent
                  </option>
                  <option value="High">
                    High
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>
            </div>

            {/* Assignee + Due Date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Assignee */}
              <div>
                <label
                  htmlFor="edit-task-assignee"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Assignee
                </label>

                <select
                  id="edit-task-assignee"
                  value={assigneeId}
                  onChange={(event) =>
                    setAssigneeId(
                      event.target.value,
                    )
                  }
                  disabled={
                    isSubmitting ||
                    loadingMembers
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="">
                    {loadingMembers
                      ? "Loading members..."
                      : "Unassigned"}
                  </option>

                  {members.map((member) => (
                    <option
                      key={member.userId}
                      value={member.userId}
                    >
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label
                  htmlFor="edit-task-due-date"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Due Date
                </label>

                <input
                  id="edit-task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !title.trim() ||
                isSubmitting ||
                loadingMembers
              }
              className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * TaskCard currently exposes the assignee as a name.
 * This helper keeps the existing Task interface intact.
 */
function priorityFromTask(
  task: Task,
): Task["priority"] {
  return task.priority;
}