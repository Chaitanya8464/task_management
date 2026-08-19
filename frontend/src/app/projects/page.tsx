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

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import {
  ApiProject,
  TaskPriority,
  getProjects,
} from "@/lib/api";

import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectDialog from "./DeleteProjectDialog";

// =====================================================
// Types
// =====================================================

type PriorityFilter =
  | TaskPriority
  | "ALL";

interface VisibleFields {
  priority: boolean;
  lead: boolean;
  dueDate: boolean;
}

interface MenuPosition {
  top: number;
  right: number;
}

// =====================================================
// Priority Config
// =====================================================

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

// =====================================================
// Page
// =====================================================

export default function ProjectsPage() {
  const router = useRouter();

  // =====================================================
  // Projects
  // =====================================================

  const [projects, setProjects] =
    useState<ApiProject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // Search / Filter
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("ALL");

  // =====================================================
  // Dropdowns
  // =====================================================

  const [fieldsOpen, setFieldsOpen] =
    useState(false);

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  // =====================================================
  // Project Action Menu
  // =====================================================

  const [menuProject, setMenuProject] =
    useState<string | null>(null);

  const [menuPosition, setMenuPosition] =
    useState<MenuPosition | null>(null);

  // =====================================================
  // Project Modals
  // =====================================================

  const [addProjectOpen, setAddProjectOpen] =
    useState(false);

  const [editProject, setEditProject] =
    useState<ApiProject | null>(null);

  const [deleteProjectTarget, setDeleteProjectTarget] =
    useState<ApiProject | null>(null);

  // =====================================================
  // Visible Fields
  // =====================================================

  const [visibleFields, setVisibleFields] =
    useState<VisibleFields>({
      priority: true,
      lead: true,
      dueDate: true,
    });

  // =====================================================
  // Refs
  // =====================================================

  const fieldsRef =
    useRef<HTMLDivElement>(null);

  const filterRef =
    useRef<HTMLDivElement>(null);

  const sortRef =
    useRef<HTMLDivElement>(null);

  // =====================================================
  // Workspace ID
  // =====================================================

  const getWorkspaceId = () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return "";
    }

    try {
      const storedWorkspace =
        localStorage.getItem(
          "taskflow_workspace",
        );

      if (!storedWorkspace) {
        return "";
      }

      const workspace =
        JSON.parse(
          storedWorkspace,
        );

      return workspace?.id || "";
    } catch {
      return "";
    }
  };

  // =====================================================
  // Load Projects
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const workspaceId =
          getWorkspaceId();

        const data =
          await getProjects(
            workspaceId ||
              undefined,
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
  // Close toolbar dropdowns
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      // Fields
      if (
        fieldsRef.current &&
        !fieldsRef.current.contains(
          target,
        )
      ) {
        setFieldsOpen(false);
      }

      // Filter
      if (
        filterRef.current &&
        !filterRef.current.contains(
          target,
        )
      ) {
        setFilterOpen(false);
      }

      // Sort
      if (
        sortRef.current &&
        !sortRef.current.contains(
          target,
        )
      ) {
        setSortOpen(false);
      }

      // Project menu
      const projectMenu =
        document.querySelector(
          "[data-project-menu]",
        );

      if (
        projectMenu &&
        projectMenu.contains(target)
      ) {
        return;
      }

      setMenuProject(null);
      setMenuPosition(null);
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
  // Close project menu on scroll
  // =====================================================

  useEffect(() => {
    if (!menuProject) {
      return;
    }

    const handleScroll = () => {
      setMenuProject(null);
      setMenuPosition(null);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      true,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true,
      );
    };
  }, [menuProject]);

  // =====================================================
  // Close project menu on resize
  // =====================================================

  useEffect(() => {
    if (!menuProject) {
      return;
    }

    const handleResize = () => {
      setMenuProject(null);
      setMenuPosition(null);
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [menuProject]);

  // =====================================================
  // Search + Filter
  // =====================================================

  const filteredProjects =
    projects.filter((project) => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(searchValue);

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
      [...current].sort(
        (a, b) => {
          const comparison =
            a.name.localeCompare(
              b.name,
            );

          return direction ===
            "asc"
            ? comparison
            : -comparison;
        },
      ),
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
        [field]:
          !current[field],
      }),
    );
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

  // =====================================================
  // Open Project Action Menu
  // =====================================================

  const toggleProjectMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: string,
  ) => {
    event.stopPropagation();

    // Close if already open
    if (
      menuProject === projectId
    ) {
      setMenuProject(null);
      setMenuPosition(null);
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 176;
    const menuHeight = 128;
    const gap = 6;
    const viewportPadding = 8;

    // Default: below button
    let top =
      rect.bottom + gap;

    // Right aligned with button
    let right =
      window.innerWidth -
      rect.right;

    // -------------------------------------------------
    // Keep menu inside horizontal viewport
    // -------------------------------------------------

    if (
      right +
        menuWidth >
      window.innerWidth -
        viewportPadding
    ) {
      right =
        viewportPadding;
    }

    // Prevent menu from going outside
    // the left side.
    const calculatedLeft =
      window.innerWidth -
      right -
      menuWidth;

    if (
      calculatedLeft <
      viewportPadding
    ) {
      right =
        window.innerWidth -
        menuWidth -
        viewportPadding;
    }

    // -------------------------------------------------
    // If there is not enough space below,
    // open above the button.
    // -------------------------------------------------

    if (
      top +
        menuHeight >
      window.innerHeight -
        viewportPadding
    ) {
      top =
        rect.top -
        menuHeight -
        gap;
    }

    // -------------------------------------------------
    // Final top safety check
    // -------------------------------------------------

    if (
      top <
      viewportPadding
    ) {
      top =
        viewportPadding;
    }

    setMenuProject(projectId);

    setMenuPosition({
      top,
      right,
    });
  };

  // =====================================================
  // Close Project Menu
  // =====================================================

  const closeProjectMenu = () => {
    setMenuProject(null);
    setMenuPosition(null);
  };

  // =====================================================
  // Get Selected Project
  // =====================================================

  const getSelectedProject = () => {
    if (!menuProject) {
      return null;
    }

    return (
      projects.find(
        (project) =>
          project.id ===
          menuProject,
      ) || null
    );
  };

  // =====================================================
  // Selected project for menu
  // =====================================================

  const selectedMenuProject =
    getSelectedProject();

  // =====================================================
  // Render
  // =====================================================

 return (
  <AppShell>
    <div
      className="
        min-h-full
    min-w-0
    max-w-full
    overflow-x-hidden
    bg-white
    text-zinc-900
    dark:bg-zinc-950
    dark:text-zinc-100
      "
    >
     {/* =================================================
    PROJECT HEADER + TOOLBAR
================================================= */}

<div
  className="
    border-b
    border-zinc-200
    dark:border-zinc-800
  "
>
  {/* =================================================
      DESKTOP / MOBILE HEADER
  ================================================= */}

  <div
    className="
      flex
      flex-col
      gap-3
      px-4
      py-3
      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:px-5
      sm:py-4
    "
  >
    {/* =================================================
        TITLE
    ================================================= */}

    <div className="min-w-0 shrink-0">
      <h1
        className="
          text-sm
          font-semibold
          tracking-tight
          text-zinc-900
          dark:text-zinc-100
          sm:text-base
        "
      >
        Projects
      </h1>
    </div>

    {/* =================================================
        ACTION AREA
    ================================================= */}

    <div
      className="
        flex
        min-w-0
        flex-1
        flex-col
        gap-2
        sm:flex-row
        sm:items-center
        sm:justify-end
      "
    >
      {/* =================================================
          SEARCH
      ================================================= */}

      <div
        className="
          relative
          w-full
          sm:w-[220px]
        "
      >
        <Search
          className="
            pointer-events-none
            absolute
            left-2.5
            top-1/2
            h-3.5
            w-3.5
            -translate-y-1/2
            text-zinc-400
          "
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search projects..."
          className="
            h-8
            w-full
            rounded-md
            border
            border-zinc-200
            bg-white
            pl-8
            pr-2.5
            text-[11px]
            text-zinc-800
            outline-none
            placeholder:text-zinc-400
            transition
            focus:border-zinc-400

            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-100
            dark:focus:border-zinc-600
          "
        />
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div
        className="
          flex
          min-w-0
          flex-wrap
          items-center
          gap-1.5
          sm:flex-nowrap
        "
      >
        {/* =================================================
            FIELDS
        ================================================= */}

        <div
          ref={fieldsRef}
          className="relative shrink-0"
        >
          <ToolbarButton
            active={fieldsOpen}
            onClick={() => {
              setFieldsOpen(
                (current) => !current,
              );

              setFilterOpen(false);
              setSortOpen(false);
            }}
          >
            <SlidersHorizontal className="h-3 w-3" />

            <span>Fields</span>

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
                  toggleField("priority")
                }
              />

              <FieldOption
                label="Lead"
                checked={
                  visibleFields.lead
                }
                onClick={() =>
                  toggleField("lead")
                }
              />

              <FieldOption
                label="Due Date"
                checked={
                  visibleFields.dueDate
                }
                onClick={() =>
                  toggleField("dueDate")
                }
              />
            </Dropdown>
          )}
        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div
          ref={filterRef}
          className="relative shrink-0"
        >
          <ToolbarButton
            active={filterOpen}
            onClick={() => {
              setFilterOpen(
                (current) => !current,
              );

              setFieldsOpen(false);
              setSortOpen(false);
            }}
          >
            <Filter className="h-3 w-3" />

            <span>Filter</span>

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
                  priorityFilter === "ALL"
                }
                onClick={() => {
                  setPriorityFilter("ALL");
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
              ).map((priority) => (
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

                    setFilterOpen(false);
                  }}
                />
              ))}
            </Dropdown>
          )}
        </div>

        {/* =================================================
            SORT
        ================================================= */}

        <div
          ref={sortRef}
          className="relative shrink-0"
        >
          <ToolbarButton
            active={sortOpen}
            onClick={() => {
              setSortOpen(
                (current) => !current,
              );

              setFieldsOpen(false);
              setFilterOpen(false);
            }}
          >
            <ArrowUp className="h-3 w-3" />

            <span>Sort</span>

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

        {/* =================================================
            ADD PROJECT
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setAddProjectOpen(true)
          }
          className="
            flex
            h-8
            shrink-0
            items-center
            gap-1.5
            rounded-md
            bg-zinc-900
            px-3
            text-[11px]
            font-medium
            text-white
            transition
            hover:bg-zinc-800
            active:scale-[0.99]

            dark:bg-white
            dark:text-black
            dark:hover:bg-zinc-200
          "
        >
          <Plus className="h-3 w-3" />

          <span className="hidden xs:inline sm:inline">
            Add Project
          </span>

          <span className="sm:hidden">
            Add
          </span>
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Error */}

      {error && (
        <div
          className="
            mx-5
            mt-3
            rounded-md
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-xs
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="px-5 py-4">
        <div
          className="
            overflow-x-auto
            rounded-lg
            border
            border-zinc-200
            dark:border-zinc-800
          "
        >
          {loading ? (
            <div
              className="
                flex
                min-h-[220px]
                items-center
                justify-center
                gap-2
                text-xs
                text-zinc-400
              "
            >
              <Loader2 className="h-4 w-4 animate-spin" />

              Loading projects...
            </div>
          ) : (
            <table
              className="
                w-full
                min-w-[760px]
                border-collapse
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-zinc-200
                    bg-zinc-50
                    dark:border-zinc-800
                    dark:bg-zinc-900/60
                  "
                >
                  <th
                    className="
                      px-3
                      py-2.5
                      text-left
                      text-[10px]
                      font-medium
                      text-zinc-500
                    "
                  >
                    Project
                  </th>

                  {visibleFields.priority && (
                    <th
                      className="
                        w-[140px]
                        px-3
                        py-2.5
                        text-left
                        text-[10px]
                        font-medium
                        text-zinc-500
                      "
                    >
                      Priority
                    </th>
                  )}

                  {visibleFields.lead && (
                    <th
                      className="
                        w-[170px]
                        px-3
                        py-2.5
                        text-left
                        text-[10px]
                        font-medium
                        text-zinc-500
                      "
                    >
                      Lead
                    </th>
                  )}

                  {visibleFields.dueDate && (
                    <th
                      className="
                        w-[150px]
                        px-3
                        py-2.5
                        text-left
                        text-[10px]
                        font-medium
                        text-zinc-500
                      "
                    >
                      Due Date
                    </th>
                  )}

                  <th className="w-10 px-2" />
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
                        dark:hover:bg-zinc-900/50
                      "
                    >
                      {/* Project */}

                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            openProject(
                              project.id,
                            )
                          }
                          className="
                            block
                            max-w-full
                            truncate
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
                          <p
                            className="
                              mt-0.5
                              max-w-[520px]
                              truncate
                              text-[10px]
                              text-zinc-400
                            "
                          >
                            {
                              project.description
                            }
                          </p>
                        )}
                      </td>

                      {/* Priority */}

                      {visibleFields.priority && (
                        <td className="px-3 py-2.5">
                          <PriorityBadge
                            priority={
                              project.priority
                            }
                          />
                        </td>
                      )}

                      {/* Lead */}

                      {visibleFields.lead && (
                        <td className="px-3 py-2.5">
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

                            <span
                              className="
                                truncate
                                text-[11px]
                                text-zinc-600
                                dark:text-zinc-400
                              "
                            >
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
                        <td
                          className="
                            px-3
                            py-2.5
                            text-[11px]
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          {formatDate(
                            project.dueDate,
                          )}
                        </td>
                      )}

                      {/* Actions */}

                      <td className="px-2 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={(event) =>
                            toggleProjectMenu(
                              event,
                              project.id,
                            )
                          }
                          className="
                            rounded-md
                            p-1
                            text-zinc-400
                            opacity-0
                            transition
                            hover:bg-zinc-100
                            hover:text-zinc-700
                            group-hover:opacity-100
                            dark:hover:bg-zinc-800
                            dark:hover:text-zinc-200
                          "
                          aria-label="Project actions"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
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
                        className="
                          px-6
                          py-14
                          text-center
                        "
                      >
                        <div className="text-xs text-zinc-400">
                          {search ||
                          priorityFilter !==
                            "ALL"
                            ? "No matching projects"
                            : "No projects yet"}
                        </div>

                        <p className="mt-1 text-[10px] text-zinc-400">
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

    {/* =================================================
        PROJECT ACTION MENU
    ================================================= */}

    {menuProject &&
      menuPosition && (
        <div
          data-project-menu
          className="
            fixed
            z-[200]
            w-44
            rounded-lg
            border
            border-zinc-200
            bg-white
            p-1
            shadow-xl
            dark:border-zinc-800
            dark:bg-zinc-900
          "
          style={{
            top: menuPosition.top,
            right: menuPosition.right,
          }}
          onMouseDown={(event) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            onClick={() => {
              if (!selectedMenuProject) {
                return;
              }

              const projectId =
                selectedMenuProject.id;

              closeProjectMenu();

              openProject(projectId);
            }}
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
            onClick={() => {
              if (!selectedMenuProject) {
                return;
              }

              setEditProject(
                selectedMenuProject,
              );

              closeProjectMenu();
            }}
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

            Edit project
          </button>

          <button
            type="button"
            onClick={() => {
              if (!selectedMenuProject) {
                return;
              }

              setDeleteProjectTarget(
                selectedMenuProject,
              );

              closeProjectMenu();
            }}
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

    {/* Modals remain exactly as your current implementation */}

    <AddProjectModal
      open={addProjectOpen}
      onClose={() =>
        setAddProjectOpen(false)
      }
      workspaceId={getWorkspaceId()}
      onCreated={(project) => {
        setProjects((current) => [
          project,
          ...current,
        ]);

        setAddProjectOpen(false);
      }}
    />

    <EditProjectModal
      open={Boolean(editProject)}
      project={editProject}
      workspaceId={getWorkspaceId()}
      onClose={() =>
        setEditProject(null)
      }
      onUpdated={(updatedProject) => {
        setProjects((current) =>
          current.map((project) =>
            project.id ===
            updatedProject.id
              ? {
                  ...project,
                  ...updatedProject,
                }
              : project,
          ),
        );

        setEditProject(null);
      }}
    />

    <DeleteProjectDialog
      open={Boolean(
        deleteProjectTarget,
      )}
      project={deleteProjectTarget}
      onClose={() =>
        setDeleteProjectTarget(null)
      }
      onDeleted={(projectId) => {
        setProjects((current) =>
          current.filter(
            (project) =>
              project.id !==
              projectId,
          ),
        );

        setDeleteProjectTarget(null);
      }}
    />
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
        h-8
        items-center
        gap-1.5
        rounded-md
        border
        px-2.5
        text-[11px]
        transition
        ${
          active
            ? `
              border-zinc-400
              bg-zinc-50
              text-zinc-900
              dark:border-zinc-600
              dark:bg-zinc-900
              dark:text-zinc-100
            `
            : `
              border-zinc-200
              text-zinc-600
              hover:bg-zinc-50
              dark:border-zinc-700
              dark:text-zinc-300
              dark:hover:bg-zinc-900
            `
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
        left-0
        top-[calc(100%+6px)]
        z-[200]

        w-[190px]
        max-w-[calc(100vw-24px)]

        overflow-hidden
        rounded-lg

        border
        border-zinc-200
        bg-white

        p-1.5

        shadow-[0_8px_24px_rgba(0,0,0,0.10)]

        dark:border-zinc-700
        dark:bg-zinc-900
        dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]

        sm:left-auto
        sm:right-0
      "
    >
      {children}
    </div>
  );
}
// =====================================================
// Dropdown Title
// =====================================================

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

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
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