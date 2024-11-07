import { Position } from '../games/snake-game';

export const sendSnakeData = async (newSnake: Position[]) => {
  await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ snake: newSnake }),
  });
};
