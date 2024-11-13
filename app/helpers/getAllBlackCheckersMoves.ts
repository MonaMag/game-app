import { Cell, MoveCheckerType } from "../types";
import { getPossibleCheckerMoves } from "./getPossibleCheckerMoves";

export const getAllBlackCheckersMoves = (board: Cell[][]): MoveCheckerType[] => {
  const allMoves: MoveCheckerType[] = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = board[y][x];

      if (cell.checker === 'black') {
        const movesForChecker = getPossibleCheckerMoves(
          x,
          y,
          cell.checker,
          board
        );
        movesForChecker.forEach((move) => {
          allMoves.push({
            x: x,
            y: y,
            targetX: move.x,
            targetY: move.y,
            eat: move.eat,
          });
        });
      }
    }
  }
  return allMoves;
};
