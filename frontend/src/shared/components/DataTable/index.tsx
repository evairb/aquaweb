import type { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
};

type DataTableProps<T extends { id: string | number }> = {
  data: T[];
  columns: readonly Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export const DataTable = <T extends { id: string | number }>({
  data, columns, onEdit, onDelete, emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    )
  }


  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Ações
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-700">
                  {col.render ? col.render(item) : String(item[col.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}