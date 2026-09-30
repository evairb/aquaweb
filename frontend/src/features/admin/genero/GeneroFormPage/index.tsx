import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { generoModelToFormData, type GeneroFormData } from "../GeneroType";
import { createGenero, getGenero, updateGenero } from "../GeneroApi";
import { GeneroForm } from "../componentes/GeneroForm";
import type { FamiliaModel } from "../../familia/FamiliaType";
import { getListaFamilias } from "../../familia/FamiliaApi";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";

export const GeneroFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [genero, setGenero] = useState<GeneroFormData | undefined>(undefined);
  const [familias, setFamilias] = useState<FamiliaModel[]>([]);

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true);

      const familiaData = await getListaFamilias();
      setFamilias(familiaData);

      if (isEditing && id) {
        const data = await getGenero(id);
        setGenero(generoModelToFormData(data))
      }

      setError(false);
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: GeneroFormData) => {
    try {
      if (isEditing && id) {
        await updateGenero(id, data);
        toast.success(messagesComums.success.update)
      } else {
        await createGenero(data);
        toast.success(messagesComums.success.create)
      }
      navigate('/admin/genero')
    } catch (error) {
      console.error("Erro ao carregar opções", error)
    }
  };

  const handleCancel = () => {
    navigate("/admin/genero")
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {
            isEditing
              ? "Editar Genero"
              : "Nova Genero"
          }
        </h1>
        <p className="mt-1 text-slate-600">
          Preencha as informações abaixo para {
            isEditing
              ? "atualizar"
              : "cadastrar"
          } um novo genero
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">Erro ao carregar os dados da família.</p>
        ) : (
          <GeneroForm onSubmit={handleSubmit} onCancel={handleCancel} initialValue={genero} familias={familias} />
        )}
      </div>
    </div>
  )
}