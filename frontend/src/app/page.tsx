"use client";

import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const handleGuestLogin = () => {
    console.log("Guest login clicked");
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="flex min-h-screen flex-col">
        {/* Top accent line */}
        <div className="h-1 w-full bg-violet-500" />

        {/* Main content */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="flex w-full max-w-sm flex-col items-center">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                T
              </div>

              <span className="text-xl font-semibold tracking-tight">
                TaskFlow
              </span>
            </div>

            {/* Login card */}
            <div className="w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-zinc-900">
                  Let's get back on track
                </h1>

                <p className="mt-1 text-xs text-zinc-500">
                  Enter your email below to login to your account.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {/* Guest login */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="flex h-10 w-full items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Continue as Guest
                </button>

                {/* Google login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                >
                  <span className="text-sm font-semibold">G</span>
                  Login with Google
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="mt-4 max-w-xs text-center text-[10px] leading-4 text-zinc-400">
              By clicking continue, you agree to our{" "}
              <button className="underline underline-offset-2 hover:text-zinc-600">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="underline underline-offset-2 hover:text-zinc-600">
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>

        {/* Small footer */}
        <div className="flex justify-center pb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>TaskFlow</span>
          </div>
        </div>
      </div>
    </main>
  );
}