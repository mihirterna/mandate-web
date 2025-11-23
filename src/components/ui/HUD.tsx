"use client";

import React from 'react';
import { useGame } from '@/context/GameContext';
import { Heart, DollarSign, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const MetricItem = ({ icon: Icon, value, color, change = 0 }: { icon: any, value: number, color: string, change?: number }) => {
    return (
        <div className="flex flex-col items-center w-1/4 relative">
            <div className={`p-2 rounded-full bg-gray-800 mb-1 relative overflow-visible`}>
                {/* Icon Indicator */}
                {change !== 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 z-20 ${change > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                )}

                {/* Icon Wrapper for Masking */}
                <div className="relative w-6 h-6">
                    {/* Base Icon (Gray/Empty) */}
                    <Icon size={24} className="text-gray-700 absolute inset-0" />

                    {/* Filled Icon (Masked) */}
                    <div
                        className="absolute bottom-0 left-0 w-full overflow-hidden transition-all duration-500"
                        style={{ height: `${value}%` }}
                    >
                        <Icon size={24} className={`text-${color}-500 absolute bottom-0 left-0`} style={{ color: color }} />
                    </div>
                </div>
            </div>

            {/* Bar below */}
            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden relative mt-1">
                <motion.div
                    className="absolute top-0 left-0 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
};

export default function HUD() {
    const { metrics, currentCard, swipePreview } = useGame();

    const getChange = (metricKey: 'health' | 'economy' | 'votes' | 'relations') => {
        if (!swipePreview || !currentCard) return 0;
        const consequences = currentCard.choices[swipePreview].consequences;
        return consequences[metricKey] || 0;
    };

    return (
        <div className="w-full max-w-md bg-gray-900 p-4 rounded-b-xl shadow-lg flex justify-between gap-2 z-50">
            <MetricItem icon={Heart} value={metrics.health} color="#f97316" change={getChange('health')} />
            <MetricItem icon={DollarSign} value={metrics.economy} color="#eab308" change={getChange('economy')} />
            <MetricItem icon={Users} value={metrics.votes} color="#3b82f6" change={getChange('votes')} />
            <MetricItem icon={Globe} value={metrics.relations} color="#a855f7" change={getChange('relations')} />
        </div>
    );
}

export function TurnCounter() {
    const { turnCount } = useGame();
    return (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800/80 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-gray-300 border border-gray-700 z-0">
            WEEKS IN OFFICE: <span className="text-white text-sm">{turnCount}</span>
        </div>
    );
}
