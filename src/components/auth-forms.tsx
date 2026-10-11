"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  );
}
