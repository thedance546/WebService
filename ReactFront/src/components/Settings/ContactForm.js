// src/components/Settings/ContactForm.js

import React, { useState } from 'react';

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
    <div className="mb-3">
      <button onClick={toggleOpen} className="btn btn-link">
        개발자에게 문의하기
      </button>
      {isOpen && (
        <div className="border rounded p-3 bg-light">
          <h3>개발자에게 문의</h3>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="문의 내용을 입력하세요."
            value={contactMessage}
            onChange={handleContactMessageChange}
          />
          <button onClick={handleSend} className="btn btn-primary w-100">
            보내기
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
