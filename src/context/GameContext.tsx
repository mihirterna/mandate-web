"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, GameCard, MetricChanges } from '@/types';
import deckData from '@/data/deck.json';

interface GameContextType extends GameState {
    handleSwipe: (direction: 'left' | 'right') => void;
    resetGame: () => void;
    startGame: (theme: string) => void;
    swipePreview: 'left' | 'right' | null;
    setSwipePreview: (direction: 'left' | 'right' | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_STATE: GameState = {
    metrics: {
        health: 50,
        economy: 50,
        votes: 50,
        relations: 50,
    },
    turnCount: 0,
    flags: [],
    deck: [],
    currentCard: null,
    selectedTheme: null,
    gameOver: false,
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<GameState>({ ...INITIAL_STATE, selectedTheme: null });
    const [swipePreview, setSwipePreview] = useState<'left' | 'right' | null>(null);

    // Initialize deck on mount - DO NOT START GAME YET
    // We wait for theme selection

    const startGame = (theme: string) => {
        const filteredDeck = (deckData as GameCard[]).filter(card =>
            card.themes?.includes(theme) || card.themes?.includes("General")
        );
        const shuffledDeck = [...filteredDeck].sort(() => Math.random() - 0.5);

        setState({
            ...INITIAL_STATE,
            selectedTheme: theme,
            deck: shuffledDeck.slice(1),
            currentCard: shuffledDeck[0],
        });
    };

    const resetGame = () => {
        if (state.selectedTheme) {
            startGame(state.selectedTheme);
        } else {
            // Should not happen if flow is correct, but safe fallback
            setState(INITIAL_STATE);
        }
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!state.currentCard || state.gameOver) return;

        const choice = state.currentCard.choices[direction];
        const consequences = choice.consequences;

        setState((prev) => {
            const newMetrics = {
                health: Math.min(100, Math.max(0, prev.metrics.health + (consequences.health || 0))),
                economy: Math.min(100, Math.max(0, prev.metrics.economy + (consequences.economy || 0))),
                votes: Math.min(100, Math.max(0, prev.metrics.votes + (consequences.votes || 0))),
                relations: Math.min(100, Math.max(0, prev.metrics.relations + (consequences.relations || 0))),
            };

            // Check for Game Over
            if (
                newMetrics.health <= 0 ||
                newMetrics.economy <= 0 ||
                newMetrics.votes <= 0 ||
                newMetrics.relations <= 0
            ) {
                return {
                    ...prev,
                    metrics: newMetrics,
                    gameOver: true,
                    gameOverReason: "The people have risen up. You have been deposed.",
                };
            }

            // Prepare next card
            const nextDeck = [...prev.deck];
            const nextCard = nextDeck.shift() || null;

            // If deck is empty, reshuffle (infinite mode for now)
            if (!nextCard) {
                // Reshuffle based on current theme
                const currentTheme = prev.selectedTheme || "General";
                const filteredDeck = (deckData as GameCard[]).filter(card =>
                    card.themes?.includes(currentTheme) || card.themes?.includes("General")
                );
                const reshuffled = [...filteredDeck].sort(() => Math.random() - 0.5);

                return {
                    ...prev,
                    metrics: newMetrics,
                    turnCount: prev.turnCount + 1,
                    flags: [...prev.flags, `${prev.currentCard?.id}_${direction}`],
                    deck: reshuffled.slice(1),
                    currentCard: reshuffled[0]
                }
            }

            return {
                ...prev,
                metrics: newMetrics,
                turnCount: prev.turnCount + 1,
                flags: [...prev.flags, `${prev.currentCard?.id}_${direction}`],
                deck: nextDeck,
                currentCard: nextCard,
            };
        });
        setSwipePreview(null);
    };

    return (
        <GameContext.Provider value={{ ...state, handleSwipe, resetGame, startGame, swipePreview, setSwipePreview }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
