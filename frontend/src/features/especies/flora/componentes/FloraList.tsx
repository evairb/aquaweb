import type { FloraListModel } from "../FloraType"
import { FloraCard } from "./FloraCard"

interface FloraListProps {
  floraList: FloraListModel[];
}

export const FloraList = ({ floraList }: FloraListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {floraList.map((flora) => (
        <FloraCard
          key={flora.id}
          id={flora.id}
          nome_popular={flora.nome_popular}
          epiteto_especifico={flora.epiteto_especifico}
          necessidade_luz={flora.necessidade_luz}
          imagem={flora.imagem}
        />
      ))}
    </div>
  )
}