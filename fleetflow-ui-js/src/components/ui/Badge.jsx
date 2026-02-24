import React from "react";









const variantStyles = {
  default: "bg-blue-50 text-blue-700 border-blue-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-rose-50 text-rose-700 border-rose-100",
  info: "bg-sky-50 text-sky-700 border-sky-100",
  neutral: "bg-slate-50 text-slate-700 border-slate-100"
};

export const Badge = ({ children, variant = "default", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      
            {children}
        </span>);

};