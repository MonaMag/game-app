import { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const TIME_TO_MOVE = 200;

type Position = { x: number; y: number };

export function Snake({
  rows,
  cols,
  snakeLength = 3,
}: {
  rows: number;
  cols: number;
  snakeLength: number;
}) {
  const [snake, setSnake] = useState<Position[]>([]);
  const [isAutoMove, setIsAutoMove] = useState(false);
  const [hitCount, setHitCount] = useState(0);

  const isGameOver = hitCount >= 10;

  const currentPositionRef = useRef<Position>({ x: 0, y: 0 });
  const currentSnake = useRef<Position[]>(snake);
  currentSnake.current = snake;

  useEffect(() => {
    const initialSnake = Array.from({ length: snakeLength }, (_, index) => ({
      x: Math.floor(cols / 2) - Math.floor(snakeLength / 2) + index,
      y: Math.floor(rows / 2),
    }));
    setSnake(initialSnake);
  }, [snakeLength, cols, rows]);

  const moveSnake = useCallback(
    ({ x, y }: Position, currentSnake: Position[]) => {
      const newSnake = [...currentSnake];
      const headSnake = newSnake[0];

      const newHead = {
        x: headSnake.x + x,
        y: headSnake.y + y,
      };

      //сheck for out of bounds
      if (
        newHead.x < 0 ||
        newHead.x >= cols ||
        newHead.y < 0 ||
        newHead.y >= rows
      ) {
        setHitCount((prev) => prev + 1);

        return currentSnake;
      }

      //check for collision
      if (
        newSnake.some((part) => part.x === newHead.x && part.y === newHead.y)
      ) {
        return currentSnake;
      }

      newSnake.unshift(newHead);
      newSnake.pop();
      setSnake(newSnake);
      return newSnake;
    },
    [cols, rows]
  );

  useEffect(() => {
    if (isAutoMove) {
      const interval = setInterval(
        () => moveSnake(currentPositionRef.current, currentSnake.current),
        TIME_TO_MOVE
      );
      return () => clearInterval(interval);
    }
  }, [isAutoMove, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let currentPosition: Position | null = null;
      switch (event.key) {
        case 'ArrowLeft':
          currentPosition = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          currentPosition = { x: 1, y: 0 };
          break;
        case 'ArrowUp':
          currentPosition = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          currentPosition = { x: 0, y: 1 };
          break;
      }
      if (currentPosition) {
        currentPositionRef.current = currentPosition;
        if (!isAutoMove) {
          const newSnake = moveSnake(currentPosition, currentSnake.current);
          setSnake(newSnake);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAutoMove, moveSnake]);

  console.log('hitCount', hitCount);

  return (
    <div className="flex flex-col w-full items-center p-10">
      <h2 className="mb-8 text-2xl font-semibold text-blue-400 underline">
        Snake game
      </h2>
      <button
        onClick={() => setIsAutoMove((x) => !x)}
        className="mb-4 px-6 py-1 border border-blue-400 rounded"
      >
        {isAutoMove ? 'click' : 'auto'}
      </button>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex justify-center items-center">
          {Array.from({ length: cols }, (_, colIndex) => {
            const isSnakePart = snake.some(
              (pic) => pic.x === colIndex && pic.y === rowIndex
            );
            const isHead =
              isSnakePart && snake[0].x === colIndex && snake[0].y === rowIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={twMerge(
                  'w-8 h-8 border relative',
                  `${isSnakePart ? 'bg-blue-400 border rounded-full' : 'bg-white'}`
                )}
              >
                {isHead && (
                  <>
                    <div className="absolute w-2 h-2 bg-white rounded-full top-[20%] left-[15%]" />
                    <div className="absolute w-2 h-2 bg-white rounded-full top-[20%] left-[55%]" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {isGameOver && (
        <div className="mt-4 px-6  text-red-400 text-lg">
          Game over! You hit the border 10 times.
        </div>
      )}
    </div>
  );
}