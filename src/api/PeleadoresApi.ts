import api from "./AxiosClient.ts";
import {Peleador} from "@/src/types/GET/Peleador.ts";
import {PeleadorPost} from "@/src/types/POST/PeleadorPost.ts";
import {EditPeleadorPost} from "@/src/types/POST/EditPeleadorPost.ts";

const FIGHTERS_BASE = "/fighters";

export const getPeleadores = async (): Promise<Peleador[]> => {
  const response = await api.get<Peleador[]>(FIGHTERS_BASE);
  return response.data;
};

export const createPeleador = async (peleador: PeleadorPost): Promise<void> => {
  const formData = new FormData();

  formData.append("nombre", peleador.nombre);
  formData.append("apodo", peleador.apodo);
  formData.append("genero", peleador.genero);

  formData.append("img", peleador.img);

  formData.append("esNuevo", String(peleador.esNuevo));

  formData.append("peso", peleador.peso);
  formData.append("altura", peleador.altura);
  formData.append("alcance", peleador.alcance);
  formData.append("edad", peleador.edad);

  formData.append("ultimaPelea", peleador.ultimaPelea);
  formData.append("duracionPromedioEnPelea", peleador.duracionPromedioEnPelea);

  formData.append("victorias", peleador.victorias);
  formData.append("derrotas", peleador.derrotas);
  formData.append("empates", peleador.empates);
  formData.append("rachaActual", peleador.rachaActual);
  formData.append("rachaHistorica", peleador.rachaHistorica);

  await api.post(FIGHTERS_BASE, formData);
};

export const toggleFighterStatus = async (id: string): Promise<void> => {
  // PATCH /api/fighters/{id}/status
  await api.patch(`${FIGHTERS_BASE}/${id}/status`);
};

export const editFighter = async (editPeleador: EditPeleadorPost): Promise<void> => {
  // PUT /api/fighters/edit
  await api.put(`${FIGHTERS_BASE}/edit`, editPeleador);
};
