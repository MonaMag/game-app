import { Cell } from '../checkers/page';

export const isValidMove = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  board: Cell[][]
) => {
  console.log('isValidMove', x, y, targetX, targetY);

  if (targetX < 0 || targetX >= 8 || targetY < 0 || targetY >= 8) {
    return false;
  }
  const dx = Math.abs(targetX - x);
  const dy = Math.abs(targetY - y);
  if (dx !== dy || dx > 1) return false;

  const targetCell = board[targetX][targetY];
  const selectedCell = board[x][y];

  if (targetCell.checker !== null) {
    const isOpponentChecker =
      targetCell.checker === 'black' && selectedCell.checker === 'white';

    if (isOpponentChecker) {
      const jumpX = targetX + (targetX - x);
      const jumpY = targetY + (targetY - y);
      const isJumpCell =
        jumpX >= 0 &&
        jumpX < 8 &&
        jumpY >= 0 &&
        jumpY < 8 &&
        board[jumpX][jumpY].checker === null;
      return isJumpCell;
    }

    return false;
  }

  if (selectedCell.checker === 'white' && targetX >= x) {
    return false;
  }

  if (selectedCell.checker === 'black' && targetX <= x) {
    return false;
  }

  return true;
};
