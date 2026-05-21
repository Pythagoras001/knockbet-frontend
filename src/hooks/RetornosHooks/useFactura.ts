import { useQuery } from "@tanstack/react-query";
import {getFacturas} from "@/src/api/RetornoApi.ts";

export const useFactura = () => {
  return useQuery({
    queryKey: ["bill"],
    queryFn: getFacturas
  });
};