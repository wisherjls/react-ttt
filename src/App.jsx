import { useState } from "react";

import { calculateWinner } from "./lib";

export default function App() {
  const [turn, setTurn] = useState("X"); // "X" is first turn
  const [squares, setSquares] = useState(Array(9).fill(null));

  const hasGameStarted = squares.some((square) => square !== null);

  const winner = calculateWinner(squares);
  const isTie = !winner && squares.every((square) => square !== null);

  const handleClick = (index) => {
    if (squares[index] || winner) return; // Ignore click if square is already filled or game is won.

    const newSquares = [...squares]; // * No mutation of state!
    newSquares[index] = turn;

    setSquares(newSquares);
    setTurn(turn === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setTurn("X");
  };

  const getStatusMessage = () => {
    if (winner) return `Winner: ${winner}! 🎉`;
    if (isTie) return "It's a tie! 🤝";

    return `Next player: ${turn}`;
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <div className="flex flex-col items-center gap-6">
        {/* Status message */}
        <header className="text-3xl font-bold text-white">
          {getStatusMessage()}
        </header>

        <div className="relative grid grid-cols-3 w-fit gap-0">
          {/* Horizontal lines */}
          <div className="absolute left-0 right-0 h-1 bg-purple-500 top-[calc(33.333%-0.125rem)]" />
          <div className="absolute left-0 right-0 h-1 bg-purple-500 top-[calc(66.666%-0.125rem)]" />

          {/* Vertical lines */}
          <div className="absolute top-0 bottom-0 w-1 bg-purple-500 left-[calc(33.333%-0.125rem)]" />
          <div className="absolute top-0 bottom-0 w-1 bg-purple-500 left-[calc(66.666%-0.125rem)]" />

          {Array.from({ length: 9 }, (_, i) => (
            <Square
              key={i}
              value={squares[i]}
              // Parent manages the square's state and 🆔. Square is more presentational.
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
