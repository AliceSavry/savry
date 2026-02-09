interface HeaderProps {
  currentGame: string | null;
  onBack: () => void;
}

export default function Header({ currentGame, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-savry-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {currentGame ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-savry-600 hover:text-savry-800 font-semibold transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="hidden sm:inline">Retour</span>
          </button>
        ) : (
          <div className="text-3xl animate-float">🎮</div>
        )}

        <div className="flex-1">
          {currentGame ? (
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">{currentGame}</h1>
          ) : (
            <div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-savry-600 to-savry-800 bg-clip-text text-transparent">
                Les Savry
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium -mt-0.5">Game Hub Familial</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            En ligne
          </div>
        </div>
      </div>
    </header>
  );
}
