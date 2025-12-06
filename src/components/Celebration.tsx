import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, HeartCrack, Skull, ThumbsDown, UserX, Globe, ShieldAlert, PartyPopper } from 'lucide-react';

const NUM_PARTICLES = 50;

type CelebrationType = 'victory' | 'health_low' | 'economy_low' | 'votes_low' | 'relations_low';

const Particle = ({ x, y, color, type }: { x: number; y: number; color: string, type: CelebrationType }) => {
    // Select icon based on type
    let Icon = null;
    let rotation = Math.random() * 360;

    switch (type) {
        case 'economy_low':
            Icon = Math.random() > 0.5 ? DollarSign : TrendingDown;
            break;
        case 'health_low':
            Icon = Math.random() > 0.5 ? HeartCrack : Skull;
            break;
        case 'votes_low':
            Icon = Math.random() > 0.5 ? ThumbsDown : UserX;
            break;
        case 'relations_low':
            Icon = Math.random() > 0.5 ? Globe : ShieldAlert;
            break;
        case 'victory':
        default:
            // For victory, we use simple circles (confetti)
            break;
    }

    if (type === 'victory') {
        return (
            <motion.div
                initial={{ x, y, opacity: 1, scale: 0 }}
                animate={{
                    x: x + (Math.random() - 0.5) * 400,
                    y: y + (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: [0, 1.5, 0],
                    rotate: rotation
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute w-3 h-3 rounded-full ${color}`}
            />
        );
    }

    return (
        <motion.div
            initial={{ x, y: -50, opacity: 1, scale: 0 }}
            animate={{
                x: x + (Math.random() - 0.5) * 100,
                y: window.innerHeight + 50, // Fall to bottom
                opacity: [1, 1, 0],
                scale: [0, 1.5, 1],
                rotate: rotation + 180
            }}
            transition={{ duration: 1.2, ease: "easeIn" }}
            className={`absolute text-red-600/60`}
        >
            {Icon && <Icon size={32} />}
        </motion.div>
    );
};

export default function Celebration({ type = 'victory' }: { type?: CelebrationType }) {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        // For defeat, stop generating after 1 second
        if (type !== 'victory') {
            const timer = setTimeout(() => setIsGenerating(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [type]);

    useEffect(() => {
        const colors = ['bg-yellow-500', 'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

        const interval = setInterval(() => {
            if (!isGenerating) return;

            const newParticles: { id: number; x: number; y: number; color: string }[] = [];
            const x = Math.random() * window.innerWidth;
            const y = type === 'victory' ? Math.random() * window.innerHeight : -50;

            // Generate fewer particles for defeat to avoid clutter
            const count = type === 'victory' ? 20 : 3;

            for (let i = 0; i < count; i++) {
                newParticles.push({
                    id: Date.now() + i,
                    x: type === 'victory' ? x : Math.random() * window.innerWidth,
                    y: type === 'victory' ? y : -50,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }

            setParticles(prev => [...prev, ...newParticles]);

            // Cleanup old particles
            setTimeout(() => {
                setParticles(prev => prev.slice(count));
            }, 2000);

        }, type === 'victory' ? 800 : 200); // Faster generation for defeat rain

        return () => clearInterval(interval);
    }, [type, isGenerating]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map(p => (
                <Particle key={p.id} x={p.x} y={p.y} color={p.color} type={type} />
            ))}
        </div>
    );
}
