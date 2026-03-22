import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Card from "@/components/Card";
import HelpModal from "@/components/HelpModal";
import useGameState, { GamePhase } from "@/hooks/game-state";
import useLanguage from "@/hooks/use-language";

import "./index.css";

// Duration of the battle shake animation in milliseconds. The phase transition
// fires slightly after the animation completes.
const BATTLE_ANIMATION_MS = 550;
const BATTLE_TRANSITION_DELAY_MS = BATTLE_ANIMATION_MS + 100;

const phaseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const App = () => {
  const { gameState, useCard, nextPhase, resetGame } = useGameState();
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isBattling, setIsBattling] = useState(false);
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

  const handleNextPhase = () => {
    if (
      gameState.phase === GamePhase.Animation &&
      gameState.playedHand.modifiers.length === 0
    ) {
      setIsBattling(true);
      setTimeout(() => {
        setIsBattling(false);
        nextPhase();
      }, BATTLE_TRANSITION_DELAY_MS);
    } else {
      nextPhase();
    }
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
        <motion.div
          key={`enemy-${gameState.enemyHand.kind}-${gameState.enemyHand.suit}`}
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={
            isBattling
              ? { x: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1.08, 1] }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={
            isBattling
              ? { duration: BATTLE_ANIMATION_MS / 1000, ease: "easeInOut" }
              : { type: "spring", stiffness: 220, damping: 22 }
          }
        >
          <Card card={gameState.enemyHand} />
        </motion.div>
      </section>

      <section className="game-info">
        <AnimatePresence mode="wait">
          {gameState.phase === GamePhase.PlayerTurn && (
            <motion.div
              key="player-turn"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="phase-content"
            >
              <p>{t.selectCardsHint}</p>
              <p>{t.deckRemaining(gameState.remainingDeck.length)}</p>
              <motion.button
                className="btn"
                disabled={selectedIdxs.length === 0}
                onClick={playCards}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedIdxs.length === 0
                  ? t.selectCardsToPlay
                  : t.playCards(selectedIdxs.length)}
              </motion.button>
            </motion.div>
          )}

          {gameState.phase === GamePhase.Animation && (
            <motion.div
              key="animation"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="phase-content"
            >
              <div className="animation-info">
                <span className="value-label">{t.currentValue}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={gameState.mainValue}
                    className="value-number"
                    initial={{ scale: 1.5, opacity: 0, y: -12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  >
                    {gameState.mainValue}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="played-cards">
                <div className="played-section">
                  <span className="section-label">{t.mainCard}</span>
                  <motion.div
                    animate={
                      isBattling
                        ? { x: [0, 10, -10, 7, -5, 0], scale: [1, 1.1, 1.1, 1] }
                        : {}
                    }
                    transition={{ duration: BATTLE_ANIMATION_MS / 1000, ease: "easeInOut" }}
                  >
                    <Card card={gameState.playedHand.main} />
                  </motion.div>
                </div>
                {gameState.playedHand.modifiers.length > 0 && (
                  <div className="played-section">
                    <span className="section-label">
                      {t.modifiers(gameState.playedHand.modifiers.length)}
                    </span>
                    <div className="card-row">
                      <AnimatePresence>
                        {gameState.playedHand.modifiers.map((card, i) => (
                          <motion.div
                            key={`mod-${card.kind}-${card.suit}-${i}`}
                            layout
                            initial={{ scale: 0.6, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{
                              scale: 0.5,
                              opacity: 0,
                              y: -30,
                              transition: { duration: 0.28 },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <Card card={card} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
              <motion.button
                className="btn"
                onClick={handleNextPhase}
                disabled={isBattling}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {gameState.playedHand.modifiers.length > 0
                  ? t.applyNextModifier
                  : t.continue}
              </motion.button>
            </motion.div>
          )}

          {gameState.phase === GamePhase.DrawCards && (
            <motion.div
              key="draw-cards"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="phase-content"
            >
              <p>{t.drawCards(gameState.cardsToDraw)}</p>
              {gameState.capturedCard && (
                <motion.div
                  className="captured-card"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <span className="section-label">{t.captured}</span>
                  <Card card={gameState.capturedCard} />
                </motion.div>
              )}
              <motion.button
                className="btn"
                onClick={nextPhase}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.drawCardsBtn}
              </motion.button>
            </motion.div>
          )}

          {gameState.phase === GamePhase.GameOver && (
            <motion.div
              key="game-over"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="phase-content"
            >
              <motion.p
                className="game-over-text"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 14,
                  delay: 0.1,
                }}
              >
                {t.gameOver}
              </motion.p>
              <motion.button
                className="btn"
                onClick={resetGame}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.playAgain}
              </motion.button>
            </motion.div>
          )}

          {gameState.phase === GamePhase.Win && (
            <motion.div
              key="win"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="phase-content"
            >
              <motion.p
                className="win-text"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.25, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              >
                {t.youWin}
              </motion.p>
              <motion.button
                className="btn"
                onClick={resetGame}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.playAgain}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="player-section">
        <h2>{t.yourHand(gameState.playerHand.length)}</h2>
        <div className="card-row">
          <AnimatePresence>
            {gameState.playerHand.map((card, idx) => {
              const isSelected = selectedIdxs.includes(idx);
              const isClickable = gameState.phase === GamePhase.PlayerTurn;
              return (
                <motion.div
                  // Cards use kind+suit as key (unique per standard 52-card deck).
                  // Index-based keys would break AnimatePresence since indices
                  // shift when cards are removed, causing wrong re-animations.
                  key={`${card.kind}-${card.suit}`}
                  className={[
                    "card-wrapper",
                    isClickable ? "clickable" : "",
                    isSelected ? "selected" : "",
                  ]
                    .join(" ")
                    .trim()}
                  initial={{ y: -70, opacity: 0, scale: 0.8 }}
                  animate={{ y: isSelected ? -20 : 0, opacity: 1, scale: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.75 }}
                  transition={{
                    // y responds immediately so card selection lift is instant
                    y: { type: "spring", stiffness: 260, damping: 22 },
                    // opacity/scale use stagger delay only on initial entry
                    opacity: {
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                      delay: idx * 0.05,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                      delay: idx * 0.05,
                    },
                  }}
                  whileHover={
                    isClickable && !isSelected ? { y: -8, scale: 1.03 } : {}
                  }
                  onClick={() => toggleCard(idx)}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="card-badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 18,
                        }}
                      >
                        {selectedIdxs.indexOf(idx) + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Card card={card} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default App;
