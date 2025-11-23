"use client";
import React from 'react';
import { useGame } from '@/context/GameContext';
import HUD, { TurnCounter } from './ui/HUD';
import SwipeableCard from './ui/SwipeableCard';
import ThemeSelection from './ThemeSelection';
import BreakingNewsOverlay from './BreakingNewsOverlay';
import Celebration from './Celebration';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameBoard() {
    const { currentCard, handleSwipe, gameOver, gameOverReason, resetGame, selectedTheme, turnCount, endingTitle, consolationMessage, isVictory, gameOverType } = useGame();

    if (!selectedTheme) {
        return <ThemeSelection />;
    }

    if (gameOver) {
        // Victory Styling: Keep background dark, only style elements
        const titleColor = isVictory ? "text-yellow-400" : "text-red-500";
        const titleText = isVictory ? "TERM COMPLETE" : "GAME OVER";

        // Card/Box Styling
        const cardBorder = isVictory ? "border-yellow-500/50" : "border-red-500/50";
        const cardBg = isVictory ? "bg-green-900/40" : "bg-red-900/30";
        const textColor = isVictory ? "text-yellow-100" : "text-red-400";
        const labelColor = isVictory ? "text-yellow-500" : "text-red-400";

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8 text-center relative overflow-hidden">
                {/* Show Celebration/Defeat Animation */}
                <Celebration type={gameOverType || (isVictory ? 'victory' : undefined)} />

                <h1 className={`text-5xl font-black mb-6 tracking-tighter ${titleColor} drop-shadow-lg`}>{titleText}</h1>

                <div className="mb-8 flex flex-col items-center gap-4 z-10">
                    <div className="bg-gray-800 px-6 py-2 rounded-full border border-gray-700 shadow-lg">
                        <span className="text-gray-400 text-sm uppercase tracking-wider font-bold">Term Length</span>
                        <div className="text-3xl font-bold text-white">{turnCount} Weeks</div>
                    </div>

                    {endingTitle && (
                        <div className={`${cardBg} px-10 py-6 rounded-2xl border-2 ${cardBorder} shadow-2xl backdrop-blur-sm`}>
                            <span className={`${labelColor} text-xs uppercase tracking-widest font-bold`}>History Remembers You As</span>
                            <div className={`text-3xl font-black mt-2 ${textColor}`}>{endingTitle}</div>
                        </div>
                    )}
                </div>

                <p className="text-xl mb-6 max-w-md text-gray-300 leading-relaxed">{gameOverReason}</p>

                {consolationMessage && (
                    <p className="text-lg text-gray-400 italic mb-10 max-w-md border-t border-gray-700 pt-6">
                        "{consolationMessage}"
                    </p>
                )}

                <button
                    onClick={() => resetGame()}
                    className={`px-8 py-4 text-lg ${isVictory ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-white text-gray-900 hover:bg-gray-200'} rounded-full font-black uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 z-10`}
                >
                    {isVictory ? 'Start New Term' : 'Try Again'}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-screen bg-gray-800 overflow-hidden relative">
            <BreakingNewsOverlay />
            <TurnCounter />
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
