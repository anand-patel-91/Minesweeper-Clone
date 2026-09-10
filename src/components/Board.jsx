import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import CreateBoard from "../utils/CreateBoard";
import Cell from "./Cell";
import reveal from "../utils/reveal";

const Board = ({ mineCount, onGameOver, onWin, onChangeDifficulty }) => {
  const BoardSize = 10; // This stays fixed unless you want to make board size dynamic
  const mines = mineCount;

  const firstClick = useRef({
    status: true,
    row: -1,
    col: -1,
  });

  const [grid, setGrid] = useState([]);
  const [safe, setSafe] = useState(0);
  const [mineLocation, setMineLocation] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimeRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const sounds = useRef({});

  useEffect(() => {
    sounds.current = {
      click: new Audio("/audio/mine.mp3"),
      flag: new Audio("/audio/flag.mp3"),
      explosion: new Audio("/audio/bomb.mp3"),
      victory: new Audio("/audio/victory.mp3"),
    };

    return () => {
      Object.values(sounds.current).forEach((sound) => sound.pause());
    };
  }, []);

  useEffect(() => {
    if (gameOver) return undefined;

    const updateTimer = () => {
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      elapsedTimeRef.current = currentTime;
      setElapsedTime(currentTime);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 250);

    return () => clearInterval(timerId);
  }, [gameOver]);

  const freshBoard = () => {
    const newBoard = CreateBoard(BoardSize, mines);
    setGrid(newBoard.board);
    setMineLocation(newBoard.mineLocation);
    setSafe(BoardSize * BoardSize - mines);
    setGameOver(false);
    startTimeRef.current = Date.now();
    elapsedTimeRef.current = 0;
    setElapsedTime(0);
    firstClick.current = {
      status: true,
      row: -1,
      col: -1,
    };
  };

  useEffect(() => {
    freshBoard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFlag = (e, x, y) => {
    e.preventDefault();
    if (gameOver || !safe || grid[x][y].revealed) {
      return;
    }
    if (!grid[x][y].flagged) {
      sounds.current.flag.currentTime = 0;
      sounds.current.flag.play();
    }
    setGrid((currentGrid) =>
      currentGrid.map((row, rowIndex) =>
        rowIndex === x
          ? row.map((cell, cellIndex) =>
              cellIndex === y ? { ...cell, flagged: !cell.flagged } : cell,
            )
          : row,
      ),
    );
  };

  const revealCell = (x, y) => {
    if (gameOver || !safe || grid[x][y].revealed) {
      return;
    }

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (firstClick.current.status === true && newGrid[x][y].value !== 0) {
      sounds.current.click.currentTime = 0;
      sounds.current.click.play();
      const protectedCells = [];
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          const protectedRow = x + rowOffset;
          const protectedCol = y + colOffset;
          if (
            protectedRow >= 0 &&
            protectedRow < BoardSize &&
            protectedCol >= 0 &&
            protectedCol < BoardSize
          ) {
            protectedCells.push([protectedRow, protectedCol]);
          }
        }
      }
      const newBoard = CreateBoard(BoardSize, mines, protectedCells);
      setMineLocation(newBoard.mineLocation);
      const revealedBoard = reveal(newBoard.board, x, y, safe);
      setGrid(revealedBoard.arr);
      setSafe(revealedBoard.newSafe);

      firstClick.current = {
        status: false,
        row: -1,
        col: -1,
      };
    } else if (newGrid[x][y].value === -1) {
      // Game Over
      sounds.current.explosion.currentTime = 0;
      sounds.current.explosion.play();
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
      sounds.current.click.currentTime = 0;
      sounds.current.click.play();
      let revealedBoard = reveal(newGrid, x, y, safe);
      setGrid(revealedBoard.arr);
      setSafe(revealedBoard.newSafe);
      if (!revealedBoard.newSafe) {
        setGameOver(true);
        const finalTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );
        elapsedTimeRef.current = finalTime;
        setElapsedTime(finalTime);
        sounds.current.victory.currentTime = 0;
        sounds.current.victory.play();
        onWin(finalTime); // Replaces alert
      }

      firstClick.current = {
        status: false,
        row: -1,
        col: -1,
      };
    }
  };

  const flaggedCount = grid.reduce(
    (count, row) => count + row.filter((cell) => cell.flagged).length,
    0,
  );

  return (
    <div className="parent">
      <div className="game-header">
        <div>
          <p className="eyebrow">Classic puzzle</p>
          <h1>Minesweeper</h1>
        </div>
        <div className="game-stats">
          <div
            className="stat mine-stat"
            aria-label={`${mines - flaggedCount} mines remaining`}
          >
            <span className="timer-label">Mines</span>
            <span className="timer-value">{mines - flaggedCount}</span>
          </div>
          <div className="stats-row">
            <div className="stat" aria-live="polite">
              <span className="timer-label">Time</span>
              <span className="timer-value">
                {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
                {String(elapsedTime % 60).padStart(2, "0")}
              </span>
            </div>
            <button className="reset-button" onClick={freshBoard} type="button">
              Reset
            </button>
          </div>
          <button
            className="difficulty-button"
            onClick={onChangeDifficulty}
            type="button"
          >
            Change difficulty
          </button>
        </div>
      </div>
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

Board.propTypes = {
  mineCount: PropTypes.number.isRequired,
  onChangeDifficulty: PropTypes.func.isRequired,
  onGameOver: PropTypes.func.isRequired,
  onWin: PropTypes.func.isRequired,
};

export default Board;
