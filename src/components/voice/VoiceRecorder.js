import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../../utils/constants';
import voiceService from '../../services/voiceService';

const STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  DONE: 'done',
};

export default function VoiceRecorder({ expectedPhrase, onResult, disabled }) {
  const [state, setState] = useState(STATES.IDLE);
  const [recording, setRecording] = useState(null);
  const [result, setResult] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let animation;
    if (state === STATES.RECORDING) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => animation && animation.stop();
  }, [state, pulseAnim]);

  const handlePress = async () => {
    if (state === STATES.IDLE || state === STATES.DONE) {
      // Iniciar grabación
      const res = await voiceService.startRecording();
      if (res.success) {
        setState(STATES.RECORDING);
        setRecording(res.recording);
        setResult(null);
      }
    } else if (state === STATES.RECORDING) {
      // Detener y procesar
      setState(STATES.PROCESSING);
      const stopRes = await voiceService.stopRecording(recording);
      if (stopRes.success) {
        const recognitionRes = await voiceService.recognizeSpeech(
          stopRes.uri,
          expectedPhrase
        );
        if (recognitionRes.success) {
          const evaluation = voiceService.evaluatePronunciation(
            expectedPhrase,
            recognitionRes.recognizedText
          );
          setResult({ ...evaluation, score: recognitionRes.score });
          setState(STATES.DONE);
          onResult && onResult({ ...evaluation, score: recognitionRes.score });
        }
      } else {
        setState(STATES.IDLE);
      }
    }
  };

  const handleReset = () => {
    setState(STATES.IDLE);
    setResult(null);
    setRecording(null);
  };

  const getButtonColor = () => {
    if (state === STATES.RECORDING) return COLORS.error;
    if (state === STATES.PROCESSING) return COLORS.warning;
    if (state === STATES.DONE) return COLORS.success;
    return COLORS.primary;
  };

  const getIcon = () => {
    if (state === STATES.RECORDING) return 'stop';
    if (state === STATES.PROCESSING) return 'hourglass';
    if (state === STATES.DONE) return 'checkmark';
    return 'mic';
  };

  const getLabel = () => {
    if (state === STATES.RECORDING) return 'Detener grabación';
    if (state === STATES.PROCESSING) return 'Analizando...';
    if (state === STATES.DONE) return '¡Grabación procesada!';
    return 'Presiona para hablar';
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getButtonColor() },
            disabled && styles.disabled,
          ]}
          onPress={handlePress}
          disabled={disabled || state === STATES.PROCESSING}
          activeOpacity={0.8}
        >
          <Ionicons name={getIcon()} size={32} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.label}>{getLabel()}</Text>

      {result && (
        <View style={[styles.resultBox, { borderColor: getScoreColor(result.score) }]}>
          <Text style={styles.recognizedLabel}>Reconocido:</Text>
          <Text style={styles.recognizedText}>"{result.recognizedText}"</Text>
          <Text style={[styles.scoreText, { color: getScoreColor(result.score) }]}>
            Puntuación: {result.score}%
          </Text>
          <TouchableOpacity onPress={handleReset} style={styles.retryBtn}>
            <Ionicons name="refresh" size={14} color={COLORS.primary} />
            <Text style={styles.retryText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function getScoreColor(score) {
  if (score >= 90) return COLORS.success;
  if (score >= 70) return COLORS.warning;
  return COLORS.error;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    marginTop: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  resultBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    backgroundColor: COLORS.white,
    width: '100%',
    alignItems: 'center',
  },
  recognizedLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  recognizedText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    marginLeft: 4,
    fontWeight: '600',
  },
});
