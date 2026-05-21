import { useQuery } from "@tanstack/react-query";
import {getPresupuesto} from "@/src/api/Presupuesto.ts";

export const usePresupuesto = () => {
  return useQuery({
    queryKey: ["budget"],
    queryFn: getPresupuesto
  });
};