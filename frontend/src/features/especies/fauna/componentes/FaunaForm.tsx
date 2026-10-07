import type z from "zod";
import { faunaSchema } from "../FaunaType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Textarea } from "../../../../shared/components/ui/Textarea";
import { Button } from "../../../../shared/components/ui/Button";
import { FileInput } from "../../../../shared/components/ui/FileInput";
import { useEffect, useRef, useState } from "react";
import type { GeneroModel } from "../../../admin/genero/GeneroType";
import type { GrupoComercialModel } from "../../../admin/grupoComercial/GrupoComercialType";


type FaunaForm = z.infer<typeof faunaSchema>;

interface FaunaFormProps {
  initialValue?: FaunaForm;
  onSubmit: (data: FaunaForm) => void;
  isLoading?: boolean;
  onCancel: () => void;
  generos: GeneroModel[];
  gruposComerciais: GrupoComercialModel[];
}

export const FaunaForm = ({
  initialValue,
  onSubmit,
  onCancel,
  isLoading = false,
  generos,
  gruposComerciais
}: FaunaFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaunaForm>({
    resolver: zodResolver(faunaSchema),
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
    data: FaunaForm
  ) => {
    console.log("Dados validados:", data);
    onSubmit(data);
  }

  const generoOptions = generos?.map((genero) => ({
    value: String(genero.id),
    label: `${genero.nome_cientifico} (${genero.familia_nome})`,
  })) ?? [];

  const grupoComercialOptions = gruposComerciais?.map((grupo) => ({
    value: String(grupo.id),
    label: grupo.nome,
  })) ?? [];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Nome e Nome Científico */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome Comum *"
          placeholder="Ex: Betta"
          register={register("nome_popular")}
          error={errors.nome_popular}
        />

        <Input
          label="Epíteto Específico *"
          placeholder="Ex: Betta splendens"
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

        <Select
          label="Grupo Comercial *"
          options={grupoComercialOptions}
          register={register("grupo_comercial")}
          error={errors.grupo_comercial}
        />
      </div>

      {/* Origem */}
      <Input
        label="Origem *"
        placeholder="Ex: Sudeste Asiático"
        register={register("origem")}
        error={errors.origem}
      />
      {/* Tipo e Temperamento */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Tipo *"
          options={[
            { value: "peixe", label: "Peixe" },
            { value: "invertebrado", label: "Invertebrado" },
            { value: "anfibio", label: "Anfíbio" },
            { value: "reptil", label: "Réptil" },
            { value: "coral", label: "Coral" },
          ]}
          register={register("tipo")}
          error={errors.tipo}
        />

        <Select
          label="Temperamento *"
          options={[
            { value: "pacifico", label: "Pacífico" },
            { value: "semi-agressivo", label: "Semi-agressivo" },
            { value: "agressivo", label: "Agressivo" },
            { value: "territorial", label: "Territorial" },
          ]}
          register={register("temperamento")}
          error={errors.temperamento}
        />
      </div>

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

      {/* Tamanho e Litragem */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Tamanho Adulto (cm) *"
          type="number"
          step="0.1"
          placeholder="Ex: 5"
          register={register("tamanho_adulto_cm", { valueAsNumber: true })}
          error={errors.tamanho_adulto_cm}
        />

        <Input
          label="Litragem Mínima (L) *"
          type="number"
          step="1"
          placeholder="Ex: 20"
          register={register("litragem_minima", { valueAsNumber: true })}
          error={errors.litragem_minima}
        />
      </div>

      {/* Nível da Água e Dieta */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Nível da Água *"
          options={[
            { value: "fundo", label: "Fundo" },
            { value: "meio", label: "Meio" },
            { value: "superficie", label: "Superfície" },
            { value: "todos", label: "Todos" },
          ]}
          register={register("nivel_agua")}
          error={errors.nivel_agua}
        />

        <Select
          label="Dieta *"
          options={[
            { value: "herbivoro", label: "Herbívoro" },
            { value: "carnivoro", label: "Carnívoro" },
            { value: "onivoro", label: "Onívoro" },
            { value: "filtrador", label: "Filtrador" },
          ]}
          register={register("dieta")}
          error={errors.dieta}
        />
      </div>

      {/* Comportamento Social e Tamanho do Grupo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Comportamento Social *"
          options={[
            { value: "solitario", label: "Solitário" },
            { value: "casal", label: "Casal" },
            { value: "cardume", label: "Cardume" },
            { value: "colonia", label: "Colônia" },
          ]}
          register={register("comportamento_social")}
          error={errors.comportamento_social}
        />

        <Input
          label="Tamanho Mínimo do Grupo *"
          type="number"
          step="1"
          placeholder="Ex: 1"
          register={register("tamanho_minimo_grupo", { valueAsNumber: true })}
          error={errors.tamanho_minimo_grupo}
        />
      </div>

      {/* Come Plantas */}
      <Checkbox
        label="Come Plantas"
        register={register("come_plantas")}
        error={errors.come_plantas}
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