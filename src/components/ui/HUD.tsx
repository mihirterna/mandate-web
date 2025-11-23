"use client";

import React from 'react';
import { useGame } from '@/context/GameContext';
import { Heart, DollarSign, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const MetricItem = ({ icon: Icon, value, color, change = 0 }: { icon: any, value: number, color: string, change?: number }) => {
    // Calculate delta bar properties
    let deltaBar = null;
    if (change > 0) {
        const width = Math.min(change, 100 - value);
        deltaBar = (
            <motion.div
                className="absolute top-0 h-full bg-green-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ left: `${value}%`, width: `${width}%` }}
            />
        );
    } else if (change < 0) {
        const absChange = Math.abs(change);
        const width = Math.min(absChange, value);
        const left = value - width;
        deltaBar = (
            <motion.div
                className="absolute top-0 h-full bg-red-500 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ left: `${left}%`, width: `${width}%` }}
            />
        );
    }

    return (
        <div className="flex flex-col items-center w-1/4 relative">
            <div className={`p-2 rounded-full bg-gray-800 mb-1 relative overflow-hidden`}>
                <div
                    className={`absolute bottom-0 left-0 right-0 opacity-30 transition-all duration-500`}
                    style={{ height: `${value}%`, backgroundColor: color }}
                />
                <Icon size={24} className={`text-${color}-500 z-10 relative`} style={{ color: color }} />
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden relative">
                <motion.div
                    className="absolute top-0 left-0 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ backgroundColor: color }}
                />
                {deltaBar}
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
