import api from "./AxiosClient.ts";
import {Apuesta} from "@/src/types/GET/Apuesta.ts";
import {UserApuesta} from "@/src/types/GET/UserApuesta.ts";
import {UserApuestaPost} from "@/src/types/POST/UserApuestaPost.ts";

const BET_BASE = "/bet";

export const getApuestas = async (): Promise<Apuesta[]> => {
  const response = await api.get<Apuesta[]>(BET_BASE);
  return response.data;
};

export const getUserApuestas = async (): Promise<UserApuesta[]> => {
  const response = await api.get<UserApuesta[]>(`${BET_BASE}/user`);
  return response.data;
};

export const conectBet = async (fightId: string): Promise<void> => {
  await api.post(`${BET_BASE}/${fightId}`);
};

export const createUserApuesta = async (userApuestaPet: UserApuestaPost): Promise<void> => {
  await api.post(`${BET_BASE}/stake`, userApuestaPet);
};
