import { useMutation, useQueryClient } from "@tanstack/react-query";
import {startEvent} from "@/src/api/EventosApi.ts";

export const useStartFight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};