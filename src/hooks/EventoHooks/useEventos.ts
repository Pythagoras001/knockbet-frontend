import { useQuery } from "@tanstack/react-query";
import {getEventos} from "../../api/EventosApi.ts"

export const useEventos = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEventos
  });
};