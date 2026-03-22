import { Kind, Suit } from "@/components/Card";
import { useReducer } from "react";

import type { CardType } from "@/components/Card";

enum GamePhase {
  PlayerTurn,
  Animation,
  DrawCards,
  GameOver,
}

type GameState = {
  playerHand: CardType[];
  enemyHand: CardType;
  remainingDeck: CardType[];
} & (
  | { phase: GamePhase.PlayerTurn }
  | {
      phase: GamePhase.Animation;
      playedHand: { main: CardType; modifiers: CardType[] };
      mainValue: number;
      cardsToAdd: CardType[];
      drawNextRound: number;
      captureEnemyCard: boolean;
    }
  | {
      phase: GamePhase.DrawCards;
      cardsToDraw: number;
      capturedCard: CardType | null;
    }
);

enum GameActionType {
  UseCard,
  NextPhase,
}

type GameAction =
  | { type: GameActionType.UseCard; idxs: number[] }
  | { type: GameActionType.NextPhase };

const PLAYER_INITIAL_HAND_SIZE = 5;
const KIND2NUMBER: Record<Kind, number> = {
  [Kind.Ace]: 1,
  [Kind.Two]: 2,
  [Kind.Three]: 3,
  [Kind.Four]: 4,
  [Kind.Five]: 5,
  [Kind.Six]: 6,
  [Kind.Seven]: 7,
  [Kind.Eight]: 8,
  [Kind.Nine]: 9,
  [Kind.Ten]: 10,
  [Kind.Jack]: 11,
  [Kind.Queen]: 12,
  [Kind.King]: 13,
};

const suits = Object.values(Suit);
const kinds = Object.values(Kind).slice(9, 22);
const allCards: CardType[] = (() => {
  return suits.flatMap((suit) =>
    kinds.map((kind) => ({ suit, kind }) as CardType),
  );
})();

const initGameState = (): GameState => {
  const shuffledDeck = allCards.sort(() => Math.random() - 0.5);
  return {
    phase: GamePhase.PlayerTurn,
    playerHand: shuffledDeck.slice(0, PLAYER_INITIAL_HAND_SIZE),
    enemyHand: shuffledDeck[PLAYER_INITIAL_HAND_SIZE]!,
    remainingDeck: shuffledDeck.slice(PLAYER_INITIAL_HAND_SIZE + 1),
  };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (state.phase) {
    case GamePhase.PlayerTurn:
      switch (action.type) {
        case GameActionType.UseCard:
          const newPlayerHand = state.playerHand.filter(
            (_, idx) => !action.idxs.includes(idx),
          );
          const [main, ...modifiers] = action.idxs.map(
            (idx) => state.playerHand[idx]!,
          );
          if (!main) throw new Error("Invalid card index");

          return {
            ...state,
            playerHand: newPlayerHand,
            phase: GamePhase.Animation,
            playedHand: { main, modifiers },
            mainValue: KIND2NUMBER[main.kind],
            cardsToAdd: [],
            drawNextRound: 1,
            captureEnemyCard: false,
          };
        default:
          throw new Error("Invalid action type");
      }
    case GamePhase.Animation:
      state.playerHand.push(...state.cardsToAdd);

      switch (action.type) {
        case GameActionType.NextPhase:
          const modifer = state.playedHand.modifiers.pop();
          if (!modifer) throw new Error("No more modifiers");
          let mainValue = state.mainValue;
          let drawNextRound = state.drawNextRound;
          let captureEnemyCard = state.captureEnemyCard;
          let cardsToAdd: CardType[] = [];

          // prettier-ignore
          switch (modifer.kind) {
            case Kind.Ace: cardsToAdd.push(state.playedHand.main); break;
            case Kind.Two: mainValue *= 2; break;
            case Kind.Three: mainValue += 5; break;
            case Kind.Four: mainValue += 3; cardsToAdd.push(modifer); break;
            case Kind.Five: captureEnemyCard = true; break;
            case Kind.Six: drawNextRound += 1; break;
            case Kind.Seven:
              drawNextRound +=
                Number(state.playerHand.length < PLAYER_INITIAL_HAND_SIZE) + 1;
              break;
            default: mainValue += 1;
          }

          if (state.playedHand.modifiers.length !== 0)
            return {
              ...state,
              mainValue,
              drawNextRound,
              captureEnemyCard,
              cardsToAdd,
            };
          else
            return {
              ...state,
              phase: GamePhase.DrawCards,
              cardsToDraw: drawNextRound,
              capturedCard: captureEnemyCard ? state.enemyHand : null,
            };
        default:
          throw new Error("Invalid action type");
      }
    case GamePhase.DrawCards:
      const playerHand = [...state.playerHand];
      playerHand.push(...state.remainingDeck.slice(0, state.cardsToDraw));
      playerHand.push(...(state.capturedCard ? [state.capturedCard] : []));
      return {
        ...state,
        phase: GamePhase.PlayerTurn,
        playerHand,
      };
  }
};

const useGameState = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initGameState());
  return { gameState, dispatch };
};

console.log(allCards);

export default useGameState;
