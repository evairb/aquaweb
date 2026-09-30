import { useNavigate } from "react-router-dom"
import { useFetchList } from "../../../../shared/hooks/useFechList";
import type { GrupoComercialModel } from "../GrupoComercialType";
import { deleteGrupoComercial, getGrupoComercialList } from "../GrupoComercialApi";
import { AsyncPage } from "../../../../app/layout/AsyncPage";
import { DataTable } from "../../../../shared/components/DataTable";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";


export const GrupoComercialListPage = () => {
  const navigate = useNavigate();

  const { data: grupoComercialList, loading, error, refetch } = useFetchList<GrupoComercialModel>(getGrupoComercialList);

  const handleEdit = (grupo: GrupoComercialModel) => {
    navigate(`/admin/grupo-comercial/${grupo.id}/editar`)
  }

  const handleDelete = async (grupo: GrupoComercialModel) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o grupo "${grupo.nome}"?`
    );

    if (!confirmou) return;

    try {
      await deleteGrupoComercial(grupo.id)
      toast.success(messagesComums.success.delete)
      refetch()
    } catch (err) {
      console.log(err)
      toast.error(messagesComums.error.delete)
    }
  };

  const columns = [
    {
      key: "nome" as const,
      header: "Grupo",
    },
    {
      key: "descricao" as const,
      header: "Descrição",
      render: (item: GrupoComercialModel) => item.descricao || "—",
    },
  ] as const;

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={grupoComercialList}
      loadingMessage="Carregando grupos comerciais..."
      emptyMessage="Nenhum grupo comercial cadastrado ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Grupos Comerciais</h1>
            <p className="mt-1 text-slate-600">
              Gerencie os grupos comerciais da fauna
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/grupo-comercial/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Novo Grupo
          </button>
        </div>

        <DataTable 
          data={grupoComercialList}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          emptyMessage="Nenhum grupo comercial cadastrado ainda."
        />
      </div>
    </AsyncPage>
  )
}