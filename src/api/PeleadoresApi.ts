import api from "./AxiosClient.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";
import {PeleadorPost} from "@/src/types/POST/PeleadorPost.ts";
import {EditPeleadorPost} from "@/src/types/POST/EditPeleadorPost.ts";

const FIGHTERS_BASE = "/fighters";

export const getPeleadores = async (): Promise<Peleador[]> => {
  const response = await api.get<Peleador[]>(FIGHTERS_BASE);
  return response.data;
};

export const toggleFighterStatus = async (id: string): Promise<void> => {
  // PATCH /api/fighters/{id}/status
  await api.patch(`${FIGHTERS_BASE}/${id}/status`);
};

export const editFighter = async (editPeleador: EditPeleadorPost): Promise<void> => {
  // PUT /api/fighters/edit
  await api.put(`${FIGHTERS_BASE}/edit`, editPeleador);
};
