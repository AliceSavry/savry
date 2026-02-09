import { GAMES } from "../games/registry";
import GameCard from "./GameCard";

interface GameHubProps {
  onSelectGame: (gameId: string) => void;
}

export default function GameHub({ onSelectGame }: GameHubProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10 animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">
          🎲 Salle de Jeux 🎲
        </h2>
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto">
          Bienvenue chez les Savry ! Choisis ton jeu et c'est parti pour le fun 🎉
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-savry-50 text-savry-700 rounded-full px-4 py-2 text-sm font-medium">
          <span className="text-lg">🕹️</span>
          {GAMES.length} jeu{GAMES.length > 1 ? "x" : ""} disponible{GAMES.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Games grid */}
      {GAMES.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GAMES.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              index={i}
              onClick={() => onSelectGame(game.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-lg font-medium">Aucun jeu pour le moment</p>
          <p className="text-sm mt-1">Ajoutez votre premier jeu dans <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/games/registry.ts</code></p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-300 pb-6">
        <p>Fait avec ❤️ par la famille Savry</p>
      </footer>
    </div>
  );
}
