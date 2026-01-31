import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    icon?: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, icon }) => {
    return (
        <div className={`relative group overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/5 shadow-2xl neon-pulse ${className}`}>

            {/* Decorative Gradients */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700 pointer-events-none"></div>

            {/* Header if provided */}
            {(title || icon) && (
                <div className="relative px-6 py-4 border-b border-white/5 flex items-center space-x-3 bg-white/5 mx-1 mt-1 rounded-t-xl">
                    {icon && <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{icon}</span>}
                    {title && <h3 className="text-lg font-bold orbitron text-slate-100 tracking-wide uppercase">{title}</h3>}
                </div>
            )}

            {/* Content */}
            <div className="relative p-6 z-10">
                {children}
            </div>

        </div>
    );
};

export default GlassCard;
