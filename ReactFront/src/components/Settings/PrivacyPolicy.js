// src/components/Settings/PrivacyPolicy.js
import React, { useState } from 'react';

const PrivacyPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="mb-3">
      <button onClick={toggleOpen} className="btn btn-link">
        개인정보 처리방침 보기
      </button>
      {isOpen && (
        <div className="border rounded p-3 bg-light">
          <h3>개인정보 처리방침</h3>
          <p>여기에 개인정보 처리방침 내용이 표시됩니다...</p>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;
