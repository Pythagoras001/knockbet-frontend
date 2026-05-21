import { useMutation, useQueryClient } from "@tanstack/react-query";
import {editFighter} from "@/src/api/PeleadoresApi.ts";

export const useEdtiPeleador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editFighter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fighters"] });
    }
  });
};