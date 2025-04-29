import React from "react";

const Modal = ({ message, onRestart, onChangeDifficulty }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <button onClick={onRestart} className="modal-close-button">
          Restart
        </button>
      </div>
    </div>
  );
};

export default Modal;
