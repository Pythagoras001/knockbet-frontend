import { useMutation, useQueryClient } from "@tanstack/react-query";
import {cancelEvent} from "@/src/api/EventosApi.ts";

export const useCancelFight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};