import React from "react";

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-bg">
      <div className="landing-container">
        <h1 className="landing-title">Minesweeper</h1>
        <p className="landing-subtitle">
          Choose a difficulty to start the game:
        </p>
        <div className="landing-buttons">
          <button onClick={() => onStart(10)} className="btn easy-btn">
            Easy
          </button>
          <button onClick={() => onStart(20)} className="btn medium-btn">
            Medium
          </button>
          <button onClick={() => onStart(30)} className="btn hard-btn">
            Hard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
