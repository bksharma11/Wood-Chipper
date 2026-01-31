import React, { useEffect, useState, useRef } from 'react';

const MESSAGES = [
    "SYSTEM INITIALIZED...",
    "CONNECTING TO FIREBASE NODES... [OK]",
    "FETCHING WEATHER DATA... [OK]",
    "CHECKING FACTORY SENSORS... [NOMINAL]",
    "SHIFT SCHEDULE... SYNCED",
    "OPERATOR DATABANK... LOADED",
    "PRODUCTION METRICS... CALIBRATING",
    "SECURITY PROTOCOLS... ACTIVE",
    "MONITORING AMBIENT TEMPERATURE...",
    "ANALYZING POWER GRID... STABLE"
];

const SentinelTerminal: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial load
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < MESSAGES.length) {
                const msg = MESSAGES[currentIndex];
                const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setLogs(prev => [...prev.slice(-4), `[${timestamp}] > ${msg}`]);
                currentIndex++;
            } else {
                // Random updates after init
                if (Math.random() > 0.7) {
                    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    setLogs(prev => [...prev.slice(-4), `[${timestamp}] > ${randomMsg}`]);
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-4 left-4 z-40 font-mono-tech pointer-events-none hidden md:block opacity-70">
            <div className="bg-slate-950/80 border-l-2 border-cyan-500 p-2 rounded-r-lg max-w-sm backdrop-blur-sm">
                <div className="text-[10px] text-cyan-500 font-bold uppercase mb-1 tracking-widest border-b border-cyan-900 pb-1">
                    :: SENTINEL_LOG_V2.1 ::
                </div>
                <div className="flex flex-col space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className={`text-[9px] ${i === logs.length - 1 ? 'text-cyan-300 animate-pulse' : 'text-cyan-700'}`}>
                            {log}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default SentinelTerminal;
