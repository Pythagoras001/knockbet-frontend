import { useQuery } from "@tanstack/react-query";
import {getEventos, getEventosLibres} from "../../api/EventosApi.ts"

export const useEventosLibres = () => {
  return useQuery({
    queryKey: ["freeEvents"],
    queryFn: getEventosLibres
  });
};