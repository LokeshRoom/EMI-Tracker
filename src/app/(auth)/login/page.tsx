"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Sign in</h2>
        <p className="mt-1 text-sm text-slate-400">
          Use your Firebase account to access your dashboard.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-slate-400">
        New to EMI Tracker?{" "}
        <Link href="/signup" className="font-medium text-amber-300 underline transition-colors duration-200 hover:text-amber-200 cursor-pointer">
          Create an account
        </Link>
      </p>
    </div>
  );
}
