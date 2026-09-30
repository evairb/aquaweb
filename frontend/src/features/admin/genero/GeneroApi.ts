import type { GeneroFormData, GeneroModel } from "./GeneroType";
import type { RespostaPaginada } from "../../../shared/types/utils";
import { api } from "../../../shared/api/client";

export const createGenero = async (data: GeneroFormData) => {
  const payload = {
    ...data,
    familia: Number(data.familia), 
  };
  const { data: response } = await api.post('/generos/', payload);
  return response
}

export const getListaGeneros = async (): Promise<GeneroModel[]> => {
  const response = await api.get<RespostaPaginada<GeneroModel>>("/generos/");
  return response.data.results;
}

export const getGenero = async (id: string): Promise<GeneroModel> => {
  const {data} = await api.get<GeneroModel>(`/generos/${id}/`)
  return data
}

export const updateGenero = async (
  id: string,
  payload: GeneroFormData
): Promise<GeneroModel> => {
  const {data} = await api.put(`/generos/${id}/`, payload)
  return data
}

export const deleteGenero = async (
  id: number
): Promise<void> => {
  await api.delete(`/generos/${id}/`)
}