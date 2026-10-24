"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateEmi, useUpdateEmi } from "@/hooks/useEmis";
import { calculateEmi } from "@/lib/emi";
import { getErrorMessage } from "@/lib/firebase";
import { currentStartMonth, formatCents, parseCents } from "@/lib/money";
import { emiFormSchema, type EmiFormValues } from "@/lib/validation";
import type { Cardholder, Emi, EmiInput, EmiSplit } from "@/types";
import { Badge, Button, Card, ErrorNotice, Field, Input, SecondaryButton, Select, StatCard } from "./ui";

function toEmiInput(values: EmiFormValues, isSplit: boolean, splits: EmiSplit[]): EmiInput {
  const paidCount = values.paidInstallmentsCount?.trim()
    ? Number(values.paidInstallmentsCount.trim())
    : 0;

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
    paidInstallmentsCount: paidCount > 0 ? paidCount : undefined,
    splits: isSplit && splits.length > 0 ? splits : undefined,
  };
}

function emiToFormValues(emi: Emi): EmiFormValues {
  return {
    cardholderId: emi.cardholderId,
    merchantName: emi.merchantName,
    purchaseDate: emi.purchaseDate,
    principalAmount: (emi.principalCents / 100).toFixed(2),
    downPayment: emi.downPaymentCents > 0 ? (emi.downPaymentCents / 100).toFixed(2) : "",
    interestRateAnnualPercent: String(emi.interestRateAnnualPercent),
    tenureMonths: String(emi.tenureMonths),
    startMonth: emi.startMonth,
    processingCharge:
      emi.processingChargeCents > 0 ? (emi.processingChargeCents / 100).toFixed(2) : "",
    additionalCost:
      emi.additionalCostCents > 0 ? (emi.additionalCostCents / 100).toFixed(2) : "",
    additionalCostFrequency: emi.additionalCostFrequency,
    status: emi.status,
    paidInstallmentsCount:
      emi.paidInstallmentsCount !== undefined && emi.paidInstallmentsCount > 0
        ? String(emi.paidInstallmentsCount)
        : "",
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

  // Split state
  const initialSplits = emi?.splits && emi.splits.length > 0 ? emi.splits : [];
  const [isSplit, setIsSplit] = useState(initialSplits.length > 0);
  const [splits, setSplits] = useState<EmiSplit[]>(
    initialSplits.length > 0
      ? initialSplits
      : cardholders.slice(0, 2).map((c, _, arr) => ({
          cardholderId: c.id,
          percentage: Number((100 / arr.length).toFixed(2)),
        }))
  );

  const {
    register,
    handleSubmit,
    watch,
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
          paidInstallmentsCount: "",
        },
  });

  const isPending = isSubmitting || createEmi.isPending || updateEmi.isPending;
  const mutationError = isEdit ? updateEmi.error : createEmi.error;
  const error = formError ?? (mutationError ? getErrorMessage(mutationError) : null);

  // Watch inputs for dynamic live preview calculation
  const watchedValues = watch();

  const previewCalculation = useMemo(() => {
    try {
      const principalCents = parseCents(watchedValues.principalAmount || "0");
      const rate = Number(watchedValues.interestRateAnnualPercent || "0");
      const tenure = Number(watchedValues.tenureMonths || "0");
      if (principalCents <= 0 || tenure <= 0) return null;

      const paidCount = watchedValues.paidInstallmentsCount?.trim()
        ? Number(watchedValues.paidInstallmentsCount.trim())
        : 0;

      return calculateEmi({
        principalCents,
        annualInterestRatePercent: Number.isFinite(rate) ? rate : 0,
        tenureMonths: Number.isFinite(tenure) ? tenure : 0,
        startMonth: watchedValues.startMonth || currentStartMonth(),
        downPaymentCents: parseCents(watchedValues.downPayment || "0"),
        processingChargeCents: parseCents(watchedValues.processingCharge || "0"),
        additionalCostCents: parseCents(watchedValues.additionalCost || "0"),
        additionalCostFrequency: watchedValues.additionalCostFrequency ?? "one_time",
        paidInstallmentsCount: Number.isFinite(paidCount) ? paidCount : 0,
        splits: isSplit ? splits : undefined,
      });
    } catch {
      return null;
    }
  }, [watchedValues, isSplit, splits]);

  function handleAddSplit() {
    const unpicked = cardholders.find((c) => !splits.some((s) => s.cardholderId === c.id));
    const cardholderId = unpicked?.id ?? cardholders[0]?.id;
    if (!cardholderId) return;
    const newSplits = [...splits, { cardholderId, percentage: 0 }];
    setSplits(newSplits);
  }

  function handleRemoveSplit(index: number) {
    if (splits.length <= 1) return;
    setSplits(splits.filter((_, i) => i !== index));
  }

  function handleSplitEqually() {
    if (splits.length === 0) return;
    const share = Number((100 / splits.length).toFixed(2));
    const remainder = Number((100 - share * splits.length).toFixed(2));
    setSplits(
      splits.map((s, i) => ({
        ...s,
        percentage: i === 0 ? Number((share + remainder).toFixed(2)) : share,
      }))
    );
  }

  function handleUpdateSplit(index: number, patch: Partial<EmiSplit>) {
    setSplits(
      splits.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  const totalSplitPercent = useMemo(
    () => splits.reduce((sum, s) => sum + (Number(s.percentage) || 0), 0),
    [splits]
  );

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    if (isSplit) {
      if (splits.length === 0) {
        setFormError("Add at least one cardholder to split with.");
        return;
      }
      if (Math.abs(totalSplitPercent - 100) > 0.05) {
        setFormError(`Split percentages must total exactly 100%. Current total: ${totalSplitPercent}%`);
        return;
      }
    }

    const input = toEmiInput(values, isSplit, splits);
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
    return <ErrorNotice message="Add a cardholder before recording an EMI." />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? <ErrorNotice message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary Cardholder" error={errors.cardholderId?.message}>
          <Select {...register("cardholderId")}>
            {cardholders.map((cardholder) => (
              <option key={cardholder.id} value={cardholder.id}>
                {cardholder.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Merchant name" error={errors.merchantName?.message}>
          <Input {...register("merchantName")} placeholder="e.g. Amazon, Apple" />
        </Field>
        <Field label="Purchase date" error={errors.purchaseDate?.message}>
          <Input type="date" {...register("purchaseDate")} />
        </Field>
        <Field label="Start month (past, current, or future)" error={errors.startMonth?.message}>
          <Input type="month" {...register("startMonth")} />
        </Field>
        <Field label="Principal amount" error={errors.principalAmount?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("principalAmount")} />
        </Field>
        <Field label="Down payment (optional)" error={errors.downPayment?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("downPayment")} />
        </Field>
        <Field label="Annual interest rate %" error={errors.interestRateAnnualPercent?.message}>
          <Input inputMode="decimal" placeholder="18.5" {...register("interestRateAnnualPercent")} />
        </Field>
        <Field label="Tenure months" error={errors.tenureMonths?.message}>
          <Input inputMode="numeric" placeholder="12" {...register("tenureMonths")} />
        </Field>
        <Field label="Initial processing charge (optional)" error={errors.processingCharge?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register("processingCharge")} />
        </Field>
        <Field label="Additional fixed cost (optional)" error={errors.additionalCost?.message}>
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

      {/* Already Running EMI Section */}
      <div className="rounded-xl border border-white/15 bg-slate-950/60 p-4 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-slate-100">Already Running / Existing EMI</h3>
        <p className="mt-1 text-xs text-slate-400">
          If this EMI has already been active for some months, specify how many monthly installments have already been paid.
        </p>
        <div className="mt-3 max-w-xs">
          <Field label="Installments already paid (optional)" error={errors.paidInstallmentsCount?.message}>
            <Input
              inputMode="numeric"
              placeholder="0"
              {...register("paidInstallmentsCount")}
            />
          </Field>
        </div>
      </div>

      {/* EMI Splitting Section */}
      <div className="rounded-xl border border-white/15 bg-slate-950/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Split EMI Between Cardholders</h3>
            <p className="mt-1 text-xs text-slate-400">
              Divide monthly payments and total outlay across multiple cardholders.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-300">
            <input
              type="checkbox"
              checked={isSplit}
              onChange={(e) => setIsSplit(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-slate-950 text-violet-400 focus:ring-amber-400/30"
            />
            Enable Split
          </label>
        </div>

        {isSplit ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Cardholder & Share %</span>
              <div className="flex items-center gap-3">
                <span className={Math.abs(totalSplitPercent - 100) < 0.05 ? "font-semibold text-emerald-400" : "font-semibold text-amber-400"}>
                  Total: {totalSplitPercent.toFixed(1)}%
                </span>
                <button
                  type="button"
                  onClick={handleSplitEqually}
                  className="rounded border border-white/20 bg-slate-950 px-2 py-0.5 text-xs text-slate-300 transition-colors duration-200 hover:bg-white/10 cursor-pointer"
                >
                  Split Equally
                </button>
              </div>
            </div>

            {splits.map((split, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={split.cardholderId}
                  onChange={(e) => handleUpdateSplit(index, { cardholderId: e.target.value })}
                  className="flex-1 rounded-md border border-white/20 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 focus:border-amber-400/70"
                >
                  {cardholders.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={split.percentage}
                    onChange={(e) => handleUpdateSplit(index, { percentage: Number(e.target.value) })}
                    className="w-20 rounded-md border border-white/20 bg-slate-950 px-2 py-1.5 text-sm text-right text-slate-100 focus:border-amber-400/70"
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                {splits.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveSplit(index)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ))}

            {cardholders.length > splits.length ? (
              <button
                type="button"
                onClick={handleAddSplit}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                + Add another cardholder to split
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Dynamic Live Calculation Preview */}
      {previewCalculation ? (
        <Card className="border-violet-400/25 bg-violet-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Live Calculation Preview</h3>
            <Badge variant="purple">Dynamic Preview</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Monthly EMI"
              value={formatCents(previewCalculation.emiCents)}
              hint={`${watchedValues.tenureMonths || 0} months tenure`}
            />
            <StatCard
              label="Total Interest"
              value={formatCents(previewCalculation.totalInterestCents)}
            />
            <StatCard
              label="Total GST"
              value={formatCents(previewCalculation.totalGstCents)}
            />
            <StatCard
              label="Total Outlay"
              value={formatCents(previewCalculation.totalOutlayCents)}
            />
          </div>

          {previewCalculation.paidInstallmentsCount > 0 ? (
            <div className="mt-3 rounded-md bg-slate-950/60 p-3 text-xs text-slate-400 border border-white/15 backdrop-blur-md">
              <span className="font-semibold text-emerald-400">Running EMI Status: </span>
              {previewCalculation.paidInstallmentsCount} of {watchedValues.tenureMonths} installments already paid.
              Remaining Principal: <span className="font-medium text-slate-100 tabular-nums">{formatCents(previewCalculation.remainingPrincipalBalanceCents)}</span> |
              Remaining Outlay: <span className="font-medium text-slate-100 tabular-nums">{formatCents(previewCalculation.remainingOutlayCents)}</span>
            </div>
          ) : null}

          {isSplit && previewCalculation.splits.length > 0 ? (
            <div className="mt-4 rounded-md bg-slate-950/60 p-3 border border-white/15 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cardholder Split Breakdown
              </p>
              <div className="mt-2 divide-y divide-white/10 text-xs">
                {previewCalculation.splits.map((s) => {
                  const ch = cardholders.find((c) => c.id === s.cardholderId);
                  return (
                    <div key={s.cardholderId} className="flex items-center justify-between py-1.5">
                      <span className="font-medium text-slate-200">
                        {ch?.name ?? "Cardholder"} ({s.percentage}%)
                      </span>
                      <div className="flex gap-4">
                        <span className="text-slate-400">
                          Monthly: <strong className="text-slate-100 tabular-nums">{formatCents(s.monthlyEmiCents)}</strong>
                        </span>
                        <span className="text-slate-400">
                          Total Outlay: <strong className="text-slate-100 tabular-nums">{formatCents(s.totalOutlayCents)}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

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
