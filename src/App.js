import { useState } from "react";

function Square({ value, onSquareClick, isWinSquare }) {
  const className = (isWinSquare) ? "square square-win" : "square";

  return (
    <button
      className={className}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ isX, squares, onPlay }) {
  function handleClick(i) {
    // exit if square has value, win condition, or all squares used
    if (squares[i] || calcWinner(squares) || !squares.includes(null)) return;
    // must make an array copy
    const squaresCopy = squares.slice();

    if (isX) {
      squaresCopy[i] = "X";
    } else {
      squaresCopy[i] = "O";
    }

    onPlay(squaresCopy, i);
  }

  const winData = calcWinner(squares);
  let winner = null;
  let winLine = [];
  if (winData && winData.length > 1) {
    winner = winData[0];
    winLine = winData[1];
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.includes(null)) {
    status = "Tie Game";
  } else {
    status = "Next player: " + (isX ? "X" : "O");
  }

  let board = [];
  for (let row = 0; row < 3; row++) {
    let boardRow = [];
    for (let col = 0; col < 3; col++) {
      boardRow.push(<Square
        key={row * 3 + col}
        value={squares[row * 3 + col]}
        onSquareClick={() => handleClick(row * 3 + col)}
        isWinSquare={(winLine.includes(row * 3 + col)) ? true : false}
      />
      );
    }
    board.push(<div key={row} className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <h1>{status}</h1>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState({
    moves: [Array(9).fill(null)],
    moveCoords: [Array(9).fill(null)]
  });
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history.moves[currentMove];
  // const [isX, setIsX] = useState(true);
  const isX = currentMove % 2 === 0;
  const [isSortDesc, setIsSortDesc] = useState(true);
  const coordList = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      coordList.push([row, col]);
    }
  }

  function handlePlay(squaresCopy, i) {
    // setIsX(!isX);
    const nextHistory = [
      ...history.moves.slice(0, currentMove + 1),
      squaresCopy
    ];
    // history.moves[currentMove+1] = nextHistory;
    const nextCoord = [
      ...history.moveCoords.slice(0, currentMove + 1),
      coordList[i]
    ];
    setHistory(prevHistory => ({
      ...prevHistory,
      moves: nextHistory,
      moveCoords: nextCoord
    }));
    // setHistory({...history, history: nextHistory});
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    // setIsX(move % 2 === 0);
  }

  const moves = history.moves.map((squares, move) => {
    let description;
    let difference;
    if (move > 0) {
      description = `Go to move #${move} ${(move % 2 !== 0) ? "X" : "O"} at (${history.moveCoords[move]})`;
    } else {
      description = "Go to game start";
    }
    description = <button onClick={() => jumpTo(move)}>{description}</button>
    if (move == currentMove) {
      description = "You are at move #" + move;
    }
    return (
      <li key={move}>
        {description}
      </li>
    );
  });

  const sortBtnLbl = (isSortDesc) ? "Sort Asc" : "Sort Desc";
  const className = (isSortDesc) ? "history-list" : "history-list history-list-reverse";
  // const flexDirection = (isSortDesc) ? "column" : "columnReverse";

  function toggleSortDirection() {
    setIsSortDesc(!isSortDesc);
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board isX={isX} squares={currentSquares} onPlay={handlePlay} />
        </div>
      </div>
      <div className="game-info">
        <button onClick={toggleSortDirection}>{sortBtnLbl}</button>
        <ol
          className={className}
        >
          {moves}
        </ol>
        {/* <ol
          style={{ display: "flex", flexDirection: flexDirection }}
        >
          {moves}
        </ol> */}
      </div>
    </>
  );
}

function calcWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
    }
  }
  return null;
}