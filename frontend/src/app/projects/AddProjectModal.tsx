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
  useRef,
  useState,
} from "react";

import {
  createProject,
  getWorkspaceMembers,
  type ApiProject,
  type ApiUser,
  type CreateProjectInput,
  type TaskPriority,
  type WorkspaceMember,
} from "@/lib/api";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (project: ApiProject) => void;
  workspaceId: string;
}

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

export default function AddProjectModal({
  open,
  onClose,
  onCreated,
  workspaceId,
}: AddProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("NO_PRIORITY");

  const [dueDate, setDueDate] =
    useState("");

  const [leadId, setLeadId] =
    useState("");

  const [members, setMembers] = useState<
    WorkspaceMember[]
  >([]);

  const [openMenu, setOpenMenu] =
    useState<
      "priority" | "lead" | null
    >(null);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // Load workspace members
  // =====================================================

  useEffect(() => {
    if (!open || !workspaceId) {
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      setLoadingMembers(true);

      try {
        const data =
          await getWorkspaceMembers(
            workspaceId,
          );

        if (!cancelled) {
          setMembers(data);
        }
      } catch (error) {
        console.error(
          "Failed to load workspace members:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoadingMembers(false);
        }
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [open, workspaceId]);

  // =====================================================
  // Reset form
  // =====================================================

  const resetForm = () => {
    setName("");
    setDescription("");
    setPriority("NO_PRIORITY");
    setDueDate("");
    setLeadId("");
    setOpenMenu(null);
    setError("");
  };

  // =====================================================
  // Close modal
  // =====================================================

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  // =====================================================
  // Escape key
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
  });

  // =====================================================
  // Outside click
  // =====================================================

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      handleClose();
    }
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        "Project name is required.",
      );
      return;
    }

    if (!workspaceId) {
      setError(
        "No workspace selected.",
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const input: CreateProjectInput = {
        name: name.trim(),
        description:
          description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        workspaceId,
        leadId: leadId || undefined,
      };

      const project =
        await createProject(input);

      onCreated?.(project);

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        "Failed to create project:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create project. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  const selectedMember =
    members.find(
      (member) =>
        member.userId === leadId,
    );

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
      onMouseDown={
        handleBackdropClick
      }
    >
      <div
        ref={modalRef}
        className="
          w-full
          max-w-[520px]
          overflow-visible
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
            flex
            items-center
            justify-between
            border-b
            border-zinc-200
            px-5
            py-4
            dark:border-zinc-800
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
              Create project
            </h2>

            <p
              className="
                mt-0.5
                text-[11px]
                text-zinc-400
                dark:text-zinc-500
              "
            >
              Add a new project to your
              workspace.
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
            {/* Project name */}

            <div>
              <label
                htmlFor="project-name"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Project name
              </label>

              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                placeholder="e.g. Website redesign"
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
                  dark:focus:border-violet-500
                "
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="project-description"
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
                id="project-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Describe what this project is about..."
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

            {/* Priority + Lead */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Priority */}

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
                    text-zinc-700
                    transition
                    hover:bg-zinc-50
                    dark:border-zinc-700
                    dark:bg-zinc-950
                    dark:text-zinc-300
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
                            text-zinc-700
                            hover:bg-zinc-100
                            dark:text-zinc-300
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

              {/* Lead */}

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
                  Project lead
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === "lead"
                        ? null
                        : "lead",
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
                    text-zinc-700
                    transition
                    hover:bg-zinc-50
                    dark:border-zinc-700
                    dark:bg-zinc-950
                    dark:text-zinc-300
                    dark:hover:bg-zinc-900
                  "
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {selectedMember ? (
                      <>
                        <Avatar
                          user={
                            selectedMember.user
                          }
                        />

                        <span className="truncate">
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
                          No lead
                        </span>
                      </>
                    )}
                  </div>

                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                </button>

                {openMenu ===
                  "lead" && (
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
                    <button
                      type="button"
                      onClick={() => {
                        setLeadId("");
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
                        text-zinc-700
                        hover:bg-zinc-100
                        dark:text-zinc-300
                        dark:hover:bg-zinc-800
                      "
                    >
                      <span>
                        No lead
                      </span>

                      {!leadId && (
                        <Check className="h-3.5 w-3.5 text-violet-600" />
                      )}
                    </button>

                    {loadingMembers ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                      </div>
                    ) : members.length ===
                      0 ? (
                      <p className="px-2.5 py-3 text-xs text-zinc-400">
                        No workspace members
                        found.
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
                              setLeadId(
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
                              text-zinc-700
                              hover:bg-zinc-100
                              dark:text-zinc-300
                              dark:hover:bg-zinc-800
                            "
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Avatar
                                user={
                                  member.user
                                }
                              />

                              <span className="truncate">
                                {
                                  member
                                    .user
                                    .name
                                }
                              </span>
                            </div>

                            {leadId ===
                              member.userId && (
                              <Check className="h-3.5 w-3.5 text-violet-600" />
                            )}
                          </button>
                        ),
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Due date */}

            <div>
              <label
                htmlFor="project-due-date"
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
                  id="project-due-date"
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

          {/* Error */}

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
                !name.trim()
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
                : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================
// Priority
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
        "text-amber-500 dark:text-amber-400",
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

  const item = config[priority];

  return (
    <span className={item.className}>
      {item.label}
    </span>
  );
}

// =====================================================
// Avatar
// =====================================================

function Avatar({
  user,
}: {
  user: ApiUser;
}) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="
          h-5
          w-5
          shrink-0
          rounded-full
          object-cover
        "
      />
    );
  }

  return (
    <div
      className="
        flex
        h-5
        w-5
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-zinc-100
        text-[9px]
        font-medium
        text-zinc-600
        dark:bg-zinc-800
        dark:text-zinc-300
      "
    >
      {user.name
        .charAt(0)
        .toUpperCase()}
    </div>
  );
}