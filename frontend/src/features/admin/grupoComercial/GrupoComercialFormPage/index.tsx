import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { GrupoComercialFormData } from "../GrupoComercialType";
import { createGrupoComercial, getGrupoComercial, updateGrupoComercial } from "../GrupoComercialApi";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";
import { GrupoComercialForm } from "../components/GrupoComercialForm";

export const GrupoComercialFormPage = () => {
  const navigate = useNavigate();
  const {id} = useParams()
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [grupoComercial, setGrupoComercial] = useState<GrupoComercialFormData | undefined>(undefined);

  useEffect(() => {
    loadData()
  }, [id]);

  const loadData = async () => {
    if (!isEditing && !id) return;

    try {
      setLoading(true);
      const data = await getGrupoComercial(Number(id))
      setGrupoComercial(data)
      setError(false)
    } catch (err) {
      console.log(err)
      toast.error(messagesComums.error.load)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: GrupoComercialFormData) => {
    try {
      if (isEditing && id) {
        await updateGrupoComercial(Number(id), data);
        toast.success(messagesComums.success.update)
      }
      else {
        await createGrupoComercial(data)
        toast.success(messagesComums.success.create)
      }

      navigate('/admin/grupo-comercial')
    } catch (error) {
      console.log("Erro ao carregar opções", error)
      toast.error(messagesComums.error.create)
    }
  };

  const handleCancel = () => {
    navigate("/admin/grupo-comercial")
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {
            isEditing
              ? "Editar Grupo Comercial"
              : "Nova Grupo Comercial"
          }
        </h1>

        <p className="mt-1 text-slate-600">
          Preencha as informações abaixo para {
            isEditing
            ? "atualizar"
            : "cadastrar"
          } um novo grupo
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">Erro ao carregar os dados do grupo</p>
        ) :(
          <GrupoComercialForm onSubmit={handleSubmit} onCancel={handleCancel} initialValue={grupoComercial} />
        )}
      </div>
    </div>
  )
}