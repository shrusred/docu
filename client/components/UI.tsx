// ===== components/UI.tsx =====
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  icon,
}: ButtonProps) {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 transform hover:scale-105",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300",
    outline:
      "bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    glass:
      "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${
        sizes[size]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

interface InputProps {
  id: string;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  id,
  type,
  label,
  placeholder,
  required = false,
  className = "",
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${className}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className = "", glass = false }: CardProps) {
  const baseClasses = "rounded-2xl p-8 shadow-2xl";
  const glassClasses = glass
    ? "bg-white/10 backdrop-blur-md border border-white/20"
    : "bg-white";

  return (
    <div className={`${baseClasses} ${glassClasses} ${className}`}>
      {children}
    </div>
  );
}

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className = "" }: DividerProps) {
  return (
    <div className={`flex items-center my-6 ${className}`}>
      <div className="flex-1 border-t border-white/20"></div>
      {text && <span className="px-4 text-purple-200 text-sm">{text}</span>}
      <div className="flex-1 border-t border-white/20"></div>
    </div>
  );
}
