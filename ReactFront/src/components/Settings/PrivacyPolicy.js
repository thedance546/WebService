// src/components/Profile/PrivacyPolicy.js

import React, { useState } from 'react';
import './SettingsCommon.css';

const PrivacyPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleOpen}>개인정보 처리방침 보기</button>
      {isOpen && (
        <div className="content-section scrollable">
          <h3>개인정보 처리방침</h3>
          <p>여기에 개인정보 처리방침 내용이 표시됩니다...</p>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;
