"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface TaskFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  comments: boolean;
}

interface FieldsMenuProps {
  fields: TaskFields;
  onChange: (fields: TaskFields) => void;
}

const fieldOptions: {
  key: keyof TaskFields;
  label: string;
}[] = [
  {
    key: "priority",
    label: "Priority",
  },
  {
    key: "members",
    label: "Members",
  },
  {
    key: "dueDate",
    label: "Due Date",
  },
  {
    key: "comments",
    label: "Comments",
  },
];

export default function FieldsMenu({
  fields,
  onChange,
}: FieldsMenuProps) {
  const [open, setOpen] = useState(false);

  const toggleField = (key: keyof TaskFields) => {
    onChange({
      ...fields,
      [key]: !fields[key],
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs transition ${
          open
            ? "border-zinc-300 bg-zinc-50 text-zinc-800"
            : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        <span>Fields</span>

        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-48 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
          <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
            Visible fields
          </p>

          {fieldOptions.map((option) => {
            const checked = fields[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleField(option.key)}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50"
              >
                <span>{option.label}</span>

                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    checked
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-zinc-300"
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}