import { z } from "zod";
import type { GeneroModel } from "../../admin/genero/GeneroType";
import type { GrupoComercialModel } from "../../admin/grupoComercial/GrupoComercialType";

// 1. SCHEMA (usado pelo formulário)
export const faunaSchema = z.object({
  nome_popular: z.string().min(1, "Informe o nome popular"),
  epiteto_especifico: z.string().min(1, "Informe o epíteto específico"),
  genero: z.string().min(1, "Selecione um gênero"),
  grupo_comercial: z.string().optional(),
  origem: z.string().min(1, "Informe a origem"),
  imagem: z
    .union([z.instanceof(FileList), z.string()])
    .optional()
    .refine(
      (val) => !val || !(val instanceof FileList) || val.length <= 1,
      "Selecione apenas uma imagem"
    ),
  descricao: z.string().optional(),

  ph_min: z.number().min(0, "pH mínimo inválido"),
  ph_max: z.number().min(0, "pH máximo inválido"),
  temp_min: z.number().min(0, "Temperatura mínima inválida"),
  temp_max: z.number().min(0, "Temperatura máxima inválida"),
  gh_min: z.number().min(0, "GH mínimo inválido"),
  gh_max: z.number().min(0, "GH máximo inválido"),

  tipo: z.enum(["peixe", "invertebrado", "anfibio", "reptil", "coral"], {
    message: "Selecione um tipo",
  }),
  temperamento: z.enum(["pacifico", "semi-agressivo", "agressivo", "territorial"], {
    message: "Selecione um temperamento",
  }),
  tamanho_adulto_cm: z.number().min(0, "Tamanho inválido"),
  litragem_minima: z.number().min(0, "Litragem inválida"),
  nivel_agua: z.enum(["fundo", "meio", "superficie", "todos"], {
    message: "Selecione um nível",
  }),
  dieta: z.enum(["herbivoro", "carnivoro", "onivoro", "filtrador"], {
    message: "Selecione uma dieta",
  }),
  comportamento_social: z.enum(["solitario", "casal", "cardume", "colonia"], {
    message: "Selecione um comportamento",
  }),
  tamanho_minimo_grupo: z.number().min(1, "Tamanho mínimo do grupo inválido"),
  come_plantas: z.boolean(),
});

// 2. FORM DATA (o que o react-hook-form manipula)
export type FaunaFormData = z.infer<typeof faunaSchema>;

// 3. MODEL (o que a API retorna no GET)
export interface FaunaModel {
  id: number;
  genero: GeneroModel;
  epiteto_especifico: string;
  grupo_comercial: GrupoComercialModel | null;
  nome_popular: string;
  origem: string;
  imagem: string;
  descricao: string;
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  gh_min: number;
  gh_max: number;
  tipo: "peixe" | "invertebrado" | "anfibio" | "reptil" | "coral";
  temperamento: "pacifico" | "semi-agressivo" | "agressivo" | "territorial";
  tamanho_adulto_cm: number;
  litragem_minima: number;
  nivel_agua: "fundo" | "meio" | "superficie" | "todos";
  dieta: "herbivoro" | "carnivoro" | "onivoro" | "filtrador";
  comportamento_social: "solitario" | "casal" | "cardume" | "colonia";
  tamanho_minimo_grupo: number;
  come_plantas: boolean;
}

export interface FaunaListModel {
  id: number;
  nome_popular: string;
  epiteto_especifico: string;
  tipo: "peixe" | "invertebrado" | "anfibio" | "reptil" | "coral";
  imagem?: string;
}

// 4. PAYLOAD (o que vai pro backend no POST/PUT)
export interface FaunaPayload {
  nome_popular: string;
  epiteto_especifico: string;
  genero: number;
  grupo_comercial: number | null;
  origem: string;
  imagem?: File;
  descricao?: string;
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  gh_min: number;
  gh_max: number;
  tipo: "peixe" | "invertebrado" | "anfibio" | "reptil" | "coral";
  temperamento: "pacifico" | "semi-agressivo" | "agressivo" | "territorial";
  tamanho_adulto_cm: number;
  litragem_minima: number;
  nivel_agua: "fundo" | "meio" | "superficie" | "todos";
  dieta: "herbivoro" | "carnivoro" | "onivoro" | "filtrador";
  comportamento_social: "solitario" | "casal" | "cardume" | "colonia";
  tamanho_minimo_grupo: number;
  come_plantas: boolean;
}