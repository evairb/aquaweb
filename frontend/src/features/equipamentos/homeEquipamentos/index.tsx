import { CATEGORIAS } from "./categoria";
import { CategoriaCard } from "./CategoriaCard";

export const HomeEquipamento = () => {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Equipamentos</h1>
      <p className="mt-1 text-gray-600">Selecione uma categoria para gerenciar.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIAS.map((cat) => (
          <CategoriaCard key={cat.id} {...cat} />
        ))}
      </div>
    </div>
  );
}