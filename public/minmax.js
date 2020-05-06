addEventListener("message", (event) => {
  const { board, symbol, opponentSymbol } = event.data;
  if (isGameOver(board, symbol, opponentSymbol)) {
    postMessage({
      cmd: "gameover",
      data: winner(board, symbol, opponentSymbol),
    });
  } else {
    postMessage({
      cmd: "move",
      data: bestMove(board, symbol, opponentSymbol),
    });
  }
});

// best available move on the board
function bestMove(board, symbol, opponentSymbol) {
  let bestScrore = Number.NEGATIVE_INFINITY;
  let bestIndex = -1;
  let moves = availableMoves(board);
  moves.forEach((move) => {
    board[move] = symbol;
    let score = minmax(board, symbol, opponentSymbol, true);
    if (score > bestScrore) {
      bestScrore = score;
      bestIndex = move;
    }
    board[move] = null;
  });
  return convertBoardIndex(bestIndex);
}

function isGameOver(board, symbol, opponentSymbol) {
  if (availableMoves(board).length === 0) {
    return true;
  } else {
    let boardScore = utility(board, symbol, opponentSymbol);
    if (boardScore == 10 || boardScore == -10) {
      return true;
    }
    return false;
  }
}

function winner(board, symbol, opponentSymbol) {
  let boardScore = utility(board, symbol, opponentSymbol);
  return boardScore === 10 ? symbol : opponentSymbol;
}

function availableMoves(board) {
  let moves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

// 
function minmax(board, symbol, opponentSymbol, maximize = false) {
  if (isGameOver(board, symbol, opponentSymbol)) {
    return utility(board, symbol, opponentSymbol);
  }

  let moves = availableMoves(board);

  if (maximize) {
    let score = Number.NEGATIVE_INFINITY;
    moves.forEach((move) => {
      board[move] = symbol;
      score = Math.max(score, minmax(board, symbol, opponentSymbol, !maximize));
      board[move] = null;
    });
    return score;
  } else {
    let score = Number.POSITIVE_INFINITY;
    moves.forEach((move) => {
      board[move] = opponentSymbol;
      score = Math.min(score, minmax(board, symbol, opponentSymbol, !maximize));
      board[move] = null;
    });
    return score;
  }
}

// Evaluates the value of the tic tac toe board
function utility(board, symbol, opponentSymbol) {
  // Eavalueate row
  for (let i = 0; i < 3; i++) {
    if (
      board[i * 3] === board[i * 3 + 1] &&
      board[i * 3 + 1] === board[i * 3 + 2]
    ) {
      if (board[i * 3] === symbol) {
        return 10;
      } else if (board[i * 3] === opponentSymbol) {
        return -10;
      }
    }
  }

  // Evaluate column
  for (let i = 0; i < 3; i++) {
    if (board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
      if (board[i] === symbol) {
        return 10;
      } else if (board[i] === opponentSymbol) {
        return -10;
      }
    }
  }

  // Evaluate the daigonal
  if (board[0] === board[4] && board[4] === board[8]) {
    if (board[0] === symbol) {
      return 10;
    } else if (board[0] === opponentSymbol) {
      return -10;
    }
  }

  // Evaluate diagonal
  if (board[6] === board[4] && board[4] === board[2]) {
    if (board[6] === symbol) {
      return 10;
    } else if (board[6] === opponentSymbol) {
      return -10;
    }
  }

  return 0;
}

function convertBoardIndex(index) {
  let indexes = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  return indexes[index];
}
