import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ boardNumber, xIsNext, squares, onPlay, isActive }) {
  let boardWinner = calculateBoardWinner(squares, boardNumber)
  function handleClick(i) {
    if (!isActive || boardWinner || squares[(boardNumber * 9) + i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i % 9);
  }

  let classNames = "board";
  if (!isActive) {
    classNames = classNames.concat(" inactive");
  }
  let overlayClasses = "board-overlay";
  if (boardWinner) {
    overlayClasses = overlayClasses.concat(" active");
  }

  return (
    <div className={classNames}>
      <div className="board-row">
        <Square value={squares[(boardNumber * 9) + 0]} onSquareClick={() => handleClick((boardNumber * 9) + 0)} />
        <Square value={squares[(boardNumber * 9) + 1]} onSquareClick={() => handleClick((boardNumber * 9) + 1)} />
        <Square value={squares[(boardNumber * 9) + 2]} onSquareClick={() => handleClick((boardNumber * 9) + 2)} />
      </div>
      <div className="board-row">
        <Square value={squares[(boardNumber * 9) + 3]} onSquareClick={() => handleClick((boardNumber * 9) + 3)} />
        <Square value={squares[(boardNumber * 9) + 4]} onSquareClick={() => handleClick((boardNumber * 9) + 4)} />
        <Square value={squares[(boardNumber * 9) + 5]} onSquareClick={() => handleClick((boardNumber * 9) + 5)} />
      </div>
      <div className="board-row">
        <Square value={squares[(boardNumber * 9) + 6]} onSquareClick={() => handleClick((boardNumber * 9) + 6)} />
        <Square value={squares[(boardNumber * 9) + 7]} onSquareClick={() => handleClick((boardNumber * 9) + 7)} />
        <Square value={squares[(boardNumber * 9) + 8]} onSquareClick={() => handleClick((boardNumber * 9) + 8)} />
      </div>
      <div className={overlayClasses}>{boardWinner}</div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(81).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  let [activeBoard, setActiveBoard] = useState(Array(9).fill(true));
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, position) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    let nextActiveBoard = activeBoard.slice().fill(false);
    if (calculateBoardWinner(nextSquares, position)) {
      nextActiveBoard = nextActiveBoard.map((value, index) => {
        return !(calculateBoardWinner(nextSquares, index));
      });
    } else {
      nextActiveBoard[position] = true;
    }
    setActiveBoard(nextActiveBoard);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const winner = calculateOverallWinner(currentSquares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
    activeBoard = Array(9).fill(false);
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game" data-testid="game">
      <div className="status">{status}</div>
      <div className="game-board">
        <div className="game-row">
          <Board boardNumber={0} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[0]}/>
          <Board boardNumber={1} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[1]}/>
          <Board boardNumber={2} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[2]}/>
        </div>
        <div className="game-row">
          <Board boardNumber={3} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[3]}/>
          <Board boardNumber={4} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[4]}/>
          <Board boardNumber={5} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[5]}/>
        </div>
        <div className="game-row">
          <Board boardNumber={6} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[6]}/>
          <Board boardNumber={7} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[7]}/>
          <Board boardNumber={8} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isActive={activeBoard[8]}/>
        </div>
      </div>
    </div>
  );
}

function calculateBoardWinner(squares, boardNumber) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[(boardNumber * 9) + a] && squares[(boardNumber * 9) + a] === squares[(boardNumber * 9) + b] && squares[(boardNumber * 9) + a] === squares[(boardNumber * 9) + c]) {
      return squares[(boardNumber * 9) + a];
    }
  }
  return null;
}

function calculateOverallWinner(squares) {
  let boards = Array(9);
  for (let i = 0; i < 9; i++) {
    boards[i] = calculateBoardWinner(squares, i);
  }
  return calculateBoardWinner(boards, 0);
}