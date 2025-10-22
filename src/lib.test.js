import { describe, expect, test } from "vitest";

import { calculateWinner } from "./lib.js";

describe("calculateWinner", () => {
  test("returns null for empty board", () => {
    const board = Array(9).fill(null);
    expect(calculateWinner(board)).toBeNull();
  });

  test("returns null for incomplete game", () => {
    const board = ["X", "O", "X", null, "O", null, null, null, null];
    expect(calculateWinner(board)).toBeNull();
  });

  test("returns null for full board with no winner (draw)", () => {
    const board = ["X", "X", "O", "O", "O", "X", "X", "O", "X"];
    expect(calculateWinner(board)).toBeNull();
  });

  describe("X wins", () => {
    test("top row", () => {
      const board = ["X", "X", "X", "O", "O", null, null, null, null];
      expect(calculateWinner(board)).toBe("X");
    });

    test("middle row", () => {
      const board = ["O", "O", null, "X", "X", "X", null, null, null];
      expect(calculateWinner(board)).toBe("X");
    });

    test("bottom row", () => {
      const board = ["O", "O", null, null, null, null, "X", "X", "X"];
      expect(calculateWinner(board)).toBe("X");
    });

    test("left column", () => {
      const board = ["X", "O", "O", "X", null, null, "X", null, null];
      expect(calculateWinner(board)).toBe("X");
    });

    test("middle column", () => {
      const board = ["O", "X", "O", null, "X", null, null, "X", null];
      expect(calculateWinner(board)).toBe("X");
    });

    test("right column", () => {
      const board = ["O", "O", "X", null, null, "X", null, null, "X"];
      expect(calculateWinner(board)).toBe("X");
    });

    test("diagonal top-left to bottom-right", () => {
      const board = ["X", "O", "O", null, "X", null, null, null, "X"];
      expect(calculateWinner(board)).toBe("X");
    });

    test("diagonal top-right to bottom-left", () => {
      const board = ["O", "O", "X", null, "X", null, "X", null, null];
      expect(calculateWinner(board)).toBe("X");
    });
  });

  describe("O wins", () => {
    test("top row", () => {
      const board = ["O", "O", "O", "X", "X", null, null, null, null];
      expect(calculateWinner(board)).toBe("O");
    });

    test("diagonal top-left to bottom-right", () => {
      const board = ["O", "X", "X", null, "O", null, null, null, "O"];
      expect(calculateWinner(board)).toBe("O");
    });
  });

  test("prioritizes X over O when both somehow win (edge case)", () => {
    // This shouldn't happen in a real game, but tests the implementation
    const board = ["X", "X", "X", "O", "O", "O", null, null, null];
    expect(calculateWinner(board)).toBe("X");
  });
});
