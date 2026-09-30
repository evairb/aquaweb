import type { UseFormRegisterReturn } from "react-hook-form";

interface FileInputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: { message?: string };
  accept?: string;
}

export const FileInput = (
  { label, register, error, accept = "image/*", }: FileInputProps
) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...register}
        type="file"
        accept={accept}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}