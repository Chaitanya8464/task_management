"use client";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  googleLogin,
} from "@/lib/api";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { guestLogin } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleGuestLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setError("");

    try {
      const data = await guestLogin();

      console.log("Guest login successful:", data);

      // Store the logged-in user
      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(data.user),
      );

      // Store the active workspace
      localStorage.setItem(
        "taskflow_workspace",
        JSON.stringify(data.workspace),
      );

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Guest login failed:", error);

      setError(
        "Unable to login as guest. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <main className="min-h-screen border-t-4 border-violet-600 bg-white">
      <div className="flex min-h-[calc(100vh-4px)] flex-col">
        {/* Main content */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-[360px]">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-xs font-bold text-white">
                  T
                </div>

                <span className="text-lg font-semibold tracking-tight text-zinc-900">
                  TaskFlow
                </span>
              </div>
            </div>

            {/* Login card */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-center">
                <h1 className="text-[16px] font-semibold text-zinc-900">
                  Let's get back on track
                </h1>

                <p className="mt-1 text-[11px] text-zinc-400">
                  Enter your email below to login to your account.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                {/* Guest Login */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isLoggingIn}
                  className="h-9 w-full rounded-full bg-black px-4 text-xs font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingIn
                    ? "Signing in..."
                    : "Continue as Guest"}
                </button>

                {/* Google Login */}
               <GoogleLogin
  onSuccess={async (credentialResponse) => {
    if (
      !credentialResponse.credential
    ) {
      setError(
        "Google login failed. No credential received.",
      );

      return;
    }

    try {
      setIsLoggingIn(true);
      setError("");

      const data =
        await googleLogin(
          credentialResponse.credential,
        );

      console.log(
        "Google login successful:",
        data,
      );

      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(
          data.user,
        ),
      );

      localStorage.setItem(
        "taskflow_workspace",
        JSON.stringify(
          data.workspace,
        ),
      );

      router.push(
        "/dashboard",
      );
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
  }}
  onError={() => {
    setError(
      "Google login failed. Please try again.",
    );
  }}
  useOneTap={false}
/>
                  
              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-center text-[10px] text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="mx-auto mt-3 max-w-[300px] text-center text-[9px] leading-4 text-zinc-400">
              By clicking continue, you agree to our{" "}
              <button
                type="button"
                className="underline underline-offset-2 hover:text-zinc-600"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="underline underline-offset-2 hover:text-zinc-600"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center pb-5">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>TaskFlow</span>
          </div>
        </footer>
      </div>
    </main>
  );
}