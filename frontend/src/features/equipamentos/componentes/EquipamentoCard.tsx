import { Link } from "react-router-dom";

export interface EquipamentoCardProps {
  id: number;
  nome: string;
  marca?: string;
  modelo?: string;
  imagem?: string;
  detalhes: string;
  hrefEditar?: string;
  onExcluir?: (id: number) => void;
}

export const EquipamentoCard = ({ id, nome, marca, modelo, imagem, detalhes, hrefEditar, onExcluir }: EquipamentoCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {imagem ? (
        <img src={imagem} alt={nome} className="mb-3 h-40 w-full rounded-md object-cover" />
      ) : (
        <div className="mb-3 h-40 w-full rounded-md bg-slate-100" />
      )}

      <h3 className="text-lg font-semibold text-slate-800">{nome}</h3>
      {(marca || modelo) && (
        <p className="text-sm text-slate-500">{marca} {modelo}</p>
      )}
      <p className="mt-1 text-sm text-slate-600">{detalhes}</p>

      <div className="mt-3 flex items-center gap-2">
        {hrefEditar && (
          <Link
            to={hrefEditar}
            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-200"
          >
            Editar
          </Link>
        )}
        {onExcluir && (
          <button
            type="button"
            onClick={() => onExcluir(id)}
            className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-200"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}