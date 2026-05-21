import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createEvent} from "@/src/api/EventosApi.ts";

export const useCreateEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};