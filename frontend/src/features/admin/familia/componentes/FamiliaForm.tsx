import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../shared/components/ui/Input";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";
import { familiaSchema, type FamiliaFormData, type FamiliaFormSchema } from "../FamiliaType";
import { useEffect } from "react";

interface FamiliaFormProps {
  initialValue?: FamiliaFormData;
  onSubmit: (data: FamiliaFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const FamiliaForm = ({
  initialValue,
  onSubmit,
  isLoading,
  onCancel,
}: FamiliaFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamiliaFormSchema>({
    resolver: zodResolver(familiaSchema),
    values: initialValue,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (initialValue) {
      reset(initialValue);
    }
  }, [initialValue, reset]);

  const onFormSubmit = (data: FamiliaFormSchema) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome Científico *"
          placeholder="Ex: Characidae"
          register={register("nome_cientifico")}
          error={errors.nome_cientifico}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="Descrição"
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

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};