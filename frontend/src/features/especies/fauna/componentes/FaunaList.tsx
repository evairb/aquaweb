import { FaunaCard } from "./FaunaCard";
import type { FaunaListModel } from "../FaunaType";

interface FaunaListProps {
  faunaList: FaunaListModel[];
}

export const FaunaList = ({faunaList}: FaunaListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {faunaList.map((fauna)=> (
        <FaunaCard
          key={fauna.id}
          id={fauna.id}
          nome_popular={fauna.nome_popular}
          epiteto_especifico={fauna.epiteto_especifico}
          tipo={fauna.tipo}
          imagem={fauna.imagem}
        />
      ))}
    </div>
  )
}