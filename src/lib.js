import { WINNING_INDICES } from "./constants.js";

export const calculateWinner = (board) =>
  ["X", "O"].find((letter) =>
    WINNING_INDICES.some((winningIndices) =>
      winningIndices.every((winningIndex) => board[winningIndex] === letter)
    )
  ) || null;
