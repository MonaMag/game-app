import { Position } from './page';

export const Board = ({
  rows,
  cols,
  snake,
  hitCount,
  isGameOver,
  onToggleAutoMove,
  onRestart,
  isAutoMove,
}: {
  rows: number;
  cols: number;
  snake: Position[];
  hitCount: number;
  isGameOver: boolean;
  onToggleAutoMove: () => void;
  onRestart: () => void;
  isAutoMove: boolean;
}) => {
  return (
    <div className='flex flex-col w-full items-center p-10'>
      <h2 className='mb-8 text-2xl font-semibold text-blue-400 underline'>
        Snake game
      </h2>

      <button
        onClick={onToggleAutoMove}
        className='mb-4 px-6 py-1 border border-blue-400 rounded'
      >
        {isAutoMove ? 'click' : 'auto'}
      </button>
      <div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className='flex justify-center items-center'>
            {Array.from({ length: cols }, (_, colIndex) => {
              const isSnakePart = snake.some(
                (part) => part.x === colIndex && part.y === rowIndex
              );
              const isHead =
                isSnakePart &&
                snake[0].x === colIndex &&
                snake[0].y === rowIndex;

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

      {isGameOver && (
        <div className='flex flex-col items-center'>
          <div className='mt-4 px-6 text-red-400 text-lg'>
            Game over! You hit the border 10 times.
          </div>
          <button
            onClick={onRestart}
            className='w-40 mt-4 px-4 py-1 border border-blue-400 rounded'
          >
            restart
          </button>
        </div>
      )}
    </div>
  );
};
