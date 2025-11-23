import React from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function BreakingNewsOverlay() {
    const { activeEvent, resolveEvent } = useGame();

    if (!activeEvent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md bg-red-900 border-4 border-red-600 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                >
                    {/* Header */}
                    <div className="bg-red-600 p-4 flex items-center justify-center gap-3 animate-pulse">
                        <AlertTriangle className="text-white w-8 h-8" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">BREAKING NEWS</h2>
                        <AlertTriangle className="text-white w-8 h-8" />
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center bg-gradient-to-b from-gray-900 to-black">
                        <h3 className="text-3xl font-bold text-white mb-4 uppercase leading-tight font-serif">
                            {activeEvent.headline}
                        </h3>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            {activeEvent.description}
                        </p>

                        {/* Consequences */}
                        <div className="bg-black/50 rounded-lg p-4 mb-8 border border-red-500/30">
                            <div className="text-xs text-red-400 uppercase tracking-widest mb-2">Immediate Impact</div>
                            <div className="flex justify-center gap-4">
                                {Object.entries(activeEvent.consequences).map(([metric, value]) => (
                                    <div key={metric} className="flex items-center gap-2">
                                        <span className="capitalize text-white font-bold">{metric}</span>
                                        <span className={`font-bold ${value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {value > 0 ? '+' : ''}{value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={resolveEvent}
                            className="w-full py-4 bg-white text-red-900 font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors text-xl"
                        >
                            Handle Crisis
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
