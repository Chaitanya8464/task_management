"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.taskId;

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <p className="text-[10px] text-zinc-400">
              Tasks / Task Details
            </p>

            <h1 className="text-sm font-semibold text-zinc-900">
              Design Homepage
            </h1>
          </div>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <section className="space-y-5">
            {/* Task information */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-600">
                  High
                </span>

                <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500">
                  To Do
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-zinc-900">
                Design Homepage
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Create the initial homepage design and layout for
                the TaskFlow application. Make sure the layout is
                responsive and follows the approved design system.
              </p>
            </div>

            {/* Subtasks */}
            <div className="rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Subtasks
                  </h3>

                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    Break this task into smaller steps.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                <Subtask
                  title="Create desktop layout"
                  completed
                />

                <Subtask
                  title="Create mobile layout"
                  completed={false}
                />

                <Subtask
                  title="Review spacing and typography"
                  completed={false}
                />
              </div>
            </div>

            {/* Updates */}
            <div className="rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Updates
                </h3>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  Activity and comments for this task.
                </p>
              </div>

              <div className="space-y-5 p-5">
                <Activity
                  name="John"
                  text="created this task"
                  time="Today, 10:32 AM"
                />

                <Activity
                  name="Sarah"
                  text="updated the priority to High"
                  time="Today, 11:10 AM"
                />
              </div>

              {/* Comment box */}
              <div className="border-t border-zinc-100 p-4">
                <div className="rounded-lg border border-zinc-200">
                  <textarea
                    placeholder="Write an update..."
                    rows={3}
                    className="w-full resize-none rounded-lg px-3 py-2.5 text-xs outline-none placeholder:text-zinc-400"
                  />

                  <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-[10px] font-medium text-white hover:bg-zinc-800"
                    >
                      <Send className="h-3 w-3" />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Details sidebar */}
          <aside className="h-fit rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-zinc-900">
                Details
              </h3>
            </div>

            <div className="divide-y divide-zinc-100">
              <DetailRow
                icon={<Circle className="h-4 w-4" />}
                label="Status"
                value="To Do"
              />

              <DetailRow
                icon={<Clock3 className="h-4 w-4" />}
                label="Priority"
                value="High"
              />

              <DetailRow
                icon={<User className="h-4 w-4" />}
                label="Assignee"
                value="John"
              />

              <DetailRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Due Date"
                value="Sep 12"
              />

              <DetailRow
                icon={<MessageCircle className="h-4 w-4" />}
                label="Comments"
                value="3"
              />

              <DetailRow
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Task ID"
                value={String(taskId)}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface SubtaskProps {
  title: string;
  completed: boolean;
}

function Subtask({ title, completed }: SubtaskProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <button
        type="button"
        className={
          completed
            ? "text-emerald-500"
            : "text-zinc-300 hover:text-zinc-500"
        }
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>

      <span
        className={`text-xs ${
          completed
            ? "text-zinc-400 line-through"
            : "text-zinc-700"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

interface ActivityProps {
  name: string;
  text: string;
  time: string;
}

function Activity({ name, text, time }: ActivityProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100">
        <User className="h-3.5 w-3.5 text-zinc-500" />
      </div>

      <div>
        <p className="text-xs text-zinc-700">
          <span className="font-medium">{name}</span>{" "}
          {text}
        </p>

        <p className="mt-1 text-[10px] text-zinc-400">
          {time}
        </p>
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="flex items-center gap-2.5 text-zinc-400">
        {icon}

        <span className="text-xs text-zinc-500">
          {label}
        </span>
      </div>

      <span className="text-xs font-medium text-zinc-700">
        {value}
      </span>
    </div>
  );
}