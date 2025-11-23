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
            className="absolute w-full max-w-sm aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border-4 border-gray-800 z-10"
        >
            {/* Choice Overlays */}
            <motion.div
                style={{ opacity: rightOpacity }}
                className="absolute top-8 left-8 border-4 border-green-500 text-green-500 rounded-lg p-2 text-2xl font-bold uppercase tracking-widest z-20 transform -rotate-12"
            >
                {card.choices.right.text}
            </motion.div>

            <motion.div
                style={{ opacity: leftOpacity }}
                className="absolute top-8 right-8 border-4 border-red-500 text-red-500 rounded-lg p-2 text-2xl font-bold uppercase tracking-widest z-20 transform rotate-12"
            >
                {card.choices.left.text}
            </motion.div>

            {/* Card Content */}
            <div className="h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="h-1/2 bg-gray-200 flex items-center justify-center border-b-2 border-gray-800">
                    <span className="text-6xl">🏛️</span>
                </div>

                {/* Text Content */}
                <div className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-[#fdfbf7]">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{card.id.split('_')[0].toUpperCase()}</h2>
                    <p className="text-lg text-gray-800 font-serif leading-relaxed">
                        "{card.text}"
                    </p>
                </div>

                {/* Hints */}
                <div className="p-4 bg-gray-100 text-xs text-gray-500 flex justify-between border-t border-gray-300">
                    <span>Swipe Left: {card.choices.left.text}</span>
                    <span>Swipe Right: {card.choices.right.text}</span>
                </div>
            </div>
        </motion.div>
    );
}
