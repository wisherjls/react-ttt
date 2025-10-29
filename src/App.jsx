
import { useEffect, useRef, useState } from "react";

import { WINNING_INDICES } from "./constants";
import { calculateWinner } from "./lib";


export default function App() {
  const [turn, setTurn] = useState("X"); // "X" is first turn
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [moveCount, setMoveCount] = useState(0);

  // Sound refs
  const winSoundRef = useRef(null);
  const placeSoundRef = useRef(null);
  const resetSoundRef = useRef(null);

  const hasGameStarted = squares.some((square) => square !== null);


  const winner = calculateWinner(squares);
  const isTie = !winner && squares.every((square) => square !== null);

  // Find the winning line indices if there is a winner
  let winLine = null;
  if (winner) {
    winLine = WINNING_INDICES.find(indices =>
      indices.every(idx => squares[idx] === winner)
    );
  }

  const handleClick = (index) => {
    if (squares[index] || winner) return; // Ignore click if square is already filled or game is won.

    // Play place sound
    if (placeSoundRef.current) {
      placeSoundRef.current.currentTime = 0;
      placeSoundRef.current.play();
    }

    const newSquares = [...squares]; // * No mutation of state!
    newSquares[index] = turn;

    setSquares(newSquares);
    setTurn(turn === "X" ? "O" : "X");
    setMoveCount((prev) => prev + 1);
  };

  const handleReset = () => {
    // Play reset sound
    if (resetSoundRef.current) {
      resetSoundRef.current.currentTime = 0;
      resetSoundRef.current.play();
    }
    setSquares(Array(9).fill(null));
    setTurn("X");
    setMoveCount(0);
  };


  // Play win sound when winner appears (side effect)
  useEffect(() => {
    if (winner && winSoundRef.current) {
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play();
    }
    // Only run when winner changes
  }, [winner]);

  const getStatusMessage = () => {
    if (winner) return `Winner: ${winner}! 🎉`;
    if (isTie) return "It's a tie! 🤝";

    return `Next player: ${turn}`;
  };

  // Move count display logic
  const getMoveCountMessage = () => {
    if (moveCount === 0) return "No moves yet";
    return `${moveCount} move${moveCount === 1 ? "" : "s"}`;
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gray-900">
      {/* Audio elements for sound effects */}
      <audio ref={winSoundRef} src="/sounds/win.mp3" preload="auto" />
      <audio ref={placeSoundRef} src="/sounds/place.mp3" preload="auto" />
      <audio ref={resetSoundRef} src="/sounds/reset.mp3" preload="auto" />

      <div className="flex flex-col items-center gap-6">
        {/* Status message */}
        <header className="flex flex-col items-center gap-2">
          <span className="text-3xl font-bold text-white">{getStatusMessage()}</span>
          <span className="text-lg font-semibold text-purple-300 bg-gray-800 px-4 py-2 rounded shadow mt-2">
            {getMoveCountMessage()}
          </span>
        </header>


        {/* Board grid with lines */}
        <div
          className="relative grid grid-cols-3 grid-rows-3 w-[432px] h-[432px] gap-0"
          style={{ boxSizing: "content-box" }}
        >
          {/* Win line overlay */}
          {winLine && <WinLine indices={winLine} />}

          {/* Grid lines (2 horizontal, 2 vertical) */}
          {/* Horizontal lines */}
          <div className="absolute left-0 right-0 h-1 bg-purple-500" style={{ top: 144 - 0.5 }} />
          <div className="absolute left-0 right-0 h-1 bg-purple-500" style={{ top: 288 - 0.5 }} />
          {/* Vertical lines */}
          <div className="absolute top-0 bottom-0 w-1 bg-purple-500" style={{ left: 144 - 0.5 }} />
          <div className="absolute top-0 bottom-0 w-1 bg-purple-500" style={{ left: 288 - 0.5 }} />

          {/* Squares */}
          {Array.from({ length: 9 }, (_, i) => (
            <Square
              key={i}
              value={squares[i]}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={!hasGameStarted}
          className={`px-6 py-3 font-bold rounded-lg transition-colors duration-200 ${
            hasGameStarted
              ? "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          {winner || isTie ? "Play Again" : "Restart"}
        </button>
      </div>
    </main>
  );
}


// Only one Square component
function Square({ value, onClick }) {
  return (
    <button
      className="text-9xl font-bold size-36 text-center text-white hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      {value}
    </button>
  );
}


function WinLine({ indices }) {
  // Map board indices to (row, col)
  const pos = indices.map(i => [Math.floor(i / 3), i % 3]);
  const [r1, c1] = pos[0];
  const [r2, c2] = pos[2];
  const size = 144;
  // Board edge coordinates
  let x1, y1, x2, y2;
  if (r1 === r2) {
    // Horizontal win
    x1 = 0;
    y1 = r1 * size + size / 2;
    x2 = 3 * size;
    y2 = y1;
  } else if (c1 === c2) {
    // Vertical win
    x1 = c1 * size + size / 2;
    y1 = 0;
    x2 = x1;
    y2 = 3 * size;
  } else if (r1 === 0 && c1 === 0) {
    // Diagonal top-left to bottom-right
    x1 = 0;
    y1 = 0;
    x2 = 3 * size;
    y2 = 3 * size;
  } else {
    // Diagonal top-right to bottom-left
    x1 = 3 * size;
    y1 = 0;
    x2 = 0;
    y2 = 3 * size;
  }
  // Calculate length and angle
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  // Center position
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  return (
    <div
      className="pointer-events-none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 3 * size,
        height: 3 * size,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: cx - length / 2,
          top: cy - 6,
          width: length,
          height: 12,
          background: "#a21caf", // tailwind purple-500
          borderRadius: 8,
          transform: `rotate(${angle}deg)`
        }}
      />
    </div>
  );
}
