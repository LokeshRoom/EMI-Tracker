"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCardholders, useCreateCardholder, useDeleteCardholder } from "@/hooks/useCardholders";
import { useDashboard } from "@/hooks/useDashboard";
import { getEmiCardholderSplits } from "@/lib/emi";
import { getErrorMessage } from "@/lib/firebase";
import { formatCents } from "@/lib/money";
import { cardholderFormSchema, type CardholderFormValues } from "@/lib/validation";
import { Button, Card, EmptyState, ErrorNotice, Field, Input, SecondaryButton, Spinner } from "./ui";

export function CardholderSection({ cardId }: { cardId?: string }) {
  const cardholders = useCardholders(cardId);
  const createCardholder = useCreateCardholder(cardId);
  const deleteCardholder = useDeleteCardholder(cardId);
  const dashboard = useDashboard();
  const [formError, setFormError] = useState<string | null>(null);

  // Compute active monthly commitment per cardholder across all active EMIs
  const activeEmis = dashboard.data?.activeEmis ?? [];
  const calcMap = new Map((dashboard.data?.calculations ?? []).map((c) => [c.emi.id, c.calculation]));
  const cardholderMonthlyMap = new Map<string, { totalCents: number; count: number }>();

  activeEmis.forEach(({ emi }) => {
    const calc = calcMap.get(emi.id);
    if (!calc) return;
    const splits = getEmiCardholderSplits(emi, calc.monthlyPaymentWithGstCents, calc.totalUpfrontFeeCents);
    splits.forEach((s) => {
      const prev = cardholderMonthlyMap.get(s.cardholderId) ?? { totalCents: 0, count: 0 };
      prev.totalCents += s.monthlyEmiCents;
      prev.count += 1;
      cardholderMonthlyMap.set(s.cardholderId, prev);
    });
  });

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

      {/* Total Monthly Commitments Banner */}
      {dashboard.data && dashboard.data.monthlyCommitmentCents > 0 ? (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100/60 border border-indigo-200/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Total Monthly Split Commitments
            </p>
            <p className="text-lg font-extrabold text-zinc-950 tabular-nums mt-0.5">
              {formatCents(dashboard.data.monthlyCommitmentCents)}
              <span className="text-xs font-normal text-zinc-500 ml-1">/ month across all active EMIs</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 self-start sm:self-auto bg-white/80 px-2.5 py-1 rounded-lg border border-indigo-200/60">
            {activeEmis.length} active {activeEmis.length === 1 ? "EMI" : "EMIs"}
          </span>
        </div>
      ) : null}

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
            const activeStats = cardholderMonthlyMap.get(cardholder.id);
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-zinc-900">{cardholder.name}</p>
                      {activeStats && activeStats.totalCents > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100 tabular-nums">
                          {formatCents(activeStats.totalCents)} / mo
                          <span className="text-[10px] font-normal text-emerald-600 ml-1">
                            ({activeStats.count} {activeStats.count === 1 ? "EMI" : "EMIs"})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-zinc-400">
                          (No active EMIs)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
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
