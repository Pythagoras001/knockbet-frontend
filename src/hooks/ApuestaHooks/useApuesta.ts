import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {getApuestas} from "@/src/api/ApuestaApi.ts";
import type { Apuesta } from "@/src/types/GET/Apuesta.ts";

export const useApuesta = (
  options?: Omit<UseQueryOptions<Apuesta[], Error>, "queryKey" | "queryFn" | "initialData">
) => {
  return useQuery<Apuesta[]>({
    queryKey: ["bets"],
    queryFn: getApuestas,
    // Avoid `data` being undefined on the initial render so views can safely `.map()`.
    initialData: [],
    ...(options ?? {})
  });
};
