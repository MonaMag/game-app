import { Position } from '../games/snake-game';

export const sendGameData = async (currentSnake: Position[], history: Position[]) => {
  const body = {
    current: currentSnake,
    history: history,
  };
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Failed to send data');
  }
};