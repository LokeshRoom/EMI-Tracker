"use client";

import Link from "next/link";
import {
  Button,
  Card,
  EmptyState,
  ErrorNotice,
  PageHeader,
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Summary of your cards and active EMI commitments."
        actions={
          <Link href="/cards/new">
            <Button>New card</Button>
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding balance"
          value={formatCents(data.totalOutstandingCents)}
          hint="Across all cards"
        />
        <StatCard
          label="Monthly EMI"
          value={formatCents(data.monthlyCommitmentCents)}
          hint="Active EMIs only"
        />
        <StatCard
          label="Estimated interest"
          value={formatCents(data.totalInterestCents)}
          hint="Active EMIs only"
        />
        <StatCard
          label="Estimated GST"
          value={formatCents(data.totalGstCents)}
          hint="On interest, charges, and costs"
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Cards</h2>
            <Link href="/cards" className="text-sm font-medium text-zinc-700 underline">
              View all
            </Link>
          </div>
          {data.cards.length === 0 ? (
            <EmptyState
              title="No cards yet"
              description="Create your first card to start tracking EMIs."
            />
          ) : (
            <ul className="space-y-3">
              {data.cards.slice(0, 5).map((card) => (
                <li key={card.id}>
                  <Link
                    href={`/cards/${card.id}`}
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 transition-colors hover:bg-zinc-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {card.bankName} · {card.cardLabel}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Ends {card.last4} · {card.currency}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      {formatCents(card.outstandingBalanceCents, card.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Recent EMIs</h2>
            <Link href="/cards" className="text-sm font-medium text-zinc-700 underline">
              View cards
            </Link>
          </div>
          {data.recentEmis.length === 0 ? (
            <EmptyState
              title="No active EMIs yet"
              description="Add an EMI from a card detail page."
            />
          ) : (
            <ul className="space-y-3">
              {data.recentEmis.map(({ emi, card }) => (
                <li key={emi.id}>
                  <Link
                    href={`/cards/${card.id}/emis/${emi.id}`}
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 transition-colors hover:bg-zinc-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{emi.merchantName}</p>
                      <p className="text-xs text-zinc-500">
                        {card.cardLabel} · {emi.tenureMonths} months
                      </p>
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      {formatCents(emi.principalCents, card.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
