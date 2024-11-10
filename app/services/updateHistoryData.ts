import { Position } from '../snake/SnakeGame';

export const sendHistoryData = async (newHistory: Position[]) => {
  await fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newHistory),
  });
};
