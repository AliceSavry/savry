import { useState, useCallback } from "react";

type Player = "X" | "O";
type Cell = Player | null;

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Player; line: number[] } | null {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line: combo };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const result = checkWinner(board);
  const isDraw = !result && board.every((c) => c !== null);

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || result) return;
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const win = checkWinner(newBoard);
      if (win) {
        setScores((s) => ({ ...s, [win.winner]: s[win.winner] + 1 }));
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    },
    [board, currentPlayer, result]
  );

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  };

  const fullReset = () => {
    reset();
    setScores({ X: 0, O: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Scores */}
      <div className="flex gap-8 text-center">
        <div className={`rounded-2xl px-6 py-3 transition-all ${currentPlayer === "X" && !result ? "bg-blue-100 scale-110 ring-2 ring-blue-400" : "bg-gray-100"}`}>
          <div className="text-2xl font-bold text-blue-600">X</div>
          <div className="text-3xl font-black text-blue-800">{scores.X}</div>
        </div>
        <div className="flex items-center text-gray-400 text-xl font-bold">VS</div>
        <div className={`rounded-2xl px-6 py-3 transition-all ${currentPlayer === "O" && !result ? "bg-red-100 scale-110 ring-2 ring-red-400" : "bg-gray-100"}`}>
          <div className="text-2xl font-bold text-red-600">O</div>
          <div className="text-3xl font-black text-red-800">{scores.O}</div>
        </div>
      </div>

      {/* Status */}
      <div className="h-10 flex items-center">
        {result ? (
          <div className="text-xl font-bold text-green-600 animate-scale-in">
            🎉 {result.winner} a gagné !
          </div>
        ) : isDraw ? (
          <div className="text-xl font-bold text-orange-500 animate-scale-in">
            🤝 Match nul !
          </div>
        ) : (
          <div className="text-lg text-gray-600">
            Au tour de <span className={`font-bold ${currentPlayer === "X" ? "text-blue-600" : "text-red-600"}`}>{currentPlayer}</span>
          </div>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`
                w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-4xl sm:text-5xl font-black
                transition-all duration-200 active:scale-95
                ${cell ? "cursor-default" : "cursor-pointer hover:bg-gray-200 hover:scale-105"}
                ${isWinCell ? "bg-green-100 ring-4 ring-green-400 scale-105" : "bg-white shadow-md"}
                ${cell === "X" ? "text-blue-600" : "text-red-600"}
              `}
              disabled={!!cell || !!result}
            >
              {cell && <span className="animate-scale-in inline-block">{cell}</span>}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-savry-500 text-white font-semibold hover:bg-savry-600 active:scale-95 transition-all shadow-md"
        >
          🔄 Nouvelle partie
        </button>
        <button
          onClick={fullReset}
          className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 active:scale-95 transition-all"
        >
          Réinitialiser les scores
        </button>
      </div>
    </div>
  );
}
