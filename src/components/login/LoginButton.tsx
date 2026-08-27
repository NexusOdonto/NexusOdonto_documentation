import type { ButtonHTMLAttributes, ReactNode } from "react";

interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function LoginButton({ children, className = "", ...props }: LoginButtonProps) {
  return (
    <button
      {...props}
      className={`w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(45,212,191,0.6)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}