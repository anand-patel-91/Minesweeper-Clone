import React, { useEffect, useState, useRef } from "react";
import CreateBoard from "../utils/CreateBoard";
import Cell from "./Cell";
import reveale from "../utils/reveale";

const Board = ({ mineCount, onGameOver, onWin }) => {
  const BoardSize = 10; // This stays fixed unless you want to make board size dynamic
  const mines = mineCount;

  const clickSound = new Audio("/audio/mine.mp3");
  const flagSound = new Audio("/audio/flag.mp3");
  const explosionSound = new Audio("/audio/bomb.mp3");
  const victorySound = new Audio("/audio/victory.mp3");

  const firstClick = useRef({
    status: true,
    row: -1,
    col: -1,
  });

  const [grid, setGrid] = useState([]);
  const [safe, setSafe] = useState(0);
  const [mineLocation, setMineLocation] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const freshBoard = () => {
    const newBoard = CreateBoard(BoardSize, mines);
    setGrid(newBoard.board);
    setMineLocation(newBoard.mineLocation);
    setSafe(BoardSize * BoardSize - mines);
    setGameOver(false);
    firstClick.current = {
      status: true,
      row: -1,
      col: -1,
    };
  };

  useEffect(() => {
    freshBoard();
  }, []);

  useEffect(() => {
    if (firstClick.current.row !== -1 && firstClick.current.col !== -1) {
      revealCell(firstClick.current.row, firstClick.current.col);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstClick.current]);

  const updateFlag = (e, x, y) => {
    e.preventDefault();
    if (gameOver || !safe || grid[x][y].revealed) {
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (!newGrid[x][y].flagged) {
      flagSound.currentTime = 0;
      flagSound.play();
    }
    newGrid[x][y].flagged = !newGrid[x][y].flagged;
    setGrid(newGrid);
  };

  const revealCell = (x, y) => {
    if (gameOver || !safe || grid[x][y].revealed) {
      return;
    }

    let newGrid = JSON.parse(JSON.stringify(grid));

    if (firstClick.current.status === true && newGrid[x][y].value !== 0) {
      clickSound.currentTime = 0;
      clickSound.play();
      let newBoard = CreateBoard(BoardSize, mines);
      while (newBoard.board[x][y].value !== 0) {
        newBoard = CreateBoard(BoardSize, mines);
      }
      setGrid(newBoard.board);
      setMineLocation(newBoard.mineLocation);

      firstClick.current = {
        status: false,
        row: x,
        col: y,
      };
    } else if (newGrid[x][y].value === -1) {
      // Game Over
      explosionSound.currentTime = 0;
      explosionSound.play();
      onGameOver(); // Replaces alert
      setGameOver(true);
      for (let i = 0; i < mineLocation.length; i++) {
        newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
      }
      setGrid(newGrid);
      firstClick.current = {
        status: false,
        row: -1,
        col: -1,
      };
    } else {
      clickSound.currentTime = 0;
      clickSound.play();
      let revealedBoard = reveale(newGrid, x, y, safe);
      setGrid(revealedBoard.arr);
      setSafe(revealedBoard.newSafe);
      if (!revealedBoard.newSafe) {
        setGameOver(true);
        victorySound.currentTime = 0;
        victorySound.play();
        onWin(); // Replaces alert
      }

      firstClick.current = {
        status: false,
        row: -1,
        col: -1,
      };
    }
  };

  return (
    <div className="parent">
      <h1>Minesweeper</h1>
      <div className="board-par">
        {grid.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((cell, cellIndex) => {
              return (
                <Cell
                  key={cellIndex}
                  details={cell}
                  updateFlag={updateFlag}
                  revealCell={revealCell}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
