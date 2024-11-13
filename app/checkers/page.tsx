'use client';

import { useCallback, useEffect, useState } from 'react';
import CheckersBoard from './CheckersBoard';
import { isValidMove } from '../helpers/isValidMove';
import { Cell, Cheker } from '../types';
import { initialBoard } from '../helpers/getInitialBoard';
import { getAllBlackCheckersMoves } from '../helpers/getAllBlackCheckersMoves';
import { hasAnyMoves } from '../helpers/hasAnyMoves';
import { chooseRandomMove } from '../helpers/chooseRandomMove';

export default function ChekerPage() {
  const [board, setBoard] = useState<Cell[][]>(initialBoard);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isWinner, setIsWinner] = useState<Cheker>(null);

  //onMove checker
  const onMoveChecker = useCallback(
    (x: number, y: number, targetX: number, targetY: number) => {
      const newBoard = [...board];
      const selectedChecker = newBoard[y][x].checker;

      const dx = Math.abs(targetX - x);
      const dy = Math.abs(targetY - y);

      if (dx === 2 && dy === 2) {
        const midX = (targetX + x) / 2;
        const midY = (targetY + y) / 2;

        newBoard[midY][midX].checker = null;
      }

      newBoard[targetY][targetX].checker = selectedChecker;
      newBoard[y][x].checker = null;

      setBoard(newBoard);
    },
    [board]
  );

  //handle click checker
  const handleClickCell = (x: number, y: number) => {
    console.log('handleClickCell', x, y);
    if (selected) {
      const { x: selectedX, y: selectedY } = selected;

      if (isValidMove(selectedX, selectedY, x, y, board)) {
        onMoveChecker(selectedX, selectedY, x, y);
        setSelected(null);

        if (!hasAnyMoves(board, false)) {
          setIsWinner('white');
          return;
        }

        setIsWhiteTurn(false);
        return;
      }
    }
    const selectedCell = board[y][x];
    if (selectedCell.checker === 'white' && isWhiteTurn) {
      setSelected({ x, y });
    }
  };

  useEffect(() => {
    if (!isWhiteTurn) {
      const moves = getAllBlackCheckersMoves(board);
      if (moves.length > 0) {
        const randomMove = chooseRandomMove(board);

        const delay = 2000;
        const timeoutId = setTimeout(() => {
          onMoveChecker(
            randomMove.x,
            randomMove.y,
            randomMove.targetX,
            randomMove.targetY
          );

          if (!hasAnyMoves(board, true)) {
            setIsWinner('black');
          } else {
            setIsWhiteTurn(true);
          }
        }, delay);

        return () => clearTimeout(timeoutId);
      } else {
        setIsWinner('white');
      }
    }
  }, [isWhiteTurn, board]);

  return (
    <div className='flex flex-col w-full h-screen items-center p-10'>
      <h2 className='mb-5 text-2xl font-bold underline text-stone-700'>
        Checkers game
      </h2>
      <CheckersBoard board={board} onClickCell={handleClickCell} />
      <div>{isWinner ? `Winner: ${isWinner}` : null}</div>
    </div>
  );
}
