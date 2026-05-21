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

export const getResultados = async (): Promise<Resultado[]> => {
  // GET /api/fight/results
  const response = await api.get<Resultado[]>(`${FIGHT_BASE}/results`);
  return response.data;
};

export const createEvent = async (evento: EventoPost): Promise<void> => {
  // POST /api/fight
  await api.post(FIGHT_BASE, evento);
};

export const startEvent = async (fightId: string): Promise<void> => {
  // POST /api/fight/{fightId}/start
  await api.post(`${FIGHT_BASE}/${fightId}/start`);
};

export const finishEvent = async (resultado: ResultadoPost): Promise<void> => {
  // POST /api/fight/result
  await api.post(`${FIGHT_BASE}/result`, resultado);
};

export const editEvent = async (editEvento:EditEventPost): Promise<void> => {
  // PUT /api/fight/edit
  await api.put(`${FIGHT_BASE}/edit`, editEvento);
};

export const cancelEvent = async (fightId: string): Promise<void> => {
  // POST /api/fight/{fightId}/status
  await api.patch(`${FIGHT_BASE}/${fightId}/status`);
};
