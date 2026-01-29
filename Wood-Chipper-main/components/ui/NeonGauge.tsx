import React from 'react';

interface NeonGaugeProps {
    value: number; // 0 to 100
    max?: number;
    label: string;
    unit: string;
    color?: string; // Hex code or tailwind color name
    size?: 'sm' | 'md' | 'lg';
}

const NeonGauge: React.FC<NeonGaugeProps> = ({ value, max = 100, label, unit, color = '#22d3ee', size = 'md' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const sizeClasses = {
        sm: 'w-32 h-32',
        md: 'w-48 h-48',
        lg: 'w-64 h-64'
    };

    return (
        <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]}`}>
            {/* SVG Meter */}
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">

                {/* Glow Filter */}
                <defs>
                    <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Track */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#1e293b" // slate-800
                    strokeWidth="6"
                    fill="transparent"
                />

                {/* Progress Arc */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    filter={`url(#glow-${label})`}
                    className="transition-all duration-1000 ease-out"
                />

                {/* Decorative Inner Ring */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius - 8}
                    stroke={color}
                    strokeWidth="1"
                    fill="transparent"
                    strokeDasharray="4 4"
                    opacity="0.3"
                    className="animate-[spin_10s_linear_infinite]"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black orbitron text-white drop-shadow-lg" style={{ color: color }}>
                    {value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    {unit}
                </span>
            </div>

            {/* Label */}
            <div className="absolute -bottom-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-500/80 orbitron bg-black/50 px-3 py-1 rounded border border-cyan-900">
                {label}
            </div>
        </div>
    );
};

export default NeonGauge;
