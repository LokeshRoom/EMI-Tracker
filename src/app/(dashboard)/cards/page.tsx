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
              <Card key={card.id} className="flex flex-col justify-between gap-4 border-zinc-200/90 shadow-2xs hover:border-indigo-300 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Metallic Card Chip Graphic */}
                      <div className="flex h-8 w-10 shrink-0 flex-col justify-between rounded-md border border-amber-300/80 bg-linear-to-tr from-amber-200 via-amber-100 to-amber-200 p-1 shadow-2xs">
                        <div className="h-1 w-full rounded-xs bg-amber-400/60" />
                        <div className="flex justify-between">
                          <div className="h-2 w-2 rounded-xs border border-amber-400/60" />
                          <div className="h-2 w-2 rounded-xs border border-amber-400/60" />
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/cards/${card.id}`}
                          className="text-base font-bold text-zinc-950 hover:text-indigo-600 transition-colors"
                        >
                          {card.bankName}
                        </Link>
                        <p className="text-xs text-zinc-500">
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

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-zinc-50/80 p-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-xs text-zinc-500">Outstanding</p>
                      <p className="mt-0.5 font-bold text-zinc-950 tabular-nums">
                        {formatCents(card.outstandingBalanceCents, card.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Credit Limit</p>
                      <p className="mt-0.5 font-semibold text-zinc-800 tabular-nums">
                        {card.creditLimitCents !== undefined
                          ? formatCents(card.creditLimitCents, card.currency)
                          : "Not set"}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-zinc-500">Payment Due</p>
                      <p className="mt-0.5 font-semibold text-zinc-800">
                        {card.paymentDueDay ? `${card.paymentDueDay}th of month` : "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Utilization Progress Bar */}
                  {hasLimit ? (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                        <span>Utilization</span>
                        <span>{usedPercent}% used</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
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
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <Link
                    href={`/cards/${card.id}`}
                    className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View EMIs & Details →
                  </Link>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
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
