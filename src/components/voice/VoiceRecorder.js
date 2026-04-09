import React, { useState } from 'react';
import { IoMicOutline, IoStopOutline, IoCheckmarkOutline, IoRefreshOutline } from 'react-icons/io5';
import voiceService from '../../services/voiceService';

const STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  DONE: 'done',
};

export default function VoiceRecorder({ expectedPhrase, onResult, disabled }) {
  const [state, setState] = useState(STATES.IDLE);
  const [recordingObj, setRecordingObj] = useState(null);
  const [result, setResult] = useState(null);

  const handlePress = async () => {
    if (state === STATES.IDLE || state === STATES.DONE) {
      const res = await voiceService.startRecording();
      if (res.success) {
        setState(STATES.RECORDING);
        setRecordingObj(res);
        setResult(null);
      }
    } else if (state === STATES.RECORDING) {
      setState(STATES.PROCESSING);
      const stopRes = await voiceService.stopRecording(recordingObj);
      if (stopRes.success) {
        const recognitionRes = await voiceService.recognizeSpeech(stopRes.uri, expectedPhrase);
        if (recognitionRes.success) {
          const evaluation = voiceService.evaluatePronunciation(
            expectedPhrase,
            recognitionRes.recognizedText
          );
          const finalResult = { ...evaluation, score: recognitionRes.score };
          setResult(finalResult);
          setState(STATES.DONE);
          if (onResult) onResult(finalResult);
        }
      } else {
        setState(STATES.IDLE);
      }
    }
  };

  const handleReset = () => {
    setState(STATES.IDLE);
    setResult(null);
    setRecordingObj(null);
  };

  const getIcon = () => {
    if (state === STATES.RECORDING) return <IoStopOutline size={32} />;
    if (state === STATES.PROCESSING) return <span className="spinner spinner-white" />;
    if (state === STATES.DONE) return <IoCheckmarkOutline size={32} />;
    return <IoMicOutline size={32} />;
  };

  const getLabel = () => {
    if (state === STATES.RECORDING) return 'Detener grabación';
    if (state === STATES.PROCESSING) return 'Analizando...';
    if (state === STATES.DONE) return '¡Grabación procesada!';
    return 'Presiona para hablar';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#27AE60';
    if (score >= 70) return '#F39C12';
    return '#E74C3C';
  };

  const btnClass = `voice-btn ${state === STATES.RECORDING ? 'recording' : ''} ${state === STATES.DONE ? 'done' : ''} ${state === STATES.PROCESSING ? 'processing' : ''}`;

  return (
    <div className="voice-recorder">
      <button
        className={btnClass}
        onClick={handlePress}
        disabled={disabled || state === STATES.PROCESSING}
      >
        {getIcon()}
      </button>

      <p className="voice-label">{getLabel()}</p>

      {result && (
        <div className="voice-result" style={{ borderColor: getScoreColor(result.score) }}>
          <p className="voice-result-label">Reconocido:</p>
          <p className="voice-result-text">"{result.recognizedText}"</p>
          <p className="voice-result-score" style={{ color: getScoreColor(result.score) }}>
            Puntuación: {result.score}%
          </p>
          <button className="voice-retry-btn" onClick={handleReset}>
            <IoRefreshOutline size={14} />
            <span>Intentar de nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
}
