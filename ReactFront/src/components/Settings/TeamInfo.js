// src/components/Profile/TeamInfo.js

import React, { useState } from 'react';
import './SettingsCommon.css';

const TeamInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleOpen}>개발팀 정보 보기</button>
      {isOpen && (
        <div className="content-section no-scroll">
          <h3>개발팀 정보</h3>
          <p>이름: 홍길동</p>
          <p>이메일: devteam@example.com</p>
        </div>
      )}
    </div>
  );
};

export default TeamInfo;
