import { useNavigate, useParams } from "react-router-dom"
import { FaunaForm } from "../componentes/FaunaForm";
import { createFauna, getFauna, updateFauna } from "../FaunaApi";
import type { GrupoComercialModel } from "../../../admin/grupoComercial/GrupoComercialType";
import type { GeneroModel } from "../../../admin/genero/GeneroType";
import { useEffect, useState } from "react";
import { getListaGeneros } from "../../../admin/genero/GeneroApi";
import { getGrupoComercialList } from "../../../admin/grupoComercial/GrupoComercialApi";
import type { FaunaFormData, FaunaModel, FaunaPayload } from "../FaunaType";

const faunaModelToFormData = (fauna: FaunaModel): FaunaFormData => ({
  nome_popular: fauna.nome_popular,
  epiteto_especifico: fauna.epiteto_especifico,
  genero: String(fauna.genero.id),
  grupo_comercial: fauna.grupo_comercial ? String(fauna.grupo_comercial.id) : "",
  origem: fauna.origem,
  imagem: fauna.imagem,
  descricao: fauna.descricao,

  ph_min: Number(fauna.ph_min),
  ph_max: Number(fauna.ph_max),
  temp_min: Number(fauna.temp_min),
  temp_max: Number(fauna.temp_max),
  gh_min: Number(fauna.gh_min),
  gh_max: Number(fauna.gh_max),

  tipo: fauna.tipo,
  temperamento: fauna.temperamento,
  tamanho_adulto_cm: Number(fauna.tamanho_adulto_cm),
  litragem_minima: Number(fauna.litragem_minima),
  nivel_agua: fauna.nivel_agua,
  dieta: fauna.dieta,
  comportamento_social: fauna.comportamento_social,
  tamanho_minimo_grupo: Number(fauna.tamanho_minimo_grupo),
  come_plantas: fauna.come_plantas,
});

const formDataToPayload = (data: FaunaFormData): FaunaPayload => ({
  nome_popular: data.nome_popular,
  epiteto_especifico: data.epiteto_especifico,
  genero: Number(data.genero),
  grupo_comercial: data.grupo_comercial ? Number(data.grupo_comercial) : null,
  origem: data.origem,
  imagem: data.imagem instanceof FileList && data.imagem.length > 0 ? data.imagem[0] : undefined,
  descricao: data.descricao,
  ph_min: data.ph_min,
  ph_max: data.ph_max,
  temp_min: data.temp_min,
  temp_max: data.temp_max,
  gh_min: data.gh_min,
  gh_max: data.gh_max,
  tipo: data.tipo,
  temperamento: data.temperamento,
  tamanho_adulto_cm: data.tamanho_adulto_cm,
  litragem_minima: data.litragem_minima,
  nivel_agua: data.nivel_agua,
  dieta: data.dieta,
  comportamento_social: data.comportamento_social,
  tamanho_minimo_grupo: data.tamanho_minimo_grupo,
  come_plantas: data.come_plantas,
});

export const FaunaFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [fauna, setFauna] = useState<FaunaModel | null>(null);
  const [generos, setGeneros] = useState<GeneroModel[]>([])
  const [gruposComerciais, setGruposComerciais] = useState<GrupoComercialModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [generoData, grupoData] = await Promise.all([
          getListaGeneros(),
          getGrupoComercialList(),
        ]);
        setGeneros(generoData);
        setGruposComerciais(grupoData);

        if (isEditing && id) {
          const faunaData = await getFauna(Number(id));
          setFauna(faunaData);
        }
      } catch (error) {
        console.error("Erro ao carregar opções", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  const handleSubmit = async (data: FaunaFormData) => {
    const payload = formDataToPayload(data);

    try {
      if (isEditing && fauna) {
        await updateFauna(fauna.id, payload);
      } else {
        await createFauna(payload);
      }
      navigate("/fauna")
    } catch (error) {
      console.error("Erro ao salvar fauna", error);
    }
  }

  const handleCancel = () => {
    navigate("/fauna");
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Carregando opções...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? "Editar Fauna" : "Adicionar Nova Fauna"}
        </h1>
        <p className="mt-1 text-slate-600">
          {isEditing
            ? "Atualize as informações da fauna abaixo"
            : "Preencha as informações abaixo para cadastrar uma nova fauna"}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <FaunaForm
          initialValue={fauna ? faunaModelToFormData(fauna) : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          generos={generos}
          gruposComerciais={gruposComerciais} />
      </div>
    </div>
  );
}