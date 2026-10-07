import z from "zod";

// 1. SCHEMA
export const generoFloraSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  descricao: z.string()
})

// 2. FORM DATA
export type GeneroFloraFormSchema = z.infer<typeof generoFloraSchema>;

export interface GeneroFloraFormData {
  nome: string;
  descricao: string;
}

// 3. MODEL
export interface GeneroFloraModel {
  id: number;
  nome: string;
  descricao: string;
}