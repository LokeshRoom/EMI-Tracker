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
} from "@/components/ui";
import { useCards } from "@/hooks/useCards";
import { getErrorMessage } from "@/lib/firebase";
import { formatCents } from "@/lib/money";

export default function CardsPage() {
  const cards = useCards();

  if (cards.isLoading) {
    return <Spinner label="Loading cards..." />;
  }

  if (cards.error) {
    return <ErrorNotice message={getErrorMessage(cards.error)} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cards"
        description="Your registered credit cards, billing limits, and associated EMIs."
        actions={
          <Link href="/cards/new" className="w-full sm:w-auto">
            <Button className="w-full">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Card
            </Button>
          </Link>
        }
      />
      {cards.data?.length === 0 ? (
        <EmptyState
          title="No credit cards found"
          description="Create your first card to begin tracking cardholders and EMI purchases."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.data?.map((card) => {
            const limit = card.creditLimitCents ?? 0;
            const hasLimit = limit > 0;
            const usedPercent = hasLimit
              ? Math.min(100, Math.round((card.outstandingBalanceCents / limit) * 100))
              : 0;

            return (
              <Card key={card.id} className="flex flex-col justify-between gap-4 border-white/15 shadow-lg hover:border-amber-400/40 transition-all duration-200">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Metallic Card Chip Graphic */}
                      <div className="flex h-8 w-10 shrink-0 flex-col justify-between rounded-md border border-amber-400/60 bg-gradient-to-tr from-amber-300/30 via-amber-200/20 to-amber-300/30 p-1 shadow-xs">
                        <div className="h-1 w-full rounded-xs bg-amber-400/50" />
                        <div className="flex justify-between">
                          <div className="h-2 w-2 rounded-xs border border-amber-400/50" />
                          <div className="h-2 w-2 rounded-xs border border-amber-400/50" />
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/cards/${card.id}`}
                          className="text-base font-bold text-slate-100 hover:text-amber-300 transition-colors duration-200 cursor-pointer"
                        >
                          {card.bankName}
                        </Link>
                        <p className="text-xs text-slate-400">
                          {card.cardLabel} · •••• {card.last4}
                          {card.cardOwner ? ` · Owner: ${card.cardOwner}` : ""}
                        </p>
                      </div>
                    </div>
                    <Link href={`/cards/${card.id}/edit`}>
                      <SecondaryButton type="button" className="px-3 py-1.5 text-xs min-h-[32px]">
                        Edit
                      </SecondaryButton>
                    </Link>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs sm:text-sm backdrop-blur-md">
                    <div>
                      <p className="text-xs text-slate-400">Outstanding</p>
                      <p className="mt-0.5 font-bold text-slate-100 tabular-nums">
                        {formatCents(card.outstandingBalanceCents, card.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Credit Limit</p>
                      <p className="mt-0.5 font-semibold text-slate-300 tabular-nums">
                        {card.creditLimitCents !== undefined
                          ? formatCents(card.creditLimitCents, card.currency)
                          : "Not set"}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-400">Payment Due</p>
                      <p className="mt-0.5 font-semibold text-slate-300">
                        {card.paymentDueDay ? `${card.paymentDueDay}th of month` : "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Utilization Progress Bar */}
                  {hasLimit ? (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Utilization</span>
                        <span>{usedPercent}% used</span>
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
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/cards/${card.id}`}
                    className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors duration-200 cursor-pointer"
                  >
                    View EMIs & Details →
                  </Link>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                    {card.currency}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
