import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-4 py-2 border-2 font-bold uppercase tracking-wider text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sans-ui";
  
  const variants = {
    primary: "bg-black text-white border-black hover:bg-gray-800",
    secondary: "bg-white text-black border-black hover:bg-gray-100",
    danger: "bg-white text-red-700 border-red-700 hover:bg-red-50",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};
