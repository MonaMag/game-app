import { Position } from "../games/snake-game";

export const sendHistoryData = async (newHistory: Position[]) => {
  await fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newHistory),
  });
};