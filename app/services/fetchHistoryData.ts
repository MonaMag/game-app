import { Position } from '../games/snake-game';

export const fetchHistoryData = async (): Promise<Position[]> => {
  const response = await fetch('/api/history');
  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }
  throw new Error('Invalid data format');
};
