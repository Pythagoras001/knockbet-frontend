import { useQuery } from "@tanstack/react-query";
import {getResultados} from "@/src/api/EventosApi.ts";

export const useResultados = () => {
  return useQuery({
    queryKey: ["resultados"],
    queryFn: async () => {
      console.log("llamando endpoint...");
      return await getResultados();
    },
  });
};