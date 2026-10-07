import { api } from "../../../shared/api/client";
import type { RespostaPaginada } from "../../../shared/types/utils";
import type { GeneroFloraFormData, GeneroFloraModel } from "./GeneroFloraType";

export const createGeneroFlora = async (
  payload: GeneroFloraFormData
):Promise<GeneroFloraModel> => {
  const {data} = await api.post('/genero-flora/', payload)
  return data
}

export const getGeneroFlora = async (id: number): Promise<GeneroFloraModel> => {
  const {data} = await api.get(`/genero-flora/${id}/`)
  return data
}

export const getGeneroFloraList = async (): Promise<GeneroFloraModel[]> => {
  const response = await api.get<RespostaPaginada<GeneroFloraModel>>('/genero-flora/')
  return response.data.results
}

export const updateGeneroFlora = async (
  id: number, payload: GeneroFloraFormData
): Promise<GeneroFloraModel> => {
  const {data} = await api.put(`/genero-flora/${id}/`, payload)
  return data
}

export const deleteGeneroFlora = async (id: number): Promise<void> => {
  await api.delete(`/genero-flora/${id}/`)
}