"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { EmiForm } from "@/components/emi-form";
import {
  Card,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
} from "@/components/ui";
import { useCard } from "@/hooks/useCards";
import { useCardholders } from "@/hooks/useCardholders";
import { useEmi } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";

export default function EmiEdit() {
  const params = useParams<{ cardId: string; emiId: string }>();
  const cardId = params.cardId;
  const emiId = params.emiId;

  const card = useCard(cardId);
  const emi = useEmi(cardId, emiId);
  const cardholders = useCardholders(cardId);

  if (!cardId || !emiId || card.isLoading || emi.isLoading || cardholders.isLoading) {
    return <Spinner label="Loading EMI..." />;
  }

  if (card.error || !card.data || emi.error || !emi.data) {
    return (
      <div className="space-y-4">
        <ErrorNotice
          message={
            emi.error
              ? getErrorMessage(emi.error)
              : card.error
              ? getErrorMessage(card.error)
              : "EMI not found."
          }
        />
        <Link href={`/cards/${cardId}`} className="text-sm font-medium text-slate-300 underline transition-colors duration-200 hover:text-white cursor-pointer">
          Back to card
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
        title="Edit EMI"
        description={`${card.data.bankName} · ${emi.data.merchantName}`}
        actions={
          <Link href={`/cards/${cardId}/emis/${emiId}`}>
            <SecondaryButton type="button">Back to EMI</SecondaryButton>
          </Link>
        }
      />
      <Card>
        <EmiForm
          cardId={card.data.id}
          cardholders={cardholders.data ?? []}
          emi={emi.data}
          cancelHref={`/cards/${cardId}/emis/${emiId}`}
        />
      </Card>
    </div>
  );
}
