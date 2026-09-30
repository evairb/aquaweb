import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginPayload, RegistroPayload, Usuario } from "../../shared/types/auth";
import * as authApi from "../../shared/api/auth"

interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  carregando: boolean;
  isAdmin: boolean;
  isLoja: boolean;
  isAdminOrLoja: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registrar: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setCarregando(false);
      return
    }

    authApi
      .buscarUsuarioAtual()
      .then((usuarioAtual) => {
        setUsuario(usuarioAtual);
      })
      .catch(() => {
        setUsuario(null);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const login = async (payload: LoginPayload): Promise<void> => {
    const resposta = await authApi.login(payload);
    setUsuario(resposta.usuario)
  };

  const registrar = async (
    payload: RegistroPayload
  ): Promise<void> => {
    const resposta = await authApi.registrar(payload);
    setUsuario(resposta.usuario);
  };

  const logout = (): void => {
    authApi.logout();
    setUsuario(null);
  };


  const tipoConta = usuario?.perfil?.tipo_conta ?? "usuario";
  const isAdmin = tipoConta === "admin";
  const isLoja = tipoConta === "loja";
  const isAdminOrLoja = isAdmin || isLoja;
  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        isAdmin,
        isLoja,
        isAdminOrLoja,
        carregando,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de um AuthProvider"
    );
  }
  return context;
}