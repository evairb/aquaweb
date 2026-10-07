import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { GeneroFloraFormData } from "../GeneroFloraType";
import { GeneroFloraForm } from "../componentes/GeneroFloraForm";
import { createGeneroFlora, getGeneroFlora, updateGeneroFlora } from "../GeneroFloraApi";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";

export const GeneroFloraFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [generoFlora, setGeneroFlora] = useState<GeneroFloraFormData | undefined>(undefined);

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    if (!isEditing && !id) return;

    try {
      setLoading(true);
      const data = await getGeneroFlora(Number(id))
      setGeneroFlora(data)
      setError(false)
    } catch (err) {
      console.log(err)
      toast.error(messagesComums.error.load)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: GeneroFloraFormData) => {
    try {
      if (isEditing && id) {
        await updateGeneroFlora(Number(id), data);
        toast.success(messagesComums.success.update)
      }
      else {
        await createGeneroFlora(data)
        toast.success(messagesComums.success.create)
      }

      navigate('/admin/genero-flora')
    } catch (error) {
      console.log("Erro ao carregar opções", error)
      toast.error(messagesComums.error.create)
    }
  }
  
  const handleCancel = () => {
    navigate("/admin/genero-flora")
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {
            isEditing
              ? "Editar Genero"
              : "Novo Genero"
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
          <p className="text-red-600">Erro ao carregar os dados do genero</p>
        ) : (
          <GeneroFloraForm onSubmit={handleSubmit} onCancel={handleCancel} initialValue={generoFlora} />
        )}
      </div>
    </div>
  )
}