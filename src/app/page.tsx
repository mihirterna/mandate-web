import { GameProvider } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </main>
  );
}
