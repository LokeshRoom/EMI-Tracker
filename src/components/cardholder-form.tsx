"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCardholders, useCreateCardholder, useDeleteCardholder } from "@/hooks/useCardholders";
import { getErrorMessage } from "@/lib/firebase";
import { cardholderFormSchema, type CardholderFormValues } from "@/lib/validation";
import { Button, Card, EmptyState, ErrorNotice, Field, Input, SecondaryButton, Spinner } from "./ui";

export function CardholderSection({ cardId }: { cardId: string }) {
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
        name: values.name,
        phone: values.phone || undefined,
        email: values.email || undefined,
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
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Cardholders</h2>
      {error ? <div className="mb-4"><ErrorNotice message={error} /></div> : null}
      {cardholders.isLoading ? (
        <Spinner />
      ) : cardholders.data?.length === 0 ? (
        <EmptyState
          title="No cardholders yet"
          description="Add the people who use this card, then link them to EMI purchases."
        />
      ) : (
        <ul className="mb-6 space-y-3">
          {cardholders.data?.map((cardholder) => (
            <li
              key={cardholder.id}
              className="flex flex-col gap-2 rounded-md border border-zinc-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{cardholder.name}</p>
                {cardholder.phone || cardholder.email ? (
                  <p className="text-xs text-zinc-500">
                    {[cardholder.phone, cardholder.email].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </div>
              <SecondaryButton
                type="button"
                onClick={() => handleDelete(cardholder.id)}
                disabled={deleteCardholder.isPending}
              >
                Remove
              </SecondaryButton>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </Field>
        <Field label="Email (optional)" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <div className="sm:col-span-3">
          <Button type="submit" disabled={isSubmitting || createCardholder.isPending}>
            {isSubmitting || createCardholder.isPending
              ? "Adding..."
              : "Add cardholder"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
