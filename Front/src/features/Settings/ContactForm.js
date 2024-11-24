// src/features/Settings/ContactForm.js
import React, { useState } from 'react';

const ContactForm = () => {
  const [contactMessage, setContactMessage] = useState('');

  const handleContactMessageChange = (e) => setContactMessage(e.target.value);

  const handleSend = () => {
    alert(`문의 내용: ${contactMessage}`);
    setContactMessage('');
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingContactForm">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseContactForm"
          aria-expanded="false"
          aria-controls="collapseContactForm"
        >
          개발자에게 문의하기
        </button>
      </h2>
      <div
        id="collapseContactForm"
        className="accordion-collapse collapse"
        aria-labelledby="headingContactForm"
        data-bs-parent="#settingsAccordion"
      >
        <div className="accordion-body">
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
      </div>
    </div>
  );
};

export default ContactForm;
