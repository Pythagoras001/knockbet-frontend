import { EventoPost } from "@/src/types/POST/EventoPost";

export interface FightFormErrors {
  idPeleadorA?: string;
  idPeleadorB?: string;
  nombrePelea?: string;
  horaIncio?: string;
  direccion?: string;
  descripcion?: string;
  [key: string]: string | undefined;
}

export const validateFightForm = (data: EventoPost): FightFormErrors => {
  const errors: FightFormErrors = {};

  if (!data.idPeleadorA) {
    errors.idPeleadorA = 'El peleador de la esquina roja es obligatorio.';
  }
  
  if (!data.idPeleadorB) {
    errors.idPeleadorB = 'El peleador de la esquina azul es obligatorio.';
  }

  if (data.idPeleadorA && data.idPeleadorB && data.idPeleadorA === data.idPeleadorB) {
    errors.idPeleadorB = 'Los peleadores no pueden ser la misma persona.';
    errors.idPeleadorA = 'Los peleadores no pueden ser la misma persona.';
  }

  if (!data.nombrePelea || data.nombrePelea.trim() === '') {
    errors.nombrePelea = 'El nombre del evento es obligatorio.';
  }

  if (!data.horaIncio || data.horaIncio.trim() === '') {
    errors.horaIncio = 'La hora de inicio es obligatoria.';
  } else {
    const date = new Date(data.horaIncio);
    if (isNaN(date.getTime())) {
      errors.horaIncio = 'El formato de fecha/hora es inválido.';
    }
  }

  if (!data.direccion || data.direccion.trim() === '') {
    errors.direccion = 'El lugar no puede estar vacío.';
  }

  if (!data.descripcion || data.descripcion.trim() === '') {
    errors.descripcion = 'La descripción no puede estar vacía.';
  }

  return errors;
};

export const formatFightData = (data: EventoPost): EventoPost => {
  return {
    ...data,
    nombrePelea: data.nombrePelea ? data.nombrePelea.trim().toUpperCase() : '',
    direccion: data.direccion ? data.direccion.trim() : '',
    descripcion: data.descripcion ? data.descripcion.trim() : ''
  };
};
