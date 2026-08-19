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
  onChange: (
    filters: TaskFilterState,
  ) => void;
}

/* =========================================================
   OPTIONS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

export default function TaskFilters({
  filters,
  onChange,
}: TaskFiltersProps) {
  const [open, setOpen] = useState<
    "status" | "priority" | "assignee" | null
  >(null);

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     CLOSE ON OUTSIDE CLICK / ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(
          target,
        )
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
      "pointerdown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open]);

  /* =======================================================
     UPDATE FILTER
  ======================================================= */

  const updateFilter = (
    key: keyof TaskFilterState,
    value: string,
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });

    setOpen(null);
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    onChange({
      status: "All",
      priority: "All",
      assignee: "All",
    });

    setOpen(null);
  };

  const hasFilters =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.assignee !== "All";

  /* =======================================================
     TOGGLE
  ======================================================= */

  const toggleDropdown = (
    type:
      | "status"
      | "priority"
      | "assignee",
  ) => {
    setOpen((current) =>
      current === type
        ? null
        : type,
    );
  };

  return (
    <div
      ref={containerRef}
      className="
        
       contents
      sm:flex
      sm:flex-wrap
      sm:items-center
      sm:gap-1.5
    "
    >
      {/* =================================================
          STATUS
      ================================================= */}

      <FilterDropdown
        label="Status"
        value={filters.status}
        options={statuses}
        isOpen={open === "status"}
        onToggle={() =>
          toggleDropdown("status")
        }
        onSelect={(value) =>
          updateFilter(
            "status",
            value,
          )
        }
      />

      {/* =================================================
          PRIORITY
      ================================================= */}

      <FilterDropdown
        label="Priority"
        value={filters.priority}
        options={priorities}
        isOpen={open === "priority"}
        onToggle={() =>
          toggleDropdown(
            "priority",
          )
        }
        onSelect={(value) =>
          updateFilter(
            "priority",
            value,
          )
        }
      />

      {/* =================================================
          MEMBER
      ================================================= */}

      <FilterDropdown
        label="Member"
        value={filters.assignee}
        options={members}
        isOpen={
          open === "assignee"
        }
        onToggle={() =>
          toggleDropdown(
            "assignee",
          )
        }
        onSelect={(value) =>
          updateFilter(
            "assignee",
            value,
          )
        }
      />

      {/* =================================================
          CLEAR
      ================================================= */}

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="
            flex
            h-8
            items-center
            gap-1
            rounded-md
            px-2
            text-[10px]
            font-medium
            text-zinc-500
            transition

            hover:bg-zinc-100
            hover:text-zinc-800

            dark:text-zinc-400
            dark:hover:bg-zinc-800
            dark:hover:text-zinc-100
          "
        >
          <X className="h-3 w-3" />

          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

/* =========================================================
   FILTER DROPDOWN
========================================================= */

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (
    value: string,
  ) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: FilterDropdownProps) {
  const isFiltered =
    value !== "All";

  return (
    <div className="relative">
      {/* =================================================
          TRIGGER
      ================================================= */}

      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`
          flex
          h-8
          items-center
          gap-1.5
          rounded-md
          border
          px-2.5
          text-[11px]
          font-medium
          transition

          ${
            isOpen
              ? `
                border-zinc-300
                bg-zinc-50
                text-zinc-900

                dark:border-zinc-600
                dark:bg-zinc-800
                dark:text-zinc-100
              `
              : isFiltered
                ? `
                  border-violet-200
                  bg-violet-50
                  text-violet-700

                  hover:bg-violet-100

                  dark:border-violet-800
                  dark:bg-violet-950/40
                  dark:text-violet-300
                  dark:hover:bg-violet-950/60
                `
                : `
                  border-zinc-200
                  bg-white
                  text-zinc-600

                  hover:bg-zinc-50
                  hover:text-zinc-900

                  dark:border-zinc-800
                  dark:bg-zinc-950
                  dark:text-zinc-300
                  dark:hover:bg-zinc-900
                  dark:hover:text-zinc-100
                `
          }
        `}
      >
        <span>{label}</span>

        {isFiltered && (
          <>
            <span className="text-zinc-300 dark:text-zinc-600">
              :
            </span>

            <span className="max-w-[80px] truncate">
              {value}
            </span>
          </>
        )}

        <ChevronDown
          className={`
            h-3
            w-3
            shrink-0
            transition-transform
            ${
              isOpen
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {isOpen && (
        <div
          role="menu"
          className="
            absolute
            left-0
            top-[calc(100%+6px)]
            z-[100]

            w-[170px]

            overflow-hidden
            rounded-md

            border
            border-zinc-200

            bg-white

            p-1

            shadow-[0_8px_24px_rgba(0,0,0,0.10)]

            dark:border-zinc-700
            dark:bg-zinc-900
            dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
          "
        >
          {/* Header */}

          <div
            className="
              px-2.5
              py-1.5
              text-[9px]
              font-medium
              uppercase
              tracking-wide
              text-zinc-400
              dark:text-zinc-500
            "
          >
            {label}
          </div>

          {/* Divider */}

          <div className="mb-1 border-t border-zinc-100 dark:border-zinc-800" />

          {/* Options */}

          {options.map(
            (option) => {
              const selected =
                option === value;

              return (
                <button
                  key={option}
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    onSelect(option)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded
                    px-2.5
                    py-2
                    text-left
                    text-[11px]
                    transition

                    ${
                      selected
                        ? `
                          bg-zinc-100
                          font-medium
                          text-zinc-900

                          dark:bg-zinc-800
                          dark:text-zinc-100
                        `
                        : `
                          text-zinc-600
                          hover:bg-zinc-50
                          hover:text-zinc-900

                          dark:text-zinc-300
                          dark:hover:bg-zinc-800
                          dark:hover:text-zinc-100
                        `
                    }
                  `}
                >
                  <span className="truncate">
                    {option}
                  </span>

                  {selected && (
                    <Check
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-violet-600
                        dark:text-violet-400
                      "
                    />
                  )}
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}