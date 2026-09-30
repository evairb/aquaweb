import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "url" | "email";
  step?: string;
  register: UseFormRegisterReturn;
  error?: { message?: string };
}

export const Input = ({
  label, placeholder, type, step, register, error,
}: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...register}
        type={type}
        step={step}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}