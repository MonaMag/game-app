import { Position } from '../snake/SnakeGame';

export const sendSnakeData = async (newSnake: Position[]) => {
  await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSnake),
  });
};
