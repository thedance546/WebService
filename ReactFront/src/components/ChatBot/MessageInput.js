// src/components/ChatBot/MessageInput.js

import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input) return;
    onSend({ id: Date.now(), text: input, sender: 'user' });
    setInput('');
  };

  return (
    <div className="input-group p-2">
      <input
        type="file"
        className="form-control"
        style={{ maxWidth: '50px' }}
        aria-label="Upload"
      />
      <input
        type="text"
        className="form-control"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button className="btn btn-success" onClick={handleSendMessage}>전송</button>
    </div>
  );
};

export default MessageInput;
