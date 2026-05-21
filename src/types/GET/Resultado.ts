import {Evento} from "@/src/types/GET/Evento.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";

export interface Resultado {
  id:string,
  pelea:Evento
  ganador:Peleador,
  perdedor:Peleador,
  horaFinalizacion:string
}