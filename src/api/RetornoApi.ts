import api from "./AxiosClient.ts";
import {Retorno} from "@/src/types/GET/Retorno.ts";
import {DepositoPost} from "@/src/types/POST/DepositoPost.ts";
import {PagoPost} from "@/src/types/POST/PagoPost.ts";
import {Factura} from "@/src/types/GET/Factura.ts";

const PAY_BASE = "/pay";

export const getRetornos = async (): Promise<Retorno[]> => {
  const response = await api.get<Retorno[]>(PAY_BASE);
  return response.data;
};

export const getFacturas = async (): Promise<Factura[]> => {
  const response = await api.get<Factura[]>(PAY_BASE + "/bill");
  return response.data;
};

export const pagarApuesta = async (pago:PagoPost): Promise<void> => {
  await api.post(PAY_BASE, pago);
};
