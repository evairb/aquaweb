import { Link } from "react-router-dom"

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="mt-1 text-slate-500">
        A página que você está procurando não existe.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Voltar para o início
      </Link>
    </div>
  )
}