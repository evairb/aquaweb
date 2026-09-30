import { useNavigate } from "react-router-dom"
import { useFetchList } from "../../../../shared/hooks/useFechList";
import type { GeneroModel } from "../GeneroType";
import { getListaGeneros } from "../GeneroApi";
import { AsyncPage } from "../../../../app/layout/AsyncPage";
import { DataTable } from "../../../../shared/components/DataTable";
import { deleteGenero } from "../GeneroApi";

export const GeneroListPage = () => {
  const navigate = useNavigate();

  const { data: generoList, loading, error, refetch } = useFetchList<GeneroModel>(getListaGeneros);

  const handleEdit = (genero: GeneroModel) => {
    navigate(`/admin/genero/${genero.id}/editar`)
  }

  const handleDelete = async (genero: GeneroModel) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o gênero "${genero.nome_cientifico}"?`
    );

    if (!confirmou) return;

    try {
      await deleteGenero(genero.id)
      alert("Genero excluída com sucesso!");
      refetch()
    } catch (error) {
      console.log(error)
      alert("Erro ao excluir genero. Verifique se ela não está em uso.")
    }
  };

  const columns = [
    {
      key: "nome_cientifico" as const,
      header: "Genero",
      render: (item: GeneroModel) => item.nome_cientifico,
    },
  ] as const

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={generoList}
      loadingMessage="Carregando gêneros..."
      emptyMessage="Nenhuma gênero cadastrada ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Gêneros</h1>
            <p className="mt-1 text-slate-600">
              Gerencie os gêneros taxonômicos da fauna
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/genero/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Novo Gênero
          </button>
        </div>

        <DataTable
          data={generoList}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Nenhum gênero cadastrado ainda."
        />

      </div>
    </AsyncPage>
  )
}