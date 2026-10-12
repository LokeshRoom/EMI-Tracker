"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  createCardholder,
  deleteCardholder,
  getCardholders,
} from "@/lib/firebase-data";

export function useCardholders(cardId?: string) {
  const auth = useAuth();
  const uid = auth.status === "authenticated" ? auth.user.uid : undefined;

  return useQuery({
    queryKey: ["cardholders", uid, cardId ?? "global"],
    enabled: Boolean(uid || cardId),
    queryFn: () => getCardholders(cardId, uid),
  });
}

export function useCreateCardholder(cardId?: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const uid = auth.status === "authenticated" ? auth.user.uid : undefined;

  return useMutation({
    mutationFn: (input: { name: string; phone?: string; email?: string }) =>
      createCardholder(input, cardId, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardholders"] });
    },
  });
}

export function useDeleteCardholder(cardId?: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const uid = auth.status === "authenticated" ? auth.user.uid : undefined;

  return useMutation({
    mutationFn: (cardholderId: string) =>
      deleteCardholder(cardholderId, cardId, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardholders"] });
    },
  });
}
