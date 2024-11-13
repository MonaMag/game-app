import { Cell } from "../checkers/page";

export const generatePossibleMoves = (
  x: number,
  y: number,
  board: Cell[][],
  moves: { from: { x: number; y: number }; to: { x: number; y: number } }[]
) => {
  const directions = [
    { dx: 1, dy: -1 }, 
    { dx: 1, dy: 1 }, 
  ];

  directions.forEach(({ dx, dy }) => {
    const targetX = x + dx;
    const targetY = y + dy;

    if (targetX >= 0 && targetX < 8 && targetY >= 0 && targetY < 8) {
      const targetCell = board[targetX][targetY];
      if (targetCell.checker === null) {
      
        moves.push({ from: { x, y }, to: { x: targetX, y: targetY } });
      } else if (targetCell.checker === 'white') {
       
        const jumpX = targetX + dx;
        const jumpY = targetY + dy;

        if (
          jumpX >= 0 &&
          jumpX < 8 &&
          jumpY >= 0 &&
          jumpY < 8 &&
          board[jumpX][jumpY].checker === null
        ) {
          moves.push({ from: { x, y }, to: { x: jumpX, y: jumpY } });
        }
      }
    }
  });
};

const findBlackMoves = (board: Cell[][]) => {
  const moves: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }[] = [];

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board[x][y].checker === 'black') {
        generatePossibleMoves(x, y, board, moves);
      }
    }
  }

  return moves;
};

  // choose best move
  const selectBestMove = (
    moves: { from: { x: number; y: number }; to: { x: number; y: number } }[]
  ) => {
    return moves[0];
  };

  const moveBlackChecker = useCallback(() => {
    const newBoard = [...board];
    const blackMoves = findBlackMoves(newBoard);

    if (blackMoves.length > 0) {
      const move = selectBestMove(blackMoves);
      const { from, to } = move;
      const selectedChecker = newBoard[from.x][from.y].checker;

      if (newBoard[to.x][to.y].checker !== null) {
        const jumpX = to.x + (to.x - from.x);
        const jumpY = to.y + (to.y - from.y);
        newBoard[to.x][to.y].checker = null;
        newBoard[jumpX][jumpY].checker = selectedChecker;
      } else {
        newBoard[to.x][to.y].checker = selectedChecker;
      }
      newBoard[from.x][from.y].checker = null;
      setBoard(newBoard);
      setIsWhiteTurn(true);
    }
  }, [board]);


  export const isValidMove1 = (
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    board: Cell[][]
  ) => {
    console.log('isValidMove', x, y, targetX, targetY);
  
    if (targetX < 0 || targetX >= 8 || targetY < 0 || targetY >= 8) {
      return false;
    }
    const dx = Math.abs(targetX - x);
    const dy = Math.abs(targetY - y);
    if (dx !== dy || dx > 1) return false;
  
    const targetCell = board[targetY][targetX];
    const selectedCell = board[y][x];
  
    console.log('targetCell', targetCell);
    console.log('selectedCell', selectedCell);
  
    if (targetCell.checker !== null) {
      const isOpponentChecker =
        (targetCell.checker === 'black' && selectedCell.checker === 'white') ||
        (targetCell.checker === 'white' && selectedCell.checker === 'black');
  
      if (isOpponentChecker) {
        const jumpX = targetX + (targetX - x);
        const jumpY = targetY + (targetY - y);
  
        const isJumpCell =
          jumpX >= 0 &&
          jumpX < 8 &&
          jumpY >= 0 &&
          jumpY < 8 &&
          board[jumpY][jumpX].checker === null;
        return isJumpCell;
      }
  
      return false;
    }
  
    if (selectedCell.checker === 'white' && targetY >= y) {
      return false;
    }
  
    if (selectedCell.checker === 'black' && targetY <= y) {
      return false;
    }
  
    return true;
  };