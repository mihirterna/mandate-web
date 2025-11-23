"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { GameCard } from '@/types';
import { useGame } from '@/context/GameContext';

interface SwipeableCardProps {
    card: GameCard;
    onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeableCard({ card, onSwipe }: SwipeableCardProps) {
    const { setSwipePreview } = useGame();
    const [exitX, setExitX] = useState<number | null>(null);
    const isExiting = React.useRef(false);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Overlay opacities for visual feedback
    const leftOpacity = useTransform(x, [-150, 0], [1, 0]);
    const rightOpacity = useTransform(x, [0, 150], [0, 1]);

    // Update preview state based on drag position
    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            if (isExiting.current) return; // Stop updating preview if card is exiting

            if (latest < -30) {
                setSwipePreview('left');
            } else if (latest > 30) {
                setSwipePreview('right');
            } else {
                setSwipePreview(null);
            }
        });
        return () => unsubscribe();
    }, [x, setSwipePreview]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            isExiting.current = true;
            setExitX(-200);
            setSwipePreview(null); // Clear preview immediately
            onSwipe('left');
        } else if (info.offset.x > 100) {
            isExiting.current = true;
            setExitX(200);
            setSwipePreview(null); // Clear preview immediately
            onSwipe('right');
        } else {
            setSwipePreview(null);
        }
    };

    const getCardStyle = () => {
        let baseStyle = "bg-white border-gray-800";
        let badge = null;

        // Theme based styling
        if (card.themes?.includes('Delhi')) {
            baseStyle = "bg-[#f0f4f8] border-gray-600"; // Smoggy/Dusty
        } else if (card.themes?.includes('Mumbai')) {
            baseStyle = "bg-[#e0f2fe] border-blue-900"; // Rainy/Coastal
        } else if (card.themes?.includes('GenZ')) {
            baseStyle = "bg-[#faf5ff] border-purple-900"; // Neon/Digital
        }

        // Severity based styling
        if (card.severity === 'critical') {
            baseStyle += " border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]";
            badge = (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-20 animate-pulse">
                    CRITICAL
                </div>
            );
        } else if (card.severity === 'high') {
            baseStyle += " border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]";
            badge = (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-20">
                    HIGH IMPACT
                </div>
            );
        }

        return { className: baseStyle, badge };
    };

    const { className, badge } = getCardStyle();

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={exitX !== null ? { x: exitX, opacity: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={{ x: exitX ? exitX : 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute w-full max-w-sm aspect-[3/4] rounded-2xl shadow-2xl overflow-visible cursor-grab active:cursor-grabbing border-4 z-10 ${className}`}
        >
            {badge}

            {/* Choice Overlays */}
            <motion.div
                style={{ opacity: rightOpacity }}
                className="absolute top-8 left-8 border-4 border-green-500 text-green-500 rounded-lg p-2 text-2xl font-bold uppercase tracking-widest z-20 transform -rotate-12 bg-white/80 backdrop-blur-sm"
            >
                {card.choices.right.text}
            </motion.div>

            <motion.div
                style={{ opacity: leftOpacity }}
                className="absolute top-8 right-8 border-4 border-red-500 text-red-500 rounded-lg p-2 text-2xl font-bold uppercase tracking-widest z-20 transform rotate-12 bg-white/80 backdrop-blur-sm"
            >
                {card.choices.left.text}
            </motion.div>

            {/* Card Content */}
            <div className="h-full flex flex-col rounded-xl overflow-hidden">
                {/* Image Placeholder */}
                <div className={`h-1/2 flex items-center justify-center border-b-2 border-gray-200/20 ${card.themes?.includes('GenZ') ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        card.themes?.includes('Mumbai') ? 'bg-gradient-to-br from-blue-600 to-cyan-400' :
                            card.themes?.includes('Delhi') ? 'bg-gradient-to-br from-yellow-600 to-gray-500' :
                                'bg-gray-800'
                    }`}>
                    <span className="text-6xl filter drop-shadow-lg">
                        {card.themes?.includes('GenZ') ? '📱' :
                            card.themes?.includes('Mumbai') ? '🌧️' :
                                card.themes?.includes('Delhi') ? '🏭' : '🏛️'}
                    </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-white/50 backdrop-blur-sm">
                    <h2 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                        {card.themes?.[0] || 'GENERAL'}
                    </h2>
                    <p className="text-lg text-gray-900 font-serif leading-relaxed font-medium">
                        "{card.text}"
                    </p>
                </div>

                {/* Hints */}
                <div className="p-4 bg-gray-50/50 text-xs text-gray-500 flex justify-between border-t border-gray-200">
                    <span className="font-semibold">Swipe Left: {card.choices.left.text}</span>
                    <span className="font-semibold">Swipe Right: {card.choices.right.text}</span>
                </div>
            </div>
        </motion.div>
    );
}
