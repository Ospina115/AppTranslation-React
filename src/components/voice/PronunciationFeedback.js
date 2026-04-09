import React from 'react';
import { getPronunciationFeedback } from '../../utils/helpers';

export default function PronunciationFeedback({ score, recognizedText, expectedPhrase }) {
  const feedback = getPronunciationFeedback(score);

  return (
    <div className="pronunciation-feedback">
      <div className="pf-score-row">
        <span className="pf-emoji">{feedback.emoji}</span>
        <div>
          <p className="pf-label" style={{ color: feedback.color }}>{feedback.label}</p>
          <p className="pf-score" style={{ color: feedback.color }}>{score}% de precisión</p>
        </div>
      </div>
      {recognizedText && (
        <div className="pf-detail">
          <p className="pf-detail-label">Lo que dijiste:</p>
          <p className="pf-detail-text italic">"{recognizedText}"</p>
          <p className="pf-detail-label">Frase esperada:</p>
          <p className="pf-detail-text">"{expectedPhrase}"</p>
        </div>
      )}
    </div>
  );
}
