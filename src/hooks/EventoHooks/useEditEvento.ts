import { useMutation, useQueryClient } from "@tanstack/react-query";
import {editEvent, startEvent} from "@/src/api/EventosApi.ts";

export const useEditEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};