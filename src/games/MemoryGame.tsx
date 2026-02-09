import { useState, useEffect, useCallback } from "react";

const EMOJIS = ["🎮", "🎲", "🎯", "🏆", "⭐", "🎪", "🎨", "🎵"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffleArray(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const matched = cards.filter((c) => c.matched).length;
  const isWon = matched === cards.length;

  useEffect(() => {
    if (isWon && (bestScore === null || moves < bestScore)) {
      setBestScore(moves);
    }
  }, [isWon, moves, bestScore]);

  const handleFlip = useCallback(
    (id: number) => {
      if (isChecking) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (selected.length >= 2) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, flipped: true } : c
      );
      setCards(newCards);

      const newSelected = [...selected, id];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        setIsChecking(true);
        const [first, second] = newSelected;
        const card1 = newCards.find((c) => c.id === first)!;
        const card2 = newCards.find((c) => c.id === second)!;

        if (card1.emoji === card2.emoji) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, matched: true }
                  : c
              )
            );
            setSelected([]);
            setIsChecking(false);
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, flipped: false }
                  : c
              )
            );
            setSelected([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [cards, selected, isChecking]
  );

  const restart = () => {
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setIsChecking(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      {/* Stats */}
      <div className="flex gap-6 text-center">
        <div className="bg-purple-50 rounded-2xl px-5 py-3">
          <div className="text-sm text-purple-500 font-medium">Coups</div>
          <div className="text-3xl font-black text-purple-700">{moves}</div>
        </div>
        <div className="bg-pink-50 rounded-2xl px-5 py-3">
          <div className="text-sm text-pink-500 font-medium">Paires</div>
          <div className="text-3xl font-black text-pink-700">{matched / 2}/{EMOJIS.length}</div>
        </div>
        {bestScore !== null && (
          <div className="bg-yellow-50 rounded-2xl px-5 py-3">
            <div className="text-sm text-yellow-600 font-medium">Record</div>
            <div className="text-3xl font-black text-yellow-700">{bestScore}</div>
          </div>
        )}
      </div>

      {/* Win message */}
      {isWon && (
        <div className="text-center animate-scale-in">
          <div className="text-2xl font-bold text-green-600">🎉 Bravo !</div>
          <div className="text-gray-500">En seulement {moves} coups !</div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl sm:text-4xl
              transition-all duration-300 active:scale-95
              ${
                card.flipped || card.matched
                  ? card.matched
                    ? "bg-green-100 ring-2 ring-green-300 scale-95"
                    : "bg-white shadow-lg scale-105"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 cursor-pointer hover:scale-105 shadow-md"
              }
            `}
            disabled={card.flipped || card.matched || isChecking}
          >
            {card.flipped || card.matched ? (
              <span className="animate-scale-in inline-block">{card.emoji}</span>
            ) : (
              <span className="text-white text-xl">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Actions */}
      <button
        onClick={restart}
        className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 active:scale-95 transition-all shadow-md"
      >
        🔄 Nouvelle partie
      </button>
    </div>
  );
}
