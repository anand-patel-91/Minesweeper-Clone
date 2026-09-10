const isValid = (x, y, boardSize, board) => {
    if (
        x < 0 ||
        x >= boardSize ||
        y < 0 ||
        y >= boardSize ||
        board[x][y].value === -1
    ) {
        return false;
    }
    return true;
};

const CreateBoard = (boardSize, bombs, excludedCells = []) => {
    let board = [];

    let mineLocation = [];
    const excluded = new Set(
        excludedCells.map(([x, y]) => `${x},${y}`)
    );
    const availableCells = [];

    for (let x = 0; x < boardSize; x++) {
        let row = [];
        for (let y = 0; y < boardSize; y++) {
            row.push({
                value: 0,
                revealed: false,
                x: x,
                y: y,
                flagged: false,
            });
            if (!excluded.has(`${x},${y}`)) {
                availableCells.push([x, y]);
            }
        }
        board.push(row);
    }

    for (let index = 0; index < bombs; index++) {
        const randomIndex = Math.floor(
            Math.random() * (availableCells.length - index)
        );
        const selectedIndex = availableCells.length - index - 1;
        const [x, y] = availableCells[randomIndex];

        availableCells[randomIndex] = availableCells[selectedIndex];
        availableCells[selectedIndex] = [x, y];
        board[x][y].value = -1;
        mineLocation.push([x, y]);
    }

    let delta = [-1, 0, +1];

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if (board[x][y].value === -1) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row = x + delta[i];
                        let col = y + delta[j];
                        if (row === x && col === y) continue;
                        if (isValid(row, col, boardSize, board)) {
                            board[row][col].value++;
                        }
                    }
                }
            }
        }
    }

    return { board, mineLocation };
};

export default CreateBoard;
