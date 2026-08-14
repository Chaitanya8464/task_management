"use client";

import {
  Check,
  ChevronDown,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Close when clicking outside
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

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
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
  // Toggle field
  // =====================================================

  const toggleField = (
    key: keyof TaskFields,
  ) => {
    onChange({
      ...fields,
      [key]: !fields[key],
    });
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* =================================================
          Fields Button
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-haspopup="menu"
        aria-expanded={open}
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
            open
              ? `
                border-zinc-300
                bg-zinc-50
                text-zinc-800
                dark:border-zinc-600
                dark:bg-zinc-800
                dark:text-zinc-100
              `
              : `
                border-zinc-200
                bg-white
                text-zinc-600
                hover:bg-zinc-50
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-zinc-300
                dark:hover:bg-zinc-800
              `
          }
        `}
      >
        <span>Fields</span>

        <ChevronDown
          className={`
            h-3.5
            w-3.5
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* =================================================
          Dropdown
      ================================================= */}

      {open && (
        <div
          className="
            absolute
            left-0
            top-11
            z-50
            w-48
            rounded-lg
            border
            border-zinc-200
            bg-white
            p-2
            shadow-xl
            dark:border-zinc-700
            dark:bg-zinc-900
          "
          role="menu"
        >
          {/* Header */}

          <p
            className="
              px-2
              py-1.5
              text-[10px]
              font-medium
              uppercase
              tracking-wide
              text-zinc-400
              dark:text-zinc-500
            "
          >
            Visible fields
          </p>

          {/* Options */}

          {fieldOptions.map(
            (option) => {
              const checked =
                fields[option.key];

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    toggleField(
                      option.key,
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    px-2
                    py-2
                    text-left
                    text-xs
                    text-zinc-700
                    transition
                    hover:bg-zinc-50
                    dark:text-zinc-300
                    dark:hover:bg-zinc-800
                  "
                  role="menuitem"
                >
                  <span>
                    {option.label}
                  </span>

                  {/* Checkbox */}

                  <span
                    className={`
                      flex
                      h-4
                      w-4
                      shrink-0
                      items-center
                      justify-center
                      rounded
                      border
                      transition
                      ${
                        checked
                          ? `
                            border-violet-600
                            bg-violet-600
                            text-white
                          `
                          : `
                            border-zinc-300
                            bg-white
                            dark:border-zinc-600
                            dark:bg-zinc-800
                          `
                      }
                    `}
                  >
                    {checked && (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}