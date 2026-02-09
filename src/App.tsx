import { useState, useCallback } from "react";
import Header from "./components/Header";
import GameHub from "./components/GameHub";
import GamePlayer from "./components/GamePlayer";
import { GAMES } from "./games/registry";

export function App() {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const currentGame = currentGameId
    ? GAMES.find((g) => g.id === currentGameId)
    : null;

  const handleSelectGame = useCallback((gameId: string) => {
    setCurrentGameId(gameId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentGameId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-savry-50/50 via-white to-purple-50/30">
      <Header
        currentGame={currentGame?.title ?? null}
        onBack={handleBack}
      />

      {currentGameId ? (
        <GamePlayer gameId={currentGameId} />
      ) : (
        <GameHub onSelectGame={handleSelectGame} />
      )}
    </div>
  );
}
