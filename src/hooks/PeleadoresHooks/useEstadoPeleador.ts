import { useMutation, useQueryClient } from "@tanstack/react-query";
import {toggleFighterStatus} from "@/src/api/PeleadoresApi.ts";

export const useEstadoPeleador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFighterStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fighters"] });
    }
  });
};