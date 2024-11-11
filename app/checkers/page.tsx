'use client';

import { useCallback, useState } from 'react';
import CheckersBoard from './CheckersBoard';
import { isValidMove } from '../helpers/isValidMove';

export type Cheker = 'white' | 'black' | null;

export interface Cell {
  checker: Cheker;
}

const initialBoard: Cell[][] = [
  [
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
  ],
  [
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
  ],
  [
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
    { checker: null },
    { checker: 'black' },
  ],

  [
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
  ],
  [
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
    { checker: null },
  ],
  [
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
  ],
  [
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
  ],
  [
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
    { checker: 'white' },
    { checker: null },
  ],
];

export default function ChekerPage() {
  const [board, setBoard] = useState<Cell[][]>(initialBoard);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const moveChecker = useCallback(
    (x: number, y: number, targetX: number, targetY: number) => {
      console.log('moveChecker');
      const newBoard = [...board];
      const selectedChecker = newBoard[x][y].checker;

      if (newBoard[targetX][targetY].checker !== null) {
        
        const jumpX = targetX + (targetX - x);
        const jumpY = targetY + (targetY - y);
        newBoard[targetX][targetY].checker = null; 
        newBoard[jumpX][jumpY].checker = selectedChecker;
      } else {
        newBoard[targetX][targetY].checker = selectedChecker;
      }
      newBoard[x][y].checker = null;
      setBoard(newBoard);
    },
    [board]
  );

  const handleClickCell = (x: number, y: number) => {

    console.log('handleClickCell', x, y);
    if (selected) {
      console.log('selected', selected);
      const { x: selectedX, y: selectedY } = selected;

      if (isValidMove(selectedX, selectedY, x, y, board)) {
        moveChecker(selectedX, selectedY, x, y);
        setSelected(null);
        setIsWhiteTurn(!isWhiteTurn);
        return;
      }
    }
    const selectedCell = board[x][y];
    if (selectedCell.checker === 'white' && isWhiteTurn) {
      setSelected({ x, y });
    }
  };


  return (
    <div className='flex flex-col w-full h-screen items-center p-10'>
      <h2 className='mb-5 text-2xl font-bold underline text-stone-700'>
        Checkers game
      </h2>
      <CheckersBoard board={board} onClickCell={handleClickCell} />
    </div>
  );
}
