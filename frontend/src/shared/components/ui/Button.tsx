import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-400",
};

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`rounded-lg px-6 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? "Salvando" : children}
    </button>
  )
}