"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

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

  const hasFilters =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.assignee !== "All";

  const clearFilters = () => {
    onChange({
      status: "All",
      priority: "All",
      assignee: "All",
    });
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {/* Status */}
      <FilterDropdown
        label="Status"
        value={filters.status}
        options={statuses}
        isOpen={open === "status"}
        onToggle={() =>
          setOpen(open === "status" ? null : "status")
        }
        onSelect={(value) => updateFilter("status", value)}
      />

      {/* Priority */}
      <FilterDropdown
        label="Priority"
        value={filters.priority}
        options={priorities}
        isOpen={open === "priority"}
        onToggle={() =>
          setOpen(open === "priority" ? null : "priority")
        }
        onSelect={(value) => updateFilter("priority", value)}
      />

      {/* Member */}
      <FilterDropdown
        label="Member"
        value={filters.assignee}
        options={members}
        isOpen={open === "assignee"}
        onToggle={() =>
          setOpen(open === "assignee" ? null : "assignee")
        }
        onSelect={(value) => updateFilter("assignee", value)}
      />

      {/* Clear */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

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
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs transition ${
          isFiltered
            ? "border-violet-200 bg-violet-50 text-violet-700"
            : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        {label}

        {isFiltered && (
          <span className="max-w-[80px] truncate font-medium">
            {value}
          </span>
        )}

        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-11 z-30 w-44 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg">
          {options.map((option) => {
            const selected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50"
              >
                <span>{option}</span>

                {selected && (
                  <Check className="h-3.5 w-3.5 text-violet-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}