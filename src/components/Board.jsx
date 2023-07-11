import React, { useEffect, useState } from 'react'
import CreateBoard from '../utils/CreateBoard'
import Cell from './Cell';
import reveale from '../utils/reveale';

const Board = () => {

    let BoardSize = 5;
    let mines = 1;

    const [grid, setGrid] = useState([])
    const [safe, setSafe] = useState(0)
    const [mineLocation, setMineLocation] = useState([])
    const [gameOver, setGameOver] = useState(false)

    const freshBoard = () => {
        const newBoard = CreateBoard(BoardSize, mines);
        setGrid(newBoard.board); BoardSize
        setMineLocation(newBoard.mineLocation)
        setSafe(BoardSize * BoardSize - mines)
        setGameOver(false)
    }

    useEffect(() => {
        return freshBoard();
    }, []);

    const updateFlag = (e, x, y) => {
        e.preventDefault()
        let newGrid = JSON.parse(JSON.stringify(grid))
        newGrid[x][y].flagged = !newGrid[x][y].flagged
        setGrid(newGrid)
    }

    const revealCell = (x, y) => {
        if (gameOver || !safe) {
            return;
        }
        let newGrid = JSON.parse(JSON.stringify(grid))
        if (newGrid[x][y].value === -1) {
            alert("Game Over")
            setGameOver(true)
            for (let i = 0; i < mineLocation.length; i++) {
                newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true
            }
            setGrid(newGrid)
        }
        else {
            let revealedBoard = reveale(newGrid, x, y, safe)
            setGrid(revealedBoard.arr)
            setSafe(revealedBoard.newSafe)
            if (!revealedBoard.newSafe) {
                alert("You Win")
            }
        }
    }

    return (
        <>
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
            {(gameOver || !safe) && <div className='btn'><button onClick={freshBoard} >Play Again</button></div>}
        </>
    )
}

export default Board