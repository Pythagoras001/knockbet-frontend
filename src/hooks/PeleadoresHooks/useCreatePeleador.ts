import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPeleador } from "../../api/PeleadoresApi.ts";

export const useCreatePeleador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPeleador,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fighters"] });
    }
  });
};