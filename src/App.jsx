import React, { useState } from "react";
import Board from "./components/Board";
import LandingPage from "./components/LandingPage";
import Modal from "./components/Modal"; // We'll create this next
import "./App.css"; // Ensure the path is correct

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

function App() {
  const [started, setStarted] = useState(false);
  const [mineCount, setMineCount] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [finalTime, setFinalTime] = useState(null);

  const handleStart = (mines) => {
    setMineCount(mines);
    setStarted(true);
  };

  const handleGameOver = () => {
    setModalMessage("Game Over!");
    setFinalTime(null);
    setShowModal(true);
  };

  const handleWin = (time) => {
    setModalMessage("Congratulations, You Won!");
    setFinalTime(time);
    setShowModal(true);
  };

  const handleRestart = () => {
    setShowModal(false);
    setFinalTime(null);
    setStarted(false); // Reset the game
  };

  return (
    <div>
      {!started ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <Board
          mineCount={mineCount}
          onGameOver={handleGameOver}
          onWin={handleWin}
        />
      )}
      {showModal && (
        <Modal
          message={modalMessage}
          finalTime={finalTime}
          formatTime={formatTime}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
