import { Cell } from "../types";

export const getPossibleCheckerMoves = (x: number, y: number, kind: 'black' | 'white', board: Cell[][]) => {
    const moves: {x: number, y: number, eat: boolean}[] = [];
  
    const directions = kind === 'black'
    ? [{ dy: 1, dx: -1 }, { dy: 1, dx: 1 }]
    : [{ dy: -1, dx: -1 }, { dy: -1, dx: 1 }]; 

    directions.forEach(({ dy, dx }) => {
      const targetY = y + dy;
      const targetX = x + dx;

      if (targetX >= 0 && targetX < 8 && targetY >= 0 && targetY < 8) {
        const targetCell = board[targetY][targetX];

        if (targetCell.checker === null) {
          moves.push({ x: targetX, y: targetY, eat: false });
        } else if (targetCell.checker === 'white') {
          const jumpX = targetX + dx;
          const jumpY = targetY + dy;

          if (
            jumpX >= 0 &&
            jumpX < 8 &&
            jumpY >= 0 &&
            jumpY < 8 &&
            board[jumpY][jumpX].checker === null
          ) {
            moves.push({ x: jumpX, y: jumpY, eat: true });
          }
        }
      }
    });

    return moves;
  };
