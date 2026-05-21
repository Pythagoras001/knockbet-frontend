import {UserApuesta} from "@/src/types/GET/UserApuesta.ts";

export interface Retorno{
  id: string,
  apuestaInscrita: UserApuesta,
  estadoRetorno : string
}