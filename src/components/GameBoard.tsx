"use client";
import React from 'react';
import { useGame } from '@/context/GameContext';
import HUD from './ui/HUD';
import SwipeableCard from './ui/SwipeableCard';
import ThemeSelection from './ThemeSelection';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameBoard() {
    const { currentCard, handleSwipe, gameOver, gameOverReason, resetGame, selectedTheme } = useGame();

    if (!selectedTheme) {
        return <ThemeSelection />;
    }

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-500">GAME OVER</h1>
                <p className="text-xl mb-8">{gameOverReason}</p>
                <button
                    onClick={() => resetGame()}
                    className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-screen bg-gray-800 overflow-hidden">
            <HUD />

            <div className="flex-1 w-full flex items-center justify-center relative p-4">
                <AnimatePresence mode="wait">
                    {currentCard && (
                        <SwipeableCard
                            key={currentCard.id}
                            card={currentCard}
                            onSwipe={handleSwipe}
                        />
                    )}
                </AnimatePresence>

                {!currentCard && !gameOver && (
                    <div className="text-white animate-pulse">Loading deck...</div>
                )}
            </div>

            <div className="pb-8 text-gray-500 text-sm">
                Mandate: Governance Simulator
            </div>
        </div>
    );
}
