"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Eye,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Settings,
  Share2,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import AppShell from "@/components/layout/AppShell";

import {
  ApiLabel,
  ApiSubtask,
  ApiTaskDetails,
  ApiUser,
  TaskPriority,
  WorkspaceMember,
  assignLabel,
  createComment,
  createLabel,
  createSubtask,
  deleteSubtask,
  getTaskDetails,
  getWorkspaceLabels,
  getWorkspaceMembers,
  removeLabel,
  updateSubtask,
  updateTask,
} from "@/lib/api";

/* =========================================================
   LABELS
========================================================= */

const statusLabels: Record<
  ApiTaskDetails["status"],
  string
> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

const priorityLabels: Record<
  TaskPriority,
  string
> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NO_PRIORITY: "No Priority",
};

const priorityColors: Record<
  TaskPriority,
  string
> = {
  URGENT: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-amber-500",
  LOW: "text-zinc-400",
  NO_PRIORITY: "text-zinc-400",
};

const priorityDotColors: Record<
  TaskPriority,
  string
> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-zinc-400",
  NO_PRIORITY: "bg-zinc-300",
};

/* =========================================================
   PAGE
========================================================= */

export default function TaskDetailsPage() {
  const params = useParams();

  const taskId = String(params.taskId);

  const [task, setTask] =
    useState<ApiTaskDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     SUBTASK
  ======================================================= */

  const [newSubtask, setNewSubtask] =
    useState("");

  const [
    newSubtaskPriority,
    setNewSubtaskPriority,
  ] = useState<TaskPriority>(
    "NO_PRIORITY",
  );

  const [
    newSubtaskDueDate,
    setNewSubtaskDueDate,
  ] = useState("");

  const [
    newSubtaskAssigneeId,
    setNewSubtaskAssigneeId,
  ] = useState("");

  const [
    isSubtaskInputOpen,
    setIsSubtaskInputOpen,
  ] = useState(false);

  const [
    isAddingSubtask,
    setIsAddingSubtask,
  ] = useState(false);

  const [subtaskError, setSubtaskError] =
    useState("");

  const [
    editingSubtaskId,
    setEditingSubtaskId,
  ] = useState<string | null>(null);

  const [
    openSubtaskMenu,
    setOpenSubtaskMenu,
  ] = useState<string | null>(null);

  const [
    editingSubtaskTitle,
    setEditingSubtaskTitle,
  ] = useState("");

  const [
    editingSubtaskPriority,
    setEditingSubtaskPriority,
  ] = useState<TaskPriority>(
    "NO_PRIORITY",
  );

  const [
    editingSubtaskDueDate,
    setEditingSubtaskDueDate,
  ] = useState("");

  const [
    editingSubtaskAssigneeId,
    setEditingSubtaskAssigneeId,
  ] = useState("");

  const [
    isUpdatingSubtask,
    setIsUpdatingSubtask,
  ] = useState(false);

  const subtaskMenuRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     COMMENTS
  ======================================================= */

  const [newComment, setNewComment] =
    useState("");

  const [
    isAddingComment,
    setIsAddingComment,
  ] = useState(false);

  const [commentError, setCommentError] =
    useState("");

  /* =======================================================
     LABELS
  ======================================================= */

  const [
    workspaceLabels,
    setWorkspaceLabels,
  ] = useState<ApiLabel[]>([]);

  const [newLabelName, setNewLabelName] =
    useState("");

  const [newLabelColor, setNewLabelColor] =
    useState("#7c3aed");

  const [
    selectedLabelId,
    setSelectedLabelId,
  ] = useState("");

  const [
    isAddingLabel,
    setIsAddingLabel,
  ] = useState(false);

  const [
    isAssigningLabel,
    setIsAssigningLabel,
  ] = useState(false);

  const [labelError, setLabelError] =
    useState("");

  /* =======================================================
     MEMBERS
  ======================================================= */

  const [
    workspaceMembers,
    setWorkspaceMembers,
  ] = useState<WorkspaceMember[]>([]);

  /* =======================================================
     DROPDOWNS
  ======================================================= */

  const [openMenu, setOpenMenu] =
    useState<
      | "status"
      | "priority"
      | "member"
      | null
    >(null);

  const [
    openLabelMenu,
    setOpenLabelMenu,
  ] = useState(false);

  const [
    openNewSubtaskPriority,
    setOpenNewSubtaskPriority,
  ] = useState(false);

  const [
    openNewSubtaskMember,
    setOpenNewSubtaskMember,
  ] = useState(false);

  const [
    openEditSubtaskPriority,
    setOpenEditSubtaskPriority,
  ] = useState(false);

  const [
    openEditSubtaskMember,
    setOpenEditSubtaskMember,
  ] = useState(false);

  /* =======================================================
     LOAD TASK
  ======================================================= */

  useEffect(() => {
    async function loadTask() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTaskDetails(taskId);

        setTask(data);

        try {
          const labels =
            await getWorkspaceLabels(
              data.workspaceId,
            );

          setWorkspaceLabels(labels);
        } catch (err) {
          console.error(
            "Failed to load labels:",
            err,
          );
        }

        try {
          const members =
            await getWorkspaceMembers(
              data.workspaceId,
            );

          setWorkspaceMembers(members);
        } catch (err) {
          console.error(
            "Failed to load members:",
            err,
          );
        }
      } catch (err) {
        console.error(
          "Failed to load task:",
          err,
        );

        setError(
          "Unable to load task details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  /* =======================================================
     GLOBAL OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        subtaskMenuRef.current &&
        subtaskMenuRef.current.contains(
          target,
        )
      ) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest(
          "[data-dropdown-root]",
        )
      ) {
        return;
      }

      setOpenMenu(null);
      setOpenLabelMenu(false);
      setOpenNewSubtaskPriority(false);
      setOpenNewSubtaskMember(false);
      setOpenEditSubtaskPriority(false);
      setOpenEditSubtaskMember(false);

      if (
        subtaskMenuRef.current &&
        !subtaskMenuRef.current.contains(
          target,
        )
      ) {
        setOpenSubtaskMenu(null);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setOpenMenu(null);
      setOpenLabelMenu(false);
      setOpenNewSubtaskPriority(false);
      setOpenNewSubtaskMember(false);
      setOpenEditSubtaskPriority(false);
      setOpenEditSubtaskMember(false);
      setOpenSubtaskMenu(null);
    };

    document.addEventListener(
      "click",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /* =======================================================
     UPDATE TASK
  ======================================================= */

  const handleUpdateTask = async (
    changes: Parameters<
      typeof updateTask
    >[1],
  ) => {
    if (!task) {
      return;
    }

    try {
      const updated =
        await updateTask(
          task.id,
          changes,
        );

      setTask(updated);
    } catch (err) {
      console.error(
        "Failed to update task:",
        err,
      );
    }

    setOpenMenu(null);
  };

  /* =======================================================
     ADD SUBTASK
  ======================================================= */

  const handleAddSubtask = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const title =
      newSubtask.trim();

    if (!title || !task) {
      return;
    }

    try {
      setIsAddingSubtask(true);
      setSubtaskError("");

      console.log(
        "CREATING SUBTASK:",
        {
          title,
          priority:
            newSubtaskPriority,
          dueDate:
            newSubtaskDueDate ||
            undefined,
          assigneeId:
            newSubtaskAssigneeId ||
            undefined,
        },
      );

      await createSubtask(
        task.id,
        {
          title,
          priority:
            newSubtaskPriority,
          dueDate:
            newSubtaskDueDate ||
            undefined,
          assigneeId:
            newSubtaskAssigneeId ||
            undefined,
        },
      );

      /*
       * Always reload from backend.
       * This guarantees that priority,
       * assignee and assignee relation
       * are synchronized.
       */
      const refreshedTask =
        await getTaskDetails(
          task.id,
        );

      setTask(refreshedTask);

      setNewSubtask("");

      setNewSubtaskPriority(
        "NO_PRIORITY",
      );

      setNewSubtaskDueDate("");

      setNewSubtaskAssigneeId("");

      setOpenNewSubtaskPriority(
        false,
      );

      setOpenNewSubtaskMember(false);

      setIsSubtaskInputOpen(true);
    } catch (err) {
      console.error(
        "Failed to create subtask:",
        err,
      );

      setSubtaskError(
        "Unable to create subtask.",
      );
    } finally {
      setIsAddingSubtask(false);
    }
  };

  /* =======================================================
     TOGGLE SUBTASK
  ======================================================= */

  const handleToggleSubtask = async (
    subtaskId: string,
    completed: boolean,
  ) => {
    if (!task) {
      return;
    }

    const previousTask = task;

    setTask((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subtasks:
          current.subtasks.map(
            (subtask) =>
              subtask.id ===
              subtaskId
                ? {
                    ...subtask,
                    completed,
                  }
                : subtask,
          ),
      };
    });

    try {
      await updateSubtask(
        task.id,
        subtaskId,
        {
          completed,
        },
      );

      /*
       * Reload complete task.
       */
      const refreshedTask =
        await getTaskDetails(
          task.id,
        );

      setTask(refreshedTask);
    } catch (err) {
      console.error(
        "Failed to update subtask:",
        err,
      );

      setTask(previousTask);

      setSubtaskError(
        "Unable to update subtask.",
      );
    }
  };

  /* =======================================================
     START EDIT SUBTASK
  ======================================================= */

  const handleStartEditSubtask = (
    subtask: ApiSubtask,
  ) => {
    console.log(
      "START EDIT SUBTASK:",
      subtask,
    );

    setEditingSubtaskId(
      subtask.id,
    );

    setEditingSubtaskTitle(
      subtask.title,
    );

    setEditingSubtaskPriority(
      subtask.priority ||
        "NO_PRIORITY",
    );

    setEditingSubtaskDueDate(
      subtask.dueDate
        ? formatDateForInput(
            subtask.dueDate,
          )
        : "",
    );

    setEditingSubtaskAssigneeId(
      subtask.assigneeId || "",
    );

    setOpenSubtaskMenu(null);

    setOpenEditSubtaskPriority(
      false,
    );

    setOpenEditSubtaskMember(
      false,
    );

    setSubtaskError("");
  };

  /* =======================================================
     CANCEL EDIT SUBTASK
  ======================================================= */

  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);

    setEditingSubtaskTitle("");

    setEditingSubtaskPriority(
      "NO_PRIORITY",
    );

    setEditingSubtaskDueDate("");

    setEditingSubtaskAssigneeId("");

    setOpenEditSubtaskPriority(
      false,
    );

    setOpenEditSubtaskMember(false);
  };

  /* =======================================================
     SAVE SUBTASK
  ======================================================= */

  const handleSaveSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) {
      return;
    }

    const title =
      editingSubtaskTitle.trim();

    if (!title) {
      setSubtaskError(
        "Subtask title cannot be empty.",
      );

      return;
    }

    const payload = {
      title,
      priority:
        editingSubtaskPriority,
      dueDate:
        editingSubtaskDueDate ||
        undefined,
      assigneeId:
        editingSubtaskAssigneeId ||
        null,
    };

    console.log(
      "SAVING SUBTASK:",
      payload,
    );

    try {
      setIsUpdatingSubtask(true);
      setSubtaskError("");

      const updated =
        await updateSubtask(
          task.id,
          subtaskId,
          payload,
        );

      console.log(
        "UPDATED SUBTASK:",
        updated,
      );

      /*
       * IMPORTANT:
       * Fetch the complete task after
       * PATCH.
       *
       * This guarantees that:
       *
       * priority
       * assigneeId
       * assignee
       * dueDate
       * completed
       *
       * all match the database.
       */
      const refreshedTask =
        await getTaskDetails(
          task.id,
        );

      setTask(refreshedTask);

      handleCancelEditSubtask();
    } catch (err) {
      console.error(
        "Failed to update subtask:",
        err,
      );

      setSubtaskError(
        "Unable to update subtask.",
      );
    } finally {
      setIsUpdatingSubtask(false);
    }
  };

  /* =======================================================
     DELETE SUBTASK
  ======================================================= */

  const handleDeleteSubtask = async (
    subtaskId: string,
  ) => {
    if (!task) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this subtask?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSubtask(
        task.id,
        subtaskId,
      );

      const refreshedTask =
        await getTaskDetails(
          task.id,
        );

      setTask(refreshedTask);

      setOpenSubtaskMenu(null);
    } catch (err) {
      console.error(
        "Failed to delete subtask:",
        err,
      );

      setSubtaskError(
        "Unable to delete subtask.",
      );
    }
  };

  /* =======================================================
     CREATE LABEL
  ======================================================= */

  const handleCreateLabel = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (
      !task ||
      !newLabelName.trim() ||
      isAddingLabel
    ) {
      return;
    }

    try {
      setIsAddingLabel(true);
      setLabelError("");

      /*
       * 1. Create label
       */
      const created =
        await createLabel(
          task.workspaceId,
          {
            name:
              newLabelName.trim(),
            color: newLabelColor,
          },
        );

      console.log(
        "CREATED LABEL:",
        created,
      );

      /*
       * 2. Add label to workspace list
       */
      setWorkspaceLabels(
        (current) =>
          [...current, created].sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          ),
      );

      /*
       * 3. IMPORTANT:
       * Actually assign the newly
       * created label to this task.
       */
      const updatedTask =
        await assignLabel(
          task.id,
          created.id,
        );

      console.log(
        "TASK AFTER LABEL ASSIGNMENT:",
        updatedTask,
      );

      /*
       * 4. The returned task contains
       * the updated labels.
       */
      setTask(updatedTask);

      setNewLabelName("");

      setSelectedLabelId("");

      setOpenLabelMenu(false);
    } catch (err) {
      console.error(
        "Failed to create and assign label:",
        err,
      );

      setLabelError(
        "Unable to create and assign label.",
      );
    } finally {
      setIsAddingLabel(false);
    }
  };

  /* =======================================================
     ASSIGN EXISTING LABEL
  ======================================================= */

  const handleAssignLabel = async (
    labelId?: string,
  ) => {
    const id =
      labelId || selectedLabelId;

    if (
      !task ||
      !id ||
      isAssigningLabel
    ) {
      return;
    }

    if (
      task.labels.some(
        (label) =>
          label.id === id,
      )
    ) {
      setSelectedLabelId("");

      setOpenLabelMenu(false);

      return;
    }

    try {
      setIsAssigningLabel(true);
      setLabelError("");

      const updated =
        await assignLabel(
          task.id,
          id,
        );

      setTask(updated);

      setSelectedLabelId("");

      setOpenLabelMenu(false);
    } catch (err) {
      console.error(
        "Failed to assign label:",
        err,
      );

      setLabelError(
        "Unable to assign label.",
      );
    } finally {
      setIsAssigningLabel(false);
    }
  };

  /* =======================================================
     REMOVE LABEL
  ======================================================= */

  const handleRemoveLabel = async (
    labelId: string,
  ) => {
    if (
      !task ||
      isAssigningLabel
    ) {
      return;
    }

    try {
      setIsAssigningLabel(true);

      const updated =
        await removeLabel(
          task.id,
          labelId,
        );

      setTask(updated);
    } catch (err) {
      console.error(
        "Failed to remove label:",
        err,
      );
    } finally {
      setIsAssigningLabel(false);
    }
  };

  /* =======================================================
     ADD COMMENT
  ======================================================= */

  const handleAddComment = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const content =
      newComment.trim();

    if (!content || !task) {
      return;
    }

    try {
      setIsAddingComment(true);
      setCommentError("");

      const storedUser =
        localStorage.getItem(
          "taskflow_user",
        );

      if (!storedUser) {
        throw new Error(
          "User session not found.",
        );
      }

      const user =
        JSON.parse(storedUser);

      if (!user?.id) {
        throw new Error(
          "User ID not found.",
        );
      }

      await createComment(
        task.id,
        {
          content,
          userId: user.id,
        },
      );

      const refreshedTask =
        await getTaskDetails(
          task.id,
        );

      setTask(refreshedTask);

      setNewComment("");
    } catch (err) {
      console.error(
        "Failed to create comment:",
        err,
      );

      setCommentError(
        "Unable to add comment.",
      );
    } finally {
      setIsAddingComment(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-zinc-950">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />

            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              Loading task...
            </p>
          </div>
        </main>
      </AppShell>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !task) {
    return (
      <AppShell>
        <main className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-zinc-950">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {error ||
                "Task not found."}
            </p>

            <Link
              href="/tasks"
              className="mt-3 inline-flex text-xs text-violet-600 hover:underline"
            >
              Back to Tasks
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const completedSubtasks =
    task.subtasks.filter(
      (subtask) =>
        subtask.completed,
    ).length;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AppShell>
      <main className="min-h-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

        {/* TOP BAR */}

        <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800 sm:px-5">
          <Link
            href="/tasks"
            aria-label="Back to tasks"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8">

          {/* HEADER */}

          <section className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {task.title}
            </h1>

            <p className="mt-1.5 max-w-[720px] text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {task.description ||
                "Create and manage detailed task information."}
            </p>
          </section>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_275px]">

            {/* LEFT */}

            <section className="min-w-0 pt-4">

              {/* PROPERTIES */}

              <section className="mb-5">
                <SectionHeading>
                  Properties
                </SectionHeading>

                <div className="flex flex-wrap items-center gap-2">

                  {/* MEMBER */}

                  <CustomDropdown
                    open={
                      openMenu ===
                      "member"
                    }
                    onToggle={() => {
                      setOpenMenu(
                        openMenu ===
                          "member"
                          ? null
                          : "member",
                      );
                    }}
                    width="w-56"
                    trigger={
                      <button
                        type="button"
                        className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <User className="h-3.5 w-3.5 text-zinc-400" />

                        <span className="max-w-[130px] truncate">
                          {task.assignee
                            ?.name ||
                            "Unassigned"}
                        </span>

                        <ChevronDown className="ml-auto h-3 w-3 text-zinc-400" />
                      </button>
                    }
                  >
                    <DropdownTitle>
                      Members
                    </DropdownTitle>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateTask(
                          {
                            assigneeId:
                              undefined,
                          },
                        )
                      }
                      className="dropdown-item"
                    >
                      Unassigned
                    </button>

                    {workspaceMembers.map(
                      (member) => (
                        <button
                          key={
                            member.userId
                          }
                          type="button"
                          onClick={() =>
                            handleUpdateTask(
                              {
                                assigneeId:
                                  member.userId,
                              },
                            )
                          }
                          className="dropdown-item"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Avatar
                              user={
                                member.user
                              }
                              small
                            />

                            {
                              member
                                .user
                                .name
                            }
                          </span>

                          {task.assignee
                            ?.id ===
                            member.userId && (
                            <Check className="h-3.5 w-3.5 text-violet-600" />
                          )}
                        </button>
                      ),
                    )}
                  </CustomDropdown>

                  {/* DATE */}

                  <div className="inline-flex h-8 items-center gap-2 rounded-md bg-red-50 px-2.5 text-xs text-red-500 dark:bg-red-950/30 dark:text-red-400">
                    <CalendarDays className="h-3.5 w-3.5" />

                    {task.dueDate
                      ? new Date(
                          task.dueDate,
                        ).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "No date"}
                  </div>

                  {/* PRIORITY */}

                  <CustomDropdown
                    open={
                      openMenu ===
                      "priority"
                    }
                    onToggle={() =>
                      setOpenMenu(
                        openMenu ===
                          "priority"
                          ? null
                          : "priority",
                      )
                    }
                    width="w-48"
                    trigger={
                      <button
                        type="button"
                        className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        <PriorityIcon
                          priority={
                            task.priority
                          }
                        />

                        <span
                          className={
                            priorityColors[
                              task.priority
                            ]
                          }
                        >
                          {
                            priorityLabels[
                              task.priority
                            ]
                          }
                        </span>

                        <ChevronDown className="h-3 w-3" />
                      </button>
                    }
                  >
                    <DropdownTitle>
                      Priority
                    </DropdownTitle>

                    {(
                      Object.keys(
                        priorityLabels,
                      ) as TaskPriority[]
                    ).map(
                      (priority) => (
                        <button
                          key={
                            priority
                          }
                          type="button"
                          onClick={() =>
                            handleUpdateTask(
                              {
                                priority,
                              },
                            )
                          }
                          className="dropdown-item"
                        >
                          <span className="flex items-center gap-2">
                            <PriorityIcon
                              priority={
                                priority
                              }
                            />

                            <span
                              className={
                                priorityColors[
                                  priority
                                ]
                              }
                            >
                              {
                                priorityLabels[
                                  priority
                                ]
                              }
                            </span>
                          </span>

                          {task.priority ===
                            priority && (
                            <Check className="h-3.5 w-3.5 text-violet-600" />
                          )}
                        </button>
                      ),
                    )}
                  </CustomDropdown>
                </div>
              </section>

              {/* LABELS */}

              <section className="mb-5">
                <SectionHeading>
                  Labels
                </SectionHeading>

                <div className="flex flex-wrap items-center gap-1.5">

                  {task.labels.map(
                    (label) => (
                      <span
                        key={
                          label.id
                        }
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium"
                        style={{
                          borderColor:
                            `${label.color}55`,
                          color:
                            label.color,
                          backgroundColor:
                            `${label.color}10`,
                        }}
                      >
                        <Tag className="h-3 w-3" />

                        {label.name}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveLabel(
                              label.id,
                            )
                          }
                          className="ml-0.5 opacity-50 transition hover:opacity-100"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ),
                  )}

                  <CustomDropdown
                    open={
                      openLabelMenu
                    }
                    onToggle={() =>
                      setOpenLabelMenu(
                        (current) =>
                          !current,
                      )
                    }
                    width="w-52"
                    trigger={
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-2 text-[10px] text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                      >
                        <Plus className="h-3 w-3" />
                        Add label
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    }
                  >
                    <DropdownTitle>
                      Select label
                    </DropdownTitle>

                    {workspaceLabels.filter(
                      (label) =>
                        !task.labels.some(
                          (assigned) =>
                            assigned.id ===
                            label.id,
                        ),
                    ).map(
                      (label) => (
                        <button
                          key={
                            label.id
                          }
                          type="button"
                          onClick={() =>
                            handleAssignLabel(
                              label.id,
                            )
                          }
                          className="dropdown-item"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  label.color,
                              }}
                            />

                            {
                              label.name
                            }
                          </span>
                        </button>
                      ),
                    )}
                  </CustomDropdown>
                </div>

                {/* CREATE LABEL */}

                <form
                  onSubmit={
                    handleCreateLabel
                  }
                  className="mt-2 flex max-w-sm gap-2"
                >
                  <input
                    value={
                      newLabelName
                    }
                    onChange={(event) =>
                      setNewLabelName(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Create label..."
                    className="h-8 min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-800 outline-none focus:border-violet-400 dark:border-zinc-700 dark:text-zinc-100"
                  />

                  <input
                    type="color"
                    value={
                      newLabelColor
                    }
                    onChange={(event) =>
                      setNewLabelColor(
                        event.target
                          .value,
                      )
                    }
                    className="h-8 w-9 cursor-pointer rounded-md border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900"
                  />

                  <button
                    type="submit"
                    disabled={
                      !newLabelName.trim() ||
                      isAddingLabel
                    }
                    className="h-8 rounded-md border border-zinc-200 px-3 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {isAddingLabel
                      ? "..."
                      : "Create"}
                  </button>
                </form>

                {labelError && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {labelError}
                  </p>
                )}
              </section>

              {/* RESOURCES */}

              <section className="mb-6">
                <SectionHeading>
                  Resources
                </SectionHeading>

                <button
                  type="button"
                  className="flex items-center gap-2 text-[11px] text-zinc-400"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Add document or link...
                </button>
              </section>

              {/* SUBTASKS */}

              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />

                    <h2 className="text-sm font-semibold">
                      Subtasks
                    </h2>

                    <span className="text-[10px] text-zinc-400">
                      {
                        completedSubtasks
                      }
                      /
                      {
                        task.subtasks
                          .length
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsSubtaskInputOpen(
                        (current) =>
                          !current,
                      )
                    }
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Plus className="h-3 w-3" />
                    Add Subtask
                  </button>
                </div>

                {/* ADD SUBTASK FORM */}

                {isSubtaskInputOpen && (
                  <form
                    onSubmit={
                      handleAddSubtask
                    }
                    className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <input
                      autoFocus
                      value={
                        newSubtask
                      }
                      onChange={(event) =>
                        setNewSubtask(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter subtask..."
                      className="mb-3 h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950"
                    />

                    <div className="flex flex-wrap items-center gap-2">

                      {/* CREATE PRIORITY */}

                      <CustomDropdown
                        open={
                          openNewSubtaskPriority
                        }
                        onToggle={() => {
                          setOpenNewSubtaskPriority(
                            (current) =>
                              !current,
                          );

                          setOpenNewSubtaskMember(
                            false,
                          );
                        }}
                        width="w-44"
                        trigger={
                          <button
                            type="button"
                            className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                          >
                            <PriorityIcon
                              priority={
                                newSubtaskPriority
                              }
                            />

                            {
                              priorityLabels[
                                newSubtaskPriority
                              ]
                            }

                            <ChevronDown className="ml-auto h-3 w-3 text-zinc-400" />
                          </button>
                        }
                      >
                        {(
                          Object.keys(
                            priorityLabels,
                          ) as TaskPriority[]
                        ).map(
                          (priority) => (
                            <button
                              key={
                                priority
                              }
                              type="button"
                              onMouseDown={(
                                event,
                              ) => {
                                event.preventDefault();

                                setNewSubtaskPriority(
                                  priority,
                                );

                                setOpenNewSubtaskPriority(
                                  false,
                                );
                              }}
                              className="dropdown-item"
                            >
                              <span className="flex items-center gap-2">
                                <PriorityIcon
                                  priority={
                                    priority
                                  }
                                />

                                {
                                  priorityLabels[
                                    priority
                                  ]
                                }
                              </span>

                              {newSubtaskPriority ===
                                priority && (
                                <Check className="h-3.5 w-3.5 text-violet-600" />
                              )}
                            </button>
                          ),
                        )}
                      </CustomDropdown>

                      {/* CREATE ASSIGNEE */}

                      <CustomDropdown
                        open={
                          openNewSubtaskMember
                        }
                        onToggle={() => {
                          setOpenNewSubtaskMember(
                            (current) =>
                              !current,
                          );

                          setOpenNewSubtaskPriority(
                            false,
                          );
                        }}
                        width="w-48"
                        trigger={
                          <button
                            type="button"
                            className="flex h-8 max-w-[180px] items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                          >
                            <User className="h-3.5 w-3.5 shrink-0 text-zinc-400" />

                            <span className="truncate">
                              {workspaceMembers.find(
                                (member) =>
                                  member.userId ===
                                  newSubtaskAssigneeId,
                              )?.user
                                .name ||
                                "Unassigned"}
                            </span>

                            <ChevronDown className="ml-auto h-3 w-3 shrink-0 text-zinc-400" />
                          </button>
                        }
                      >
                        <button
                          type="button"
                          onMouseDown={(
                            event,
                          ) => {
                            event.preventDefault();

                            setNewSubtaskAssigneeId(
                              "",
                            );

                            setOpenNewSubtaskMember(
                              false,
                            );
                          }}
                          className="dropdown-item"
                        >
                          Unassigned

                          {!newSubtaskAssigneeId && (
                            <Check className="h-3.5 w-3.5 text-violet-600" />
                          )}
                        </button>

                        {workspaceMembers.map(
                          (member) => (
                            <button
                              key={
                                member.userId
                              }
                              type="button"
                              onMouseDown={(
                                event,
                              ) => {
                                event.preventDefault();

                                setNewSubtaskAssigneeId(
                                  member.userId,
                                );

                                setOpenNewSubtaskMember(
                                  false,
                                );
                              }}
                              className="dropdown-item"
                            >
                              <span className="flex items-center gap-2">
                                <Avatar
                                  user={
                                    member.user
                                  }
                                  small
                                />

                                {
                                  member
                                    .user
                                    .name
                                }
                              </span>

                              {newSubtaskAssigneeId ===
                                member.userId && (
                                <Check className="h-3.5 w-3.5 text-violet-600" />
                              )}
                            </button>
                          ),
                        )}
                      </CustomDropdown>

                      {/* DATE */}

                      <input
                        type="date"
                        value={
                          newSubtaskDueDate
                        }
                        onChange={(event) =>
                          setNewSubtaskDueDate(
                            event.target
                              .value,
                          )
                        }
                        className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                      />

                      <div className="ml-auto flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setIsSubtaskInputOpen(
                              false,
                            )
                          }
                          className="h-8 rounded-md px-3 text-[11px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={
                            !newSubtask.trim() ||
                            isAddingSubtask
                          }
                          className="h-8 rounded-md bg-zinc-900 px-3 text-[11px] font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
                        >
                          {isAddingSubtask
                            ? "Adding..."
                            : "Add"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* SUBTASK TABLE */}

                <div className="overflow-visible rounded-lg border border-zinc-200 dark:border-zinc-800">

                  <div className="grid min-w-[650px] grid-cols-[minmax(0,1fr)_100px_125px_110px_40px] border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                    <span>Task</span>
                    <span>Priority</span>
                    <span>Members</span>
                    <span>Due Date</span>
                    <span />
                  </div>

                  {task.subtasks.length ===
                  0 ? (
                    <div className="px-4 py-7 text-center text-xs text-zinc-400">
                      No subtasks yet.
                    </div>
                  ) : (
                    task.subtasks.map(
                      (subtask) => {
                        const isEditing =
                          editingSubtaskId ===
                          subtask.id;

                        return (
                          <div
                            key={
                              subtask.id
                            }
                            className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                          >
                            {isEditing ? (
                              /* ============================
                                 EDIT SUBTASK
                              ============================ */

                              <div className="space-y-3 bg-zinc-50 p-3 dark:bg-zinc-900">

                                <input
                                  value={
                                    editingSubtaskTitle
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    setEditingSubtaskTitle(
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950"
                                />

                                <div className="flex flex-wrap gap-2">

                                  {/* EDIT PRIORITY */}

                                  <CustomDropdown
                                    open={
                                      openEditSubtaskPriority
                                    }
                                    onToggle={() => {
                                      setOpenEditSubtaskPriority(
                                        (
                                          current,
                                        ) =>
                                          !current,
                                      );

                                      setOpenEditSubtaskMember(
                                        false,
                                      );
                                    }}
                                    width="w-44"
                                    trigger={
                                      <button
                                        type="button"
                                        className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                      >
                                        <PriorityIcon
                                          priority={
                                            editingSubtaskPriority
                                          }
                                        />

                                        <span
                                          className={
                                            priorityColors[
                                              editingSubtaskPriority
                                            ]
                                          }
                                        >
                                          {
                                            priorityLabels[
                                              editingSubtaskPriority
                                            ]
                                          }
                                        </span>

                                        <ChevronDown className="ml-auto h-3 w-3 text-zinc-400" />
                                      </button>
                                    }
                                  >
                                    <DropdownTitle>
                                      Priority
                                    </DropdownTitle>

                                    {(
                                      Object.keys(
                                        priorityLabels,
                                      ) as TaskPriority[]
                                    ).map(
                                      (
                                        priority,
                                      ) => (
                                        <button
                                          key={
                                            priority
                                          }
                                          type="button"
                                          onMouseDown={(
                                            event,
                                          ) => {
                                            event.preventDefault();

                                            setEditingSubtaskPriority(
                                              priority,
                                            );

                                            setOpenEditSubtaskPriority(
                                              false,
                                            );
                                          }}
                                          className="dropdown-item"
                                        >
                                          <span className="flex items-center gap-2">
                                            <PriorityIcon
                                              priority={
                                                priority
                                              }
                                            />

                                            <span
                                              className={
                                                priorityColors[
                                                  priority
                                                ]
                                              }
                                            >
                                              {
                                                priorityLabels[
                                                  priority
                                                ]
                                              }
                                            </span>
                                          </span>

                                          {editingSubtaskPriority ===
                                            priority && (
                                            <Check className="h-3.5 w-3.5 text-violet-600" />
                                          )}
                                        </button>
                                      ),
                                    )}
                                  </CustomDropdown>

                                  {/* EDIT MEMBER */}

                                  <CustomDropdown
                                    open={
                                      openEditSubtaskMember
                                    }
                                    onToggle={() => {
                                      setOpenEditSubtaskMember(
                                        (
                                          current,
                                        ) =>
                                          !current,
                                      );

                                      setOpenEditSubtaskPriority(
                                        false,
                                      );
                                    }}
                                    width="w-48"
                                    trigger={
                                      <button
                                        type="button"
                                        className="flex h-8 max-w-[180px] items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                      >
                                        <User className="h-3.5 w-3.5 text-zinc-400" />

                                        <span className="truncate">
                                          {workspaceMembers.find(
                                            (
                                              member,
                                            ) =>
                                              member.userId ===
                                              editingSubtaskAssigneeId,
                                          )?.user
                                            .name ||
                                            "Unassigned"}
                                        </span>

                                        <ChevronDown className="ml-auto h-3 w-3 text-zinc-400" />
                                      </button>
                                    }
                                  >
                                    <button
                                      type="button"
                                      onMouseDown={(
                                        event,
                                      ) => {
                                        event.preventDefault();

                                        setEditingSubtaskAssigneeId(
                                          "",
                                        );

                                        setOpenEditSubtaskMember(
                                          false,
                                        );
                                      }}
                                      className="dropdown-item"
                                    >
                                      Unassigned

                                      {!editingSubtaskAssigneeId && (
                                        <Check className="h-3.5 w-3.5 text-violet-600" />
                                      )}
                                    </button>

                                    {workspaceMembers.map(
                                      (
                                        member,
                                      ) => (
                                        <button
                                          key={
                                            member.userId
                                          }
                                          type="button"
                                          onMouseDown={(
                                            event,
                                          ) => {
                                            event.preventDefault();

                                            setEditingSubtaskAssigneeId(
                                              member.userId,
                                            );

                                            setOpenEditSubtaskMember(
                                              false,
                                            );
                                          }}
                                          className="dropdown-item"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Avatar
                                              user={
                                                member.user
                                              }
                                              small
                                            />

                                            {
                                              member
                                                .user
                                                .name
                                            }
                                          </span>

                                          {editingSubtaskAssigneeId ===
                                            member.userId && (
                                            <Check className="h-3.5 w-3.5 text-violet-600" />
                                          )}
                                        </button>
                                      ),
                                    )}
                                  </CustomDropdown>

                                  {/* DATE */}

                                  <input
                                    type="date"
                                    value={
                                      editingSubtaskDueDate
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      setEditingSubtaskDueDate(
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[11px] dark:border-zinc-700 dark:bg-zinc-950"
                                  />

                                  <div className="ml-auto flex gap-2">
                                    <button
                                      type="button"
                                      onClick={
                                        handleCancelEditSubtask
                                      }
                                      className="rounded-md px-3 py-1.5 text-[10px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        isUpdatingSubtask
                                      }
                                      onClick={() =>
                                        handleSaveSubtask(
                                          subtask.id,
                                        )
                                      }
                                      className="rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] text-white disabled:opacity-40 dark:bg-white dark:text-black"
                                    >
                                      {isUpdatingSubtask
                                        ? "Saving..."
                                        : "Save"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* ============================
                                 NORMAL SUBTASK
                              ============================ */

                              <div className="grid min-w-[650px] grid-cols-[minmax(0,1fr)_100px_125px_110px_40px] items-center px-3 py-2.5 text-xs">

                                {/* TASK */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleSubtask(
                                      subtask.id,
                                      !subtask.completed,
                                    )
                                  }
                                  className="flex min-w-0 items-center gap-2 text-left"
                                >
                                  {subtask.completed ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                  ) : (
                                    <Circle className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                                  )}

                                  <span
                                    className={
                                      subtask.completed
                                        ? "truncate text-zinc-400 line-through"
                                        : "truncate text-zinc-800 dark:text-zinc-200"
                                    }
                                  >
                                    {
                                      subtask.title
                                    }
                                  </span>
                                </button>

                                {/* PRIORITY */}

                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      priorityDotColors[
                                        subtask.priority ||
                                          "NO_PRIORITY"
                                      ]
                                    }`}
                                  />

                                  <span
                                    className={`text-[10px] ${
                                      priorityColors[
                                        subtask.priority ||
                                          "NO_PRIORITY"
                                      ]
                                    }`}
                                  >
                                    {
                                      priorityLabels[
                                        subtask.priority ||
                                          "NO_PRIORITY"
                                      ]
                                    }
                                  </span>
                                </div>

                                {/* MEMBER */}

                                <div className="flex min-w-0 items-center gap-1.5">
                                  <Avatar
                                    user={
                                      subtask.assignee
                                    }
                                    small
                                  />

                                  <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                                    {subtask
                                      .assignee
                                      ?.name ||
                                      "Unassigned"}
                                  </span>
                                </div>

                                {/* DATE */}

                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                                  <CalendarDays className="h-3 w-3 text-zinc-400" />

                                  {subtask.dueDate
                                    ? new Date(
                                        subtask.dueDate,
                                      ).toLocaleDateString(
                                        undefined,
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )
                                    : "No date"}
                                </div>

                                {/* ACTIONS */}

                                <div
                                  className="relative flex justify-end"
                                  ref={
                                    openSubtaskMenu ===
                                    subtask.id
                                      ? subtaskMenuRef
                                      : null
                                  }
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenSubtaskMenu(
                                        openSubtaskMenu ===
                                          subtask.id
                                          ? null
                                          : subtask.id,
                                      )
                                    }
                                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </button>

                                  {openSubtaskMenu ===
                                    subtask.id && (
                                    <div className="absolute right-0 top-7 z-[100] w-36 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStartEditSubtask(
                                            subtask,
                                          )
                                        }
                                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                      >
                                        <Settings className="h-3.5 w-3.5 text-zinc-400" />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteSubtask(
                                            subtask.id,
                                          )
                                        }
                                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      },
                    )
                  )}
                </div>

                {subtaskError && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {subtaskError}
                  </p>
                )}
              </section>

              {/* COMMENTS */}

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />

                  <h2 className="text-sm font-semibold">
                    Updates
                  </h2>

                  <span className="text-[10px] text-zinc-400">
                    {
                      task.comments
                        .length
                    }
                  </span>
                </div>

                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">

                  {task.comments.length ===
                  0 ? (
                    <div className="px-5 py-7 text-center">
                      <MessageCircle className="mx-auto h-5 w-5 text-zinc-300 dark:text-zinc-700" />

                      <p className="mt-2 text-xs text-zinc-400">
                        No updates yet.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {task.comments.map(
                        (comment) => (
                          <div
                            key={
                              comment.id
                            }
                            className="flex gap-3 p-4"
                          >
                            <Avatar
                              user={
                                comment.user
                              }
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium">
                                  {comment
                                    .user
                                    ?.name ||
                                    "User"}
                                </span>

                                <span className="text-[10px] text-zinc-400">
                                  {new Date(
                                    comment.createdAt,
                                  ).toLocaleString()}
                                </span>
                              </div>

                              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                                {
                                  comment.content
                                }
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  <form
                    onSubmit={
                      handleAddComment
                    }
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <textarea
                      value={
                        newComment
                      }
                      onChange={(event) =>
                        setNewComment(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full resize-none bg-transparent px-4 py-3 text-xs outline-none"
                    />

                    <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
                      <button
                        type="button"
                        disabled
                        className="p-1.5 text-zinc-300"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !newComment.trim() ||
                          isAddingComment
                        }
                        className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black"
                      >
                        <Send className="h-3 w-3" />

                        {isAddingComment
                          ? "Posting..."
                          : "Comment"}
                      </button>
                    </div>
                  </form>
                </div>

                {commentError && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {commentError}
                  </p>
                )}
              </section>
            </section>

            {/* RIGHT DETAILS */}

            <aside className="h-fit pt-4">
              <div className="overflow-visible rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-3 w-3" />

                    <h2 className="text-xs font-semibold">
                      Details
                    </h2>
                  </div>

                  <Settings className="h-3.5 w-3.5 text-zinc-400" />
                </div>

                {/* STATUS */}

                <CustomDropdown
                  open={
                    openMenu ===
                    "status"
                  }
                  onToggle={() =>
                    setOpenMenu(
                      openMenu ===
                        "status"
                        ? null
                        : "status",
                    )
                  }
                  width="w-48"
                  align="right"
                  trigger={
                    <DetailButton
                      label="Status"
                      value={
                        statusLabels[
                          task.status
                        ]
                      }
                      color="text-zinc-600 dark:text-zinc-300"
                      onClick={() => {}}
                    />
                  }
                >
                  <DropdownTitle>
                    Status
                  </DropdownTitle>

                  {(
                    Object.keys(
                      statusLabels,
                    ) as ApiTaskDetails["status"][]
                  ).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          handleUpdateTask(
                            {
                              status,
                            },
                          )
                        }
                        className="dropdown-item"
                      >
                        {
                          statusLabels[
                            status
                          ]
                        }

                        {task.status ===
                          status && (
                          <Check className="h-3.5 w-3.5 text-violet-600" />
                        )}
                      </button>
                    ),
                  )}
                </CustomDropdown>

                {/* PRIORITY */}

                <CustomDropdown
                  open={
                    openMenu ===
                    "priority"
                  }
                  onToggle={() =>
                    setOpenMenu(
                      openMenu ===
                        "priority"
                        ? null
                        : "priority",
                    )
                  }
                  width="w-48"
                  align="right"
                  trigger={
                    <DetailButton
                      label="Priority"
                      value={
                        priorityLabels[
                          task.priority
                        ]
                      }
                      color={
                        priorityColors[
                          task.priority
                        ]
                      }
                      icon={
                        <PriorityIcon
                          priority={
                            task.priority
                          }
                        />
                      }
                      onClick={() => {}}
                    />
                  }
                >
                  <DropdownTitle>
                    Priority
                  </DropdownTitle>

                  {(
                    Object.keys(
                      priorityLabels,
                    ) as TaskPriority[]
                  ).map(
                    (priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() =>
                          handleUpdateTask(
                            {
                              priority,
                            },
                          )
                        }
                        className="dropdown-item"
                      >
                        <span className="flex items-center gap-2">
                          <PriorityIcon
                            priority={
                              priority
                            }
                          />

                          <span
                            className={
                              priorityColors[
                                priority
                              ]
                            }
                          >
                            {
                              priorityLabels[
                                priority
                              ]
                            }
                          </span>
                        </span>

                        {task.priority ===
                          priority && (
                          <Check className="h-3.5 w-3.5 text-violet-600" />
                        )}
                      </button>
                    ),
                  )}
                </CustomDropdown>

                <DetailRow
                  icon={
                    <User className="h-3.5 w-3.5" />
                  }
                  label="Members"
                  value={
                    task.assignee
                      ?.name ||
                    "Unassigned"
                  }
                />

                <DetailRow
                  icon={
                    <CalendarDays className="h-3.5 w-3.5" />
                  }
                  label="Dates"
                  value={
                    task.dueDate
                      ? new Date(
                          task.dueDate,
                        ).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "No date"
                  }
                />

                <DetailRow
                  icon={
                    <Tag className="h-3.5 w-3.5" />
                  }
                  label="Labels"
                  value={String(
                    task.labels.length,
                  )}
                />

                <DetailRow
                  icon={
                    <User className="h-3.5 w-3.5" />
                  }
                  label="Teams"
                  value="Workspace"
                />

                <DetailRow
                  icon={
                    <User className="h-3.5 w-3.5" />
                  }
                  label="Reporter"
                  value={
                    task.creator
                      ?.name ||
                    "Unknown"
                  }
                />

                {/* UPDATES */}

                <div className="border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <ChevronDown className="h-3 w-3" />

                    <span className="text-xs font-semibold">
                      Updates
                    </span>
                  </div>

                  {task.comments
                    .slice(-3)
                    .reverse()
                    .map(
                      (comment) => (
                        <div
                          key={
                            comment.id
                          }
                          className="flex gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800"
                        >
                          <Avatar
                            user={
                              comment.user
                            }
                            small
                          />

                          <div className="min-w-0">
                            <p className="text-[10px] font-medium">
                              {comment
                                .user
                                ?.name ||
                                "User"}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                              {
                                comment.content
                              }
                            </p>

                            <p className="mt-1 text-[9px] text-zinc-400">
                              {new Date(
                                comment.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

/* =========================================================
   CUSTOM DROPDOWN
========================================================= */

function CustomDropdown({
  open,
  onToggle,
  trigger,
  children,
  width = "w-48",
  align = "left",
}: {
  open: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  children: ReactNode;
  width?: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className="relative"
      data-dropdown-root
    >
      <div onClick={onToggle}>
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute top-[calc(100%+6px)] z-[9999] ${width} ${
            align === "right"
              ? "right-0"
              : "left-0"
          } rounded-lg border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40`}
          role="menu"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DROPDOWN TITLE
========================================================= */

function DropdownTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
      {children}
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
      {children}
    </div>
  );
}

/* =========================================================
   DETAIL BUTTON
========================================================= */

function DetailButton({
  label,
  value,
  color,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  color?: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
    >
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <span
        className={`flex min-w-0 items-center gap-1.5 text-[10px] font-medium ${
          color ||
          "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {icon}

        <span className="truncate">
          {value}
        </span>

        <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
      </span>
    </button>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}

        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>

      <span className="max-w-[130px] truncate text-right text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   PRIORITY ICON
========================================================= */

function PriorityIcon({
  priority,
}: {
  priority: TaskPriority;
}) {
  return (
    <span
      className={`flex items-end gap-[1px] ${
        priorityColors[priority]
      }`}
      aria-hidden="true"
    >
      <span
        className={`h-1 w-[2px] rounded-sm bg-current ${
          priority ===
          "NO_PRIORITY"
            ? "opacity-30"
            : ""
        }`}
      />

      <span
        className={`h-1.5 w-[2px] rounded-sm bg-current ${
          priority ===
          "NO_PRIORITY"
            ? "opacity-30"
            : ""
        }`}
      />

      <span
        className={`h-2 w-[2px] rounded-sm bg-current ${
          priority ===
          "NO_PRIORITY"
            ? "opacity-30"
            : ""
        }`}
      />
    </span>
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDateForInput(
  date: string,
) {
  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return "";
  }

  const year =
    parsed.getFullYear();

  const month = String(
    parsed.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    parsed.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  user,
  small = false,
}: {
  user?: ApiUser | null;
  small?: boolean;
}) {
  const size = small
    ? "h-6 w-6"
    : "h-7 w-7";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800`}
    >
      <User className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
    </div>
  );
}