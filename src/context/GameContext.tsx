"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, GameCard, MetricChanges } from '@/types';
import deckData from '@/data/deck.json';

import eventsData from '@/data/events.json';

interface GameContextType extends GameState {
    handleSwipe: (direction: 'left' | 'right') => void;
    resetGame: () => void;
    startGame: (theme: string) => void;
    resolveEvent: () => void;
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
    activeEvent: null,
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

    const resolveEvent = () => {
        if (!state.activeEvent) return;

        const consequences = state.activeEvent.consequences;
        setState((prev) => {
            const newMetrics = {
                health: Math.min(100, Math.max(0, prev.metrics.health + (consequences.health || 0))),
                economy: Math.min(100, Math.max(0, prev.metrics.economy + (consequences.economy || 0))),
                votes: Math.min(100, Math.max(0, prev.metrics.votes + (consequences.votes || 0))),
                relations: Math.min(100, Math.max(0, prev.metrics.relations + (consequences.relations || 0))),
            };

            // Check for Game Over after event
            let gameOverReason = "";
            let endingTitle = "";
            let gameOverType: GameState['gameOverType'] = undefined;

            if (newMetrics.health <= 0) {
                gameOverReason = "The nation has collapsed under disease and pollution. You failed to protect the people.";
                endingTitle = newMetrics.votes > 70 ? "The Beloved Martyr" : "The Negligent Leader";
                gameOverType = 'health_low';
            } else if (newMetrics.economy <= 0) {
                gameOverReason = "The economy has crashed. The nation is bankrupt and in ruins.";
                endingTitle = newMetrics.relations > 70 ? "The Poor Diplomat" : "The Bankrupt Fool";
                gameOverType = 'economy_low';
            } else if (newMetrics.votes <= 0) {
                gameOverReason = "You have lost the mandate of the people. You are forced to resign in disgrace.";
                endingTitle = newMetrics.economy > 70 ? "The Efficient Tyrant" : "The Ousted Politician";
                gameOverType = 'votes_low';
            } else if (newMetrics.relations <= 0) {
                gameOverReason = "Diplomatic ties are severed. The nation is isolated and vulnerable to foreign threats.";
                endingTitle = newMetrics.health > 70 ? "The Isolated Caretaker" : "The Pariah State";
                gameOverType = 'relations_low';
            }

            if (gameOverReason) {
                return {
                    ...prev,
                    metrics: newMetrics,
                    activeEvent: null,
                    gameOver: true,
                    gameOverReason,
                    endingTitle,
                    gameOverType,
                };
            }

            return {
                ...prev,
                metrics: newMetrics,
                activeEvent: null,
            };
        });
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!state.currentCard || state.gameOver || state.activeEvent) return;

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
            let gameOverReason = "";
            let endingTitle = "";
            let consolationMessage = "";
            let gameOverType: GameState['gameOverType'] = undefined;

            if (newMetrics.health <= 0) {
                gameOverReason = "The nation has collapsed under disease and pollution. You failed to protect the people.";
                endingTitle = newMetrics.votes > 70 ? "The Beloved Martyr" : "The Negligent Leader";
                consolationMessage = newMetrics.economy > 60 ? "At least the hospitals were profitable... right?" : "Health is wealth, and you ran out of both.";
                gameOverType = 'health_low';
            } else if (newMetrics.economy <= 0) {
                gameOverReason = "The economy has crashed. The nation is bankrupt and in ruins.";
                endingTitle = newMetrics.relations > 70 ? "The Poor Diplomat" : "The Bankrupt Fool";
                consolationMessage = newMetrics.votes > 60 ? "The people loved you, but love doesn't pay the bills." : "Fiscal responsibility is key. Try again.";
                gameOverType = 'economy_low';
            } else if (newMetrics.votes <= 0) {
                gameOverReason = "You have lost the mandate of the people. You are forced to resign in disgrace.";
                endingTitle = newMetrics.economy > 70 ? "The Efficient Tyrant" : "The Ousted Politician";
                consolationMessage = newMetrics.relations > 60 ? "The world respected you, even if your voters didn't." : "You can't please everyone, but you pleased no one.";
                gameOverType = 'votes_low';
            } else if (newMetrics.relations <= 0) {
                gameOverReason = "Diplomatic ties are severed. The nation is isolated and vulnerable to foreign threats.";
                endingTitle = newMetrics.health > 70 ? "The Isolated Caretaker" : "The Pariah State";
                consolationMessage = newMetrics.economy > 60 ? "We're rich, but we're alone. Diplomacy matters." : "No friends, no funds. A dangerous combination.";
                gameOverType = 'relations_low';
            }

            // General duration-based consolation override if run was very short or long
            if (gameOverReason) {
                if (prev.turnCount < 5) {
                    consolationMessage = "Politics is brutal. Don't take it personally. Try again!";
                } else if (prev.turnCount > 20) {
                    consolationMessage = "An incredible run! You navigated the chaos for a long time.";
                }

                return {
                    ...prev,
                    metrics: newMetrics,
                    gameOver: true,
                    gameOverReason,
                    endingTitle,
                    consolationMessage,
                    gameOverType,
                };
            }

            // Trigger Random Event (approx every 5-8 turns)
            // 15% chance per turn after turn 5
            let nextEvent = null;
            if (prev.turnCount > 5 && Math.random() < 0.15) {
                const currentTheme = prev.selectedTheme || "General";
                const possibleEvents = (eventsData as any[]).filter(e =>
                    e.themes?.includes(currentTheme) || e.themes?.includes("General")
                );
                if (possibleEvents.length > 0) {
                    nextEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
                }
            }

            // Prepare next card
            const nextDeck = [...prev.deck];
            const nextCard = nextDeck.shift() || null;

            // If deck is empty, Game Over (Victory/Survival)
            if (!nextCard) {
                let victoryMessage = "A full term in office is a rare achievement. Well done.";
                const m = newMetrics;

                // Determine highest metric for specific praise
                if (m.health >= m.economy && m.health >= m.votes && m.health >= m.relations) {
                    victoryMessage = "You prioritized the well-being of your citizens above all. A true humanitarian.";
                } else if (m.economy >= m.health && m.economy >= m.votes && m.economy >= m.relations) {
                    victoryMessage = "You built an economic powerhouse. The nation is prosperous like never before.";
                } else if (m.votes >= m.health && m.votes >= m.economy && m.votes >= m.relations) {
                    victoryMessage = "The people adore you. You are the most popular leader in history.";
                } else if (m.relations >= m.health && m.relations >= m.economy && m.relations >= m.votes) {
                    victoryMessage = "A master of diplomacy. You have made our nation a global superpower.";
                }

                return {
                    ...prev,
                    metrics: newMetrics,
                    gameOver: true,
                    gameOverReason: "You have successfully completed your term! The nation stands strong.",
                    endingTitle: "The Survivor",
                    consolationMessage: victoryMessage,
                    isVictory: true,
                    gameOverType: 'victory',
                    activeEvent: null
                }
            }

            return {
                ...prev,
                metrics: newMetrics,
                turnCount: prev.turnCount + 1,
                flags: [...prev.flags, `${prev.currentCard?.id}_${direction}`],
                deck: nextDeck,
                currentCard: nextCard,
                activeEvent: nextEvent
            };
        });
        setSwipePreview(null);
    };

    return (
        <GameContext.Provider value={{ ...state, handleSwipe, resetGame, startGame, resolveEvent, swipePreview, setSwipePreview }}>
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
