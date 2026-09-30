import type { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: {message?: string};
}

export const Checkbox = ({ label, register, error }: CheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        {...register}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};