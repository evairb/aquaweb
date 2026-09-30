import { api } from "../../../shared/api/client";
import type { RespostaPaginada } from "../../../shared/types/utils";
import type { GrupoComercialFormData, GrupoComercialModel } from "./GrupoComercialType";

export const createGrupoComercial = async (
  payload: GrupoComercialFormData
): Promise<GrupoComercialModel> => {
  const { data } = await api.post('/grupos-comerciais/', payload)
  return data
}

export const getGrupoComercial = async (id: number): Promise<GrupoComercialModel> => {
  const { data } = await api.get(`/grupos-comerciais/${id}/`)
  return data
}

export const getGrupoComercialList = async (): Promise<GrupoComercialModel[]> => {
  const response = await api.get<RespostaPaginada<GrupoComercialModel>>('/grupos-comerciais/')
  return response.data.results;
}

export const updateGrupoComercial = async (
  id: number,
  payload: GrupoComercialFormData
): Promise<GrupoComercialModel> => {
  const {data} = await api.put(`/grupos-comerciais/${id}/`, payload)
  return data
}

export const deleteGrupoComercial = async (id: number): Promise<void> => {
  await api.delete(`/grupos-comerciais/${id}/`)
}