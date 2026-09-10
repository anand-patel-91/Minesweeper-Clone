const reveal = (arr, x, y, newSafe) => {
    const queue = [[x, y]];
    const visited = new Set();
    const directions = [-1, 0, 1];

    while (queue.length > 0) {
        const [row, col] = queue.shift();
        const key = `${row},${col}`;

        if (
            row < 0 ||
            row >= arr.length ||
            col < 0 ||
            col >= arr[row].length ||
            visited.has(key) ||
            arr[row][col].revealed ||
            arr[row][col].value === -1
        ) {
            continue;
        }

        visited.add(key);
        arr[row][col].revealed = true;
        arr[row][col].flagged = false;
        newSafe--;

        if (arr[row][col].value !== 0) {
            continue;
        }

        for (const rowOffset of directions) {
            for (const colOffset of directions) {
                if (rowOffset !== 0 || colOffset !== 0) {
                    queue.push([row + rowOffset, col + colOffset]);
                }
            }
        }
    }

    return { arr, newSafe };
};

export default reveal;
