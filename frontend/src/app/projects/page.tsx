"use client";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Check,
  ArrowUp,
  ArrowDown,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import {
  ApiProject,
  TaskPriority,
  getProjects,
  deleteProject,
} from "@/lib/api";

type PriorityFilter =
  | TaskPriority
  | "ALL";

interface VisibleFields {
  priority: boolean;
  lead: boolean;
  dueDate: boolean;
}

const priorityConfig: Record<
  TaskPriority,
  {
    label: string;
    className: string;
  }
> = {
  URGENT: {
    label: "Urgent",
    className: "text-rose-500",
  },

  HIGH: {
    label: "High",
    className: "text-red-500",
  },

  MEDIUM: {
    label: "Medium",
    className: "text-orange-500",
  },

  LOW: {
    label: "Low",
    className: "text-zinc-400",
  },

  NO_PRIORITY: {
    label: "No Priority",
    className: "text-zinc-400",
  },
};

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] =
    useState<ApiProject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("ALL");

  const [fieldsOpen, setFieldsOpen] =
    useState(false);

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  const [menuProject, setMenuProject] =
    useState<string | null>(null);

  const [visibleFields, setVisibleFields] =
    useState<VisibleFields>({
      priority: true,
      lead: true,
      dueDate: true,
    });

  const fieldsRef =
    useRef<HTMLDivElement>(null);

  const filterRef =
    useRef<HTMLDivElement>(null);

  const sortRef =
    useRef<HTMLDivElement>(null);

  // =====================================================
  // Load Projects
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const storedWorkspace =
          localStorage.getItem(
            "taskflow_workspace",
          );

        let workspaceId:
          | string
          | undefined;

        if (storedWorkspace) {
          try {
            const workspace =
              JSON.parse(
                storedWorkspace,
              );

            workspaceId =
              workspace?.id;
          } catch {
            console.error(
              "Invalid workspace data",
            );
          }
        }

        const data =
          await getProjects(
            workspaceId,
          );

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err,
        );

        if (!cancelled) {
          setError(
            "Unable to load projects.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // Close menus when clicking outside
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        fieldsRef.current &&
        !fieldsRef.current.contains(
          target,
        )
      ) {
        setFieldsOpen(false);
      }

      if (
        filterRef.current &&
        !filterRef.current.contains(
          target,
        )
      ) {
        setFilterOpen(false);
      }

      if (
        sortRef.current &&
        !sortRef.current.contains(
          target,
        )
      ) {
        setSortOpen(false);
      }

      setMenuProject(null);
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  // =====================================================
  // Search + Filter
  // =====================================================

  const filteredProjects =
    projects.filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          );

      const matchesPriority =
        priorityFilter === "ALL" ||
        project.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesPriority
      );
    });

  // =====================================================
  // Sort
  // =====================================================

  const sortProjects = (
    direction: "asc" | "desc",
  ) => {
    setProjects((current) =>
      [...current].sort((a, b) => {
        const comparison =
          a.name.localeCompare(
            b.name,
          );

        return direction === "asc"
          ? comparison
          : -comparison;
      }),
    );

    setSortOpen(false);
  };

  // =====================================================
  // Toggle Fields
  // =====================================================

  const toggleField = (
    field: keyof VisibleFields,
  ) => {
    setVisibleFields(
      (current) => ({
        ...current,
        [field]: !current[field],
      }),
    );
  };

  // =====================================================
  // Delete Project
  // =====================================================

  const handleDeleteProject = async (
    project: ApiProject,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${project.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(
        project.id,
      );

      setProjects((current) =>
        current.filter(
          (item) =>
            item.id !== project.id,
        ),
      );

      setMenuProject(null);
    } catch (err) {
      console.error(
        "Failed to delete project:",
        err,
      );

      setError(
        "Unable to delete project.",
      );
    }
  };

  // =====================================================
  // Project Detail
  // =====================================================

  const openProject = (
    projectId: string,
  ) => {
    router.push(
      `/projects/${projectId}`,
    );
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
        {/* =================================================
            Header
        ================================================= */}

        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">
                Projects
              </h1>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Manage your workspace
                projects
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                h-9
                shrink-0
                items-center
                gap-2
                rounded-md
                bg-black
                px-3
                text-xs
                font-medium
                text-white
                transition
                hover:bg-zinc-800
                dark:bg-white
                dark:text-black
                dark:hover:bg-zinc-200
              "
            >
              <Plus className="h-3.5 w-3.5" />

              <span className="hidden sm:inline">
                Add Project
              </span>

              <span className="sm:hidden">
                Add
              </span>
            </button>
          </div>
        </div>

        {/* =================================================
            Toolbar
        ================================================= */}

        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
            {/* Search */}

            <div className="relative min-w-[180px] flex-1 sm:max-w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search projects..."
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  pl-9
                  pr-3
                  text-xs
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  focus:border-zinc-400
                  dark:border-zinc-800
                  dark:bg-zinc-950
                  dark:focus:border-zinc-600
                "
              />
            </div>

            {/* Fields */}

            <div
              ref={fieldsRef}
              className="relative"
            >
              <ToolbarButton
                active={fieldsOpen}
                onClick={() => {
                  setFieldsOpen(
                    (current) =>
                      !current,
                  );

                  setFilterOpen(false);
                  setSortOpen(false);
                }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Fields
                <ChevronDown className="h-3 w-3" />
              </ToolbarButton>

              {fieldsOpen && (
                <Dropdown>
                  <DropdownTitle>
                    Visible fields
                  </DropdownTitle>

                  <FieldOption
                    label="Priority"
                    checked={
                      visibleFields.priority
                    }
                    onClick={() =>
                      toggleField(
                        "priority",
                      )
                    }
                  />

                  <FieldOption
                    label="Lead"
                    checked={
                      visibleFields.lead
                    }
                    onClick={() =>
                      toggleField(
                        "lead",
                      )
                    }
                  />

                  <FieldOption
                    label="Due Date"
                    checked={
                      visibleFields.dueDate
                    }
                    onClick={() =>
                      toggleField(
                        "dueDate",
                      )
                    }
                  />
                </Dropdown>
              )}
            </div>

            {/* Filter */}

            <div
              ref={filterRef}
              className="relative"
            >
              <ToolbarButton
                active={filterOpen}
                onClick={() => {
                  setFilterOpen(
                    (current) =>
                      !current,
                  );

                  setFieldsOpen(false);
                  setSortOpen(false);
                }}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
                <ChevronDown className="h-3 w-3" />
              </ToolbarButton>

              {filterOpen && (
                <Dropdown>
                  <DropdownTitle>
                    Priority
                  </DropdownTitle>

                  <FilterOption
                    label="All"
                    selected={
                      priorityFilter ===
                      "ALL"
                    }
                    onClick={() => {
                      setPriorityFilter(
                        "ALL",
                      );
                      setFilterOpen(false);
                    }}
                  />

                  {(
                    [
                      "URGENT",
                      "HIGH",
                      "MEDIUM",
                      "LOW",
                      "NO_PRIORITY",
                    ] as TaskPriority[]
                  ).map(
                    (priority) => (
                      <FilterOption
                        key={priority}
                        label={
                          priorityConfig[
                            priority
                          ].label
                        }
                        selected={
                          priorityFilter ===
                          priority
                        }
                        onClick={() => {
                          setPriorityFilter(
                            priority,
                          );

                          setFilterOpen(
                            false,
                          );
                        }}
                      />
                    ),
                  )}
                </Dropdown>
              )}
            </div>

            {/* Sort */}

            <div
              ref={sortRef}
              className="relative"
            >
              <ToolbarButton
                active={sortOpen}
                onClick={() => {
                  setSortOpen(
                    (current) =>
                      !current,
                  );

                  setFieldsOpen(false);
                  setFilterOpen(false);
                }}
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Sort
                <ChevronDown className="h-3 w-3" />
              </ToolbarButton>

              {sortOpen && (
                <Dropdown>
                  <button
                    type="button"
                    onClick={() =>
                      sortProjects("asc")
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-md
                      px-2.5
                      py-2
                      text-left
                      text-xs
                      hover:bg-zinc-100
                      dark:hover:bg-zinc-800
                    "
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    Name A–Z
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      sortProjects("desc")
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-md
                      px-2.5
                      py-2
                      text-left
                      text-xs
                      hover:bg-zinc-100
                      dark:hover:bg-zinc-800
                    "
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    Name Z–A
                  </button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            Error
        ================================================= */}

        {error && (
          <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 sm:mx-6">
            {error}
          </div>
        )}

        {/* =================================================
            Content
        ================================================= */}

        <div className="px-4 py-4 sm:px-6">
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center gap-2 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading projects...
              </div>
            ) : (
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Project
                    </th>

                    {visibleFields.priority && (
                      <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Priority
                      </th>
                    )}

                    {visibleFields.lead && (
                      <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Lead
                      </th>
                    )}

                    {visibleFields.dueDate && (
                      <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Due Date
                      </th>
                    )}

                    <th className="w-12 px-3 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map(
                    (project) => (
                      <tr
                        key={project.id}
                        className="
                          group
                          border-b
                          border-zinc-100
                          last:border-0
                          hover:bg-zinc-50
                          dark:border-zinc-800
                          dark:hover:bg-zinc-900/60
                        "
                      >
                        {/* Project */}

                        <td className="px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              openProject(
                                project.id,
                              )
                            }
                            className="
                              text-left
                              text-xs
                              font-medium
                              text-zinc-800
                              hover:text-violet-600
                              dark:text-zinc-200
                              dark:hover:text-violet-400
                            "
                          >
                            {project.name}
                          </button>

                          {project.description && (
                            <p className="mt-0.5 max-w-[280px] truncate text-[10px] text-zinc-400">
                              {
                                project.description
                              }
                            </p>
                          )}
                        </td>

                        {/* Priority */}

                        {visibleFields.priority && (
                          <td className="px-3 py-3.5">
                            <PriorityBadge
                              priority={
                                project.priority
                              }
                            />
                          </td>
                        )}

                        {/* Lead */}

                        {visibleFields.lead && (
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={
                                  project
                                    .lead
                                    ?.name ||
                                  "Guest"
                                }
                                avatar={
                                  project
                                    .lead
                                    ?.avatar
                                }
                              />

                              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                {project
                                  .lead
                                  ?.name ||
                                  "—"}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Due Date */}

                        {visibleFields.dueDate && (
                          <td className="px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {formatDate(
                              project.dueDate,
                            )}
                          </td>
                        )}

                        {/* Actions */}

                        <td className="relative px-3 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuProject(
                                menuProject ===
                                  project.id
                                  ? null
                                  : project.id,
                              )
                            }
                            className="
                              rounded-md
                              p-1.5
                              text-zinc-400
                              transition
                              hover:bg-zinc-100
                              hover:text-zinc-700
                              dark:hover:bg-zinc-800
                              dark:hover:text-zinc-200
                            "
                            aria-label="Project actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {menuProject ===
                            project.id && (
                            <div
                              className="
                                absolute
                                right-2
                                top-11
                                z-50
                                w-40
                                rounded-lg
                                border
                                border-zinc-200
                                bg-white
                                p-1
                                shadow-xl
                                dark:border-zinc-800
                                dark:bg-zinc-900
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  openProject(
                                    project.id,
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2
                                  rounded-md
                                  px-2.5
                                  py-2
                                  text-left
                                  text-xs
                                  hover:bg-zinc-100
                                  dark:hover:bg-zinc-800
                                "
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Open project
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteProject(
                                    project,
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2
                                  rounded-md
                                  px-2.5
                                  py-2
                                  text-left
                                  text-xs
                                  text-red-500
                                  hover:bg-red-50
                                  dark:hover:bg-red-950/30
                                "
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete project
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ),
                  )}

                  {!loading &&
                    filteredProjects.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={
                            2 +
                            Number(
                              visibleFields.priority,
                            ) +
                            Number(
                              visibleFields.lead,
                            ) +
                            Number(
                              visibleFields.dueDate,
                            )
                          }
                          className="px-6 py-16 text-center"
                        >
                          <div className="text-sm text-zinc-400">
                            {search ||
                            priorityFilter !==
                              "ALL"
                              ? "No matching projects"
                              : "No projects yet"}
                          </div>

                          <p className="mt-1 text-xs text-zinc-400">
                            Create a project to
                            get started.
                          </p>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// =====================================================
// Toolbar Button
// =====================================================

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-9
        items-center
        gap-2
        rounded-md
        border
        px-3
        text-xs
        transition
        ${
          active
            ? "border-zinc-400 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
            : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        }
      `}
    >
      {children}
    </button>
  );
}

// =====================================================
// Dropdown
// =====================================================

function Dropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-11
        z-50
        w-52
        rounded-lg
        border
        border-zinc-200
        bg-white
        p-1.5
        shadow-xl
        dark:border-zinc-800
        dark:bg-zinc-900
      "
    >
      {children}
    </div>
  );
}

function DropdownTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
      {children}
    </div>
  );
}

// =====================================================
// Field Option
// =====================================================

function FieldOption({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      <span>{label}</span>

      <span
        className={`
          flex
          h-4
          w-4
          items-center
          justify-center
          rounded
          border
          ${
            checked
              ? "border-violet-600 bg-violet-600 text-white"
              : "border-zinc-300 dark:border-zinc-600"
          }
        `}
      >
        {checked && (
          <Check className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

// =====================================================
// Filter Option
// =====================================================

function FilterOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      <span>{label}</span>

      {selected && (
        <Check className="h-3.5 w-3.5 text-violet-600" />
      )}
    </button>
  );
}

// =====================================================
// Priority Badge
// =====================================================

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  const config =
    priorityConfig[priority];

  return (
    <div
      className={`flex items-center gap-1.5 ${config.className}`}
    >
      <span className="text-[10px]">
        {priority === "URGENT"
          ? "▲"
          : priority === "HIGH"
            ? "▰"
            : priority === "MEDIUM"
              ? "◒"
              : "·"}
      </span>

      <span className="text-xs">
        {config.label}
      </span>
    </div>
  );
}

// =====================================================
// Avatar
// =====================================================

function Avatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string | null;
}) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-6 w-6 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="
        flex
        h-6
        w-6
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
      {name
        .split(" ")
        .map(
          (part) => part[0],
        )
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
}

// =====================================================
// Date
// =====================================================

function formatDate(
  date?: string | null,
) {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}