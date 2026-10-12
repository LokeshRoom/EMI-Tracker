"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateCard, useUpdateCard } from "@/hooks/useCards";
import { getErrorMessage } from "@/lib/firebase";
import { parseCents } from "@/lib/money";
import { cardFormSchema, type CardFormValues } from "@/lib/validation";
import type { Card, CardInput } from "@/types";
import { Button, ErrorNotice, Field, Input, SecondaryButton, Select } from "./ui";

function toCardInput(values: CardFormValues): CardInput {
  const creditLimit = values.creditLimit.trim();
  const paymentDueDay = values.paymentDueDay.trim();
  const cardOwner = values.cardOwner.trim();
  return {
    bankName: values.bankName,
    cardLabel: values.cardLabel,
    last4: values.last4,
    currency: values.currency,
    cardOwner: cardOwner || undefined,
    creditLimitCents: creditLimit ? parseCents(creditLimit) : undefined,
    outstandingBalanceCents: parseCents(values.outstandingBalance || "0"),
    paymentDueDay: paymentDueDay ? Number(paymentDueDay) : undefined,
    authorizedUserIds: values.authorizedUserIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  };
}

function cardToFormValues(card: Card): CardFormValues {
  return {
    bankName: card.bankName,
    cardLabel: card.cardLabel,
    last4: card.last4,
    currency: card.currency,
    cardOwner: card.cardOwner ?? "",
    creditLimit:
      card.creditLimitCents !== undefined
        ? (card.creditLimitCents / 100).toFixed(2)
        : "",
    outstandingBalance:
      card.outstandingBalanceCents > 0
        ? (card.outstandingBalanceCents / 100).toFixed(2)
        : "",
    paymentDueDay: card.paymentDueDay !== undefined ? String(card.paymentDueDay) : "",
    authorizedUserIds: card.userIds
      .filter((uid) => uid !== card.ownerUid)
      .join(", "),
  };
}

export function CardForm({
  card,
  cancelHref,
}: {
  card?: Card;
  cancelHref: string;
}) {
  const router = useRouter();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(card);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: card
      ? cardToFormValues(card)
      : {
          bankName: "",
          cardLabel: "",
          last4: "",
          currency: "INR",
          cardOwner: "",
          creditLimit: "",
          outstandingBalance: "",
          paymentDueDay: "",
          authorizedUserIds: "",
        },
  });

  const isPending = isSubmitting || createCard.isPending || updateCard.isPending;
  const mutationError = isEdit ? updateCard.error : createCard.error;
  const error = formError ?? (mutationError ? getErrorMessage(mutationError) : null);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const input = toCardInput(values);
    try {
      if (card) {
        await updateCard.mutateAsync({ cardId: card.id, input });
        router.push(`/cards/${card.id}`);
      } else {
        const created = await createCard.mutateAsync(input);
        router.push(`/cards/${created.id}`);
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <ErrorNotice message={error} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bank name" error={errors.bankName?.message}>
          <Input placeholder="e.g. HDFC Bank, ICICI, SBI" {...register("bankName")} />
        </Field>
        <Field label="Card label" error={errors.cardLabel?.message}>
          <Input placeholder="e.g. Regalia Gold, Sapphiro" {...register("cardLabel")} />
        </Field>
        <Field label="Card Owner (e.g. Self, Spouse, Dad)" error={errors.cardOwner?.message}>
          <Input placeholder="e.g. Lokesh (Self), Dad, Business" {...register("cardOwner")} />
        </Field>
        <Field label="Last 4 digits" error={errors.last4?.message}>
          <Input inputMode="numeric" maxLength={4} placeholder="e.g. 4321" {...register("last4")} />
        </Field>
        <Field label="Currency" error={errors.currency?.message}>
          <Select {...register("currency")}>
            <option value="INR">INR (₹) - Indian Rupee</option>
          </Select>
        </Field>
        <Field label="Credit limit (optional)" error={errors.creditLimit?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("creditLimit")} />
        </Field>
        <Field label="Outstanding balance (optional, defaults to 0)" error={errors.outstandingBalance?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("outstandingBalance")} />
        </Field>
        <Field label="Payment due day of month (1–31, optional)" error={errors.paymentDueDay?.message}>
          <Input inputMode="numeric" placeholder="e.g. 15" maxLength={2} {...register("paymentDueDay")} />
        </Field>
      </div>
      <Field label="Authorized Firebase UIDs (optional)" error={errors.authorizedUserIds?.message}>
        <Input
          placeholder="uid1, uid2"
          {...register("authorizedUserIds")}
        />
      </Field>
      <p className="text-xs text-zinc-500">
        Only card label and last 4 digits are stored. Full card number, CVV, PIN,
        and card verification code are not stored.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save card"
              : "Create card"}
        </Button>
        <SecondaryButton type="button" onClick={() => router.push(cancelHref)}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
}
