import {Retorno} from "@/src/types/GET/Retorno.ts";

export interface Factura{
  id:string,
  retorno:Retorno,
  fechaPago:string,
  metodoPago:string
}