import z from "zod";
import type { GeneroFloraModel } from "../../admin/generoFlora/GeneroFloraType";

// 1. SCHEMA 
export const floraSchema = z.object({
  nome_popular: z.string().min(1, "Informe o nome popular"),
  epiteto_especifico: z.string().min(1, "Informe o epíteto específico"),
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

  genero: z.string().min(1, "Selecione um gênero"),

  necessidade_luz: z.enum(["baixa", "media", "alta"], {
    message: "Selecione o nivel",
  }),
  velocidade_crescimento: z.enum(["lenta", "media", "rapida"], {
    message: "Selecione o velocidade",
  }),
  posicao_plantio: z.enum(["fundo", "meio", "flutuante", "epifita"], {
    message: "Selecione o posicionamento",
  }),
  necessidade_co2: z.boolean(),
  sensivel_a_herbivoros: z.boolean(),
})

// 2. FORM DATA
export type FloraFormData = z.infer<typeof floraSchema>;

// 3. MODEL
export interface FloraModel {
  id: number;
  nome_popular: string;
  epiteto_especifico: string;
  origem: string;
  imagem: string;
  descricao: string;
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  gh_min: number;
  gh_max: number;

  genero: GeneroFloraModel;

  necessidade_luz: "baixa" | "media" | "alta";
  necessidade_co2: boolean;
  velocidade_crescimento: "lenta" | "media" | "rapida";

  posicao_plantio: "fundo" | "meio" | "flutuante" | "epifita";

  sensivel_a_herbivoros: boolean;
}

export interface FloraListModel {
  id: number;
  nome_popular: string;
  epiteto_especifico: string;
  necessidade_luz: boolean;
  imagem?: string;
}

// 4. PAYLOAD
export interface FloraPayload {
  nome_popular: string;
  epiteto_especifico: string;
  origem: string;
  imagem?: File;
  descricao?: string;
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  gh_min: number;
  gh_max: number;

  genero: number;
  necessidade_luz: "baixa" | "media" | "alta";
  necessidade_co2: boolean;
  velocidade_crescimento: "lenta" | "media" | "rapida";

  posicao_plantio: "fundo" | "meio" | "flutuante" | "epifita";
  sensivel_a_herbivoros: boolean;
}