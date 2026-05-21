import api from "./AxiosClient.ts";
import {Evento} from "@/src/types/GET/Evento.ts";
import {EventoPost} from "@/src/types/POST/EventoPost.ts";
import {ResultadoPost} from "@/src/types/POST/ResultadoPost.ts";
import {Resultado} from "@/src/types/GET/Resultado.ts";
import {EditEventPost} from "@/src/types/POST/EditEventPost.ts";

const FIGHT_BASE = "/fight";

export const getEventos = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>(FIGHT_BASE);
  return response.data;
};

export const getEventosLibres = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>(`${FIGHT_BASE}/free`);
  return response.data;
};
