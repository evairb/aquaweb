import { useForm } from "react-hook-form";
import { grupoComercialSchema, type GrupoComercialFormData, type GrupoComercialFormSchema } from "../GrupoComercialType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Input } from "../../../../shared/components/ui/Input";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";

interface GrupoComercialFormProps {
  initialValue?: GrupoComercialFormData;
  onSubmit: (data: GrupoComercialFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const GrupoComercialForm = ({
  initialValue,
  onSubmit,
  isLoading,
  onCancel
}: GrupoComercialFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<GrupoComercialFormSchema>({
    resolver: zodResolver(grupoComercialSchema),
    values: initialValue,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (initialValue) {
      reset(initialValue)
    }
  }, [initialValue, reset]);

  const onFormSubmit = (data: GrupoComercialFormSchema) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Ex: Tetra, Bettas"
          register={register("nome")}
          error={errors.nome}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <Textarea
          label="Descricao"
          placeholder="Digite a descrição"
          rows={6}
          register={register("descricao")}
          error={errors.descricao}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={isLoading}>
          Salvar
        </Button>

        <Button type="submit" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}