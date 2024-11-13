import { MoveCheckerType } from "../types";

export const getRandomMove = (moves: MoveCheckerType[]) => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};