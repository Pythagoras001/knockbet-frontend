export interface PeleadorPost {
  nombre: string;
  apodo: string;
  genero: string;
  img: File;

  esNuevo: boolean;

  peso: string;
  altura: string;
  alcance: string;
  edad: string;

  ultimaPelea: string;
  duracionPromedioEnPelea: string;

  victorias: string;
  derrotas: string;
  empates: string;
  rachaActual: string;
  rachaHistorica: string;
}