"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
  StatCard,
} from "@/components/ui";
import { useDashboard } from "@/hooks/useDashboard";
import { getErrorMessage } from "@/lib/firebase";
import { formatCents } from "@/lib/money";

export default function DashboardPage() {
  const dashboard = useDashboard();

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
          accent="indigo"
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

      {/* Main Grid: Cards & Recent EMIs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 1: My Cards (Mini Virtual Credit Card Visuals) */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">My Cards</h2>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                {data.cards.length}
              </span>
            </div>
            <Link
              href="/cards"
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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
                    className="group block rounded-2xl border border-zinc-200/90 bg-linear-to-br from-white via-zinc-50/50 to-zinc-100/40 p-3.5 sm:p-4 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {/* Metallic Card Chip Graphic */}
                        <div className="flex h-7 w-9 shrink-0 flex-col justify-between rounded-md border border-amber-300/80 bg-linear-to-tr from-amber-200 via-amber-100 to-amber-200 p-1 shadow-2xs">
                          <div className="h-1 w-full rounded-xs bg-amber-400/60" />
                          <div className="flex justify-between">
                            <div className="h-2 w-2 rounded-xs border border-amber-400/60" />
                            <div className="h-2 w-2 rounded-xs border border-amber-400/60" />
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                            {card.bankName}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {card.cardLabel} · •••• {card.last4}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-zinc-950 tabular-nums">
                          {formatCents(card.outstandingBalanceCents, card.currency)}
                        </p>
                        {card.paymentDueDay ? (
                          <span className="inline-block text-[11px] font-medium text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-0.5">
                            Due {card.paymentDueDay}th
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-400">Balance</span>
                        )}
                      </div>
                    </div>

                    {/* Credit Limit Utilization Progress Bar */}
                    {hasLimit ? (
                      <div className="mt-3 pt-2.5 border-t border-zinc-100">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                          <span>Limit used: {usedPercent}%</span>
                          <span className="tabular-nums">Limit: {formatCents(limit, card.currency)}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              usedPercent > 80
                                ? "bg-red-500"
                                : usedPercent > 50
                                ? "bg-amber-500"
                                : "bg-indigo-600"
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
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">Active EMIs</h2>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                {data.recentEmis.length}
              </span>
            </div>
            <Link
              href="/cards"
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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
                    className="group block rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Merchant Avatar */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {initial}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                            {emi.merchantName}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {card.cardLabel} · {emi.interestRateAnnualPercent}% p.a.
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-zinc-950 tabular-nums">
                          {calc ? formatCents(calc.emiCents, card.currency) : formatCents(emi.principalCents, card.currency)}
                          <span className="text-xs font-normal text-zinc-500">/mo</span>
                        </p>
                        <p className="text-[11px] text-zinc-400 tabular-nums">
                          Total: {formatCents(emi.principalCents, card.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Tenure Progress Bar */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-100">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                        <span className="font-medium text-zinc-700">
                          {paid} of {total} paid
                        </span>
                        <span>{progressPercent}% completed</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
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
