import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import VoiceRecorder from '../../components/voice/VoiceRecorder';
import PronunciationFeedback from '../../components/voice/PronunciationFeedback';
import { COLORS, SPACING, FONTS, RADIUS, EXERCISE_TYPES } from '../../utils/constants';
import { getLessonsForTopic } from '../../data/exercises';
import voiceService from '../../services/voiceService';

export default function LessonScreen({ route, navigation }) {
  const { topicId, topicTitle } = route.params || {};
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
  const exerciseProgress = totalExercises > 0 ? ((currentExerciseIdx) / totalExercises) * 100 : 0;

  if (!lessons.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay lecciones disponibles para este tema aún.</Text>
          <Button title="Volver" onPress={() => navigation.goBack()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      await voiceService.stopSpeaking();
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
      // Lección completada
      await completeLesson(topicId, currentLesson.id);
      if (currentLessonIdx < lessons.length - 1) {
        Alert.alert(
          '¡Lección completada! 🎉',
          `Ganaste 50 puntos. ¿Continúas con la próxima lección?`,
          [
            { text: 'Descansar', style: 'cancel', onPress: () => navigation.goBack() },
            {
              text: 'Continuar',
              onPress: () => {
                setCurrentLessonIdx((prev) => prev + 1);
                setCurrentExerciseIdx(0);
              },
            },
          ]
        );
      } else {
        setLessonComplete(true);
      }
    }
  };

  if (lessonComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🏆</Text>
          <Text style={styles.completedTitle}>¡Tema Completado!</Text>
          <Text style={styles.completedSubtitle}>
            Has completado todas las lecciones de {topicTitle}.
          </Text>
          <Button
            title="Volver a Temas"
            onPress={() => navigation.goBack()}
            size="lg"
            style={styles.backBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Lesson navigation */}
        <View style={styles.lessonNav}>
          {lessons.map((lesson, idx) => (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonDot,
                idx === currentLessonIdx && styles.lessonDotActive,
                isLessonCompleted(topicId, lesson.id) && styles.lessonDotDone,
              ]}
              onPress={() => {
                setCurrentLessonIdx(idx);
                setCurrentExerciseIdx(0);
                setVoiceResult(null);
              }}
            >
              {isLessonCompleted(topicId, lesson.id) ? (
                <Ionicons name="checkmark" size={12} color={COLORS.white} />
              ) : (
                <Text style={[styles.lessonDotText, idx === currentLessonIdx && styles.lessonDotTextActive]}>
                  {idx + 1}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Lesson title */}
        <Text style={styles.lessonTitle}>{currentLesson.title}</Text>

        {/* Exercise progress */}
        <View style={styles.exerciseProgress}>
          <Text style={styles.exerciseProgressText}>
            Ejercicio {currentExerciseIdx + 1} de {totalExercises}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${exerciseProgress}%` }]} />
          </View>
        </View>

        {/* Exercise Card */}
        <Card style={styles.exerciseCard}>
          {/* Type badge */}
          <View style={styles.typeBadge}>
            <Ionicons name={getExerciseIcon(currentExercise?.type)} size={14} color={COLORS.primary} />
            <Text style={styles.typeText}>{getExerciseTypeLabel(currentExercise?.type)}</Text>
          </View>

          <Text style={styles.instruction}>{currentExercise?.instruction}</Text>

          {/* Main phrase */}
          <TouchableOpacity
            style={styles.phraseBox}
            onPress={handleSpeak}
            activeOpacity={0.8}
          >
            <Text style={styles.phrase}>{currentExercise?.phrase}</Text>
            <Ionicons
              name={isSpeaking ? 'stop-circle' : 'volume-high'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <Text style={styles.translation}>{currentExercise?.translation}</Text>

          {currentExercise?.phonetic && (
            <Text style={styles.phonetic}>{currentExercise?.phonetic}</Text>
          )}

          {currentExercise?.tips && (
            <View style={styles.tipsBox}>
              <Ionicons name="bulb-outline" size={14} color={COLORS.warning} />
              <Text style={styles.tipsText}>{currentExercise?.tips}</Text>
            </View>
          )}
        </Card>

        {/* Voice Recorder */}
        {(currentExercise?.type === EXERCISE_TYPES.LISTEN_REPEAT ||
          currentExercise?.type === EXERCISE_TYPES.READ_ALOUD) && (
          <Card>
            <Text style={styles.voiceTitle}>Practica tu pronunciación</Text>
            <VoiceRecorder
              expectedPhrase={currentExercise?.phrase}
              onResult={handleVoiceResult}
            />
            {voiceResult && (
              <PronunciationFeedback
                score={voiceResult.score}
                recognizedText={voiceResult.recognizedText}
                expectedPhrase={currentExercise?.phrase}
              />
            )}
          </Card>
        )}

        {/* Next button */}
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
          style={styles.nextBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function getExerciseIcon(type) {
  const icons = {
    listen_repeat: 'headset',
    read_aloud: 'book',
    conversation: 'chatbubbles',
    fill_blank: 'create',
    word_match: 'shuffle',
  };
  return icons[type] || 'mic';
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  lessonNav: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  lessonDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonDotActive: { backgroundColor: COLORS.primary },
  lessonDotDone: { backgroundColor: COLORS.success },
  lessonDotText: { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.textLight },
  lessonDotTextActive: { color: COLORS.white },
  lessonTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  exerciseProgress: { marginBottom: SPACING.md },
  exerciseProgressText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginBottom: 4, textAlign: 'center' },
  progressTrack: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  exerciseCard: { marginBottom: SPACING.md },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  typeText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600', marginLeft: 4 },
  instruction: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginBottom: SPACING.md },
  phraseBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  phrase: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, flex: 1, marginRight: SPACING.sm },
  translation: { fontSize: FONTS.sizes.md, color: COLORS.textLight, fontStyle: 'italic', marginBottom: SPACING.xs },
  phonetic: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginBottom: SPACING.sm },
  tipsBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, padding: SPACING.sm },
  tipsText: { fontSize: FONTS.sizes.sm, color: COLORS.text, marginLeft: SPACING.xs, flex: 1 },
  voiceTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  nextBtn: { marginTop: SPACING.sm },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textLight, textAlign: 'center', marginBottom: SPACING.lg },
  completedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  completedEmoji: { fontSize: 72, marginBottom: SPACING.lg },
  completedTitle: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  completedSubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xl },
  backBtn: { width: '80%' },
});
