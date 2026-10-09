import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { floraSchema, type FloraFormData } from "../FloraType";
import type { GeneroFloraModel } from "../../../admin/generoFlora/GeneroFloraType";
import { FileInput } from "../../../../shared/components/ui/FileInput";


interface FloraFormProps {
  initialValue?: FloraFormData;
  onSubmit: (data: FloraFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
  generos: GeneroFloraModel[];

}

export const FloraForm = ({
  initialValue,
  onSubmit,
  onCancel,
  isLoading = false,
  generos
}: FloraFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FloraFormData>({
    resolver: zodResolver(floraSchema),
    defaultValues: initialValue,
  });

  const inicializado = useRef(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);

  useEffect(() => {
    if (!initialValue || inicializado.current) {
      return;
    }

    reset(initialValue);

    setImagemAtual(
      typeof initialValue.imagem === "string"
        ? initialValue.imagem
        : null
    );

    inicializado.current = true;
  }, [initialValue, reset]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Cria preview da nova imagem
    const previewUrl = URL.createObjectURL(file);

    // Mostra a nova imagem
    setPreview(previewUrl);

    // Remove a imagem antiga do estado
    setImagemAtual(null);
  };

  const onFormSubmit = (
    data: FloraFormData
  ) => {
    console.log("Dados validados:", data);
    onSubmit(data);
  }

  const generoOptions = generos?.map((genero) => ({
    value: String(genero.id),
    label: String(genero.nome),
  })) ?? [];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Nome e Nome Científico */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome Comum *"
          placeholder="Ex: Aguapé"
          register={register("nome_popular")}
          error={errors.nome_popular}
        />

        <Input
          label="Epíteto Específico *"
          placeholder="Ex: Crassipes"
          register={register("epiteto_especifico")}
          error={errors.epiteto_especifico}
        />
      </div>

      {/* Gênero e Grupo Comercial */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Gênero *"
          options={generoOptions}
          register={register("genero")}
          error={errors.genero}
        />
      </div>

      {/* Origem */}
      <Input
        label="Origem *"
        placeholder="Ex: Sudeste Asiático"
        register={register("origem")}
        error={errors.origem}
      />

      {/* pH e GH */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          label="pH Mínimo *"
          type="number"
          step="0.1"
          placeholder="Ex: 6.5"
          register={register("ph_min", { valueAsNumber: true })}
          error={errors.ph_min}
        />

        <Input
          label="pH Máximo *"
          type="number"
          step="0.1"
          placeholder="Ex: 7.5"
          register={register("ph_max", { valueAsNumber: true })}
          error={errors.ph_max}
        />

        <Input
          label="GH Mínimo *"
          type="number"
          step="0.1"
          placeholder="Ex: 2"
          register={register("gh_min", { valueAsNumber: true })}
          error={errors.gh_min}
        />

        <Input
          label="GH Máximo *"
          type="number"
          step="0.1"
          placeholder="Ex: 8"
          register={register("gh_max", { valueAsNumber: true })}
          error={errors.gh_max}
        />
      </div>

      {/* Temperatura */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Temp. Mínima (°C) *"
          type="number"
          step="0.1"
          placeholder="Ex: 24"
          register={register("temp_min", { valueAsNumber: true })}
          error={errors.temp_min}
        />

        <Input
          label="Temp. Máxima (°C) *"
          type="number"
          step="0.1"
          placeholder="Ex: 28"
          register={register("temp_max", { valueAsNumber: true })}
          error={errors.temp_max}
        />
      </div>

      {/* Nível da Água e Dieta */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Nivel nescessario de luz *"
          options={[
            { value: "baixa", label: "Baixa" },
            { value: "media", label: "Media" },
            { value: "alta", label: "Alta" },
          ]}
          register={register("necessidade_luz")}
          error={errors.necessidade_luz}
        />

        <Select
          label="Velocidade de crescimento *"
          options={[
            { value: "lenta", label: "Lenta" },
            { value: "media", label: "Media" },
            { value: "rapida", label: "Rapida" },
          ]}
          register={register("velocidade_crescimento")}
          error={errors.velocidade_crescimento}
        />
      </div>

      {/* Comportamento Social e Tamanho do Grupo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Posicao de plantio *"
          options={[
            { value: "fundo", label: "Fundo" },
            { value: "meio", label: "Meio" },
            { value: "flutuante", label: "Flutuante" },
            { value: "epifita", label: "Epifita" },
          ]}
          register={register("posicao_plantio")}
          error={errors.posicao_plantio}
        />

      </div>

      {/* Come Plantas */}
      <Checkbox
        label="Necessidade de CO2"
        register={register("necessidade_co2")}
        error={errors.necessidade_co2}
      />

      {/* Come Plantas */}
      <Checkbox
        label="Sensivel a Herbivoros"
        register={register("sensivel_a_herbivoros")}
        error={errors.sensivel_a_herbivoros}
      />

      {/* Imagem */}
      <FileInput
        label="Imagem"
        register={register("imagem", {
          onChange: handleImageChange,
        })}
        error={errors.imagem}
      />

      {/* Preview da imagem */}
      {preview ? (
        <div className="mt-2">
          <p className="text-sm text-slate-600 mb-2">
            Nova imagem:
          </p>

          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover"
          />
        </div>
      ) : imagemAtual ? (
        <div className="mt-2">
          <p className="text-sm text-slate-600 mb-2">
            Imagem atual:
          </p>

          <img
            src={imagemAtual}
            alt={initialValue?.nome_popular}
            className="h-32 w-32 rounded-lg object-cover"
          />
        </div>
      ) : null}

      {/* Descrição */}
      <Textarea
        label="Descrição"
        placeholder="Informações adicionais sobre a fauna..."
        register={register("descricao")}
        error={errors.descricao}
      />

      {/* Botões */}
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