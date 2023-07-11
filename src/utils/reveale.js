const isValidToReveal = (x, y, arr) => {
    if (
        x < 0 ||
        x >= arr.length ||
        y < 0 ||
        y >= arr.length ||
        arr[x][y].revealed
    ) {
        return false;
    }
    return true;
};

const isValidToPush = (x, y, arr) => {
    return isValidToReveal(x, y, arr) && arr[x][y].value === 0;
};

const reveale = (arr, x, y, newSafe) => {
    let show = [];
    show.push(arr[x][y]);

    while (show.length != 0) {
        let top = show.pop();
        let p = top.x;
        let q = top.y;
        if (!top.revealed) {
            newSafe--;
            top.revealed = true;
            top.flagged = false;
        }
        if (top.value != 0) {
            break;
        }

        let delta = [-1, 0, +1];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let row = p + delta[i];
                let col = q + delta[j];
                if (row === p && col === q) continue;
                if (isValidToPush(row, col, arr)) {
                    show.push(arr[row][col]);
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let row = p + delta[i];
                let col = q + delta[j];
                if (row === p && col === q) continue;
                if (isValidToReveal(row, col, arr)) {
                    arr[row][col].revealed = true;
                    newSafe--;
                }
            }
        }
    }
    return { arr, newSafe };
};

export default reveale;
