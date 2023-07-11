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

const CreateBoard = (boardSize, bombs) => {
    let board = [];

    let mineLocation = [];

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
        }
        board.push(row);
    }

    let bombsCt = bombs;
    while (bombsCt > 0) {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);

        if (board[x][y].value === 0) {
            board[x][y].value = -1;
            mineLocation.push([x, y]);
            bombsCt--;
        }
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
