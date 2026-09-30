import { useNavigate, useParams } from "react-router-dom"
import { createFamilia, getFamilia, updateFamilia } from "../FamiliaApi";
import { FamiliaForm } from "../componentes/FamiliaForm";
import { useEffect, useState } from "react";
import type { FamiliaFormData } from "../FamiliaType";
import { toast } from "sonner";
import { messagesComums } from "../../../../shared/messages/MessagesComums";

export const FamiliaFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [familia, setFamilia] = useState<FamiliaFormData | undefined>(undefined);

  useEffect(() => {
    loadData()
  }, [id]);


  const loadData = async () => {
    if (!isEditing || !id) return;

    try {
      setLoading(true);
      const data  = await getFamilia(id);
      setFamilia(data);
      setError(false);
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: FamiliaFormData) => {
    try {
      if (isEditing && id) {
        await updateFamilia(id, data);
        toast.success(messagesComums.success.update)
      } else {
        await createFamilia(data);
        toast.success(messagesComums.success.create)
      }
      navigate('/admin/familia')

    } catch (error) {
      console.error("Erro ao carregar opções", error);
      toast.error(messagesComums.error.create)
    }
  };

  const handleCancel = () => {
    navigate("/admin/familia")
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {
            isEditing
              ? "Editar Familia"
              : "Nova Familia"
          }
        </h1>
        <p className="mt-1 text-slate-600">
          Preencha as informações abaixo para {
            isEditing
              ? "atualizar"
              : "cadastrar"
          } uma nova familia
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">Erro ao carregar os dados da família.</p>
        ) : (
          <FamiliaForm onSubmit={handleSubmit} onCancel={handleCancel} initialValue={familia} />
        )}
      </div>
    </div>
  )
}