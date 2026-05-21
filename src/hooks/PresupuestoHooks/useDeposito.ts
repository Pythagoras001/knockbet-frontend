import { useMutation, useQueryClient } from "@tanstack/react-query";
import {startEvent} from "@/src/api/EventosApi.ts";
import {depositarPresupuesto} from "@/src/api/Presupuesto.ts";

export const useDeposito = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: depositarPresupuesto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    }
  });
};