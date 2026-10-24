"use client";

import Link from "next/link";
import {
  Button,
  Card,
  EmptyState,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
  StatCard,
} from "@/components/ui";
import { useCardholders } from "@/hooks/useCardholders";
import { useDashboard } from "@/hooks/useDashboard";
import { getEmiCardholderSplits } from "@/lib/emi";
import { getErrorMessage } from "@/lib/firebase";
import { formatCents } from "@/lib/money";

export default function DashboardPage() {
  const dashboard = useDashboard();
  const cardholders = useCardholders();

  if (dashboard.isLoading) {
    return <Spinner label="Loading dashboard..." />;
  }

  if (dashboard.error) {
    return <ErrorNotice message={getErrorMessage(dashboard.error)} />;
  }

  const data = dashboard.data;
  if (!data) return null;

  // Build a lookup map for calculated values (paid installments, emiCents)
  const calcMap = new Map(data.calculations.map((c) => [c.emi.id, c.calculation]));
  const cardholderMap = new Map((cardholders.data ?? []).map((ch) => [ch.id, ch.name]));

  // Aggregate monthly amounts per cardholder across active EMIs
  const cardholderTotals = new Map<string, { monthlyCents: number; activeEmiCount: number }>();
  data.activeEmis.forEach(({ emi }) => {
    const calc = calcMap.get(emi.id);
    if (!calc) return;
    const splits = getEmiCardholderSplits(emi, calc.monthlyPaymentWithGstCents, calc.totalUpfrontFeeCents);
    splits.forEach((s) => {
      const existing = cardholderTotals.get(s.cardholderId) ?? { monthlyCents: 0, activeEmiCount: 0 };
      existing.monthlyCents += s.monthlyEmiCents;
      existing.activeEmiCount += 1;
      cardholderTotals.set(s.cardholderId, existing);
    });
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Page Header */}
      <PageHeader
        title="Dashboard"
        description="Your consolidated credit card balances and active EMI commitments."
        actions={
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/cards" className="flex-1 sm:flex-none">
              <SecondaryButton className="w-full">
                View Cards
              </SecondaryButton>
            </Link>
            <Link href="/cards/new" className="flex-1 sm:flex-none">
              <Button className="w-full">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                New Card
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metrics Section: Compact 2x2 Grid on Mobile, 4 Columns on Desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={formatCents(data.totalOutstandingCents)}
          hint="Across all cards"
          accent="amber"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        />
        <StatCard
          label="Monthly EMI"
          value={formatCents(data.monthlyCommitmentCents)}
          hint={`${data.activeEmis.length} active EMI${data.activeEmis.length === 1 ? "" : "s"}`}
          accent="violet"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Est. Interest"
          value={formatCents(data.totalInterestCents)}
          hint="Total loan interest"
          accent="amber"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="Estimated GST"
          value={formatCents(data.totalGstCents)}
          hint="18% tax on interest/fees"
          accent="emerald"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Monthly Payment & Cardholder Split Breakdown Banner */}
      {data.activeEmis.length > 0 ? (
        <Card className="bg-gradient-to-br from-violet-600/25 via-slate-950/40 to-slate-950/70 text-white border-white/15 shadow-xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-violet-400/15 px-2.5 py-0.5 text-xs font-semibold text-violet-300 border border-violet-400/25 backdrop-blur-md">
                  Monthly Payment Breakdown
                </span>
                <span className="text-xs text-slate-300">
                  {data.activeEmis.length} active {data.activeEmis.length === 1 ? "EMI" : "EMIs"}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5 tabular-nums text-white">
                {formatCents(data.monthlyCommitmentCents)}
                <span className="text-xs sm:text-sm font-normal text-violet-300 ml-1.5">/ month total</span>
              </p>
            </div>

            {/* Per-cardholder share breakdown */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              {Array.from(cardholderTotals.entries()).map(([chId, stats]) => {
                const name = cardholderMap.get(chId) ?? "Cardholder";
                const pct = data.monthlyCommitmentCents > 0
                  ? Math.round((stats.monthlyCents / data.monthlyCommitmentCents) * 100)
                  : 0;
                return (
                  <div
                    key={chId}
                    className="flex items-center gap-2.5 rounded-xl bg-white/8 backdrop-blur-md px-3 py-2 border border-white/15"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-400/20 text-xs font-bold text-violet-300">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{name}</span>
                        <span className="text-[10px] text-violet-300 font-medium">({pct}%)</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 tabular-nums">
                        {formatCents(stats.monthlyCents)}/mo
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : null}

      {/* Main Grid: Cards & Recent EMIs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 1: My Cards (Mini Virtual Credit Card Visuals) */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-50">My Cards</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-white/15">
                {data.cards.length}
              </span>
            </div>
            <Link
              href="/cards"
              className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors duration-200 cursor-pointer"
            >
              View all →
            </Link>
          </div>

          {data.cards.length === 0 ? (
            <EmptyState
              title="No cards added yet"
              description="Add your credit card to begin tracking outstanding balances and active EMIs."
            />
          ) : (
            <div className="space-y-3.5">
              {data.cards.slice(0, 4).map((card) => {
                const limit = card.creditLimitCents ?? 0;
                const hasLimit = limit > 0;
                const usedPercent = hasLimit
                  ? Math.min(100, Math.round((card.outstandingBalanceCents / limit) * 100))
                  : 0;

                return (
                  <Link
                    key={card.id}
                    href={`/cards/${card.id}`}
                    className="group block rounded-2xl border border-white/15 bg-white/8 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-amber-400/40 hover:bg-white/10 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {/* Metallic Card Chip Graphic */}
                        <div className="flex h-7 w-9 shrink-0 flex-col justify-between rounded-md border border-amber-400/60 bg-gradient-to-tr from-amber-300/30 via-amber-200/20 to-amber-300/30 p-1 shadow-xs">
                          <div className="h-1 w-full rounded-xs bg-amber-400/50" />
                          <div className="flex justify-between">
                            <div className="h-2 w-2 rounded-xs border border-amber-400/50" />
                            <div className="h-2 w-2 rounded-xs border border-amber-400/50" />
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-200 truncate">
                            {card.bankName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {card.cardLabel} · •••• {card.last4}
                            {card.cardOwner ? ` · ${card.cardOwner}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-slate-50 tabular-nums">
                          {formatCents(card.outstandingBalanceCents, card.currency)}
                        </p>
                        {card.paymentDueDay ? (
                          <span className="inline-block text-[11px] font-medium text-amber-300 bg-amber-400/10 rounded px-1.5 py-0.5 mt-0.5 border border-amber-400/20">
                            Due {card.paymentDueDay}th
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Balance</span>
                        )}
                      </div>
                    </div>

                    {/* Credit Limit Utilization Progress Bar */}
                    {hasLimit ? (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>Limit used: {usedPercent}%</span>
                          <span className="tabular-nums">Limit: {formatCents(limit, card.currency)}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              usedPercent > 80
                                ? "bg-red-500"
                                : usedPercent > 50
                                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                : "bg-gradient-to-r from-violet-500 to-purple-600"
                            }`}
                            style={{ width: `${usedPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Section 2: Recent EMIs (Tenure Progress Bars & Merchant Avatars) */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-50">Active EMIs</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-white/15">
                {data.recentEmis.length}
              </span>
            </div>
            <Link
              href="/cards"
              className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors duration-200 cursor-pointer"
            >
              All EMIs →
            </Link>
          </div>

          {data.recentEmis.length === 0 ? (
            <EmptyState
              title="No active EMIs yet"
              description="Add an EMI from any card detail page to calculate interest, GST, and track monthly payments."
            />
          ) : (
            <div className="space-y-3.5">
              {data.recentEmis.map(({ emi, card }) => {
                const calc = calcMap.get(emi.id);
                const paid = calc?.paidInstallmentsCount ?? 0;
                const total = emi.tenureMonths;
                const progressPercent = Math.min(100, Math.round((paid / total) * 100));
                const initial = emi.merchantName.charAt(0).toUpperCase() || "M";

                return (
                  <Link
                    key={emi.id}
                    href={`/cards/${card.id}/emis/${emi.id}`}
                    className="group block rounded-2xl border border-white/15 bg-white/8 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-violet-400/40 hover:bg-white/10 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Merchant Avatar */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-400/25 text-sm font-bold text-violet-300 group-hover:bg-violet-500/25 transition-colors duration-200">
                          {initial}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-100 group-hover:text-violet-300 transition-colors duration-200 truncate">
                            {emi.merchantName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {card.cardLabel} · {emi.interestRateAnnualPercent}% p.a.
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-slate-50 tabular-nums">
                          {calc ? formatCents(calc.monthlyPaymentWithGstCents, card.currency) : formatCents(emi.principalCents, card.currency)}
                          <span className="text-xs font-normal text-slate-400">/mo</span>
                        </p>
                        {calc && calc.totalUpfrontFeeCents > 0 ? (
                          <p className="text-[11px] font-semibold text-amber-300 tabular-nums">
                            1st mo: {formatCents(calc.firstMonthPaymentCents, card.currency)}
                          </p>
                        ) : null}
                        <p className="text-[11px] text-slate-500 tabular-nums">
                          Total: {formatCents(emi.principalCents, card.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Tenure Progress Bar */}
                    <div className="mt-3 pt-2.5 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-medium text-slate-300">
                          {paid} of {total} paid
                        </span>
                        <span>{progressPercent}% completed</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Per-EMI Cardholder Split Breakdown Chips */}
                    {calc ? (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                          Split:
                        </span>
                        {getEmiCardholderSplits(emi, calc.monthlyPaymentWithGstCents, calc.totalUpfrontFeeCents).map((split) => {
                          const chName = cardholderMap.get(split.cardholderId) ?? "Cardholder";
                          return (
                            <span
                              key={split.cardholderId}
                              className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-violet-400/20 tabular-nums backdrop-blur-md"
                            >
                              <span className="text-slate-400 font-medium">{chName}:</span>
                              {split.upfrontFeeCents > 0 ? (
                                <>
                                  <span className="text-violet-200 font-bold">1st mo: {formatCents(split.firstMonthPaymentCents, card.currency)}</span>
                                  <span className="text-slate-400 font-normal">({formatCents(split.monthlyEmiCents, card.currency)}/mo)</span>
                                </>
                              ) : (
                                <span>{formatCents(split.monthlyEmiCents, card.currency)}/mo</span>
                              )}
                              <span className="text-violet-400 font-normal">({split.percentage}%)</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
