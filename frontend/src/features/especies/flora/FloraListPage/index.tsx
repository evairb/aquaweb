import { useNavigate } from "react-router-dom";
import { useFetchList } from "../../../../shared/hooks/useFechList";
import { AsyncPage } from "../../../../app/layout/AsyncPage";
import type { FloraListModel } from "../FloraType";
import { getListaFloras } from "../FloreApi";
import { FloraList } from "../componentes/FloraList";



export const FloraListPage = () => {
  const navigate = useNavigate();
  const { data: floraList, loading, error } = useFetchList<FloraListModel>(getListaFloras);

  if (loading) {
    return <p>Carregando flora...</p>;
  }

  if (error) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Flora</h1>
            <p className="mt-1 text-slate-600">
              {error}
            </p>
          </div>

          <button
            onClick={() => navigate("/flora/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Nova Flora
          </button>
        </div>
      </>)

  }

  return (
    <AsyncPage
      loading={loading}
      error={error}
      data={floraList}
      loadingMessage="Carregando flora..."
      emptyMessage="Nenhuma flora cadastrada ainda."
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2x1 font-bold text-slate-800">Flora</h1>
            <p className="mt-1 text-slate-600">
              Gerencie a flora do seu aquário
            </p>
          </div>

          <button
            onClick={() => navigate("/flora/novo")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Adicionar Nova Flora
          </button>
        </div>

        <FloraList floraList={floraList} />
      </div>
    </AsyncPage>
  );
};