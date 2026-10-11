"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
} from "@/components/ui";
import { EmiForm } from "@/components/emi-form";
import { useCard } from "@/hooks/useCards";
import { useCardholders } from "@/hooks/useCardholders";
import { getErrorMessage } from "@/lib/firebase";

export default function NewEmi() {
  const params = useParams<{ cardId: string }>();
  const cardId = params.cardId;
  const card = useCard(cardId);
  const cardholders = useCardholders(cardId);

  if (!cardId) {
    return <Spinner label="Loading EMI form..." />;
  }

  if (card.isLoading || cardholders.isLoading) {
    return <Spinner label="Loading EMI form..." />;
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

  if (cardholders.error) {
    return <ErrorNotice message={getErrorMessage(cardholders.error)} />;
  }

  return (
    <div>
      <PageHeader
        title="New EMI"
        description={`${card.data.bankName} · ${card.data.cardLabel}`}
        actions={
          <Link href={`/cards/${card.data.id}`}>
            <SecondaryButton type="button">Back to card</SecondaryButton>
          </Link>
        }
      />
      <Card>
        <EmiForm
          cardId={card.data.id}
          cardholders={cardholders.data ?? []}
          cancelHref={`/cards/${card.data.id}`}
        />
      </Card>
    </div>
  );
}
