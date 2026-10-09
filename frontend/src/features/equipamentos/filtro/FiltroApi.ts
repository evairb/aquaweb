import { api } from "../../../shared/api/client";
import type { FiltroModel, FiltroPayload } from "./FiltroType";


const buildFormData = (payload: FiltroPayload): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "imagem") {
      if (value instanceof File) {
        formData.append("imagem", value);
      }
      return;
    }
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

export const createFiltro = async (
  payload: FiltroPayload
): Promise<FiltroModel> => {
  const { data } = await api.post("/filtros/", buildFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export const getFiltro = async (id: number): Promise<FiltroModel> => {
  const { data } = await api.get(`/filtros/${id}/`)
  return data
}

export const getFiltrosLista = async (): Promise<FiltroModel[]> => {
  const { data } = await api.get('/filtros/')
  return data.results
}

export const updateFiltro = async (
  id: number,
  payload: FiltroPayload
): Promise<FiltroModel> => {
  const { data } = await api.patch(`/filtros/${id}/`, buildFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export const deleteFiltro = async (id: number): Promise<void> => {
  await api.delete(`/filtro/${id}`)
}