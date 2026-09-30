import z from "zod";

// 1. SCHEMA
export const generoSchema = z.object({
  nome_cientifico: z.string().min(1, "Informe o nome cientifico"),
  familia: z.string().min(1, "Selecione um familia"),
});


//  2. FORM DATA
export type GeneroFormSchema = z.infer<typeof generoSchema>;
export type GeneroFormData = GeneroFormSchema;


// 3. MODEL
export interface GeneroModel {
  id: number;
  familia: number;
  familia_nome: string;
  nome_cientifico: string;
}


// 4. CONVERSÃO — Model para FormData
export const generoModelToFormData = (genero: GeneroModel): GeneroFormData => ({
  nome_cientifico: genero.nome_cientifico,
  familia: String(genero.familia),
});