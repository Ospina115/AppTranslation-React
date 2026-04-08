import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { calculateSimilarity } from '../utils/helpers';

/**
 * Reproduce un texto en voz alta usando síntesis de voz.
 */
async function speakText(text, options = {}) {
  const defaultOptions = {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.85, // Velocidad ligeramente más lenta para mejor aprendizaje
    ...options,
  };

  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      ...defaultOptions,
      onDone: () => resolve({ success: true }),
      onError: (error) => reject(error),
    });
  });
}

/**
 * Detiene la síntesis de voz en curso.
 */
async function stopSpeaking() {
  await Speech.stop();
}

/**
 * Verifica si actualmente se está reproduciendo audio.
 */
async function isSpeaking() {
  return await Speech.isSpeakingAsync();
}

/**
 * Inicia la grabación de audio del micrófono.
 * Retorna el objeto de grabación para controlarlo externamente.
 */
async function startRecording() {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      return { success: false, error: 'Permiso de micrófono denegado.' };
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();

    return { success: true, recording };
  } catch (error) {
    console.error('Start recording error:', error);
    return { success: false, error: 'No se pudo iniciar la grabación.' };
  }
}

/**
 * Detiene la grabación y devuelve la URI del archivo de audio.
 */
async function stopRecording(recording) {
  try {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    return { success: true, uri };
  } catch (error) {
    console.error('Stop recording error:', error);
    return { success: false, error: 'Error al detener la grabación.' };
  }
}

/**
 * Simula el reconocimiento de voz comparando con el texto esperado.
 *
 * NOTA PARA PRODUCCIÓN: Integrar aquí un API de Speech-to-Text como:
 * - Google Cloud Speech-to-Text
 * - Azure Cognitive Services Speech
 * - OpenAI Whisper API
 *
 * Para el MVP de demostración se usa una simulación.
 */
async function recognizeSpeech(audioUri, expectedPhrase) {
  // Simulación para desarrollo - en producción enviar audioUri al API de STT
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulación: variación aleatoria del resultado para demo
  const simulationScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const words = expectedPhrase.split(' ');
  const recognizedWords = words.filter(() => Math.random() > 0.15);
  const recognizedText = recognizedWords.join(' ');

  return {
    success: true,
    recognizedText,
    confidence: simulationScore / 100,
    score: simulationScore,
    // En producción: score = calculateSimilarity(expectedPhrase, recognizedText)
  };
}

/**
 * Evalúa la pronunciación comparando el texto reconocido con el esperado.
 */
function evaluatePronunciation(expectedPhrase, recognizedText) {
  const score = calculateSimilarity(expectedPhrase, recognizedText);
  return {
    score,
    recognizedText,
    expectedPhrase,
    passed: score >= 50,
  };
}

const voiceService = {
  speakText,
  stopSpeaking,
  isSpeaking,
  startRecording,
  stopRecording,
  recognizeSpeech,
  evaluatePronunciation,
};

export default voiceService;
