import {Evento} from "@/src/types/GET/Evento.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";


export interface Apuesta {
  id: string;
  pelea: Evento;
  cuotaPeleadorA: Cuota;
  cuotaPeleadorB: Cuota;
  cuotaEmpate: Cuota;
  prediccionResultadoPelea: PrediccionResultadoPelea;
  activo: string;
  fechaDePublicacion: string;
}

export interface PrediccionResultadoPelea {
  probablidadVictoriaA: number;
  probabilidadVictoriaB: number;
  probabilidadEmpate: number;
}

export interface EstadisticaCuota {
  id: string;
  gananciaTotalCasa: number;
  pagoTotalPorVictoria: number;
  cantidadUserApuestasAsociadas: number;
  estadoApuestaCuota: string;
}

export interface Cuota {
  id: string;
  peleador: Peleador;
  cuotaGananciaActual: number;
  resultadoCuota: string;
  estadisticaAsociada: EstadisticaCuota;
}