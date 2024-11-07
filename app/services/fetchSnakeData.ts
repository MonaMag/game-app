import { Position } from '../games/snake-game';

export const fetchSnakeData = async (): Promise<Position[]> => {
  const response = await fetch('/api');
  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }
  throw new Error('Invalid data format');
};

