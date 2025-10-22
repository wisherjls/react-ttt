import { useState } from "react";

import Square from "./components/square";

export default function App() {
  const [turn, setTurn] = useState("X"); // "X" is first turn
  const [squares, setSquares] = useState(Array(9).fill(null));

  const handleClick = (index) => {
    if (squares[index]) return; // Ignore click if square is already non `null` (e.g. truthy/filled).

    const newSquares = [...squares]; // * No mutation of state!
    newSquares[index] = turn;

    setSquares(newSquares);
    setTurn(turn === "X" ? "O" : "X");
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gray-900">
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
    </main>
  );
}
