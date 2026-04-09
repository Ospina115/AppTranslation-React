import React from 'react';

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }) {
  const isBot = message.isBot;

  return (
    <div className={`chat-message-row ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="chat-avatar">
          <span>🤖</span>
        </div>
      )}
      <div className={`chat-bubble ${isBot ? 'bot' : 'user'}`}>
        <p className="chat-text">{message.text}</p>
        <span className="chat-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
