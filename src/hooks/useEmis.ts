"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmi,
  deleteEmi,
  getEmi,
  getEmisForCard,
  updateEmi,
} from "@/lib/firebase-data";
import type { EmiInput } from "@/types";

export function useEmis(cardId?: string) {
  return useQuery({
    queryKey: ["emis", cardId],
    enabled: Boolean(cardId),
    queryFn: () => getEmisForCard(cardId as string),
  });
}

export function useEmi(cardId?: string, emiId?: string) {
  return useQuery({
    queryKey: ["emi", cardId, emiId],
    enabled: Boolean(cardId && emiId),
    queryFn: () => getEmi(cardId as string, emiId as string),
  });
}

export function useCreateEmi(cardId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmiInput) => createEmi(cardId as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emis", cardId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateEmi(cardId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ emiId, input }: { emiId: string; input: Partial<EmiInput> }) =>
      updateEmi(cardId as string, emiId, input),
    onSuccess: () => {
      if (cardId) {
        queryClient.invalidateQueries({ queryKey: ["emis", cardId] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    },
  });
}

export function useDeleteEmi(cardId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emiId: string) => deleteEmi(cardId as string, emiId),
    onSuccess: () => {
      if (cardId) {
        queryClient.invalidateQueries({ queryKey: ["emis", cardId] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["emi", cardId] });
      }
    },
  });
}
