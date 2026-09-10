import React from "react";

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

export default Modal;
