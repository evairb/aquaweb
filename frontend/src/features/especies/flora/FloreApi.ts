import { api } from "../../../shared/api/client";
import type { RespostaPaginada } from "../../../shared/types/utils";
import type { FloraListModel, FloraModel, FloraPayload } from "./FloraType";

const buildFormData = (payload: FloraPayload): FormData => {
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
}

// ============================================
// CRUD FAUNA
// ============================================
export const createFlora = async (payload: FloraPayload): Promise<FloraModel> => {
    const formData = buildFormData(payload);
    console.log(payload, '#########')
    const { data } = await api.post('/flora/', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export const getListaFloras = async (): Promise<FloraListModel[]> => {
  const { data } = await api.get<RespostaPaginada<FloraListModel>>("/flora/");
  return data.results;
};

export const getFlora = async (id: number): Promise<FloraModel> => {
  const {data} = await api.get(`/flora/${id}/`)
  return data
}

export const updateFlora = async (id: number, payload: FloraPayload): Promise<FloraModel> => {
  const formData = buildFormData(payload);
  const { data } = await api.put(`/flora/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteFlora = async (id: number): Promise<void> => {
  await api.delete(`/flora/${id}/`)
}