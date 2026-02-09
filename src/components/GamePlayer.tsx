import { Suspense } from "react";
import { GAMES } from "../games/registry";

interface GamePlayerProps {
  gameId: string;
}

export default function GamePlayer({ gameId }: GamePlayerProps) {
  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-bold text-gray-700">Jeu introuvable</h2>
        <p className="text-gray-400 mt-2">Ce jeu n'existe pas ou a été supprimé.</p>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 animate-scale-in">
      {/* Game info bar */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <span className="text-3xl">{game.emoji}</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{game.title}</h2>
          <p className="text-sm text-gray-400">{game.description}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-savry-50 text-savry-600">
            👥 {game.players}
          </span>
        </div>
      </div>

      {/* Game container */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 flex justify-center">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin text-4xl">🎮</div>
              </div>
            }
          >
            <GameComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
