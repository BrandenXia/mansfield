import { useState } from "react";
import Card from "@/components/Card";
import HelpModal from "@/components/HelpModal";
import useGameState, { GamePhase } from "@/hooks/game-state";

import "./index.css";

const App = () => {
  const { gameState, useCard, nextPhase, resetGame } = useGameState();
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const toggleCard = (idx: number) => {
    if (gameState.phase !== GamePhase.PlayerTurn) return;
    setSelectedIdxs((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const playCards = () => {
    if (selectedIdxs.length === 0) return;
    useCard(selectedIdxs);
    setSelectedIdxs([]);
  };

  return (
    <div className="game-board">
      <button
        className="help-btn"
        onClick={() => setShowHelp(true)}
        aria-label="Help"
      >
        ?
      </button>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <section className="enemy-section">
        <h2>Enemy</h2>
        <Card card={gameState.enemyHand} />
      </section>

      <section className="game-info">
        {gameState.phase === GamePhase.PlayerTurn && (
          <>
            <p>
              Select cards to play — first card is your main, rest are
              modifiers.
            </p>
            <p>Deck: {gameState.remainingDeck.length} remaining</p>
            <button
              className="btn"
              disabled={selectedIdxs.length === 0}
              onClick={playCards}
            >
              {selectedIdxs.length === 0
                ? "Select cards to play"
                : `Play (${selectedIdxs.length} card${selectedIdxs.length > 1 ? "s" : ""})`}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.Animation && (
          <>
            <div className="animation-info">
              <span className="value-label">Current Value: </span>
              <span className="value-number">{gameState.mainValue}</span>
            </div>
            <div className="played-cards">
              <div className="played-section">
                <span className="section-label">Main Card</span>
                <Card card={gameState.playedHand.main} />
              </div>
              {gameState.playedHand.modifiers.length > 0 && (
                <div className="played-section">
                  <span className="section-label">
                    Modifiers ({gameState.playedHand.modifiers.length})
                  </span>
                  <div className="card-row">
                    {gameState.playedHand.modifiers.map((card, i) => (
                      <Card
                        key={`${card.kind}-${card.suit}-${i}`}
                        card={card}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="btn" onClick={nextPhase}>
              {gameState.playedHand.modifiers.length > 0
                ? "Apply Next Modifier"
                : "Continue"}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.DrawCards && (
          <>
            <p>
              Draw {gameState.cardsToDraw} card
              {gameState.cardsToDraw !== 1 ? "s" : ""}
            </p>
            {gameState.capturedCard && (
              <div className="captured-card">
                <span className="section-label">Captured!</span>
                <Card card={gameState.capturedCard} />
              </div>
            )}
            <button className="btn" onClick={nextPhase}>
              Draw Cards
            </button>
          </>
        )}

        {gameState.phase === GamePhase.GameOver && (
          <>
            <p>Game Over! Your value wasn&apos;t enough to beat the enemy.</p>
            <button className="btn" onClick={resetGame}>
              Play Again
            </button>
          </>
        )}

        {gameState.phase === GamePhase.Win && (
          <>
            <p>You win! You&apos;ve cleared the entire deck!</p>
            <button className="btn" onClick={resetGame}>
              Play Again
            </button>
          </>
        )}
      </section>

      <section className="player-section">
        <h2>Your Hand ({gameState.playerHand.length})</h2>
        <div className="card-row">
          {gameState.playerHand.map((card, idx) => (
            <div
              key={`${card.kind}-${card.suit}-${idx}`}
              className={[
                "card-wrapper",
                gameState.phase === GamePhase.PlayerTurn ? "clickable" : "",
                selectedIdxs.includes(idx) ? "selected" : "",
              ]
                .join(" ")
                .trim()}
              onClick={() => toggleCard(idx)}
            >
              {selectedIdxs.includes(idx) && (
                <div className="card-badge">
                  {selectedIdxs.indexOf(idx) + 1}
                </div>
              )}
              <Card card={card} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
