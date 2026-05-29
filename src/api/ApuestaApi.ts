import api from "./AxiosClient.ts";

import {UserApuestaPost} from "@/src/types/POST/UserApuestaPost.ts";

const BET_BASE = "/bet";

export const createUserApuesta = async (userApuestaPet: UserApuestaPost): Promise<void> => {
  await api.post(`${BET_BASE}/stake`, userApuestaPet);
};
