import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s | EMI Tracker",
  },
  description: "Sign in to EMI Tracker.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <main className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">EMI Tracker</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track cards, cardholders, EMI purchases, and total EMI cost.
          </p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-xl shadow-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
