export const getTrendEventos  = (eventos: any[]): string => {
  if (!eventos || eventos.length === 0) {
    return "Sin eventos programados";
  }

  // filtrar activos
  const activos = eventos.filter(
    e => !["FINALIZADA", "CANCELADA"].includes(e.estadoPelea)
  );

  if (activos.length === 0) {
    return "Sin eventos programados";
  }

  // obtener el más próximo
  const proximo = activos.sort(
    (a, b) => new Date(a.fechaPelea).getTime() - new Date(b.fechaPelea).getTime()
  )[0];

  const ahora = Date.now();
  const fechaEvento = new Date(proximo.fechaPelea).getTime();

  const diffMs = fechaEvento - ahora;

  if (diffMs <= 0) {
    return "En curso";
  }

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);

  if (horas < 1) return "Comienza pronto";
  if (horas < 24) return `Faltan ${horas}h`;
  return `Faltan ${dias}d`;
};


export const formatFecha = (iso: string): string => {
  const date = new Date(iso);

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};


export const formatHora = (iso: string): string => {
  const date = new Date(iso);

  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};