import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

const GlassInput: React.FC<GlassInputProps> = ({ label, icon, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider orbitron pl-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 ${icon ? 'pl-10' : 'pl-3'} pr-3 text-sm text-slate-200 placeholder-slate-600 
          focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-slate-900/80
          transition-all duration-300 font-medium ${className}`}
                    {...props}
                />
                {/* Bottom Glow Line */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-500 transition-all duration-500 group-focus-within:w-full"></div>
            </div>
        </div>
    );
};

export default GlassInput;
