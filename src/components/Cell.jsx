import PropTypes from "prop-types";

const Cell = ({ details, updateFlag, revealCell }) => {
    const classNames = ["cell"];

    if (details.revealed) {
        classNames.push("revealed");
        if (details.value > 0) classNames.push(`number-${details.value}`);
    }

    if (details.flagged) {
        classNames.push("flagged");
    }

    if (details.value === -1) {
        classNames.push("bomb");
    }

    return (
        <div
            className={classNames.join(" ")}
            onClick={() => revealCell(details.x, details.y)}
            onContextMenu={(event) => updateFlag(event, details.x, details.y)}
        >
            {details.revealed && details.value !== 0
                ? details.value === -1 ? "💣" : details.value
                : ""}
        </div>
    );
};

Cell.propTypes = {
    details: PropTypes.shape({
        flagged: PropTypes.bool.isRequired,
        revealed: PropTypes.bool.isRequired,
        value: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    revealCell: PropTypes.func.isRequired,
    updateFlag: PropTypes.func.isRequired,
};

export default Cell;
