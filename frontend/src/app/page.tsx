"use client";

import { GoogleLogin } from "@react-oauth/google";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  googleLogin,
  guestLogin,
} from "@/lib/api";

export default function Home() {
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // Guest Login
  // =====================================================

  const handleGuestLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setError("");

    try {
      const data = await guestLogin();

      console.log(
        "Guest login successful:",
        data,
      );

      // Store logged-in user
      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(data.user),
      );

      // Store active workspace
      localStorage.setItem(
        "taskflow_workspace",
        JSON.stringify(
          data.workspace,
        ),
      );

      // Go directly to Tasks
      router.push("/tasks");
    } catch (error) {
      console.error(
        "Guest login failed:",
        error,
      );

      setError(
        "Unable to login as guest. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // =====================================================
  // Google Login
  // =====================================================

  const handleGoogleSuccess = async (
    credentialResponse: {
      credential?: string;
    },
  ) => {
    if (!credentialResponse.credential) {
      setError(
        "Google login failed. No credential received.",
      );

      return;
    }

    try {
      setIsLoggingIn(true);
      setError("");

      const data = await googleLogin(
        credentialResponse.credential,
      );

      console.log(
        "Google login successful:",
        data,
      );

      // Store logged-in user
      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(data.user),
      );

      // Store active workspace
      localStorage.setItem(
        "taskflow_workspace",
        JSON.stringify(
          data.workspace,
        ),
      );

      // Go directly to Tasks
      router.push("/tasks");
    } catch (error) {
      console.error(
        "Google login failed:",
        error,
      );

      setError(
        "Unable to login with Google. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="flex min-h-screen flex-col">

        {/* =================================================
            Main Content
        ================================================= */}

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="flex w-full max-w-[336px] flex-col items-center">

            {/* =================================================
                Logo
            ================================================= */}

            <div className="mb-7 flex items-center justify-center">
              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-violet-600
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  T
                </div>

                <span
                  className="
                    text-[16px]
                    font-semibold
                    tracking-tight
                    text-zinc-900
                  "
                >
                  TaskFlow
                </span>

              </div>
            </div>

            {/* =================================================
                Login Card
            ================================================= */}

            <div
              className="
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-5
                py-5
                shadow-[0_1px_2px_rgba(0,0,0,0.05)]
              "
            >

              {/* =================================================
                  Heading
              ================================================= */}

              <div className="text-center">

                <h1
                  className="
                    text-[17px]
                    font-semibold
                    leading-6
                    text-zinc-900
                  "
                >
                  Let's get back on track
                </h1>

                <p
                  className="
                    mt-1
                    text-[11px]
                    leading-5
                    text-zinc-400
                  "
                >
                  Enter your email below to login
                  to your account.
                </p>

              </div>

              {/* =================================================
                  Login Buttons
              ================================================= */}

              <div className="mt-4 space-y-2">

                {/* =================================================
                    Guest Login

                    Authentication preserved
                ================================================= */}

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isLoggingIn}
                  className="
                    flex
                    h-8
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    bg-[#181818]
                    px-4
                    text-[12px]
                    font-medium
                    text-white
                    transition
                    hover:bg-black
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isLoggingIn
                    ? "Signing in..."
                    : "Continue as Guest"}
                </button>

                {/* =================================================
                    Google Login

                    Authentication preserved
                ================================================= */}

                <div
                  className="
                    flex
                    h-8
                    w-full
                    items-center
                    overflow-hidden
                    rounded-full

                    [&>div]:!w-full
                    [&>div>div]:!w-full
                    [&_iframe]:!w-full
                  "
                >
                  <GoogleLogin
                    onSuccess={
                      handleGoogleSuccess
                    }
                    onError={() => {
                      setError(
                        "Google login failed. Please try again.",
                      );
                    }}
                    useOneTap={false}
                    theme="outline"
                    size="medium"
                    shape="pill"
                    width="100%"
                    text="signin_with"
                  />
                </div>

              </div>

              {/* =================================================
                  Error
              ================================================= */}

              {error && (
                <p
                  className="
                    mt-3
                    text-center
                    text-[10px]
                    leading-4
                    text-red-500
                  "
                >
                  {error}
                </p>
              )}

            </div>

            {/* =================================================
                Terms
            ================================================= */}

            <p
              className="
                mx-auto
                mt-4
                max-w-[336px]
                text-center
                text-[9px]
                leading-4
                text-zinc-400
              "
            >
              By clicking continue, you agree to our{" "}

              <button
                type="button"
                className="
                  underline
                  underline-offset-2
                  transition
                  hover:text-zinc-600
                "
              >
                Terms of Service
              </button>{" "}

              and{" "}

              <button
                type="button"
                className="
                  underline
                  underline-offset-2
                  transition
                  hover:text-zinc-600
                "
              >
                Privacy Policy
              </button>
              .
            </p>

          </div>
        </div>

        {/* =================================================
            Footer
        ================================================= */}

        <footer className="flex justify-center pb-5">

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-zinc-400
            "
          >
            <CheckCircle2 className="h-3 w-3" />

            <span>TaskFlow</span>
          </div>

        </footer>

      </div>
    </main>
  );
}