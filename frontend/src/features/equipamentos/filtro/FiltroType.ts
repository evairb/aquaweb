
import { z } from "zod";

// 1. SCHEMA
export const filtroSchema = z.object({
  nome: z.string().min(1, "Informe o nome do filtro"),
  marca: z.string(),
  modelo: z.string(),
  descricao: z.string(),
  litros_min_indicado: z.number().min(0, "Informe a litragem mínima"),
  litros_max_indicado: z.number().min(0, "Informe a litragem maxima"),
  tipo_filtro: z.enum([
    "interno",
    "externo",
    "canister",
    "mochila",
    "sump",
  ]),
  vazao_lh: z.number().min(1, "Informe a vazão"),
  numero_estagios: z.number().min(1, "Informe os estágios de filtragem"),
  imagem: z
    .union([z.instanceof(FileList), z.string()])
    .optional()
    .refine(
      (val) => !val || !(val instanceof FileList) || val.length <= 1,
      "Selecione apenas uma imagem"
    ),
});


// 2. FORM DATA
export type FiltroFormSchema = z.infer<typeof filtroSchema>;
export type FiltroFormData = FiltroFormSchema

// 3. MODELS
export interface FiltroModel {
  id: number;
  nome: string;
  marca: string;
  modelo: string;
  categoria: string;
  categoria_display?: string;
  descricao: string;
  imagem: string ;
  litros_min_indicado: number ;
  litros_max_indicado: number;
  tipo_filtro: "interno" | "externo" | "canister" | "mochila" | "sump";
  tipo_filtro_display?: string;
  vazao_lh: number;
  numero_estagios: number;
  criado_em: string;
  atualizado_em: string;
}

export interface FiltroPayload {
  nome: string;
  marca: string;
  modelo: string;
  categoria?: string;
  categoria_display?: string;
  descricao: string;
  imagem?: File;
  litros_min_indicado: number;
  litros_max_indicado: number;
  tipo_filtro: "interno" | "externo" | "canister" | "mochila" | "sump";
  tipo_filtro_display?: string;
  vazao_lh: number;
  numero_estagios: number;
}
