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
      {/* Top accent */}
      <div className="h-1 w-full bg-violet-500" />

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

                <span className="text-lg font-semibold tracking-tight">
                  TaskFlow
                </span>
              </div>
            </div>

            {/* Login card */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-center">
                <h1 className="text-[16px] font-semibold">
                  Let's get back on track
                </h1>

                <p className="mt-1 text-[11px] text-zinc-400">
                  Enter your email below to login to your account.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="h-9 w-full rounded-full bg-black px-4 text-xs font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99]"
                >
                  Continue as Guest
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.99]"
                >
                  <span className="font-semibold">G</span>
                  <span>Login with Google</span>
                </button>
              </div>
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