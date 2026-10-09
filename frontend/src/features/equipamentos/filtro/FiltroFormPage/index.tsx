
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { FiltroFormData, FiltroModel, FiltroPayload } from "../FiltroType";
import { createFiltro, getFiltro, updateFiltro } from "../FiltroApi";
import { FiltroForm } from "../components/FiltroForm";
import { messagesComums } from "../../../../shared/messages/MessagesComums";


const formDataToPayload = (data: FiltroFormData): FiltroPayload => ({
  nome: data.nome,
  marca: data.marca,
  modelo: data.modelo,
  descricao: data.descricao,
  categoria: "filtro",
  litros_min_indicado: data.litros_min_indicado,
  litros_max_indicado: data.litros_max_indicado,
  tipo_filtro: data.tipo_filtro,
  vazao_lh: data.vazao_lh,
  numero_estagios: Number(data.numero_estagios),
  imagem: data.imagem instanceof FileList && data.imagem.length > 0 ? data.imagem[0] : undefined,
});

export const FiltroFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<FiltroModel | undefined>();
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    if (!isEditing && !id) return;

    try {
      setLoading(true);
      const data = await getFiltro(Number(id))
      setFiltro(data)
      setError(false)
    } catch (err) {
      console.log(err)
      toast.error(messagesComums.error.load)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: FiltroFormData) => {
    const payload = formDataToPayload(data);
    try {
      if (isEditing && filtro) {
        await updateFiltro(filtro.id, payload)
      } else {
        await createFiltro(payload)
        toast.success(messagesComums.success.create)
      }

      navigate('/equipamentos/filtros')
    } catch (error) {
      console.log("Erro ao carregar opções", error)
      toast.error(messagesComums.error.create)
    }
  };

  const handleCancel = () => {
    navigate("/equipamentos/filtros");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? "Editar Filtro" : "Novo Filtro"}
        </h1>
        <p className="mt-1 text-slate-600">
          Preencha as informações para{" "}
          {isEditing ? "atualizar" : "cadastrar"} um filtro.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : error || isEditing && !filtro ? (
          <p className="text-red-600">
            Não foi possível carregar os dados do filtro.
          </p>
        ) : (
          <FiltroForm
            initialValue={filtro ? filtro : undefined}
            imagemAtual={filtro?.imagem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};
