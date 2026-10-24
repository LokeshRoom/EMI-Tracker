"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage, getFirebase } from "@/lib/firebase";
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from "@/lib/validation";
import { Button, ErrorNotice, Field, Input, Spinner } from "./ui";

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12c0 2.02.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function GoogleSignInButton({ disabled = false }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const firebase = getFirebase();
    if (!firebase) {
      setError("Firebase is not configured.");
      setLoading(false);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(firebase.auth, provider);
      const user = credential.user;
      const now = serverTimestamp();
      await setDoc(
        doc(firebase.firestore, "users", user.uid),
        {
          displayName: user.displayName || user.email || "User",
          email: user.email,
          updatedAt: now,
          createdAt: now,
        },
        { merge: true }
      );
      router.replace("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error ? <ErrorNotice message={error} /> : null}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-amber-400/50 hover:bg-white/12 hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        <span>{loading ? "Signing in with Google..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}

function AuthDivider() {
  return (
    <div className="relative my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
      <div className="h-px flex-1 bg-white/15" />
      <span>Or continue with email</span>
      <div className="h-px flex-1 bg-white/15" />
    </div>
  );
}

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (auth.status === "authenticated") router.replace("/");
  }, [auth.status, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const firebase = getFirebase();
    if (!firebase) {
      setFormError("Firebase is not configured.");
      return;
    }
    try {
      await signInWithEmailAndPassword(firebase.auth, values.email, values.password);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  if (auth.status === "unconfigured") {
    return (
      <ErrorNotice message="Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* environment variables and reload." />
    );
  }

  if (auth.status === "loading" || auth.status === "authenticated") {
    return <Spinner label="Loading account..." />;
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton disabled={isSubmitting} />
      <AuthDivider />
      <form onSubmit={onSubmit} className="space-y-4">
        {formError ? <ErrorNotice message={formError} /> : null}
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </Field>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

export function SignupForm() {
  const auth = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (auth.status === "authenticated") router.replace("/");
  }, [auth.status, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const firebase = getFirebase();
    if (!firebase) {
      setFormError("Firebase is not configured.");
      return;
    }
    try {
      const credential = await createUserWithEmailAndPassword(
        firebase.auth,
        values.email,
        values.password
      );
      await updateProfile(credential.user, { displayName: values.name });
      const now = serverTimestamp();
      await setDoc(doc(firebase.firestore, "users", credential.user.uid), {
        displayName: values.name,
        email: values.email,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  if (auth.status === "unconfigured") {
    return (
      <ErrorNotice message="Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* environment variables and reload." />
    );
  }

  if (auth.status === "loading" || auth.status === "authenticated") {
    return <Spinner label="Creating account..." />;
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton disabled={isSubmitting} />
      <AuthDivider />
      <form onSubmit={onSubmit} className="space-y-4">
        {formError ? <ErrorNotice message={formError} /> : null}
        <Field label="Name" error={errors.name?.message}>
          <Input autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" autoComplete="new-password" {...register("password")} />
        </Field>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
