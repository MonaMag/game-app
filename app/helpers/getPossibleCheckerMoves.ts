import { Cell } from "../types";
import { isWithinBounds } from "./isWithinBounds";

export const getPossibleCheckerMoves = (x: number, y: number, kind: 'black' | 'white', board: Cell[][]) => {
    const moves: {x: number, y: number, eat: boolean}[] = [];
  
    const directions = kind === 'black'
    ? [{ dy: 1, dx: -1 }, { dy: 1, dx: 1 }]
    : [{ dy: -1, dx: -1 }, { dy: -1, dx: 1 }]; 

    directions.forEach(({ dy, dx }) => {
      const targetY = y + dy;
      const targetX = x + dx;

      if (isWithinBounds(targetX, targetY)) {
        const targetCell = board[targetY][targetX];

        if (targetCell.checker === null) {
          moves.push({ x: targetX, y: targetY, eat: false });
        } else if (targetCell.checker === 'white') {
          const jumpX = targetX + dx;
          const jumpY = targetY + dy;

          if (
            isWithinBounds(jumpX, jumpY) &&
            board[jumpY][jumpX].checker === null
          ) {
            moves.push({ x: jumpX, y: jumpY, eat: true });
          }
        }
      }
    });

    return moves;
  };
