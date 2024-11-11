import React from 'react';
import { Cell } from './page';
import { twMerge } from 'tailwind-merge';

type BoardProps = {
  board: Cell[][];
  onClickCell: (x: number, y: number) => void;
};

export default function CheckersBoard({ board, onClickCell }: BoardProps) {
  return (
    <div className='grid grid-cols-8 w-100 h-100'>
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={twMerge(
              'w-10 h-10 flex items-center justify-center',
              `${
                (rowIndex + cellIndex) % 2 === 0
                  ? 'bg-stone-100 border'
                  : 'bg-stone-700'
              }`
            )}
            onClick={() => onClickCell(cellIndex, rowIndex)}
          >
            {cell.checker && (
              <div
                className={twMerge(
                  `${cell.checker === 'white' ? 'bg-white' : 'bg-red-700'}`,
                  'w-8 h-8 rounded-full hover:shadow-inner active:translate-y-1 transition-all   shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]'
                )}
              ></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
