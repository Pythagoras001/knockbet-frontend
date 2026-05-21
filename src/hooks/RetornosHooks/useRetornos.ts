import { useQuery } from "@tanstack/react-query";
import {getRetornos} from "@/src/api/RetornoApi.ts";

export const useRetornos = () => {
  return useQuery({
    queryKey: ["retornos"],
    queryFn: getRetornos
  });
};