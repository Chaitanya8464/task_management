"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { Task } from "./TaskCard";
import { TaskFields } from "./FieldsMenu";

interface TaskListProps {
  tasks: Task[];
  fields: TaskFields;

  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

/* =========================================================
   STATUS GROUPS
========================================================= */

const statusGroups: Task["status"][] = [
  "To Do",
  "Doing",
  "Completed",
  "On Hold",
];

/* =========================================================
   STATUS DOT
========================================================= */

function getStatusDot(
  status: Task["status"],
) {
  switch (status) {
    case "To Do":
      return "bg-zinc-400";

    case "Doing":
      return "bg-blue-500";

    case "Completed":
      return "bg-emerald-500";

    case "On Hold":
      return "bg-orange-500";

    default:
      return "bg-zinc-400";
  }
}

/* =========================================================
   PRIORITY
========================================================= */

function getPriorityStyle(
  priority: Task["priority"],
) {
  switch (priority) {
    case "Urgent":
      return {
        icon: "↑",
        className: "text-red-500",
      };

    case "High":
      return {
        icon: "▰",
        className: "text-red-500",
      };

    case "Medium":
      return {
        icon: "▰",
        className: "text-orange-500",
      };

    case "Low":
      return {
        icon: "▱",
        className: "text-zinc-400",
      };

    case "No Priority":
    default:
      return {
        icon: "·",
        className: "text-zinc-300",
      };
  }
}

/* =========================================================
   AVATAR COLORS
========================================================= */

function getAvatarStyle(
  name: string,
) {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-zinc-100 text-zinc-700",
  ];

  let hash = 0;

  for (
    let index = 0;
    index < name.length;
    index++
  ) {
    hash =
      name.charCodeAt(index) +
      ((hash << 5) - hash);
  }

  return colors[
    Math.abs(hash) %
      colors.length
  ];
}

/* =========================================================
   TASK ROW ACTIONS
========================================================= */

interface TaskRowActionsProps {
  task: Task;

  onEdit?: (task: Task) => void;

  onDelete?: (task: Task) => void;
}

function TaskRowActions({
  task,
  onEdit,
  onDelete,
}: TaskRowActionsProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [
    menuPosition,
    setMenuPosition,
  ] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef =
    useRef<HTMLButtonElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     POSITION MENU
  ======================================================= */

  const updateMenuPosition =
    () => {
      if (!buttonRef.current) {
        return;
      }

      const rect =
        buttonRef.current.getBoundingClientRect();

      const menuWidth = 140;
      const menuHeight = 90;
      const gap = 6;

      let left =
        rect.right -
        menuWidth;

      let top =
        rect.bottom + gap;

      if (left < 8) {
        left = 8;
      }

      if (
        left + menuWidth >
        window.innerWidth - 8
      ) {
        left =
          window.innerWidth -
          menuWidth -
          8;
      }

      if (
        top + menuHeight >
        window.innerHeight - 8
      ) {
        top =
          rect.top -
          menuHeight -
          gap;
      }

      setMenuPosition({
        top,
        left,
      });
    };

  /* =======================================================
     TOGGLE
  ======================================================= */

  const handleToggleMenu =
    () => {
      if (!isOpen) {
        updateMenuPosition();
      }

      setIsOpen(
        (current) => !current,
      );
    };

  /* =======================================================
     EVENTS
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        buttonRef.current?.contains(
          target,
        ) ||
        menuRef.current?.contains(
          target,
        )
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleViewportChange =
      () => {
        updateMenuPosition();
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    window.addEventListener(
      "resize",
      handleViewportChange,
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true,
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

      window.removeEventListener(
        "resize",
        handleViewportChange,
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
      );
    };
  }, [isOpen]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleEdit = () => {
    setIsOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete?.(task);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${task.title}`}
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          handleToggleMenu();
        }}
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-md
          text-zinc-400
          transition
          hover:bg-zinc-100
          hover:text-zinc-700
          dark:text-zinc-500
          dark:hover:bg-zinc-800
          dark:hover:text-zinc-200
          ${
            isOpen
              ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              : ""
          }
        `}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* =================================================
          FLOATING MENU
      ================================================= */}

      {isOpen && (
        <div
          ref={menuRef}
          className="
            fixed
            z-[9999]
            w-36
            overflow-hidden
            rounded-md
            border
            border-zinc-200
            bg-white
            p-1
            shadow-lg
            dark:border-zinc-700
            dark:bg-zinc-900
          "
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            onClick={handleEdit}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded
              px-2.5
              py-2
              text-left
              text-xs
              text-zinc-600
              transition
              hover:bg-zinc-50
              dark:text-zinc-300
              dark:hover:bg-zinc-800
            "
          >
            <Pencil className="h-3.5 w-3.5" />

            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded
              px-2.5
              py-2
              text-left
              text-xs
              text-red-500
              transition
              hover:bg-red-50
              dark:text-red-400
              dark:hover:bg-red-950/40
            "
          >
            <Trash2 className="h-3.5 w-3.5" />

            Delete
          </button>
        </div>
      )}
    </>
  );
}

