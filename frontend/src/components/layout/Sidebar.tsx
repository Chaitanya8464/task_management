"use client";

import {
  CheckSquare,
  FolderKanban,
  Settings,
  UserCircle,
  ChevronDown,
  ChevronRight,
  Palette,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTheme,
  ColorTheme,
} from "@/providers/ThemeProvider";

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
}

const colorOptions: {
  id: ColorTheme;
  name: string;
  color: string;
}[] = [
  {
    id: "amber",
    name: "Amber",
    color: "#f59e0b",
  },
  {
    id: "blue",
    name: "Blue",
    color: "#8b5cf6",
  },
  {
    id: "pink",
    name: "Pink",
    color: "#ec4899",
  },
  {
    id: "rose",
    name: "Rose",
    color: "#e11d48",
  },
  {
    id: "emerald",
    name: "Emerald",
    color: "#10b981",
  },
  {
    id: "black",
    name: "Black",
    color: "#18181b",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    theme,
    toggleTheme,
    colorTheme,
    setColorTheme,
  } = useTheme();

  const [user, setUser] =
    useState<StoredUser | null>(null);

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);
  
    
  const [colorMenuOpen, setColorMenuOpen] =
    useState(false);
  
    const profileMenuRef =
  useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "taskflow_user",
        );

      if (!storedUser) {
        setUser(null);
        return;
      }

      setUser(
        JSON.parse(storedUser),
      );
    } catch (error) {
      console.error(
        "Failed to load TaskFlow user:",
        error,
      );

      setUser(null);
    }
  }, []);

  // ==========================================
// Close profile menu when clicking outside
// ==========================================

