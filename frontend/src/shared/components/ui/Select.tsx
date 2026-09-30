import type { UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  register: UseFormRegisterReturn;
  error?: { message?: string };
}

export const Select = ({
  label,
  placeholder = "Selecione",
  options,
  register,
  error,
}: SelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        {...register}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};