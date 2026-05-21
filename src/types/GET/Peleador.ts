export interface Peleador {
  id: string;
  nombre: string;
  apodo: string;
  genero: string;
  actividadData: ActividadData;
  fisicoData: FisicoData;
  historialData: HistorialData;
  estadoActividad: boolean;
  imgUrl: string;
}

export interface HistorialData {
  id: string;
  victorias: number;
  derrotas: number;
  empates: number;
  totalPeleas: number;
  rachaActual: number;
  rachaHistorica: number;
}

export interface FisicoData {
  id: string;
  peso: number;
  altura: number;
  alcance: number;
  edad: number;
  categoriaPeso: string;
}

export interface ActividadData {
  id: string;
  ultimaPelea: string;
  mesesDeInactividad: number;
  duracionPromedioEnPelea: number;
}