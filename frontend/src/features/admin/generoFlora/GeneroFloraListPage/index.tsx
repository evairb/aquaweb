import { useNavigate } from "react-router-dom"
import { useFetchList } from "../../../../shared/hooks/useFechList";
import type { GeneroFloraModel } from "../GeneroFloraType";
import { deleteGeneroFlora, getGeneroFloraList } from "../GeneroFloraApi";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";
import { AsyncPage } from "../../../../app/layout/AsyncPage";
import { DataTable } from "../../../../shared/components/DataTable";

export const GeneroFloraListPage = () => {
  const navigate = useNavigate();

  const { data: generoFloraList, loading, error, refetch } = useFetchList<GeneroFloraModel>(getGeneroFloraList);

  const handleEdit = (genero: GeneroFloraModel) => {
    navigate(`/admin/genero-flora/${genero.id}/editar`)
  }

  const handleDelete = async (genero: GeneroFloraModel) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o grupo "${genero.nome}"?`
    );

    if (!confirmou) return;

    try {
      await deleteGeneroFlora(genero.id)
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
      render: (item: GeneroFloraModel) => item.descricao || "—",
    },
  ] as const;


  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={generoFloraList}
      loadingMessage="Carregando genero de flora..."
      emptyMessage="Nenhum genero de flora cadastrado ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Genero de Flora</h1>
            <p className="mt-1 text-slate-600">
              Gerencie os generos de floras
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/genero-flora/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Novo Genero
          </button>
        </div>

        <DataTable
          data={generoFloraList}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          emptyMessage="Nenhum grupo comercial cadastrado ainda."
        />
      </div>
    </AsyncPage>
  )
}