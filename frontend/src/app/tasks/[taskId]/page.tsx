"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Eye,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Settings,
  Share2,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ApiLabel,
  ApiSubtask,
  ApiTaskDetails,
  ApiUser,
  TaskPriority,
  WorkspaceMember,
  createComment,
  createLabel,
  createSubtask,
  deleteSubtask,
  getTaskDetails,
  getWorkspaceLabels,
  getWorkspaceMembers,
  assignLabel,
  removeLabel,
  updateSubtask,
  updateTask,
} from "@/lib/api";

// =====================================================
// Labels
// =====================================================

const statusLabels: Record<
  ApiTaskDetails["status"],
  string
> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

const priorityLabels: Record<
  TaskPriority,
  string
> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NO_PRIORITY: "No Priority",
};

const priorityColors: Record<
  TaskPriority,
  string
> = {
  URGENT: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-amber-500",
  LOW: "text-zinc-400",
  NO_PRIORITY: "text-zinc-400",
};

const priorityDotColors: Record<
  TaskPriority,
  string
> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-zinc-400",
  NO_PRIORITY: "bg-zinc-300",
};

// =====================================================
// Page
// =====================================================

export default function TaskDetailsPage() {
  const params = useParams();

  const taskId = String(params.taskId);

  const [task, setTask] =
    useState<ApiTaskDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // Subtask
  // =====================================================

  const [newSubtask, setNewSubtask] =
    useState("");

  const [newSubtaskPriority, setNewSubtaskPriority] =
    useState<TaskPriority>("NO_PRIORITY");

  const [newSubtaskDueDate, setNewSubtaskDueDate] =
    useState("");

  const [newSubtaskAssigneeId, setNewSubtaskAssigneeId] =
    useState("");

  const [isSubtaskInputOpen, setIsSubtaskInputOpen] =
    useState(false);

  const [isAddingSubtask, setIsAddingSubtask] =
    useState(false);

  const [subtaskError, setSubtaskError] =
    useState("");

  const [editingSubtaskId, setEditingSubtaskId] =
    useState<string | null>(null);

  const [openSubtaskMenu, setOpenSubtaskMenu] =
    useState<string | null>(null);

  const [editingSubtaskTitle, setEditingSubtaskTitle] =
    useState("");

  const [editingSubtaskPriority, setEditingSubtaskPriority] =
    useState<TaskPriority>("NO_PRIORITY");

  const [editingSubtaskDueDate, setEditingSubtaskDueDate] =
    useState("");

  const [editingSubtaskAssigneeId, setEditingSubtaskAssigneeId] =
    useState("");

  const [isUpdatingSubtask, setIsUpdatingSubtask] =
    useState(false);

  const subtaskMenuRef =
    useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Comment
  // =====================================================

  const [newComment, setNewComment] =
    useState("");

  const [isAddingComment, setIsAddingComment] =
    useState(false);

  const [commentError, setCommentError] =
    useState("");

  // =====================================================
  // Labels
  // =====================================================

  const [workspaceLabels, setWorkspaceLabels] =
    useState<ApiLabel[]>([]);

  const [newLabelName, setNewLabelName] =
    useState("");

  const [newLabelColor, setNewLabelColor] =
    useState("#7c3aed");

  const [selectedLabelId, setSelectedLabelId] =
    useState("");

  const [isAddingLabel, setIsAddingLabel] =
    useState(false);

  const [isAssigningLabel, setIsAssigningLabel] =
    useState(false);

  const [labelError, setLabelError] =
    useState("");

  // =====================================================
  // Members
  // =====================================================

  const [workspaceMembers, setWorkspaceMembers] =
    useState<WorkspaceMember[]>([]);

  // =====================================================
  // Dropdowns
  // =====================================================

  const [openMenu, setOpenMenu] =
    useState<
      "status" | "priority" | "member" | null
    >(null);

  // =====================================================
  // Load Task
  // =====================================================

  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTaskDetails(taskId);

        setTask(data);

        try {
          const labels =
            await getWorkspaceLabels(
              data.workspaceId,
            );

          setWorkspaceLabels(labels);
        } catch (labelError) {
          console.error(
            "Failed to load labels:",
            labelError,
          );
        }

        try {
          const members =
            await getWorkspaceMembers(
              data.workspaceId,
            );

          setWorkspaceMembers(members);
        } catch (memberError) {
          console.error(
            "Failed to load members:",
            memberError,
          );
        }
      } catch (err) {
        console.error(
          "Failed to load task:",
          err,
        );

        setError(
          "Unable to load task details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  // =====================================================
  // Close Subtask Menu When Clicking Outside
  // =====================================================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        subtaskMenuRef.current &&
        !subtaskMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenSubtaskMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // =====================================================
  // Update Task
  // =====================================================

  const handleUpdateTask = async (
    changes: Parameters<typeof updateTask>[1],
  ) => {
    if (!task) return;

    try {
      const updated =
        await updateTask(
          task.id,
          changes,
        );

      setTask(updated);
    } catch (err) {
      console.error(
        "Failed to update task:",
        err,
      );
    }

    setOpenMenu(null);
  };

  // =====================================================
  // Add Subtask
  // =====================================================

  const handleAddSubtask = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const title =
      newSubtask.trim();

    if (!title || !task) return;

    try {
      setIsAddingSubtask(true);
      setSubtaskError("");

      const created =
        await createSubtask(
          task.id,
          {
            title,
            priority:
              newSubtaskPriority,
            dueDate:
              newSubtaskDueDate ||
              undefined,
            assigneeId:
              newSubtaskAssigneeId ||
              undefined,
          },
        );

      setTask((current) => {
        if (!current) return current;

        return {
          ...current,
          subtasks: [
            ...current.subtasks,
            created,
          ],
        };
      });

      setNewSubtask("");
      setNewSubtaskPriority(
        "NO_PRIORITY",
      );
      setNewSubtaskDueDate("");
      setNewSubtaskAssigneeId("");
      setIsSubtaskInputOpen(true);
    } catch (err) {
      console.error(
        "Failed to create subtask:",
        err,
      );

      setSubtaskError(
        "Unable to create subtask.",
      );
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // =====================================================
  // Toggle Subtask
  // =====================================================

  const handleToggleSubtask = async (
    subtaskId: string,
    completed: boolean,
  ) => {
    if (!task) return;

    const previousTask = task;

    setTask((current) => {
      if (!current) return current;

      return {
        ...current,
        subtasks:
          current.subtasks.map(
            (subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    completed,
                  }
                : subtask,
          ),
      };
    });

    try {
      const updated =
        await updateSubtask(
          task.id,
          subtaskId,
          { completed },
        );

      setTask((current) => {
        if (!current) return current;

        return {
          ...current,
          subtasks:
            current.subtasks.map(
              (subtask) =>
                subtask.id === subtaskId
                  ? updated
                  : subtask,
            ),
        };
      });
    } catch (err) {
      console.error(
        "Failed to update subtask:",
        err,
      );

      setTask(previousTask);

      setSubtaskError(
        "Unable to update subtask.",
      );
    }
  };

  // =====================================================
  // Start Edit Subtask
  // =====================================================

  const handleStartEditSubtask = (
    subtask: ApiSubtask,
  ) => {
    setEditingSubtaskId(
      subtask.id,
    );

    setEditingSubtaskTitle(
      subtask.title,
    );

    setEditingSubtaskPriority(
      subtask.priority ||
        "NO_PRIORITY",
    );

    setEditingSubtaskDueDate(
      subtask.dueDate
        ? formatDateForInput(
            subtask.dueDate,
          )
        : "",
    );

    setEditingSubtaskAssigneeId(
      subtask.assigneeId || "",
    );

    setOpenSubtaskMenu(null);
  };

  // =====================================================
  // Cancel Edit Subtask
  // =====================================================

  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle("");
    setEditingSubtaskPriority(
      "NO_PRIORITY",
    );
    setEditingSubtaskDueDate("");
    setEditingSubtaskAssigneeId("");
  };

  // =====================================================
  // Save Subtask
  // =====================================================

  const handleSaveSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) return;

    const title =
      editingSubtaskTitle.trim();

    if (!title) {
      setSubtaskError(
        "Subtask title cannot be empty.",
      );
      return;
    }

    try {
      setIsUpdatingSubtask(true);
      setSubtaskError("");

      const updated =
        await updateSubtask(
          task.id,
          subtaskId,
          {
            title,
            priority:
              editingSubtaskPriority,
            dueDate:
              editingSubtaskDueDate ||
              undefined,
            assigneeId:
              editingSubtaskAssigneeId ||
              null,
          },
        );

      setTask((current) => {
        if (!current) return current;

        return {
          ...current,
          subtasks:
            current.subtasks.map(
              (subtask) =>
                subtask.id === subtaskId
                  ? updated
                  : subtask,
            ),
        };
      });

      handleCancelEditSubtask();
    } catch (err) {
      console.error(
        "Failed to update subtask:",
        err,
      );

      setSubtaskError(
        "Unable to update subtask.",
      );
    } finally {
      setIsUpdatingSubtask(false);
    }
  };

  // =====================================================
  // Delete Subtask
  // =====================================================

  const handleDeleteSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) return;

    const confirmed =
      window.confirm(
        "Delete this subtask?",
      );

    if (!confirmed) return;

    try {
      await deleteSubtask(
        task.id,
        subtaskId,
      );

      setTask((current) => {
        if (!current) return current;

        return {
          ...current,
          subtasks:
            current.subtasks.filter(
              (subtask) =>
                subtask.id !==
                subtaskId,
            ),
        };
      });

      setOpenSubtaskMenu(null);
    } catch (err) {
      console.error(
        "Failed to delete subtask:",
        err,
      );

      setSubtaskError(
        "Unable to delete subtask.",
      );
    }
  };

  // =====================================================
  // Add Comment
  // =====================================================

  const handleAddComment = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const content =
      newComment.trim();

    if (!content || !task) return;

    try {
      setIsAddingComment(true);
      setCommentError("");

      const storedUser =
        localStorage.getItem(
          "taskflow_user",
        );

      if (!storedUser) {
        throw new Error(
          "User session not found.",
        );
      }

      const user =
        JSON.parse(storedUser);

      if (!user?.id) {
        throw new Error(
          "User ID not found.",
        );
      }

      const created =
        await createComment(
          task.id,
          {
            content,
            userId: user.id,
          },
        );

      setTask((current) => {
        if (!current) return current;

        return {
          ...current,
          comments: [
            ...current.comments,
            created,
          ],
        };
      });

      setNewComment("");
    } catch (err) {
      console.error(
        "Failed to create comment:",
        err,
      );

      setCommentError(
        "Unable to add comment.",
      );
    } finally {
      setIsAddingComment(false);
    }
  };

  // =====================================================
  // Create Label
  // =====================================================

  const handleCreateLabel = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (
      !task ||
      !newLabelName.trim() ||
      isAddingLabel
    ) {
      return;
    }

    try {
      setIsAddingLabel(true);
      setLabelError("");

      const created =
        await createLabel(
          task.workspaceId,
          {
            name:
              newLabelName.trim(),
            color: newLabelColor,
          },
        );

      setWorkspaceLabels(
        (current) =>
          [...current, created].sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          ),
      );

      setNewLabelName("");
      setSelectedLabelId(
        created.id,
      );
    } catch (err) {
      console.error(
        "Failed to create label:",
        err,
      );

      setLabelError(
        "Unable to create label.",
      );
    } finally {
      setIsAddingLabel(false);
    }
  };

  // =====================================================
  // Assign Label
  // =====================================================

  const handleAssignLabel =
    async () => {
      if (
        !task ||
        !selectedLabelId ||
        isAssigningLabel
      ) {
        return;
      }

      if (
        task.labels.some(
          (label) =>
            label.id ===
            selectedLabelId,
        )
      ) {
        setSelectedLabelId("");
        return;
      }

      try {
        setIsAssigningLabel(true);
        setLabelError("");

        const updated =
          await assignLabel(
            task.id,
            selectedLabelId,
          );

        setTask(updated);
        setSelectedLabelId("");
      } catch (err) {
        console.error(
          "Failed to assign label:",
          err,
        );

        setLabelError(
          "Unable to assign label.",
        );
      } finally {
        setIsAssigningLabel(false);
      }
    };

  // =====================================================
  // Remove Label
  // =====================================================

  const handleRemoveLabel =
    async (
      labelId: string,
    ) => {
      if (
        !task ||
        isAssigningLabel
      ) {
        return;
      }

      try {
        setIsAssigningLabel(true);

        const updated =
          await removeLabel(
            task.id,
            labelId,
          );

        setTask(updated);
      } catch (err) {
        console.error(
          "Failed to remove label:",
          err,
        );
      } finally {
        setIsAssigningLabel(false);
      }
    };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
        <p className="text-sm text-zinc-400">
          Loading task...
        </p>
      </main>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error || !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-sm font-medium">
            {error ||
              "Task not found."}
          </p>

          <Link
            href="/tasks"
            className="mt-3 inline-flex text-xs text-violet-600 hover:underline"
          >
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // Calculations
  // =====================================================

  const completedSubtasks =
    task.subtasks.filter(
      (subtask) =>
        subtask.completed,
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="flex min-h-[64px] items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/tasks"
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0">
            <p className="text-[10px] text-zinc-400">
              Tasks
            </p>

            <h1 className="truncate text-sm font-semibold sm:text-base">
              {task.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="hidden rounded-md border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 sm:block dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-md border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-md border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* =================================================
          PAGE
      ================================================= */}

      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <section className="min-w-0">

            {/* Title */}

            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {task.title}
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {task.description ||
                  "Create and manage detailed task information."}
              </p>
            </div>

            {/* =================================================
                PROPERTIES
            ================================================= */}

            <div className="mb-5">
              <div className="mb-2 text-xs font-medium text-zinc-500">
                Properties
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {/* Assignee */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu ===
                        "member"
                        ? null
                        : "member",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <User className="h-3.5 w-3.5 text-zinc-400" />

                  {task.assignee?.name ||
                    "Unassigned"}

                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {/* Due date */}

                <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-500 dark:bg-red-950/30 dark:text-red-400">
                  <CalendarDays className="h-3.5 w-3.5" />

                  {task.dueDate
                    ? new Date(
                        task.dueDate,
                      ).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                        },
                      )
                    : "No date"}
                </span>

                {/* Priority */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu ===
                        "priority"
                        ? null
                        : "priority",
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs dark:border-zinc-700 ${priorityColors[task.priority]}`}
                >
                  <Clock3 className="h-3.5 w-3.5" />

                  {priorityLabels[
                    task.priority
                  ]}

                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {/* Member Dropdown */}

              {openMenu === "member" && (
                <Dropdown>
                  <DropdownTitle>
                    Members
                  </DropdownTitle>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateTask({
                        assigneeId:
                          undefined,
                      })
                    }
                    className="dropdown-item"
                  >
                    Unassigned
                  </button>

                  {workspaceMembers.map(
                    (member) => (
                      <button
                        key={
                          member.userId
                        }
                        type="button"
                        onClick={() =>
                          handleUpdateTask({
                            assigneeId:
                              member.userId,
                          })
                        }
                        className="dropdown-item"
                      >
                        {member.user.name}
                      </button>
                    ),
                  )}
                </Dropdown>
              )}

              {/* Priority Dropdown */}

              {openMenu ===
                "priority" && (
                <Dropdown>
                  <DropdownTitle>
                    Priority
                  </DropdownTitle>

                  {(
                    Object.keys(
                      priorityLabels,
                    ) as TaskPriority[]
                  ).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() =>
                          handleUpdateTask({
                            priority,
                          })
                        }
                        className="dropdown-item"
                      >
                        <span
                          className={
                            priorityColors[
                              priority
                            ]
                          }
                        >
                          {
                            priorityLabels[
                              priority
                            ]
                          }
                        </span>

                        {task.priority ===
                          priority && (
                          <Check className="ml-auto h-3.5 w-3.5" />
                        )}
                      </button>
                    ),
                  )}
                </Dropdown>
              )}
            </div>

            {/* =================================================
                LABELS
            ================================================= */}

            <div className="mb-5">
              <div className="mb-2 text-xs font-medium text-zinc-500">
                Labels
              </div>

              <div className="flex flex-wrap gap-1.5">
                {task.labels.map(
                  (label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium"
                      style={{
                        borderColor:
                          `${label.color}55`,
                        color:
                          label.color,
                        backgroundColor:
                          `${label.color}10`,
                      }}
                    >
                      <Tag className="h-3 w-3" />

                      {label.name}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveLabel(
                            label.id,
                          )
                        }
                        className="ml-0.5 opacity-50 hover:opacity-100"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ),
                )}

                <select
                  value=""
                  onChange={(event) => {
                    setSelectedLabelId(
                      event.target.value,
                    );

                    setTimeout(
                      handleAssignLabel,
                      0,
                    );
                  }}
                  className="h-6 rounded-md border border-dashed border-zinc-300 bg-transparent px-2 text-[10px] text-zinc-500 outline-none dark:border-zinc-700"
                >
                  <option value="">
                    + Add label
                  </option>

                  {workspaceLabels
                    .filter(
                      (label) =>
                        !task.labels.some(
                          (assigned) =>
                            assigned.id ===
                            label.id,
                        ),
                    )
                    .map((label) => (
                      <option
                        key={label.id}
                        value={label.id}
                      >
                        {label.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Create label */}

              <form
                onSubmit={
                  handleCreateLabel
                }
                className="mt-2 flex max-w-sm gap-2"
              >
                <input
                  value={newLabelName}
                  onChange={(event) =>
                    setNewLabelName(
                      event.target.value,
                    )
                  }
                  placeholder="Create label..."
                  className="h-8 min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2.5 text-xs outline-none focus:border-violet-400 dark:border-zinc-700"
                />

                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(event) =>
                    setNewLabelColor(
                      event.target.value,
                    )
                  }
                  className="h-8 w-9 rounded-md border border-zinc-200 p-1 dark:border-zinc-700"
                />

                <button
                  type="submit"
                  disabled={
                    !newLabelName.trim() ||
                    isAddingLabel
                  }
                  className="rounded-md border border-zinc-200 px-3 text-xs dark:border-zinc-700"
                >
                  Create
                </button>
              </form>

              {labelError && (
                <p className="mt-1 text-[10px] text-red-500">
                  {labelError}
                </p>
              )}
            </div>

            {/* =================================================
                RESOURCES
            ================================================= */}

            <div className="mb-6">
              <div className="mb-2 text-xs font-medium text-zinc-500">
                Resources
              </div>

              <button
                type="button"
                className="flex items-center gap-2 text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <Link2 className="h-3.5 w-3.5" />

                Add document or link...
              </button>
            </div>

            {/* =================================================
                SUBTASKS
            ================================================= */}

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />

                  <h3 className="text-sm font-semibold">
                    Subtasks
                  </h3>

                  <span className="text-[10px] text-zinc-400">
                    {completedSubtasks}/
                    {task.subtasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsSubtaskInputOpen(
                      (current) =>
                        !current,
                    )
                  }
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-3 w-3" />
                  Add Subtask
                </button>
              </div>

              {/* =================================================
                  ADD SUBTASK FORM
              ================================================= */}

              {isSubtaskInputOpen && (
                <form
                  onSubmit={
                    handleAddSubtask
                  }
                  className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <input
                    autoFocus
                    value={newSubtask}
                    onChange={(event) =>
                      setNewSubtask(
                        event.target.value,
                      )
                    }
                    placeholder="Enter subtask..."
                    className="mb-3 h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950"
                  />

                  <div className="flex flex-wrap items-center gap-2">

                    {/* Priority */}

                    <select
                      value={
                        newSubtaskPriority
                      }
                      onChange={(event) =>
                        setNewSubtaskPriority(
                          event.target
                            .value as TaskPriority,
                        )
                      }
                      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] outline-none dark:border-zinc-700 dark:bg-zinc-950"
                    >
                      {(
                        Object.keys(
                          priorityLabels,
                        ) as TaskPriority[]
                      ).map(
                        (priority) => (
                          <option
                            key={priority}
                            value={priority}
                          >
                            {
                              priorityLabels[
                                priority
                              ]
                            }
                          </option>
                        ),
                      )}
                    </select>

                    {/* Assignee */}

                    <select
                      value={
                        newSubtaskAssigneeId
                      }
                      onChange={(event) =>
                        setNewSubtaskAssigneeId(
                          event.target
                            .value,
                        )
                      }
                      className="h-8 max-w-[170px] rounded-md border border-zinc-200 bg-white px-2 text-[11px] outline-none dark:border-zinc-700 dark:bg-zinc-950"
                    >
                      <option value="">
                        Unassigned
                      </option>

                      {workspaceMembers.map(
                        (member) => (
                          <option
                            key={
                              member.userId
                            }
                            value={
                              member.userId
                            }
                          >
                            {member.user.name}
                          </option>
                        ),
                      )}
                    </select>

                    {/* Due Date */}

                    <input
                      type="date"
                      value={
                        newSubtaskDueDate
                      }
                      onChange={(event) =>
                        setNewSubtaskDueDate(
                          event.target.value,
                        )
                      }
                      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] outline-none dark:border-zinc-700 dark:bg-zinc-950"
                    />

                    <div className="ml-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setIsSubtaskInputOpen(
                            false,
                          )
                        }
                        className="h-8 rounded-md px-3 text-[11px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !newSubtask.trim() ||
                          isAddingSubtask
                        }
                        className="h-8 rounded-md bg-zinc-900 px-3 text-[11px] font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
                      >
                        {isAddingSubtask
                          ? "Adding..."
                          : "Add"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* =================================================
                  SUBTASK TABLE
              ================================================= */}

              <div className="overflow-visible rounded-lg border border-zinc-200 dark:border-zinc-800">

                {/* Table Header */}

                <div className="grid grid-cols-[minmax(0,1fr)_100px_125px_110px_40px] border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  <span>Task</span>
                  <span>Priority</span>
                  <span>Members</span>
                  <span>Due Date</span>
                  <span />
                </div>

                {task.subtasks.length ===
                0 ? (
                  <div className="px-4 py-7 text-center text-xs text-zinc-400">
                    No subtasks yet.
                  </div>
                ) : (
                  task.subtasks.map(
                    (subtask) => {
                      const isEditing =
                        editingSubtaskId ===
                        subtask.id;

                      return (
                        <div
                          key={
                            subtask.id
                          }
                          className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                        >
                          {isEditing ? (
                            /* =================================================
                               EDIT SUBTASK
                            ================================================= */

                            <div className="space-y-3 bg-zinc-50 p-3 dark:bg-zinc-900">
                              <input
                                value={
                                  editingSubtaskTitle
                                }
                                onChange={(
                                  event,
                                ) =>
                                  setEditingSubtaskTitle(
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950"
                              />

                              <div className="flex flex-wrap gap-2">
                                <select
                                  value={
                                    editingSubtaskPriority
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    setEditingSubtaskPriority(
                                      event
                                        .target
                                        .value as TaskPriority,
                                    )
                                  }
                                  className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                >
                                  {(
                                    Object.keys(
                                      priorityLabels,
                                    ) as TaskPriority[]
                                  ).map(
                                    (
                                      priority,
                                    ) => (
                                      <option
                                        key={
                                          priority
                                        }
                                        value={
                                          priority
                                        }
                                      >
                                        {
                                          priorityLabels[
                                            priority
                                          ]
                                        }
                                      </option>
                                    ),
                                  )}
                                </select>

                                <select
                                  value={
                                    editingSubtaskAssigneeId
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    setEditingSubtaskAssigneeId(
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  className="h-8 max-w-[170px] rounded-md border border-zinc-200 bg-white px-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                >
                                  <option value="">
                                    Unassigned
                                  </option>

                                  {workspaceMembers.map(
                                    (
                                      member,
                                    ) => (
                                      <option
                                        key={
                                          member.userId
                                        }
                                        value={
                                          member.userId
                                        }
                                      >
                                        {
                                          member
                                            .user
                                            .name
                                        }
                                      </option>
                                    ),
                                  )}
                                </select>

                                <input
                                  type="date"
                                  value={
                                    editingSubtaskDueDate
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    setEditingSubtaskDueDate(
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                />

                                <div className="ml-auto flex gap-2">
                                  <button
                                    type="button"
                                    onClick={
                                      handleCancelEditSubtask
                                    }
                                    className="rounded-md px-3 py-1.5 text-[10px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      isUpdatingSubtask
                                    }
                                    onClick={() =>
                                      handleSaveSubtask(
                                        subtask.id,
                                      )
                                    }
                                    className="rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] text-white disabled:opacity-40 dark:bg-white dark:text-black"
                                  >
                                    {isUpdatingSubtask
                                      ? "Saving..."
                                      : "Save"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* =================================================
                               NORMAL SUBTASK ROW
                            ================================================= */

                            <div className="grid grid-cols-[minmax(0,1fr)_100px_125px_110px_40px] items-center px-3 py-2.5 text-xs">

                              {/* Task */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSubtask(
                                    subtask.id,
                                    !subtask.completed,
                                  )
                                }
                                className="flex min-w-0 items-center gap-2 text-left"
                              >
                                {subtask.completed ? (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                ) : (
                                  <Circle className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                                )}

                                <span
                                  className={
                                    subtask.completed
                                      ? "truncate text-zinc-400 line-through"
                                      : "truncate"
                                  }
                                >
                                  {
                                    subtask.title
                                  }
                                </span>
                              </button>

                              {/* Priority */}

                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    priorityDotColors[
                                      subtask.priority ||
                                        "NO_PRIORITY"
                                    ]
                                  }`}
                                />

                                <span
                                  className={`text-[10px] ${
                                    priorityColors[
                                      subtask.priority ||
                                        "NO_PRIORITY"
                                    ]
                                  }`}
                                >
                                  {
                                    priorityLabels[
                                      subtask.priority ||
                                        "NO_PRIORITY"
                                    ]
                                  }
                                </span>
                              </div>

                              {/* Member */}

                              <div className="flex min-w-0 items-center gap-1.5">
                                <Avatar
                                  user={
                                    subtask.assignee
                                  }
                                  small
                                />

                                <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                                  {subtask
                                    .assignee
                                    ?.name ||
                                    "Unassigned"}
                                </span>
                              </div>

                              {/* Due Date */}

                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                <CalendarDays className="h-3 w-3 text-zinc-400" />

                                {subtask.dueDate
                                  ? new Date(
                                      subtask.dueDate,
                                    ).toLocaleDateString(
                                      undefined,
                                      {
                                        day: "numeric",
                                        month: "short",
                                      },
                                    )
                                  : "No date"}
                              </div>

                              {/* Actions */}

                              <div
                                className="relative flex justify-end"
                                ref={
                                  openSubtaskMenu ===
                                  subtask.id
                                    ? subtaskMenuRef
                                    : null
                                }
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenSubtaskMenu(
                                      openSubtaskMenu ===
                                        subtask.id
                                        ? null
                                        : subtask.id,
                                    )
                                  }
                                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                  aria-label="Subtask actions"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>

                                {openSubtaskMenu ===
                                  subtask.id && (
                                  <div className="absolute right-0 top-7 z-50 w-36 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStartEditSubtask(
                                          subtask,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteSubtask(
                                          subtask.id,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )
                )}
              </div>

              {subtaskError && (
                <p className="mt-2 text-[10px] text-red-500">
                  {subtaskError}
                </p>
              )}
            </section>

            {/* =================================================
                UPDATES
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />

                <h3 className="text-sm font-semibold">
                  Updates
                </h3>

                <span className="text-[10px] text-zinc-400">
                  {task.comments.length}
                </span>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
                {task.comments.length ===
                0 ? (
                  <div className="px-5 py-7 text-center">
                    <MessageCircle className="mx-auto h-5 w-5 text-zinc-300 dark:text-zinc-700" />

                    <p className="mt-2 text-xs text-zinc-400">
                      No updates yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {task.comments.map(
                      (comment) => (
                        <div
                          key={
                            comment.id
                          }
                          className="flex gap-3 p-4"
                        >
                          <Avatar
                            user={
                              comment.user
                            }
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-medium">
                                {comment.user
                                  ?.name ||
                                  "User"}
                              </span>

                              <span className="text-[10px] text-zinc-400">
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleString()}
                              </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                              {
                                comment.content
                              }
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {/* Comment */}

                <form
                  onSubmit={
                    handleAddComment
                  }
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <textarea
                    value={newComment}
                    onChange={(event) => {
                      setNewComment(
                        event.target
                          .value,
                      );

                      setCommentError("");
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (
                          newComment.trim() &&
                          !isAddingComment
                        ) {
                          event.currentTarget.form?.requestSubmit();
                        }
                      }
                    }}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full resize-none bg-transparent px-4 py-3 text-xs outline-none placeholder:text-zinc-400"
                  />

                  <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
                    <button
                      type="button"
                      disabled
                      className="p-1.5 text-zinc-300 dark:text-zinc-700"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>

                    <button
                      type="submit"
                      disabled={
                        !newComment.trim() ||
                        isAddingComment
                      }
                      className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
                    >
                      <Send className="h-3 w-3" />

                      {isAddingComment
                        ? "Posting..."
                        : "Comment"}
                    </button>
                  </div>
                </form>
              </div>

              {commentError && (
                <p className="mt-2 text-[10px] text-red-500">
                  {commentError}
                </p>
              )}
            </section>
          </section>

          {/* =================================================
              RIGHT DETAILS PANEL
          ================================================= */}

          <aside className="h-fit rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-3 w-3" />

                <h3 className="text-xs font-semibold">
                  Details
                </h3>
              </div>

              <button
                type="button"
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Status */}

            <DetailButton
              label="Status"
              value={
                statusLabels[
                  task.status
                ]
              }
              color="text-orange-500"
              onClick={() =>
                setOpenMenu(
                  openMenu ===
                    "status"
                    ? null
                    : "status",
                )
              }
            />

            {openMenu === "status" && (
              <div className="border-b border-zinc-100 px-4 pb-2 dark:border-zinc-800">
                {(
                  Object.keys(
                    statusLabels,
                  ) as ApiTaskDetails["status"][]
                ).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleUpdateTask({
                          status,
                        })
                      }
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {
                        statusLabels[
                          status
                        ]
                      }

                      {task.status ===
                        status && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* Priority */}

            <DetailButton
              label="Priority"
              value={
                priorityLabels[
                  task.priority
                ]
              }
              color={
                priorityColors[
                  task.priority
                ]
              }
              onClick={() =>
                setOpenMenu(
                  openMenu ===
                    "priority"
                    ? null
                    : "priority",
                )
              }
            />

            {/* Members */}

            <DetailRow
              icon={
                <User className="h-3.5 w-3.5" />
              }
              label="Members"
              value={
                task.assignee?.name ||
                "Unassigned"
              }
            />

            {/* Dates */}

            <DetailRow
              icon={
                <CalendarDays className="h-3.5 w-3.5" />
              }
              label="Dates"
              value={
                task.dueDate
                  ? new Date(
                      task.dueDate,
                    ).toLocaleDateString()
                  : "No date"
              }
            />

            {/* Labels */}

            <DetailRow
              icon={
                <Tag className="h-3.5 w-3.5" />
              }
              label="Labels"
              value={String(
                task.labels.length,
              )}
            />

            {/* Teams */}

            <DetailRow
              icon={
                <User className="h-3.5 w-3.5" />
              }
              label="Teams"
              value="Workspace"
            />

            {/* Reporter */}

            <DetailRow
              icon={
                <User className="h-3.5 w-3.5" />
              }
              label="Reporter"
              value={
                task.creator?.name ||
                "Unknown"
              }
            />

            {/* Updates */}

            <div className="border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 px-4 py-3">
                <ChevronDown className="h-3 w-3" />

                <span className="text-xs font-semibold">
                  Updates
                </span>
              </div>

              {task.comments
                .slice(-3)
                .reverse()
                .map(
                  (comment) => (
                    <div
                      key={
                        comment.id
                      }
                      className="flex gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800"
                    >
                      <Avatar
                        user={
                          comment.user
                        }
                        small
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium">
                          {comment.user
                            ?.name ||
                            "User"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                          {
                            comment.content
                          }
                        </p>

                        <p className="mt-1 text-[9px] text-zinc-400">
                          {new Date(
                            comment.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// =====================================================
// Helpers
// =====================================================

function formatDateForInput(
  date: string,
) {
  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return "";
  }

  const year =
    parsed.getFullYear();

  const month =
    String(
      parsed.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      parsed.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// =====================================================
// Dropdown
// =====================================================

function Dropdown({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative z-20 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {children}
    </div>
  );
}

function DropdownTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="px-2 pb-2 text-[10px] font-medium text-zinc-400">
      {children}
    </div>
  );
}

// =====================================================
// Detail Button
// =====================================================

function DetailButton({
  label,
  value,
  color,
  onClick,
}: {
  label: string;
  value: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-zinc-100 px-4 py-3 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
    >
      <span className="text-[10px] text-zinc-500">
        {label}
      </span>

      <span
        className={`text-[10px] font-medium ${
          color ||
          "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {value}
      </span>
    </button>
  );
}

// =====================================================
// Detail Row
// =====================================================

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}

        <span className="text-[10px] text-zinc-500">
          {label}
        </span>
      </div>

      <span className="max-w-[130px] truncate text-right text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
    </div>
  );
}

// =====================================================
// Avatar
// =====================================================

function Avatar({
  user,
  small = false,
}: {
  user?: ApiUser | null;
  small?: boolean;
}) {
  const size = small
    ? "h-6 w-6"
    : "h-7 w-7";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800`}
    >
      <User className="h-3.5 w-3.5 text-zinc-500" />
    </div>
  );
}