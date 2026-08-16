"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  UserCircle,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createTask,
  getWorkspaceMembers,
  type ApiTask,
  type CreateTaskInput,
  type TaskPriority,
  type TaskStatus,
  type WorkspaceMember,
} from "@/lib/api";

// =====================================================
// Props
// =====================================================

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (task: ApiTask) => void;

  /*
   * IMPORTANT:
   * Task belongs to a workspace AND a project.
   */
  workspaceId: string;
  projectId?: string;

  /*
   * Optional current user.
   */
  creatorId?: string;
}

// =====================================================
// Priority Options
// =====================================================

const priorities: {
  value: TaskPriority;
  label: string;
}[] = [
  {
    value: "NO_PRIORITY",
    label: "No Priority",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "LOW",
    label: "Low",
  },
];

// =====================================================
// Status Options
// =====================================================

const statuses: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "TODO",
    label: "To Do",
  },
  {
    value: "DOING",
    label: "In Progress",
  },
  {
    value: "ON_HOLD",
    label: "On Hold",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

// =====================================================
// Component
// =====================================================

export default function AddTaskModal({
  open,
  onClose,
  onCreated,
  workspaceId,
  projectId,
  creatorId,
}: AddTaskModalProps) {
  // =====================================================
  // Form State
  // =====================================================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>(
      "NO_PRIORITY",
    );

  const [status, setStatus] =
    useState<TaskStatus>("TODO");

  const [dueDate, setDueDate] =
    useState("");

  const [assigneeId, setAssigneeId] =
    useState("");

  // =====================================================
  // Members
  // =====================================================

  const [members, setMembers] =
    useState<WorkspaceMember[]>([]);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  // =====================================================
  // UI State
  // =====================================================

  const [openMenu, setOpenMenu] =
    useState<
      "priority" | "status" | "assignee" | null
    >(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // Load Workspace Members
  // =====================================================

  useEffect(() => {
    if (!open || !workspaceId) {
      return;
    }

    let cancelled = false;

    async function loadMembers() {
      setLoadingMembers(true);

      try {
        const data =
          await getWorkspaceMembers(
            workspaceId,
          );

        if (!cancelled) {
          setMembers(data);
        }
      } catch (err) {
        console.error(
          "Failed to load workspace members:",
          err,
        );

        if (!cancelled) {
          setMembers([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMembers(false);
        }
      }
    }

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [open, workspaceId]);

  // =====================================================
  // Reset Form
  // =====================================================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("NO_PRIORITY");
    setStatus("TODO");
    setDueDate("");
    setAssigneeId("");
    setOpenMenu(null);
    setError("");
  };

  // =====================================================
  // Close Modal
  // =====================================================

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  // =====================================================
  // Escape Key
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, submitting]);

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------

    if (!title.trim()) {
      setError(
        "Task title is required.",
      );
      return;
    }

    if (!workspaceId) {
      setError(
        "No workspace selected.",
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Tasks must belong to a project.
     *
     * Therefore we don't allow creating a
     * project-less task from this modal.
     */
    if (!projectId) {
      setError(
        "No project selected. Please create the task from a project.",
      );
      return;
    }

    // ---------------------------------------------------
    // Submit
    // ---------------------------------------------------

    setSubmitting(true);
    setError("");

    try {
      /*
       * RELATIONAL STRUCTURE:
       *
       * workspaceId
       *      ↓
       *   Workspace
       *      ↓
       *   Project
       *      ↓
       *    Task
       *
       * projectId connects this task to
       * the current project.
       */

      const input: CreateTaskInput = {
        title: title.trim(),

        description:
          description.trim() ||
          undefined,

        priority,

        status,

        dueDate:
          dueDate || undefined,

        workspaceId,

        projectId,

        assigneeId:
          assigneeId || undefined,

        creatorId:
          creatorId || undefined,
      };

      const task =
        await createTask(input);

      // Send created task to parent page.
      onCreated?.(task);

      resetForm();

      onClose();
    } catch (err) {
      console.error(
        "Failed to create task:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create task. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // Don't Render
  // =====================================================

  if (!open) {
    return null;
  }

  // =====================================================
  // Selected Assignee
  // =====================================================

  const selectedMember =
    members.find(
      (member) =>
        member.userId ===
        assigneeId,
    );

  // =====================================================
  // Render
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/45
        px-4
        py-6
        backdrop-blur-[2px]
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      {/* =================================================
          Modal
      ================================================= */}

      <div
        className="
          w-full
          max-w-[540px]
          max-h-[calc(100vh-48px)]
          overflow-y-auto
          rounded-xl
          border
          border-zinc-200
          bg-white
          shadow-2xl
          dark:border-zinc-800
          dark:bg-zinc-950
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-zinc-200
            bg-white
            px-5
            py-4
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >
          <div>
            <h2
              className="
                text-[15px]
                font-semibold
                text-zinc-900
                dark:text-zinc-100
              "
            >
              Create task
            </h2>

            <p
              className="
                mt-0.5
                text-[11px]
                text-zinc-400
                dark:text-zinc-500
              "
            >
              Add a task to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-zinc-400
              transition
              hover:bg-zinc-100
              hover:text-zinc-700
              disabled:opacity-50
              dark:text-zinc-500
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-200
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* =================================================
            Form
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="px-5 py-5"
        >
          <div className="space-y-4">
            {/* =================================================
                Title
            ================================================= */}

            <div>
              <label
                htmlFor="task-title"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Task title
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder="e.g. Design homepage"
                autoFocus
                className="
                  h-10
                  w-full
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  px-3
                  text-sm
                  text-zinc-900
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-500/10
                  dark:border-zinc-700
                  dark:bg-zinc-950
                  dark:text-zinc-100
                  dark:placeholder:text-zinc-600
                "
              />
            </div>

            {/* =================================================
                Description
            ================================================= */}

            <div>
              <label
                htmlFor="task-description"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Description

                <span className="ml-1 font-normal text-zinc-400">
                  Optional
                </span>
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Describe the task..."
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-zinc-900
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-500/10
                  dark:border-zinc-700
                  dark:bg-zinc-950
                  dark:text-zinc-100
                  dark:placeholder:text-zinc-600
                "
              />
            </div>

            {/* =================================================
                Priority + Status
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* =================================================
                  Priority
              ================================================= */}

              <div className="relative">
                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  Priority
                </label>

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
                  className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    border
                    border-zinc-200
                    bg-white
                    px-3
                    text-sm
                    transition
                    hover:bg-zinc-50
                    dark:border-zinc-700
                    dark:bg-zinc-950
                    dark:hover:bg-zinc-900
                  "
                >
                  <PriorityLabel
                    priority={priority}
                  />

                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>

                {openMenu ===
                  "priority" && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-[68px]
                      z-50
                      rounded-lg
                      border
                      border-zinc-200
                      bg-white
                      p-1.5
                      shadow-xl
                      dark:border-zinc-700
                      dark:bg-zinc-900
                    "
                  >
                    {priorities.map(
                      (item) => (
                        <button
                          key={
                            item.value
                          }
                          type="button"
                          onClick={() => {
                            setPriority(
                              item.value,
                            );
                            setOpenMenu(
                              null,
                            );
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-md
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            hover:bg-zinc-100
                            dark:hover:bg-zinc-800
                          "
                        >
                          <PriorityLabel
                            priority={
                              item.value
                            }
                          />

                          {priority ===
                            item.value && (
                            <Check className="h-3.5 w-3.5 text-violet-600" />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  Status
              ================================================= */}

              <div className="relative">
                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  Status
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu ===
                        "status"
                        ? null
                        : "status",
                    )
                  }
                  className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    border
                    border-zinc-200
                    bg-white
                    px-3
                    text-sm
                    transition
                    hover:bg-zinc-50
                    dark:border-zinc-700
                    dark:bg-zinc-950
                    dark:hover:bg-zinc-900
                  "
                >
                  <StatusLabel
                    status={status}
                  />

                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>

                {openMenu ===
                  "status" && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-[68px]
                      z-50
                      rounded-lg
                      border
                      border-zinc-200
                      bg-white
                      p-1.5
                      shadow-xl
                      dark:border-zinc-700
                      dark:bg-zinc-900
                    "
                  >
                    {statuses.map(
                      (item) => (
                        <button
                          key={
                            item.value
                          }
                          type="button"
                          onClick={() => {
                            setStatus(
                              item.value,
                            );
                            setOpenMenu(
                              null,
                            );
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-md
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            hover:bg-zinc-100
                            dark:hover:bg-zinc-800
                          "
                        >
                          <StatusLabel
                            status={
                              item.value
                            }
                          />

                          {status ===
                            item.value && (
                            <Check className="h-3.5 w-3.5 text-violet-600" />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                Assignee
            ================================================= */}

            <div className="relative">
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Assignee

                <span className="ml-1 font-normal text-zinc-400">
                  Optional
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu ===
                      "assignee"
                      ? null
                      : "assignee",
                  )
                }
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-between
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  px-3
                  text-sm
                  transition
                  hover:bg-zinc-50
                  dark:border-zinc-700
                  dark:bg-zinc-950
                  dark:hover:bg-zinc-900
                "
              >
                <div className="flex min-w-0 items-center gap-2">
                  {selectedMember ? (
                    <>
                      <Avatar
                        name={
                          selectedMember
                            .user.name
                        }
                        avatar={
                          selectedMember
                            .user.avatar
                        }
                        size="small"
                      />

                      <span className="truncate text-zinc-700 dark:text-zinc-300">
                        {
                          selectedMember
                            .user.name
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <UserCircle className="h-4 w-4 text-zinc-400" />

                      <span className="text-zinc-400 dark:text-zinc-500">
                        No assignee
                      </span>
                    </>
                  )}
                </div>

                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
              </button>

              {openMenu ===
                "assignee" && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[68px]
                    z-50
                    max-h-52
                    overflow-y-auto
                    rounded-lg
                    border
                    border-zinc-200
                    bg-white
                    p-1.5
                    shadow-xl
                    dark:border-zinc-700
                    dark:bg-zinc-900
                  "
                >
                  {/* No Assignee */}

                  <button
                    type="button"
                    onClick={() => {
                      setAssigneeId("");
                      setOpenMenu(
                        null,
                      );
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-md
                      px-2.5
                      py-2
                      text-left
                      text-xs
                      hover:bg-zinc-100
                      dark:hover:bg-zinc-800
                    "
                  >
                    <span>
                      No assignee
                    </span>

                    {!assigneeId && (
                      <Check className="h-3.5 w-3.5 text-violet-600" />
                    )}
                  </button>

                  {/* Loading */}

                  {loadingMembers ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                  ) : members.length ===
                    0 ? (
                    <p className="px-2.5 py-3 text-xs text-zinc-400">
                      No workspace
                      members found.
                    </p>
                  ) : (
                    members.map(
                      (member) => (
                        <button
                          key={
                            member.id
                          }
                          type="button"
                          onClick={() => {
                            setAssigneeId(
                              member.userId,
                            );

                            setOpenMenu(
                              null,
                            );
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-md
                            px-2.5
                            py-2
                            text-left
                            text-xs
                            hover:bg-zinc-100
                            dark:hover:bg-zinc-800
                          "
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Avatar
                              name={
                                member
                                  .user
                                  .name
                              }
                              avatar={
                                member
                                  .user
                                  .avatar
                              }
                              size="small"
                            />

                            <span className="truncate">
                              {
                                member
                                  .user
                                  .name
                              }
                            </span>
                          </div>

                          {assigneeId ===
                            member.userId && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                          )}
                        </button>
                      ),
                    )
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                Due Date
            ================================================= */}

            <div>
              <label
                htmlFor="task-due-date"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Due date

                <span className="ml-1 font-normal text-zinc-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <CalendarDays
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-zinc-400
                  "
                />

                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  className="
                    h-10
                    w-full
                    rounded-md
                    border
                    border-zinc-200
                    bg-white
                    pl-9
                    pr-3
                    text-sm
                    text-zinc-700
                    outline-none
                    transition
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-500/10
                    dark:border-zinc-700
                    dark:bg-zinc-950
                    dark:text-zinc-300
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              Error
          ================================================= */}

          {error && (
            <div
              className="
                mt-4
                rounded-md
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                text-red-600
                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              Footer
          ================================================= */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-end
              gap-2
              border-t
              border-zinc-100
              pt-4
              dark:border-zinc-800
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="
                h-9
                rounded-md
                px-4
                text-xs
                font-medium
                text-zinc-600
                transition
                hover:bg-zinc-100
                disabled:opacity-50
                dark:text-zinc-400
                dark:hover:bg-zinc-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !title.trim()
              }
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-md
                bg-black
                px-4
                text-xs
                font-medium
                text-white
                transition
                hover:bg-zinc-800
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-white
                dark:text-black
                dark:hover:bg-zinc-200
              "
            >
              {submitting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}

              {submitting
                ? "Creating..."
                : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================
// Priority Label
// =====================================================

function PriorityLabel({
  priority,
}: {
  priority: TaskPriority;
}) {
  const config: Record<
    TaskPriority,
    {
      label: string;
      className: string;
    }
  > = {
    URGENT: {
      label: "Urgent",
      className:
        "text-rose-600 dark:text-rose-400",
    },

    HIGH: {
      label: "High",
      className:
        "text-red-500 dark:text-red-400",
    },

    MEDIUM: {
      label: "Medium",
      className:
        "text-orange-500 dark:text-orange-400",
    },

    LOW: {
      label: "Low",
      className:
        "text-blue-500 dark:text-blue-400",
    },

    NO_PRIORITY: {
      label: "No Priority",
      className:
        "text-zinc-500 dark:text-zinc-400",
    },
  };

  return (
    <span
      className={
        config[priority].className
      }
    >
      {config[priority].label}
    </span>
  );
}

// =====================================================
// Status Label
// =====================================================

function StatusLabel({
  status,
}: {
  status: TaskStatus;
}) {
  const config: Record<
    TaskStatus,
    {
      label: string;
      className: string;
    }
  > = {
    TODO: {
      label: "To Do",
      className:
        "text-zinc-600 dark:text-zinc-300",
    },

    DOING: {
      label: "In Progress",
      className:
        "text-blue-600 dark:text-blue-400",
    },

    COMPLETED: {
      label: "Completed",
      className:
        "text-emerald-600 dark:text-emerald-400",
    },

    ON_HOLD: {
      label: "On Hold",
      className:
        "text-amber-600 dark:text-amber-400",
    },
  };

  return (
    <span
      className={
        config[status].className
      }
    >
      {config[status].label}
    </span>
  );
}

// =====================================================
// Avatar
// =====================================================

function Avatar({
  name,
  avatar,
  size = "normal",
}: {
  name: string;
  avatar?: string | null;
  size?: "small" | "normal";
}) {
  const sizeClass =
    size === "small"
      ? "h-5 w-5 text-[8px]"
      : "h-8 w-8 text-[10px]";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`
          ${sizeClass}
          shrink-0
          rounded-full
          object-cover
        `}
      />
    );
  }

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map(
        (part) => part.charAt(0),
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div
      className={`
        ${sizeClass}
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-zinc-100
        font-medium
        text-zinc-600
        dark:bg-zinc-800
        dark:text-zinc-300
      `}
    >
      {initials}
    </div>
  );
}