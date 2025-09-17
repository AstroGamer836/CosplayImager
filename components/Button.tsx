import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseStyles = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform';

    const variantStyles = {
        primary: 'text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 focus:ring-cyan-400 shadow-md hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5',
        secondary: 'bg-white/10 text-gray-200 hover:bg-white/20 focus:ring-gray-500 border border-white/20',
    };

    return (
        <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};