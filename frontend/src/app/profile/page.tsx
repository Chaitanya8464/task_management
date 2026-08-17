"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  LogOut,
  Mail,
  Shield,
  User,
  UserCircle,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";

import {
  ApiUser,
  GuestLoginResponse,
} from "@/lib/api";

// =====================================================
// Profile Page
// =====================================================

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] =
    useState<ApiUser | null>(null);

  const [workspace, setWorkspace] =
    useState<
      GuestLoginResponse["workspace"] | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  // =====================================================
  // Load Session
  // =====================================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "taskflow_user",
        );

      const storedWorkspace =
        localStorage.getItem(
          "taskflow_workspace",
        );

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        if (parsedUser?.id) {
          setUser(parsedUser);
        }
      }

      if (storedWorkspace) {
        const parsedWorkspace =
          JSON.parse(storedWorkspace);

        if (parsedWorkspace?.id) {
          setWorkspace(
            parsedWorkspace,
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // Copy User ID
  // =====================================================

  const handleCopyId = async () => {
    if (!user?.id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        user.id,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy user ID:",
        error,
      );
    }
  };

  // =====================================================
  // Sign Out
  // =====================================================

  const handleSignOut = () => {
    localStorage.removeItem(
      "taskflow_user",
    );

    localStorage.removeItem(
      "taskflow_workspace",
    );

    router.push("/tasks");
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-200" />

            Loading profile...
          </div>
        </main>
      </AppShell>
    );
  }

  // =====================================================
  // No User
  // =====================================================

  if (!user) {
    return (
      <AppShell>
        <main className="min-h-screen bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8">
            <Link
              href="/tasks"
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-md
                px-2
                py-1.5
                text-xs
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-900
                dark:text-zinc-400
                dark:hover:bg-zinc-900
                dark:hover:text-zinc-100
              "
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Tasks
            </Link>

            <div
              className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                p-8
                text-center
                dark:border-zinc-800
                dark:bg-zinc-950
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-100
                  dark:bg-zinc-900
                "
              >
                <UserCircle className="h-6 w-6 text-zinc-400" />
              </div>

              <h1 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Profile unavailable
              </h1>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-400">
                No TaskFlow user session was
                found on this device.
              </p>

              <Link
                href="/tasks"
                className="
                  mt-5
                  inline-flex
                  h-8
                  items-center
                  rounded-md
                  bg-zinc-900
                  px-3
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-zinc-800
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-zinc-200
                "
              >
                Go to Tasks
              </Link>
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  // =====================================================
  // Initials
  // =====================================================

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map(
        (part) => part[0],
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // =====================================================
  // Render
  // =====================================================

  return (
    <AppShell>
      <main
        className="
          min-h-screen
          bg-white
          text-zinc-900
          dark:bg-zinc-950
          dark:text-zinc-100
        "
      >
        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-[60px]
              max-w-[1000px]
              items-center
              px-4
              sm:px-6
              lg:px-8
            "
          >
            <Link
              href="/tasks"
              className="
                flex
                items-center
                gap-2
                rounded-md
                px-2
                py-1.5
                text-xs
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-900
                dark:text-zinc-400
                dark:hover:bg-zinc-900
                dark:hover:text-zinc-100
              "
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Tasks
            </Link>
          </div>
        </div>

        {/* =================================================
            Content
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-[1000px]
            px-4
            py-7
            sm:px-6
            sm:py-9
            lg:px-8
          "
        >
          {/* Page Heading */}

          <div className="mb-7">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              Account
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Profile
            </h1>

            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Manage your TaskFlow profile
              information and workspace details.
            </p>
          </div>

          {/* =================================================
              Profile Card
          ================================================= */}

          <section
            className="
              overflow-hidden
              rounded-xl
              border
              border-zinc-200
              bg-white
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            {/* Profile Hero */}

            <div
              className="
                border-b
                border-zinc-200
                px-5
                py-6
                dark:border-zinc-800
                sm:px-7
              "
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="
                      h-16
                      w-16
                      shrink-0
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-zinc-100
                      text-lg
                      font-semibold
                      text-zinc-600
                      dark:bg-zinc-800
                      dark:text-zinc-300
                    "
                  >
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {user.name}
                    </h2>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-emerald-50
                        px-2
                        py-0.5
                        text-[9px]
                        font-medium
                        text-emerald-600
                        dark:bg-emerald-950/30
                        dark:text-emerald-400
                      "
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Active
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                Information
            ================================================= */}

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {/* Name */}

              <ProfileRow
                icon={
                  <User className="h-4 w-4" />
                }
                label="Full name"
                value={user.name}
              />

              {/* Email */}

              <ProfileRow
                icon={
                  <Mail className="h-4 w-4" />
                }
                label="Email address"
                value={user.email}
              />

              {/* User ID */}

              <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">
                    <Shield className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-medium">
                      User ID
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      Unique account identifier
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="
                    flex
                    max-w-full
                    items-center
                    gap-2
                    rounded-md
                    border
                    border-zinc-200
                    px-2.5
                    py-1.5
                    text-[10px]
                    text-zinc-500
                    transition
                    hover:bg-zinc-50
                    hover:text-zinc-800
                    dark:border-zinc-700
                    dark:hover:bg-zinc-900
                    dark:hover:text-zinc-200
                  "
                  title="Copy user ID"
                >
                  <span className="max-w-[220px] truncate font-mono">
                    {user.id}
                  </span>

                  {copied ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              Workspace
          ================================================= */}

          <section
            className="
              mt-5
              overflow-hidden
              rounded-xl
              border
              border-zinc-200
              bg-white
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            <div
              className="
                border-b
                border-zinc-200
                px-5
                py-4
                dark:border-zinc-800
                sm:px-7
              "
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-zinc-400" />

                <div>
                  <h2 className="text-sm font-semibold">
                    Workspace
                  </h2>

                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    Your current TaskFlow workspace
                  </p>
                </div>
              </div>
            </div>

            {workspace ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <ProfileRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Workspace name"
                  value={
                    workspace.name
                  }
                />

                <ProfileRow
                  icon={
                    <Shield className="h-4 w-4" />
                  }
                  label="Workspace ID"
                  value={
                    workspace.id
                  }
                />

                <ProfileRow
                  icon={
                    <User className="h-4 w-4" />
                  }
                  label="Owner ID"
                  value={
                    workspace.ownerId
                  }
                />
              </div>
            ) : (
              <div className="px-5 py-6 sm:px-7">
                <p className="text-xs text-zinc-400">
                  Workspace information is not
                  available in the current session.
                </p>
              </div>
            )}
          </section>

          {/* =================================================
              Account Actions
          ================================================= */}

          <section
            className="
              mt-5
              overflow-hidden
              rounded-xl
              border
              border-zinc-200
              bg-white
              dark:border-zinc-800
              dark:bg-zinc-950
            "
          >
            <div
              className="
                border-b
                border-zinc-200
                px-5
                py-4
                dark:border-zinc-800
                sm:px-7
              "
            >
              <h2 className="text-sm font-semibold">
                Account
              </h2>

              <p className="mt-0.5 text-[10px] text-zinc-400">
                Session and account actions
              </p>
            </div>

            <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="text-xs font-medium">
                  Sign out
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                  Remove the current TaskFlow
                  session from this browser.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="
                  inline-flex
                  h-8
                  shrink-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-md
                  border
                  border-red-200
                  px-3
                  text-[11px]
                  font-medium
                  text-red-500
                  transition
                  hover:bg-red-50
                  dark:border-red-900/50
                  dark:hover:bg-red-950/30
                "
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}

// =====================================================
// Profile Row
// =====================================================

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-2
        px-5
        py-4
        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:px-7
      "
    >
      <div className="flex items-center gap-3">
        <span className="text-zinc-400">
          {icon}
        </span>

        <div>
          <p className="text-xs font-medium">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] text-zinc-400">
            {label === "Full name"
              ? "Your display name"
              : label === "Email address"
                ? "Your account email"
                : "Workspace information"}
          </p>
        </div>
      </div>

      <span className="max-w-full break-all text-xs font-medium text-zinc-700 dark:text-zinc-300 sm:max-w-[420px] sm:text-right">
        {value}
      </span>
    </div>
  );
}