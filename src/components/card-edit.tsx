"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CardForm } from "@/components/card-form";
import { Card, ErrorNotice, PageHeader, SecondaryButton, Spinner } from "@/components/ui";
import { useCard } from "@/hooks/useCards";
import { getErrorMessage } from "@/lib/firebase";

export default function CardEdit() {
  const params = useParams<{ cardId: string }>();
  const cardId = params.cardId;
  const card = useCard(cardId);

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

  return (
    <div>
      <PageHeader
        title="Edit card"
        description={`${card.data.bankName} · ${card.data.cardLabel}`}
        actions={
          <Link href={`/cards/${card.data.id}`}>
            <SecondaryButton type="button">Back to card</SecondaryButton>
          </Link>
        }
      />
      <Card>
        <CardForm card={card.data} cancelHref={`/cards/${card.data.id}`} />
      </Card>
    </div>
  );
}
