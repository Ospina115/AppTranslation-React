import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import aiService from '../../services/aiService';

const TOPIC_OPTIONS = [
  { key: 'general', label: '🌐 General' },
  { key: 'greetings', label: '👋 Saludos' },
  { key: 'food', label: '🍕 Comida' },
  { key: 'travel', label: '✈️ Viajes' },
  { key: 'debate', label: '💬 Debate' },
];

export default function ChatbotScreen() {
  const [topicContext, setTopicContext] = useState('general');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const welcome = aiService.getWelcomeMessage(topicContext);
    setMessages([welcome]);
  }, [topicContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = aiService.createUserMessage(text);
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const botResponse = await aiService.getChatbotResponse(text, messages, topicContext);
      setMessages((prev) => [...prev, botResponse]);
    } catch (e) {
      console.error('Chatbot error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-screen">
      <div className="chatbot-header">
        <h2 className="chatbot-title">🤖 Chatbot IA</h2>
        <p className="chatbot-subtitle">Practica inglés con tu asistente</p>
      </div>

      <div className="topic-selector">
        {TOPIC_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={`topic-chip${topicContext === opt.key ? ' active' : ''}`}
            onClick={() => setTopicContext(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="chat-message-row bot">
            <div className="chat-avatar"><span>🤖</span></div>
            <div className="chat-bubble bot typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
