import z from "zod";

// 1. SCHEMA
export const grupoComercialSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  descricao: z.string()
})

//  2. FORM DATA
export type GrupoComercialFormSchema = z.infer<typeof grupoComercialSchema>;

export interface GrupoComercialFormData {
  nome: string;
  descricao: string;
}

// 3. MODEL
export interface GrupoComercialModel {
  id: number;
  nome: string;
  descricao: string;
}