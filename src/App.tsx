import Card, { Kind, Suit } from "@/components/Card";

import "./index.css";

const App = () => {
  return (
    <div>
      <Card card={{ kind: Kind.Ten, suit: Suit.Spades }} flipped />
    </div>
  );
};

export default App;