/* =========================================================
   TASK LIST
========================================================= */

export default function TaskList({
  tasks,
  fields,
  onEdit,
  onDelete,
}: TaskListProps) {
  const router = useRouter();

  /* =======================================================
     ROW CLICK
  ======================================================= */

  const handleTaskRowClick = (
    event: React.MouseEvent<HTMLDivElement>,
    taskId: string,
  ) => {
    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        "button, select, a, input, textarea",
      )
    ) {
      return;
    }

    router.push(
      `/tasks/${taskId}`,
    );
  };

  /* =======================================================
     KEYBOARD NAVIGATION
  ======================================================= */

  const handleTaskRowKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    taskId: string,
  ) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        "button, select, a, input, textarea",
      )
    ) {
      return;
    }

    event.preventDefault();

    router.push(
      `/tasks/${taskId}`,
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-w-0">
      {statusGroups.map(
        (status) => {
          const statusTasks =
            tasks.filter(
              (task) =>
                task.status ===
                status,
            );

          return (
            <section
              key={status}
              className="mb-5"
            >
              {/* =================================================
                  STATUS HEADER
              ================================================= */}

              <div
                className="
                  mb-2
                  flex
                  h-6
                  items-center
                  gap-1.5
                  px-1
                "
              >
                <ChevronDown
                  className="
                    h-3
                    w-3
                    text-zinc-400
                  "
                />

                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${getStatusDot(
                      status,
                    )}
                  `}
                />

                <h2
                  className="
                    text-[11px]
                    font-medium
                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  {status}
                </h2>

                <span
                  className="
                    text-[10px]
                    text-zinc-400
                    dark:text-zinc-500
                  "
                >
                  {statusTasks.length}
                </span>
              </div>

              {/* =================================================
                  TABLE
              ================================================= */}

              <div
                className="
                  overflow-x-auto
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  dark:border-zinc-800
                  dark:bg-zinc-950
                "
              >
                <div className="min-w-[780px]">

                  {/* =================================================
                      TABLE HEADER
                  ================================================= */}

                  <div
                    className="
                      flex
                      h-10
                      items-center
                      border-b
                      border-zinc-200
                      bg-zinc-50
                      px-2.5
                      dark:border-zinc-800
                      dark:bg-zinc-900
                    "
                  >
                    {/* Task */}

                    <div
                      className="
                        min-w-[300px]
                        flex-1
                        px-2
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          font-medium
                          text-zinc-500
                          dark:text-zinc-400
                        "
                      >
                        Task
                      </span>
                    </div>

                    {/* Priority */}

                    {fields.priority && (
                      <div
                        className="
                          w-[105px]
                          shrink-0
                          px-2
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          Priority
                        </span>
                      </div>
                    )}

                    {/* Members */}

                    {fields.members && (
                      <div
                        className="
                          w-[130px]
                          shrink-0
                          px-2
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          Members
                        </span>
                      </div>
                    )}

                    {/* Due Date */}

                    {fields.dueDate && (
                      <div
                        className="
                          w-[135px]
                          shrink-0
                          px-2
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          Due Date
                        </span>
                      </div>
                    )}

                    {/* Comments */}

                    {fields.comments && (
                      <div
                        className="
                          w-[90px]
                          shrink-0
                          px-2
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          Comments
                        </span>
                      </div>
                    )}

                    {/* Actions */}

                    <div
                      className="
                        w-[42px]
                        shrink-0
                      "
                    />
                  </div>

                  {/* =================================================
                      TASK ROWS
                  ================================================= */}

                  {statusTasks.map(
                    (task) => {
                      const priority =
                        getPriorityStyle(
                          task.priority,
                        );

                      return (
                        <div
                          key={task.id}
                          onClick={(
                            event,
                          ) =>
                            handleTaskRowClick(
                              event,
                              task.id,
                            )
                          }
                          onKeyDown={(
                            event,
                          ) =>
                            handleTaskRowKeyDown(
                              event,
                              task.id,
                            )
                          }
                          role="link"
                          tabIndex={0}
                          aria-label={`Open task ${task.title}`}
                          className="
                            group
                            flex
                            min-h-[44px]
                            cursor-pointer
                            items-center
                            border-b
                            border-zinc-100
                            bg-white
                            px-2.5
                            transition
                            last:border-b-0
                            hover:bg-zinc-50
                            focus:outline-none
                            focus:ring-1
                            focus:ring-inset
                            focus:ring-zinc-300
                            dark:border-zinc-800
                            dark:bg-zinc-950
                            dark:hover:bg-zinc-900
                            dark:focus:ring-zinc-700
                          "
                        >
                          {/* =================================================
                              TASK
                          ================================================= */}

                          <div
                            className="
                              min-w-[300px]
                              flex-1
                              px-2
                            "
                          >
                            <p
                              className="
                                truncate
                                text-[11px]
                                font-medium
                                text-zinc-800
                                dark:text-zinc-100
                              "
                            >
                              {task.title}
                            </p>
                          </div>

                          {/* =================================================
                              PRIORITY
                          ================================================= */}

                          {fields.priority && (
                            <div
                              className="
                                flex
                                w-[105px]
                                shrink-0
                                items-center
                                gap-1.5
                                px-2
                              "
                            >
                              <span
                                className={`
                                  text-[10px]
                                  leading-none
                                  ${priority.className}
                                `}
                              >
                                {priority.icon}
                              </span>

                              <span
                                className="
                                  text-[10px]
                                  text-zinc-500
                                  dark:text-zinc-400
                                "
                              >
                                {
                                  task.priority
                                }
                              </span>
                            </div>
                          )}

                          {/* =================================================
                              MEMBER
                          ================================================= */}

                          {fields.members && (
                            <div
                              className="
                                flex
                                w-[130px]
                                shrink-0
                                items-center
                                gap-2
                                px-2
                              "
                            >
                              <div
                                className={`
                                  flex
                                  h-5
                                  w-5
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-[8px]
                                  font-medium
                                  ${getAvatarStyle(
                                    task.assignee,
                                  )}
                                `}
                              >
                                {task.assignee
                                  .trim()
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}
                              </div>

                              <span
                                className="
                                  truncate
                                  text-[10px]
                                  text-zinc-600
                                  dark:text-zinc-400
                                "
                              >
                                {
                                  task.assignee
                                }
                              </span>
                            </div>
                          )}

                          {/* =================================================
                              DUE DATE
                          ================================================= */}

                          {fields.dueDate && (
                            <div
                              className="
                                flex
                                w-[135px]
                                shrink-0
                                items-center
                                px-2
                              "
                            >
                              <span
                                className="
                                  whitespace-nowrap
                                  text-[10px]
                                  text-zinc-600
                                  dark:text-zinc-400
                                "
                              >
                                {
                                  task.dueDate
                                }
                              </span>
                            </div>
                          )}

                          {/* =================================================
                              COMMENTS
                          ================================================= */}

                          {fields.comments && (
                            <div
                              className="
                                flex
                                w-[90px]
                                shrink-0
                                items-center
                                px-2
                              "
                            >
                              <span
                                className="
                                  text-[10px]
                                  text-zinc-400
                                  dark:text-zinc-500
                                "
                              >
                                {
                                  task.comments
                                }
                              </span>
                            </div>
                          )}

                          {/* =================================================
                              ACTIONS
                          ================================================= */}

                          <div
                            className="
                              flex
                              w-[42px]
                              shrink-0
                              justify-end
                            "
                          >
                            <TaskRowActions
                              task={task}
                              onEdit={
                                onEdit
                              }
                              onDelete={
                                onDelete
                              }
                            />
                          </div>
                        </div>
                      );
                    },
                  )}

                  {/* =================================================
                      EMPTY GROUP
                  ================================================= */}

                  {statusTasks.length ===
                    0 && (
                    <div
                      className="
                        flex
                        h-10
                        items-center
                        px-4
                        text-[10px]
                        text-zinc-400
                        dark:text-zinc-500
                      "
                    >
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        },
      )}
    </div>
  );
}