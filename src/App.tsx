import { useState } from "react";
import Card from "@/components/Card";
import HelpModal from "@/components/HelpModal";
import useGameState, { GamePhase } from "@/hooks/game-state";
import useLanguage from "@/hooks/use-language";

import "./index.css";

const App = () => {
  const { gameState, useCard, nextPhase, resetGame } = useGameState();
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const t = useLanguage();

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
        aria-label={t.help}
      >
        ?
      </button>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} t={t} />}

      <section className="enemy-section">
        <h2>{t.enemy}</h2>
        <Card card={gameState.enemyHand} />
      </section>

      <section className="game-info">
        {gameState.phase === GamePhase.PlayerTurn && (
          <>
            <p>{t.selectCardsHint}</p>
            <p>{t.deckRemaining(gameState.remainingDeck.length)}</p>
            <button
              className="btn"
              disabled={selectedIdxs.length === 0}
              onClick={playCards}
            >
              {selectedIdxs.length === 0
                ? t.selectCardsToPlay
                : t.playCards(selectedIdxs.length)}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.Animation && (
          <>
            <div className="animation-info">
              <span className="value-label">{t.currentValue}</span>
              <span className="value-number">{gameState.mainValue}</span>
            </div>
            <div className="played-cards">
              <div className="played-section">
                <span className="section-label">{t.mainCard}</span>
                <Card card={gameState.playedHand.main} />
              </div>
              {gameState.playedHand.modifiers.length > 0 && (
                <div className="played-section">
                  <span className="section-label">
                    {t.modifiers(gameState.playedHand.modifiers.length)}
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
                ? t.applyNextModifier
                : t.continue}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.DrawCards && (
          <>
            <p>{t.drawCards(gameState.cardsToDraw)}</p>
            {gameState.capturedCard && (
              <div className="captured-card">
                <span className="section-label">{t.captured}</span>
                <Card card={gameState.capturedCard} />
              </div>
            )}
            <button className="btn" onClick={nextPhase}>
              {t.drawCardsBtn}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.GameOver && (
          <>
            <p>{t.gameOver}</p>
            <button className="btn" onClick={resetGame}>
              {t.playAgain}
            </button>
          </>
        )}

        {gameState.phase === GamePhase.Win && (
          <>
            <p>{t.youWin}</p>
            <button className="btn" onClick={resetGame}>
              {t.playAgain}
            </button>
          </>
        )}
      </section>

      <section className="player-section">
        <h2>{t.yourHand(gameState.playerHand.length)}</h2>
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
