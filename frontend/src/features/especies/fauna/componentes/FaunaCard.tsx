import { Link } from "react-router-dom";

interface FaunaCardProps {
  id: number;
  nome_popular: string;
  epiteto_especifico: string;
  tipo: "peixe" | "invertebrado" | "anfibio" | "reptil" | "coral";
  imagem?: string;
}

export const FaunaCard = ({
  id, nome_popular, epiteto_especifico, tipo, imagem,
}: FaunaCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {imagem && (
        <img
          src={imagem}
          alt={nome_popular}
          className="mb-3 h40 w-full rounded-md object-cover"
        />
      )}

      <h3 className="text-lg font-semibold text-slate-800">{nome_popular}</h3>
      <p className="text-sm italic text-slate-500">{epiteto_especifico}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {tipo}
        </span>
        <Link
          to={`/fauna/${id}/editar`}
          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-200"
        >
          Editar
        </Link>

      </div>
    </div>
  )
}