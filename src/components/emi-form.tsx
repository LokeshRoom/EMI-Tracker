"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateEmi, useUpdateEmi } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";
import { currentStartMonth, parseCents } from "@/lib/money";
import { emiFormSchema, type EmiFormValues } from "@/lib/validation";
import type { Cardholder, Emi, EmiInput } from "@/types";
import { Button, ErrorNotice, Field, Input, SecondaryButton, Select } from "./ui";

function toEmiInput(values: EmiFormValues): EmiInput {
  return {
    cardholderId: values.cardholderId,
    merchantName: values.merchantName,
    purchaseDate: values.purchaseDate,
    principalCents: parseCents(values.principalAmount),
    downPaymentCents: parseCents(values.downPayment),
    interestRateAnnualPercent: Number(values.interestRateAnnualPercent),
    tenureMonths: Number(values.tenureMonths),
    startMonth: values.startMonth,
    processingChargeCents: parseCents(values.processingCharge),
    additionalCostCents: parseCents(values.additionalCost),
    additionalCostFrequency: values.additionalCostFrequency,
    status: values.status,
  };
}

function emiToFormValues(emi: Emi): EmiFormValues {
  return {
    cardholderId: emi.cardholderId,
    merchantName: emi.merchantName,
    purchaseDate: emi.purchaseDate,
    principalAmount: (emi.principalCents / 100).toFixed(2),
    downPayment: (emi.downPaymentCents / 100).toFixed(2),
    interestRateAnnualPercent: String(emi.interestRateAnnualPercent),
    tenureMonths: String(emi.tenureMonths),
    startMonth: emi.startMonth,
    processingCharge: (emi.processingChargeCents / 100).toFixed(2),
    additionalCost: (emi.additionalCostCents / 100).toFixed(2),
    additionalCostFrequency: emi.additionalCostFrequency,
    status: emi.status,
  };
}

export function EmiForm({
  cardId,
  cardholders,
  emi,
  cancelHref,
}: {
  cardId: string;
  cardholders: Cardholder[];
  emi?: Emi;
  cancelHref: string;
}) {
  const router = useRouter();
  const createEmi = useCreateEmi(cardId);
  const updateEmi = useUpdateEmi(cardId);
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(emi);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmiFormValues>({
    resolver: zodResolver(emiFormSchema),
    defaultValues: emi
      ? emiToFormValues(emi)
      : {
          cardholderId: cardholders[0]?.id ?? "",
          merchantName: "",
          purchaseDate: new Date().toISOString().slice(0, 10),
          principalAmount: "",
          downPayment: "",
          interestRateAnnualPercent: "",
          tenureMonths: "",
          startMonth: currentStartMonth(),
          processingCharge: "",
          additionalCost: "",
          additionalCostFrequency: "one_time",
          status: "active",
        },
  });

  const isPending = isSubmitting || createEmi.isPending || updateEmi.isPending;
  const mutationError = isEdit ? updateEmi.error : createEmi.error;
  const error = formError ?? (mutationError ? getErrorMessage(mutationError) : null);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const input = toEmiInput(values);
    try {
      if (emi) {
        await updateEmi.mutateAsync({ emiId: emi.id, input });
        router.push(`/cards/${cardId}/emis/${emi.id}`);
      } else {
        const created = await createEmi.mutateAsync(input);
        router.push(`/cards/${cardId}/emis/${created.id}`);
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  if (cardholders.length === 0) {
    return (
      <ErrorNotice message="Add a cardholder before recording an EMI." />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <ErrorNotice message={error} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cardholder" error={errors.cardholderId?.message}>
          <Select {...register("cardholderId")}>
            {cardholders.map((cardholder) => (
              <option key={cardholder.id} value={cardholder.id}>
                {cardholder.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Merchant name" error={errors.merchantName?.message}>
          <Input {...register("merchantName")} />
        </Field>
        <Field label="Purchase date" error={errors.purchaseDate?.message}>
          <Input type="date" {...register("purchaseDate")} />
        </Field>
        <Field label="Start month" error={errors.startMonth?.message}>
          <Input type="month" {...register("startMonth")} />
        </Field>
        <Field label="Principal amount" error={errors.principalAmount?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("principalAmount")} />
        </Field>
        <Field label="Down payment" error={errors.downPayment?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("downPayment")} />
        </Field>
        <Field label="Annual interest rate %" error={errors.interestRateAnnualPercent?.message}>
          <Input inputMode="decimal" placeholder="18.5" {...register("interestRateAnnualPercent")} />
        </Field>
        <Field label="Tenure months" error={errors.tenureMonths?.message}>
          <Input inputMode="numeric" placeholder="12" {...register("tenureMonths")} />
        </Field>
        <Field label="Initial processing charge" error={errors.processingCharge?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("processingCharge")} />
        </Field>
        <Field label="Additional fixed cost" error={errors.additionalCost?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("additionalCost")} />
        </Field>
        <Field label="Additional cost frequency" error={errors.additionalCostFrequency?.message}>
          <Select {...register("additionalCostFrequency")}>
            <option value="one_time">One-time</option>
            <option value="monthly">Monthly</option>
          </Select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </Select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save EMI" : "Create EMI"}
        </Button>
        <SecondaryButton type="button" onClick={() => router.push(cancelHref)}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
}
