"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, googleLoginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1a1b] px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#103334]/60 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#B58863]/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            CINETRACK
          </Link>
          <p className="mt-2 text-sm text-[#A79E9C]">Your ultimate cinema companion</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#103334]/50 backdrop-blur-xl border border-[#3D4D55]/50 p-8 rounded-2xl shadow-2xl shadow-black/50">
          <h2 className="text-2xl font-bold text-[#D3C3B9] mb-6 text-center">Welcome Back</h2>

          {/* Google OAuth Login Button */}
          <form action={googleLoginAction} className="mb-6">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0f1a1b] hover:bg-[#152426] border border-[#3D4D55]/60 text-sm font-semibold text-[#D3C3B9] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-md hover:border-[#B58863]/40 group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-[#3D4D55]/40"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono text-[#A79E9C]/60 uppercase tracking-widest">or email</span>
            <div className="flex-grow border-t border-[#3D4D55]/40"></div>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#A79E9C] uppercase tracking-wider mb-2">
                Email Address or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                placeholder="you@example.com or username"
                className="w-full bg-[#0f1a1b] border border-[#3D4D55]/50 rounded-xl px-4 py-3 text-sm text-[#D3C3B9] placeholder-[#A79E9C]/50 focus:outline-none focus:border-[#B58863]/60 focus:ring-1 focus:ring-[#B58863]/20 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-[#A79E9C] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#0f1a1b] border border-[#3D4D55]/50 rounded-xl px-4 py-3 text-sm text-[#D3C3B9] placeholder-[#A79E9C]/50 focus:outline-none focus:border-[#B58863]/60 focus:ring-1 focus:ring-[#B58863]/20 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-90 text-sm font-semibold text-[#0f1a1b] shadow-lg shadow-[#B58863]/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#0f1a1b]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Offline/Database Bypass Mock Account Access */}
          <div className="mt-5 space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#3D4D55]/30"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-[#A79E9C]/60 uppercase tracking-widest">or bypass</span>
              <div className="flex-grow border-t border-[#3D4D55]/30"></div>
            </div>

            <Link
              href="/profile?mockOwner=true"
              className="w-full py-3 px-4 rounded-xl border border-[#B58863]/40 hover:bg-[#B58863]/10 text-center block text-xs font-bold font-mono uppercase tracking-wider text-[#B58863] active:scale-[0.98] transition-all duration-200 shadow-md"
            >
              ✦ Access Mock Owner Profile
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#3D4D55]/40 text-center">
            <p className="text-sm text-[#A79E9C]">
              New to Cinetrack?{" "}
              <Link href="/signup" className="font-semibold text-[#B58863] hover:text-[#d4a87c] transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
