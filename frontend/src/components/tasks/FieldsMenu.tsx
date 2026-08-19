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

/* =========================================================
   TYPES
========================================================= */

export interface TaskFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  comments: boolean;
}

interface FieldsMenuProps {
  fields: TaskFields;
  onChange: (
    fields: TaskFields,
  ) => void;
}

/* =========================================================
   FIELD OPTIONS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

export default function FieldsMenu({
  fields,
  onChange,
}: FieldsMenuProps) {
  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

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
        menuRef.current &&
        !menuRef.current.contains(
          target,
        )
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
     TOGGLE FIELD
  ======================================================= */

  const toggleField = (
    key: keyof TaskFields,
  ) => {
    onChange({
      ...fields,
      [key]: !fields[key],
    });
  };

  const visibleCount =
    Object.values(fields).filter(
      Boolean,
    ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* =================================================
          TRIGGER
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current,
          )
        }
        aria-haspopup="menu"
        aria-expanded={open}
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
            open
              ? `
                border-zinc-300
                bg-zinc-50
                text-zinc-900

                dark:border-zinc-600
                dark:bg-zinc-800
                dark:text-zinc-100
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
        <span>Fields</span>

        {visibleCount !==
          fieldOptions.length && (
          <>
            <span className="text-zinc-300 dark:text-zinc-600">
              :
            </span>

            <span className="text-violet-600 dark:text-violet-400">
              {visibleCount}
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
              open
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {open && (
        <div
  role="menu"
  className="
    absolute
    left-0
    top-[calc(100%+6px)]
    z-[200]

    w-[190px]
    max-w-[calc(100vw-24px)]

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

    sm:left-0
  "
>
          {/* =================================================
              HEADER
          ================================================= */}

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
            Visible fields
          </div>

          <div className="mb-1 border-t border-zinc-100 dark:border-zinc-800" />

          {/* =================================================
              OPTIONS
          ================================================= */}

          {fieldOptions.map(
            (option) => {
              const checked =
                fields[
                  option.key
                ];

              return (
                <button
                  key={
                    option.key
                  }
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={
                    checked
                  }
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
                    rounded
                    px-2.5
                    py-2
                    text-left
                    text-[11px]
                    text-zinc-600
                    transition

                    hover:bg-zinc-50
                    hover:text-zinc-900

                    dark:text-zinc-300
                    dark:hover:bg-zinc-800
                    dark:hover:text-zinc-100
                  "
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