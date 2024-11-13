import { Cell, MoveCheckerType } from "../types";
import { getAllBlackCheckersMoves } from "./getAllBlackCheckersMoves";
import { getRandomMove } from "./getRandomMove";

export const chooseRandomMove = (board: Cell[][]): MoveCheckerType => {
  const allMoves = getAllBlackCheckersMoves(board);

  const movesWithoutEat = allMoves.filter((move) => !move.eat);
  const movesWithEat = allMoves.filter((move) => move.eat);

  if (movesWithEat.length > 0) {
    return getRandomMove(movesWithEat);
  }
  return getRandomMove(movesWithoutEat);
};