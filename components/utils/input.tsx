import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  color?: "dark" | "light";
  customSize?: "small" | "medium" | "large";
  className: string;
}

export default function Input({ 
  children, 
  color = "dark", 
  customSize = "medium", 
  className = '', 
  ...props 
}: InputProps) {
  const colorStyles = {
    dark: "bg-zinc-800 text-white placeholder-zinc-400",
    light: "bg-white text-zinc-800 placeholder-zinc-500 border border-zinc-300",
  };

  const sizeStyles = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  return (
    <input
      className={`
        ${colorStyles[color]}
        ${sizeStyles[customSize]}
        rounded-lg
        focus:outline-none focus:ring-2
        ${color === "dark" ? "focus:ring-blue-500" : "focus:ring-blue-400"}
        transition-colors
        ${className}  // ✅ 合并外部 className
      `}
      {...props}
    />
  );
}
