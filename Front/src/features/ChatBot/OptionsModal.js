// src/features/ChatBot/OptionsModal.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChatBotStylesConfig.css';

const OptionsModal = ({ isOpen, onClose, options }) => {
  if (!isOpen) return null;

  return (
    <div className="d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-3 p-3 shadow-lg" style={{ width: '320px' }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-center mb-3">옵션 메뉴</h3>
        <div className="d-grid gap-2 grid-columns-3">
          {options.map((option, index) => (
            <button key={index} className="btn btn-light d-flex flex-column align-items-center" onClick={option.action}>
              <div className="option-icon">{option.icon}</div>
              <div className="option-text">{option.label}</div>
            </button>
          ))}
        </div>
        <button className="btn btn-primary mt-3 w-100" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default OptionsModal;
