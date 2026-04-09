import React, { useState } from 'react';
import { IoSendOutline } from 'react-icons/io5';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-bar">
      <textarea
        className="chat-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe en inglés..."
        disabled={disabled}
        rows={1}
      />
      <button
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Enviar"
      >
        <IoSendOutline size={20} />
      </button>
    </div>
  );
}
