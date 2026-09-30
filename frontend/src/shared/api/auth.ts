import {api} from './client';
import type { AuthResponse, LoginPayload, RegistroPayload, Usuario } from '../types/auth';

export const registrar = async (
  payload: RegistroPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/registro/",
    payload
  );
  localStorage.setItem("access_token", response.data.access)
  localStorage.setItem("refresh_token", response.data.refresh)

  return response.data;
}

export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login/",
    payload
  );
  localStorage.setItem("access_token", response.data.access)
  localStorage.setItem("refresh_token", response.data.refresh)
  return response.data
}

export const buscarUsuarioAtual = async (): Promise<Usuario> => {
  const response = await api.get<Usuario>("/auth/me/");
  return response.data
}

export const logout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};