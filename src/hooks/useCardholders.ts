"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCardholder,
  deleteCardholder,
  getCardholders,
} from "@/lib/firebase-data";

export function useCardholders(cardId?: string) {
  return useQuery({
    queryKey: ["cardholders", cardId],
    enabled: Boolean(cardId),
    queryFn: () => getCardholders(cardId as string),
  });
}

export function useCreateCardholder(cardId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; phone?: string; email?: string }) =>
      createCardholder(cardId as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardholders", cardId] });
    },
  });
}

export function useDeleteCardholder(cardId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardholderId: string) =>
      deleteCardholder(cardId as string, cardholderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardholders", cardId] });
    },
  });
}
