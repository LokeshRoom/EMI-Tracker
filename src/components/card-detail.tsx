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
import { useAccessLog, useCard, useDeleteCard } from "@/hooks/useCards";
import { useAuth } from "@/hooks/useAuth";
import { useCardholders } from "@/hooks/useCardholders";
import { useEmis } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";
import { calculateEmi, getEmiCardholderSplits } from "@/lib/emi";
import { formatCents } from "@/lib/money";
import type { Timestamp } from "firebase/firestore";

function shortUid(uid: string) {
  return uid.length > 8 ? `${uid.slice(0, 6)}…${uid.slice(-2)}` : uid;
}

function formatEntryDate(at?: Timestamp | null) {
  if (!at) return "";
  return new Date(at.toDate()).toLocaleDateString();
}

export default function CardDetail() {
  const params = useParams<{ cardId: string }>();
  const router = useRouter();
  const cardId = params.cardId;
  const card = useCard(cardId);
  const cardholders = useCardholders(cardId);
  const emis = useEmis(cardId);
  const deleteCard = useDeleteCard();
  const auth = useAuth();
  const accessLog = useAccessLog(cardId);
  const currentUid = auth.status === "authenticated" ? auth.user.uid : undefined;
  const entries = accessLog.data ?? [];

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
        <Link href="/cards" className="text-sm font-medium text-slate-300 underline transition-colors duration-200 hover:text-white cursor-pointer">
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
    cardMonthlyTotalCents += calc.monthlyPaymentWithGstCents;
    const splits = getEmiCardholderSplits(emi, calc.monthlyPaymentWithGstCents, calc.totalUpfrontFeeCents);
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
        description={
          `Ends ${currentCard.last4} · ${currentCard.currency}` +
            (currentCard.cardOwner ? ` · Owner: ${currentCard.cardOwner}` : "") +
            (currentUid && currentCard.userIds.includes(currentUid) ? " · You are authorized" : "") +
            ((currentCard.userIds.length - 1) > 0 ? ` · Shared with ${currentCard.userIds.length - 1}` : "")
        }
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
          <p className="text-xs sm:text-sm font-medium text-slate-400">Card Owner</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-slate-100 truncate">
            {currentCard.cardOwner || "Self"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-slate-400">Outstanding</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-slate-100 tabular-nums">
            {formatCents(currentCard.outstandingBalanceCents, currentCard.currency)}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-slate-400">Credit Limit</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-slate-300 tabular-nums">
            {currentCard.creditLimitCents !== undefined
              ? formatCents(currentCard.creditLimitCents, currentCard.currency)
              : "Not set"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-slate-400">Payment Due Day</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-slate-300">
            {currentCard.paymentDueDay ? `${currentCard.paymentDueDay}th of month` : "Not set"}
          </p>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-100">EMIs</h2>
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
                <div className="mb-4 rounded-xl bg-gradient-to-br from-violet-600/25 via-slate-950/40 to-slate-950/70 border border-white/15 p-3.5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider">
                        Total Monthly Outflow
                      </span>
                      <span className="text-xs text-slate-400">
                        ({activeEmis.length} active {activeEmis.length === 1 ? "EMI" : "EMIs"})
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-white tabular-nums mt-0.5">
                      {formatCents(cardMonthlyTotalCents, currentCard.currency)}
                      <span className="text-xs font-normal text-slate-400 ml-1">/ month</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(cardholderCardTotals.entries()).map(([chId, amt]) => {
                      const ch = cardholders.data?.find((c) => c.id === chId);
                      return (
                        <span
                          key={chId}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-white/15 backdrop-blur-md tabular-nums"
                        >
                          <span className="text-slate-400 font-medium">{ch?.name ?? "Cardholder"}:</span>
                          <span className="text-violet-300">{formatCents(amt, currentCard.currency)}/mo</span>
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
                      className="rounded-xl border border-white/15 bg-white/8 p-3.5 backdrop-blur-md transition-colors duration-200 hover:border-violet-400/40"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <Link
                            href={`/cards/${currentCard.id}/emis/${emi.id}`}
                            className="text-sm font-bold text-slate-100 underline-offset-2 hover:text-violet-300 transition-colors duration-200 cursor-pointer"
                          >
                            {emi.merchantName}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {cardholder?.name ?? "Unknown cardholder"} · {emi.tenureMonths} months
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="text-right">
                            <span className="font-bold text-slate-100 tabular-nums">
                              {formatCents(calculation.monthlyPaymentWithGstCents, currentCard.currency)} / month
                            </span>
                            {calculation.totalUpfrontFeeCents > 0 ? (
                              <p className="text-[11px] font-semibold text-amber-300 tabular-nums">
                                1st mo: {formatCents(calculation.firstMonthPaymentCents, currentCard.currency)}
                              </p>
                            ) : null}
                          </div>
                          <Badge>{emi.status}</Badge>
                        </div>
                      </div>

                      {/* Per-EMI Split Breakdown Chips */}
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                          Split:
                        </span>
                        {getEmiCardholderSplits(emi, calculation.monthlyPaymentWithGstCents, calculation.totalUpfrontFeeCents).map((split) => {
                          const chName = cardholders.data?.find((c) => c.id === split.cardholderId)?.name ?? "Cardholder";
                          return (
                            <span
                              key={split.cardholderId}
                              className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-violet-400/20 tabular-nums backdrop-blur-md"
                            >
                              <span className="text-slate-400 font-medium">{chName}:</span>
                              {split.upfrontFeeCents > 0 ? (
                                <>
                                  <span className="text-violet-200 font-bold">1st mo: {formatCents(split.firstMonthPaymentCents, currentCard.currency)}</span>
                                  <span className="text-slate-400 font-normal">({formatCents(split.monthlyEmiCents, currentCard.currency)}/mo)</span>
                                </>
                              ) : (
                                <span>{formatCents(split.monthlyEmiCents, currentCard.currency)}/mo</span>
                              )}
                              <span className="text-violet-400 font-normal">({split.percentage}%)</span>
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
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Access history</h2>
            <p className="text-xs text-slate-500">Append-only log of shared-access changes</p>
          </div>
          {accessLog.isLoading ? (
            <Spinner label="Loading access history..." />
          ) : accessLog.error ? (
            <ErrorNotice message={getErrorMessage(accessLog.error)} />
          ) : entries.length === 0 ? (
            <EmptyState
              title="No access changes yet"
              description="Changes to shared access are recorded here."
            />
          ) : (
            <ul className="space-y-2">
              {entries.slice(0, 10).map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge>{entry.action === "added" ? "Added" : "Removed"}</Badge>
                  <span className="font-mono text-xs text-slate-400">{shortUid(entry.grantedUid)}</span>
                  <span className="text-xs text-slate-500">
                    by {entry.byUid === currentUid ? "you" : shortUid(entry.byUid)} · {formatEntryDate(entry.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <CardholderSection cardId={currentCard.id} />
      </div>
    </div>
  );
}
