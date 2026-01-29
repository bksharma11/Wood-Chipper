import React from 'react';

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string | number }[];
}

const GlassSelect: React.FC<GlassSelectProps> = ({ label, options, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider orbitron pl-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    className={`w-full appearance-none bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-8 text-sm text-slate-200 
          focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-900/80
          transition-all duration-300 font-medium cursor-pointer ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>

                {/* Bottom Glow Line */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-500 transition-all duration-500 group-focus-within:w-full"></div>
            </div>
        </div>
    );
};

export default GlassSelect;
