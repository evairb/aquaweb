import { useForm } from "react-hook-form";
import { type FiltroFormSchema, filtroSchema, type FiltroFormData } from "../FiltroType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../../../shared/components/ui/Input";
import { FileInput } from "../../../../shared/components/ui/FileInput";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";
import { Select } from "../../../../shared/components/ui/Select";

interface FiltroFormProps {
  initialValue?: FiltroFormData;
  imagemAtual?: string;
  onSubmit: (data: FiltroFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const FiltroForm = ({ initialValue, onSubmit, isLoading, onCancel }: FiltroFormProps) => {
  const inicializado = useRef(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FiltroFormSchema>({
    resolver: zodResolver(filtroSchema),
    defaultValues: initialValue,
  });

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

  const onFormSubmit = (data: FiltroFormSchema) => {
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Filtro:"
          register={register('nome')}
          error={errors.nome}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Marca"
          placeholder="Marca"
          register={register('marca')}
          error={errors.marca}
        />

        <Input
          label="Modelo"
          placeholder="Modelo"
          register={register('modelo')}
          error={errors.modelo}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Litragem minima indicada"
          type="number"
          step="1"
          placeholder="Ex: 10 litros"
          register={register('litros_min_indicado', { valueAsNumber: true })}
          error={errors.litros_min_indicado}
        />

        <Input
          label="Litragem maxima indicada"
          type="number"
          step="1"
          placeholder="Ex: 10 litros"
          register={register('litros_max_indicado', { valueAsNumber: true })}
          error={errors.litros_max_indicado}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Tipo de filtro *"
          options={[
            { value: "interno", label: "Interno" },
            { value: "externo", label: "Externo" },
            { value: "canister", label: "Canister" },
            { value: "mochila", label: "Mochila" },
            { value: "sump", label: "Sump" },
          ]}
          register={register("tipo_filtro")}
          error={errors.tipo_filtro}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Vazao em litros hora"
          type="number"
          step="1"
          placeholder="Ex: 250 L/H"
          register={register('vazao_lh', { valueAsNumber: true })}
          error={errors.vazao_lh}
        />

        <Input
          label="Numeros de estagios de filtragem"
          type="number"
          step="1"
          placeholder="Ex: 3 (mecânica/biológica/química)"
          register={register('numero_estagios', { valueAsNumber: true })}
          error={errors.numero_estagios}
        />
      </div>

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
            alt={initialValue?.nome}
            className="h-32 w-32 rounded-lg object-cover"
          />
        </div>
      ) : null}

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