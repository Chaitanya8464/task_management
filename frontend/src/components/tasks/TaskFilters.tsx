"use client";

import {
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export interface TaskFilterState {
  status: string;
  priority: string;
  assignee: string;
}

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
}

const statuses = [
  "All",
  "To Do",
  "Doing",
  "Completed",
  "On Hold",
];

const priorities = [
  "All",
  "Urgent",
  "High",
  "Medium",
  "Low",
  "No Priority",
];

const members = [
  "All",
  "John",
  "Sarah",
  "Mike",
  "Alex",
  "David",
];

export default function TaskFilters({
  filters,
  onChange,
}: TaskFiltersProps) {
  const [open, setOpen] = useState<
    "status" | "priority" | "assignee" | null
  >(null);

  // Refs for each dropdown
  const statusRef =
    useRef<HTMLDivElement | null>(null);

  const priorityRef =
    useRef<HTMLDivElement | null>(null);

  const assigneeRef =
    useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Close dropdown when clicking outside
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      const clickedInsideStatus =
        statusRef.current?.contains(target);

      const clickedInsidePriority =
        priorityRef.current?.contains(target);

      const clickedInsideAssignee =
        assigneeRef.current?.contains(target);

      if (
        !clickedInsideStatus &&
        !clickedInsidePriority &&
        !clickedInsideAssignee
      ) {
        setOpen(null);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open]);

  // =====================================================
  // Update filter
  // =====================================================

  const updateFilter = (
    key: keyof TaskFilterState,
    value: string,
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });

    // Close dropdown after selecting
    setOpen(null);
  };

  // =====================================================
  // Check if filters are active
  // =====================================================

  const hasFilters =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.assignee !== "All";

  // =====================================================
  // Clear filters
  // =====================================================

  const clearFilters = () => {
    onChange({
      status: "All",
      priority: "All",
      assignee: "All",
    });

    setOpen(null);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {/* =================================================
          Status
      ================================================= */}

      <div
        ref={statusRef}
        className="relative"
      >
        <FilterDropdown
          label="Status"
          value={filters.status}
          options={statuses}
          isOpen={open === "status"}
          onToggle={() =>
            setOpen(
              open === "status"
                ? null
                : "status",
            )
          }
          onSelect={(value) =>
            updateFilter(
              "status",
              value,
            )
          }
        />
      </div>

      {/* =================================================
          Priority
      ================================================= */}

      <div
        ref={priorityRef}
        className="relative"
      >
        <FilterDropdown
          label="Priority"
          value={filters.priority}
          options={priorities}
          isOpen={open === "priority"}
          onToggle={() =>
            setOpen(
              open === "priority"
                ? null
                : "priority",
            )
          }
          onSelect={(value) =>
            updateFilter(
              "priority",
              value,
            )
          }
        />
      </div>

      {/* =================================================
          Member
      ================================================= */}

      <div
        ref={assigneeRef}
        className="relative"
      >
        <FilterDropdown
          label="Member"
          value={filters.assignee}
          options={members}
          isOpen={open === "assignee"}
          onToggle={() =>
            setOpen(
              open === "assignee"
                ? null
                : "assignee",
            )
          }
          onSelect={(value) =>
            updateFilter(
              "assignee",
              value,
            )
          }
        />
      </div>

      {/* =================================================
          Clear
      ================================================= */}

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <X className="h-3.5 w-3.5" />

          Clear
        </button>
      )}
    </div>
  );
}

// =====================================================
// Filter Dropdown
// =====================================================

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: FilterDropdownProps) {
  const isFiltered = value !== "All";

  return (
    <div className="relative">
      {/* =================================================
          Trigger
      ================================================= */}

      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs transition ${
          isFiltered
            ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/60"
            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <span>{label}</span>

        {isFiltered && (
          <span className="max-w-[80px] truncate font-medium">
            {value}
          </span>
        )}

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* =================================================
          Dropdown
      ================================================= */}

      {isOpen && (
        <div
          className="absolute left-0 top-11 z-50 w-44 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          role="menu"
        >
          {options.map((option) => {
            const selected =
              option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onSelect(option)
                }
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition ${
                  selected
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
                role="menuitem"
              >
                <span>
                  {option}
                </span>

                {selected && (
                  <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}