import { useState, useEffect, useCallback, useRef } from "react";

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

function randomFood(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dirRef = useRef(direction);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch handling
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 30) return;

    if (absDx > absDy) {
      const newDir = dx > 0 ? "RIGHT" : "LEFT";
      if (dirRef.current !== (newDir === "RIGHT" ? "LEFT" : "RIGHT")) {
        dirRef.current = newDir;
        setDirection(newDir);
      }
    } else {
      const newDir = dy > 0 ? "DOWN" : "UP";
      if (dirRef.current !== (newDir === "DOWN" ? "UP" : "DOWN")) {
        dirRef.current = newDir;
        setDirection(newDir);
      }
    }
  }, []);

  const startGame = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setFood(randomFood([{ x: 7, y: 7 }]));
    setDirection("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    containerRef.current?.focus();
  }, []);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (gameOver) {
          startGame();
          return;
        }
        if (!isPlaying) {
          startGame();
          return;
        }
        setIsPaused(p => !p);
        return;
      }

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        z: "UP", s: "DOWN", q: "LEFT", d: "RIGHT",
        Z: "UP", S: "DOWN", Q: "LEFT", D: "RIGHT",
      };
      const newDir = keyMap[e.key];
      if (!newDir) return;
      e.preventDefault();

      const opposites: Record<Direction, Direction> = {
        UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
      };
      if (opposites[newDir] !== dirRef.current) {
        dirRef.current = newDir;
        setDirection(newDir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying, gameOver, startGame]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;

    const speed = Math.max(80, INITIAL_SPEED - score * 3);
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const dir = dirRef.current;

        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // Walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          setScore((s) => {
            setBestScore((b) => Math.max(b, s));
            return s;
          });
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          setScore((s) => {
            setBestScore((b) => Math.max(b, s));
            return s;
          });
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, score, isPaused]);

  const cellSize = `min(calc((100vw - 4rem) / ${GRID_SIZE}), calc(28rem / ${GRID_SIZE}))`;

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-4 p-4 outline-none select-none"
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stats */}
      <div className="flex gap-6 text-center">
        <div className="bg-green-50 rounded-2xl px-5 py-3">
          <div className="text-sm text-green-600 font-medium">Score</div>
          <div className="text-3xl font-black text-green-700">{score}</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl px-5 py-3">
          <div className="text-sm text-yellow-600 font-medium">Record</div>
          <div className="text-3xl font-black text-yellow-700">{bestScore}</div>
        </div>
      </div>

      {/* Grid */}
      <div
        className="relative rounded-2xl overflow-hidden bg-green-900/10 border-2 border-green-300"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize})`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize})`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
          const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          const isEven = (x + y) % 2 === 0;

          return (
            <div
              key={i}
              className={`
                transition-colors duration-100
                ${isEven ? "bg-green-100/50" : "bg-green-50/50"}
                ${isSnakeHead ? "bg-green-600 rounded-md shadow-lg z-10" : ""}
                ${isSnakeBody ? "bg-green-500 rounded-sm" : ""}
              `}
              style={{ width: cellSize, height: cellSize }}
            >
              {isFood && (
                <div className="w-full h-full flex items-center justify-center text-sm animate-pulse">
                  🍎
                </div>
              )}
              {isSnakeHead && (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  👀
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overlay */}
      {(!isPlaying || isPaused) && (
        <div className="text-center animate-scale-in">
          {gameOver ? (
            <>
              <div className="text-2xl font-bold text-red-500 mb-1">💀 Game Over !</div>
              <div className="text-gray-500 mb-3">Score : {score}</div>
            </>
          ) : isPaused ? (
            <div className="text-xl font-bold text-yellow-600 mb-3">⏸️ Pause</div>
          ) : (
            <div className="text-gray-500 mb-3">
              <span className="block text-sm">Flèches / ZQSD pour bouger</span>
              <span className="block text-sm">Swipe sur mobile 📱</span>
            </div>
          )}
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 active:scale-95 transition-all shadow-md text-lg"
          >
            {gameOver ? "🔄 Rejouer" : isPaused ? "▶️ Reprendre" : "▶️ Jouer !"}
          </button>
        </div>
      )}

      {/* Mobile controls */}
      {isPlaying && !isPaused && (
        <div className="sm:hidden grid grid-cols-3 gap-1 w-36">
          <div />
          <button onClick={() => { if (dirRef.current !== "DOWN") { dirRef.current = "UP"; setDirection("UP"); } }} className="bg-green-200 rounded-lg p-3 text-xl active:bg-green-300">↑</button>
          <div />
          <button onClick={() => { if (dirRef.current !== "RIGHT") { dirRef.current = "LEFT"; setDirection("LEFT"); } }} className="bg-green-200 rounded-lg p-3 text-xl active:bg-green-300">←</button>
          <button onClick={() => setIsPaused(true)} className="bg-yellow-200 rounded-lg p-3 text-xs active:bg-yellow-300 font-bold">⏸️</button>
          <button onClick={() => { if (dirRef.current !== "LEFT") { dirRef.current = "RIGHT"; setDirection("RIGHT"); } }} className="bg-green-200 rounded-lg p-3 text-xl active:bg-green-300">→</button>
          <div />
          <button onClick={() => { if (dirRef.current !== "UP") { dirRef.current = "DOWN"; setDirection("DOWN"); } }} className="bg-green-200 rounded-lg p-3 text-xl active:bg-green-300">↓</button>
          <div />
        </div>
      )}
    </div>
  );
}
