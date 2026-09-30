import { useNavigate } from "react-router-dom"
import { useFetchList } from "../../../../shared/hooks/useFechList";
import { deleteFamilia, getListaFamilias } from "../FamiliaApi";
import type { FamiliaModel } from "../FamiliaType";
import { AsyncPage } from "../../../../app/layout/AsyncPage";

import { DataTable } from "../../../../shared/components/DataTable";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";

export const FamiliaListPage = () => {
  const navigate = useNavigate();

  const { data: familiaList, loading, error , refetch} = useFetchList<FamiliaModel>(getListaFamilias);

  const handleEdit = (familia: FamiliaModel) => {
    navigate(`/admin/familia/${familia.id}/editar`);
  };

  const handleDelete = async (familia: FamiliaModel) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir a família "${familia.nome_cientifico}"?`
    );

    if (!confirmou) return;

    try {
      await deleteFamilia(familia.id)
      toast.success(messagesComums.success.delete)
      refetch()
    } catch (error) {
      console.log(error)
      toast.error(messagesComums.error.delete)
    }
  };

  const columns = [
    {
      key: "nome_cientifico" as const,
      header: "Família",
    },
    {
      key: "descricao" as const,
      header: "Descrição",
      render: (item: FamiliaModel) => item.descricao || "—",
    },
  ] as const;

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={familiaList}
      loadingMessage="Carregando famílias..."
      emptyMessage="Nenhuma família cadastrada ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Famílias</h1>
            <p className="mt-1 text-slate-600">
              Gerencie as famílias taxonômicas da fauna
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/familia/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Nova Família
          </button>
        </div>

        <DataTable
          data={familiaList}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Nenhuma família cadastrada ainda."
        />
      </div>
    </AsyncPage>
  );
};