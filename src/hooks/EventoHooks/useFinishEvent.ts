import { useMutation, useQueryClient } from "@tanstack/react-query";
import {finishEvent} from "@/src/api/EventosApi.ts";

export const useFinishEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["resultados"] });

    }
  });
};