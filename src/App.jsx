import React, { useState } from "react";
import Board from "./components/Board";
import LandingPage from "./components/LandingPage";
import Modal from "./components/Modal"; // We'll create this next
import "./App.css"; // Ensure the path is correct

function App() {
  const [started, setStarted] = useState(false);
  const [mineCount, setMineCount] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleStart = (mines) => {
    setMineCount(mines);
    setStarted(true);
  };

  const handleGameOver = () => {
    setModalMessage("Game Over!");
    setShowModal(true);
  };

  const handleWin = () => {
    setModalMessage("Congratulations, You Won!");
    setShowModal(true);
  };

  const handleRestart = () => {
    setShowModal(false);
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
      {showModal && <Modal message={modalMessage} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
