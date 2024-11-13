import { Cell } from "../types";
import { getPossibleCheckerMoves } from "./getPossibleCheckerMoves";

export const hasAnyMoves = (board: Cell[][], turn: boolean): boolean => {
  const kindChecker = turn ? 'white' : 'black';

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = board[y][x];
      if (cell.checker === kindChecker) {
        const moves = getPossibleCheckerMoves(x, y, kindChecker, board);
        if (moves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};