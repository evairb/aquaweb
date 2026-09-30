import z from "zod";

// 1. SCHEMA
export const familiaSchema = z.object({
  nome_cientifico: z.string().min(1, "Informe o nome cientifico"),
  descricao: z.string(),
});

//  2. FORM DATA
export type FamiliaFormSchema = z.infer<typeof familiaSchema>;

export interface FamiliaFormData {
  nome_cientifico: string;
  descricao: string
}


// 3. MODEL
export interface FamiliaModel {
  id: number;
  nome_cientifico: string;
  descricao: string;
}