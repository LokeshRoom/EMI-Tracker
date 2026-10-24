"use client";

import Link from "next/link";
import { SignupForm } from "@/components/auth-forms";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Create account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set up a Firebase account to start tracking EMIs.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-300 underline transition-colors duration-200 hover:text-amber-200 cursor-pointer">
          Sign in
        </Link>
      </p>
    </div>
  );
}
