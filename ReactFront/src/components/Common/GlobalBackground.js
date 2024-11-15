// src/components/Common/GlobalBackground.js
import React from 'react';
import '../../styles/GlobalBackground.css';

const GlobalBackground = ({ title, children, cardStyle = {}, cardClassName = '' }) => {
  return (
    <div className="bg-welcome d-flex flex-column align-items-center min-vh-100">
      {/* 제목 */}
      {title && (
        <div
          className="text-light text-center"
          style={{
            marginTop: '15vh',
            marginBottom: '2vh',
            fontSize: '2rem',
          }}
        >
          {title}
        </div>
      )}
      {/* 박스 */}
      <div
        className={`card p-4 shadow-sm ${cardClassName}`}
        style={{
          maxWidth: '600px',
          width: '85%', // 화면 너비의 85%
          ...cardStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;
