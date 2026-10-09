import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import type { FloraFormData, FloraModel, FloraPayload } from "../FloraType";
import type { GeneroFloraModel } from "../../../admin/generoFlora/GeneroFloraType";
import { getGeneroFloraList } from "../../../admin/generoFlora/GeneroFloraApi";
import { createFlora, getFlora, updateFlora } from "../FloreApi";
import { FloraForm } from "../componentes/FloraForm";

const floraModelToFormData = (flora: FloraModel): FloraFormData => ({
  nome_popular: flora.nome_popular,
  epiteto_especifico: flora.epiteto_especifico,
  origem: flora.origem,
  imagem: flora.imagem,
  descricao: flora.descricao,
  ph_min: Number(flora.ph_min),
  ph_max: Number(flora.ph_max),
  temp_min: Number(flora.temp_min),
  temp_max: Number(flora.temp_max),
  gh_min: Number(flora.gh_min),
  gh_max: Number(flora.gh_max),
  
  genero: String(flora.genero),

  necessidade_luz: flora.necessidade_luz,
  velocidade_crescimento: flora.velocidade_crescimento,

  posicao_plantio: flora.posicao_plantio,
  necessidade_co2: flora.necessidade_co2,
  sensivel_a_herbivoros: flora.sensivel_a_herbivoros,
});

const formDataToPayload = (data: FloraFormData): FloraPayload => ({
  nome_popular: data.nome_popular,
  epiteto_especifico: data.epiteto_especifico,
  genero: Number(data.genero),
  origem: data.origem,
  imagem: data.imagem instanceof FileList && data.imagem.length > 0 ? data.imagem[0] : undefined,
  descricao: data.descricao,
  ph_min: data.ph_min,
  ph_max: data.ph_max,
  temp_min: data.temp_min,
  temp_max: data.temp_max,
  gh_min: data.gh_min,
  gh_max: data.gh_max,

  necessidade_luz: data.necessidade_luz,
  velocidade_crescimento: data.velocidade_crescimento,
  posicao_plantio: data.posicao_plantio,
  necessidade_co2: data.necessidade_co2,
  sensivel_a_herbivoros: data.sensivel_a_herbivoros,
});

export const FloraFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [flora, setFlora] = useState<FloraModel | null>(null);
  const [generos, setGeneros] = useState<GeneroFloraModel[]>([])

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const [generoData] = await Promise.all([
          getGeneroFloraList(),
        ]);
        setGeneros(generoData);

        if (isEditing && id) {
          const floraData = await getFlora(Number(id));
          setFlora(floraData);
        }
      } catch (error) {
        console.error("Erro ao carregar opções", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  const handleSubmit = async (data: FloraFormData) => {
    console.log("1 - FORM DATA:", data);

    const payload = formDataToPayload(data);

    console.log("2 - PAYLOAD:", payload);

    try {
      if (isEditing && flora) {
        console.log("3 - ATUALIZANDO:", flora.id);

        await updateFlora(flora.id, payload);

        console.log("4 - ATUALIZADO COM SUCESSO");
      } else {
        await createFlora(payload);
      }

      navigate("/flora");
    } catch (error) {
      console.error("ERRO AO SALVAR:", error);
    }
  };

  const handleCancel = () => {
    navigate("/flora");
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Carregando opções...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? "Editar Flora" : "Adicionar Nova Flora"}
        </h1>
        <p className="mt-1 text-slate-600">
          {isEditing
            ? "Atualize as informações da flora abaixo"
            : "Preencha as informações abaixo para cadastrar uma nova flora"}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <FloraForm
          initialValue={flora ? floraModelToFormData(flora) : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          generos={generos} />
      </div>
    </div>
  );
}