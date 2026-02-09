import type { GameEntry } from "../games/registry";

interface GameCardProps {
  game: GameEntry;
  index: number;
  onClick: () => void;
}

export default function GameCard({ game, index, onClick }: GameCardProps) {
  const difficultyColor = {
    Facile: "bg-green-100 text-green-700",
    Moyen: "bg-yellow-100 text-yellow-700",
    Difficile: "bg-red-100 text-red-700",
  }[game.difficulty];

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] overflow-hidden text-left animate-slide-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {/* Gradient header */}
      <div className={`h-28 sm:h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        <span className="text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">
          {game.emoji}
        </span>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-savry-600 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {game.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColor}`}>
            {game.difficulty}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-savry-50 text-savry-600">
            👥 {game.players} joueur{game.players !== "1" ? "s" : ""}
          </span>
        </div>

        {/* Play button hint */}
        <div className="mt-4 flex items-center gap-2 text-savry-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Jouer</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </button>
  );
}
