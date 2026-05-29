import api from "./AxiosClient.ts";
import {Presupuesto} from "@/src/types/GET/Presupuesto.ts";
import {PeleadorPost} from "@/src/types/POST/PeleadorPost.ts";
import {DepositoPost} from "@/src/types/POST/DepositoPost.ts";

const BUBGET_BASE = "/budget";

export const getPresupuesto = async (): Promise<Presupuesto> => {
  const response = await api.get<Presupuesto>(BUBGET_BASE);
  return response.data;
};

export const depositarPresupuesto = async (deposito: DepositoPost): Promise<void> => {
  await api.post(BUBGET_BASE, deposito);
};
