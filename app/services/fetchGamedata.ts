import { GameDataType } from '../snake/SnakeGame';

export const fetchGameData = async (): Promise<GameDataType> => {
  const response = await fetch('/api');

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  if (data && Array.isArray(data.current) && Array.isArray(data.history)) {
    return data;
  }
  throw new Error('Invalid data format');
};
