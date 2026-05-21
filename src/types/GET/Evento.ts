import type { Peleador } from "./Peleador.ts";

export interface Evento {
  id: string;
  tituloPelea: string;
  peleadorA: Peleador;
  peleadorB: Peleador;
  ubicacion: Ubicacion;
  fechaPelea: string;
  estadoPelea: string;
}

export interface Ubicacion {
  dirreccion: string;
  Descripcion: string;
  lat: number;
  log: number;
}
