import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoHeadset, IoBook, IoChatbubbles, IoCreate, IoShuffle, IoVolumeHigh, IoStopCircle, IoArrowBack } from 'react-icons/io5';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import VoiceRecorder from '../../components/voice/VoiceRecorder';
import PronunciationFeedback from '../../components/voice/PronunciationFeedback';
import { EXERCISE_TYPES } from '../../utils/constants';
import { getLessonsForTopic } from '../../data/exercises';
import voiceService from '../../services/voiceService';

function getExerciseIcon(type) {
  const icons = {
    listen_repeat: <IoHeadset size={14} />,
    read_aloud: <IoBook size={14} />,
    conversation: <IoChatbubbles size={14} />,
    fill_blank: <IoCreate size={14} />,
    word_match: <IoShuffle size={14} />,
  };
  return icons[type] || null;
}

function getExerciseTypeLabel(type) {
  const labels = {
    listen_repeat: 'Escucha y repite',
    read_aloud: 'Lee en voz alta',
    conversation: 'Conversación',
    fill_blank: 'Completa el espacio',
    word_match: 'Empareja palabras',
  };
  return labels[type] || 'Ejercicio';
}

export default function LessonScreen() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { recordExercise, completeLesson, isLessonCompleted } = useAppContext();

  const lessons = getLessonsForTopic(topicId);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [voiceResult, setVoiceResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  const currentLesson = lessons[currentLessonIdx];
  const currentExercise = currentLesson?.exercises[currentExerciseIdx];
  const totalExercises = currentLesson?.exercises?.length || 0;
  const exerciseProgress = totalExercises > 0 ? (currentExerciseIdx / totalExercises) * 100 : 0;

  if (!lessons.length) {
    return (
      <div className="screen-container center-content">
        <p className="empty-text">No hay lecciones disponibles para este tema aún.</p>
        <Button title="Volver" onPress={() => navigate(-1)} variant="outline" />
      </div>
    );
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    try {
      await voiceService.speakText(currentExercise.phrase);
    } catch (e) {
      console.warn('TTS error:', e);
    }
    setIsSpeaking(false);
  };

  const handleVoiceResult = async (result) => {
    setVoiceResult(result);
    await recordExercise({
      topicId,
      lessonId: currentLesson.id,
      exerciseId: currentExercise.id,
      score: result.score,
      exerciseType: currentExercise.type,
    });
  };

  const handleNext = async () => {
    setVoiceResult(null);
    if (currentExerciseIdx < totalExercises - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
    } else {
      await completeLesson(topicId, currentLesson.id);
      if (currentLessonIdx < lessons.length - 1) {
        const cont = window.confirm('¡Lección completada! 🎉\nGanaste 50 puntos. ¿Continúas con la próxima lección?');
        if (cont) {
          setCurrentLessonIdx((prev) => prev + 1);
          setCurrentExerciseIdx(0);
        } else {
          navigate(-1);
        }
      } else {
        setLessonComplete(true);
      }
    }
  };

  if (lessonComplete) {
    return (
      <div className="screen-container center-content">
        <span className="completed-emoji">🏆</span>
        <h2 className="completed-title">¡Tema Completado!</h2>
        <p className="completed-subtitle">Has completado todas las lecciones de este tema.</p>
        <Button title="Volver a Temas" onPress={() => navigate('/topics')} size="lg" className="btn-full" />
      </div>
    );
  }

  return (
    <div className="screen-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <IoArrowBack size={20} /> Volver
      </button>

      <div className="lesson-nav">
        {lessons.map((lesson, idx) => (
          <button
            key={lesson.id}
            className={`lesson-dot${idx === currentLessonIdx ? ' active' : ''}${isLessonCompleted(topicId, lesson.id) ? ' done' : ''}`}
            onClick={() => { setCurrentLessonIdx(idx); setCurrentExerciseIdx(0); setVoiceResult(null); }}
          >
            {isLessonCompleted(topicId, lesson.id) ? '✓' : idx + 1}
          </button>
        ))}
      </div>

      <h2 className="lesson-title">{currentLesson.title}</h2>

      <div className="exercise-progress">
        <p className="exercise-progress-text">
          Ejercicio {currentExerciseIdx + 1} de {totalExercises}
        </p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${exerciseProgress}%` }} />
        </div>
      </div>

      <Card className="exercise-card">
        <div className="type-badge">
          {getExerciseIcon(currentExercise?.type)}
          <span className="type-text">{getExerciseTypeLabel(currentExercise?.type)}</span>
        </div>

        <p className="exercise-instruction">{currentExercise?.instruction}</p>

        <div className="phrase-box" onClick={handleSpeak} style={{ cursor: 'pointer' }}>
          <span className="phrase-text">{currentExercise?.phrase}</span>
          {isSpeaking ? <IoStopCircle size={24} color="#4A90D9" /> : <IoVolumeHigh size={24} color="#4A90D9" />}
        </div>

        <p className="translation-text">{currentExercise?.translation}</p>
        {currentExercise?.phonetic && (
          <p className="phonetic-text">{currentExercise.phonetic}</p>
        )}
        {currentExercise?.tips && (
          <div className="tips-box">
            <span>💡</span>
            <p className="tips-text">{currentExercise.tips}</p>
          </div>
        )}
      </Card>

      {(currentExercise?.type === EXERCISE_TYPES.LISTEN_REPEAT ||
        currentExercise?.type === EXERCISE_TYPES.READ_ALOUD) && (
        <Card>
          <p className="voice-section-title">Practica tu pronunciación</p>
          <VoiceRecorder expectedPhrase={currentExercise?.phrase} onResult={handleVoiceResult} />
          {voiceResult && (
            <PronunciationFeedback
              score={voiceResult.score}
              recognizedText={voiceResult.recognizedText}
              expectedPhrase={currentExercise?.phrase}
            />
          )}
        </Card>
      )}

      <Button
        title={
          currentExerciseIdx < totalExercises - 1
            ? 'Siguiente ejercicio →'
            : currentLessonIdx < lessons.length - 1
            ? 'Completar lección ✓'
            : 'Finalizar tema 🏆'
        }
        onPress={handleNext}
        size="lg"
        className="btn-full"
        style={{ marginTop: 16 }}
      />
    </div>
  );
}
