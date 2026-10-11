"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createCard, deleteCard, getCard, getCardsForUser, updateCard } from "@/lib/firebase-data";
import type { CardInput } from "@/types";

function useUid() {
  const auth = useAuth();
  return auth.status === "authenticated" ? auth.user.uid : undefined;
}

export function useCards() {
  const uid = useUid();
  return useQuery({
    queryKey: ["cards", uid],
    enabled: Boolean(uid),
    queryFn: () => getCardsForUser(uid as string),
  });
}

export function useCard(cardId?: string) {
  return useQuery({
    queryKey: ["card", cardId],
    enabled: Boolean(cardId),
    queryFn: () => getCard(cardId as string),
  });
}

export function useCreateCard() {
  const uid = useUid();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CardInput) => createCard(uid as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, input }: { cardId: string; input: Partial<CardInput> }) =>
      updateCard(cardId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
