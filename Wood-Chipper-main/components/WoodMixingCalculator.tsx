import React, { useState, useMemo } from 'react';
import GlassCard from './ui/GlassCard';
import GlassInput from './ui/GlassInput';


const calculateBuckets = (percentage: number) => {
    const mixBuckets = (percentage / 100) * 5;
    const safedaBuckets = 5 - mixBuckets;
    return { mix: mixBuckets, safeda: safedaBuckets };
};

const formatBucketCount = (count: number) => {
    // Round to 1 decimal place to avoid floating point errors like 1.50000001
    const rounded = Math.round(count * 10) / 10;
    const isWhole = rounded % 1 === 0;
    return { value: rounded, isWhole, floor: Math.floor(rounded), ceil: Math.ceil(rounded) };
};

const WoodMixingCalculator: React.FC = () => {
    const [targetMix, setTargetMix] = useState<number>(30); // Default to 30%
    const [activeChippers, setActiveChippers] = useState<1 | 2>(2); // Default to 2 Chippers

    const results = useMemo(() => {
        if (activeChippers === 1) {
            const { mix, safeda } = calculateBuckets(targetMix);
            return {
                chipper1: {
                    type: 'MIXED',
                    mix: formatBucketCount(mix),
                    safeda: formatBucketCount(safeda),
                    text: `Load ${formatBucketCount(safeda).value} Safeda and ${formatBucketCount(mix).value} Mix buckets`
                },
                chipper2: null
            };
        } else {
            // 2 Chippers
            if (targetMix <= 50) {
                // Chipper 1: Pure Safeda (0% Mix) -> 5 Safeda, 0 Mix
                // Chipper 2: Target * 2
                const chipper2Target = targetMix * 2;
                const { mix, safeda } = calculateBuckets(chipper2Target);

                return {
                    chipper1: {
                        type: 'PURE SAFEDA',
                        text: 'PURE SAFEDA (5 Buckets Safeda)'
                    },
                    chipper2: {
                        type: 'MIXED',
                        mix: formatBucketCount(mix),
                        safeda: formatBucketCount(safeda),
                        text: `Load ${formatBucketCount(safeda).value} Safeda and ${formatBucketCount(mix).value} Mix buckets`
                    }
                };
            } else {
                // Target > 50%
                // Chipper 1: Pure Mix (100% Mix) -> 0 Safeda, 5 Mix
                // Chipper 2: (Target * 2) - 100
                const chipper2Target = (targetMix * 2) - 100;
                const { mix, safeda } = calculateBuckets(chipper2Target);

                return {
                    chipper1: {
                        type: 'PURE MIX WOOD',
                        text: 'PURE MIX WOOD (5 Buckets Mix)'
                    },
                    chipper2: {
                        type: 'MIXED',
                        mix: formatBucketCount(mix),
                        safeda: formatBucketCount(safeda),
                        text: `Load ${formatBucketCount(safeda).value} Safeda and ${formatBucketCount(mix).value} Mix buckets`
                    }
                };
            }
        }
    }, [targetMix, activeChippers]);

    const BucketDisplay = ({ label, data }: { label: string, data: any }) => {
        if (!data) return null;

        return (
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-3 border-b border-cyan-500/20 pb-2">
                    {label}
                </h4>

                {data.type !== 'MIXED' ? (
                    <div className="text-2xl md:text-3xl font-black text-white orbitron py-4 text-center text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                        {data.text}
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-center w-1/2 border-r border-slate-700">
                                <span className="block text-[10px] text-slate-500 uppercase font-bold">Safeda Buckets</span>
                                <span className="text-4xl font-black text-white orbitron">{data.safeda.value}</span>
                            </div>
                            <div className="text-center w-1/2">
                                <span className="block text-[10px] text-slate-500 uppercase font-bold">Mix Buckets</span>
                                <span className="text-4xl font-black text-cyan-300 orbitron">{data.mix.value}</span>
                            </div>
                        </div>

                        {(!data.safeda.isWhole || !data.mix.isWhole) && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded text-center animate-pulse">
                                <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">
                                    ⚠️ Operator Note: Alternate between {data.safeda.floor}/{data.safeda.ceil} Safeda & {data.mix.floor}/{data.mix.ceil} Mix
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <GlassCard title="Wood Mixing Calculator" icon={<span>🧮</span>} className="w-full">
            <div className="flex flex-col gap-6">

                {/* Controls */}
                <div className="space-y-6 pb-6 border-b border-white/10">

                    {/* Active Chippers Selector */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider orbitron">
                            Active Chippers
                        </label>
                        <div className="flex gap-4">
                            {[1, 2].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setActiveChippers(num as 1 | 2)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-bold orbitron uppercase transition-all ${activeChippers === num
                                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                        }`}
                                >
                                    {num} Chipper{num > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target Mix Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider orbitron">
                                Target Mix Percentage
                            </label>
                            <span className="text-2xl font-black text-cyan-400 orbitron">{targetMix}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={targetMix}
                            onChange={(e) => setTargetMix(Number(e.target.value))}
                            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                            <span>0% (Pure Safeda)</span>
                            <span>50%</span>
                            <span>100% (Pure Mix)</span>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded border border-white/5">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-1">Current Configuration</h5>
                        <p className="text-sm text-slate-300">
                            Aiming for <strong className="text-cyan-300">{targetMix}% Mix Wood</strong> across <strong className="text-white">{activeChippers}</strong> active chipper{activeChippers > 1 && 's'}.
                        </p>
                    </div>

                </div>

                {/* Results Display */}
                <div className="space-y-4">
                    <BucketDisplay label={activeChippers === 1 ? "Chipper Instructions" : "Chipper 1 Instructions"} data={results.chipper1} />
                    {activeChippers === 2 && (
                        <BucketDisplay label="Chipper 2 Instructions" data={results.chipper2} />
                    )}
                </div>

            </div>
        </GlassCard>
    );
};

export default WoodMixingCalculator;
