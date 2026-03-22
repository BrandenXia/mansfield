import { useEffect, type FC } from "react";
import type { Translations } from "@/i18n/translations";

const HelpModal: FC<{ onClose: () => void; t: Translations }> = ({
  onClose,
  t,
}) => {
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
          <h2 id="help-title">{t.helpTitle}</h2>
          <button
            className="help-close-btn"
            onClick={onClose}
            aria-label={t.closeHelp}
          >
            ✕
          </button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h3>{t.objectiveTitle}</h3>
            <p>{t.objectiveText}</p>
          </section>

          <section className="help-section">
            <h3>{t.howToPlayTitle}</h3>
            <ol>
              {t.howToPlaySteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="help-section">
            <h3>{t.cardReferenceTitle}</h3>
            <div className="help-table-wrapper">
              <table className="help-table">
                <thead>
                  <tr>
                    <th>{t.cardTableHeaders.card}</th>
                    <th>{t.cardTableHeaders.value}</th>
                    <th>{t.cardTableHeaders.modifierEffect}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.cardDescriptions.map(({ rank, value, modifier }) => (
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
