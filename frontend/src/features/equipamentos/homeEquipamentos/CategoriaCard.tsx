import { Link } from "react-router-dom"
import type { CategoriaEquipamentoItem } from "./categoria"
import placeholder from "../../../assets/img/equipamentos/equipamentos.jpg";


export const CategoriaCard = ({ label, descricao, href, imagem }: CategoriaEquipamentoItem) => {
  return (
    <Link
      to={href}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={imagem}
          alt={label}
          onError={(e) => { e.currentTarget.src = placeholder; }}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-gray-900">{label}</h2>
        <p className="text-sm text-gray-500">{descricao}</p>
      </div>
    </Link>
  )
}