// src/components/Settings/TeamInfo.js
import React, { useState } from 'react';

const TeamInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="mb-3">
      <button onClick={toggleOpen} className="btn btn-link">
        개발팀 정보 보기
      </button>
      {isOpen && (
        <div className="border rounded p-3 bg-light">
          <h3>개발팀 정보</h3>
          <p>이름: 홍길동</p>
          <p>이메일: devteam@example.com</p>
        </div>
      )}
    </div>
  );
};

export default TeamInfo;
