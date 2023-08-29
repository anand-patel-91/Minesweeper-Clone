import React, { useEffect, useState, useRef } from 'react'
import CreateBoard from '../utils/CreateBoard'
import Cell from './Cell';
import reveale from '../utils/reveale';

const Board = () => {

    let BoardSize = 10;
    let mines = 20;

    const firstClick = useRef({
        status: true,
        row: -1,
        col: -1
    })
    const [grid, setGrid] = useState([])
    const [safe, setSafe] = useState(0)
    const [mineLocation, setMineLocation] = useState([])
    const [gameOver, setGameOver] = useState(false)

    const freshBoard = () => {
        const newBoard = CreateBoard(BoardSize, mines);
        setGrid(newBoard.board);
        setMineLocation(newBoard.mineLocation)
        setSafe(BoardSize * BoardSize - mines)
        setGameOver(false)
        firstClick.current = {
            status: true,
            row: -1,
            col: -1
        }
    }

    useEffect(() => {
        freshBoard()
    }, [])

    useEffect(() => {
        if (firstClick.current.row != -1 && firstClick.current.col != -1) {
            revealCell(firstClick.current.row, firstClick.current.col)
        }
    }, [firstClick.current])

    const updateFlag = (e, x, y) => {
        e.preventDefault()
        if (gameOver || !safe || grid[x][y].revealed) {
            return;
        }
        let newGrid = JSON.parse(JSON.stringify(grid))
        newGrid[x][y].flagged = !newGrid[x][y].flagged
        setGrid(newGrid)
    }

    const revealCell = (x, y) => {
        if (gameOver || !safe || grid[x][y].revealed) {
            return;
        }

        let newGrid = JSON.parse(JSON.stringify(grid))
        if (firstClick.current.status === true && newGrid[x][y].value != 0) {
            let newBoard = CreateBoard(BoardSize, mines)
            while (newBoard.board[x][y].value != 0) {
                newBoard = CreateBoard(BoardSize, mines)
            }
            setGrid(newBoard.board);
            setMineLocation(newBoard.mineLocation)

            firstClick.current = {
                status: false,
                row: x,
                col: y
            }
        }

        else if (newGrid[x][y].value === -1) {
            alert("Game Over")
            setGameOver(true)
            for (let i = 0; i < mineLocation.length; i++) {
                newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true
            }
            setGrid(newGrid)
            firstClick.current = {
                status: false,
                row: -1,
                col: -1
            }
        }
        else {
            let revealedBoard = reveale(newGrid, x, y, safe)
            setGrid(revealedBoard.arr)
            setSafe(revealedBoard.newSafe)
            if (!revealedBoard.newSafe) {
                setGameOver(true)
                alert("Congrats you win!")
            }
            firstClick.current = {
                status: false,
                row: -1,
                col: -1
            }
        }
    }

    return (
        <div className='parent'>
            <h1>Minesweeper</h1>
            <div className='board-par'>
                {grid.map(row => {
                    return (
                        <div className='board-row'>
                            {row.map(cell => {
                                return (
                                    <Cell details={cell} updateFlag={updateFlag} revealCell={revealCell} />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <button onClick={freshBoard} >{(gameOver || !safe) ? "Play Again" : "Reset"}</button>
        </div>
    )
}

export default Board
