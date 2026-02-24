import React from "react";








export const Card = ({ children, className = "", title, subtitle }) => {
  return (
    <div className={`bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100/50 p-6 ${className}`}>
            {(title || subtitle) &&
      <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
      }
            {children}
        </div>);

};