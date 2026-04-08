import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import { COLORS, SPACING, FONTS, RADIUS } from '../../utils/constants';
import aiService from '../../services/aiService';
import voiceService from '../../services/voiceService';

const TOPIC_CONTEXTS = [
  { id: 'general', label: 'General', icon: '💬' },
  { id: 'greetings', label: 'Saludos', icon: '👋' },
  { id: 'food', label: 'Comida', icon: '🍽️' },
  { id: 'travel', label: 'Viajes', icon: '✈️' },
  { id: 'debate', label: 'Debate', icon: '🗣️' },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topicContext, setTopicContext] = useState('general');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Iniciar con mensaje de bienvenida
    const welcome = aiService.getWelcomeMessage(topicContext);
    setMessages([welcome]);
  }, [topicContext]);

  const handleSend = async (text) => {
    const userMsg = aiService.createUserMessage(text);
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const botResponse = await aiService.getChatbotResponse(
        text,
        messages.slice(-6), // Últimos 6 mensajes como contexto
        topicContext
      );
      setMessages((prev) => [...prev, botResponse]);

      // Reproducir respuesta del bot en voz alta
      try {
        // Extraer solo el texto en inglés (antes de los paréntesis)
        const englishText = botResponse.text.split('(')[0].trim();
        await voiceService.speakText(englishText);
      } catch (e) {
        // TTS opcional, no bloquea el flujo
      }
    } catch (error) {
      console.error('Chatbot error:', error);
    }
    setLoading(false);
  };

  const handleTopicChange = (newTopic) => {
    setTopicContext(newTopic);
    // El useEffect se encargará de reiniciar con el mensaje de bienvenida del nuevo tema
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Asistente IA</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>En línea • Inglés</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={scrollToBottom}>
          <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Topic selector */}
      <View style={styles.topicSelector}>
        {TOPIC_CONTEXTS.map((tc) => (
          <TouchableOpacity
            key={tc.id}
            style={[styles.topicChip, topicContext === tc.id && styles.topicChipActive]}
            onPress={() => handleTopicChange(tc.id)}
          >
            <Text style={styles.topicChipIcon}>{tc.icon}</Text>
            <Text style={[styles.topicChipLabel, topicContext === tc.id && styles.topicChipLabelActive]}>
              {tc.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessage message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingIndicator}>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.typingText}>El asistente está escribiendo...</Text>
                </View>
              </View>
            ) : null
          }
        />
        <ChatInput onSend={handleSend} loading={loading} placeholder="Escribe en inglés..." />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  botAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  botAvatarText: { fontSize: 22 },
  headerTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 4 },
  onlineText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  topicSelector: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.xs,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  topicChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  topicChipIcon: { fontSize: 12, marginRight: 3 },
  topicChipLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, fontWeight: '600' },
  topicChipLabelActive: { color: COLORS.primary },
  messageList: { paddingVertical: SPACING.md },
  typingIndicator: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  typingText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginLeft: SPACING.sm },
});
