import { useEffect, type Dispatch, type SetStateAction } from "react";
import { GamePhase } from "@/hooks/game-state";

type UseKeyboardNavigationProps = {
  gamePhase: GamePhase;
  playerHandLength: number;
  setSelectedIdxs: Dispatch<SetStateAction<number[]>>;
  focusedIdx: number | null;
  setFocusedIdx: Dispatch<SetStateAction<number | null>>;
  playCards: () => void;
  nextPhase: () => void;
  resetGame: () => void;
  toggleHelp: () => void;
};

const useKeyboardNavigation = ({
  gamePhase,
  playerHandLength,
  setSelectedIdxs,
  focusedIdx,
  setFocusedIdx,
  playCards,
  nextPhase,
  resetGame,
  toggleHelp,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "?") {
        e.preventDefault();
        toggleHelp();
        return;
      }

      switch (gamePhase) {
        case GamePhase.PlayerTurn:
          if (
            e.key === "ArrowLeft" ||
            e.key === "h" ||
            e.key === "ArrowRight" ||
            e.key === "l"
          ) {
            e.preventDefault();
            const dir =
              e.key === "ArrowLeft" || e.key === "h" ? -1 : 1;
            setFocusedIdx((prev) => {
              if (playerHandLength === 0) return null;
              if (prev === null) return dir === 1 ? 0 : playerHandLength - 1;
              return (prev + dir + playerHandLength) % playerHandLength;
            });
          } else if (e.key === " " && focusedIdx !== null) {
            e.preventDefault();
            setSelectedIdxs((prev) =>
              prev.includes(focusedIdx)
                ? prev.filter((i) => i !== focusedIdx)
                : [...prev, focusedIdx],
            );
          } else if (e.key === "Enter") {
            e.preventDefault();
            playCards();
          }
          break;

        case GamePhase.Animation:
        case GamePhase.DrawCards:
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            nextPhase();
          }
          break;

        case GamePhase.GameOver:
        case GamePhase.Win:
          if (e.key === "Enter" || e.key === " " || e.key === "r") {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    gamePhase,
    playerHandLength,
    focusedIdx,
    setSelectedIdxs,
    setFocusedIdx,
    playCards,
    nextPhase,
    resetGame,
    toggleHelp,
  ]);
};

export default useKeyboardNavigation;
