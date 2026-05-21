import { useMutation, useQueryClient } from "@tanstack/react-query";
import {pagarApuesta} from "@/src/api/RetornoApi.ts";

export const usePago = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pagarApuesta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["retornos"] });
            queryClient.invalidateQueries({ queryKey: ["bill"] });
        }
    });
};