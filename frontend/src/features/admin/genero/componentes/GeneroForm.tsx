import { useForm } from "react-hook-form";
import { generoSchema, type GeneroFormSchema, type GeneroFormData } from "../GeneroType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../shared/components/ui/Input";
import type { FamiliaModel } from "../../familia/FamiliaType";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/Button";

interface GeneroFormProps {
  initialValue?: GeneroFormData;
  onSubmit: (data: GeneroFormData) => void;
  onCancel: () => void;
  familias: FamiliaModel[];
  isLoading?: boolean;
}

export const GeneroForm = ({
  initialValue: initialValua, onSubmit, isLoading, onCancel, familias
}: GeneroFormProps) => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<GeneroFormSchema>({
    resolver: zodResolver(generoSchema),
    values: initialValua,
    resetOptions: {
      keepDirtyValues: true,
    },
  });


  const familiaOptions = familias?.map((familia) => ({
    value: String(familia.id),
    label: familia.nome_cientifico,
  })) ?? [];

  const onFormSubmit = (data: GeneroFormSchema) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome Científico"
          placeholder="Ex: Paracheirodon"
          register={register("nome_cientifico")}
          error={errors.nome_cientifico}

        />
        <Select
          label="Familia *"
          options={familiaOptions}
          register={register("familia")}
          error={errors.familia}
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
  )
}