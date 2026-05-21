import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {getUserApuestas} from "@/src/api/ApuestaApi.ts";
import type { UserApuesta } from "@/src/types/GET/UserApuesta.ts";

export const useUserApuesta = (
  options?: Omit<UseQueryOptions<UserApuesta[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<UserApuesta[]>({
    queryKey: ["userBets"],
    queryFn: getUserApuestas,
    ...(options ?? {})
  });
};
