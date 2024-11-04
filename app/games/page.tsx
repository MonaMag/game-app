'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './Board';

const TIME_TO_MOVE = 200;

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

  const isGameOver = hitCount >= 10;

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
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSnake(data);
      } else {
        setSnake(initializeSnake(cols, rows, snakeLength));
      }
    };
    fetchData();
  }, [snakeLength, cols, rows]);

  useEffect(() => {
    setSnake(initializeSnake(cols, rows, snakeLength));
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

      await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snake: newSnake }),
      });

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
    if (isAutoMove) {
      const interval = setInterval(
        () => moveSnake(currentPositionRef.current, currentSnake.current),
        TIME_TO_MOVE
      );
      return () => clearInterval(interval);
    }
  }, [isAutoMove, moveSnake]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (hitCount >= 10) {
        return;
      }
      console.log('handleKeyDown');
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
  }, [isAutoMove, moveSnake, hitCount]);

  console.log('hitCount', hitCount);

  useEffect(() => {
    if (isGameOver) {
      setIsAutoMove(false);
    }
  }, [isGameOver]);

  return (
    <Board
      rows={rows}
      cols={cols}
      snake={snake}
      hitCount={hitCount}
      isGameOver={isGameOver}
      onToggleAutoMove={() => setIsAutoMove((prev) => !prev)}
      onRestart={resetGame}
      isAutoMove={isAutoMove}
    />
  );
}
