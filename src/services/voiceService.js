import { calculateSimilarity } from '../utils/helpers';

async function speakText(text, options = {}) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve({ success: false, error: 'Speech synthesis not supported' });
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || 'en-US';
    utterance.rate = options.rate !== undefined ? options.rate : 0.85;
    utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
    utterance.onend = () => resolve({ success: true });
    utterance.onerror = () => resolve({ success: false });
    window.speechSynthesis.speak(utterance);
  });
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function isSpeaking() {
  return window.speechSynthesis ? window.speechSynthesis.speaking : false;
}

async function startRecording() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, error: 'Grabación de audio no soportada en este navegador.' };
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.start();
    return { success: true, stream, mediaRecorder, chunks };
  } catch (error) {
    console.error('Start recording error:', error);
    return { success: false, error: 'No se pudo iniciar la grabación.' };
  }
}

async function stopRecording(recordingObj) {
  try {
    const { mediaRecorder, stream } = recordingObj;
    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        resolve({ success: true, uri: null });
      };
      mediaRecorder.stop();
    });
  } catch (error) {
    console.error('Stop recording error:', error);
    return { success: false, error: 'Error al detener la grabación.' };
  }
}

async function recognizeSpeech(audioUri, expectedPhrase) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const simulationScore = Math.floor(Math.random() * 40) + 60;
  const words = expectedPhrase.split(' ');
  const recognizedWords = words.filter(() => Math.random() > 0.15);
  const recognizedText = recognizedWords.join(' ');
  return {
    success: true,
    recognizedText,
    confidence: simulationScore / 100,
    score: simulationScore,
  };
}

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
