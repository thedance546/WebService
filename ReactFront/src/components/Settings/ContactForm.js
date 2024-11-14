// src/components/Settings/ContactForm.js

import React, { useState } from 'react';
import './SettingsCommon.css';
import './ContactForm.css';

const ContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleContactMessageChange = (e) => setContactMessage(e.target.value);

  const handleSend = () => {
    alert(`문의 내용: ${contactMessage}`);
    setContactMessage('');
  };

  return (
    <div>
      <button onClick={toggleOpen}>개발자에게 문의하기</button>
      {isOpen && (
        <div className="content-section">
          <h3>개발자에게 문의</h3>
          <input
            type="text"
            className="input-box"
            placeholder="문의 내용을 입력하세요."
            value={contactMessage}
            onChange={handleContactMessageChange}
          />
          <button onClick={handleSend} className="send-button">보내기</button>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
