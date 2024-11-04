import { Position } from './page';

export const Board = ({
  rows,
  cols,
  snake,
  hitCount,
}: {
  rows: number;
  cols: number;
  snake: Position[];
  hitCount: number;
}) => {
  return (
    <div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className='flex justify-center items-center'>
          {Array.from({ length: cols }, (_, colIndex) => {
            const isSnakePart = snake.some(
              (part) => part.x === colIndex && part.y === rowIndex
            );
            const isHead =
              isSnakePart && snake[0].x === colIndex && snake[0].y === rowIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 border relative ${
                  isSnakePart
                    ? hitCount >= 10
                      ? 'bg-red-500 border rounded-full'
                      : 'bg-blue-400 border rounded-full'
                    : 'bg-white'
                }`}
              >
                {isHead &&
                  (hitCount >= 10 ? (
                    <>
                      <div className='absolute w-2 h-1 bg-white top-[20%] left-[15%]' />
                      <div className='absolute w-2 h-1 bg-white top-[20%] left-[55%]' />
                    </>
                  ) : (
                    <>
                      <div className='absolute w-2 h-2 bg-white rounded-full top-[20%] left-[15%]' />
                      <div className='absolute w-2 h-2 bg-white rounded-full top-[20%] left-[55%]' />
                    </>
                  ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
