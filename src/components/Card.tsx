import type { FC } from "react";

enum Kind {
  Ace = "Ace",
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack = "Jack",
  Queen = "Queen",
  King = "King",
}

enum Suit {
  Spades = "Spades",
  Hearts = "Hearts",
  Diamonds = "Diamonds",
  Clubs = "Clubs",
}

type CardType = {
  kind: Kind;
  suit: Suit;
};

const Card: FC<{
  card: CardType;
  flipped?: boolean;
}> = ({ card: { kind, suit }, flipped = false }) => {
  return (
    <div className={`card-container ${flipped ? "flipped" : ""}`}>
      <div className="card-inner">
        <div className="card-face card-front">
          <img src={`/public/cards/Suit=${suit},Number=${kind}.svg`}></img>
        </div>
        <div className="card-face card-back">
          <img src={`/public/cards/BackBlue.svg`}></img>
        </div>
      </div>
    </div>
  );
};

export default Card;
export { Kind, Suit };
export type { CardType };
