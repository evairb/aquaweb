import { useForm } from "react-hook-form";
import { type GeneroFloraFormSchema, generoFloraSchema, type GeneroFloraFormData } from "../GeneroFloraType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Input } from "../../../../shared/components/ui/Input";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";

interface GeneroFloraFormProps {
  initialValue?: GeneroFloraFormData;
  onSubmit: (data: GeneroFloraFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const GeneroFloraForm = ({
  initialValue,
  onSubmit,
  isLoading,
  onCancel
}: GeneroFloraFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<GeneroFloraFormSchema>({
    resolver: zodResolver(generoFloraSchema),
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

  const onFormSubmit = (data: GeneroFloraFormSchema) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 mdÇgrid-cols-2">
        <Input 
          label="Nome"
          placeholder="Ex: Hygrofila"
          register={register('nome')}
          error={errors.nome}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea 
          label="Descrição"
          placeholder="Digite a descrição"
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