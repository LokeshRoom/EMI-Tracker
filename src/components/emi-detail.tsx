"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EmiSummary } from "@/components/emi-summary";
import {
  Badge,
  DangerButton,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
} from "@/components/ui";
import { useCard } from "@/hooks/useCards";
import { useCardholders } from "@/hooks/useCardholders";
import { useDeleteEmi, useEmi } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";

export default function EmiDetail() {
  const params = useParams<{ cardId: string; emiId: string }>();
  const router = useRouter();
  const cardId = params.cardId;
  const emiId = params.emiId;

  const card = useCard(cardId);
  const emi = useEmi(cardId, emiId);
  const cardholders = useCardholders(cardId);
  const deleteEmi = useDeleteEmi(cardId);

  if (!cardId || !emiId || card.isLoading || emi.isLoading || cardholders.isLoading) {
    return <Spinner label="Loading EMI details..." />;
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

  const currentEmi = emi.data;
  const currentCard = card.data;
  const cardholder = cardholders.data?.find((c) => c.id === currentEmi.cardholderId);

  function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this EMI?")) return;
    deleteEmi.mutate(currentEmi.id, {
      onSuccess: () => router.push(`/cards/${cardId}`),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentEmi.merchantName}
        description={`${currentCard.bankName} · ${cardholder?.name ?? "Unknown cardholder"} · Purchased ${currentEmi.purchaseDate}`}
        actions={
          <>
            <Link href={`/cards/${cardId}/emis/${currentEmi.id}/edit`}>
              <SecondaryButton type="button">
                Edit EMI
              </SecondaryButton>
            </Link>
            <DangerButton
              type="button"
              onClick={handleDelete}
              disabled={deleteEmi.isPending}
            >
              {deleteEmi.isPending ? "Deleting..." : "Delete EMI"}
            </DangerButton>
          </>
        }
      />
      <div className="flex items-center gap-2">
        <Badge>{currentEmi.status}</Badge>
        <span className="text-sm text-slate-400">
          Tenure: {currentEmi.tenureMonths} months · Starting {currentEmi.startMonth}
        </span>
      </div>
      <EmiSummary emi={currentEmi} currency={currentCard.currency} cardholders={cardholders.data ?? []} />
    </div>
  );
}
