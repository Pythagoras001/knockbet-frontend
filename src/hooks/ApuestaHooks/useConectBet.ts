import { useMutation, useQueryClient } from "@tanstack/react-query";
import {conectBet} from "@/src/api/ApuestaApi.ts";

export const useConectBet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: conectBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bets"] });
    }
  });
};