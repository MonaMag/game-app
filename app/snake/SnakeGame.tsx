'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './Board';
import { useInterval } from '../hooks/useInterval';
import { fetchGameData } from '../services/fetchGamedata';
import { sendGameData } from '../services/updateGameData';


const HIT_COUNT = 10;
const SEND_INTERVAL = 4000;

export type Position = { x: number; y: number };
export type GameDataType = {
  history: Position[];
  current: Position[];
};

export function SnakeGame({
  rows = 8,
  cols = 9,
  snakeLength = 3,
}: {
  rows?: number;
  cols?: number;
  snakeLength?: number;
}) {
  const [snake, setSnake] = useState<Position[]>([]);
  const [isAutoMove, setIsAutoMove] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Position[]>([]);

  const isGameOver = hitCount >= HIT_COUNT;

  const currentPositionRef = useRef<Position>({ x: 0, y: 0 });
  const currentSnakeRef = useRef<Position[]>(snake);
  currentSnakeRef.current = snake;

  const historyRef = useRef(history);
  historyRef.current = history;

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

  // Fetch snake data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGameData();
        if (data.current.length > 0) {
          setSnake(data.current);
          setHistory(data.history);
        } else {
          const initialSnake = initializeSnake(cols, rows, snakeLength);
          setSnake(initialSnake);
          setHistory([]);
        }
      } catch (error) {
        console.log('Error:', error);
        const initialSnake = initializeSnake(cols, rows, snakeLength);
        setSnake(initialSnake);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [snakeLength, cols, rows]);


  // move snake
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
      setHistory((prevHistory) => [...prevHistory, newHead]);

      await sendGameData(newSnake, [...historyRef.current, newHead]);

      return newSnake;
    },
    [cols, rows]
  );

  // Reset game
  const resetGame = async () => {
    setIsAutoMove(false);
    setHitCount(0);
    const initialSnake = initializeSnake(cols, rows, snakeLength);
    setSnake(initialSnake);
    setHistory([]);

    await sendGameData(initialSnake, []);
  };

  // Handle key press events for snake movement
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (isGameOver || isLoading) {
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
            currentSnakeRef.current
          );
          setSnake(newSnake);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAutoMove, moveSnake, isGameOver, isLoading]);

  useInterval(
    () => {
      if (isAutoMove && !isGameOver) {
        moveSnake(currentPositionRef.current, snake);
      }
    },
    isAutoMove && !isGameOver ? SEND_INTERVAL : undefined
  );

  // useInterval(() => {
  //   sendGameData(snake, history);
  // }, HISTORY_SEND_INTERVAL);

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
      <Board
        rows={rows}
        cols={cols}
        snake={snake}
        hitCount={hitCount}
        history={history}
      />
      <button
        onClick={resetGame}
        className='w-40 mt-4 px-4 py-1 border border-blue-400 rounded'
      >
        restart
      </button>

      {isGameOver && (
        <div className='flex flex-col items-center'>
          <div className='mt-4 px-6 text-red-400 text-lg'>
            Game over! You hit the border 10 times.
          </div>
        </div>
      )}
    </div>
  );
}
