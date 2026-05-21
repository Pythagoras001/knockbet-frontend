import {Apuesta, Cuota} from "@/src/types/GET/Apuesta.ts";

export interface UserApuesta {
  id: string;
  apostador: Apostador;
  apuesta: Apuesta;
  ganadorEsperado: Cuota;
  rendimientoGananciaAsociada: number;
  valorApostado: number;
  totalGananciaPosible: number;
}

export interface Apostador {
  nombre: string;
  cedula: string;
  celular: string;
  correo:string
}