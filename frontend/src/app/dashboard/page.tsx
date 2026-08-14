"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("taskflow_user");

    const storedWorkspace =
      localStorage.getItem("taskflow_workspace");

    if (!storedUser || !storedWorkspace) {
      router.replace("/");
      return;
    }

    setUser(JSON.parse(storedUser));
    setWorkspace(JSON.parse(storedWorkspace));
  }, [router]);

  if (!user || !workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">
          Loading TaskFlow...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">
              Welcome back,
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
              {user.name}
            </h1>
          </div>

          <button
            onClick={() => router.push("/tasks")}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Open Tasks
          </button>
        </div>

        {/* Workspace */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Workspace
          </p>

          <h2 className="mt-2 text-lg font-semibold text-zinc-900">
            {workspace.name}
          </h2>

          <p className="mt-1 text-xs text-zinc-400">
            {user.email}
          </p>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => router.push("/tasks")}
            className="rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-zinc-900">
              Tasks
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              View and manage your tasks.
            </p>
          </button>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-900">
              Workspace
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Manage your TaskFlow workspace.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-900">
              Account
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Signed in as {user.name}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}