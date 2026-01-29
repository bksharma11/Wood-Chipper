import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    className = '',
    ...props
}) => {

    const baseStyles = "relative inline-flex items-center justify-center font-bold orbitron uppercase tracking-wider transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-cyan-400",
        success: "bg-green-600/20 text-green-300 border border-green-500/50 hover:bg-green-600/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:border-green-400",
        secondary: "bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-600/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:border-indigo-400",
        danger: "bg-red-600/20 text-red-300 border border-red-500/50 hover:bg-red-600/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-400",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-[10px] rounded",
        md: "px-6 py-3 text-xs rounded-lg",
        lg: "px-8 py-4 text-sm rounded-xl"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {/* Button Glare Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : icon ? (
                <span className="mr-2 text-current">{icon}</span>
            ) : null}

            <span className="relative z-10 font-bold">{children}</span>
        </button>
    );
};

export default GlassButton;
