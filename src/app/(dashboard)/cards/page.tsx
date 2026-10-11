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
    <div>
      <PageHeader
        title="Cards"
        description="Cards you own or are authorized to access."
        actions={
          <Link href="/cards/new">
            <Button>New card</Button>
          </Link>
        }
      />
      {cards.data?.length === 0 ? (
        <EmptyState
          title="No cards yet"
          description="Create a card to track cardholders and EMI purchases."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.data?.map((card) => (
            <Card key={card.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/cards/${card.id}`}
                    className="text-base font-semibold text-zinc-900 underline-offset-2 hover:underline"
                  >
                    {card.bankName} · {card.cardLabel}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    Ends {card.last4} · {card.currency}
                  </p>
                </div>
                <Link href={`/cards/${card.id}/edit`}>
                  <SecondaryButton type="button">
                    Edit
                  </SecondaryButton>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-zinc-500">Outstanding</p>
                  <p className="mt-1 font-medium text-zinc-900">
                    {formatCents(card.outstandingBalanceCents, card.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Credit limit</p>
                  <p className="mt-1 font-medium text-zinc-900">
                    {card.creditLimitCents !== undefined
                      ? formatCents(card.creditLimitCents, card.currency)
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Payment due</p>
                  <p className="mt-1 font-medium text-zinc-900">
                    {card.paymentDueDay ? `${card.paymentDueDay}th of month` : "Not set"}
                  </p>
                </div>
              </div>
              <Link
                href={`/cards/${card.id}`}
                className="text-sm font-medium text-zinc-700 underline"
              >
                View card details
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
