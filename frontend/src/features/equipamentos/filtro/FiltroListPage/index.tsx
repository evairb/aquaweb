
import { useNavigate } from "react-router-dom";
import { EquipamentoCard } from "../../componentes/EquipamentoCard";
import { getFiltrosLista, deleteFiltro } from "../FiltroApi";
import type { FiltroModel } from "../FiltroType";
import { useFetchList } from "../../../../shared/hooks/useFechList";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";
import { AsyncPage } from "../../../../app/layout/AsyncPage";

export const FiltroListPage = () => {
  const navigate = useNavigate();

  const {
    data: filtros,
    loading,
    error,
    refetch,
  } = useFetchList<FiltroModel>(getFiltrosLista);

  const handleDelete = async (filtro: FiltroModel) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o grupo "${filtro.nome}"?`
    );

    if (!confirmou) return;

    try {
      await deleteFiltro(filtro.id)
      toast.success(messagesComums.success.delete)
      refetch()
    } catch (err) {
      console.log(err)
      toast.error(messagesComums.error.delete)
    }
  };


  if (loading) {
    return <div className="p-6">Carregando filtros...</div>;
  }

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={filtros}
      loadingMessage="Carregando filtros..."
      emptyMessage="Nenhum filtro cadastrado ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Filtros
            </h1>
            <p className="mt-1 text-slate-600">
              Gerencie os filtros para aquários.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/equipamentos/filtros/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Novo Filtro
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtros.map((filtro) => (
            <EquipamentoCard
              key={filtro.id}
              id={filtro.id}
              nome={filtro.nome}
              marca={filtro.marca}
              modelo={filtro.modelo}
              imagem={filtro.imagem ?? undefined}
              detalhes={`${filtro.tipo_filtro_display ?? filtro.tipo_filtro} • ${filtro.vazao_lh} L/h • ${filtro.numero_estagios} estágio(s)`}
              hrefEditar={`/equipamentos/filtros/${filtro.id}/editar`}
              onExcluir={() => handleDelete(filtro)}
            />
          ))}
        </div>
      </div>
    </AsyncPage>
  );
};