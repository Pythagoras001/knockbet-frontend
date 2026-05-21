import { useQuery } from "@tanstack/react-query";
import {getPeleadores} from "../../api/PeleadoresApi.ts"

export const usePeleadores = () => {
  return useQuery({
    queryKey: ["fighters"], // clave única (IMPORTANTE)
    queryFn: getPeleadores
  });
};