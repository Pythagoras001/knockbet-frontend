import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createUserApuesta} from "@/src/api/ApuestaApi.ts";

export const useCreateUserApuesta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserApuesta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBets"] });
      // The backend updates bet stats/exposure as well; refresh markets list too.
      queryClient.invalidateQueries({ queryKey: ["bets"] });
    }
  });
};
