// src/components/ChatBot/MessageInput.js

import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);

  const handleSendMessage = () => {
    if (!input) return;
    onSend({ id: Date.now(), text: input, sender: 'user' });
    setInput('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSend({ id: Date.now(), text: '이미지가 업로드되었습니다.', sender: 'user', image: imageUrl });
      setImage(imageUrl);
    }
  };

  return (
    <div className="message-input-container">
      <label className="image-upload-button">
        📷
        <input type="file" onChange={handleImageUpload} />
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button onClick={handleSendMessage}>전송</button>
    </div>
  );
};

export default MessageInput;
