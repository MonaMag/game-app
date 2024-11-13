import { Cell } from '../types';
import { isWithinBounds } from './isWithinBounds';

export const isValidMove = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  board: Cell[][]
) => {
  if (
    !isWithinBounds(targetX, targetY) ||
    board[targetY][targetX].checker !== null
  ) {
    return false;
  }
  const dx = Math.abs(targetX - x);
  const dy = Math.abs(targetY - y);
  if (dx !== dy || dx > 2) return false;

  const selectedCell = board[y][x];

  if (dx === 2) {
    const midX = (targetX + x) / 2;
    const midY = (targetY + y) / 2;

    const midCell = board[midY][midX];

    if (midCell && midCell.checker === 'black') {
      return true;
    }
    return false;
  }

  if (selectedCell.checker === 'white' && targetY >= y) {
    return false;
  }
  return true;
};
