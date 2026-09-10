import PropTypes from "prop-types";

const Modal = ({ message, finalTime, formatTime, onRestart }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        {finalTime !== null && (
          <p className="modal-time">Completed in {formatTime(finalTime)}</p>
        )}
        <button onClick={onRestart} className="modal-close-button">
          Restart
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  finalTime: PropTypes.number,
  formatTime: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default Modal;
