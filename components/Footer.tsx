
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Outer Container with Fixed Position
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      
      {/* Metallic Top Border (Steel Shine Edge) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-70"></div>

      {/* Main Footer Body with Gunmetal Background */}
      <div className="metal-gradient bg-[#121212] border-t border-black/50 p-3 shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          
          {/* Left Side: Copyright with "C" Symbol */}
          <div className="flex items-center gap-2 mb-2 md:mb-0">
             {/* Styled 'C' Symbol */}
            <div className="flex justify-center items-center w-6 h-6 rounded-full border border-slate-600 bg-black/40 text-slate-400 text-xs font-sci-fi">
              &copy;
            </div>
            <span className="text-slate-400 text-sm font-sci-fi tracking-wider uppercase">
              {currentYear} <span className="text-slate-200 font-semibold">CrossBond</span> Systems. All Rights Reserved.
            </span>
          </div>

          {/* Right Side: Designer Signature */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs font-sci-fi tracking-widest uppercase hidden sm:block">
              System Architecture & UI by
            </span>
            
            {/* Name with Gold Chrome Effect */}
            <div className="relative group cursor-pointer">
              <span className="gold-chrome-text text-xl font-bold font-sci-fi tracking-[0.15em] uppercase group-hover:brightness-125 transition-all duration-300">
                B.K. SHARMA
              </span>
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-yellow-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
