import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const registroSchema = z
  .object({
    username: z.string().min(3, "Mínimo de 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "As senhas não coincidem",
    path: ["password_confirm"],
  });

type RegistroForm = z.infer<typeof registroSchema>;

export const RegistroPage = () => {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = async (data: RegistroForm) => {
    setErro(null);

    try {
      await registrar(data);
      navigate("/", { replace: true });
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.username?.[0] ||
        "Não foi possível criar a conta.";

      setErro(mensagem);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">
          Criar conta
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Comece a montar seus aquários
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Usuário
            </label>

            <input
              {...register("username")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>

            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirmar senha
            </label>

            <input
              type="password"
              {...register("password_confirm")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {errors.password_confirm && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password_confirm.message}
              </p>
            )}
          </div>

          {erro && (
            <p className="text-sm text-red-500">{erro}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};