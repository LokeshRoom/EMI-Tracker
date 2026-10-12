"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CardholderSection } from "@/components/cardholder-form";
import {
  Badge,
  Button,
  Card,
  DangerButton,
  EmptyState,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
} from "@/components/ui";
import { useCard, useDeleteCard } from "@/hooks/useCards";
import { useCardholders } from "@/hooks/useCardholders";
import { useEmis } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";
import { calculateEmi, getEmiCardholderSplits } from "@/lib/emi";
import { formatCents } from "@/lib/money";

export default function CardDetail() {
  const params = useParams<{ cardId: string }>();
  const router = useRouter();
  const cardId = params.cardId;
  const card = useCard(cardId);
  const cardholders = useCardholders(cardId);
  const emis = useEmis(cardId);
  const deleteCard = useDeleteCard();

  if (!cardId) {
    return <Spinner label="Loading card..." />;
  }

  if (card.isLoading) {
    return <Spinner label="Loading card..." />;
  }

  if (card.error || !card.data) {
    return (
      <div className="space-y-4">
        <ErrorNotice
          message={card.error ? getErrorMessage(card.error) : "Card not found."}
        />
        <Link href="/cards" className="text-sm font-medium text-zinc-700 underline">
          Back to cards
        </Link>
      </div>
    );
  }

  const currentCard = card.data;

  // Calculate card-level active monthly commitments and per-cardholder breakdown
  const activeEmis = (emis.data ?? []).filter((e) => e.status === "active");
  const cardholderCardTotals = new Map<string, number>();
  let cardMonthlyTotalCents = 0;

  activeEmis.forEach((emi) => {
    const calc = calculateEmi({
      principalCents: emi.principalCents,
      annualInterestRatePercent: emi.interestRateAnnualPercent,
      tenureMonths: emi.tenureMonths,
      startMonth: emi.startMonth,
      downPaymentCents: emi.downPaymentCents,
      processingChargeCents: emi.processingChargeCents,
      additionalCostCents: emi.additionalCostCents,
      additionalCostFrequency: emi.additionalCostFrequency,
      paidInstallmentsCount: emi.paidInstallmentsCount,
      splits: emi.splits,
    });
    cardMonthlyTotalCents += calc.emiCents;
    const splits = getEmiCardholderSplits(emi, calc.emiCents);
    splits.forEach((s) => {
      const prev = cardholderCardTotals.get(s.cardholderId) ?? 0;
      cardholderCardTotals.set(s.cardholderId, prev + s.monthlyEmiCents);
    });
  });

  function handleDelete() {
    if (!window.confirm("Delete this card and all of its EMIs/cardholders?")) return;
    deleteCard.mutate(currentCard.id, {
      onSuccess: () => router.push("/cards"),
    });
  }

  return (
    <div>
      <PageHeader
        title={`${currentCard.bankName} · ${currentCard.cardLabel}`}
        description={`Ends ${currentCard.last4} · ${currentCard.currency}${currentCard.cardOwner ? ` · Owner: ${currentCard.cardOwner}` : ""}`}
        actions={
          <>
            <Link href={`/cards/${currentCard.id}/edit`}>
              <SecondaryButton type="button">
                Edit card
              </SecondaryButton>
            </Link>
            <DangerButton
              type="button"
              onClick={handleDelete}
              disabled={deleteCard.isPending}
            >
              {deleteCard.isPending ? "Deleting..." : "Delete card"}
            </DangerButton>
          </>
        }
      />
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Card Owner</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-zinc-900 truncate">
            {currentCard.cardOwner || "Self"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Outstanding</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-zinc-900 tabular-nums">
            {formatCents(currentCard.outstandingBalanceCents, currentCard.currency)}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Credit Limit</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-zinc-900 tabular-nums">
            {currentCard.creditLimitCents !== undefined
              ? formatCents(currentCard.creditLimitCents, currentCard.currency)
              : "Not set"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Payment Due Day</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-zinc-900">
            {currentCard.paymentDueDay ? `${currentCard.paymentDueDay}th of month` : "Not set"}
          </p>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">EMIs</h2>
            <Link href={`/cards/${currentCard.id}/emis/new`}>
              <Button type="button">Add EMI</Button>
            </Link>
          </div>
          {emis.isLoading ? (
            <Spinner label="Loading EMIs..." />
          ) : emis.error ? (
            <ErrorNotice message={getErrorMessage(emis.error)} />
          ) : emis.data?.length === 0 ? (
            <EmptyState
              title="No EMIs yet"
              description="Record an EMI purchase to see its schedule and total cost."
            />
          ) : (
            <div>
              {/* Card Monthly Payment & Split Breakdown Header */}
              {activeEmis.length > 0 ? (
                <div className="mb-4 rounded-xl bg-indigo-50/70 border border-indigo-100 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                        Total Monthly Outflow
                      </span>
                      <span className="text-xs text-indigo-600/80">
                        ({activeEmis.length} active {activeEmis.length === 1 ? "EMI" : "EMIs"})
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-zinc-950 tabular-nums mt-0.5">
                      {formatCents(cardMonthlyTotalCents, currentCard.currency)}
                      <span className="text-xs font-normal text-zinc-500 ml-1">/ month</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(cardholderCardTotals.entries()).map(([chId, amt]) => {
                      const ch = cardholders.data?.find((c) => c.id === chId);
                      return (
                        <span
                          key={chId}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 border border-zinc-200/90 shadow-2xs tabular-nums"
                        >
                          <span className="text-zinc-500 font-medium">{ch?.name ?? "Cardholder"}:</span>
                          <span className="text-indigo-700">{formatCents(amt, currentCard.currency)}/mo</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <ul className="space-y-3">
                {emis.data?.map((emi) => {
                  const cardholder = cardholders.data?.find(
                    (item) => item.id === emi.cardholderId
                  );
                  const calculation = calculateEmi({
                    principalCents: emi.principalCents,
                    annualInterestRatePercent: emi.interestRateAnnualPercent,
                    tenureMonths: emi.tenureMonths,
                    startMonth: emi.startMonth,
                    downPaymentCents: emi.downPaymentCents,
                    processingChargeCents: emi.processingChargeCents,
                    additionalCostCents: emi.additionalCostCents,
                    additionalCostFrequency: emi.additionalCostFrequency,
                    paidInstallmentsCount: emi.paidInstallmentsCount,
                    splits: emi.splits,
                  });
                  return (
                    <li
                      key={emi.id}
                      className="rounded-xl border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-300"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <Link
                            href={`/cards/${currentCard.id}/emis/${emi.id}`}
                            className="text-sm font-bold text-zinc-900 underline-offset-2 hover:underline hover:text-indigo-600"
                          >
                            {emi.merchantName}
                          </Link>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {cardholder?.name ?? "Unknown cardholder"} · {emi.tenureMonths} months
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-bold text-zinc-900 tabular-nums">
                            {formatCents(calculation.emiCents, currentCard.currency)} / month
                          </span>
                          <Badge>{emi.status}</Badge>
                        </div>
                      </div>

                      {/* Per-EMI Split Breakdown Chips */}
                      <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                          Split:
                        </span>
                        {getEmiCardholderSplits(emi, calculation.emiCents).map((split) => {
                          const chName = cardholders.data?.find((c) => c.id === split.cardholderId)?.name ?? "Cardholder";
                          return (
                            <span
                              key={split.cardholderId}
                              className="inline-flex items-center gap-1 rounded-md bg-indigo-50/90 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100 tabular-nums"
                            >
                              <span className="text-zinc-600 font-medium">{chName}:</span>
                              <span>{formatCents(split.monthlyEmiCents, currentCard.currency)}</span>
                              <span className="text-indigo-500 font-normal">({split.percentage}%)</span>
                            </span>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Card>
        <CardholderSection cardId={currentCard.id} />
      </div>
    </div>
  );
}
