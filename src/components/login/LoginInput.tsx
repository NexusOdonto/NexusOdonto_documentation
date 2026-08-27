import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "../Icons";

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  showPasswordToggle?: boolean;
}

export function LoginInput({ 
  icon, 
  label, 
  showPasswordToggle = false, 
  type = "text", 
  className = "", 
  ...props 
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === "password" 
    ? (showPassword ? "text" : "password") 
    : type;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          type={inputType}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-${showPasswordToggle ? '10' : '4'} py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200 ${className}`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}