useEffect(() => {
  if (!profileMenuOpen) {
    return;
  }

  const handleOutsideClick = (
    event: MouseEvent,
  ) => {
    const target =
      event.target as Node;

    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(
        target,
      )
    ) {
      setProfileMenuOpen(false);
      setColorMenuOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleOutsideClick,
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick,
    );
  };
}, [profileMenuOpen]);

  const isTasksActive =
    pathname === "/tasks" ||
    pathname.startsWith("/tasks/");

  const isProjectsActive =
    pathname === "/projects" ||
    pathname.startsWith("/projects/");

  const displayName =
    user?.name?.trim() ||
    "Guest User";

  const displayEmail =
    user?.email ||
    "guest@taskflow.local";

  const handleLogout = () => {
    localStorage.removeItem(
      "taskflow_user",
    );

    localStorage.removeItem(
      "taskflow_workspace",
    );

    setProfileMenuOpen(false);
    setColorMenuOpen(false);

    router.push("/");
  };

  return (
    <aside
      className="
        flex
        min-h-screen
        w-full
        shrink-0
        flex-col
        border-r
        border-zinc-200
        bg-white
        text-zinc-900
        dark:border-zinc-800
        dark:bg-zinc-950
        dark:text-zinc-100
      "
    >
      {/* User */}

      <div
      ref={profileMenuRef}
        className="
          relative
          flex
          h-14
          shrink-0
          items-center
          border-b
          border-zinc-200
          px-3
          dark:border-zinc-800
        "
      >
        <button
          type="button"
          onClick={() => {
            setProfileMenuOpen(
              (current) => !current,
            );

            setColorMenuOpen(false);
          }}
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2.5
            rounded-md
            px-1.5
            py-1.5
            text-left
            hover:bg-zinc-50
            dark:hover:bg-zinc-900
          "
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="
                h-7
                w-7
                shrink-0
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-violet-600
                text-[10px]
                font-semibold
                text-white
              "
            >
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <span
            className="
              min-w-0
              flex-1
              truncate
              text-xs
              font-medium
            "
          >
            {displayName}
          </span>

          <ChevronDown
            className={`
              h-3.5
              w-3.5
              shrink-0
              text-zinc-400
              transition-transform
              ${
                profileMenuOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {/* Profile Menu */}

        {profileMenuOpen && (
          <div
            className="
              absolute
              left-3
              right-3
              top-[52px]
              z-50
              overflow-visible
              rounded-md
              border
              border-zinc-200
              bg-white
              py-1
              shadow-lg
              dark:border-zinc-700
              dark:bg-zinc-900
            "
          >
            <div
              className="
                border-b
                border-zinc-100
                px-3
                py-2
                dark:border-zinc-800
              "
            >
              <p className="truncate text-xs font-medium">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                {displayEmail}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="
                flex
                w-full
                items-center
                justify-between
                px-3
                py-2.5
                text-left
                text-xs
                hover:bg-zinc-50
                dark:hover:bg-zinc-800
              "
            >
              <span className="flex items-center gap-2.5">
                {theme === "dark" ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}

                Change Theme
              </span>

              <ChevronRight className="h-3 w-3 text-zinc-400" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setColorMenuOpen(
                    (current) =>
                      !current,
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-3
                  py-2.5
                  text-left
                  text-xs
                  hover:bg-zinc-50
                  dark:hover:bg-zinc-800
                "
              >
                <span className="flex items-center gap-2.5">
                  <Palette className="h-3.5 w-3.5" />

                  Color Mode
                </span>

                <ChevronRight
                  className={`
                    h-3 w-3
                    text-zinc-400
                    ${
                      colorMenuOpen
                        ? "rotate-90"
                        : ""
                    }
                  `}
                />
              </button>

              {colorMenuOpen && (
                <div
                  className="
                    absolute
                    left-[calc(100%+8px)]
                    top-0
                    z-[60]
                    w-[150px]
                    rounded-md
                    border
                    border-zinc-200
                    bg-white
                    py-1
                    shadow-lg
                    dark:border-zinc-700
                    dark:bg-zinc-900
                  "
                >
                  <div className="px-3 py-2 text-[10px] font-medium text-zinc-400">
                    Color Mode
                  </div>

                  {colorOptions.map(
                    (option) => {
                      const selected =
                        colorTheme ===
                        option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setColorTheme(
                              option.id,
                            );

                            setColorMenuOpen(
                              false,
                            );
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            px-3
                            py-2
                            text-left
                            text-[11px]
                            hover:bg-zinc-50
                            dark:hover:bg-zinc-800
                          "
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{
                                backgroundColor:
                                  option.color,
                              }}
                            />

                            {option.name}
                          </span>

                          {selected && (
                            <span>✓</span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            <Link
              href="/profile"
              onClick={() => {
                setProfileMenuOpen(false);
                setColorMenuOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-2.5
                px-3
                py-2.5
                text-xs
                hover:bg-zinc-50
                dark:hover:bg-zinc-800
              "
            >
              <UserCircle className="h-3.5 w-3.5" />
              Profile
            </Link>

            <Link
              href="/settings"
              onClick={() => {
                setProfileMenuOpen(false);
                setColorMenuOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-2.5
                px-3
                py-2.5
                text-xs
                hover:bg-zinc-50
                dark:hover:bg-zinc-800
              "
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-2.5
                px-3
                py-2.5
                text-xs
                text-red-500
                hover:bg-red-50
                dark:hover:bg-red-950/30
              "
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}

      <div className="flex-1 px-2.5 py-4">
        {/* Workspace */}

        <div
          className="
            flex
            items-center
            justify-between
            px-3
            pb-2
          "
        >
          <span className="text-xs font-medium">
            Workspace
          </span>

          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </div>

        <nav className="space-y-0.5">
          {/* Tasks */}

          <Link
            href="/tasks"
            className={`
              flex
              h-9
              items-center
              gap-2.5
              rounded-md
              px-3
              text-xs
              transition
              ${
                isTasksActive
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
                    dark:text-zinc-400
                    dark:hover:bg-zinc-900
                    dark:hover:text-zinc-100
                  `
              }
            `}
          >
            <CheckSquare className="h-4 w-4 shrink-0" />

            <span>Tasks</span>
          </Link>

          {/* Projects */}

          <Link
            href="/projects"
            className={`
              flex
              h-9
              items-center
              gap-2.5
              rounded-md
              px-3
              text-xs
              transition
              ${
                isProjectsActive
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
                    dark:text-zinc-400
                    dark:hover:bg-zinc-900
                    dark:hover:text-zinc-100
                  `
              }
            `}
          >
            <FolderKanban className="h-4 w-4 shrink-0" />

            <span>Projects</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}