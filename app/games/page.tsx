'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './Board';

const TIME_TO_MOVE = 200;
const HIT_COUNT = 10;

export type Position = { x: number; y: number };

export default function SnakeGame({
  rows = 8,
  cols = 9,
  snakeLength = 3,
}: {
  rows: number;
  cols: number;
  snakeLength: number;
}) {
  const [snake, setSnake] = useState<Position[]>([]);
  const [isAutoMove, setIsAutoMove] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isGameOver = hitCount >= HIT_COUNT;

  const currentPositionRef = useRef<Position>({ x: 0, y: 0 });
  const currentSnake = useRef<Position[]>(snake);
  currentSnake.current = snake;

  //initializ snake
  const initializeSnake = (
    cols: number,
    rows: number,
    snakeLength: number
  ): Position[] => {
    return Array.from({ length: snakeLength }, (_, index) => ({
      x: Math.floor(cols / 2) - Math.floor(snakeLength / 2) + index,
      y: Math.floor(rows / 2),
    }));
  };

  //fetch position snake data
  const fetchSnakeData = async (): Promise<Position[]> => {
    const response = await fetch('/api');
    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }
    throw new Error('Invalid data format');
  };

  //update position snake data
  const sendSnakeData = async (newSnake: Position[]) => {
    await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ snake: newSnake }),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSnakeData();
        if (data.length > 0) {
          setSnake(data);
        } else {
          setSnake(initializeSnake(cols, rows, snakeLength));
        }
      } catch (error) {
        console.error('Error:', error);
        setSnake(initializeSnake(cols, rows, snakeLength));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [snakeLength, cols, rows]);

  const moveSnake = useCallback(
    async ({ x, y }: Position, currentSnake: Position[]) => {
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

      await sendSnakeData(newSnake);

      return newSnake;
    },
    [cols, rows]
  );

  const resetGame = () => {
    setIsAutoMove(false);
    setHitCount(0);
    setSnake(initializeSnake(cols, rows, snakeLength));
  };

  useEffect(() => {
    if (isAutoMove && !isGameOver) {
      const interval = setInterval(
        () => moveSnake(currentPositionRef.current, currentSnake.current),
        TIME_TO_MOVE
      );
      return () => clearInterval(interval);
    }
  }, [isAutoMove, moveSnake, isGameOver]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (hitCount >= 10 || isLoading) {
        return;
      }
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
          const newSnake = await moveSnake(
            currentPosition,
            currentSnake.current
          );
          setSnake(newSnake);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAutoMove, moveSnake, hitCount, isLoading]);

  console.log('hitCount', hitCount);
  console.log('isGameOver', isGameOver);
  console.log('isAutoMove', isAutoMove);

  useEffect(() => {
    if (isGameOver) {
      setIsAutoMove(false);
    }
  }, [isGameOver]);

  return (
    <div className='flex flex-col w-full items-center p-10'>
      <h2 className='mb-8 text-2xl font-semibold text-blue-400 underline'>
        Snake game
      </h2>

      <button
        onClick={() => setIsAutoMove((prev) => !prev)}
        className='mb-4 px-6 py-1 border border-blue-400 rounded'
      >
        {isAutoMove ? 'click' : 'auto'}
      </button>
      <Board rows={rows} cols={cols} snake={snake} hitCount={hitCount} />

      {isGameOver && (
        <div className='flex flex-col items-center'>
          <div className='mt-4 px-6 text-red-400 text-lg'>
            Game over! You hit the border 10 times.
          </div>
          <button
            onClick={resetGame}
            className='w-40 mt-4 px-4 py-1 border border-blue-400 rounded'
          >
            restart
          </button>
        </div>
      )}
    </div>
  );
}
