import type { ReactNode } from "react";

type AsyncPageProps<T extends { length: number }> = {
  loading: boolean;
  error: string | null;
  data: T | null;
  children: ReactNode;
  loadingMessage?: string;
  emptyMessage?: string;
}

export const AsyncPage = <T extends { length: number }>({
  loading,
  error,
  data,
  children,
  loadingMessage = "Carregando...",
  emptyMessage = "Nenhum dado encontrado.",
}: AsyncPageProps<T>) => {
  if (loading) {
    return <p>{loadingMessage}</p>;
  }

  if (error) {
    return (
      <div>
        <p>Erro ao carregar: {error}</p>
        {/* aqui você poderia receber um botão de retry via props também */}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return <>{children}</>;
}