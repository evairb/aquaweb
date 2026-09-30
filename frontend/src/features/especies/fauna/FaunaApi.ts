import type { FaunaListModel, FaunaModel, FaunaPayload } from "../../../features/especies/fauna/FaunaType";
import type { RespostaPaginada } from "../../../shared/types/utils";
import { api } from "../../../shared/api/client";


const buildFormData = (payload: FaunaPayload): FormData => {
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

// ============================================
// CRUD FAUNA
// ============================================
export const createFauna = async (payload: FaunaPayload): Promise<FaunaModel> => {
  const formData = buildFormData(payload);
  const { data } = await api.post('/fauna/', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getListaFaunas = async (): Promise<FaunaListModel[]> => {
  const { data } = await api.get<RespostaPaginada<FaunaListModel>>("/fauna/");
  return data.results;
};

export const getFauna = async (id: number): Promise<FaunaModel> => {
  const { data } = await api.get<FaunaModel>(`/fauna/${id}/`);
  console.log("##### FAUNA RETORNADA DA API:", data);
  return data;
};

export const updateFauna = async (id: number, payload: FaunaPayload): Promise<FaunaModel> => {
  const formData = buildFormData(payload);
  const { data } = await api.put(`/fauna/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};