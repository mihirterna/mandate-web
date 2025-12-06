import { GameProvider } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <GameProvider>
        <GameBoard />
      </GameProvider>
      <SpeedInsights />
      <Analytics />
    </main>
  );
}
