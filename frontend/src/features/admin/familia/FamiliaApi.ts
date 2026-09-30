import type { FamiliaFormData, FamiliaModel } from "./FamiliaType";
import type { RespostaPaginada } from "../../../shared/types/utils";
import { api } from "../../../shared/api/client";

export const createFamilia = async (
  payload: FamiliaFormData
): Promise<FamiliaModel> => {
  const { data } = await api.post('/familias/', payload)
  return data
}

export const getListaFamilias = async (): Promise<FamiliaModel[]> => {
  const response = await api.get<RespostaPaginada<FamiliaModel>>("/familias/");
  return response.data.results;
}

export const getFamilia = async (id: string): Promise<FamiliaModel> => {
  const {data} = await api.get<FamiliaModel>(`/familias/${id}/`);
  return data;
}

export const updateFamilia = async (
  id: string, payload: FamiliaFormData
): Promise<FamiliaModel> => {
  const { data } = await api.put(`/familias/${id}/`, payload)
  console.log(data)
  return data
}

export const deleteFamilia = async (
  id: number
): Promise<void> => {
  await api.delete(`/familias/${id}/`)
}
