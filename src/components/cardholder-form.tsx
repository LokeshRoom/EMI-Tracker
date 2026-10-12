"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCardholders, useCreateCardholder, useDeleteCardholder } from "@/hooks/useCardholders";
import { getErrorMessage } from "@/lib/firebase";
import { cardholderFormSchema, type CardholderFormValues } from "@/lib/validation";
import { Button, Card, EmptyState, ErrorNotice, Field, Input, SecondaryButton, Spinner } from "./ui";

export function CardholderSection({ cardId }: { cardId?: string }) {
  const cardholders = useCardholders(cardId);
  const createCardholder = useCreateCardholder(cardId);
  const deleteCardholder = useDeleteCardholder(cardId);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardholderFormValues>({
    resolver: zodResolver(cardholderFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const mutationError =
    createCardholder.error ?? deleteCardholder.error;
  const error =
    formError ?? (mutationError ? getErrorMessage(mutationError) : null);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await createCardholder.mutateAsync({
        name: values.name.trim(),
        phone: values.phone.trim() || undefined,
        email: values.email.trim(),
      });
      reset({ name: "", phone: "", email: "" });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  function handleDelete(cardholderId: string) {
    if (!window.confirm("Remove this cardholder?")) return;
    deleteCardholder.mutate(cardholderId);
  }

  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">Cardholders</h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
              Global List ({cardholders.data?.length ?? 0})
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cardholders are shared across all your cards for attributing and splitting EMIs.
          </p>
        </div>
      </div>

      {error ? <div className="mb-4"><ErrorNotice message={error} /></div> : null}
      {cardholders.isLoading ? (
        <Spinner label="Loading cardholders..." />
      ) : cardholders.data?.length === 0 ? (
        <EmptyState
          title="No cardholders yet"
          description="Add friends, family, or card users to track and split EMI purchases across any card."
        />
      ) : (
        <ul className="mb-6 space-y-2.5">
          {cardholders.data?.map((cardholder) => {
            const initial = cardholder.name.charAt(0).toUpperCase() || "C";
            return (
              <li
                key={cardholder.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{cardholder.name}</p>
                    <p className="text-xs text-zinc-500">
                      {cardholder.email}
                      {cardholder.phone ? ` · ${cardholder.phone}` : ""}
                    </p>
                  </div>
                </div>
                <SecondaryButton
                  type="button"
                  className="px-2.5 py-1 text-xs min-h-[30px] text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(cardholder.id)}
                  disabled={deleteCardholder.isPending}
                >
                  Remove
                </SecondaryButton>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-4 space-y-3">
        <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
          + Add New Cardholder
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Full Name" error={errors.name?.message}>
            <Input placeholder="e.g. Priya Sharma" {...register("name")} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <Input placeholder="+91 98765 43210" {...register("phone")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="priya@example.com" {...register("email")} />
          </Field>
        </div>
        <div>
          <Button type="submit" disabled={isSubmitting || createCardholder.isPending}>
            {isSubmitting || createCardholder.isPending ? "Adding..." : "Add to Global Cardholders"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
