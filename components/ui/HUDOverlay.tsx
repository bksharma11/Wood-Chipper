import React from 'react';

const HUDOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Corner TL */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-lg"></div>
            {/* Corner TR */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-lg"></div>
            {/* Corner BL */}
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/20 rounded-bl-lg"></div>
            {/* Corner BR */}
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/20 rounded-br-lg"></div>

            {/* Crosshair Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-10">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400"></div>
                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-cyan-400"></div>
            </div>

            {/* REC Indicator */}
            <div className="absolute top-6 right-8 flex items-center space-x-2 opacity-50">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono font-bold text-red-500 tracking-widest">REC</span>
            </div>

            {/* Bottom Tech Line */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        </div>
    );
};

export default HUDOverlay;
