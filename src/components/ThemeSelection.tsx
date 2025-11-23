"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { CloudFog, Smartphone, TrainFront } from 'lucide-react';

const themes = [
    {
        id: 'Delhi',
        title: 'Delhi Smog Crisis',
        description: 'The capital is choking. Farmers are burning stubble, and the air is toxic. Can you breathe life back into the city?',
        icon: CloudFog,
        color: 'from-gray-700 to-gray-900',
        accent: 'text-gray-400'
    },
    {
        id: 'GenZ',
        title: 'GenZ Dilemma',
        description: 'Social media addiction, influencer culture, and digital privacy. Navigate the chaos of the online generation.',
        icon: Smartphone,
        color: 'from-purple-700 to-indigo-900',
        accent: 'text-purple-400'
    },
    {
        id: 'Mumbai',
        title: 'Mumbai Chaos',
        description: 'Crumbling infrastructure, overcrowding, and monsoon floods. The city of dreams is a logistical nightmare.',
        icon: TrainFront,
        color: 'from-blue-700 to-cyan-900',
        accent: 'text-blue-400'
    }
];

export default function ThemeSelection() {
    const { startGame } = useGame();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6 text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-2 text-center"
            >
                Choose Your Mandate
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 mb-12 text-center max-w-md"
            >
                Select a crisis to manage. Your decisions will shape the future.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {themes.map((theme, index) => (
                    <motion.button
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startGame(theme.id)}
                        className={`relative overflow-hidden rounded-2xl p-6 text-left h-full flex flex-col bg-gradient-to-br ${theme.color} border border-white/10 hover:border-white/30 transition-colors shadow-xl`}
                    >
                        <div className="mb-4 p-3 bg-white/10 rounded-full w-fit backdrop-blur-sm">
                            <theme.icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{theme.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{theme.description}</p>

                        <div className="mt-auto pt-6 flex items-center text-sm font-semibold tracking-wider uppercase opacity-70">
                            Start Scenario &rarr;
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
