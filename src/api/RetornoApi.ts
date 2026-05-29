import api from "./AxiosClient.ts";
import {Retorno} from "@/src/types/GET/Retorno.ts";

const PAY_BASE = "/pay";

export const getRetornos = async (): Promise<Retorno[]> => {
  const response = await api.get<Retorno[]>(PAY_BASE);
  return response.data;
};
