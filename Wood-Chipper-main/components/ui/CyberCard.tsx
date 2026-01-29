import React from 'react';

interface CyberCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    variant?: 'cyan' | 'red' | 'yellow' | 'purple';
}

const CyberCard: React.FC<CyberCardProps> = ({ children, className = '', title, variant = 'cyan' }) => {
    const colors = {
        cyan: 'border-cyan-500/30 bg-cyan-950/20 shadow-cyan-500/10',
        red: 'border-red-500/30 bg-red-950/20 shadow-red-500/10',
        yellow: 'border-amber-500/30 bg-amber-950/20 shadow-amber-500/10',
        purple: 'border-purple-500/30 bg-purple-950/20 shadow-purple-500/10',
    };

    const textColors = {
        cyan: 'text-cyan-400',
        red: 'text-red-400',
        yellow: 'text-amber-400',
        purple: 'text-purple-400',
    };

    const borderColor = {
        cyan: '#06b6d4',
        red: '#ef4444',
        yellow: '#f59e0b',
        purple: '#a855f7'
    };

    const activeColor = borderColor[variant];

    return (
        <div className={`relative group ${className}`}>

            {/* Main Container with Clipped Corners */}
            <div
                className={`relative z-10 p-6 h-full backdrop-blur-md border border-t-0 border-b-0 ${colors[variant]} transition-all duration-300`}
                style={{
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                }}
            >
                {/* Top Border Segment */}
                <div className="absolute top-0 left-[20px] right-0 h-[1px]" style={{ backgroundColor: activeColor, opacity: 0.5 }}></div>
                <div className="absolute top-0 left-0 w-[20px] h-[20px] border-l border-t" style={{ borderColor: activeColor, opacity: 0.5, transform: 'skew(0deg)' }}></div> {/* This is tricky with CSS, using SVG overlay instead for cleaner lines usually, but fallback here */}

                {/* SVG Overlay for true borders details */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Top Left Corner */}
                    <path d="M0 20 L20 0" stroke={activeColor} strokeWidth="1" fill="none" opacity="0.6" />

                    {/* Bottom Right Corner */}
                    <path d={`M100% ${100 - 20} L${100 - 20} 100%`} stroke={activeColor} strokeWidth="1" fill="none" opacity="0.6" />

                    {/* Decorative Tech Marks */}
                    <rect x="0" y="40%" width="2" height="10" fill={activeColor} opacity="0.5" />
                    <rect x="calc(100% - 2px)" y="40%" width="2" height="10" fill={activeColor} opacity="0.5" />
                </svg>

                {/* Content */}
                {title && (
                    <div className="mb-4 flex items-center space-x-2 border-b border-white/5 pb-2">
                        <div className={`w-2 h-2 ${variant === 'cyan' ? 'bg-cyan-500' : variant === 'red' ? 'bg-red-500' : variant === 'yellow' ? 'bg-amber-500' : 'bg-purple-500'} rotate-45`}></div>
                        <h3 className={`text-sm font-black orbitron uppercase tracking-[0.2em] ${textColors[variant]}`}>
                            {title}
                        </h3>
                    </div>
                )}

                <div className="relative">
                    {children}
                </div>
            </div>

            {/* Glow Effect Layer */}
            <div className={`absolute -inset-0.5 bg-gradient-to-br from-${variant}-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} style={{ zIndex: 0 }}></div>
        </div>
    );
};

export default CyberCard;
