import type { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps {
  label: string;
  placeholder?: string;
  rows?: number;
  register: UseFormRegisterReturn;
  error?: { message?: string };
}

export const Textarea = ({
  label,
  placeholder,
  rows = 4,
  register,
  error,
}: TextareaProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        {...register}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};
