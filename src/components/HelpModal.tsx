import { useEffect, type FC } from "react";

const cardDescriptions: { rank: string; value: string; modifier: string }[] = [
  {
    rank: "Ace",
    value: "1",
    modifier: "Returns the main card to your hand after playing.",
  },
  {
    rank: "2",
    value: "2",
    modifier: "Doubles the main card's value.",
  },
  {
    rank: "3",
    value: "3",
    modifier: "Adds 5 to the main card's value.",
  },
  {
    rank: "4",
    value: "4",
    modifier:
      "Adds 3 to the main card's value and returns itself to your hand.",
  },
  {
    rank: "5",
    value: "5",
    modifier:
      "Captures the enemy card and adds it to your hand if you win the round.",
  },
  {
    rank: "6",
    value: "6",
    modifier: "Draw 1 extra card at the start of the next round.",
  },
  {
    rank: "7",
    value: "7",
    modifier:
      "Draw 2 extra cards at the start of the next round if your current hand has 5 or fewer cards.",
  },
  {
    rank: "8 - King",
    value: "8 - 13",
    modifier: "Adds 1 to the main card's value.",
  },
];

const HelpModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="help-overlay" onClick={onClose}>
      <div
        className="help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-header">
          <h2 id="help-title">How to Play</h2>
          <button
            className="help-close-btn"
            onClick={onClose}
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h3>Objective</h3>
            <p>
              Beat the enemy card by playing a main card with a higher value.
              Use modifier cards to boost your main card's value or gain special
              effects.
            </p>
          </section>

          <section className="help-section">
            <h3>How to Play a Turn</h3>
            <ol>
              <li>Select one or more cards from your hand.</li>
              <li>
                The <strong>first card selected</strong> is your{" "}
                <strong>main card</strong> — its face value must beat the enemy.
              </li>
              <li>
                Any <strong>additional cards</strong> become{" "}
                <strong>modifiers</strong> and are applied in reverse order.
              </li>
              <li>
                If your final value exceeds the enemy's, you win the round!
              </li>
            </ol>
          </section>

          <section className="help-section">
            <h3>Card Reference</h3>
            <div className="help-table-wrapper">
              <table className="help-table">
                <thead>
                  <tr>
                    <th>Card</th>
                    <th>Value</th>
                    <th>Modifier Effect</th>
                  </tr>
                </thead>
                <tbody>
                  {cardDescriptions.map(({ rank, value, modifier }) => (
                    <tr key={rank}>
                      <td className="rank-cell">{rank}</td>
                      <td className="value-cell">{value}</td>
                      <td>{modifier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
