import type { FaunaListModel } from "../FaunaType";
import { FaunaList } from "../componentes/FaunaList";
import { useNavigate } from "react-router-dom";
import { getListaFaunas } from "../FaunaApi";
import { useFetchList } from "../../../../shared/hooks/useFechList";
import { AsyncPage } from "../../../../app/layout/AsyncPage";



export const FaunaListPage = () => {
  const navigate = useNavigate();
  const {data: faunaList, loading, error} = useFetchList<FaunaListModel>(getListaFaunas);


  if (loading) {
    return <p>Carregando fauna...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={faunaList}
      loadingMessage="Carregando fauna..."
      emptyMessage="Nenhuma fauna cadastrada ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Fauna</h1>
            <p className="mt-1 text-slate-600">
              Gerencie a fauna do seu aquário
            </p>
          </div>

          <button
            onClick={() => navigate("/fauna/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Nova Fauna
          </button>
        </div>

        <FaunaList faunaList={faunaList} />
      </div>
    </AsyncPage>
  );
};