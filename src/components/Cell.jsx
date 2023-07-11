import React from 'react'

const Cell = ({ details, updateFlag, revealCell }) => {
    let classNames = ["cell"]

    if (details.revealed) {
        classNames.push("revealed")
    }

    if (details.flagged) {
        classNames.push("flagged")
    }

    if (details.value === -1) {
        classNames.push("bomb")
    }

    return (
        <div className={classNames.join(" ")} onClick={() => { revealCell(details.x, details.y) }} onContextMenu={(e) => updateFlag(e, details.x, details.y)}>
            {(details.revealed && details.value != 0) ? (details.value === -1 ? "💣" : details.value) : ""}
        </div>
    )
}

export default Cell
